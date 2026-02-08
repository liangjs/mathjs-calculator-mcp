#!/usr/bin/env node

/**
 * Unified version management script
 *
 * Usage:
 *   yarn version:bump patch   # 1.0.1 -> 1.0.2
 *   yarn version:bump minor   # 1.0.1 -> 1.1.0
 *   yarn version:bump major   # 1.0.1 -> 2.0.0
 *
 * This script:
 * 1. Bumps version in package.json
 * 2. Creates a git commit
 * 3. Creates a git tag
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

/**
 * Execute a shell command and return output
 * @param {string} command - Command to execute
 * @param {boolean} silent - Whether to suppress output
 * @returns {string} - Command output
 */
function exec(command, silent = false) {
  try {
    const result = execSync(command, {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: silent ? 'pipe' : 'inherit'
    });
    return result ? result.trim() : '';
  } catch (error) {
    console.error(`Command failed: ${command}`);
    throw error;
  }
}

/**
 * Bump version according to semver
 * @param {string} currentVersion - Current version string
 * @param {string} type - Version bump type (major, minor, patch)
 * @returns {string} - New version string
 */
function bumpVersion(currentVersion, type) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Invalid version type: ${type}. Must be major, minor, or patch.`);
  }
}

/**
 * Main version management function
 */
function main() {
  const versionType = process.argv[2];

  if (!versionType || !['major', 'minor', 'patch'].includes(versionType)) {
    console.error('Usage: node version.mjs <major|minor|patch>');
    console.error('Example: node version.mjs patch');
    process.exit(1);
  }

  // Check for uncommitted changes
  try {
    const status = exec('git status --porcelain', true);
    if (status) {
      console.error('Error: Working directory has uncommitted changes.');
      console.error('Please commit or stash changes before bumping version.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error checking git status');
    process.exit(1);
  }

  // Read current package.json
  const packagePath = join(rootDir, 'package.json');
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
  const currentVersion = packageJson.version;

  // Calculate new version
  const newVersion = bumpVersion(currentVersion, versionType);

  console.log(`Bumping version from ${currentVersion} to ${newVersion}`);

  // Update package.json
  packageJson.version = newVersion;
  writeFileSync(
    packagePath,
    JSON.stringify(packageJson, null, 2) + '\n',
    'utf8'
  );

  console.log('✓ Updated package.json');

  // Commit changes
  exec(`git add package.json`);
  exec(`git commit -m "chore: bump version to ${newVersion}"`);
  console.log('✓ Created commit');

  // Create tag
  exec(`git tag -a v${newVersion} -m "Release v${newVersion}"`);
  console.log(`✓ Created tag v${newVersion}`);

  console.log('\nVersion bump complete!');
  console.log(`\nNext steps:`);
  console.log(`  1. Review the commit: git show HEAD`);
  console.log(`  2. Push changes: git push origin main`);
  console.log(`  3. Push tag: git push origin v${newVersion}`);
  console.log(`  4. Create GitHub release from the tag to trigger npm publish`);
}

main();
