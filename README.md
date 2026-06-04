# fleeting

Something that might be useful. A modern Monorepo project built with pnpm workspaces.

*Read this in other languages: [English](README.md), [简体中文](README.zh-CN.md)*

## Project Structure

This repository uses a Monorepo architecture managed by `pnpm workspace`, containing the following packages and applications:

- `apps/docs`: Knowledge base & Documentation (powered by VitePress)
- `packages/tracker-sdk`: Front-end tracking SDK
- `packages/utils`: Shared utility functions

## Toolchain & Architecture

This project is configured with a modern, high-performance, and fully automated engineering toolchain:

- **Package Manager**: [pnpm](https://pnpm.io/) (v11) with `pnpm-workspace.yaml`.
- **Environment Lock**: [Volta](https://volta.sh/) (Locks Node.js & pnpm versions).
- **TypeScript Runner**: [tsx](https://tsx.is/) (Fast, esbuild-based Node.js execution).
- **Linting & Formatting**: [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files) powered by [@antfu/eslint-config](https://github.com/antfu/eslint-config) (Replaces Prettier).
- **Git Hooks**: [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks) (Lightweight alternative to Husky).
- **Pre-commit**: [lint-staged](https://github.com/lint-staged/lint-staged) (Only lints staged files).
- **Commit Specification**: [czg](https://cz-git.qbb.sh/cli/) (Interactive CLI) + [commitlint](https://commitlint.js.org/).
- **Versioning & Changelog**: [Changesets](https://github.com/changesets/changesets).

## Development Workflow

### 1. Installation
Ensure you have [Volta](https://volta.sh/) installed. It will automatically download the correct Node.js and pnpm versions.
```bash
pnpm install
```

### 2. Development
Start all applications and packages in development mode:
```bash
pnpm dev
```
You can also run a specific package:
```bash
pnpm dev:docs
```

### 3. Committing Code (Important)
**DO NOT** use `git commit -m "msg"`. Instead, use the interactive CLI to generate standard conventional commits:

1. Stage your changes:
   ```bash
   git add .
   ```
2. Run the commit CLI:
   ```bash
   pnpm commit
   ```
3. Follow the prompts:
   - Select the **type** of change (feat, fix, docs, etc.)
   - Select the **scope** (automatically lists folders in `apps/` and `packages/`)
   - Write a short description

*Note: During the commit, `lint-staged` will automatically format your code. If TypeScript type checking fails, the push will be aborted.*

### 4. Releasing Versions (Changesets)
When you are ready to release a new version for any package:

1. **Generate a changeset intent:**
   ```bash
   pnpm changeset
   ```
   Follow the prompts to select which packages need a version bump (major, minor, or patch) and write a summary of the changes.

2. **Consume changesets & Bump versions:**
   ```bash
   pnpm version-packages
   ```
   This command will automatically:
   - Bump versions in `package.json` for selected packages.
   - Update `CHANGELOG.md` for each package.
   - Generate a release commit automatically.
