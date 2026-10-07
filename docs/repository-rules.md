# Repository rules

The ruleset in `.github/rulesets/main.json` protects `main`: no deletion, no force pushes, changes only through a pull request that is rebase-merged with its review threads resolved, and three required checks that must pass, `validate`, `commitlint` and `ci-skip-guard`.

Rulesets are repository settings, so they do not come across when a repository is created from a template. Apply it once per repository.

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
