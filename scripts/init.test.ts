import assert from "node:assert/strict"
import { test } from "node:test"
import { validMarketplaceName } from "./init.ts"

test("accepts kebab-case names and rejects reserved or malformed ones", () => {
	assert.equal(validMarketplaceName("acme-tools"), undefined)
	assert.ok(validMarketplaceName("Acme Tools"))
	assert.ok(validMarketplaceName("claude-tools"))
	assert.ok(validMarketplaceName("double--hyphen"))
})
