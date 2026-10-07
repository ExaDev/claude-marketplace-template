import type { ReleaseLevel } from "./conventional.ts"

const VERSION = /^(\d+)\.(\d+)\.(\d+)$/

/** Returns the version after a bump. Only plain major.minor.patch versions are supported. */
export function bump(version: string, level: ReleaseLevel): string {
	const match = VERSION.exec(version)
	if (match === null) throw new Error(`Not a plain semantic version: ${version}`)
	const [major, minor, patch] = [Number(match[1]), Number(match[2]), Number(match[3])]
	switch (level) {
		case "major":
			return `${major + 1}.0.0`
		case "minor":
			return `${major}.${minor + 1}.0`
		case "patch":
			return `${major}.${minor}.${patch + 1}`
	}
}
