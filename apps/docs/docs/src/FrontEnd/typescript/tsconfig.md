基于typescript的项目的根目录下都会有一个文件 (`tsconfig.json`) , 这个文件主要用来控制 typescript 编译器(`tsc, typescript compiler`) 的一些行为。

<br />

### 1. include

> 默认：[]，如果 files 指定了，则为 \*\*
>
> 指定要编译哪些文件，指定要包含在程序中的文件名或模式数组，这些文件名相对于包含 tsconfig.json 文件的目录进行解析。

1. `**/`表示匹配任何子路径, 包括目录分隔符`/`也会被它匹配, 所以用来这个通配符后, 目录下有多少子目录都会被匹配到

2. `*`表示匹配除了目录分隔符(`/`)外的任何长度的字符串

3. `?`表示匹配一个除文件分隔符(`/`)外的任一字符

显然 `./src/**/*` 即表示匹配 `src` 文件夹下的任何子文件夹的任何文件; 而 `./demo/**/*.tsx?` 即表示匹配`demo` 目录下任何子目录下的任意以 `.ts`或`.tsx `结尾的文件。如果匹配模式不包含文件扩展名，则仅包含具有受支持扩展名的文件（例如，默认情况下为 .ts、.tsx 和 .d.ts，如果 allowJs 设置为 true，则为 .js 和 .jsx）

> include 其实就是一个白名单, 在这个白名单里被匹配到的文件才会被tsc处理编译

```json
// example

{
  "include": ["src/**/*", "tests/**/*"]
}

// 效果如下
├── scripts                ⨯
│   ├── lint.ts            ⨯
│   ├── update_deps.ts     ⨯
│   └── utils.ts           ⨯
├── src                    ✓
│   ├── client             ✓
│   │    ├── index.ts      ✓
│   │    └── utils.ts      ✓
│   ├── server             ✓
│   │    └── index.ts      ✓
├── tests                  ✓
│   ├── app.test.ts        ✓
│   ├── utils.ts           ✓
│   └── tests.d.ts         ✓
├── package.json
├── tsconfig.json
└── yarn.lock
```

<br />

### 2. exclude

> 默认：node_modules, bower_compo
>
> 指定解析 include 时应跳过的文件名或模式数组，只是更改 include 设置所找到的内容

::: warning 注意

有些情况即使 exclude 了某些文件后, 编译后的代码中可能仍然包含被 exclude 了的内容

1. `import` 引入
2. `/// <reference` 指令
3. `files` 配置指定

:::

<br />

### 3. files

> 默认：false
>
> 指定要包含在程序中的文件白名单。如果找不到任何文件，则会发生错误。
>
> 当只有少量文件并且不需要使用通配符来引用许多文件时，很有用。

作用类似 `include`， 也是一个白名单路径数组,，不同在于它不能使用通配符， 而必须使用精确的文件路径(可以是相对路径)。比如项目只有一个入口文件，那么就可以使用在只用 `files` 配置这个文件的路径，然后其他的文件都通过 `index.ts` 来 `import`。

```json
// example

{
  "compilerOptions": {},
  "files": [
    "core.ts",
    "sys.ts",
    "types.ts",
    "scanner.ts"
  ]
}
```

<br />

### 4. extends

> 默认：false
>
> 值是一个字符串，其中包含要继承的另一个配置文件的路径，该路径可以使用 Node.js 样式解析。

1. 基础文件中的配置首先加载，然后被继承配置文件中的配置覆盖
2. 在配置文件中找到的所有相对路径都将相对于它们起源的配置文件进行解析
3. 继承配置文件中包含和排除的文件会覆盖基本配置文件中的文件
4. 配置文件之间不允许循环
5. 目前，唯一被排除在继承之外的顶级属性是 `references`

`extends` 用于在一个 `tsconfig.json` 文件中扩展其他 `tsconfig.json` 文件, 比如 angular 项目中有三个tsconfig 配置文件: `tsconfig.json`, `tsconfig.spec.json`, `tsconfig.app.json`

```json
// example

// tsconfig.json:
{
  "extends": "./configs/base",
  "files": ["main.ts", "supplemental.ts"]
}

// configs/base.json:
{
  "compilerOptions": {
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}

// tsconfig.nostrictnull.json:
{
  "extends": "./tsconfig",
  "compilerOptions": {
    "strictNullChecks": false
  }
}
```

<br />

### 5. reference

> 默认：false
>
> 一种将 TypeScript 程序构建成更小部分的方法。可以大大缩短构建和编辑器交互时间，强制组件之间的逻辑分离，并以新的和改进的方式组织代码。

