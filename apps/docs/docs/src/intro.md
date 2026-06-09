---
sidebar: false
aside: 'left'
title: 使用指南
---
# 使用指南

本页用于记录本仓库的关键约定与维护方式，包括工程化、站点构建、语雀同步与写作规范。

## 目录说明

- `apps/docs`: 文档站应用
- `apps/docs/docs/.vitepress/config.ts`: VitePress 配置（含动态 sidebar、导航等）
- `apps/docs/docs/src`: 站点内容目录（语雀同步产物与少量手写页面）
- `apps/docs/docs/src/assets`: 站点静态资源
- `tools/sync-yuque.ts`: 语雀同步入口脚本

## 语雀同步（Elog）

本仓库以语雀知识库作为内容源，通过 Elog 将文档同步为 `src/` 下的 Markdown 文件，并由 VitePress 构建站点。侧边栏为动态生成：`src` 下的一级目录会自动成为一个分区（如 `front/back/devops/interview/other`）。

### 同步流程（从语雀到线上）

1. 在语雀知识库维护目录结构与文档内容（语雀是唯一内容源）
2. 本地或 GitHub Actions 运行同步命令 `pnpm sync:yuque`
3. Elog 拉取语雀文档，经过 `elog.format.cjs` 统一 front matter/slug 规则
4. 同步产物写入 `apps/docs/docs/src/**.md`（按语雀目录生成子目录）
5. VitePress 根据文件路由生成页面，侧边栏动态扫描 `src/**.md` 生成
6. GitHub Actions 提交同步变更到仓库
7. Vercel 监听 `main` 分支提交自动部署

涉及文件：

- `pnpm sync:yuque`：根 `package.json` 脚本
- `tools/sync-yuque.ts`：同步编排、对账删除（manifest）
- `elog.config.cjs`：Elog 平台与输出配置（yuque-pwd / local deploy）
- `elog.format.cjs`：格式化钩子（提取/过滤 Front Matter、slug 规则、兼容 `sidebar`）
- `apps/docs/docs/.vitepress/config.ts`：VitePress 动态 sidebar + nav 配置
- `.github/workflows/sync-yuque.yml`：定时/手动同步工作流

### 同步命令

- 本地同步：`pnpm sync:yuque`
- 同步输出：`apps/docs/docs/src/`（会按语雀目录结构生成子目录）
- 强制全量重写：设置 `ELOG_FORCE=1`（默认启用）。如需关闭可设置 `ELOG_FORCE=0`。
- 禁用缓存：设置 `ELOG_DISABLE_CACHE=1`（默认启用）。如需开启缓存可设置 `ELOG_DISABLE_CACHE=0`。

### Front Matter 约定

同步后的 Markdown 顶部会包含 Front Matter。本项目会保留并使用以下字段：

| 字段 | 是否建议手写 | 作用 |
| --- | --- | --- |
| `title` | 建议 | 侧边栏显示标题（可中文） |
| `order` | 建议 | 侧边栏排序，数字越小越靠前 |
| `inSidebar` | 可选 | `false` 表示不出现在侧边栏条目中（页面仍可通过 URL 访问，且侧边栏仍会显示） |
| `date` | 可选 | 创建时间（通常由同步过程写入） |
| `updated` | 可选 | 更新时间（通常由同步过程写入） |

说明：

- 本项目使用 `slug` 作为文件名/路由；`title` 只影响侧边栏展示。
- 建议在语雀文档顶部手动写 `slug`（例如 `webWorker`、`indexedDB`、`responsive`），用于固定 URL，避免标题修改导致固定链接 404。
- 如需隐藏页面条目但保留可访问性，可在语雀文档顶部写：`inSidebar: false`。
- `sidebar: false` 是 VitePress 内置字段，会让当前页面完全不显示侧边栏组件，不适合用于“仅隐藏条目”。

示例：

```yaml
---
title: Web Worker
slug: webWorker
order: 3
inSidebar: false
---
```

