# Repository rules

The ruleset in `.github/rulesets/main.json` protects `main`: no deletion, no force pushes, changes only through a pull request that is rebase-merged with its review threads resolved, and three required checks that must pass, `validate`, `commitlint` and `ci-skip-guard`.

Rulesets are repository settings, so they do not come across when a repository is created from a template. Apply it once per repository.

**Plan requirement.** Rulesets and branch protection on a private repository need a paid GitHub plan (Team or higher for an organisation). On a free organisation the API answers `403 Upgrade to GitHub Pro or make this repository public`, and a private marketplace there has no enforced protection: CI still runs, but nothing makes the checks required. Public repositories can use rulesets on any plan.

## Why these rules

- **Rebase merge only.** Each commit's type decides a plugin's release, so history has to keep the individual commits. A squash merge collapses them into one.
- **Required checks never skipped.** `validate` and `commitlint` have no paths filter, so they always run; a required check that does not run leaves a pull request blocked for good. `ci-skip-guard` catches the other way a check goes missing, a skip token in a commit message.
- **No approvals required by default.** A small team can raise `required_approving_review_count`, and a repository that holds plugins others install should.

## Applying it

Read the current rulesets first, and send the change as a full body. The update endpoint replaces the whole ruleset (PUT), so a partial body removes the rules it leaves out.

```bash
# create
gh api --method POST repos/<org>/<repo>/rulesets --input .github/rulesets/main.json

# update an existing ruleset: find its id, then replace it
gh api repos/<org>/<repo>/rulesets --jq '.[] | [.id, .name] | @tsv'
gh api --method PUT repos/<org>/<repo>/rulesets/<id> --input .github/rulesets/main.json
```

Then confirm it took effect by opening a pull request that fails a check, and by trying to push to `main` directly. The ruleset lets deploy keys bypass it (`actor_type` `DeployKey`), which is how the [release workflow](releasing.md) pushes its release commit: any deploy key with write access can push to `main`, so add one only for the release workflow and keep its private half in the `RELEASE_DEPLOY_KEY` secret.

## Without rulesets: merge-when-green

On a private repository on a free plan there is no ruleset, no required status check and no GitHub auto-merge. [ExaDev/merge-when-green](https://github.com/ExaDev/merge-when-green) does the waiting instead: a pull request labelled `automerge` is merged once one named check has passed on its head commit, it is not a draft and it has no unresolved review thread. Nothing stops a person merging by hand; the action only saves waiting.

Set it up once per repository:

1. Make one job that passes only when the others did, named `Required checks`: it `needs` every job, runs with `if: always()`, and fails unless each result is `success`. A job's check name is its id unless it sets `name`, so set `name: Required checks`, or the action reports the check as missing.
2. Add a workflow that runs the action on `workflow_run` (when your CI workflow completes) and on `pull_request_target` (`labeled`, `ready_for_review`), with `merge-method: fast-forward`, `update-behind: true`, `ssh-key` set to the release deploy key and `required-check: Required checks`. It must not check out pull request code. The full example is in the action's README.
3. Create the `automerge` label.

A fast-forward push with a deploy key keeps each commit (the history the release script reads) and, unlike a push made with `GITHUB_TOKEN`, starts the release workflow. The workflow file has to be on the default branch before it can act on a pull request, so the pull request that adds it is merged by hand.
