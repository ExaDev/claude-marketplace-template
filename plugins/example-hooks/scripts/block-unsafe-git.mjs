import { unsafeReason } from "./guard.mjs"

// A PreToolUse hook receives the tool call as JSON on stdin. Exit code 2 blocks the call and sends stderr to Claude.
let input = ""
for await (const chunk of process.stdin) input += chunk
const command = JSON.parse(input)?.tool_input?.command
const reason = typeof command === "string" ? unsafeReason(command) : undefined
if (reason !== undefined) {
  console.error(`Blocked: ${reason}`)
  process.exit(2)
}
