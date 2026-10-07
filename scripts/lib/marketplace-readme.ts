export interface ReadmeVars {
	readonly name: string
	readonly owner: string
	readonly slug: string
	readonly description: string
	readonly license: string
}

/**
 * The README a marketplace created from the template starts with, in place of the template's own,
 * which explains the template. The plugin table between the markers is filled by `pnpm readme`.
 */
export function renderMarketplaceReadme(vars: ReadmeVars): string {
	const licence = vars.license === "UNLICENSED" ? "Private. Not licensed for reuse." : `[${vars.license}](LICENSE)`
	return `# ${vars.name}

${vars.description}

## Install

\`\`\`text
/plugin marketplace add ${vars.slug}
/plugin install <plugin>@${vars.name}
\`\`\`

A private repository needs your Git credentials to reach it, and [distributing it to a team](docs/distribution.md) is covered in the docs. See [private marketplaces](docs/private-marketplaces.md) for how installs and updates authenticate.

## Plugins

<!-- plugins:start -->
<!-- plugins:end -->

## Working in this repository

| Command | What it does |
| --- | --- |
| \`pnpm check\` | Typecheck, tests, README table check and strict plugin validation: what CI runs |
| \`pnpm readme\` | Regenerates the plugin table above from each \`plugin.json\` |
| \`pnpm release:dry-run\` | Shows which plugins would be released and at what version |

[CONTRIBUTING.md](CONTRIBUTING.md) explains how to add or change a plugin, starting from no Git knowledge. [docs](docs/README.md) covers the plugin types, [releasing](docs/releasing.md) and the [repository rules](docs/repository-rules.md).

\`CLAUDE.md\` and \`AGENTS.md\` are symlinks to this file, so people and agents read the same text. Commits follow Conventional Commits, and a plugin's commits decide its releases. Stage files by name: \`git add -A\`, \`git add .\` and \`--no-verify\` are denied for Claude in \`.claude/settings.json\`.

Maintained by ${vars.owner}. Created from [ExaDev/claude-marketplace-template](https://github.com/ExaDev/claude-marketplace-template).

## Licence

${licence}
`
}
