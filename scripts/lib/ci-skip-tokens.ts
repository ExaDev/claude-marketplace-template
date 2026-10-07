/**
 * Strings that make GitHub skip the workflows for a push or pull request. A token in a pull request's
 * commits stops the required checks reporting at all, so the pull request is blocked with no
 * explanation and nothing to fix. Source: GitHub Docs, "Skipping workflow runs".
 */
export const CI_SKIP_TOKENS: readonly string[] = ["[skip ci]", "[ci skip]", "[no ci]", "[skip actions]", "[actions skip]", "skip-checks: true"]

/** The tokens a commit message contains, compared without regard to case. */
export function skipTokensIn(message: string): string[] {
	const lower = message.toLowerCase()
	return CI_SKIP_TOKENS.filter((token) => lower.includes(token))
}
