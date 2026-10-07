import { createInterface } from "node:readline"
import { handle } from "./protocol.mjs"

// MCP over stdio is one JSON-RPC message per line. Only protocol messages may go to stdout.
for await (const line of createInterface({ input: process.stdin })) {
  if (line.trim() === "") continue
  const response = handle(JSON.parse(line))
  if (response !== undefined) process.stdout.write(`${JSON.stringify(response)}\n`)
}
