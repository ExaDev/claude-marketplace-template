import assert from "node:assert/strict"
import { test } from "node:test"
import { formatSection, prependSection } from "./changelog.ts"

test("groups commits by section and marks breaking ones", () => {
	const section = formatSection("1.1.0", "2026-01-02", [
		{ type: "feat", scope: "a", breaking: false, description: "add x" },
		{ type: "fix", scope: undefined, breaking: false, description: "repair y" },
		{ type: "refactor", scope: undefined, breaking: true, description: "rename z" },
	])
	assert.match(section, /^## 1\.1\.0 \(2026-01-02\)/)
	assert.match(section, /### Features\n\n- \*\*a:\*\* add x/)
	assert.match(section, /### Bug fixes\n\n- repair y/)
	assert.match(section, /### Breaking changes\n\n- rename z/)
})

test("prepends under the title and creates a changelog when there is none", () => {
	assert.equal(prependSection(undefined, "## 1.0.0\n"), "# Changelog\n\n## 1.0.0\n")
	const next = prependSection("# Changelog\n\n## 1.0.0\n\n- old\n", "## 1.1.0\n\n- new\n")
	assert.ok(next.indexOf("## 1.1.0") < next.indexOf("## 1.0.0"))
})
