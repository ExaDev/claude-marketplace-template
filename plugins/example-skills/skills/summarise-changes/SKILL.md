---
description: Summarise the changes on the current branch for a pull request description. Use when asked to describe, summarise or write up a branch or a diff.
argument-hint: "[base-branch]"
allowed-tools: Bash(git log:*), Bash(git diff:*), Read
---

Summarise what changed on the current branch against `$ARGUMENTS`, or against `main` when no argument is given.

1. Run `git log --oneline` and `git diff --stat` for the range.
2. Read the style rules in `${CLAUDE_PLUGIN_ROOT}/skills/summarise-changes/references/style.md`.
3. Write the summary to those rules: what changed and why, in plain sentences, with no list of every file.
