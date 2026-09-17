// Generated native SDK checks. Run from the repository root with Node 24.
// Tests use local fixtures. This script never publishes packages.
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { appendFileSync, copyFileSync, cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const config = {
  "language": "elixir",
  "plan": {
    "tools": [
      [
        "elixir",
        [
          "--version"
        ]
      ],
      [
        "mix",
        [
          "--version"
        ]
      ]
    ],
    "commands": [
      {
        "stage": "install",
        "executable": "mix",
        "args": [
          "deps.get"
        ]
      },
      {
        "stage": "build",
        "executable": "mix",
        "args": [
          "format",
          "--check-formatted"
        ]
      },
      {
        "stage": "build",
        "executable": "mix",
        "args": [
          "compile",
          "--warnings-as-errors"
        ]
      },
      {
        "stage": "test",
        "executable": "mix",
        "args": [
          "test",
          "--no-color"
        ]
      },
      {
        "stage": "documentation",
        "executable": "mix",
        "args": [
          "run",
          "$SDK_ROOT/.github/scripts/validate-elixir-operation-snippets.exs",
          "$SDK_ROOT"
        ]
      },
      {
        "stage": "dependencies",
        "executable": "mix",
        "args": [
          "deps.tree"
        ]
      },
      {
        "stage": "audit",
        "executable": "mix",
        "args": [
          "hex.audit"
        ]
      },
      {
        "stage": "package",
        "executable": "mix",
        "args": [
          "hex.build"
        ]
      },
      {
        "stage": "documentation",
        "executable": "node",
        "args": [
          ".github/scripts/sdk-documentation-packages.mjs",
          "elixir"
        ]
      }
    ]
  },
  "operationDigest": "9f1d49033ff4934acf4a61a0c67a02af88c7b98170d07d31b691d22cbe4ec7c1",
  "commandTimeoutMs": 1200000,
  "probeTimeoutMs": 180000
};
const sourceRoot = process.cwd();
let root = sourceRoot;
let temporaryRoot;
const logs = path.join(process.env.RUNNER_TEMP ?? root, 'sdk-ci-logs');
mkdirSync(logs, { recursive: true });
const expand = (value) => value.replaceAll('$SDK_ROOT', root);
let completed = 0;
let executedTests = 0;
const steps = [];

function saveSummary(status = 'running', error) {
  writeFileSync(path.join(logs, 'summary.json'), JSON.stringify({
    passed: status === 'passed', status, completed, executedTests, steps, error,
  }, null, 2));
}

saveSummary();

function countTests(output) {
  if (config.language === 'go') return output.split('\n').filter((line) => {
    try { const event = JSON.parse(line); return event.Action === 'pass' && typeof event.Test === 'string'; }
    catch { return false; }
  }).length;
  if (config.language === 'kotlin') {
    const files = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const target = path.join(dir, entry.name);
      return entry.isDirectory() ? files(target) : /^TEST-.*\.xml$/.test(entry.name) ? [target] : [];
    });
    return files(path.join(root, 'build/test-results')).reduce((sum, file) =>
      sum + [...readFileSync(file, 'utf8').matchAll(/<testsuite\b[^>]*\btests="(\d+)"/g)].reduce((n, m) => n + Number(m[1]), 0), 0);
  }
  const patterns = {
    node: /(?:# tests\s+|Tests\s+|\btests\s+)(\d+)/g,
    python: /(\d+)\s+passed\b/g,
    php: /^(?:Tests:\s*(\d+),|OK \((\d+) tests?,)/gm,
    dotnet: /(?:Total tests|Total):\s*(\d+)/gi,
    ruby: /(\d+) runs?,/g,
    rust: /test result: .*?\b(\d+) passed\b/g,
    elixir: /(?:(\d+) tests?\b|Result:\s*(\d+)\s+passed\b)/g,
  };
  return [...output.matchAll(patterns[config.language])].reduce((sum, match) => sum + Number(match[1] ?? match[2]), 0);
}

async function run(step, index) {
  const executable = expand(step.executable);
  const args = step.args.map(expand);
  // Direct local runs resolve their first lock inside the disposable consumer.
  // CI supplies a prepared lock and must never silently resolve a different graph.
  if (config.language === 'rust' && executable === 'cargo' && args[0] === 'fetch' && !process.env.SELLAPP_RUST_LOCK_FILE) {
    const locked = args.indexOf('--locked');
    if (locked >= 0) args.splice(locked, 1);
  }
  const env = Object.fromEntries(Object.entries(step.env ?? {}).map(([key, value]) => [key, expand(value)]));
  const command = [executable, ...args].join(' ');
  console.log('[' + step.stage + '] ' + command);
  const filename = String(index).padStart(2, '0') + '-' + step.stage + '.log';
  const logFile = path.join(logs, filename);
  const record = { stage: step.stage, command, status: 'running', log: filename };
  steps.push(record);
  writeFileSync(logFile, '$ ' + command + '\n');
  saveSummary();
  const started = performance.now();
  const result = await new Promise((resolve) => {
    const detached = process.platform !== 'win32';
    const child = spawn(executable, args, {
      cwd: step.cwd ? expand(step.cwd) : root,
      env: { ...process.env, ...env }, detached, stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    let error;
    const stop = (failure) => {
      error = failure;
      try {
        if (detached && child.pid) process.kill(-child.pid, 'SIGKILL');
        else child.kill('SIGKILL');
      } catch (killError) {
        if (killError.code !== 'ESRCH') error = killError;
      }
    };
    const timeout = step.stage === 'preflight' ? config.probeTimeoutMs : config.commandTimeoutMs;
    const timer = setTimeout(() => stop(new Error('Command timed out after ' + timeout + 'ms')), timeout);
    timer.unref();
    const interrupt = () => stop(new Error('Native command interrupted'));
    process.once('SIGTERM', interrupt);
    process.once('SIGINT', interrupt);
    const collect = (chunk) => {
      try {
        appendFileSync(logFile, chunk);
        process.stdout.write(chunk);
        output += chunk;
      } catch (failure) { stop(failure); }
    };
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', collect);
    child.stderr.on('data', collect);
    child.on('error', (failure) => { error = failure; });
    child.on('close', (status, signal) => {
      clearTimeout(timer);
      process.removeListener('SIGTERM', interrupt);
      process.removeListener('SIGINT', interrupt);
      resolve({ status, signal, output, error });
    });
  });
  const output = result.output;
  record.durationMs = Math.round(performance.now() - started);
  record.exit = result.status;
  record.signal = result.signal;
  appendFileSync(logFile, '\nexit: ' + result.status + '\nsignal: ' + result.signal + '\n' + (result.error?.message ?? '') + '\n');
  if (result.error || result.status !== 0) throw new Error(step.stage + ' failed: ' + (result.error?.message ?? result.status));
  if (step.stage === 'audit' && config.language === 'dotnet' && /has the following vulnerable packages/i.test(output)) {
    throw new Error('Vulnerable .NET packages were reported');
  }
  if (step.stage === 'test') {
    const count = countTests(output);
    if (count === 0) throw new Error('Native test command reported zero executed tests');
    record.tests = count;
    executedTests += count;
  }
  record.status = 'passed';
  completed++;
  saveSummary();
}

try {
  const manifest = JSON.parse(readFileSync('.oagen-manifest.json', 'utf8'));
  const routes = Object.keys(manifest.operations ?? {}).sort();
  const digest = createHash('sha256').update(JSON.stringify(routes)).digest('hex');
  if (manifest.version !== 2 || manifest.language !== config.language || digest !== config.operationDigest) {
    throw new Error('Operation manifest differs from the canonical generated SDK operation set');
  }
  if (config.language === 'rust') {
    temporaryRoot = mkdtempSync(path.join(os.tmpdir(), 'sellapp-rust-sdk-ci-'));
    root = path.join(temporaryRoot, 'rust');
    cpSync(sourceRoot, root, {
      recursive: true,
      filter: (entry) => !['.git', 'target'].includes(path.basename(entry)),
    });
    if (process.env.SELLAPP_RUST_LOCK_FILE) copyFileSync(process.env.SELLAPP_RUST_LOCK_FILE, path.join(root, 'Cargo.lock'));
    process.env.CARGO_TARGET_DIR ??= path.join(os.tmpdir(), 'sellapp-rust-validation-target');
  }
  for (const [index, [executable, args]] of config.plan.tools.entries()) {
    await run({ stage: 'preflight', executable, args }, index);
  }
  for (const [index, step] of config.plan.commands.entries()) {
    await run(step, index + config.plan.tools.length);
  }
  if (executedTests === 0) throw new Error('No native tests executed');
  saveSummary('passed');
} catch (error) {
  const active = steps.at(-1);
  if (active?.status === 'running') active.status = 'failed';
  saveSummary('failed', error.message);
  console.error(error);
  process.exitCode = 1;
} finally {
  if (temporaryRoot) rmSync(temporaryRoot, { recursive: true, force: true });
}
