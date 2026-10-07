import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { z } from "zod"

export const ROOT = fileURLToPath(new URL("../..", import.meta.url))
export const PLUGINS_DIR = join(ROOT, "plugins")
export const MARKETPLACE_PATH = join(ROOT, ".claude-plugin", "marketplace.json")

/** Only the fields the scripts read are named; every other field is kept as it is when a manifest is rewritten. */
export const PluginManifest = z.looseObject({
	name: z.string(),
	version: z.string(),
	description: z.string(),
	defaultEnabled: z.boolean().optional(),
})
export type PluginManifest = z.infer<typeof PluginManifest>

export const Marketplace = z.looseObject({
	name: z.string(),
	owner: z.looseObject({ name: z.string() }),
	metadata: z.looseObject({ description: z.string().optional(), version: z.string().optional() }).optional(),
	plugins: z.array(
		z.looseObject({
			name: z.string(),
			source: z.string(),
			description: z.string().optional(),
			category: z.string().optional(),
		}),
	),
})
export type Marketplace = z.infer<typeof Marketplace>

export function readJson<T>(path: string, schema: z.ZodType<T>): T {
	return schema.parse(JSON.parse(readFileSync(path, "utf8")))
}

export function writeJson(path: string, value: unknown): void {
	writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

export function pluginManifestPath(name: string): string {
	return join(PLUGINS_DIR, name, ".claude-plugin", "plugin.json")
}

/** Names of the plugin directories that carry a manifest, sorted. */
export function pluginNames(): string[] {
	return readdirSync(PLUGINS_DIR, { withFileTypes: true })
		.filter((entry) => entry.isDirectory() && existsSync(pluginManifestPath(entry.name)))
		.map((entry) => entry.name)
		.sort()
}

export function readPlugin(name: string): PluginManifest {
	return readJson(pluginManifestPath(name), PluginManifest)
}
