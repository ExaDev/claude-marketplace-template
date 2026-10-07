import assert from "node:assert/strict"
import { test } from "node:test"
import { renderMarketplaceReadme } from "./marketplace-readme.ts"

const vars = { name: "acme-tools", owner: "Acme", slug: "acme/claude-marketplace", description: "Tools for Acme.", license: "MIT" }

test("names the marketplace, the install command and the plugin table markers", () => {
	const readme = renderMarketplaceReadme(vars)
	assert.match(readme, /^# acme-tools/)
	assert.match(readme, /\/plugin marketplace add acme\/claude-marketplace/)
	assert.match(readme, /<!-- plugins:start -->\n<!-- plugins:end -->/)
})

test("an unlicensed marketplace says it is private", () => {
	assert.match(renderMarketplaceReadme({ ...vars, license: "UNLICENSED" }), /Private\. Not licensed for reuse\./)
})
