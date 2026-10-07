# example-skills

A skill is a folder holding `SKILL.md`, whose frontmatter `description` tells Claude when to use it. This one also bundles a reference file, which the skill reads through `${CLAUDE_PLUGIN_ROOT}` so the path is right wherever the plugin is installed.

## Try it

```text
/plugin install example-skills@example-marketplace
/example-skills:summarise-changes main
```

Skills are namespaced by the plugin name. Prefer skills over commands for new work.

## Content owner

Replace this section with the team or person who owns the content of this plugin and how to propose a change. Plugins that capture how a team works are best owned by the people doing the work.
