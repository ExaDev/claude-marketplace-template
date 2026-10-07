import { isMain } from "./lib/is-main.ts"
import { renderMarketplaceReadme } from "./lib/marketplace-readme.ts"
import { execFileSync } from "node:child_process"
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { parseArgs } from "node:util"
import {
	Marketplace,
	MARKETPLACE_PATH,
	PLUGINS_DIR,
	ROOT,
	pluginManifestPath,
	pluginNames,
	readJson,
	readPlugin,
	writeJson,
} from "./lib/manifests.ts"

const TEMPLATE_NAME = "example-marketplace"
const RESERVED_PREFIXES = ["claude-", "anthropic-", "anthropics-", "cc-plugin-"]

/** A marketplace name is lower-case letters, digits and hyphens, and must not pass as one of Anthropic's own. */
export function validMarketplaceName(name: string): string | undefined {
	if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) return "use lower-case letters, digits and single hyphens"
	if (RESERVED_PREFIXES.some((prefix) => name.startsWith(prefix))) return `must not start with ${RESERVED_PREFIXES.join(", ")}`
	return undefined
}

function pluginMarkdown(): string[] {
	return pluginNames().map((plugin) => join(PLUGINS_DIR, plugin, "README.md")).filter((path) => existsSync(path))
}

function main(): void {
	const { values } = parseArgs({
		options: {
			name: { type: "string" },
			owner: { type: "string" },
			org: { type: "string" },
			repo: { type: "string" },
			description: { type: "string" },
			license: { type: "string", default: "MIT" },
			"remove-examples": { type: "boolean", default: false },
		},
	})
	const { name, owner, org, repo, description } = values
	if (name === undefined || owner === undefined || org === undefined || repo === undefined) {
		console.error(
			'Usage: pnpm init:marketplace --name <marketplace-name> --owner "<Display Name>" --org <github-org> --repo <repo-name> [--description "..."] [--license MIT|UNLICENSED] [--remove-examples]',
		)
		process.exit(1)
	}
	const problem = validMarketplaceName(name)
	if (problem !== undefined) {
		console.error(`--name ${name}: ${problem}`)
		process.exit(1)
	}
	const slug = `${org}/${repo}`

	writeFileSync(
		join(ROOT, "README.md"),
		renderMarketplaceReadme({ name, owner, slug, description: description ?? `Claude Code plugins from ${owner}`, license: values.license }),
	)
	// Example plugins that are kept refer to the template's marketplace name in their install lines.
	for (const path of pluginMarkdown()) {
		const before = readFileSync(path, "utf8")
		const after = before.split(`@${TEMPLATE_NAME}`).join(`@${name}`)
		if (after !== before) writeFileSync(path, after)
	}

	if (values["remove-examples"]) {
		for (const plugin of pluginNames().filter((n) => n.startsWith("example-"))) rmSync(join(PLUGINS_DIR, plugin), { recursive: true })
	}

	const marketplace = readJson(MARKETPLACE_PATH, Marketplace)
	const kept = new Set(pluginNames())
	writeJson(MARKETPLACE_PATH, {
		...marketplace,
		name,
		owner: { ...marketplace.owner, name: owner, url: `https://github.com/${org}` },
		metadata: { ...marketplace.metadata, description: description ?? `Claude Code plugins from ${owner}`, version: "0.1.0" },
		plugins: marketplace.plugins.filter((entry) => kept.has(entry.name)),
	})
	for (const plugin of pluginNames()) {
		const manifest = readPlugin(plugin)
		writeJson(pluginManifestPath(plugin), {
			...manifest,
			version: "0.1.0",
			author: { name: owner, url: `https://github.com/${org}` },
			repository: `https://github.com/${slug}`,
			homepage: `https://github.com/${slug}/tree/main/plugins/${plugin}`,
			license: values.license,
		})
	}
	if (values.license === "UNLICENSED") {
		writeFileSync(join(ROOT, "LICENSE"), `Copyright (c) ${new Date().getFullYear()} ${owner}. All rights reserved.\n\nThis repository is private and is not licensed for use, copying or distribution.\n`)
	} else if (existsSync(join(ROOT, "LICENSE"))) {
		const license = readFileSync(join(ROOT, "LICENSE"), "utf8")
		writeFileSync(join(ROOT, "LICENSE"), license.replace(/^Copyright \(c\) \d{4} .*$/m, `Copyright (c) ${new Date().getFullYear()} ${owner}`))
	}
	execFileSync("pnpm", ["readme"], { cwd: ROOT, stdio: "inherit" })
	console.log(`\nInitialised ${name} for ${slug}. Review the diff, commit, then run: pnpm release:baseline`)
}

if (isMain(import.meta.url)) main()
