import assert from "node:assert/strict"
import { test } from "node:test"
import { unsafeReason } from "./guard.mjs"

test("blocks blanket staging and skipped hooks", () => {
  assert.ok(unsafeReason("git add -A"))
  assert.ok(unsafeReason("git add ."))
  assert.ok(unsafeReason("git commit -m x --no-verify"))
})

test("allows staging by name and ordinary commits", () => {
  assert.equal(unsafeReason("git add src/a.ts"), undefined)
  assert.equal(unsafeReason("git commit -m 'fix: x'"), undefined)
  assert.equal(unsafeReason("ls -la"), undefined)
})