### 本地 .env（不提交）

建议在仓库根目录创建 `.env`，用于本地同步（不会提交到仓库）：

```env
YUQUE_USERNAME=...
YUQUE_PASSWORD=...
YUQUE_LOGIN=leopoldsze
YUQUE_REPO=tec
```

CI 自动同步使用 GitHub Secrets，同名变量即可。



## 侧边栏与导航

- 侧边栏由 `apps/docs/docs/.vitepress/config.ts` 动态扫描 `src/**.md` 生成。
- `src` 的一级目录会成为一个分区（如 `front/back/devops/...`），子目录会成为分组。
- 导航栏是手写配置（适合放少量“常用入口页面”）。如果某个页面仅通过导航访问但不希望出现在侧边栏，使用 `inSidebar: false` 即可。

## 高频坑点与排障

### 1) 侧边栏突然不见了

现象：进入某个页面后侧边栏区域完全不显示。

原因：页面 Front Matter 写了 `sidebar: false`。这是 VitePress 内置字段，含义是“当前页面不渲染侧边栏组件”。

建议：

- 仅隐藏条目但保留侧边栏：使用 `inSidebar: false`
- 真要整页不显示侧边栏：再用 `sidebar: false`

### 2) 固定链接 404（slug/title 搞混）

现象：导航栏写死的 `/front/html/webWorker` 之类链接突然 404。

原因：文件名/路由由 `slug` 决定；如果未固定 `slug`，标题变动或同步策略变化会导致文件名变化。

建议：

- 语雀文档顶部手写 `slug`，并把它当作长期稳定 URL（建议英文/数字/短横线）
- `title` 只用于侧边栏显示，可中文，且允许频繁修改

### 3) 只想隐藏侧边栏条目，但页面通过导航访问

写法：

```yaml
---
title: CSS
slug: css
order: 1
inSidebar: false
---
```

说明：这样页面仍可通过导航或直接 URL 访问，但不会出现在侧边栏目录里。

### 4) 同步后“没有需要同步的文档”

说明：Elog 有缓存/增量判断机制，可能导致本轮不产出文件。

当前策略：默认禁用缓存并按配置全量更新，避免“改了 format/front matter 但不重写”的情况。必要时可通过环境变量控制：

- `ELOG_DISABLE_CACHE=1`：禁用缓存（默认启用）
- `ELOG_DISABLE_CACHE=0`：启用缓存（加速但可能更难排查）

### 5) 语雀删除/重命名/移动目录后，本地怎么跟着变

本仓库同步脚本会维护一个 manifest 文件：`apps/docs/docs/src/.yuque-sync-manifest.json`。

- 本次同步会记录本轮写入的文件列表
- 下次同步会对账删除旧文件（只影响同步产物，不会删 `index.md/intro.md/assets/public` 等手写内容）

### 6) Windows 路径/临时目录导致同步报错

建议：

- 避免跨盘符临时目录拼接（脚本已使用仓库内 `.tmp/` 存放临时文件）
- `.tmp/` 与 `elog.cache*.json` 已加入 `.gitignore`，不要提交到仓库

### 7) Actions 找不到“Sync Yuque”工作流

说明：GitHub Actions 的工作流列表通常以默认分支的 workflow 文件为准。确保 `.github/workflows/sync-yuque.yml` 在默认分支上。



## VitePress 站点说明

- 快速开始：https://vuejs.github.io/vitepress/v1/zh/guide/getting-started
- 站点配置参考：https://vuejs.github.io/vitepress/v1/zh/reference/site-config
- Front Matter：https://vuejs.github.io/vitepress/v1/zh/guide/frontmatter
- 路由：https://vuejs.github.io/vitepress/v1/zh/guide/routing
- 部署：https://vuejs.github.io/vitepress/v1/zh/guide/deploy

### 本仓库的关键配置点

配置文件：`apps/docs/docs/.vitepress/config.ts`。

