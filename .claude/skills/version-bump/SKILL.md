---
name: version-bump
description: Bump semantic version for the MCP server. Use when updating package versions, creating release tags, or preparing for npm publish.
disable-model-invocation: false
allowed-tools: Read, Write, Bash
argument-hint: [major|minor|patch]
---

# Version Bump Skill

Manages semantic versioning for this MCP server project with unified version management.

## Task

Bump version: **$ARGUMENTS**

## Version Management System

This project uses **package.json as the single source of truth** for versioning:
- MCP server version in `src/index.mjs` reads from `package.json` at runtime
- Git tags are created based on `package.json` version
- npm package version is defined in `package.json`

## Workflow

Execute the following steps:

1. **Validate arguments**
   - Ensure `$ARGUMENTS` is one of: `major`, `minor`, or `patch`
   - If invalid or missing, ask user for clarification

2. **Check working directory**
   - Run `git status --porcelain` to check for uncommitted changes
   - If there are uncommitted changes, warn user and ask if they want to continue

3. **Run version bump script**
   - Execute: `node scripts/version.mjs $ARGUMENTS`
   - This script will:
     - Update `package.json` version
     - Create git commit: `chore: bump version to X.Y.Z`
     - Create git tag: `vX.Y.Z`

4. **Verify and report**
   - Show the new version
   - Display the commit and tag created
   - Provide next steps for the user:
     ```
     Next steps:
     1. Review: git show HEAD
     2. Push changes: git push origin main
     3. Push tag: git push origin vX.Y.Z
     4. Create GitHub release to trigger npm publish
     ```

5. **Optional: Show version info**
   - Display current version across the project:
     - package.json version
     - MCP server version (from src/index.mjs)
     - Latest git tags

## Semantic Versioning

- **MAJOR** (X.0.0): Breaking changes
- **MINOR** (0.X.0): New features (backward compatible)
- **PATCH** (0.0.X): Bug fixes (backward compatible)

## Examples

- `/version-bump patch` - Bump from 1.0.1 to 1.0.2
- `/version-bump minor` - Bump from 1.0.1 to 1.1.0
- `/version-bump major` - Bump from 1.0.1 to 2.0.0

## Error Handling

If the script fails:
1. Show the error message
2. Check common issues:
   - Uncommitted changes
   - Tag already exists
   - Script not executable
3. Provide guidance to fix the issue
