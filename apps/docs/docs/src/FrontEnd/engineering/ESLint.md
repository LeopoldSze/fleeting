[关于ESLint 与 Prettier 配合使用的回答](https://stackoverflow.com/questions/44690308/whats-the-difference-between-prettier-eslint-eslint-plugin-prettier-and-eslint)

推荐的做法是让 Prettier 处理格式化问题，而 ESLint 处理非格式化问题，prettier-eslint 与此做法方向不同，因此不再推荐使用 prettier-eslint。你可以同时使用 eslint-plugin-prettier 和 eslint-config-prettier。

在这里 `'plugin:vue/recommended'` 使用了 plugin 的形式加载 Vue 相关的规则，而不需要显式指定 plugins。这是因为 ESLint 在解析配置时，会自动查找并加载对应的插件。所以，你不必在配置文件中另外指定 plugins。

这种写法是有效的，前提是你已经安装了 `eslint-plugin-vue` 插件

#### 1. 安装

```bash
pnpm add eslint -D
# or
yarn add eslint -D
# or
npm install eslint -D
```

#### 2. 设置配置文件

确保已存在 `package.json` 文件

```shell
yarn create @eslint/config
# or
npm init @eslint/config
```

运行完选择对应功能，生成 `.eslintrc.{js,yml,json}` 文件。

::: tip

`npm init @eslint/config` 命令和 `npx eslint --init` 命令都可以用于初始化一个新的 ESLint 配置文件。

`npm init @eslint/config` 命令使用了 npm init 包初始化工具来生成一个新的 ESLint 配置文件，与 `npm init` 命令类似。该命令会提示您选择要使用的预定义规则类型，并基于您的选择生成一个 `.eslintrc` 配置文件。

而 `npx eslint --init` 命令则会启动一个交互式向导，指导您设置所需的配置参数。该向导会询问您要使用哪种样式规则、您使用的脚本类型、您想要配置哪些 ESLint 规则等等。

两者的主要区别在于交互体验和可用性。`npm init @eslint/config` 命令比 `npx eslint --init` 命令更方便，因为它只需要一个命令就可以初始化一个配置文件，并不需要额外的配置或参数。但是它的选择相比于后者比较有限。而 `npx eslint --init` 命令更加灵活，可以配置更多的选项和规则，但需要您手动输入和选择参数。

无论选择哪种命令，它们都可以生成一个新的 ESLint 配置文件，并帮助建立适合您需要的代码规范和风格。

:::

#### 3. 配置

配置 `ESLint` 有两种主要方法：

1. **配置注释** - 使用 `JavaScript` 注释将配置信息直接嵌入到文件中。
2. **配置文件** - 使用 `JavaScript`、`JSON` 或 `YAML` 文件来指定整个目录及其所有子目录的配置信息。这可以是 `.ESLintrc.*` 文件的形式，也可以是 `package.json` 文件中的 `eslintConfig` 字段的形式，`ESLint` 会自动查找和读取这两者，或者您可以在命令行中指定配置文件。

主要配置选项：

- **Environments** - 指定脚本的运行环境。每种环境都有一组特定的预定义全局变量。
- **Globals** - 脚本在执行期间访问的额外的全局变量。
- **Rules** - 启用的规则及其各自的错误级别。
- **Plugins** - 第三方插件为 `ESLint` 定义了额外的规则、环境、配置等。

所有这些选项都让您可以细粒度地控制 `ESLint` 如何处理您的代码。

##### 1. 配置文件

###### 1. 配置文件格式

`ESLint` 支持多种格式的配置文件：

- **JavaScript** - 使用`eslint.config.js `和导出包含您的配置的对象。
- **JavaScript (ESM)** - 在 `JavaScript` 包中运行 `ESLint` 时使用 `.eslintrc.cjs`，在其 `package.json` 中指定 `“type”：“module”`。请注意，`ESLint` 目前不支持 `ESM` 配置。
- **YAML** - 使用`.eslintrc.yaml` 或 `.eslintrc.yml`来定义配置结构。
- **JSON** - 用于`eslint.config.json ` 定义配置结构。`ESLint` 的 `JSON` 文件也允许 `JavaScript` 样式的注释。
- **package.json** - 在你的文件中创建一个 `eslintConfig` 属性 `package.json` 并在那里定义你的配置。

**如果同一目录下有多个配置文件，`ESLint` 只会使用一个。优先顺序如下：**

`eslint.config.js` > `.eslintrc.cjs` > `.eslintrc.yaml` > `.eslintrc.yml` > `eslint.config.json` > `package.json`

###### 2. 使用配置文件

有两种方式使用配置文件：

1. 第一种使用配置文件的方法是通过 `.eslintrc.*` 和 `package.json` 文件。`ESLint` 将自动在要检查的文件的目录中查找它们，并在连续的父目录中一直查找到文件系统的根目录 ( `/`)、当前用户的主目录 ( `~/`) 或`root: true` 指定时。

2. 第二种方法是将文件保存在您想要的任何位置，并使用 `--config` 选项将其位置传递给 `CLI`。

   ```shell
   eslint -c myconfig.json myfiletotest.js
   ```

**如果正在使用一个配置文件并希望 `ESLint` 忽略任何 `.eslintrc.*` 文件，请确保 `--no-eslintrc` 与 `-c` 标志一起使用。**

###### 3. 配置文件中的注释

`JSON` 和 `YAML` 配置文件格式都支持注释（`package.json` 文件不支持）。可以对 `JSON` 文件使用 `JavaScript` 样式的注释，对 `YAML` 文件使用 `YAML` 样式的注释。 `ESLint` 会安全地忽略配置文件中的注释。

```json
// JavaScript 样式注释
{
  "env": {
    "browser": true
  },
  "rules": {
    // Override our default settings just for this directory
    "eqeqeq": "warn",
    "strict": "off"
  }
}
```

###### 4. 添加共享设置

`ESLint` 支持将共享设置添加到配置文件中。插件使用 `settings` 指定应在其所有规则之间共享的信息。可以将`settings` 对象添加到 `ESLint` 配置文件中，它将提供给正在执行的每个规则。可用于添加自定义规则。

```json
{
  "settings": {
    "sharedData": "Hello"
  }
}
```

###### 5. 扩展配置文件

一个配置文件，一旦扩展，就可以继承另一个配置文件的所有特征（包括规则、插件和语言选项）并修改所有选项。因此，存在三种配置，定义如下：

- **基本配置**：扩展的配置
- **派生配置**：扩展基本配置的配置
- **生成的实际配置**：将派生配置合并到基础配置中的结果

`extends` 属性值：

- 指定配置的字符串（配置文件的路径、可共享配置的名称、`eslint:recommended` 或 `eslint:all`）
- 一个字符串数组，其中每个附加配置都扩展了前面的配置

`ESLint` 递归地扩展配置，因此基本配置也可以具有 `extends` 属性。 `extends` 属性中的相对路径和可共享的配置名称是从它们出现的配置文件的位置解析的。

**可以从配置名称中省略 `eslint-config-` 前缀。例如，`airbnb` 解析为 `eslint-config-airbnb`。**

###### 6. 使用可共享的配置包

可共享的配置是一个导出配置对象的 `npm` 包。确保你已经在你的项目根目录中安装了这个包，以便 `ESLint` 可以`require` 它。

###### 7. 使用插件中的配置

插件是一个 `npm` 包，可以为 `ESLint` 添加各种扩展。插件可以执行许多功能，包括但不限于添加新规则和导出可共享配置。确保软件包已安装在 `ESLint` 可能需要它的目录中。

**`plugins` 属性值可以省略包名的 `eslint-plugin-` 前缀。**

###### 8. 级联和层次结构

适用于多配置，可参考官网 [Configuration Files](https://eslint.org/docs/latest/user-guide/configuring/configuration-files) --> `Cascading and Hierarchy`

```json
{
  // 特定目录配置
  "root": true
}
```

###### 9. 个人配置文件（已废弃）

此功能将在 8.0.0 版本中删除。如果想继续使用个人配置文件，请使用 `--config CLI` 选项。

##### 4. 语言选项

###### 1. 指定环境

环境提供预定义的全局变量。可用的环境有：

- `browser` - 浏览器全局变量。
- `node` - Node.js 全局变量和 Node.js 范围。
- `commonjs` - CommonJS 全局变量和 CommonJS 范围（将其用于使用 Browserify/WebPack 的仅浏览器代码）。
- `shared-node-browser` - Node.js 和浏览器通用的全局变量。
- `es6`- 启用除模块之外的所有 ECMAScript 6 功能（这会自动将`ecmaVersion`解析器选项设置为 6）。
- `es2017`- 添加所有 ECMAScript 2017 全局变量并自动将`ecmaVersion`解析器选项设置为 8。
- `es2020`- 添加所有 ECMAScript 2020 全局变量并自动将`ecmaVersion`解析器选项设置为 11。
- `es2021`- 添加所有 ECMAScript 2021 全局变量并自动将`ecmaVersion`解析器选项设置为 12。
- `worker` - 网络工作者全局变量。
- `amd`- 根据amd规范定义`require()`和`define()`作为全局变量。
- `mocha` - 添加所有 Mocha 测试全局变量。
- `jasmine` - 为版本 1.3 和 2.0 添加所有 Jasmine 测试全局变量。
- `jest` - 有全局变量。
- `phantomjs` - PhantomJS 全局变量。
- `protractor` - 量角器全局变量。
- `qunit` - QUnit 全局变量。
- `jquery` - jQuery 全局变量。
- `prototypejs` - Prototype.js 全局变量。
- `shelljs` - ShellJS 全局变量。
- `meteor` - 流星全局变量。
- `mongo` - MongoDB 全局变量。
- `applescript` - AppleScript 全局变量。
- `nashorn` - Java 8 Nashorn 全局变量。
- `serviceworker` - Service Worker 全局变量。
- `atomtest` - Atom 测试助手全局。
- `embertest` - Ember 测试助手全局。
- `webextensions` - 全球网络扩展。
- `greasemonkey` - GreaseMonkey 全球。

这些环境不是相互排斥的，因此您可以一次定义多个环境。

可以在文件、配置文件或使用`--env` 命令行标志内指定环境。

**1. 使用插件**

如果要使用插件中的环境，请务必在`plugins`数组中指定插件名称，然后使用不带前缀的插件名称，后跟斜杠，然后是环境名称。

```json
// 语言指定环境
{
  "env": {
    "example/custom": true,
    "browser": true,
    "node": true,
    "es2021": true
  },
  "plugins": ["example"]
}
```

##### 2. 指定全局变量

要在配置文件中配置全局变量，请将`globals`配置属性设置为包含为要使用的每个全局变量命名的键的对象。对于每个全局变量键，将对应的值设置为等于以`"writable"`允许覆盖变量或`"readonly"`禁止覆盖。

```js
// 全局变量
globals: {
  defineProps: 'readonly',
  defineEmits: 'readonly',
  defineExpose: 'readonly',
  withDefaults: 'readonly'
},
```

##### 3. 指定解析器选项

如果你正在使用 React 并且想要 React 语义支持，我们建议你使用 [`ESLint`-plugin-react](https://github.com/yannickcr/`ESLint`-plugin-react)。

同样的，支持 ES6 语法并不意味着同时支持新的 ES6 全局变量或类型（比如 `Set` 等新类型）。对于 ES6 语法，使用 `{ "parserOptions": { "ecmaVersion": 6 } }`；对于新的 ES6 全局变量，使用 `{ "env":{ "es6": true } }`. `{ "env": { "es6": true } }` 自动启用es6语法，但 `{ "parserOptions": { "ecmaVersion": 6 } }` 不自动启用es6全局变量。

解析器选项可以在 `.`ESLint`rc.*` 文件使用 `parserOptions` 属性设置。可用的选项有：

- `ecmaVersion` - 默认设置为 3，5（默认）， 你可以使用 6、7、8、9 或 10 来指定你想要使用的 ECMAScript 版本。你也可以用使用年份命名的版本号指定为 2015（同 6），2016（同 7），或 2017（同 8）或 2018（同 9）或 2019 (same as 10)
- `sourceType` - 设置为 `"script"` (默认) 或 `"module"`（如果你的代码是 ECMAScript 模块)。
- `ecmaFeatures`- 这是个对象，表示你想使用的额外的语言特性:
  - `globalReturn` - 允许在全局作用域下使用 `return` 语句
  - `impliedStrict` - 启用全局 [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) (如果 `ecmaVersion` 是 5 或更高)
  - `jsx` - 启用 [JSX](http://facebook.github.io/jsx/)
  - `experimentalObjectRestSpread` - 启用实验性的 [object rest/spread properties](https://github.com/sebmarkbage/ecmascript-rest-spread) 支持。(**重要：**这是一个实验性的功能,在未来可能会有明显改变。 建议你写的规则 **不要** 依赖该功能，除非当它发生改变时你愿意承担维护成本。)

```json
// 解析器选项
parserOptions: {
  ecmaVersion: 13, // 2015-6, 2022-13
  parser: '@typescript-`ESLint`/parser',
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
}
```

#### 5. Rules

##### 1. 配置规则

`ESLint` 内置了大量规则，您可以通过插件添加更多规则。您可以使用配置注释或配置文件来修改项目使用的规则。要更改规则设置，您必须将规则 ID 设置为以下值之一：

- `"off"`或`0`- 关闭规则
- `"warn"`或`1`- 打开规则作为警告（不影响退出代码）
- `"error"`或`2`- 将规则作为错误打开（触发时退出代码为 1）

要配置在插件中定义的规则，您必须在规则 ID 前加上插件名称和`/`

```json
{
  "plugins": [
    "plugin1"
  ],
  "rules": {
    "eqeqeq": "off",
    "curly": "error",
    "quotes": ["error", "double"],
    "plugin1/rule1": "error"
  }
}
```

##### 2. 禁用规则

要在一组文件的配置文件中禁用规则，请使用`overrides`键和`files`键。

```json
{
  "rules": {...},
  "overrides": [
    {
      "files": [...],
      "rules": {...}
    }
  ]
}
```

#### 6. 忽略

##### 1. ignorePattern

```json
{
  "ignorePatterns": ["temp.js", "**/vendor/*.js"]
}
```

##### 2. .`ESLint`ignore

```bash
# `ESLint` 忽略检查 (根据项目需要自行添加)
node_modules
dist
```

#### 7. Plugins

`ESLint`的规则可以通过rules配置，但是，不同场景、不同规范下有些定制的`ESLint`检查需求，`ESLint`默认提供的可选规则中如果没有，这个时候就需要做一些扩展了。

plugin插件主要是为`ESLint`新增一些检查规则，举个例子：``ESLint`-plugin-react` 就会对 `react` 项目做了一些定制的``ESLint``规则。

那对于`ESLint`-plugin-react新增加的规则，要如何在自己的项目使用呢，还是以上面的的新规则为例

第一步肯定是先把 ``ESLint`-plugin-react` 安装了，`yarn add `ESLint`-plugin-react -D`。

第二步就是加载插件了，plugins只是加载了插件，可以理解赋予了`ESLint`解析 `jsx-boolean-value` 规则的检查能力，真正开启这个规则的检查能力还是要通过rules配置。（一个插件库里面往往有几十个新规则，并不是每一个规则都需要开启的，这是时候就要根据自己的需求来配置相关检查规则）。

`plugins` 属性值可以省略包名的前缀``ESLint`-plugin-`。

```js
//	.`ESLint`rc.js

module.exports = {
  plugins: [
    'react' // 相当于 '`ESLint`-plugin-react'
  ],
  rules: {
    'react/jsx-boolean-value': 2 // 2--error
  }
}
```

这样一条新的`ESLint`规则就设置好了。

##### 1. 指定解析器

默认情况下，`ESLint` 使用[Espree](https://github.com/`ESLint`/espree)作为其解析器。您可以选择指定在配置文件中使用不同的解析器，只要解析器满足以下要求：

1. 它必须是可从使用解析器的配置文件加载的 Node 模块。通常，这意味着您应该使用 npm 单独安装解析器包。
2. 它必须符合[解析器接口](https://`ESLint`.org/docs/developer-guide/working-with-custom-parsers)。

```json
{
  "parser": "esprima",
  "rules": {
    "semi": "error"
  }
}
```

以下解析器与 `ESLint` 兼容：

- [Esprima](https://www.npmjs.com/package/esprima)
- [@babel/`ESLint`-parser](https://www.npmjs.com/package/@babel/`ESLint`-parser) - [Babel](https://babeljs.io/) 解析器的包装器，使其与 `ESLint` 兼容。
- [@typescript-`ESLint`/parser](https://www.npmjs.com/package/@typescript-`ESLint`/parser) - 将 TypeScript 转换为 ESTree 兼容形式的解析器，因此可以在 `ESLint` 中使用。

##### 2. 指定处理器

插件可以提供处理器。处理器可以从其他类型的文件中提取 JavaScript 代码，然后让 `ESLint` 对 JavaScript 代码进行 lint，或者处理器可以出于某种目的在预处理中转换 JavaScript 代码。

要为特定类型的文件指定处理器，请使用`overrides`键和`processor`键的组合。

```json
{
  "plugins": ["a-plugin"],
  "overrides": [
    {
      "files": ["*.md"],
      "processor": "a-plugin/markdown"
    }
  ]
}
```

##### 3. 配置插件

`ESLint` 支持使用第三方插件。在使用插件之前，您必须使用 npm 安装它。

要在配置文件中配置插件，请使用 `plugins` 包含插件名称列表的密钥。插件名称中的 ``ESLint`-plugin-` 前缀可以省略。

```json
{
  "plugins": ["vue", "@typescript-`ESLint`", "prettier"]
}
```

#### 8. extends

`extends`属性值为：

- 指定配置的字符串（配置文件的路径，可共享配置的名称 ``ESLint`:recommended`，或``ESLint`:all`）
- 一个字符串数组，其中每个附加配置都扩展了前面的配置

`ESLint` 递归地扩展配置，所以基本配置也可以有一个`extends`属性。属性中的相对路径和可共享的配置名称`extends`是从它们出现的配置文件的位置解析的。

```json
{
    "prefer-arrow-callback": 0,
    'vue/max-attributes-per-line': [
      2,
      {
        singleline: {
          max: 10
        },
        multiline: {
          max: 1
        },
      },
    ],
    'vue/multi-word-component-names': 0,
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/no-v-html': 'off',
    'accessor-pairs': 2,
    'arrow-spacing': [
      2,
      {
        before: true,
        after: true
      },
    ],
    'block-spacing': [2, 'always'],
    'brace-style': [
      2,
      '1tbs',
      {
        allowSingleLine: true
      },
    ],
    camelcase: [
      0,
      {
        properties: 'always',
      }
    ],
    'comma-dangle': [2, 'never'],
    'comma-spacing': [
      2,
      {
        before: false,
        after: true
      },
    ],
    'comma-style': [2, 'last'],
    'constructor-super': 2,
    curly: [2, 'multi-line'],
    'dot-location': [2, 'property'],
    'eol-last': 2,
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'generator-star-spacing': [
      2,
      {
        before: true,
        after: true
      },
    ],
    'handle-callback-err': [2, '^(err|error)$'],
    indent: [
      2,
      2,
      {
        SwitchCase: 1
      },
    ],
    'jsx-quotes': [2, 'prefer-single'],
    'key-spacing': [
      2,
      {
        beforeColon: false,
        afterColon: true
      },
    ],
    'keyword-spacing': [
      2,
      {
        before: true,
        after: true
      },
    ],
    'new-cap': [
      2,
      {
        newIsCap: true,
        capIsNew: false
      },
    ],
    'new-parens': 2,
    'no-array-constructor': 2,
    'no-caller': 2,
    'no-console': 'off',
    'no-class-assign': 2,
    'no-cond-assign': 2,
    'no-const-assign': 2,
    'no-control-regex': 0,
    'no-delete-var': 2,
    'no-dupe-args': 2,
    'no-dupe-class-members': 2,
    'no-dupe-keys': 2,
    'no-duplicate-case': 2,
    'no-empty-character-class': 2,
    'no-empty-pattern': 2,
    'no-eval': 2,
    'no-ex-assign': 2,
    'no-extend-native': 2,
    'no-extra-bind': 2,
    'no-extra-boolean-cast': 2,
    'no-extra-parens': [2, 'functions'],
    'no-fallthrough': 2,
    'no-floating-decimal': 2,
    'no-func-assign': 2,
    'no-implied-eval': 2,
    'no-inner-declarations': [2, 'functions'],
    'no-invalid-regexp': 2,
    'no-irregular-whitespace': 2,
    'no-iterator': 2,
    'no-label-var': 2,
    'no-labels': [
      2,
      {
        allowLoop: false,
        allowSwitch: false
      },
    ],
    'no-lone-blocks': 2,
    'no-mixed-spaces-and-tabs': 2,
    'no-multi-spaces': 2,
    'no-multi-str': 2,
    'no-multiple-empty-lines': [
      2,
      {
        max: 1
      },
    ],
    'no-native-reassign': 2,
    'no-negated-in-lhs': 2,
    'no-new-object': 2,
    'no-new-require': 2,
    'no-new-symbol': 2,
    'no-new-wrappers': 2,
    'no-obj-calls': 2,
    'no-octal': 2,
    'no-octal-escape': 2,
    'no-path-concat': 2,
    'no-proto': 2,
    'no-redeclare': 2,
    'no-regex-spaces': 2,
    'no-return-assign': [2, 'except-parens'],
    'no-self-assign': 2,
    'no-self-compare': 2,
    'no-sequences': 2,
    'no-shadow-restricted-names': 2,
    'no-spaced-func': 2,
    'no-sparse-arrays': 2,
    'no-this-before-super': 2,
    'no-throw-literal': 2,
    'no-trailing-spaces': 2,
    'no-undef': 2,
    'no-undef-init': 2,
    'no-unexpected-multiline': 2,
    'no-unmodified-loop-condition': 2,
    'no-unneeded-ternary': [
      2,
      {
        defaultAssignment: false
      },
    ],
    'no-unreachable': 2,
    'no-unsafe-finally': 2,
    'no-unused-vars': [
      2,
      {
        vars: 'all',
        args: 'none',
      }
    ],
    'no-useless-call': 2,
    'no-useless-computed-key': 2,
    'no-useless-constructor': 2,
    'no-useless-escape': 0,
    'no-whitespace-before-property': 2,
    'no-with': 2,
    'one-var': [
      2,
      {
        initialized: 'never',
      }
    ],
    'operator-linebreak': [
      2,
      'after',
      {
        overrides: {
          '?': 'before',
          ':': 'before',
        }
      },
    ],
    'padded-blocks': [2, 'never'],
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      },
    ],
    semi: [2, 'never'],
    'semi-spacing': [
      2,
      {
        before: false,
        after: true
      },
    ],
    'space-before-blocks': [2, 'always'],
    'space-before-function-paren': [2, 'never'],
    'space-in-parens': [2, 'never'],
    'space-infix-ops': 2,
    'space-unary-ops': [
      2,
      {
        words: true,
        nonwords: false
      },
    ],
    'spaced-comment': [
      2,
      'always',
      {
        markers: [
          'global',
          'globals',
          '`ESLint`',
          '`ESLint`-disable',
          '*package',
          '!',
          ',',
        ]
      },
    ],
    'template-curly-spacing': [2, 'never'],
    'use-isnan': 2,
    'valid-typeof': 2,
    'wrap-iife': [2, 'any'],
    'yield-star-spacing': [2, 'both'],
    yoda: [2, 'never'],
    'prefer-const': 2,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'object-curly-spacing': [
      2,
      'always',
      {
        objectsInObjects: false
      },
    ],
    'array-bracket-spacing': [2, 'never'],
}
```