- `srcDir: 'src'`：站点源文件根目录为 `docs/src`
- `cleanUrls: true`：生成不带 `.html` 的简洁 URL
- `lastUpdated: true`：页面底部展示“上次更新”（由 Git 提供时间）
- `themeConfig.nav`：顶部导航（少量固定入口）
- `themeConfig.sidebar`：动态生成的 Multi Sidebar（按 `src` 一级目录分区）



## 链接页面

- **内部页面**：在页面之间链接时，可以使用绝对路径和相对路径。请注意，虽然 .md 和 .html 扩展名都可以使用，但最佳做法是省略文件扩展名，以便 VitePress 可以根据配置生成最终的 URL。
- **外部页面**：如果想链接到站点中不是由 VitePress 生成的页面，需要使用完整的 URL。

::: warning

- 在 Markdown 链接中，base 会自动添加到 URL 前面。这意味着，如果想链接到 base 之外的页面，则链接中需要类似 `../../pure.html` 的内容（由浏览器相对于当前页面解析）。

- 或者，可以直接使用锚标记语法：`<a href="/pure.html" target="_blank">Link to pure.html</a>`

:::



## 自定义容器&GitHub风格警报

> 可以通过在容器的 "type" 之后附加文本来设置自定义标题
> 修改默认标题可以在 `docs/.vitepress/config.ts` 中修改，如下：

```typescript
export default defineConfig({
  markdown: {
    container: {
      tipLabel: '提示',
      warningLabel: '注意',
      dangerLabel: '警告',
      infoLabel: '信息',
      detailsLabel: '详情'
    }
  },
})
```

```markdown
::: info
This is a info
:::

::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a dangerous warning
:::

::: details
This is a details block
:::

```

::: info
This is a info
:::

::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a dangerous warning
:::

::: details
This is a details block
:::

```markdown
> [!NOTE]
> 强调用户在快速浏览文档时也不应忽略的重要信息。

> [!TIP]
> 有助于用户更顺利达成目标的建议性信息。

> [!IMPORTANT]
> 对用户达成目标至关重要的信息。

> [!WARNING]
> 因为可能存在风险，所以需要用户立即关注的关键内容。

> [!CAUTION]
> 行为可能带来的负面影响。

```

> [!NOTE]
> 强调用户在快速浏览文档时也不应忽略的重要信息。

> [!TIP]
> 有助于用户更顺利达成目标的建议性信息。

> [!IMPORTANT]
> 对用户达成目标至关重要的信息。

> [!WARNING]
> 因为可能存在风险，所以需要用户立即关注的关键内容。

> [!CAUTION]
> 行为可能带来的负面影响。

<br />

## Emoji :tada:

> 语法：`:xxx:`
>
> [表情列表](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.mjs)

<br />



## 代码处理

### 高亮

- 代码块高亮：在代码块之后添加要高亮的行数，如 `js{1-4}`
  - 多行：例如 `{5-8}`、`{3-10}`、`{10-17}`
  - 多个单行：例如 `{4,7,9}`
  - 多行与单行：例如 `{4,7-13,16,23-27,40}`
- 代码行注释高亮：在代码后面使用 `// [!code highlight]` 注释实现行高亮

如：`highlight {1,4} and 6`

```js{1,4}
console.log('hello, world');

const firstName = 'Sze';
const LastName = 'Leopold';
const fullName = `${firstName}${lastName}`; // [!code highlight]
console.log('fullName:', fullName);
```

<br />

### 聚焦

- 在某一行后添加 `// [!code focus]` 注释将聚焦它并模糊代码的其他部分（推荐）
- 还可以使用 `// [!code focus:<lines>]` 定义要聚焦的行数

如：`focus 1 and 5`

```js
// [!code focus:1]
console.log('hello, world')

const firstName = 'Sze'
const LastName = 'Leopold'
const fullName = `${firstName}${lastName}` // [!code focus]
console.log('fullName:', fullName)
```

<br />

### 颜色差异

