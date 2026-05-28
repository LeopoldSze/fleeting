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

## 工程化与踩坑记录 (2026 版)

为了防止长时间未维护后遗忘关键的配置细节，特此记录本项目的核心工程化“避坑指南”。

### 1. 全局配置与安全依赖安装 (`.npmrc`)
本项目在根目录的 `.npmrc` 中配置了：
```ini
ignore-scripts=false
allow-scripts=simple-git-hooks
```
**背景与价值**：
- 在高版本 pnpm 环境下，默认会执行所有包的 `postinstall` 脚本，这存在安全隐患。
- 通过 `allow-scripts` 白名单机制，我们**仅允许**可信的 `simple-git-hooks` 执行钩子注入。这既保障了本地开发的安全性，又实现了 Git Hooks 的自动化注册。

### 2. CI/CD 环境的静默安装隔离
在 GitHub Actions (`ci.yml`, `release.yml`) 中，我们的安装命令使用了：
```bash
pnpm install --frozen-lockfile --ignore-scripts
```
**背景与价值**：
- CI/CD 是无交互的沙盒环境，在云端尝试执行本地 Git Hooks 注入不仅毫无意义，反而会被严格的云端权限策略拦截，导致 `[ERR_PNPM_IGNORED_BUILDS]` 报错导致整个部署崩溃。
- 加上 `--ignore-scripts` 后，能够让云端彻底屏蔽所有副作用，实现最纯净、最快速的依赖安装。

### 3. Vercel 子项目部署的关键配置
因为是 Monorepo，在 Vercel 部署子项目（如 VitePress）时绝不能将 Root Directory 指向子目录，否则会丢失整个工作区的上下文关联。
在 Vercel 后台的 `apps/docs` 项目设置中，必须采用如下配置：
- **Root Directory**: 保持为空 (指向项目根目录)
- **Build Command**: `pnpm --filter @leopoldsze/docs build` (指定打包该子包)
- **Output Directory**: `apps/docs/docs/.vitepress/dist` (指向完整的相对路径)
- **Install Command**: `pnpm install --frozen-lockfile` (保持最干净的安装)
- **Ignored Build Step**: `bash -c "[[ $VERCEL_GIT_COMMIT_REF != 'main' ]]"` (拦截所有非主分支的构建)

### 4. Node.js LTS 升级平滑过渡
- **本地环境**：通过 `package.json` 中的 `volta` 字段，全局锁定了 **Node.js 24**。团队成员只要装了 Volta，进入项目目录就会自动切换到正确版本。
- **CI 环境预警处理**：在 GitHub Actions 中不仅将 `setup-node` 升级到了 `v4` 和 `node-version: '24'`，还额外配置了环境变量 `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: 'true'`，从而彻底消除了 GitHub 官方对 Node.js 20 弃用的警告提示，实现了与 2026 年技术栈的完美接轨。


**总体方案**

- 单一仓库使用 `pnpm` workspaces 管理所有应用与库，结合 `changesets` 负责包版本与变更日志；可选 `turborepo` 做任务编排与缓存加速。
- 三类应用：`VitePress` 博客（静态站），后台管理（React 19 或 Vue 3），门户站（Next.js 或 Nuxt）。
- 库与插件：抽离到 `packages/` 复用（UI、utils、主题、VitePress 插件、Node 脚本等）。
- 部署与自动化：GitHub Actions 统一 CI；部署使用免费平台（Cloudflare Pages、Vercel、Netlify、GitHub Pages）。

**目录结构**

