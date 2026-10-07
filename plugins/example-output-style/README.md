# example-output-style

An output style is a Markdown file with `name` and `description` frontmatter whose body changes how Claude replies. Plugin styles appear in `/output-style` as `<plugin>:<name>`. This plugin starts disabled so installing it does not change anyone's replies.

## Try it

```text
/plugin install example-output-style@example-marketplace
/plugin enable example-output-style@example-marketplace
/output-style example-output-style:plain-english
```

## Content owner

Replace this section with the team or person who owns the content of this plugin and how to propose a change. Plugins that capture how a team works are best owned by the people doing the work.
