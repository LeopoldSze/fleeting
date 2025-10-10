**Vue3 + Create-Vue + TypeScript + Pinia + Vue-Router**项目搭建

#### 1. 创建项目

```shell
# 创建基于Vue3的项目
npm init vue@3
```

<img src="https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/vue3-1.png" style="zoom: 67%;" />

勾选添加 `TypeScript + JSX + Vue Router + Pinia + ESLint + Prettier`

```shell
# 包管理器选择 pnpm

# 依赖安装
pnpm install

# 项目运行
pnpm run dev
```

> 初始化项目依赖如下(依赖已更新到当前最新)

<img src="https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/vue3-2.png" style="zoom: 80%;" />

<br />

#### 2. 配置Prettier

::: warning

本人使用 `webstorm` 内置支持 `EditorConfig`，`vscode` 需自行配置。

:::

项目根目录下新建 `.prettierrc.json`

```json
{
  "printWidth": 120, // 指定将换行的行长，默认80
  "semi": false, // 禁用句尾分号
  "singleQuote": true, // 启用单引号
  "trailingComma": "none" // 禁用在多行逗号分隔的句法结构中尽可能打印尾随逗号
}
```

项目根目录新建忽略文件 `.prettierignore`

<br />

#### 3. 配置ESLint

```js
// .eslintrc.cjs

/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    // 修改默认plugin:vue/vue3-essential为更严格的plugin:vue/vue3-recommended
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier'
  ]
}
```

## Vue-Pure-Admin
