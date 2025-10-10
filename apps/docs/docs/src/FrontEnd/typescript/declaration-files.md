## 介绍

- **声明参考**部分展示了许多常见的 `API` 模式以及如何为每个模式编写声明。
- **库结构指南**可帮助了解常见的库格式以及如何为每种格式编写正确的声明文件。
- **该做和不该做的**部分标识了常见错误，描述了如何检测它们以及如何修复它们。
- **深入探讨**部分解释了声明编写中的许多高级概念，并展示了如何利用这些概念来创建更清晰、更直观的声明文件。
- **发布到** `npm` 部分解释了如何将声明文件发布到 `npm` 包，并展示了如何管理依赖包。
- **寻找并安装声明文件**：对于 JavaScript 库用户，消费部分提供了几个简单的步骤来定位和安装相应的声明文件。

<br />

## 声明参考

本指南的结构是展示一些 `API` 的文档，以及该 `API` 的示例用法，并解释如何编写相应的声明。

### 具有属性的对象

```js
// js代码
const result = myLib.makeGreeting('hello, world')
console.log(`The computed greeting is:${result}`)
const count = myLib.numberOfGreetings
```

```typescript
// 声明文件
declare namespace myLib {
  function makeGreeting(s: string): string;
  let numberOfGreetings: number
}
```

::: tip

使用 `declare namespace` 来描述通过点分表示法访问的类型或值。

:::

### 函数重载

```typescript
let x: Widget = getWidget(43);
let arr: Widget[] = getWidget("all of them");
```

```typescript
// 声明文件
declare function getWidget(n: number): Widget;
declare function getWidget(s: string): Widget[];
```

### 可重用类型（接口）

```js
greet({
  greeting: 'hello world',
  duration: 4000
})
```

```typescript
// 声明文件
interface GreetParams {
  greeting: string
  duration: number
  color?: string
}
declare function greet(params: GreetParams): void;
```

### 可重用类型（类型别名）

```js
function getGreeting() {
  return 'howdy'
}
class MyGreeter extends Greeter {}
greet('hello')
greet(getGreeting)
greet(new MyGreeter())
```

```typescript
// 声明文件
type GreetingLike = string | (() => string) | MyGreeter;
declare function greet(g: GreetingLike): void;
```

### 组织类型

```js
const g = new Greeter('Hello')
g.log({ verbose: true })
g.alert({ modal: false, title: 'Current Greeting' })
```

```typescript
// 声明文件

// 使用namespace
declare namespace GreetingLib {
  interface LogOptions {
    verbose?: boolean;
  }
  interface AlertOptions {
    modal: boolean;
    title?: string;
    color?: string;
  }
}

// 使用嵌套的namespace
declare namespace GreetingLib.Options {
  // Refer to via GreetingLib.Options.Log
  interface Log {
    verbose?: boolean;
  }
  interface Alert {
    modal: boolean;
    title?: string;
    color?: string;
  }
}
```

### 类

```js
const myGreeter = new Greeter('hello, world')
myGreeter.greeting = 'howdy'
myGreeter.showGreeting()
class SpecialGreeter extends Greeter {
  constructor() {
    super('Very special greetings')
  }
}
```

```typescript
// 声明文件
declare class Greeter {
  constructor(greeting: string);
  greeting: string;
  showGreeting(): void;
}
```

::: tip

使用 `declare class` 来描述类或类类对象。类可以具有属性和方法以及构造函数。

:::

### 全局变量

```js
console.log(`Half the number of widgets is ${foo / 2}`)
```

```typescript
// 声明文件
declare var foo: number;
```

::: tip

使用 `declare var` 来声明变量。如果变量是只读的，可以使用 `declare const`。如果变量是块作用域的，您也可以使用 `declare let`。

:::

### 全局函数

```js
greet('hello, world')
```

```typescript
// 声明文件
declare function greet(greeting: string): void;
```

::: tip

使用 `declare function` 来声明函数。

:::

<br />

## 库结构指南

从广义上讲，构造声明文件的方式取决于库的使用方式。 在 JavaScript 中提供供使用的库的方法有很多种，您需要编写声明文件来匹配它。

本指南涵盖了如何识别常见的库模式，以及如何编写与该模式相对应的声明文件。 每种类型的主要库结构模式在模板部分都有一个对应的文件。

### 模块化库

几乎每个现代 `Node.js` 库都属于模块家族。这些类型的库只能在带有模块加载器的 JavaScript 环境中工作。

#### 从代码中识别模块库

模块化库通常至少有以下一些：

- 无条件调用 require 或 define
- 像 `import * as a from 'b'` 这样的声明；或 `export c`
- exports 或 `module.exports` 的赋值
- 分配给 `window` 或 `global` 的属性(少有)

<br />

#### 模块模板

