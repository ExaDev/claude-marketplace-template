# example-workflow

A workflow is a JavaScript script that orchestrates many subagents. It starts with `export const meta` (a plain object with a `name` and `description`), then top-level `await` over `agent()`, `pipeline()` and `parallel()`. It cannot import modules, and `Date.now()` and `Math.random()` throw so a run can be resumed. Plugin workflows are namespaced by plugin: this one runs as `/example-workflow:summarise-readmes`. A run spawns many agents and uses real usage, so this plugin starts disabled.

## Try it

```text
/plugin install example-workflow@example-marketplace
/plugin enable example-workflow@example-marketplace
/example-workflow:summarise-readmes
```

## Content owner

Replace this section with the team or person who owns the content of this plugin and how to propose a change. Plugins that capture how a team works are best owned by the people doing the work.
