import { isMain } from "./lib/is-main.ts"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { prependSection, formatSection } from "./lib/changelog.ts"
import { highestLevel, parseCommit, releaseLevel, type ParsedCommit, type ReleaseLevel } from "./lib/conventional.ts"
import { commitsTouching, git, latestTag, type RawCommit } from "./lib/git.ts"
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
import { bump } from "./lib/semver.ts"

/** Release commits are excluded from attribution, so a release cannot trigger another release. */
export const RELEASE_PREFIX = "chore(release): "

export interface ReleasePlan {
	readonly level: ReleaseLevel
	readonly next: string
	readonly commits: readonly ParsedCommit[]
}

/** Decides the next version from the commits that touched a unit, or undefined when none asks for a release. */
export function planRelease(currentVersion: string, raw: readonly RawCommit[]): ReleasePlan | undefined {
	const commits = raw
		.filter((commit) => !commit.subject.startsWith(RELEASE_PREFIX))
		.flatMap((commit) => {
			const parsed = parseCommit(commit.subject, commit.body)
			return parsed === undefined ? [] : [parsed]
		})
	const level = highestLevel(commits.map(releaseLevel))
	if (level === undefined) return undefined
	return { level, next: bump(currentVersion, level), commits: commits.filter((c) => releaseLevel(c) !== undefined) }
}

interface Unit {
	/** Plugin name, or "marketplace" for everything outside plugins/. */
	readonly name: string
	readonly pathspecs: readonly string[]
	readonly version: () => string
	readonly write: (version: string, section: string) => string[]
}

function changelogWrite(path: string, section: string): void {
	writeFileSync(path, prependSection(existsSync(path) ? readFileSync(path, "utf8") : undefined, section))
}

function units(): Unit[] {
	const plugins: Unit[] = pluginNames().map((name) => ({
		name,
		pathspecs: [`plugins/${name}`],
		version: () => readPlugin(name).version,
		write: (version, section) => {
			const path = pluginManifestPath(name)
			writeJson(path, { ...readPlugin(name), version })
			const changelog = join(PLUGINS_DIR, name, "CHANGELOG.md")
			changelogWrite(changelog, section)
			return [path, changelog]
		},
	}))
	const marketplace: Unit = {
		name: "marketplace",
		pathspecs: [".", ":(exclude)plugins"],
		version: () => readJson(MARKETPLACE_PATH, Marketplace).metadata?.version ?? "0.1.0",
		write: (version, section) => {
			const current = readJson(MARKETPLACE_PATH, Marketplace)
			writeJson(MARKETPLACE_PATH, { ...current, metadata: { ...current.metadata, version } })
			const changelog = join(ROOT, "CHANGELOG.md")
			changelogWrite(changelog, section)
			return [MARKETPLACE_PATH, changelog]
		},
	}
	return [...plugins, marketplace]
}

function main(): void {
	const dryRun = process.argv.includes("--dry-run")
	const date = new Date().toISOString().slice(0, 10)
	let released = 0
	for (const unit of units()) {
		const tag = latestTag(`${unit.name}@*`)
		if (tag === undefined) {
			console.error(`${unit.name}: no baseline tag. Run "pnpm init:marketplace" or tag the current version first.`)
			process.exit(1)
		}
		const plan = planRelease(unit.version(), commitsTouching(tag, unit.pathspecs))
		if (plan === undefined) continue
		const label = `${unit.name}@${plan.next}`
		console.log(`${label} (${plan.level}, ${plan.commits.length} commits)`)
		if (dryRun) continue
		const files = unit.write(plan.next, formatSection(plan.next, date, plan.commits))
		git(["add", "--", ...files])
		git(["commit", "-m", `${RELEASE_PREFIX}${label}`])
		git(["tag", "-a", label, "-m", label])
		released += 1
	}
	if (released === 0 && !dryRun) console.log("Nothing to release.")
}

if (isMain(import.meta.url)) main()
