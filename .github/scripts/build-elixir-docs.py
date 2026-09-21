"""Build and retain a deterministic HexDocs archive before publication credentials exist."""
import gzip
import io
import json
import os
from pathlib import Path
import subprocess
import tarfile

MAX_COMPRESSED = 8 * 1024 * 1024
MAX_UNCOMPRESSED = 64 * 1024 * 1024


def build_archive(directory):
    output = io.BytesIO()
    with tarfile.open(fileobj=output, mode="w", format=tarfile.GNU_FORMAT) as archive:
        total = 0
        for path in sorted(directory.rglob("*")):
            if path.is_symlink():
                raise ValueError("Documentation cannot contain symlinks")
            if not path.is_file() or path.name == ".build":
                continue
            data = path.read_bytes()
            total += len(data)
            if total > MAX_UNCOMPRESSED:
                raise ValueError("Documentation exceeds Hex's uncompressed size limit")
            entry = tarfile.TarInfo(path.relative_to(directory).as_posix())
            entry.size = len(data)
            entry.mode = 0o644
            archive.addfile(entry, io.BytesIO(data))
    raw = output.getvalue()
    if len(raw) > MAX_UNCOMPRESSED:
        raise ValueError("Documentation tar exceeds Hex's uncompressed size limit")
    compressed = gzip.compress(raw, mtime=0)
    if len(compressed) > MAX_COMPRESSED:
        raise ValueError("Documentation exceeds Hex's compressed size limit")
    return compressed


def main():
    manifest = json.loads(Path("generation-manifest.json").read_text())
    if manifest["language"] != "elixir":
        raise ValueError("Expected generated Elixir source")
    version = manifest["sdkVersion"]
    output = Path(f"sellapp-{version}-docs.tar.gz")
    if output.exists():
        raise ValueError("Retained docs archive already exists")
    subprocess.run(["mix", "docs", "--formatter", "html"], env={**os.environ, "MIX_ENV": "dev"}, check=True)
    if not all(Path("doc", name).is_file() for name in ("index.html", "readme.html", "SellApp.html")):
        raise ValueError("ExDoc did not generate the required entry pages")
    output.write_bytes(build_archive(Path("doc")))
    print("Retained " + str(output))


if __name__ == "__main__":
    main()
