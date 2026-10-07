import { git, latestTag } from "./lib/git.ts"
import { Marketplace, MARKETPLACE_PATH, pluginNames, readJson, readPlugin } from "./lib/manifests.ts"

/**
 * Tags HEAD with each release unit's current version, so the first release counts only the commits
 * made after it and does not replay the history of a repository created from the template.
 */
function main(): void {
	const marketplaceVersion = readJson(MARKETPLACE_PATH, Marketplace).metadata?.version ?? "0.1.0"
	const wanted = [
		...pluginNames().map((name) => [name, readPlugin(name).version] as const),
		["marketplace", marketplaceVersion] as const,
	]
	for (const [unit, version] of wanted) {
		if (latestTag(`${unit}@*`) !== undefined) {
			console.log(`${unit}: already tagged`)
			continue
		}
		git(["tag", "-a", `${unit}@${version}`, "-m", `${unit}@${version}`])
		console.log(`tagged ${unit}@${version}`)
	}
	console.log("Push the tags with: git push --tags")
}

main()
