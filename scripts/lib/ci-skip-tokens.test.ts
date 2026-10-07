import assert from "node:assert/strict"
import { test } from "node:test"
import { skipTokensIn } from "./ci-skip-tokens.ts"

test("finds skip tokens in any case", () => {
	assert.deepEqual(skipTokensIn("fix: thing\n\n[Skip CI]"), ["[skip ci]"])
})

test("leaves ordinary messages alone", () => {
	assert.deepEqual(skipTokensIn("fix: do not skip the ci step"), [])
})
