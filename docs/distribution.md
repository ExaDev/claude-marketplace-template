# Distribution

Four ways to put a marketplace in front of people, from one person to a whole organisation. Source: [Plugins for teams](https://code.claude.com/docs/en/plugins/org) and the [marketplace reference](https://code.claude.com/docs/en/plugins/marketplace-reference).

## One person

```text
/plugin marketplace add <org>/<repo>
/plugin install <plugin>@<marketplace-name>
/reload-plugins
```

Or non-interactively: `claude plugin install <plugin>@<marketplace-name>`. Plugin skills are namespaced by the plugin name, so a skill `greet` in `example-user-config` is `/example-user-config:greet`.

## Everyone who works in a repository

A project's `.claude/settings.json` can register the marketplace and enable plugins, so people are offered them without running anything by hand:

```json
{
  "extraKnownMarketplaces": {
    "<marketplace-name>": { "source": { "source": "github", "repo": "<org>/<repo>" } }
  },
  "enabledPlugins": { "<plugin>@<marketplace-name>": true }
}
```

This is honoured only after the person trusts the project folder, and not in cloud sessions or `-p` runs where trust was never accepted. Plugins loaded from relative paths inside the marketplace come with it; a plugin with an external source also needs each person to run `claude plugin install <plugin>@<marketplace-name> --scope project` once. `claude plugin marketplace add <org>/<repo> --scope project` writes the file for you.

## Everyone in an organisation, by managed settings

Managed settings take the same two keys and apply whichever repository someone is in. A managed `enabledPlugins` entry cannot be overridden by the user. The file is `managed-settings.json` at:

| OS | Path |
| --- | --- |
| macOS | `/Library/Application Support/ClaudeCode/managed-settings.json` |
| Linux and WSL | `/etc/claude-code/managed-settings.json` |
| Windows | `C:\Program Files\ClaudeCode\managed-settings.json` |

Server-managed settings and MDM deliver the same keys. To limit which marketplaces can be added at all, set `strictKnownMarketplaces` (an allowlist) or `blockedMarketplaces` in managed settings: an empty `strictKnownMarketplaces` list blocks every marketplace, including the official one.

## Everyone in a claude.ai organisation, by the admin console

An organisation owner can make plugins available to every member under **Organization settings, Plugins**, by syncing a private or internal GitHub repository. Check the current [documentation](https://code.claude.com/docs/en/plugins/org) before relying on this route: GitHub-synced marketplaces support a narrower set of `source` types than the CLI, and a plugin with a top-level `bin/` directory is not installed by claude.ai or Cowork.

## Choosing

Start with the project's `.claude/settings.json` for a team that shares repositories, and move to managed settings when the plugins must be present everywhere or the set of marketplaces has to be controlled.
