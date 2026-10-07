import { pathToFileURL } from "node:url"

/**
 * True when the module is the program being run, so a script can export functions for tests without
 * running its main body on import. Node's own `import.meta.main` needs Node 24.2 or later; this works
 * on the Node 22 this repository supports.
 */
export function isMain(moduleUrl: string): boolean {
	const entry = process.argv[1]
	return entry !== undefined && moduleUrl === pathToFileURL(entry).href
}
