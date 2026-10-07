# example-hooks

Hooks run a command when something happens in a session. `hooks/hooks.json` wraps the event map in a top-level `hooks` key (a file without it fails to load). The command uses exec form, with `args`, so the path from `${CLAUDE_PLUGIN_ROOT}` is one argument and needs no quoting. `SessionStart` output joins the context; a `PreToolUse` hook that exits with code 2 blocks the call.

## Try it

```text
/plugin install example-hooks@example-marketplace
```

Then ask Claude to run `git add -A`: the call is blocked with a reason. The logic is in `scripts/guard.mjs` and tested in `scripts/guard.test.mjs`.

## Content owner

Replace this section with the team or person who owns the content of this plugin and how to propose a change. Plugins that capture how a team works are best owned by the people doing the work.
