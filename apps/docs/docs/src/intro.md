---
sidebar: false
aside: 'left'
---
# README

## 目录说明

- docs: 博客文档根目录
- docs/.vitepress/config.ts: 博客文档配置文件
- docs/src: 博客文档源目录
- docs/src/assets: 博客文档静态资源
- docs/dist: 博客文档编译后的静态资源

::: info 脚本命令

- 因为文档根目录为docs，所以脚本命令需要切换到docs目录下执行，即：
- 开发：`vitepress dev docs`
- 编译：`vitepress build docs`
- 预览：`vitepress serve docs/dist`

:::

<br />

## 语雀同步（Elog）

本仓库以语雀知识库作为内容源，通过 Elog 将文档同步为 `src/` 下的 Markdown 文件，并由 VitePress 构建站点。侧边栏为动态生成：`src` 下的一级目录会自动成为一个分区（如 `front/back/devops/interview/other`）。

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
| `sidebar` | 可选 | `false` 表示不出现在侧边栏（页面仍可通过 URL 访问） |
| `date` | 可选 | 创建时间（通常由同步过程写入） |
| `updated` | 可选 | 更新时间（通常由同步过程写入） |

说明：

- 本项目使用 `slug` 作为文件名/路由；`title` 只影响侧边栏展示。
- 建议在语雀文档顶部手动写 `slug`（例如 `webWorker`、`indexedDB`、`responsive`），用于固定 URL，避免标题修改导致固定链接 404。
- 如需隐藏页面但保留可访问性，可在语雀文档顶部写：`sidebar: false`。

## 链接页面

- **内部页面**：在页面之间链接时，可以使用绝对路径和相对路径。请注意，虽然 .md 和 .html 扩展名都可以使用，但最佳做法是省略文件扩展名，以便 VitePress 可以根据配置生成最终的 URL。
- **外部页面**：如果想链接到站点中不是由 VitePress 生成的页面，需要使用完整的 URL。

::: warning

- 在 Markdown 链接中，base 会自动添加到 URL 前面。这意味着，如果想链接到 base 之外的页面，则链接中需要类似 `../../pure.html` 的内容（由浏览器相对于当前页面解析）。

- 或者，可以直接使用锚标记语法：`<a href="/pure.html" target="_blank">Link to pure.html</a>`

:::

<br />

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





