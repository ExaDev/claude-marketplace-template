# example-bin

Files in `bin/` are on the Bash tool's `PATH` while the plugin is enabled, so Claude can run them as bare commands. Plugin directories come after the user's own `PATH`, so a plugin cannot shadow `git` or `ls`. Mark scripts executable. claude.ai and Cowork do not install a plugin with a top-level `bin/`, so keep executables out of plugins you also distribute there.

## Try it

```text
/plugin install example-bin@example-marketplace
```

Then ask Claude to run `example-hello`.

## Content owner

Replace this section with the team or person who owns the content of this plugin and how to propose a change. Plugins that capture how a team works are best owned by the people doing the work.
