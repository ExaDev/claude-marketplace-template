# Private marketplaces

A private marketplace is an ordinary marketplace repository with restricted access. Claude Code has no token of its own for it and `marketplace.json` has no field for one: it runs `git` with the installing machine's own credentials. Source: [Host and distribute marketplaces](https://code.claude.com/docs/en/plugins/host-marketplace).

## How installs and updates authenticate

- **Interactive installs** use whatever Git can already do: a credential helper over HTTPS (run `gh auth login`, then `gh auth setup-git`), or an SSH key loaded in `ssh-agent` with the host already in `known_hosts`.
- **GitHub `owner/repo` shorthand** tries SSH first and falls back to HTTPS. `CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1` forces HTTPS.
- **Background auto-update** uses the same credential helpers and never prompts, so a helper that needs to ask a question fails quietly. When the update check cannot reach or authenticate to the remote, Claude Code re-clones; `CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE=1` keeps the old copy instead. Auto-update is off by default for marketplaces that are not Anthropic's, and can be switched on per user or in managed settings.
- **`GITHUB_TOKEN` or `GH_TOKEN` alone does nothing.** They work only through a credential helper that reads them, such as the one `gh auth setup-git` installs.
- **CI** that installs plugins from a private marketplace needs `GH_TOKEN` exported and `gh auth setup-git` run. The default workflow token cannot read other private repositories.
- Plugins that come from an external source (not a path inside the marketplace) need access to their own repositories as well.

## Create a private marketplace from this template

1. Create the repository from the template:

   ```bash
   gh repo create <org>/<repo> --template ExaDev/claude-marketplace-template --private --clone
   ```

2. Make it yours: `pnpm install`, then `pnpm init:marketplace` with your name, owner, organisation and repository (see the [README](../README.md)). Use `--license UNLICENSED` for a repository that is not licensed for reuse.
3. Review, stage by name and commit, push, then run `pnpm release:baseline` and `git push --tags`.
4. Apply the [repository rules](repository-rules.md). Rulesets and secrets are repository settings and do not come across from a template, so every marketplace created from it needs this step.
5. Tell people how to install: `/plugin marketplace add <org>/<repo>`, or [distribute it](distribution.md) through settings.

A repository created from a template starts from a single commit with unrelated history and does not copy branches, rulesets, secrets or variables.
