# Plugin types

A plugin is a folder. Its manifest, `.claude-plugin/plugin.json`, is optional metadata and the only thing that goes inside `.claude-plugin/`. Every component lives at the plugin root in a default folder, or wherever the manifest points. Each type below has a small example plugin in `plugins/`, validated by CI.

Source for this page: the [plugins reference](https://code.claude.com/docs/en/plugins-reference) and [plugin components](https://code.claude.com/docs/en/plugins/components).

| Component | Default location | Example | Notes |
| --- | --- | --- | --- |
| Skills | `skills/<name>/SKILL.md` | `example-skills` | The preferred way to package instructions. A skill can carry reference files and read them through `${CLAUDE_PLUGIN_ROOT}` |
| Commands | `commands/*.md` | `example-commands` | Flat Markdown files. Still supported; prefer skills for new work |
| Agents | `agents/*.md` | `example-agents` | Frontmatter names the agent, picks a model and can limit its tools |
| Hooks | `hooks/hooks.json` | `example-hooks` | The event map sits under a top-level `hooks` key, or the file fails to load |
| MCP servers | `.mcp.json` | `example-mcp` | `.mcpb` and `.dxt` bundles are also accepted |
| LSP servers | `.lsp.json` | `example-lsp` | `command` and `extensionToLanguage` are required |
| Output styles | `output-styles/*.md` | `example-output-style` | Appear in `/output-style` as `<plugin>:<name>` |
| Themes | `themes/*.json` | `example-theme` | Experimental component |
| Monitors | `monitors/monitors.json` | `example-monitors` | Experimental. Background commands whose output reaches Claude; interactive sessions only |
| Workflows | `workflows/*.js` | `example-workflow` | Scripts that orchestrate many subagents. Namespaced as `/<plugin>:<name>` |
| Executables | `bin/` | `example-bin` | On the Bash tool's `PATH`. claude.ai and Cowork do not install a plugin that has one |
| Settings | `settings.json` | `example-settings` | Only `agent` and `subagentStatusLine` take effect |
| User configuration | `userConfig` in `plugin.json` | `example-user-config` | Values asked for when the plugin is enabled. Mark secrets `"sensitive": true` |

`marketplace-maintainer` is not a component type: it is the skill that teaches Claude this repository's conventions.

## Rules worth knowing

- Component paths in a manifest start with `./`, stay inside the plugin and must exist.
- `commands`, `agents`, `outputStyles` and `workflows` keys in the manifest replace their default folder; `skills`, `hooks`, `mcpServers` and `lspServers` add to or merge with it.
- A plugin's name namespaces everything in it, so `reviewer` in `deploy-tools` is `deploy-tools:reviewer`. Keep the manifest name and the marketplace entry name identical.
- Plugin files are replaced on every update. Keep state in `${CLAUDE_PLUGIN_DATA}`, never in `${CLAUDE_PLUGIN_ROOT}`.
- `${user_config.*}` cannot be used in shell-form hook commands or monitor commands. Use exec form with `args`, or read the `CLAUDE_PLUGIN_OPTION_<KEY>` environment variable in a hook.
- Newer manifest fields need a recent Claude Code. `metadata` needs v2.1.222, and `userConfig` `options` needs v2.1.271.
