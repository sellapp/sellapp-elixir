"""Verify and upload retained Hex package and documentation bytes without building or running package code.

The upload endpoints follow the official Hex client:
https://github.com/hexpm/hex_core/blob/main/src/hex_api_release.erl
"""
import argparse
import hashlib
import io
import json
import os
from pathlib import Path
import re
import subprocess
import tarfile
import urllib.error
import urllib.request

REPOSITORY = "sellapp/sellapp-elixir"
PACKAGE = "sellapp"
MAX_PACKAGE_BYTES = 8 * 1024 * 1024
REGISTRY = "https://hex.pm"
USER_AGENT = "SellApp-Elixir-Publication/1 (support@sell.app)"


def require(condition, message):
    if not condition:
        raise ValueError(message)


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def validate_manifest(raw, expected_hash, source, ownership, sdk_commit, tag):
    require(
        bool(re.fullmatch(r"[a-f0-9]{64}", expected_hash)),
        "Expected a SHA-256 manifest digest",
    )
    require(
        len(raw) <= 65536 and sha256(raw) == expected_hash,
        "Publication manifest hash differs",
    )
    manifest = json.loads(raw)
    version = manifest.get("version", "")
    require(
        bool(re.fullmatch(r"[0-9]+\.[0-9]+\.[0-9]+", version)) and tag == "v" + version,
        "Release tag/version differs",
    )
    require(
        manifest.get("schemaVersion") == 1 and manifest.get("repository") == REPOSITORY,
        "Unexpected publication repository/schema",
    )
    require(
        bool(re.fullmatch(r"[a-f0-9]{40}", sdk_commit))
        and manifest.get("sdkCommit") == sdk_commit,
        "SDK commit differs from workflow checkout",
    )
    require(
        ownership.get("repository") == REPOSITORY
        and ownership.get("language") == "elixir",
        "Unexpected source ownership",
    )
    require(
        source.get("sdkVersion") == version and source.get("language") == "elixir",
        "Generated SDK language/version differs",
    )
    require(
        source.get("generatorDirty") is False,
        "Source was generated from a dirty checkout",
    )
    require(
        manifest.get("sourceSha")
        == source.get("generatorCommit")
        == ownership.get("sourceSha"),
        "Generator source identity differs",
    )
    require(
        bool(re.fullmatch(r"[a-f0-9]{40}", manifest.get("sourceSha", ""))),
        "Invalid generator source identity",
    )
    require(
        manifest.get("specSha256")
        == source.get("specSha256")
        == ownership.get("specSha256"),
        "Specification identity differs",
    )
    require(
        bool(re.fullmatch(r"[a-f0-9]{64}", manifest.get("specSha256", ""))),
        "Invalid specification digest",
    )
    require(manifest.get("packageName") == PACKAGE, "Unexpected Hex package name")
    files = manifest.get("files", [])
    expected = {f"{PACKAGE}-{version}.tar", f"{PACKAGE}-{version}-docs.tar.gz"}
    require(
        len(files) == 2 and {f.get("name") for f in files} == expected,
        "Expected exactly the versioned Hex package and documentation",
    )
    for item in files:
        require(
            bool(re.fullmatch(r"[a-f0-9]{64}", item.get("sha256", ""))),
            "Invalid package digest",
        )
        require(
            type(item.get("size")) is int and 0 < item["size"] <= MAX_PACKAGE_BYTES,
            "Invalid package size",
        )
    return manifest




def archive_files(data, mode):
    files = {}
    total = 0
    with tarfile.open(fileobj=io.BytesIO(data), mode=mode) as archive:
        for entry in archive:
            require(entry.isfile(), "Package entries must be regular files")
            name = entry.name
            require(name and "\\" not in name and ":" not in name
                    and all(part not in ("", ".", "..") for part in name.split("/"))
                    and not any(ord(c) < 32 for c in name), "Unsafe archive entry")
            require(name not in files, "Duplicated archive entry")
            total += entry.size
            require(0 <= entry.size <= 64 * 1024 * 1024 and total <= 64 * 1024 * 1024,
                    "Oversized unpacked archive")
            files[name] = archive.extractfile(entry).read()
    return files


