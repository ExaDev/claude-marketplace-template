import { spawnSync } from "node:child_process"
import { join } from "node:path"
import { PLUGINS_DIR, ROOT, pluginNames } from "./lib/manifests.ts"

/**
 * Runs `claude plugin validate --strict` on the marketplace and on every plugin directory.
 * The marketplace run does not open the components of plugins it lists, so each plugin is
 * validated on its own. Set CLAUDE_BIN to use a Claude Code binary that is not on PATH.
 */
function main(): void {
	const claude = process.env["CLAUDE_BIN"] ?? "claude"
	const targets = [ROOT, ...pluginNames().map((name) => join(PLUGINS_DIR, name))]
	let failed = 0
	for (const target of targets) {
		const result = spawnSync(claude, ["plugin", "validate", target, "--strict"], { encoding: "utf8" })
		const label = target === ROOT ? "marketplace" : `plugins/${target.slice(PLUGINS_DIR.length + 1)}`
		if (result.error !== undefined) {
			console.error(`Could not run ${claude}: ${result.error.message}`)
			process.exit(1)
		}
		if (result.status === 0) {
			console.log(`ok    ${label}`)
		} else {
			failed += 1
			console.error(`FAIL  ${label}\n${result.stdout}${result.stderr}`)
		}
	}
	if (failed > 0) process.exit(1)
}

main()
