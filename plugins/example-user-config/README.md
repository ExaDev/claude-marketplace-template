# example-user-config

`userConfig` declares values Claude Code asks for when the plugin is enabled. Non-sensitive values are substituted as `${user_config.KEY}` in skill and agent content, MCP and LSP config. A sensitive value (`"sensitive": true`) goes to the system credential store and is reachable from hooks as `CLAUDE_PLUGIN_OPTION_<KEY>`, never from skill text. Each option also appears in `/config`.

## Try it

```text
/plugin install example-user-config@example-marketplace
/example-user-config:greet
```

## Content owner

Replace this section with the team or person who owns the content of this plugin and how to propose a change. Plugins that capture how a team works are best owned by the people doing the work.