在某一行添加 `// [!code --]` 或 `// [!code ++]` 注释将会为该行创建 diff，同时保留代码块的颜色。如：

```js
export default {
  data () {
    return {
      msg: 'Removed' // [!code --]
      msg: 'Added' // [!code ++]
    }
  }
}
```

<br />

### 高亮“错误”和“警告”

在某一行添加 `// [!code warning]` 或 `// [!code error]` 注释将会为该行相应的着色。如：

```js
export default {
  data () {
    return {
      msg: 'Warning' // [!code warning]
      msg: 'Error' // [!code error]
    }
  }
}
```

<br />

### 显示行号

> 配置：`lineNumbers: boolean`

```typescript
// .vitepress/config.ts

export default defineConfig({
  markdown: {
    lineNumbers: true, // 启用代码行号
  },
})
```

::: tip

- 可以在代码块语言末尾中添加 `:line-numbers` / `:no-line-numbers` 标记来覆盖在配置中的设置。

- 还可以通过在 `:line-numbers` 之后添加 `=` 来自定义起始行号，例如 `:line-numbers=2` 表示代码块中的行号从 2 开始。

:::

<br />

### 导入代码片段

> 语法：`<<< @/filepath{line}`
>
> 说明：`@` 值对应于源代码根目录，即 `srcDir` 配置项，默认是项目根目录，同时支持导入代码行高亮，也支持相对路径导入，还可以指定代码语言

```markdown
<<< @/snippets/snippet.cs{c#}

<!-- 带行高亮: -->

<<< @/snippets/snippet.cs{1,2,4-6 c#}

<!-- 带行号: -->

<<< @/snippets/snippet.cs{1,2,4-6 c#:line-numbers}

```

<br />

### 代码组

> 语法：`::: code-group 多个代码块 :::`

````markdown
::: code-group

```js [config.js]
/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  // ...
}

export default config
```

```typescript [config.ts]
import type { UserConfig } from 'vitepress'

const config: UserConfig = {
  // ...
}

export default config
```

:::

````

::: code-group

```js [config.js]
/**
 * @types {import('vitepress').UserConfig}
 */
const config = {
  // ...
}

export default config
```

```ts [config.ts]
import type { UserConfig } from 'vitepress'

const config: UserConfig = {
  // ...
}

export default config
```

:::

也可以在导入代码片段中使用，如：

```markdown
::: code-group

<!-- 文件名默认用作标题 -->

<<< @/snippets/snippet.js

<!-- 也可以提供定制的代码组 -->

<<< @/snippets/snippet-with-region.js#snippet{1,2 ts:line-numbers} [snippet with region]

:::

```

<br />

### 转义

> 作用：将插值语法转义，不参与编译，原样输出
>
> 使用：可以通过使用 `v-pre` 指令将它们包裹在 `<span>` 或其他元素中来转义 Vue 插值，也可以通过自定义容器

```markdown
::: v-pre
{{ This will be displayed as-is }}`
:::
```

<br />

### 文件嵌套

> 语法：`<!--@include xx.md-->`
>
> 说明：支持选择行范围，如 `{3,}、{,10}，{1,10}`

```markdown
# Docs

## Header

<!--@include: ./index.md{,2}-->

```

<br />

### 数学方程

> 说明：可选，如要启用，需要安装 `markdown-it-mathjax3`，在配置文件中设置 `markdown.math` 为 `true`：

```bash
# 安装
pnpm add -D markdown-it-mathjax3
```

::: code-group

```typescript [.vitepress/config.ts] {3}
export default defineConfig({
  markdown: {
    math: true
  }
})
```

:::

<br />

### 图片懒加载

> 说明：默认禁用，设置为true可为所有图片启用懒加载

::: code-group

```typescript [.vitepress/config.ts] {4}
export default defineConfig({
  markdown: {
    image: {
      lazyLoading: true, // 为所有图片启用懒加载
    }
  }
})
```

:::
<br />





