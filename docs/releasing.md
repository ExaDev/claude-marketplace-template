# Releasing

Each plugin is released on its own, from its own commits. There is no version to edit by hand.

## The model

- A plugin's version lives in `plugin.json` only. Putting it in the marketplace entry as well draws a validation warning, because the two would have to agree.
- Setting a version pins users to it: Claude Code does not update an installed plugin until the version string changes. Releases exist so that changing a plugin changes its version.
- The marketplace itself has a version, `metadata.version` in `marketplace.json`, which tracks commits that touch anything outside `plugins/`.
- Release tags are `<unit>@<version>`, for example `example-skills@0.2.0` or `marketplace@0.3.0`.

## What decides a release

A commit belongs to a plugin when it touches that plugin's folder. Its conventional-commit type decides the bump, from the table in `scripts/lib/commit-types.ts`: `feat` is minor, `fix`, `perf`, `refactor` and `docs` are patch, a `!` after the type or a `BREAKING CHANGE:` footer is major, and `chore`, `ci`, `test`, `style` and `build` release nothing. The highest level among a plugin's new commits wins. `docs` releases because a plugin's instructions are its product.

The release commit, `chore(release): <unit>@<version>`, is ignored when attributing commits, so a release cannot trigger another.

## Running it

```bash
pnpm release:dry-run   # what would be released, and at what version
pnpm release           # bump plugin.json, write CHANGELOG.md, commit and tag each release
git push --follow-tags
```

In CI, `.github/workflows/release.yml` does this on every push to `main`. It is off until the repository variable `RELEASE_ENABLED` is `true`, because it needs a deploy key.

## First release

A repository created from the template has no tags, and the first release would otherwise count every commit in its history. Run `pnpm release:baseline` once, which tags each unit's current version at `HEAD`, and push the tags. `pnpm release` stops with an error for a unit that has no tag.

## Setting up the release workflow

The release commit has to reach `main`, which the [ruleset](repository-rules.md) protects, and the workflow's own token cannot bypass a ruleset. Use a deploy key:

1. Generate a key pair and add the public half to the repository's deploy keys with write access.
2. Store the private half as the repository secret `RELEASE_DEPLOY_KEY`.
3. Add the deploy key as a bypass actor on the `main` ruleset.
4. Set the repository variable `RELEASE_ENABLED` to `true`.

Minting the key and adding the secret are done by a person with admin rights; nothing in this repository does them.

## When a plugin is renamed or removed

Renaming a plugin changes its install id and its slash commands. Add the old name to `renames` in `marketplace.json` so existing installs follow, and keep that list append-only.