- `apps/blog`：VitePress 博客站点（纯静态，内嵌主题配置或依赖 `@sugarat/theme`）。
- `apps/admin`：后台管理（React 19 + Vite 或 Vue 3 + Vite）。
- `apps/portal`：门户官网（Next.js or Nuxt）。
- `packages/theme`：VitePress 主题包（含 `node.mjs` 导出与文档）。
- `packages/shared`：通用工具库（类型、工具函数、数据模型）。
- `packages/plugins/*`：VitePress 插件（如 `vitepress-plugin-51la`、`announcement`、`rss`、`pagefind`）。
- `tools`：自动化脚本（发布、内容同步、站点编译与上传）。
- `infra`：部署配置（Nginx、Dockerfile、K8s 或平台配置说明）。
- `pnpm-workspace.yaml`：Workspace 范围；`package.json`：根脚本与 DevOps 工具；`eslint.config.js`、`tsconfig.json`：统一规则。

示例结构：

- `apps/`：`blog/`、`admin/`、`portal/`
- `packages/`：`theme/`、`shared/`、`plugins/announcement`、`plugins/51la`、`plugins/rss`、`plugins/pagefind`
- `tools/`：`release.mjs`、`sync-content.mjs`、`build-all.mjs`
- `infra/`：`cloudflare-pages/`、`vercel/`、`netlify/`

**技术选型建议**

- 后台框架选择：
  - 若门户用 `Next.js`，后台建议 `React 19 + Vite`，共享 React 生态与 UI（如 `Ant Design` 或 `Shadcn/ui`）。
  - 若门户用 `Nuxt`，后台建议 `Vue 3 + Vite`，共享 Vue 生态与 UI（如 `Element Plus` 或 `Naive UI`）。
- 数据后端（免费/低成本）：
  - `Supabase`（Postgres + Auth + Storage）免费额度足够初期；或 `Firebase`。
  - 纯静态需求可用 `GitHub Issues/Discussions` 或 JSON 文件 + PR 流程管理。
  - 较轻量的 KV/SQLite：`Cloudflare KV/D1` 免费适合元数据存储。
- 认证与权限：
  - `Supabase Auth` 或 `Auth.js`（Next.js），`Clerk`/`Firebase Auth` 也可。
- 内容与搜索：
  - 博客用 `Pagefind`（已在示例中），RSS 用插件（已有包）。
- 监控与分析：
  - 访问统计用 `51.LA`（已有插件），也可用 `Umami` 自托管。
  - 错误监控：`Sentry` 免费，接入前端与服务端。

**Workspace 脚本示例**

- 根 `package.json`：
  - `dev`：`pnpm --filter apps/blog dev`、`pnpm --filter apps/admin dev`、`pnpm --filter apps/portal dev`
  - `build`：`pnpm -r build` 或 `pnpm -r --filter ./apps/* build`
  - `buildlib`：`pnpm run /^build:.*/`（构建 `packages/*`，你当前仓库已采用此模式）
  - `lint`：`pnpm -r lint`；`typecheck`：`pnpm -r typecheck`
  - `release`：`changesets` 驱动包发布（仅对 `packages/*`）。

示例：

- `"dev:blog": "pnpm --filter ./apps/blog dev"`
- `"dev:admin": "pnpm --filter ./apps/admin dev"`
- `"dev:portal": "pnpm --filter ./apps/portal dev"`
- `"build:blog": "pnpm --filter ./apps/blog build"`
- `"build:theme": "pnpm --filter @sugarat/theme build:node"`
- `"buildlib": "pnpm run /^build:.*/"`

**CI/CD（免费优先）**

- GitHub Actions（统一 CI）：
  - 触发：`on: [push, pull_request]`。
  - 运行：`pnpm/action-setup` + `actions/setup-node`；缓存 `~/.pnpm-store`；矩阵构建各 app。
  - 工程任务：`pnpm -r lint && pnpm -r typecheck && pnpm -r test && pnpm -r build`。
- 部署策略：
  - 博客（VitePress）：
    - `Cloudflare Pages`（支持 monorepo 子目录），构建命令 `pnpm --filter ./apps/blog build`，输出目录 `.vitepress/dist`。
    - 备选：`GitHub Pages` 用 `peaceiris/actions-gh-pages` 推送 `gh-pages` 分支。
  - 门户（Next/Nuxt）：
    - `Vercel`（Next）或 `Netlify/Cloudflare Pages`（Nuxt）；连接仓库自动部署，设置子目录与构建命令。
  - 后台（SPA）：
    - `Netlify/Cloudflare Pages` 按子目录构建 `pnpm --filter ./apps/admin build`，输出 `dist/`。