TypeScript 3.0 时实现了 Project Reference 来优化性能。

如果项目下有一些相对独立的模块，别的模块的变动不影响它，但是它却要跟着重新编译一次，这时就可以用 Project Reference 来优化了。

在独立的模块下添加 tsconfig.json，加上 composite 的编译选项，在入口的 tsconfig.json 里配置 references 引用这些独立的模块。然后执行 tsc --build 或者 tsc -b 来编译。

这时候就实现了编译和类型检查的性能优化。

原理是编译时会生成 tsconfig.tsbuildinfo 的文件，记录着编译的文件和它们的 hash，当再次编译的时候，如果文件 hash 没变，那就直接跳过，从而提升了编译速度。

这是 TypeScript 提供的编译性能优化机制，当项目比较大，tsc 执行的速度比较慢的时候，不妨尝试一下。

<br />

### 6. Compiler Options

#### 1. Type Checking

**allowUnreachableCode**

> 默认：undefined
>
> 是否允许存在不可达的代码

<br />

**allowUnusedLabels**

> 默认：undefined
>
> 是否允许未使用的字面量对象

<br />

**exactOptionalPropertyTypes**

> 默认：false
>
> 应用更严格的规则来处理可选属性 (?)
>
> 发布：4.4

<br />

**noFallthroughCasesInSwitch**

> 默认：false
>
> 确保 switch 语句中的任何非空 case 包含 break 或 return

<br />

**noImplicitAny**

> 默认：如果设置了 strict 则为true，否则为false
>
> 禁止隐式的 any 类型

<br />

**noImplicitOverride**

> 默认：false
>
> 使用 noImplicitOverride 可以确保子类永远不会不同步，方法是确保重写的函数包含关键字 override。
>
> 发布：4.3

<br />

**noImplicitReturns**

> 默认：false
>
> 禁止函数隐式返回

<br />

**noImplicitThis**

> 默认：如果设置了 strict 则为true，否则为false
>
> 禁止 any 类型的 this

<br />

**noPropertyAccessFromIndexSignature**

> 默认：false
>
> 禁止索引签名属性的可访问性
>
> 发布：4.2

打开后，索引签名属性只允许通过动态参数属性访问，禁止 . 属性访问。

<br />

**noUncheckedIndexedAccess**

> 默认：false
>
> 为对象不确定索引签名属性添加 undefined 类型
>
> 发布：4.1

<br />

**noUnusedLocals**

> 默认：false
>
> 禁止未使用的本地变量

<br />

**noUnusedParameters**

> 默认：true
>
> 禁止未使用的函数参数

<br />

**strict**

> 默认：false
>
> 启用范围广泛的类型检查行为，开启后等同于启用所有严格模式系列选项，也可单独设置严格模式系列选项

<br />

**alwaysStrict**

> 默认：如果设置了 strict 则为true，否则为false
>
> 是否总是启用 ES5 严格模式

<br />

**strictBindCallApply**

> 默认：如果设置了 strict 则为true，否则为false
>
> 对内置函数 call/bind/apply 启用严格的参数类型校验
>
> 发布：3.2

<br />

**strictFunctionTypes**

> 默认：如果设置了 strict 则为true，否则为false
>
> 对函数参数进行严格校验，仅针对函数写法，不包含对象方法写法

<br />

**strictNullChecks**

> 默认：如果设置了 strict 则为true，否则为false
>
> 对 null/undefined 类型进行严格校验

<br />

**strictPropertyInitialization**

> 默认：如果设置了 strict 则为true，否则为false
>
> 对 class 中已声明却未在构造器中初始化的属性进行严格校验

<br />

**useUnknownInCatchVariables**

> 默认：如果设置了 strict 则为true，否则为false
>
> 在 TypeScript 4.0 中，添加了支持以允许将 catch 子句中的变量类型从 any 更改为 unknown
>
> 发布：4.4

<br />

#### 2. Modules

**allowUmdGlobalAccess**

> 默认：
>
> 允许 Umd 全局访问
>
> 发布：3.5

<br />

**baseUrl**

> 默认：'.'
>
> 设置解析非绝对路径模块名时的基准目录

<br />

**module**

> 默认：如果 target是 ES3/ES5 则为commonjs，否则为 es6/es2015
>
> 设置程序的模块系统
>
> 允许值：`none` / `commonjs` / `amd` / `umd` / `system` / `es6/es2015` / `es2020` / `es2022` / `esnext` / `node16` / `nodenext`

