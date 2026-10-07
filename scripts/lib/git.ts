import { execFileSync } from "node:child_process"
import { ROOT } from "./manifests.ts"

export function git(args: readonly string[]): string {
	return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).trimEnd()
}

/** The newest tag matching a glob, by version order, or undefined when there is none. */
export function latestTag(glob: string): string | undefined {
	const tags = git(["tag", "--list", glob, "--sort=-v:refname"]).split("\n").filter((line) => line !== "")
	return tags[0]
}

export interface RawCommit {
	readonly hash: string
	readonly subject: string
	readonly body: string
}

const FIELD = "\u001f"
const RECORD = "\u001e"

/** Commits after `since` (or all of them) that touch the given pathspecs, newest first. */
export function commitsTouching(since: string | undefined, pathspecs: readonly string[]): RawCommit[] {
	const range = since === undefined ? ["HEAD"] : [`${since}..HEAD`]
	const out = git(["log", ...range, `--format=%H${FIELD}%s${FIELD}%b${RECORD}`, "--", ...pathspecs])
	return out
		.split(RECORD)
		.map((record) => record.trim())
		.filter((record) => record !== "")
		.map((record) => {
			const [hash = "", subject = "", body = ""] = record.split(FIELD)
			return { hash, subject, body }
		})
}
