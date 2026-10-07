/** Why a shell command is unsafe, or undefined when it is fine. Kept apart from the hook so it can be tested. */
export function unsafeReason(command) {
  if (/\bgit\s+add\s+(-A\b|--all\b|\.(\s|$))/.test(command)) return "stage files by name, not with git add -A or git add ."
  if (/\bgit\s+(commit|push)\b[^|;&]*--no-verify\b/.test(command)) return "do not skip git hooks with --no-verify; fix what the hook reports"
  return undefined
}
