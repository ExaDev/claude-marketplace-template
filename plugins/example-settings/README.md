# example-settings

A `settings.json` at the plugin root sets defaults while the plugin is enabled. Only `agent` and `subagentStatusLine` take effect; other keys are dropped. A user's own settings override the plugin's. Because this changes the main conversation's agent, the plugin starts disabled.

## Try it

```text
/plugin install example-settings@example-marketplace
/plugin enable example-settings@example-marketplace
```

## Content owner

Replace this section with the team or person who owns the content of this plugin and how to propose a change. Plugins that capture how a team works are best owned by the people doing the work.
