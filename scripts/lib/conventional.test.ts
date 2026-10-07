import assert from "node:assert/strict"
import { test } from "node:test"
import { highestLevel, parseCommit, releaseLevel } from "./conventional.ts"

test("parses type, scope, bang and description", () => {
	assert.deepEqual(parseCommit("feat(example-skills)!: add a thing", ""), {
		type: "feat",
		scope: "example-skills",
		breaking: true,
		description: "add a thing",
	})
})

test("a BREAKING CHANGE footer marks the commit breaking", () => {
	assert.equal(parseCommit("fix: tidy", "Why.\n\nBREAKING CHANGE: renamed")?.breaking, true)
})

test("rejects non-conventional subjects and unknown types", () => {
	assert.equal(parseCommit("Update stuff", ""), undefined)
	assert.equal(parseCommit("wip: thing", ""), undefined)
})

test("release levels follow the type table", () => {
	const level = (subject: string) => {
		const commit = parseCommit(subject, "")
		return commit === undefined ? undefined : releaseLevel(commit)
	}
	assert.equal(level("feat: x"), "minor")
	assert.equal(level("docs: x"), "patch")
	assert.equal(level("chore: x"), undefined)
	assert.equal(level("refactor!: x"), "major")
})

test("highestLevel picks the largest and ignores undefined", () => {
	assert.equal(highestLevel(["patch", undefined, "minor"]), "minor")
	assert.equal(highestLevel([undefined]), undefined)
})
