import assert from "node:assert/strict"
import { test } from "node:test"
import { handle } from "./protocol.mjs"

test("initialises and lists its tool", () => {
  assert.equal(handle({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} }).result.serverInfo.name, "example-mcp")
  assert.equal(handle({ jsonrpc: "2.0", id: 2, method: "tools/list" }).result.tools[0].name, "add")
})

test("adds numbers and rejects bad input", () => {
  const ok = handle({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "add", arguments: { a: 2, b: 3 } } })
  assert.equal(ok.result.content[0].text, "5")
  assert.ok(handle({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "add", arguments: { a: "x" } } }).error)
})

test("notifications get no response", () => {
  assert.equal(handle({ jsonrpc: "2.0", method: "notifications/initialized" }), undefined)
})
