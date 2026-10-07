import { isMain } from "./lib/is-main.ts"
import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { Marketplace, MARKETPLACE_PATH, ROOT, readJson, readPlugin } from "./lib/manifests.ts"

const START = "<!-- plugins:start -->"
const END = "<!-- plugins:end -->"

export interface PluginRow {
	readonly name: string
	readonly version: string
	readonly category: string
	readonly description: string
	/** False when the plugin's manifest sets defaultEnabled to false, so it starts switched off. */
	readonly startsEnabled: boolean
}

/** The plugin table that sits between the markers in README.md. Versions come from each plugin.json. */
export function renderTable(rows: readonly PluginRow[]): string {
	const lines = [
		"| Plugin | Version | Category | What it provides |",
		"| --- | --- | --- | --- |",
		...rows.map((row) => `| [\`${row.name}\`](plugins/${row.name}) | ${row.version} | ${row.category} | ${row.description}${row.startsEnabled ? "" : " (starts disabled)"} |`),
	]
	return lines.join("\n")
}

/** Replaces what is between the markers, and fails when a marker is missing. */
export function replaceBetweenMarkers(readme: string, table: string): string {
	const start = readme.indexOf(START)
	const end = readme.indexOf(END)
	if (start === -1 || end === -1 || end < start) throw new Error(`README.md needs ${START} and ${END}`)
	return `${readme.slice(0, start + START.length)}\n${table}\n${readme.slice(end)}`
}

/** Rewrites the plugin table in README.md. Returns the README's path so a caller can stage it. */
export function updateReadme(): string {
	const readmePath = join(ROOT, "README.md")
	writeFileSync(readmePath, replaceBetweenMarkers(readFileSync(readmePath, "utf8"), renderTable(pluginRows())))
	return readmePath
}

function pluginRows(): PluginRow[] {
	const marketplace = readJson(MARKETPLACE_PATH, Marketplace)
	return marketplace.plugins.map((entry) => {
		const manifest = readPlugin(entry.name)
		return {
			name: entry.name,
			version: manifest.version,
			category: entry.category ?? "",
			description: entry.description ?? manifest.description,
			startsEnabled: manifest.defaultEnabled !== false,
		}
	})
}

function main(): void {
	if (!process.argv.includes("--check")) {
		updateReadme()
		return
	}
	const readmePath = join(ROOT, "README.md")
	const current = readFileSync(readmePath, "utf8")
	if (replaceBetweenMarkers(current, renderTable(pluginRows())) !== current) {
		console.error("README.md plugin table is out of date. Run: pnpm readme")
		process.exit(1)
	}
}

if (isMain(import.meta.url)) main()
