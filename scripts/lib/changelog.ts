import { COMMIT_TYPES } from "./commit-types.ts"
import type { ParsedCommit } from "./conventional.ts"

/** Renders one release as a changelog section, grouped by the heading each commit type maps to. */
export function formatSection(version: string, date: string, commits: readonly ParsedCommit[]): string {
	const bySection = new Map<string, string[]>()
	for (const commit of commits) {
		const heading = commit.breaking ? "Breaking changes" : COMMIT_TYPES[commit.type].section
		const scope = commit.scope === undefined ? "" : `**${commit.scope}:** `
		bySection.set(heading, [...(bySection.get(heading) ?? []), `- ${scope}${commit.description}`])
	}
	const body = [...bySection].map(([heading, lines]) => `### ${heading}\n\n${lines.join("\n")}`).join("\n\n")
	return `## ${version} (${date})\n\n${body}\n`
}

/** Puts a section under the changelog title, above earlier releases. */
export function prependSection(existing: string | undefined, section: string): string {
	if (existing === undefined || existing.trim() === "") return `# Changelog\n\n${section}`
	const [title = "# Changelog", ...rest] = existing.split("\n")
	return `${title}\n\n${section}\n${rest.join("\n").replace(/^\n+/, "")}`
}
