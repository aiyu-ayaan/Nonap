# Releasing NoNap

Releases are driven by a marker at the **start** of a commit subject on `master`.

| Marker | From | To | npm tag |
| --- | --- | --- | --- |
| `!alpha` | nothing | `0.0.1-alpha.1` | `alpha` |
| `!alpha` | `0.0.1-alpha.1` | `0.0.1-alpha.2` | `alpha` |
| `!beta` | `0.0.1-alpha.3` | `0.0.1-beta.1` | `beta` |
| `!stable` | `0.0.1-beta.2` | `0.0.1` | `latest` |
| `!fix` | `1.4.2` | `1.4.3` | `latest` |
| `!feat` | `1.4.2` | `1.5.0` | `latest` |
| `!major` | `1.4.2` | `2.0.0` | `latest` |

If several commits in one push carry markers, the strongest wins (`major` > `feat` > `fix` > `stable` > `beta` > `alpha`). Commits without a marker never release.

## Flow

1. Push or merge a commit like `!alpha : first release` to `master`.
2. The workflow opens a **release PR** `chore(release): vX.Y.Z`. It bumps `package.json` and writes a `CHANGELOG.md` entry from the commits since the last tag. Edit the CHANGELOG in that branch if needed.
3. **Merging the PR releases:** `npm publish` with the channel as dist-tag (with provenance), then the `vX.Y.Z` tag and a GitHub Release (pre-release for alpha/beta).

Closing the PR releases nothing. To retry a failed release, run the **Release** workflow by hand with mode `release`; it skips anything already published.

## One-time setup

1. Push the repo to GitHub, default branch `master`.
2. npm: create an **Automation** (or granular, publish) access token and save it as repo secret `NPM_TOKEN`.
3. Settings > Actions > General: enable "Allow GitHub Actions to create and approve pull requests", or add a `RELEASE_TOKEN` secret (a PAT) so the release PR can trigger other workflows.
4. Optional: protect `master` so release PRs need review.

## Check locally

```sh
node scripts/release-version.mjs --check
node scripts/release-version.mjs --current 0.0.1-alpha.2 --subject "!beta : promote"
npm pack --dry-run
```

## Users

```sh
npm install -g nonap          # latest (stable)
npm install -g nonap@beta
npm install -g nonap@alpha
```
