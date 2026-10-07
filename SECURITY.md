# Security

A plugin runs code on the machines of everyone who enables it: hooks run commands, MCP servers and language servers are processes, and `bin/` scripts are put on the shell's `PATH`. Treat a pull request that adds or changes any of these as code review, not as a documentation change, and read what it runs before you merge it.

## Reporting a vulnerability

Please report a vulnerability privately, through this repository's **Security** tab (Report a vulnerability), and not in a public issue. Include what you found, how to reproduce it and which plugin it affects.

## What not to commit

Secrets of any kind, including tokens in `.mcp.json` files, hook scripts and plugin settings. A plugin that needs a credential declares it in `userConfig` with `"sensitive": true`, so Claude Code asks the user for it and stores it in the system credential store.
