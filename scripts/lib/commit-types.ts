/** What a commit of one type does to a release and to the changelog. */
export interface CommitTypeRule {
	/** The release a commit of this type triggers for the plugin it touches. */
	readonly release: "minor" | "patch" | "none"
	/** Changelog heading the commit is listed under. */
	readonly section: string
}

/**
 * The single source of truth for commit types: commitlint reads the names and the release
 * script reads the rules, so linting and releasing cannot disagree. A plugin's documentation
 * and skills are its product, so `docs` releases a patch; `chore`, `ci`, `test`, `style` and
 * `build` never do.
 */
export const COMMIT_TYPES = {
	feat: { release: "minor", section: "Features" },
	fix: { release: "patch", section: "Bug fixes" },
	perf: { release: "patch", section: "Performance" },
	refactor: { release: "patch", section: "Refactoring" },
	docs: { release: "patch", section: "Documentation" },
	build: { release: "none", section: "Build" },
	chore: { release: "none", section: "Chores" },
	ci: { release: "none", section: "Continuous integration" },
	style: { release: "none", section: "Style" },
	test: { release: "none", section: "Tests" },
} as const satisfies Record<string, CommitTypeRule>

export type CommitTypeName = keyof typeof COMMIT_TYPES

export const COMMIT_TYPE_NAMES: string[] = Object.keys(COMMIT_TYPES)

export function isCommitType(value: string): value is CommitTypeName {
	return Object.hasOwn(COMMIT_TYPES, value)
}
