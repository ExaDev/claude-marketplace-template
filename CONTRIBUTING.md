# Contributing

This file has two parts. The first is for someone who wants to add or change a plugin and has not used Git before. The second is the conventions everyone follows.

## New to Git and GitHub

You do not need a software background. Git keeps every change to every file as a reviewable record you can always get back to, and GitHub hosts it and lets people review each other's changes before they join the shared version.

### One-time setup

1. Install [GitHub Desktop](https://desktop.github.com/), the easiest way to work with the repository day to day.
2. Install the [GitHub CLI](https://cli.github.com/) (`gh`) and run `gh auth login`. Claude Code uses it to open pull requests for you.
3. Clone the repository to a folder that is not synced by OneDrive, Dropbox or similar. A repository under active use in a synced folder causes constant sync noise.
4. Install [Node.js](https://nodejs.org/) 22 or later and run `corepack enable`, then `pnpm install` in the repository.

### The vocabulary

| Term | What it means here |
| --- | --- |
| Commit | One saved, reviewable change. Nothing is shared until it is committed and pushed |
| Branch | Your own copy of the work, so you can change things without disturbing the shared version |
| Pull request | A proposal to join your branch to the shared version, reviewed before it merges |
| Required check | An automated test that must pass before a pull request can merge |
| Rebase and merge | How a pull request joins the shared history here: your commits stack on top with no extra merge commit |

### Changing a plugin, step by step

1. Update your clone, open it in Claude Code, and install the `marketplace-maintainer` plugin from this marketplace.
2. Describe the change in plain words. Use Plan mode so Claude shows what it intends to do before it touches anything, and read the plan.
3. When Claude commits, check it stages only the files the change touched. Never let it run `git add -A` or `git add .`, which sweep in unrelated files.
4. Push and open a pull request (draft first). Claude Code can do this once `gh` is signed in.
5. Wait for the checks. A red check means something about the plugin's files needs fixing, not that your idea is wrong; paste the failure to Claude and ask.
6. When the checks pass and the pull request is ready, use **Rebase and merge** from the merge button's menu. Never use squash.

## Conventions

### Plugins

- One folder per plugin under `plugins/`, named in kebab-case. A name must not start with `claude-`, `anthropic-` or `cc-plugin-`, which the validator reserves.
- Only `plugin.json` goes in `.claude-plugin/`. Components go at the plugin root in their default folders.
- Give every plugin a `README.md` that says what it provides, how to try it and who owns its content.
- Put the version in `plugin.json` only, and never edit versions or changelogs by hand: releases do both.
- Add the plugin to `.claude-plugin/marketplace.json` with a `source`, `description` and `category`, then run `pnpm readme`.
- Run `pnpm check` before you push. It is what CI runs.

### Commits and pull requests

- Commit subjects follow `type(scope): description`. The types are in `scripts/lib/commit-types.ts`. A commit that touches a plugin releases it when its type is `feat`, `fix`, `perf`, `refactor` or `docs`, and `feat` is a minor release. Put `!` after the type, or a `BREAKING CHANGE:` footer in the body, for a major one.
- Use the plugin's name as the scope when a change is about one plugin.
- Wrap commit body lines at 100 columns.
- Never put `[skip ci]` or a similar token in a commit message: it stops the required checks reporting and blocks the pull request.
- Open pull requests as drafts and mark them ready when the checks pass.

### Guardrails

Claude is told not to run `git add -A`, `git add .` or anything with `--no-verify`, through the deny rules in `.claude/settings.json`. If you use another tool, follow the same rules yourself.

### Gotchas

- Some global gitignore files exclude `.claude/`, `CLAUDE.md` and `AGENTS.md`. Those files are tracked here on purpose, so a new one needs `git add -f <path>`, by name.
- `pnpm install` sets up the commit hooks through husky's `prepare` script. If your package manager is configured to skip lifecycle scripts, run `pnpm exec husky` once, or rely on CI, which runs every check anyway.
