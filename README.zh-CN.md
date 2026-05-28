# fleeting

一些可能有用的沉淀。一个基于 pnpm workspaces 的现代化 Monorepo 项目。

*其他语言版本: [English](README.md), [简体中文](README.zh-CN.md)*

## 项目结构

本项目使用 `pnpm workspace` 管理的 Monorepo 架构，包含以下应用和包：

- `apps/blog`: 博客应用
- `apps/docs`: 知识库与技术文档 (基于 VitePress)
- `packages/tracker-sdk`: 前端埋点 SDK
- `packages/utils`: 公共工具函数库

## 工具链与架构

本项目配置了目前前端界最现代、高性能且全自动化的工程工具链：

- **包管理器**: [pnpm](https://pnpm.io/) (v11) + `pnpm-workspace.yaml`。
- **环境锁定**: [Volta](https://volta.sh/) (确保团队成员 Node.js 和 pnpm 版本绝对一致)。
- **TS 执行器**: [tsx](https://tsx.is/) (基于 esbuild，极速执行 TypeScript)。
- **代码规范与格式化**: [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files) + [@antfu/eslint-config](https://github.com/antfu/eslint-config) (一步到位，无需 Prettier)。
- **Git Hooks**: [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks) (比 Husky 更轻量，无侵入)。
- **提交前拦截**: [lint-staged](https://github.com/lint-staged/lint-staged) (仅对暂存区文件进行增量 Lint，极速)。
- **提交规范**: [czg](https://cz-git.qbb.sh/cli/) (交互式终端提示) + [commitlint](https://commitlint.js.org/) (最后兜底拦截)。
- **版本发布与日志**: [Changesets](https://github.com/changesets/changesets) (Monorepo 发版神器)。

## 开发工作流指南

### 1. 环境安装
请确保本机已安装 [Volta](https://volta.sh/)。它会自动为你下载项目中锁定的 Node.js 和 pnpm 版本。
```bash
pnpm install
```

### 2. 本地开发
启动所有子项目：
```bash
pnpm dev
```
或者只启动特定项目：
```bash
pnpm dev:docs
```

### 3. 代码提交 (核心流程)
**请不要** 直接使用 `git commit -m "xxx"`。本项目配置了高度定制化的交互式提交工具：

1. 暂存你的更改：
   ```bash
   git add .
   ```
2. 唤起交互式命令行：
   ```bash
   pnpm commit
   ```
3. 根据终端提示进行选择：
   - 选择本次提交的 **类型** (如 feat 新功能、fix 修复等，支持拼音搜索)。
   - 选择本次影响的 **作用域** (列表已自动读取 `apps/` 和 `packages/` 下的所有模块)。
   - 填写简短的描述信息。

*提示：在提交时，钩子会自动触发代码格式化；在 `git push` 时，会自动触发全量 TS 类型检查，报错则禁止推送。*

### 4. 发版与生成更新日志 (Changesets)
当你开发完毕，准备为某个子包发布新版本时：

1. **声明变更意图 (平时开发时)：**
   ```bash
   pnpm changeset
   ```
   终端会询问你：这次修改了哪些包？是 Major、Minor 还是 Patch 更新？并让你写一段更新说明。这会在 `.changeset` 目录下生成一个 Markdown 文件。

2. **消耗变更并自动升版本 (准备发布时)：**
   ```bash
   pnpm version-packages
   ```
   该命令会自动执行以下操作：
   - 消耗掉所有的 changeset 意图文件。
   - 自动修改对应包 `package.json` 中的版本号。
   - 自动将你写的更新说明注入到各个包的 `CHANGELOG.md` 中。
   - 自动生成一条类似 `RELEASING: Releasing 2 package(s)` 的 Git Commit。

## 自动化部署与 CI/CD

本项目接入了 **GitHub Actions** 与 **Vercel**，实现了完全自动化的代码校验与部署流水线。所有相关的云端触发行为被严格限制在 `main`（生产环境）分支，以避免开发过程中的冗余部署。

### GitHub Actions (`.github/workflows/`)

1. **CI 质量检查 (`ci.yml`)**
   - **触发条件**: 仅当代码 `push` 到 `main` 分支，或提交指向 `main` 的 `Pull Request` 时触发。
   - **作用**: 在云端自动安装依赖，执行完整的代码校验 (`pnpm lint:all`)、类型检查 (`pnpm typecheck`) 和打包构建 (`pnpm build`)。如果任何一步失败，PR 将无法被合并。

2. **自动发版发布 (`release.yml`)**
   - **触发条件**: 仅当代码 `push` 到 `main` 分支时触发。
   - **作用**: 读取 `Changesets` 意图文件。如果有未消耗的 changeset，会自动创建一个名为 `Version Packages` 的 PR（里面包含变更日志和版本更新）。合并该 PR 后，代码会自动打上对应版本的 Tag 并发布。

### Vercel 云端部署

- **部署应用**: 自动检测并部署 `apps/docs` (VitePress 知识库)。
- **触发机制**: Vercel 已在控制台配置为 **仅监听 `main` 分支**。
- **构建拦截**: 默认情况下其他开发分支 (如 `develop`) 的提交将被 Vercel 拦截 (Ignored Build Step)，从而节约云端构建时长和性能额度。