- Secrets 管理：
  - 平台变量存于各平台 Dashboard；CI 变量存于 GitHub Secrets（如 `SUPABASE_URL`、`SUPABASE_KEY`）。
- 单仓多站部署：
  - Cloudflare Pages 支持 Monorepo：为每个子目录设置独立构建命令与输出目录，避免多平台分散管理。

**数据管理与配置**

- 内容模型与配置集中在 `packages/shared`（类型、DTO、校验）。
- 后台通过 API/SDK 操作数据源（Supabase/Firebase/KV），并触发 `webhook` 通知博客/门户重建。
- 轻量配置（全局公告、导航、友链）存储在 `JSON`/`YAML`，由后台提交 PR 或调用脚本在主分支更新，博客下一次构建自动生效。

**测试与质量保障**

- 测试：`vitest`（单元）+ `Playwright`（端到端）针对门户与后台关键流程。
- 规范：统一 `eslint`、`prettier`；已有 `simple-git-hooks` 可保留，或迁移到 `husky`。
- 类型：开启严格 TS；库用 `tsup` 产出 `cjs + mjs + d.ts`（你当前仓库已采用）。

**与当前仓库对照与优化建议**

- 已有优势：
  - `pnpm` monorepo、`changesets`、`packages/theme` 与多插件（`announcement`、`rss`、`pagefind`、`51la`）已具备良好基础。
  - 构建脚本 `buildlib` 已串联各包产物。
- 建议调整：
  - 路径归类：将 `packages/blogpress` 移至 `apps/blog`，保留 `packages/theme`、`packages/plugins/*` 作为可发布组件。
  - 根脚本：把当前 `"dev": "pnpm --filter blogpress dev"` 扩展为多应用脚本（示例见上），并新增 `dev:admin`、`dev:portal`。
  - 主题产物：确保 `@sugarat/theme` 的 `node.mjs/node.js/node.d.ts` 构建稳定（你已修复），在 CI 里加入 `pnpm buildlib` 作为前置。
  - 文档与部署：将 `deploy-theme.mjs` 迁入 `tools/` 并文档化，优先使用 Cloudflare/Vercel 自动部署，减少手工 `scp`。
  - Workspace 边界：在 `pnpm-workspace.yaml` 明确包含 `apps/*` 与 `packages/*`，避免无关目录被安装。
  - 环境变量：为每个应用维护 `.env.example`，在 CI 中按需注入，避免硬编码。

**免费部署组合推荐**

- 组合 A（React + Next）：博客→Cloudflare Pages；后台（Vite SPA）→Netlify；门户（Next）→Vercel。
- 组合 B（Vue + Nuxt）：博客→Cloudflare Pages；后台（Vue SPA）→Cloudflare Pages；门户（Nuxt）→Netlify。
- 数据后端：`Supabase` 免费层；静态配置走仓库文件 + PR 流。

**下一步行动**

- 在现仓库新增 `apps/admin` 与 `apps/portal` 初始模板。
- 根 `package.json` 补充多应用 `dev/build` 脚本；`pnpm-workspace.yaml` 增加 `apps/*`。
- 选择部署平台并创建项目（Cloudflare Pages/Vercel/Netlify），设置子目录构建命令与环境变量。
- 后台选择数据源（Supabase/Firebase/KV）并设计最小数据模型（公告、导航、友链等）。
- 打通博客配置的自动化更新链路（PR/Webhook），完成端到端的 CI/CD。

如果你愿意，我可以直接在当前仓库里帮你搭建 `apps/admin` 与 `apps/portal` 的最小模板、脚本与 GitHub Actions 工作流文件，并对根脚本进行改造，使其符合上述方案。
