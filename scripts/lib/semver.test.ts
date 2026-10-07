import assert from "node:assert/strict"
import { test } from "node:test"
import { bump } from "./semver.ts"

test("bumps each level and resets lower parts", () => {
	assert.equal(bump("1.2.3", "patch"), "1.2.4")
	assert.equal(bump("1.2.3", "minor"), "1.3.0")
	assert.equal(bump("1.2.3", "major"), "2.0.0")
})

test("rejects versions it cannot bump", () => {
	assert.throws(() => bump("1.2.3-beta.1", "patch"))
})
