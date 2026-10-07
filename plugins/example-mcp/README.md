# example-mcp

`.mcp.json` at the plugin root declares MCP servers; `${CLAUDE_PLUGIN_ROOT}` makes the path independent of where the plugin is installed. The server here speaks the protocol over stdio with no dependencies, so it can be read in one sitting. A real server would use an MCP SDK.

## Try it

```text
/plugin install example-mcp@example-marketplace
```

Then ask Claude to use the `add` tool from the `example-mcp` server. The protocol logic is in `server/protocol.mjs` and tested in `server/protocol.test.mjs`.

## Content owner

Replace this section with the team or person who owns the content of this plugin and how to propose a change. Plugins that capture how a team works are best owned by the people doing the work.
