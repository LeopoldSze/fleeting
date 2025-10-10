## 起步

将以下内容添加到 package.json，Autoprefixer、Babel 和许多其他工具将自动找到目标浏览器：

```json
"browserslist": {
  "defaults and supports es6-module",
  "maintained node versions"
}
```

或者使用 `.browserslistrc` 配置：

```yaml
# Browsers that we support

defaults and supports es6-module
maintained node versions
```

> GitHub：[**browserslist**](https://github.com/browserslist/browserslist)

<br />

## 查询语法

Browserslist 使用 [`caniuse-lite`](https://github.com/ben-eb/caniuse-lite) 和 [Can I Use](https://caniuse.com/) 数据来查询。

### 默认配置

可以使用 `defaults` 选择一组合理的版本，这是 `> 0.5%, last 2 versions, Firefox ESR，not dead` 的快捷方式。 它与全球流行和受支持的浏览器的最新版本相匹配，并且包括大约每年更新一次的 Firefox 扩展支持版本。

默认查询是由 Browserslist 社区彻底设计的。 它有助于推广最佳实践并避免常见的陷阱。

```json
"browserslist": [
  "defaults"
]
```

<br />

### 选择具有特定用途的浏览器版本

- `> 5%` ：全球观众人数超过 5% 的所有版本
- `>= 5% in US` ：同上，但在美国
- `>= 5% in alt-AS` ：同上，但在亚洲
- `> 5% in my stats`：在您自己的受众中使用率 > 5% 的版本
- `5% in circle-ci stats`：来自可共享配置的受众数据中使用率 > 5% 的版本，可作为[自定义统计信息](https://github.com/circleci/circleci-docs/blob/master/browserslist-stats.json)使用
- `cover 99.5%`：全球 99.5% 以上观众集体使用的最小流行版本集
- `cover 99.5% in CN`：同上，但在中国
- `cover 99.5% in alt-EU`：同上，但在欧洲

::: warning

可能排除刚刚发布的所有浏览器的最新版本。请始终添加 `last XX versions` 以将它们包括回来。

可能包括无效版本。请考虑添加 `not dead`。

:::

<br />

### 选择最近的浏览器版本

- `last 2 versions` ：每个浏览器的最后 2 个版本
- `last 2 Chrome versions` ：同上，但只是 Chrome
- `last 2 major versions`：最后 2 个主要版本的所有次要版本和补丁版本
- `last 2 Safari major versions`：同上，但只是 Safari
- `unreleased versions`：alpha 和 beta 版本
- `unreleased Chrome versions`：同上，但只是 Chrome
- `since 2020-01-15`：自 2020 年 1 月 15 日起发布的版本
- `since 2020-01`：自 2020 年 1 月以来发布的版本，包括在内
- `since 2020`：自 2020 年以来发布的版本，包括在内
- `last 3 years`：过去3年发布的版本

::: warning

可能会排除大量受众仍在使用的旧版本。请始终添加 `> …` 以将它们包括回来。

可能会选择死浏览器，如 `Internet Explorer`。始终使用 `not dead` 搭配 `last XX versions`。

:::

<br />

### 选择特定的浏览器版本

- `ChromeAndroid 103`：移动 Chrome 版本 103
- `Firefox > 20`：高于 20 的桌面 Firefox 版本
- `iOS >= 13.2`：移动版 Safari 13.2 及更新版本
- `not firefox esr`：删除特定版本
- `ie 6-8`：一系列 Internet Explorer 版本
- `Firefox ESR`：最新的 Firefox 扩展支持版本

<br />

### 选择特定的 Node.js 版本

- `node 10`：最新的 10.x.x Node.js 版本
- `node 10.4`：最新的 10.4.x Node.js 版本
- `node > 16`：所有高于 16.0.0 的 Node.js 版本
- `last 2 node versions`：两个最新的 Node.js 版本
- `last 2 node major versions`：最后两个主要版本的 Node.js 版本
- `maintained node versions`：当前由 Node.js 基金会维护的所有 Node.js 版本
- `current node`：Browserslist 现在使用的 Node.js 版本

<br />

### 选择支持特定功能的浏览器版本

- `supports es6-module`：通过脚本标签支持 JavaScript 模块的版本
- `supports css-grid`：支持 CSS 网格布局的版本

::: tip

此查询很少单独运行良好。请考虑将其与其他查询结合使用。

:::

<br />

### 将多个查询合并为一个

您可以使用 `or` 或 `,` 组合多个查询匹配的版本；您可以将它们与 and 相交。如果查询不是列表中的第一个，您也可以使用 not 否定任何查询。

- `> 0.5%, last 2 versions`：结合 > 0.5% 与最后 2 个版本
- `> 0.5% or last 2 versions`：同上
- `> 0.5% and last 2 versions`：与最后 2 个版本相交 > 0.5%
- `> 0.5% and not last 2 versions`：从 > 0.5% 中删除最后 2 个版本

::: warning

带有 `not` 的查询不能是列表中的左侧查询，带有 `not` 的查询总是与带有 `and` 的左侧查询相连，即使使用了 or 或 `,`

这是 API 实现的特殊性。

:::

| Query combiner type                  | Illustration                                                                                                                                                                             | Example                                                                                                                                |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `or`/`,` combiner (union)            | [![Union of queries](https://github.com/browserslist/browserslist/raw/main/img/union.svg)](https://github.com/browserslist/browserslist/blob/main/img/union.svg)                         | `> .5% or last 2 versions` `> .5%, last 2 versions`                                                                                    |
| `and` combiner (intersection)        | [![intersection of queries](https://github.com/browserslist/browserslist/raw/main/img/intersection.svg)](https://github.com/browserslist/browserslist/blob/main/img/intersection.svg)    | `> .5% and last 2 versions`                                                                                                            |
| `not` combiner (relative complement) | [![Relative complement of queries](https://github.com/browserslist/browserslist/raw/main/img/complement.svg)](https://github.com/browserslist/browserslist/blob/main/img/complement.svg) | These three are equivalent to one another: `> .5% and not last 2 versions` `> .5% or not last 2 versions` `> .5%, not last 2 versions` |

<br />

### 排除未维护的浏览器版本

可以将查询与 `not dead` 结合起来以排除死浏览器，即超过 24 个月没有官方支持或更新的浏览器。 目前包括 IE 11、IE Mobile 11、BlackBerry 10、BlackBerry 7、Samsung 4、Opera Mobile 12.1 和所有版本的 Baidu。

- `> 0.2% and not dead`：从匹配 > 0.2% 的版本中排除无效版本

<br />

## 工具链结合示例

> [**browserslist-example**](https://github.com/browserslist/browserslist-example)

<br />

## 配置规则

1. `.browserslistrc` config file in current or parent directories.
2. `browserslist` key in `package.json` file in current or parent directories.
3. `browserslist` config file in current or parent directories.
4. `BROWSERSLIST` environment variable.
5. 如果上述均未提供有效配置，将使用默认 defaults: `> 0.5%, last 2 versions, Firefox ESR, not dead`.

<br />

## 浏览器数据更新

`npx update-browserslist-db@latest` 更新 npm、yarn 或 pnpm 锁定文件中的 caniuse-lite 版本。

此更新会将有关新浏览器的数据引入 Autoprefixer 或 Babel 等 polyfill 工具，并减少已经不必要的 polyfill。

<br />
