import { COMMIT_TYPES, isCommitType, type CommitTypeName } from "./commit-types.ts"

export type ReleaseLevel = "major" | "minor" | "patch"

export interface ParsedCommit {
	readonly type: CommitTypeName
	readonly scope: string | undefined
	readonly breaking: boolean
	readonly description: string
}

const SUBJECT = /^(?<type>[a-z]+)(?:\((?<scope>[^)]+)\))?(?<bang>!)?: (?<description>.+)$/
const BREAKING_FOOTER = /^BREAKING[ -]CHANGE: /m

/** Parses a conventional commit, or returns undefined when the subject is not one or its type is unknown. */
export function parseCommit(subject: string, body: string): ParsedCommit | undefined {
	const groups = SUBJECT.exec(subject)?.groups
	if (groups === undefined) return undefined
	const { type, scope, bang, description } = groups
	if (type === undefined || description === undefined || !isCommitType(type)) return undefined
	return { type, scope, breaking: bang !== undefined || BREAKING_FOOTER.test(body), description }
}

/** The release a commit asks for, or undefined when it asks for none. */
export function releaseLevel(commit: ParsedCommit): ReleaseLevel | undefined {
	if (commit.breaking) return "major"
	const level = COMMIT_TYPES[commit.type].release
	return level === "none" ? undefined : level
}

const RANK: Record<ReleaseLevel, number> = { patch: 1, minor: 2, major: 3 }

export function highestLevel(levels: readonly (ReleaseLevel | undefined)[]): ReleaseLevel | undefined {
	let best: ReleaseLevel | undefined
	for (const level of levels) {
		if (level !== undefined && (best === undefined || RANK[level] > RANK[best])) best = level
	}
	return best
}
