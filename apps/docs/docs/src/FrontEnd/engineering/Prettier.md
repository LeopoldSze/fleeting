## Prettier

### 1. 安装

```shell
npm install prettier -D

yarn add prettier -D

pnpm add prettier -D
```

### 2. 运行

```shell
npx prettier --write .

yarn prettier --write .
```

### 3. git hooks

```shell
# first
npm install --D husky lint-staged
# or
yarn add -D husky lint-staged

# second
npx husky install
npm set-script prepare "husky install"
npx husky add .husky/pre-commit "npx lint-staged"
```

### 4. config package.json

```json
{
  "lint-staged": {
    "**/*": "prettier --write --ignore-unknown"
  }
}
```

> If you use ESLint, make sure lint-staged runs it before Prettier, not after.

### 5. .prettierignore

要从格式化中排除文件，请在项目的根目录中创建一个 `.prettierignore` 文件。 `.prettierignore` 使用 `gitignore` 语法。

### 6. linter 冲突

Linter 通常不仅包含代码质量规则，还包含样式规则。使用 Prettier 时，大多数风格规则都是不必要的，但更糟糕的是——它们可能与 Prettier 冲突！使用 Prettier 解决代码格式问题，使用 linter 解决代码质量问题。

幸运的是，通过使用这些预制配置，可以轻松关闭与 Prettier 冲突或不必要的规则：

- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)
- [stylelint-config-prettier](https://github.com/prettier/stylelint-config-prettier)

首先，我们有一些插件可以让你像运行 linter 规则一样运行 Prettier：

- [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)
- [stylelint-prettier](https://github.com/prettier/stylelint-prettier)

插件缺点：

- 你最终会在你的编辑器中看到很多红色的波浪线，这很烦人。 Prettier 应该让你忘记格式化——而不是面对它
- 它们比直接运行 Prettier 慢
- 它们仍然是可能中断的间接层

最终工具：

- [prettier-eslint](https://github.com/prettier/prettier-eslint)
- [prettier-stylelint](https://github.com/hugomrdias/prettier-stylelint)

如果 Prettier 输出的某些方面使 Prettier 对您完全无法使用，那么这些将很有用。然后你可以让例如 eslint --fix 为你解决这个问题。

缺点：这些工具比仅仅运行 Prettier 慢得多。

冲突的本质在于 `eslint` 既负责了代码质量检测，又负责了一部分的格式美化工作,格式化部分的部分规则和 `prettier` 不兼容。 能不能让 `eslint` 只负责代码质量检测而让 `prettier` 负责美化呢? 好在社区有了非常好的成熟方案，即 `eslint-config-prettier` + `eslint-plugin-prettier`。

- `eslint-config-prettier` 的作用是关闭`eslint`中与`prettier`相互冲突的规则。
- `eslint-plugin-prettier` 的作用是赋予`eslint`用`prettier`格式化代码的能力。

```json
// 扩展新增 plugin:prettier/recommended
{
  "extends": ["plugin:prettier/recommended"]
}
```

`extends: ['prettier']`: 通过 `eslint-config-prettier` 关闭`eslint`和`prettier` 相冲突的规则。

`plugins: ['prettier']`: 加载 `eslint-plugin-prettier`，赋予 `eslint` 用 `prettier` 格式化文档的功能。

### 7. 配置文件优先级

1. A `"prettier"` key in your `package.json` file.

2. A `.prettierrc` file written in JSON or YAML.
3. A `.prettierrc.json`, `.prettierrc.yml`, `.prettierrc.yaml`, or `.prettierrc.json5` file.
4. A `.prettierrc.js`, or `prettier.config.js` file that exports an object using `export default` or `module.exports` (depends on the [`type`](https://nodejs.org/api/packages.html#type) value in your `package.json`).
5. A `.prettierrc.mjs`, or `prettier.config.mjs` file that exports an object using `export default`.
6. A `.prettierrc.cjs`, or `prettier.config.cjs` file that exports an object using `module.exports`.
7. A `.prettierrc.toml` file.

### 8. 配置项

```js
// .prettierrc.json
{
  printWidth: 120, // 指定将换行的行长，默认80
  tabWidth: <int>, // 指定每个缩进级别的空格数，默认2
  useTabs: <bool>, // 使用制表符而不是空格缩进行，默认false
  semi: <bool>, // 在语句末尾打印分号，默认true
  singleQuote: <bool>, // 使用单引号而不是双引号，默认false
  quoteProps: '<as-needed|consistent|preserve>', // 引用对象中的属性时更改，默认'as-nedded'
  jsxSingleQuote: <bool>, // 在 JSX 中使用单引号而不是双引号，默认false
  trailingComma: "<es5|none|all>", // 在多行逗号分隔的句法结构中尽可能打印尾随逗号。（例如，单行数组永远不会有尾随逗号。）v2.0.0 中的默认值从 none 更改为 es5
  bracketSpacing: <bool>, // 在对象文字中的括号之间打印空格，默认true
  bracketSameLine: <bool>, // 将多行 HTML（HTML、JSX、Vue、Angular）元素的 > 放在最后一行的末尾，而不是单独放在下一行（不适用于自闭合元素），默认false
  arrowParens: "<always|avoid>", // 在唯一的箭头函数参数周围包含括号。在 v1.9.0 中首次可用，默认值在 v2.0.0 中从避免更改为always
  rangeStart: <int>, // 仅格式化文件的一部分，默认0
  rangeEnd: <int>, // 默认Infinity
  parser: "<string> | require("./my-parser")", // 指定要使用的解析器，Prettier 自动从输入文件路径推断解析器，因此您不必更改此设置，默认none
  filepath: "<string>", // 指定用于推断要使用的解析器的文件名，此选项仅在 CLI 和 API 中有用。在配置文件中使用它是没有意义的，默认none
  requirePragma: <bool>, // Prettier 可以将自己限制为仅格式化文件顶部包含特殊注释（称为 pragma）的文件，默认false
  insertPragma: <bool>, // Prettier 可以在文件顶部插入一个特殊的 @format 标记，指定文件已使用 Prettier 格式化。默认false
  proseWrap: "<always|never|preserve>", // 默认情况下，Prettier 不会更改 markdown 文本中的换行，因为某些服务使用换行敏感的渲染器。默认preserve
  htmlWhitespaceSensitivity: "<css|strict|ignore>", // 指定 HTML、Vue、Angular 和 Handlebars 的全局空格敏感性，默认css
  vueIndentScriptAndStyle: <bool>, // 是否缩进 Vue 文件中 <script> 和 <style> 标记内的代码，默认false
  endOfLine: "<lf|crlf|cr|auto>", // 换行符，默认lf
  embeddedLanguageFormatting: "off", // 控制 Prettier 是否格式化文件中嵌入的引用代码，默认auto
  singleAttributePerLine: <bool>, // 在 HTML、Vue 和 JSX 中每行强制执行单个属性。首次在 v2.6.0 中可用。默认false
}
```