def validate_package(data, item, version):
    require(len(data) == item["size"] and sha256(data) == item["sha256"],
            "Package bytes differ from validated manifest")
    if item["name"].endswith("-docs.tar.gz"):
        files = archive_files(data, "r:gz")
        require({"index.html", "readme.html", "SellApp.html"} <= files.keys(),
                "Missing HexDocs entry points")
        require(b"SellApp" in files["readme.html"] and version.encode() in files["readme.html"],
                "HexDocs package identity differs")
        return files
    outer = archive_files(data, "r:")
    require(set(outer) == {"VERSION", "metadata.config", "contents.tar.gz", "CHECKSUM"},
            "Unexpected Hex package envelope")
    require(outer["VERSION"] == b"3", "Unsupported Hex package envelope version")
    checksum = sha256(outer["VERSION"] + outer["metadata.config"] + outer["contents.tar.gz"])
    require(outer["CHECKSUM"] == checksum.upper().encode(), "Hex inner checksum differs")
    require(len(outer["metadata.config"]) <= 1024 * 1024, "Oversized package metadata")
    metadata = outer["metadata.config"].decode()
    for key, expected in (("name", PACKAGE), ("app", PACKAGE), ("version", version)):
        matches = re.findall(r'\{<<"' + key + r'">>,\s*<<"([^"]+)">>\}\.', metadata)
        require(matches == [expected], "Hex metadata " + key + " differs")
    require(re.search(r'\{<<"licenses">>,\s*\[<<"MIT">>\]\}\.', metadata),
            "Hex package license differs")
    require("https://github.com/" + REPOSITORY in metadata, "Hex repository differs")
    files = archive_files(outer["contents.tar.gz"], "r:gz")
    require({"mix.exs", "lib/sellapp.ex", "README.md", "LICENSE.txt", "NOTICE.txt"}
            <= files.keys(), "Missing SDK source, license or documentation")
    require(files["README.md"].startswith(b"# SellApp for Elixir"), "Unexpected package README")
    return files


