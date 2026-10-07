import assert from "node:assert/strict"
import { test } from "node:test"
import { planRelease } from "./release.ts"

const commit = (subject: string, body = "") => ({ hash: "0".repeat(40), subject, body })

test("the highest level among the commits decides the version", () => {
	const plan = planRelease("1.2.3", [commit("fix: a"), commit("feat: b"), commit("chore: c")])
	assert.equal(plan?.next, "1.3.0")
	assert.equal(plan?.commits.length, 2)
})

test("a breaking change releases a major", () => {
	assert.equal(planRelease("1.2.3", [commit("fix: a", "BREAKING CHANGE: gone")])?.next, "2.0.0")
})

test("commits that ask for no release produce no plan", () => {
	assert.equal(planRelease("1.2.3", [commit("chore: a"), commit("ci: b"), commit("not conventional")]), undefined)
})

test("release commits are ignored, so a release cannot trigger another", () => {
	assert.equal(planRelease("1.2.3", [commit("chore(release): example@1.2.3")]), undefined)
})
