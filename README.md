# Claude marketplace template

A starting point for a [Claude Code plugin marketplace](https://code.claude.com/docs/en/plugin-marketplaces): a Git repository that lists plugins people can install with `/plugin install`. It holds one small, validated example plugin for every kind of plugin component, and the tooling a marketplace needs to stay healthy: strict validation, per-plugin releases, commit conventions, CI and a branch ruleset.

Use it to start a public marketplace or a private one for a team. The examples are meant to be read, copied and deleted.

## Create your marketplace

```bash
gh repo create <org>/<repo> --template ExaDev/claude-marketplace-template --private --clone
cd <repo>
pnpm install
pnpm init:marketplace --name <marketplace-name> --owner "<Display Name>" --org <org> --repo <repo> --remove-examples
```

`init:marketplace` renames the marketplace, points every manifest at your repository, sets the licence holder and regenerates the plugin table below. Leave out `--remove-examples` to keep the examples while you learn from them. Then review the changes, stage the changed files by name, commit, and run `pnpm release:baseline` to tag each plugin's starting version so the first release does not replay the template's history.

Everything after that is in [docs](docs/README.md): [setting up the repository rules](docs/repository-rules.md), [releasing](docs/releasing.md), [private marketplaces](docs/private-marketplaces.md) and [distributing a marketplace to a team](docs/distribution.md).

## What is in it

```text
.claude-plugin/marketplace.json   the catalogue: one entry per plugin
plugins/<name>/                   a plugin: .claude-plugin/plugin.json, then its components
scripts/                          TypeScript tooling and its tests
docs/                             how the pieces fit, and how to run a marketplace
.github/                          CI, the release workflow, dependabot and the ruleset
```

A plugin keeps only `plugin.json` inside `.claude-plugin/`. Skills, agents, hooks and the rest sit at the plugin root. A plugin's version lives in its own `plugin.json` and nowhere else: setting it in the marketplace entry as well draws a validation warning, and the marketplace's `metadata.version` tracks changes outside `plugins/`.

## The example plugins

[Plugin types](docs/plugin-types.md) explains each component and where it goes. Plugins marked "starts disabled" start switched off, because enabling them changes behaviour (an agent, a style, a language server) or spends usage.

<!-- plugins:start -->
| Plugin | Version | Category | What it provides |
| --- | --- | --- | --- |
| [`example-skills`](plugins/example-skills) | 0.1.0 | skills | Skills: a skill with a bundled reference file, called as a namespaced slash command. |
| [`example-agents`](plugins/example-agents) | 0.1.0 | agents | Agents: a read-only subagent with its own instructions, model and tool access. |
| [`example-commands`](plugins/example-commands) | 0.1.0 | commands | Commands: a flat Markdown slash command that takes an argument. |
| [`example-hooks`](plugins/example-hooks) | 0.1.0 | hooks | Hooks: a session-start reminder and a guard that stops unsafe git commands. |
| [`example-mcp`](plugins/example-mcp) | 0.1.0 | mcp | MCP server: a dependency-free stdio server that exposes one tool. |
| [`example-lsp`](plugins/example-lsp) | 0.1.0 | lsp | LSP server: connects a language server so Claude sees diagnostics after edits. (starts disabled) |
| [`example-output-style`](plugins/example-output-style) | 0.1.0 | output-styles | Output style: replies that avoid jargon and lead with the answer. (starts disabled) |
| [`example-theme`](plugins/example-theme) | 0.1.0 | themes | Theme: a colour theme based on the dark preset. (starts disabled) |
| [`example-monitors`](plugins/example-monitors) | 0.1.0 | monitors | Monitor: a background command whose output reaches Claude as notifications. (starts disabled) |
| [`example-workflow`](plugins/example-workflow) | 0.1.0 | workflows | Workflow: a script that fans out one subagent per README and collects the results. (starts disabled) |
| [`example-bin`](plugins/example-bin) | 0.1.0 | executables | Executable: a script on the Bash tool's PATH while the plugin is enabled. |
| [`example-settings`](plugins/example-settings) | 0.1.0 | settings | Settings: runs one of the plugin's own agents as the main thread. (starts disabled) |
| [`example-user-config`](plugins/example-user-config) | 0.1.0 | configuration | User configuration: a value the user is asked for when the plugin is enabled. |
| [`marketplace-maintainer`](plugins/marketplace-maintainer) | 0.1.0 | maintenance | Meta-tooling for working inside this marketplace repository: add, validate and release plugins. |
<!-- plugins:end -->

## Commands

| Command | What it does |
| --- | --- |
| `pnpm check` | Everything CI runs: typecheck, tests, README table check and strict plugin validation |
| `pnpm validate` | `claude plugin validate --strict` on the marketplace and on each plugin directory, which the marketplace run does not open |
| `pnpm readme` | Regenerates the plugin table above from each `plugin.json` |
| `pnpm release:dry-run` | Shows which plugins would be released and at what version |
| `pnpm release` | Releases them: bumps `plugin.json`, writes the changelog, commits and tags |
| `pnpm release:baseline` | Tags each unit's current version once, when a marketplace is created from the template |
| `pnpm init:marketplace` | Turns a copy of the template into your marketplace |

## Install a marketplace made from this template

```text
/plugin marketplace add <org>/<repo>
/plugin install <plugin>@<marketplace-name>
```

A private repository needs the installer's Git credentials to reach it: see [private marketplaces](docs/private-marketplaces.md).

## For people and agents

`CLAUDE.md` and `AGENTS.md` are symlinks to this file, so people and agents read the same text. Commits follow [Conventional Commits](https://www.conventionalcommits.org/) with the types in `scripts/lib/commit-types.ts`, and a plugin's commits decide its releases. Stage files by name: `git add -A`, `git add .` and `--no-verify` are denied for Claude in `.claude/settings.json`. [CONTRIBUTING.md](CONTRIBUTING.md) has the full path, starting from no Git knowledge.

## Licence

[MIT](LICENSE).
