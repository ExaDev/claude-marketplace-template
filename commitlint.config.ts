import type { UserConfig } from "@commitlint/types"
import { COMMIT_TYPE_NAMES } from "./scripts/lib/commit-types.ts"
import { skipTokensIn } from "./scripts/lib/ci-skip-tokens.ts"

/** Types come from the same table the release script reads, so linting and releasing cannot disagree. */
const config: UserConfig = {
	extends: ["@commitlint/config-conventional"],
	plugins: [
		{
			rules: {
				// A skip token in a pull request's commits blocks its required checks with no explanation.
				"no-ci-skip-token": ({ raw }) => {
					const found = skipTokensIn(raw ?? "")
					return [found.length === 0, `must not contain a token that skips workflows: ${found.join(", ")}`]
				},
			},
		},
	],
	rules: {
		"type-enum": [2, "always", COMMIT_TYPE_NAMES],
		"body-max-line-length": [2, "always", 100],
		"no-ci-skip-token": [2, "always"],
	},
}

export default config
