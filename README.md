# fleeting

Some potentially useful notes and tooling. A modern Monorepo managed by pnpm workspaces.

*Read this in other languages: [English](README.md), [简体中文](README.zh-CN.md)*

## Project Structure

This repository uses a Monorepo architecture managed by `pnpm workspace`, containing:

- `apps/docs`: Knowledge base & documentation site (VitePress)
- `packages/tracker-sdk`: Front-end tracking SDK
- `packages/utils`: Shared utilities

## Toolchain & Architecture

This project is configured with a modern, high-performance, and automated engineering toolchain:

- **Package Manager**: [pnpm](https://pnpm.io/) (v11) + `pnpm-workspace.yaml`
- **Environment Lock**: [Volta](https://volta.sh/) (pins Node.js and pnpm versions)
- **TS Runner**: [tsx](https://tsx.is/) (esbuild-based, fast TypeScript execution)
- **Linting & Formatting**: [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files) + [@antfu/eslint-config](https://github.com/antfu/eslint-config) (no Prettier)
- **Git Hooks**: [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks) (lightweight Husky alternative)
- **Pre-commit**: [lint-staged](https://github.com/lint-staged/lint-staged) (only checks staged files)
- **Commit Convention**: [czg](https://cz-git.qbb.sh/cli/) + [commitlint](https://commitlint.js.org/)
- **Versioning & Changelog**: [Changesets](https://github.com/changesets/changesets)

## Development Workflow

### 1. Installation

Make sure you have [Volta](https://volta.sh/) installed. It will automatically install the pinned Node.js and pnpm versions.

```bash
pnpm install
```

### 2. Local Development

Start all workspaces:

```bash
pnpm dev
```

Or start a specific app:

```bash
pnpm dev:docs
```

### 3. Committing Code (Important)

Do not use `git commit -m "xxx"`. Use the interactive CLI instead:

1. Stage your changes:

   ```bash
   git add .
   ```

2. Run commit CLI:

   ```bash
   pnpm commit
   ```

3. Follow prompts:

   - Choose change type (feat, fix, docs, etc.)
   - Choose scope (auto-detected from `apps/` and `packages/`)
   - Write a short description

Note: hooks will format/check staged files on commit, and run full TypeScript type checking on `git push`.

### 4. Releases & Changelog (Changesets)

When you are ready to release new versions:

1. Create a changeset:

   ```bash
   pnpm changeset
   ```

   This generates a markdown file under `.changeset/` describing the version bump and summary.

2. Consume changesets & bump versions:

   ```bash
   pnpm version-packages
   ```

   This will:

   - Consume all changeset files
   - Bump versions in `package.json`
   - Update each package's `CHANGELOG.md`
   - Create a release commit automatically

## Yuque Sync (Content Source)

Docs content uses Yuque as the single source of truth, synced into `apps/docs/docs/src/**` via Elog and built by VitePress.

- Local sync: `pnpm sync:yuque`
- Guide (workflow / writing rules / front matter / sidebar): [intro.md](apps/docs/docs/src/intro.md)

## CI / Release

- CI (lint/typecheck/build on PRs and pushes): [.github/workflows/ci.yml](.github/workflows/ci.yml)
- Release (Changesets): [.github/workflows/release.yml](.github/workflows/release.yml)
- Yuque sync (daily + manual): [.github/workflows/sync-yuque.yml](.github/workflows/sync-yuque.yml)