<br />

**moduleResolution**

> 默认：如果 module 是 amd/umd/system/es6、es2015 则为 classic，否则为 node
>
> 指定模块解析策略：`'node'` （Node.js） 或 `'classic'` （在 TypeScript 1.6 版本之前使用）。 你可能不需要在新代码中使用 `classic`
>
> 允许值：`classic` / `node` / `node16` / `nodenext`

<br />

**moduleSuffixes**

> 默认：’‘
>
> 提供一种方法来覆盖默认的文件名后缀列表以在解析模块时进行搜索
>
> 发布：4.7

<br />

**noResolve**

> 默认：false
>
> 默认情况下，TypeScript 将检查 import 和 <reference 指令的初始文件集，并将这些已解析的文件添加到您的程序中。如果设置了 noResolve，则不会发生此过程。但是，仍然会检查 import 语句以查看它们是否解析为有效模块，因此您需要确保通过其他方式满足这一点。

<br />

**paths**

> 默认：{}
>
> 将模块导入重新映射到相对于 `baseUrl` 路径的配置
>
> 告诉 TypeScript 文件解析器支持一些自定义的前缀来寻找代码。 这种模式可以避免在你的代码中出现过长的相对路径。

<br />

**resolveJsonModule**

> 默认：false
>
> 是否允许解析JSON模块

<br />

**rootDir**

> 默认：所有输入的非声明文件中的最长公共路径。若 `composite` 被指定，则是包含 `tsconfig.json` 文件的目录。
>
> 当 TypeScript 编译文件时，它在输出目录中保持与输入目录中相同的目录结构。

重要的是，`rootDir` **不会影响哪些文件被包含在编译中**。 它与 `tsconfig.json` 中 `include`，`exclude`，or `files` 的选项没有关系。

<br />

**rootDirs**

> 默认：
>
> 告诉编译器有许多“虚拟”的目录作为一个根目录

<br />

**typeRoots**

> 默认：
>
> 类型根路径：当 `typeRoots` 被指定，_仅有_ 在 `typeRoots` 下的包会被包含，其中所有的路径都是相对于 `tsconfig.json`。

默认情况下，所有 _可见_ 的 ”`@types`” 包都将包含在你的编译过程中。 在 `node_modules/@types` 中的任何包都被认为是 _可见_ 的。 例如，这意味着包含 `./node_modules/@types/`，`../node_modules/@types/`，`../../node_modules/@types/` 中所有的包。

<br />

**types**

> 默认：
>
> 类型：当 `types` 被指定，则只有列出的包才会被包含在全局范围内。

当你设置了这个选项，通过不在 `types` 数组中包含，它将：

- 不会再你的项目中添加全局声明（例如 node 中的 `process` 或 Jest 中的 `expect`）
- 导出不会出现再自动导入的建议中

此功能与 `typeRoots` 不同的是，它只指定你想要包含的具体类型，而 `typeRoots` 支持你想要特定的文件夹。

<br />

#### 3. Emit

**declaration**

> 默认：如果设置了 composite 则为true，否则为false
>
> 为你工程中的每个 TypeScript 或 JavaScript 文件生成 `.d.ts` 文件

<br />

**declarationDir**

> 默认：
>
> 提供一种配置发出声明文件的根目录的方法

<br />

**declarationMap**

> 默认：
>
> 为映射回原始 .ts 源文件的 .d.ts 文件生成源映射
>
> 发布：2.9

<br />

**downlevelIteration**

> 默认：
>
> 迭代器降级

<br />

**emitBOM**

> 默认：false
>
> 控制 TypeScript 在写入输出文件时是否会发出字节顺序标记 (BOM)

<br />

**emitDeclarationOnly**

> 默认：false
>
> 只发出 .d.ts 文件；不要发出 .js 文件
>
> 发布：2.8

<br />

**importHelpers**

> 默认：
>
> 导入辅助

对于某些降级行为，TypeScript 使用一些辅助代码来进行操作。例如继承类，展开数组或对象，以及异步操作。 默认情况下，这些辅助代码被插入到使用它们的文件中。 如果在许多不同的模块中使用相同的辅助代码，则可能会导致代码重复。

