// Native package documentation verification. Copied unchanged into SDK CI.
// Builds no releases: consumes the artifacts produced by the preceding native gates.
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createServer } from 'node:http';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const requiredDocumentation = ['README.md', 'LICENSE.txt', 'NOTICE.txt', 'docs/usage.md', 'docs/methods.md'];

async function run(executable, args, cwd, env = process.env, allowFailure = false) {
  try {
    const result = await exec(executable, args, { cwd, env, timeout: 300_000, maxBuffer: 20 * 1024 * 1024 });
    return { ...result, status: 0 };
  } catch (error) {
    if (allowFailure && typeof error.code === 'number') {
      return { stdout: error.stdout ?? '', stderr: error.stderr ?? '', status: error.code };
    }
    const detail = String(error.stderr || error.stdout || error.message)
      .split('\n')
      .slice(-25)
      .join('\n');
    throw new Error(`${executable} ${args.join(' ')} failed:\n${detail}`, { cause: error });
  }
}

function checkInventory(files) {
  const normalized = files.map((file) => file.replace(/^\.\//, '').replace(/\/$/, ''));
  for (const file of normalized) {
    assert.ok(
      file && !path.posix.isAbsolute(file) && !file.split('/').includes('..') && !file.includes('\\'),
      `Unsafe archive path: ${file}`,
    );
    assert.ok(
      !/^(?:tests?|examples|vendor|deps|_build|\.github|\.validation[^/]*)(?:\/|$)/.test(file),
      `Package includes non-consumer content: ${file}`,
    );
  }
  for (const required of requiredDocumentation) assert.ok(normalized.includes(required), `Package omits ${required}`);
  return normalized;
}

async function soleArtifact(directory, extension) {
  const files = (await readdir(directory)).filter((name) => name.endsWith(extension));
  assert.equal(files.length, 1, `Expected one ${extension} artifact in ${directory}, found ${files.length}`);
  return path.join(directory, files[0]);
}

async function phpConsumer(directory, temporary) {
  const archive = await soleArtifact(path.join(directory, '.validation-package'), '.zip');
  const inventory = JSON.parse(
    (
      await run(
        'php',
        [
          '-r',
          `
$zip = new ZipArchive();
if ($zip->open($argv[1]) !== true) throw new RuntimeException('Cannot read Composer ZIP');
$files = [];
for ($i = 0; $i < $zip->numFiles; $i++) $files[] = $zip->getNameIndex($i);
echo json_encode($files, JSON_THROW_ON_ERROR);
$zip->close();
`,
          archive,
        ],
        directory,
      )
    ).stdout,
  );
  const files = checkInventory(inventory);
  const extracted = path.join(temporary, 'package');
  const consumer = path.join(temporary, 'consumer');
  await mkdir(extracted);
  await mkdir(consumer);
  await run(
    'php',
    [
      '-r',
      `
$zip = new ZipArchive();
if ($zip->open($argv[1]) !== true || !$zip->extractTo($argv[2])) throw new RuntimeException('Cannot extract Composer ZIP');
$zip->close();
`,
      archive,
      extracted,
    ],
    directory,
  );
  const manifest = JSON.parse(await readFile(path.join(extracted, 'composer.json'), 'utf8'));
  await writeFile(
    path.join(consumer, 'composer.json'),
    JSON.stringify(
      {
        name: 'sellapp/documentation-consumer',
        repositories: [{ type: 'path', url: '../package', options: { symlink: false } }],
        require: { [manifest.name]: '@dev' },
      },
      null,
      2,
    ),
  );
  await run('composer', ['install', '--no-interaction', '--no-progress', '--no-dev'], consumer);
  // Prove the installed library was copied from the archive, not loaded from the source checkout.
  assert.equal(
    await readFile(path.join(consumer, 'vendor', manifest.name, 'lib/Client.php'), 'utf8'),
    await readFile(path.join(extracted, 'lib/Client.php'), 'utf8'),
  );
  console.log(`Composer archive: ${files.length} entries; isolated path installation of ${manifest.name} passed.`);
  const fixture = JSON.parse(
    await readFile(
      path.join(
        directory,
        'tests/Fixtures/list_list_products_response_value_200_application_json_property_data_item.json',
      ),
      'utf8',
    ),
  );
  return { consumer, fixture, extension: 'php', executable: 'php', args: [], env: { ...process.env }, files };
}

async function rubyConsumer(directory, temporary) {
  const archive = await soleArtifact(directory, '.gem');
  const metadata = JSON.parse(
    (
      await run(
        'ruby',
        [
          '-rjson',
          '-rrubygems/package',
          '-e',
          `
package = Gem::Package.new(ARGV.fetch(0))
package.verify
puts JSON.generate({name: package.spec.name, version: package.spec.version.to_s, files: package.contents})
`,
          archive,
        ],
        directory,
      )
    ).stdout,
  );
  const files = checkInventory(metadata.files);
  const gemDirectory = path.join(directory, '.validation-gems');
  const consumer = path.join(temporary, 'consumer');
  await mkdir(consumer);
  const env = { ...process.env, GEM_HOME: gemDirectory, GEM_PATH: gemDirectory };
  const example = await readFile(path.join(directory, 'examples/first-request.rb'), 'utf8');
  const importName = /^require ["']([^"']+)["']/m.exec(example)?.[1];
  assert.ok(importName, 'Ruby example has no public gem import');
  // The native lane installed this actual gem before invoking this check.
  const actualPath = (
    await run(
      'ruby',
      ['-r', importName, '-e', 'puts Gem.loaded_specs.fetch(ARGV.fetch(0)).full_gem_path', metadata.name],
      consumer,
      env,
    )
  ).stdout.trim();
  assert.equal(actualPath, path.join(gemDirectory, 'gems', `${metadata.name}-${metadata.version}`));
  console.log(`Gem archive: ${files.length} entries; public require selects the isolated installed gem.`);
  const product = JSON.parse(await readFile(path.join(directory, 'test/documentation-product.json'), 'utf8'));
  return { consumer, fixture: { data: [product] }, extension: 'rb', executable: 'ruby', args: [], env, files };
}

const hexReader = `
[archive | destination] = System.argv()
{:ok, outer} = :erl_tar.extract(String.to_charlist(archive), [:memory])
{_, contents} = Enum.find(outer, fn {name, _} -> to_string(name) == "contents.tar.gz" end)
case destination do
  [] ->
    {:ok, files} = :erl_tar.table({:binary, contents}, [:compressed])
    Enum.each(files, &IO.puts(to_string(&1)))
  [directory] ->
    :ok = :erl_tar.extract({:binary, contents}, [:compressed, {:cwd, String.to_charlist(directory)}])
end
`;

async function elixirConsumer(directory, temporary) {
  const archive = await soleArtifact(directory, '.tar');
  const result = await run('elixir', ['-e', hexReader, archive], directory);
  const files = checkInventory(result.stdout.trim().split('\n'));
  const extracted = path.join(temporary, 'package');
  const consumer = path.join(temporary, 'consumer');
  await mkdir(extracted);
  await mkdir(consumer);
  await run('elixir', ['-e', hexReader, archive, extracted], directory);
  const mixSource = await readFile(path.join(extracted, 'mix.exs'), 'utf8');
  const app = /\bapp:\s*:([a-z][a-z0-9_]*)/.exec(mixSource)?.[1];
  assert.ok(app, 'Hex package has no declared application');
  await writeFile(
    path.join(consumer, 'mix.exs'),
    `defmodule DocumentationConsumer.MixProject do
  use Mix.Project
  def project, do: [app: :documentation_consumer, version: "0.0.0", deps: [{:${app}, path: "../package"}]]
  def application, do: [extra_applications: [:logger]]
end
`,
  );
  // Reuse the already validated dependency resolution, while compiling a clean consumer.
  await cp(path.join(directory, 'mix.lock'), path.join(consumer, 'mix.lock'));
  const env = { ...process.env, MIX_ENV: 'dev' };
  await run('mix', ['deps.get'], consumer, env);
  await run('mix', ['compile', '--warnings-as-errors'], consumer, env);
  const beam = (
    await run('mix', ['run', '--no-compile', '-e', 'IO.puts(:code.which(SellApp.Client))'], consumer, env)
  ).stdout.trim();
  assert.equal(beam, path.join(consumer, '_build/dev/lib', app, 'ebin/Elixir.SellApp.Client.beam'));
  console.log(`Hex archive: ${files.length} entries; isolated Mix path dependency compiled from the package.`);
  const fixture = JSON.parse(await readFile(path.join(directory, 'test/support/fixtures/products/list.json'), 'utf8'));
  return { consumer, fixture, extension: 'exs', executable: 'mix', args: ['run', '--no-compile'], env, files };
}

/** Verify the real native package and run the exact reader-facing scripts in a clean consumer. */
export async function verifyDocumentationPackage(language, directory = process.cwd()) {
  directory = path.resolve(directory);
  const prepare = { php: phpConsumer, ruby: rubyConsumer, elixir: elixirConsumer }[language];
  assert.ok(prepare, `Unsupported documentation package: ${language}`);
  const temporary = await mkdtemp(path.join(os.tmpdir(), `sellapp-${language}-documentation-package-`));
  let server;
  try {
    const prepared = await prepare(directory, temporary);
    const { consumer, fixture, extension, executable, args } = prepared;
    await cp(path.join(directory, 'examples'), path.join(consumer, 'examples'), { recursive: true });
    const firstSource = await readFile(path.join(consumer, `examples/first-request.${extension}`), 'utf8');
    assert.ok(
      (await readFile(path.join(directory, 'README.md'), 'utf8')).includes(firstSource.trim()),
      'README differs from executable first request',
    );
    assert.ok(fixture.data?.length, 'The canonical mock must contain a real product shape');
    const title = fixture.data[0].title;
    const requests = [];
    const mockFailures = [];
    let mode = 'first';
    let expectedStore = 'docs-store';
    server = createServer((req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('X-Request-ID', 'req-docs-package');
      try {
        const url = new URL(req.url, 'http://127.0.0.1');
        assert.equal(req.method, 'GET');
        assert.equal(url.pathname, '/v2/products');
        assert.equal(req.headers.authorization, 'Bearer docs-dummy');
        assert.equal(req.headers['x-store'], expectedStore);
        const page = Number(url.searchParams.get('page') ?? 1);
        assert.ok(page === 1 || page === 2, `Unexpected page ${page}`);
        requests.push(page);
        if (mode === 'errors') {
          res.writeHead(401);
          res.end(
            JSON.stringify({ type: 'authentication_error', code: 'unauthenticated', message: 'Dummy key rejected' }),
          );
          return;
        }
        const last = mode === 'pagination' ? 2 : 1;
        res.end(
          JSON.stringify({
            data: mode === 'empty' ? [] : [{ ...fixture.data[0], id: page }],
            links: {
              first: '?page=1',
              last: `?page=${last}`,
              prev: page > 1 ? '?page=1' : null,
              next: page < last ? '?page=2' : null,
            },
            meta: {
              current_page: page,
              from: 1,
              last_page: last,
              links: [],
              path: '/v2/products',
              per_page: 20,
              to: 1,
              total: last,
            },
          }),
        );
      } catch (error) {
        mockFailures.push(error.message);
        res.writeHead(400);
        res.end(JSON.stringify({ message: 'Mock rejected unexpected request' }));
      }
    });
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    const env = {
      ...prepared.env,
      SELLAPP_API_KEY: 'docs-dummy',
      SELLAPP_STORE: 'docs-store',
      SELLAPP_API_BASE_URL: `http://127.0.0.1:${server.address().port}`,
    };
    const execute = (name, overrides = env, failure = false) =>
      run(executable, [...args, `examples/${name}.${extension}`], consumer, overrides, failure);
    for (const [scenario, name, expected] of [
      ['first', 'first-request', `1 ${title}`],
      ['empty', 'first-request', 'No products yet'],
      ['pagination', 'pagination', `2 ${title}`],
      ['errors', 'errors', '401 unauthenticated Dummy key rejected req-docs-package'],
    ]) {
      mode = scenario;
      requests.length = 0;
      const result = await execute(name);
      assert.ok(
        (result.stdout + result.stderr).includes(expected),
        `${language} ${scenario}: expected ${expected}; got ${result.stdout}${result.stderr}`,
      );
      assert.deepEqual(requests, scenario === 'pagination' ? [1, 2] : [1]);
      assert.deepEqual(mockFailures, []);
    }
    const previousRequests = requests.length;
    for (const name of ['first-request', 'pagination', 'errors']) {
      for (const value of [undefined, '']) {
        const unconfigured = { ...env };
        if (value === undefined) delete unconfigured.SELLAPP_API_BASE_URL;
        else unconfigured.SELLAPP_API_BASE_URL = value;
        const failure = await execute(name, unconfigured, true);
        assert.notEqual(failure.status, 0, `${name}: missing/empty endpoint must fail`);
        assert.ok((failure.stdout + failure.stderr).includes('SELLAPP_API_BASE_URL'));
      }
    }
    for (const key of ['SELLAPP_API_KEY']) {
      const missingCredential = { ...env, [key]: '' };
      assert.notEqual((await execute('first-request', missingCredential, true)).status, 0, `Missing ${key} must fail`);
    }
    assert.equal(requests.length, previousRequests, 'Unconfigured scripts reached transport');
    assert.deepEqual(mockFailures, []);
    mode = 'first';
    expectedStore = undefined;
    const storeless = await execute('first-request', { ...env, SELLAPP_STORE: '' });
    assert.ok((storeless.stdout + storeless.stderr).includes(`1 ${title}`));
    assert.deepEqual(mockFailures, []);
    console.log(
      `PASS ${language}: package documentation inventory, isolated installation, exact first/empty/pagination/error scripts, and missing/empty configuration guards.`,
    );
    return { language, files: prepared.files, scenarios: ['first', 'empty', 'pagination', 'errors', 'configuration'] };
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
    }
    await rm(temporary, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await verifyDocumentationPackage(process.argv[2], process.argv[3]);
}
