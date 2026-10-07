import { readFileSync } from "node:fs"
import { z } from "zod"
import { skipTokensIn } from "./lib/ci-skip-tokens.ts"

/**
 * Reads the JSON array of commit messages a pull request carries from the file named in the first
 * argument, and fails when any contains a token that makes GitHub skip workflows. The workflow that
 * runs it feeds it data fetched from the API and never checks out the pull request's code.
 */
const messages = z.array(z.string()).parse(JSON.parse(readFileSync(process.argv[2] ?? "", "utf8")))
const offenders = messages.flatMap((message) => skipTokensIn(message).map((token) => `${token} in: ${message.split("\n")[0]}`))
if (offenders.length > 0) {
	console.error(`Commit messages must not contain tokens that skip workflows:\n${offenders.join("\n")}`)
	process.exit(1)
}