如果启用了 `importHelpers` 选项，这些辅助函数将从 [tslib](https://www.npmjs.com/package/tslib) 中被导入。 你需要确保 `tslib` 模块在运行时可以被导入。 这只影响模块，全局脚本文件不会尝试导入模块。

<br />

**importsNotUsedAsValues**

> 默认：remove
>
> 这个标志起作用是因为你可以使用 import type 显式地创建一个 import 语句，它永远不会被发送到 JavaScript 中。
>
> 允许值：`remove` / `preserve` / `error`
>
> 发布：3.8

<br />

**inlineSourceMap**

> 默认：false
>
> TypeScript 不会写出 .js.map 文件来提供源映射，而是将源映射内容嵌入到 .js 文件中

<br />

**inlineSources**

> 默认：false
>
> TypeScript 会将 .ts 文件的原始内容作为嵌入字符串包含在源映射中（使用源映射的 sourcesContent 属性）

<br />

**mapRoot**

> 默认：false
>
> 指定调试器应该定位映射文件而不是生成位置的位置

<br />

**newLine**

> 默认：平台指定
>
> 指定发出文件时要使用的行尾序列：‘CRLF’ (dos) 或 ‘LF’ (unix)

<br />

**noEmit**

> 默认：false
>
> 禁止编译器生成文件，例如 JavaScript 代码，source-map 或声明。

这为另一个工具提供了空间，例如用 [Babel](https://babeljs.io/) 或 [swc](https://github.com/swc-project/swc) 来处理将 TypeScript 转换为可以在 JavaScript 环境中运行的文件的过程。

然后你可以使用 TypeScript 作为提供编辑器集成的工具，或用来对源码进行类型检查。

<br />

**noEmitHelpers**

> 默认：false

您可以在全局范围内为您使用的助手提供实现，并完全关闭助手函数的发出，而不是使用 importHelpers 导入助手。

<br />

**noEmitOnError**

> 默认：false
>
> 如果报告了任何错误，请不要发出编译器输出文件，如 JavaScript 源代码、源映射或声明。

<br />

**outDir**

> 默认：源文件目录
>
> 输出目录

如果被指定，`.js` （以及 `.d.ts`, `.js.map` 等）将会被生成到这个目录下。 原始源文件的目录将会被保留，如果计算出的根目录不是你想要的，可以查看 [rootDir](https://www.staging-typescript.org/zh/tsconfig#rootDir)。

如果没有指定，`.js` 将被生成至于生成它们的 `.ts` 文件相同的目录中。

<br />

**outFile**

> 默认：
>
> 输出文件

如果被指定，所有 _全局_ （非模块） 文件将被合并到指定的单个输出文件中。

如果 `module` 为 `system` 或 `amd`，所有模块文件也将在所有全局内容之后被合并到这个文件中。

注：除非 `module` 是 `None`，`System` 或 `AMD`， 否则不能使用 `outFile`。 这个选项 _不能_ 用来打包 CommonJS 或 ES6 模块。

<br />

**preserveConstEnums**

> 默认：如果设置了 isolatedModules 则为true，否则为false
>
> 不要删除生成的代码中的 const enum 声明。 const 枚举提供了一种通过发出枚举值而不是引用来减少应用程序在运行时的整体内存占用的方法

<br />

**preserveValueImports**

> 默认：false
>
> 发布：4.5

<br />

**removeComments**

> 默认：false
>
> 当转换为 JavaScript 时，忽略所有 TypeScript 文件中的注释

<br />

**sourceMap**

> 默认：true
>
> 显示原始的 TypeScript 代码。 Source map 文件以 `.js.map` （或 `.jsx.map`）文件的形式被生成到相应的 `.js` 文件输出旁。

<br />

**sourceRoot**

> 默认：
>
> 指定调试器应定位 TypeScript 文件的位置，而不是相对源位置

<br />

**stripInternal**

> 默认：
> 不要为在其 JSDoc 注释中具有 @internal 注释的代码发出声明。这是一个内部编译器选项；使用风险自负，因为编译器不会检查结果是否有效。

<br />

#### 4. JavaScript Support

**allowJs**

> 默认： false
>
> 允许 JavaScript 文件在你的工程中被引入，而不是仅仅允许 `.ts` 和 `.tsx` 文件

<br />

**checkJs**

> 默认：false
>
> 与 `allowJs` 配合使用，当 `checkJs` 被启用时，JavaScript 文件中会报告错误。也就是相当于在项目中所有 JavaScript 文件顶部包含 `// @ts-check`。

<br />

**maxNodeModuleJsDepth**

> 默认：0
>
> 在 node_modules 下搜索并加载 JavaScript 文件的最大依赖深度

此标志只能在启用 allowJs 时使用，如果您想让 TypeScript 为 node_modules 中的所有 JavaScript 推断类型，则使用该标志。

<br />

#### 5. Editor Support

**disableSizeLimit**

> 默认：false
>
> 为了避免在处理非常大的 JavaScript 项目时可能出现的内存膨胀问题，TypeScript 分配的内存量有一个上限。打开此标志将删除限制。

<br />

**plugins**

> 默认：
>
> 可在编辑器内运行的语言服务插件列表

<br />

#### 6. Interop Constraints (互操作约束)

**allowSyntheticDefaultImports**

> 默认：如果 module 设置为 system，或者设置了 esModuleInterop 并且 module 不是 es6/es2015 或 esnext 为true，否则为false
>
> 当设置为 true， 并且模块**没有**显式指定默认导出时，`allowSyntheticDefaultImports` 可以让你写默认导入。

本选项不会影响 TypeScript 生成的 JavaScript，它仅对类型检查起作用。当你使用 Babel 生成额外的默认导出，从而使模块的默认导出更易用时，本选项可以让 TypeScript 的行为与 Babel 一致。

<br />

**esModuleInterop**

> 默认：false
>
> ES 模块互操作性
>
> 发布：2.7

默认情况下（未设置 `esModuleInterop` 或值为 false），TypeScript 像 ES6 模块一样对待 CommonJS/AMD/UMD。这样的行为有两个被证实的缺陷：

- 形如 `import * as moment from "moment"` 这样的命名空间导入等价于 `const moment = require("moment")`
- 形如 `import moment from "moment"` 这样的默认导入等价于 `const moment = require("moment").default`

这种错误的行为导致了这两个问题：

- ES6 模块规范规定，命名空间导入（`import * as x`）只能是一个对象。TypeScript 把它处理成 `= require("x")` 的行为允许把导入当作一个可调用的函数，这样不符合规范。
- 虽然 TypeScript 准确实现了 ES6 模块规范，但是大多数使用 CommonJS/AMD/UMD 模块的库并没有像 TypeScript 那样严格遵守。

开启 `esModuleInterop` 选项将会修复 TypeScript 转译中的这两个问题。第一个问题通过改变编译器的行为来修复，第二个问题则由两个新的工具函数来解决，它们提供了确保生成的 JavaScript 兼容性的适配层。

当启用 `esModuleInterop` 时，将同时启用 `allowSyntheticDefaultImports`。

<br />

**forceConsistentCasingInFileNames**

> 默认：false
>
> 强制文件名称大小写一致

<br />

**isolatedModules**

> 默认：true
>
> 孤立模块：

虽然你可以使用 TypeScript 来从 TypeScript 中生成 JavaScript 代码，但是使用其他转译器例如 [Babel](https://babeljs.io/) 也很常见。 但其他转译器一次只能在一个文件上操作，这意味着它们不能进行基于完全理解类型系统后的代码转译。 这个限制也同样适用于被一些构建工具使用的 TypeScript 的 `ts.transpileModule` 接口。

这些限制可能会导致一些 TypeScript 特性的运行时问题，例如 `const enum` 和 `namespace`。 设置 `isolatedModules` 选项后，TypeScript 将会在当你写的某些代码不能被单文件转译的过程正确处理时警告你。

它不会改变你代码的行为，也不会影响 TypeScript 的检查和代码生成过程。

<br />

**preserveSymlinks**

> 默认：
>
> 保留符号链接

这是为了匹配 Node.js 中相同的选项，它不解析符号链接的真实路径。

这个选项也表现出与 Webpack 中 `resolve.symlinks` 选项相反的行为（即设置 TypeScript 的 `preserveSymlinks` 为 true, 与之对应的 Webpack 的 `resolve.symlinks` 为 false。反之亦然）

启用后，对于模块和包的引用（例如 `import` 和 `/// <reference type="..." />` 指令都相对于符号链接所在的位置进行解析，而不是相对于符号链接解析后的路径。

<br />

#### 7. Backwards Compatibility (向后兼容性)

**charset (已弃用)**

> 默认：utf8
>
> 设置编码

<br />

**keyofStringsOnly (已弃用)**

> 默认：
>
> 此标志将 keyof 类型运算符更改为返回 string 而不是 string | number
>
> 发布：2.9

<br />

**noImplicitUseStrict**

> 默认：false
>
> 不隐式使用严格模式，一般不需要

<br />

**noStrictGenericChecks**

> 默认：false
>
> 不严格校验泛型

<br />

**out (已弃用)**

> 默认：
>
> 使用 ourFile 代替

<br />

**suppressExcessPropertyErrors**

> 默认：false
>
> 忽略多余的对象属性错误，不建议使用

<br />

**suppressImplicitAnyIndexErrors**

> 默认：
>
> 忽略隐式 any 索引错误，不建议使用

<br />

#### 8. Language and Environment

**emitDecoratorMetadata**

> 默认：false
>
> 启用对与模块 reflect-metadata 一起使用的装饰器的发射类型元数据的实验性支持

<br />

**experimentalDecorators**

> 默认：false
>
> 启用对装饰器的实验性支持，它处于 TC39 标准化过程的第 2 阶段

<br />

**jsx**

> 默认：react
>
> 控制 JSX 在 JavaScript 文件中的输出方式。 这只影响 `.tsx` 文件的 JS 文件输出。

允许值：

- `react`: 将 JSX 改为等价的对 `React.createElement` 的调用并生成 `.js` 文件
- `react-jsx`: 改为 `__jsx` 调用并生成 `.js` 文件
- `react-jsxdev`: 改为 `__jsx` 调用并生成 `.js` 文件
- `preserve`: 不对 JSX 进行改变并生成 `.jsx` 文件
- `react-native`: 不对 JSX 进行改变并生成 `.js` 文件

<br />

**jsxFactory**

> 默认：React.createElement
>
> 使用经典 JSX 运行时编译 JSX 元素时更改在 .js 文件中调用的函数。如果使用 preact，最常见的更改是使用“h”或“preact.h”而不是默认的“React.createElement”。

<br />

**jsxFragmentFactory**

> 默认：React.Fragment
>
> 指定在使用 jsxFactory 编译器选项指定 react JSX emit 时要使用的 JSX 片段工厂函数
>
> 发布：4.0

<br />

**jsxImportSource**

> 默认：react
>
> 声明模块说明符用于在将 jsx 用作 “react-jsx”或“react-jsxdev”时导入 jsx 和 jsxs 工厂函数。
>
> 发布：4.1

**lib**

> 默认：
>
> [完整列表](https://github.com/microsoft/TypeScript/tree/main/lib)

TypeScript 包括一组默认的内建 JS 接口（例如 `Math`）的类型定义，以及在浏览器环境中存在的对象的类型定义（例如 `document`）。 TypeScript 还包括与你指定的 `target` 选项相匹配的较新的 JS 特性的 API。例如如果`target` 为 `ES6` 或更新的环境，那么 `Map` 的类型定义是可用的。

你可能出于某些原因改变这些：

- 你的程序不运行在浏览器中，因此你不想要 `"dom"` 类型定义。
- 你的运行时平台提供了某些 JavaScript API 对象（也许通过 polyfill），但还不支持某个 ECMAScript 版本的完整语法。
- 你有一些 （但不是全部）对于更高级别的 ECMAScript 版本的 polyfill 或本地实现。

<br />

**moduleDetection**

> 默认：auto
>
> 模块检测
>
> 发布：4.7

- `auto` : 当 `module` 配置设置为 `nodenext` 或 `node16` 时，TypeScript 不仅会查找 import 和 export 语句，还会在运行时检查 package.json 中的 `type` 字段是否设置为 `module`
- `legacy`: 与 4.6 及之前版本相同的行为，使用 import 和 export 语句来确定文件是否为模块
- `force`: 确保每个非声明文件都被视为一个模块

**noLib**

> 默认：false
>
> 禁用自动包含任何库文件

**reactNamespace**

> 默认：
>
> 使用 `jsxFactory` 代替

<br />

**target**

> 默认：ES3
>
> 编译目标
>
> 允许值：`es3` / `es5` / `es6/es2015` / `es2016` / `es2017` / `es2018` / `es2019` / `es2020` / `es2021` / `es2022` / `esnext`

现代浏览器支持全部 ES6 的功能，所以 `ES6` 是一个不错的选择。 如果你的代码部署在旧的环境中，你可以选择设置一个更低的目标；如果你的代码保证会运行在新的环境中，你可以选择一个更高的目标。

`target` 的配置将会改变哪些 JS 特性会被降级，而哪些会被完整保留 例如，如果 `target` 是 ES5 或更低版本，箭头函数 `() => this` 会被转换为等价的 `函数` 表达式。

改变 `target` 也会改变 [`lib`](https://www.staging-typescript.org/zh/tsconfig#lib) 选项的默认值。 你可以根据需要混搭 `target` 和 `lib` 的配置，你也可以为了方便只设置 `target`。

特殊的 `ESNext` 值代表你的 TypeScript 所支持的最高版本。这个配置应当被谨慎使用，因为它在不同的 TypeScript 版本之间的含义不同，并且会导致升级更难预测。

<br />

**useDefineForClassFields**

> 默认：如果 target 为 ES2022或者更高(包括ESNext)则为true，否则为false
>
> 发布：3.7

<br />

#### 9. Compiler Diagnostics (编译器诊断)

**diagnostics (已弃用)**

> 默认：
>
> 用于输出调试信息，使用 extendedDiagnostics 代替

<br />

**explainFiles**

> 默认：false
>
> 此选项用于调试 tsc 编译文件如何成为编译的一部分
>
> 发布：4.2

- 显示基于目标的初始 lib.d.ts 查找，以及引用的 .d.ts 文件链
- 显示通过 include 的默认模式定位的 index.ts 文件

<br />

**extendedDiagnostics**

> 默认：false

您可以使用此标志来发现 TypeScript 在编译时将时间花在哪里。这是一个用于了解代码库整体性能特征的工具。

<br />

**generateCpuProfile**

> 默认：`profile.cpuprofile`
>
> 发布：3.7

此选项让 TypeScript 在编译器运行期间发出 v8 CPU 配置文件。 CPU 配置文件可以深入了解构建速度缓慢的原因。

生成的文件可以在基于 chromium 的浏览器（如 Chrome 或 Edge Developer）中的 CPU 分析器部分中打开。

::: warning 注意

:warning:此选项只能通过 CLI 使用：--generateCpuProfile tsc-output.cpuprofile

:::

<br />

**listEmittedFiles**

> 默认：false
>
> 将编译过程中生成的文件的名称打印到终端

在以下两个场景中有用：

- 希望在终端中将 TypeScript 转译为构建链的一部分，文件名将在下一个命令中处理
- 不确定 TypeScript 是否包含了期望编译的文件，作为调试文件包含设置的一部分

<br />

**listFiles**

> 默认：false
>
> 打印编译部分文件的名称

当不确定 TypeScript 是否包含期望的文件时很有用

::: warning 注意

如果使用 TypeScript 4.2，最好使用 `explainFiles`，它也提供了为什么添加文件的解释

:::

<br />

**traceResolution**

> 默认：false
>
> 跟踪文件解析

当调试模块未被包含时，可以将 traceResolution 设置为 true 以使 TypeScript 打印有关每个已处理文件的解析过程的信息

<br />

#### 10. Projects

<br />

**composite**

> 默认：false
>
> 发布：3.0

`composite` 选项会强制执行某些约束，使得构建工具（包括 在 `--build` 模式下的 TypeScript 本身）可以快速确定一个工程是否已经建立。

当此设置开启时：

- 如果没有明确指定 `rootDir`，则默认为包含 `tsconfig.json` 文件的目录。
- 所有实现的文件必须由 `include` 来匹配，或在 `files` 数组中指定。如果违反了这一约束，`tsc` 将告诉你哪些文件没有被指定。
- `declaration` 默认为 `true`。

<br />

**disableReferencedProjectLoad**

> 默认：false
>
> 多项目内容懒加载
>
> 发布：4.0

<br />

**disableSolutionSearching**

> 默认：false
>
> `composite` 为true时，使用此标志来提高大型复合项目的响应能力
>
> 发布：3.8

<br />

**disableSourceOfProjectReferenceRedirect**

> 默认：false
>
> 禁用源项目引用重定向
>
> 发布：3.7

<br />

**incremental**

> 默认：如果设置了 `composite` 则为true，否则为false
>
> 增量
>
> 发布：3.4

使 TypeScript 将上次编译的工程图信息保存到磁盘上的文件中。这将会在您编译输出的同一文件夹中创建一系列 `.tsbuildinfo` 文件。 它们不会再运行时被您的 JavaScript 使用，并且可以被安全的删除。

<br />

**tsBuildInfoFile**

> 默认：`.tsbuildinfo`
>
> 发布：3.4

这个选项可以让您指定一个文件来存储增量编译信息，以作为复合工程的一部分，从而可以更快的构建更大的 TypeScript 代码库。

这个选项提供了一种方法，可以配置 TypeScript 追踪它存储在磁盘上的文件的位置，用来指示项目的构建状态。—— 默认情况下，它们与你生成的 JavaScript 在同一个文件夹中。

<br />

#### 11. Output Formatting

<br />

**noErrorTruncation**

> 默认：false
>
> 不要截断错误消息

<br />

**preserveWatchOutput**

> 默认：false
>
> 是否在监视模式下保留过时的控制台输出，而不是每次发生更改时都清除屏幕

<br />

**pretty**

> 默认：true
>
> 使用颜色和上下文对错误和消息进行样式化，默认情况下启用 - 让您有机会从编译器中获得不那么简洁的单色消息

<br />

<br />

#### 12. Completeness (完整性)

<br />

**skipDefaultLibCheck**

> 默认：
>
> 跳过默认库声明文件的类型检查，使用 `skipLibCheck` 代替

<br />

**skipLibCheck**

> 默认：
>
> 跳过声明文件的类型检查

TypeScript 不会对所有 d.ts 文件进行全面检查，而是对您在应用程序源代码中具体引用的代码进行类型检查。

<br />

<br />

#### 13. Watch Options

配置 TypeScript --watch 的工作方式

<br />

**assumeChangesOnlyAffectDirectDependencies**

> 默认：true
>
> 假设更改仅影响直接依赖项
>
> 发布：3.8

<br />

**watchFile**

> 默认：`useFsEvents`
>
> 如何监视单个文件的策略
>
> 发布：3.8

- `fixedPollingInterval`: 以固定的时间间隔每秒多次检查每个文件的更改
- `priorityPollingInterval`: 每秒多次检查每个文件的更改，但使用启发式方法检查某些类型的文件的频率低于其他文件
- `dynamicPriorityPolling`: 使用动态队列，不经常检查修改频率较低的文件
- `useFsEvents`: 尝试使用操作系统/文件系统的本机事件进行文件更改
- `useFsEventsOnParentDirectory`: 尝试使用操作系统/文件系统的本机事件来侦听文件父目录的更改

<br />

**watchDirectory**

> 默认：`useFsEvents`
>
> 在缺乏递归文件监视功能的系统下如何监视整个目录树的策略
>
> 发布：3.8

- `fixedPollingInterval`: 以固定的时间间隔每秒多次检查每个目录是否有更改
- `dynamicPriorityPolling`: 使用动态队列，不经常检查修改频率较低的目录
- `useFsEvents`: 尝试使用操作系统/文件系统的本机事件进行目录更改

<br />

**fallbackPolling**

> 默认：
>
> 发布：3.8

使用文件系统事件时，此选项指定当系统用完本机文件观察器和/或不支持本机文件观察器时使用的轮询策略。

- `fixedPollingInterval`: 以固定的时间间隔每秒多次检查每个文件的更改
- `priorityPollingInterval`: 每秒多次检查每个文件的更改，但使用启发式方法检查某些类型的文件的频率低于其他文件
- `dynamicPriorityPolling`: 使用动态队列，不经常检查修改频率较低的文件
- `synchronousWatchDirectory`: 禁用对目录的延迟监视。当可能同时发生大量文件更改时，延迟监视很有用（例如，运行 npm install 时 node_modules 的更改），但是对于一些不太常见的设置，您可能希望使用此标志禁用它。

<br />

**synchronousWatchDirectory**

> 默认：false

在本机不支持递归监视的平台上同步调用回调并更新目录监视程序的状态。而不是给出一个小的超时来允许对一个文件进行潜在的多次编辑。

<br />

**excludeDirectories**

> 默认：[]
>
> 用以大幅减少 --watch 期间监视的文件数量

<br />

**excludeFiles**

> 默认：
>
> 从监视的文件中删除一组特定文件

<br />

<br />

#### 14. Type Acquisition (类型获取)

只针对 JavaScript 项目，TypeScript 工具将在后台和 node_modules 文件夹之外为您的模块下载类型。

<br />

**enable**

> 默认：true
>
> 提供用于在 JavaScript 项目中禁用类型获取的配置

<br />

**include**

> 默认：
>
> 指定应该使用 DefinitelyTyped 中的哪些类型

如果您有一个 JavaScript 项目，其中 TypeScript 需要额外的指导来理解全局依赖关系，或者已通过 `disableFilenameBasedTypeAcquisition` 禁用了内置推理。

<br />

**exclude**

> 默认：
>
> 提供用于禁用 JavaScript 项目中特定模块的类型获取的配置

<br />

**disableFilenameBasedTypeAcquisition**

> 默认：false
>
> 发布：4.1

TypeScript 的类型获取可以根据项目中的文件名推断出应该添加哪些类型。这意味着在你的项目中有一个像 jquery.js 这样的文件会自动从 DefinitelyTyped 下载 JQuery 的类型。如果要禁止此行为，请启用此配置。

> 参考：
>
> - [网道-tsconfig.json](https://wangdoc.com/typescript/tsconfig.json#isolatedmodules)
