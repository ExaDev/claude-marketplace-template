---
description: Add, change, validate or release plugins in this marketplace repository. Use when asked to add a plugin or skill here, check the marketplace, or prepare a release.
---

This skill operates on a checkout of this marketplace repository. Read `CONTRIBUTING.md` first and follow it.

## Add a plugin

1. Create `plugins/<name>/.claude-plugin/plugin.json` with `name`, `version` `0.1.0`, `description`, `author` and `license`. Use kebab-case, and never start a name with `claude-`, `anthropic-` or `cc-plugin-`.
2. Add the components in their default folders (`skills/`, `agents/`, `hooks/hooks.json`, `.mcp.json` and so on). Only `plugin.json` goes in `.claude-plugin/`.
3. Add an entry to `.claude-plugin/marketplace.json` with `name`, `source` (`./plugins/<name>`), `description` and `category`. Do not put a `version` there: it lives in `plugin.json` only, and setting it in both places draws a validation warning.
4. Write the plugin `README.md`, including who owns its content.
5. Run `pnpm readme` to refresh the table in the root README.

## Check

Run `pnpm check`. It typechecks, runs the tests, checks the README table and runs `claude plugin validate --strict` on the marketplace and every plugin.

## Release

Never edit versions or changelogs by hand. Commits named `feat`, `fix`, `perf`, `refactor` or `docs` that touch a plugin release it; `pnpm release:dry-run` shows what would be released.

## Commits and pull requests

Stage files by name. Never `git add -A`, `git add .` or `--no-verify`. Open a draft pull request and rebase-merge it once the checks pass.
