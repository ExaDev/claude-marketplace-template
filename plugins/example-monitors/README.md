# example-monitors

A monitor is a shell command that runs in the background for the session, and what it prints reaches Claude as notifications. `when` can be `always` (the default) or `on-skill-invoke:<skill>`, as here, so nothing runs until the skill is used. Monitors run only in interactive sessions. A monitor command cannot reference `${user_config.*}`.

## Try it

```text
/plugin install example-monitors@example-marketplace
/plugin enable example-monitors@example-marketplace
/example-monitors:start-heartbeat
```

## Content owner

Replace this section with the team or person who owns the content of this plugin and how to propose a change. Plugins that capture how a team works are best owned by the people doing the work.
