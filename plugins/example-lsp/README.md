# example-lsp

`.lsp.json` maps file extensions to a language server. Claude Code starts the server and feeds its diagnostics back after edits. `command` and `extensionToLanguage` are required. This plugin starts disabled because it needs the server installed.

## Try it

Install the server (`npm install -g vscode-langservers-extracted`), then:

```text
/plugin install example-lsp@example-marketplace
/plugin enable example-lsp@example-marketplace
```

## Content owner

Replace this section with the team or person who owns the content of this plugin and how to propose a change. Plugins that capture how a team works are best owned by the people doing the work.