有四个模板可用于模块：[`module.d.ts`](https://www.staging-typescript.org/docs/handbook/declaration-files/templates/module-d-ts.html), [`module-class.d.ts`](https://www.staging-typescript.org/docs/handbook/declaration-files/templates/module-class-d-ts.html), [`module-function.d.ts`](https://www.staging-typescript.org/docs/handbook/declaration-files/templates/module-function-d-ts.html) 和 [`module-plugin.d.ts`](https://www.staging-typescript.org/docs/handbook/declaration-files/templates/module-plugin-d-ts.html).

<br />

### 全局库

全局库是可以从全局范围访问的库（即不使用任何形式的 `import` ）。许多库只是公开一个或多个全局变量以供使用。

::: tip

今天，大多数流行的全球可访问库实际上都是作为 `UMD` 库编写的（见下文）。 `UMD` 库文档很难与全局库文档区分开来。 在编写全局声明文件之前，请确保该库实际上不是 `UMD`。

:::

<br />

#### 从代码中识别全局库

通常可见：

- 顶级 var 语句或函数声明
- 对 window.someName 的一项或多项分配
- 假设存在像文档或窗口这样的 DOM 原语

通常不可见：

- 检查或使用模块加载器，如 require 或 define
- `CommonJS/Node.js` 格式的导入 `var fs = require("fs");`
- 调用 `define(...)`
- 描述如何 `require` 或 `import` 库的文档

<br />

#### 全局库示例

因为将全局库转换为 `UMD` 库通常很容易，所以很少有流行的库仍然以全局风格编写。但是，小型且需要 DOM（或没有依赖项）的库可能仍然是全局的。

<br />

#### 全局库模板

[`global.d.ts`](https://www.staging-typescript.org/docs/handbook/declaration-files/templates/global-plugin-d-ts.html)

<br />

### UMD

`UMD` 模块既可以用作模块（通过导入），也可以用作全局模块（在没有模块加载器的环境中运行时）。

<br />

#### 识别 UMD 库

`UMD` 模块检查是否存在模块加载器环境。这是一个易于发现的模式，看起来像这样：

```js
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["libName"], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("libName"));
    } else {
        root.returnExports = factory(root.libName);
    }
}(this, function (b) {})
```

::: tip

如果在库的代码中看到 `typeof define`、`typeof window` 或 `typeof module` 的测试，尤其是在文件的顶部，它几乎总是 `UMD` 库。

`UMD` 库的文档也经常会展示一个“在 `Node.js` 中使用”的示例，其中展示了 `require`，以及一个“在浏览器中使用”的示例，展示了使用 `<script>` 标签来加载脚本。

:::

<br />

#### UMD 模板

[`module-plugin.d.ts`](https://www.staging-typescript.org/docs/handbook/declaration-files/templates/module-plugin-d-ts.html)

<br />

### 消费依赖

您的库可能有多种依赖关系。本节介绍如何将它们导入声明文件。

<br />

#### 对全局库的依赖

如果您的库依赖于全局库，请使用 `/// <reference types="..." />` 指令：

```typescript
/// <reference types="someLib" />
function getThing(): someLib.thing;
```

<br />

#### 对模块的依赖

使用 `import` 语句：

```typescript
import * as moment from "moment";
function getThing(): moment;
```

<br />

#### 对 UMD 库的依赖

**来自全局库**

如果您的全局库依赖于 `UMD` 模块，请使用 `/// <reference types` 指令：

```typescript
/// <reference types="moment" />
function getThing(): moment;
```

**来自模块或 UMD 库**

使用 `import` 语句：

```typescript
import * as someLib from 'someLib'
```

::: danger 注意

不要使用 `/// <reference` 指令来声明对 `UMD` 库的依赖！

:::

<br />

### 防止名称冲突

请注意，在编写全局声明文件时，可以在全局范围内定义许多类型。我们强烈反对这样做，因为当项目中有许多声明文件时，它可能会导致无法解决的名称冲突。

要遵循的一个简单规则是只声明由库定义的任何全局变量命名空间的类型。

```typescript
// 正确
declare namespace cats {
  interface KittySettings {}
}

// 不正确
// at top-level
interface CatsKittySettings {}
```

<br />

### ES6 对模块调用签名的影响

在符合 `ES6` 的模块加载器中，顶级对象只能有属性；顶级模块对象永远无法调用。

这里最常见的解决方案是为可调用/可构造对象定义默认导出；模块加载器通常会自动检测到这种情况，并用默认导出替换顶级对象。如果您的 `tsconfig.json` 中有 `"esModuleInterop": true`，TypeScript 可以为您处理。

<br />

## .d.ts 模板

### 常见的 CommonJS 模式

```js
const maxInterval = 12
function getArrayLength(arr) {
  return arr.length
}
module.exports = {
  getArrayLength,
  maxInterval,
}
```

```typescript
// 声明文件
export function getArrayLength(arr: any[]): number;
export const maxInterval: 12;
```

```js
// 默认导出
module.exports = /hello( world)?/

module.exports = 3.142
```

```typescript
// 声明文件
declare const helloWorld: RegExp;
export default helloWorld;

declare const pi: number;
export default pi;
```

`CommonJS` 中的一种导出方式是导出一个函数。因为函数也是一个对象，所以可以添加额外的字段并将其包含在导出中。

```js
function getArrayLength(arr) {
  return arr.length
}
getArrayLength.maxInterval = 12
module.exports = getArrayLength
```

```typescript
// 声明文件
export default function getArrayLength(arr: any[]): number;
export const maxInterval: 12;
```

::: warning

请注意，在 `.d.ts` 文件中使用 export default 需要 `esModuleInterop: true` 才能工作。 如果你不能在你的项目中使用 `esModuleInterop: true`，你将不得不使用 `export=` 语法。 这种较旧的语法更难使用，但可以在任何地方使用。

:::

```typescript
// export=语法 声明文件
declare function getArrayLength(arr: any[]): number;
declare namespace getArrayLength {
  declare const maxInterval: 12;
}
export = getArrayLength;
```

<br />

### 模块中的类型

模块的消费者可以使用 `TypeScript` 代码或 [JSDoc 导入](https://www.staging-typescript.org/docs/handbook/jsdoc-supported-types.html#import-types) 中的 `import` 或 `import type` 来重新使用导出的类型。

<br />

### 模块代码中的命名空间

可以使用 `export as namespace xxx` 来声明您的模块，将在 `UMD` 上下文中的全局范围内可用：

<br />

> 参考：
>
> - [TypeScript入门教程](https://ts.xcatliu.com/basics/declaration-files.html)
