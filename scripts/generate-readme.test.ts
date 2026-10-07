import assert from "node:assert/strict"
import { test } from "node:test"
import { renderTable, replaceBetweenMarkers } from "./generate-readme.ts"

test("renders one row per plugin", () => {
	const table = renderTable([{ name: "a", version: "1.0.0", category: "skills", description: "Does a.", startsEnabled: true }])
	assert.match(table, /\| \[`a`\]\(plugins\/a\) \| 1\.0\.0 \| skills \| Does a\. \|/)
})

test("marks a plugin that starts disabled", () => {
	const table = renderTable([{ name: "b", version: "0.1.0", category: "lsp", description: "Does b.", startsEnabled: false }])
	assert.match(table, /Does b\. \(starts disabled\) \|/)
})

test("replaces only what is between the markers", () => {
	const out = replaceBetweenMarkers("before\n<!-- plugins:start -->\nold\n<!-- plugins:end -->\nafter", "new")
	assert.equal(out, "before\n<!-- plugins:start -->\nnew\n<!-- plugins:end -->\nafter")
})

test("fails loudly without markers", () => {
	assert.throws(() => replaceBetweenMarkers("nothing here", "x"))
})
