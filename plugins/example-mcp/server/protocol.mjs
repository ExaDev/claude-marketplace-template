const PROTOCOL_VERSION = "2025-06-18"

const TOOLS = [
  {
    name: "add",
    description: "Add two numbers.",
    inputSchema: {
      type: "object",
      properties: { a: { type: "number" }, b: { type: "number" } },
      required: ["a", "b"],
    },
  },
]

/** Handles one JSON-RPC message and returns the response, or undefined for a notification. */
export function handle(message) {
  const { id, method, params } = message
  const reply = (result) => ({ jsonrpc: "2.0", id, result })
  const fail = (code, text) => ({ jsonrpc: "2.0", id, error: { code, message: text } })
  if (id === undefined) return undefined
  switch (method) {
    case "initialize":
      return reply({
        protocolVersion: params?.protocolVersion ?? PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: "example-mcp", version: "0.1.0" },
      })
    case "ping":
      return reply({})
    case "tools/list":
      return reply({ tools: TOOLS })
    case "tools/call": {
      const { name, arguments: args } = params ?? {}
      if (name !== "add" || typeof args?.a !== "number" || typeof args?.b !== "number") return fail(-32602, "add needs numbers a and b")
      return reply({ content: [{ type: "text", text: String(args.a + args.b) }] })
    }
    default:
      return fail(-32601, `Method not found: ${method}`)
  }
}