class NoRedirects(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def registry_read(url, maximum=1024 * 1024):
    opener = urllib.request.build_opener(NoRedirects)
    try:
        with opener.open(urllib.request.Request(url, headers={
                "User-Agent": USER_AGENT, "Accept": "application/json"}), timeout=60) as response:
            data = response.read(maximum + 1)
            require(len(data) <= maximum, "Oversized registry response")
            return data
    except urllib.error.HTTPError as error:
        if error.code == 404:
            return None
        raise ValueError("Registry availability check failed; no upload attempted") from None


def upload(url, data):
    """Use Hex's supported raw-tar POST endpoint; never rebuild or retry."""
    token = os.environ.get("HEX_API_KEY", "")
    require(token and token.strip() == token and "\r" not in token and "\n" not in token,
            "HEX_API_KEY must contain the publishing credential")
    request = urllib.request.Request(url, data=data, method="POST",
                                     headers={"Authorization": token, "User-Agent": USER_AGENT,
                                              "Content-Type": "application/octet-stream",
                                              "Accept": "application/json"})
    try:
        with urllib.request.build_opener(NoRedirects).open(request, timeout=120) as response:
            raw = response.read(1024 * 1024 + 1)
            require(len(raw) <= 1024 * 1024, "Oversized registry response")
            acknowledgment = json.loads(raw) if raw else {}
            require(not acknowledgment.get("errors"), "Hex rejected publication")
            return response.status
    except urllib.error.HTTPError as error:
        raise ValueError(f"Hex upload returned HTTP {error.code}; check acceptance before retrying") from None
    except (TimeoutError, urllib.error.URLError):
        raise ValueError("Hex upload result is uncertain; check acceptance before retrying") from None


def publish_retained(manifest, packages, docs_only=False):
    version = manifest["version"]
    package_name = f"{PACKAGE}-{version}.tar"
    docs_name = f"{PACKAGE}-{version}-docs.tar.gz"
    release_url = f"{REGISTRY}/api/packages/{PACKAGE}/releases/{version}"
    existing = registry_read(release_url)
    if docs_only:
        require(existing is not None, "Docs-only recovery requires an accepted package")
        release = json.loads(existing)
        require(release.get("version") == version and not release.get("has_docs"),
                "Expected the accepted package with documentation still absent")
        published = registry_read(f"https://repo.hex.pm/tarballs/{package_name}", MAX_PACKAGE_BYTES)
        require(published is not None and sha256(published) == sha256(packages[package_name]),
                "Existing Hex package bytes differ from the retained archive")
        package_status = "previously accepted; bytes verified"
    else:
        require(existing is None, "Package version already exists; use reviewed docs-only recovery if needed")
        upload(f"{REGISTRY}/api/packages/{PACKAGE}/releases?replace=false", packages[package_name])
        package_status = "accepted"
    receipt = {"packageName": PACKAGE, "version": version, "package": package_status,
               "packageSha256": sha256(packages[package_name]), "docs": "pending"}
    receipt_path = Path("publication-acknowledgment.json")
    receipt_path.write_text(json.dumps(receipt, indent=2) + "\n")
    upload(release_url + "/docs", packages[docs_name])
    receipt.update(docs="accepted", docsSha256=sha256(packages[docs_name]))
    receipt_path.write_text(json.dumps(receipt, indent=2) + "\n")
    print("Hex accepted " + PACKAGE + " " + version + " and its retained documentation")


def github(resource, binary=False):
    command = ["gh", "api", "--hostname", "github.com", resource]
    if binary:
        command.extend(["--header", "Accept: application/octet-stream"])
    result = subprocess.run(command, capture_output=True, timeout=120)
    require(result.returncode == 0, "GitHub asset/metadata read failed")
    return result.stdout if binary else json.loads(result.stdout)


def checkout_commit(local):
    if local:
        result = subprocess.run(["git", "rev-parse", "HEAD"], capture_output=True, text=True, check=True)
        commit = result.stdout.strip()
        status = subprocess.run(["git", "status", "--porcelain", "--untracked-files=no"],
                                capture_output=True, text=True, check=True)
        require(not status.stdout, "Local SDK checkout has tracked changes")
        return commit
    require(os.environ.get("GITHUB_REPOSITORY") == REPOSITORY
            and os.environ.get("GITHUB_REF") == "refs/heads/main",
            "Run this workflow from the official repository main branch")
    return os.environ.get("GITHUB_SHA", "")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--tag", required=True)
    parser.add_argument("--sha256", required=True)
    parser.add_argument("--local", action="store_true",
                        help="Verify a clean local checkout of the delivered SDK commit")
    parser.add_argument("--docs-only", action="store_true", help="Resume documentation after verified package acceptance")
    parser.add_argument("--publish-retained", action="store_true",
                        help="Upload the already verified dist artifact; no build is performed")
    args = parser.parse_args()
    require(bool(re.fullmatch(r"v[0-9]+\.[0-9]+\.[0-9]+", args.tag)), "Expected release tag vX.Y.Z")
    commit = checkout_commit(args.local)
    prefix = "repos/" + REPOSITORY
    release = github(prefix + "/releases/tags/" + args.tag)
    require(release.get("tag_name") == args.tag, "GitHub release tag differs")
    ref = github(prefix + "/git/ref/tags/" + args.tag)["object"]
    for _ in range(3):
        if ref.get("type") == "commit":
            break
        require(ref.get("type") == "tag" and bool(re.fullmatch(r"[a-f0-9]{40}", ref.get("sha", ""))),
                "Unexpected Git tag object")
        ref = github(prefix + "/git/tags/" + ref["sha"])["object"]
    require(ref.get("type") == "commit" and ref.get("sha") == commit,
            "Release tag differs from workflow checkout")
    assets = release.get("assets", [])

    def download(name, maximum):
        matches = [asset for asset in assets if asset.get("name") == name]
        require(len(matches) == 1, "Missing or duplicated release asset: " + name)
        asset = matches[0]
        require(type(asset.get("id")) is int and type(asset.get("size")) is int
                and 0 < asset["size"] <= maximum, "Invalid release asset size/identity")
        data = github(prefix + "/releases/assets/" + str(asset["id"]), binary=True)
        require(len(data) == asset["size"], "Downloaded release asset size differs")
        return data

    raw = (Path("dist/publication-manifest.json").read_bytes() if args.publish_retained
           else download("publication-manifest.json", 65536))
    manifest = validate_manifest(raw, args.sha256,
                                 json.loads(Path("generation-manifest.json").read_text()),
                                 json.loads(Path(".sellapp-sdk-sync.json").read_text()),
                                 commit, args.tag)
    packages = {}
    for item in manifest["files"]:
        data = (Path("dist", item["name"]).read_bytes() if args.publish_retained
                else download(item["name"], MAX_PACKAGE_BYTES))
        validate_package(data, item, manifest["version"])
        packages[item["name"]] = data
    require(not args.docs_only or args.publish_retained, "Docs-only requires publishing retained artifacts")
    if args.publish_retained:
        require(github(prefix).get("private") is False, "Publish only from the public SDK repository")
        publish_retained(manifest, packages, args.docs_only)
    else:
        require(not Path("dist").exists(), "Output directory already exists")
        Path("dist").mkdir()
        for name, data in packages.items():
            Path("dist", name).write_bytes(data)
        Path("dist/publication-manifest.json").write_bytes(raw)
        print("Verified retained Hex package and docs for " + args.tag + " at " + commit)


if __name__ == "__main__":
    main()
