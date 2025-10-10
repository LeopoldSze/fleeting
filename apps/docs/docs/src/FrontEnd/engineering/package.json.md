#### 1. introduction

- `~`会匹配最近的小版本依赖包，比如`~1.2.3`会匹配所有`1.2.x`版本，但是不包括`1.3.0`
- `^`会匹配最新的大版本依赖包，比如`^1.2.3`会匹配所有`1.x.x`的包，包括`1.3.0`，但是不包括`2.0.0`
- `*`这意味着安装最新版本的依赖包

#### 2. 必须属性

`package.json` 中最重要的两个字段就是 `name` 和 `version`，它们都是必须的，如果没有，就无法正常执行 `npm install` 命令。`npm` 规定 `package.json` 文件是由名称和版本号作为唯一标识符的。

##### 1. name

名称的长度必须小于或等于214个字符，不能以“.”和“\_”开头，不能包含大写字母（这是因为当软件包在npm上发布时，会基于此属性获得自己的URL，所以不能包含非URL安全字符（non-url-safe））；

名称可以作为参数被传入require("")，用来导入模块，所以应当尽可能的简短、语义化；

名称不能和其他模块的名称重复，可以使用npm view命令查询模块明是否重复，如果不重复就会提示404：

```bash
npm view vue
```

##### 2. version

version字段表示该项目包的版本号，它是一个字符串。在每次项目改动后，即将发布时，都要同步的去更改项目的版本号。版本号的使用规范如下：

- 版本号的命名遵循语义化版本2.0.0规范，格式为：**主版本号.次版本号.修订号**，通常情况下，修改主版本号是做了大的功能性的改动，修改次版本号是新增了新功能，修改修订号就是修复了一些bug；
- 如果某个版本的改动较大，并且不稳定，可能如法满足预期的兼容性需求，就需要发布先行版本，先行版本通过会加在版本号的后面，通过“-”号连接以点分隔的标识符和版本编译信息：内部版本（alpha）、公测版本（beta）和候选版本（rc，即release candiate）。

```bash
// 查看最新版本
npm view react version

// 查看所有版本
npm view react versions

// 升级修订版本号
npm version patch

// 升级次版本号
npm version minor

// 升级主版本号
npm version major
```

#### 3. 描述信息

##### 1. description

`description` 字段用来描述这个项目包，它是一个字符串，可以让其他开发者在 `npm ` 的搜索中发现我们的项目包。

##### 2. keywords

keywords字段是一个字符串数组，表示这个项目包的关键词。和description一样，都是用来增加项目包的曝光率的。

##### 3. author

author顾名思义就是作者，表示该项目包的作者。

```json
{
  "author": "... <xxx.com> (url)"
}

{
  "name": '',
  "email": '',
  "url": ''
}
```

##### 4. repository

`repository` 表示代码的存放仓库地址，通常有两种书写形式

```bash
"repository": {
  "type": "git",
  "url": "https://github.com/facebook/react.git"
}
```

#### 4. 依赖配置

通常情况下，我们的项目会依赖一个或者多个外部的依赖包，根据依赖包的不同用途，可以将他们配置在下面的五个属性下：`dependencies`、`devDependencies`、`peerDependencies`、`bundledDependencies`、`optionalDependencies `

##### 1. dependencies

dependencies字段中声明的是项目的生产环境中所必须的依赖包。当使用 `npm` 或 `yarn` 安装 `npm` 包时，该 `npm` 包会被自动插入到此配置项中：

```json
"dependencies": {
   "react": "^17.0.2",
   "react-dom": "^17.0.2",
   "react-scripts": "4.0.3",
},
```

这里每一项配置都是一个键值对（key-value）， `key`表示模块名称，`value`表示模块的版本号。版本号遵循**主版本号.次版本号.修订号**的格式规定：

- **固定版本：** 上面的`react-scripts`的版本`4.0.3`就是固定版本，安装时只安装这个指定的版本；
- **波浪号：** 比如`~4.0.3`，表示安装`4.0.x`的最新版本（不低于`4.0.3`），也就是说安装时不会改变主版本号和次版本号；
- **插入号：** 比如上面 `react `的版本`^17.0.2`，表示安装`17.x.x`的最新版本（不低于`17.0.2`），也就是说安装时不会改变主版本号。如果主版本号为`0`，那么插入号和波浪号的行为是一致的；
- `latest`：安装最新的版本。

##### 2. devDependencies

`devDependencies`中声明的是开发阶段需要的依赖包，如`Webpack`、`Eslint`、`Babel`等，用于辅助开发。它们不同于 `dependencies`，因为它们只需安装在开发设备上，而无需在生产环境中运行代码。当打包上线时并不需要这些包，所以可以把这些依赖添加到 `devDependencies` 中，这些依赖依然会在本地指定 `npm install `时被安装和管理，但是不会被安装到生产环境中。

##### 3. peerDependencies

有些情况下，我们的项目和所依赖的模块，都会同时依赖另一个模块，但是所依赖的版本不一样。比如，我们的项目依赖A模块和B模块的1.0版，而A模块本身又依赖B模块的2.0版。大多数情况下，这不是问题，B模块的两个版本可以并存，同时运行。但是，有一种情况，会出现问题，就是这种依赖关系将暴露给用户。

最典型的场景就是插件，比如A模块是B模块的插件。用户安装的B模块是1.0版本，但是A插件只能和2.0版本的B模块一起使用。这时，用户要是将1.0版本的B的实例传给A，就会出现问题。因此，需要一种机制，在模板安装的时候提醒用户，如果A和B一起安装，那么B必须是2.0模块。

`peerDependencies`字段就是用来供插件指定其所需要的主工具的版本。

需要注意，从`npm 3.0`版开始，`peerDependencies`不再会默认安装了。

```json
"name": "chai-as-promised",
"peerDependencies": {
   "chai": "1.x"
}
```

##### 4. optionalDependencies

如果需要在找不到包或者安装包失败时，npm仍然能够继续运行，则可以将该包放在optionalDependencies对象中，optionalDependencies对象中的包会覆盖dependencies中同名的包，所以只需在一个地方进行设置即可。

需要注意，由于optionalDependencies中的依赖可能并为安装成功，所以一定要做异常处理，否则当获取这个依赖时，如果获取不到就会报错。

##### 5. bundledDependencies

上面的几个依赖相关的配置项都是一个对象，而bundledDependencies配置项是一个数组，数组里可以指定一些模块，这些模块将在这个包发布时被一起打包。

需要注意，这个字段数组中的值必须是在dependencies, devDependencies两个里面声明过的包才行。

##### 6. engines

当我们维护一些旧项目时，可能对npm包的版本或者Node版本有特殊要求，如果不满足条件就可能无法将项目跑起来。为了让项目开箱即用，可以在engines字段中说明具体的版本号：

```json
"engines": {
	"node": ">=8.10.3 <12.13.0",
  "npm": ">=6.9.0"
}
```

需要注意，engines只是起一个说明的作用，即使用户安装的版本不符合要求，也不影响依赖包的安装。

#### 5. 脚本配置

##### 1. scripts

scripts 是 package.json中内置的脚本入口，是key-value键值对配置，key为可运行的命令，可以通过 npm run 来执行命令。除了运行基本的scripts命令，还可以结合pre和post完成前置和后续操作。

```json
"scripts": {
	"dev": "node index.ts",
  "predev": "node beforeIndex.js",
  "postdev": "node afterIndex.js"
}
```

可以看到，三个命令都执行了，执行顺序是 `predev` → `dev` → `postdev`。如果`scripts`命令存在一定的先后关系，则可以使用这三个配置项，分别配置执行命令。

##### 2. config

config字段用来配置scripts运行时的配置参数。

```json
"config": {
	"port": 3000
}

console.log(process.env.npm_package_config_port) // 3000
```

#### 6. 文件 & 目录

##### 1. main

`main` 字段用来指定加载的入口文件，在 `browser` 和 `Node`环境中都可以使用。如果我们将项目发布为`npm`包，那么当使用 `require` 导入`npm`包时，返回的就是`main`字段所列出的文件的`module.exports` 属性。如果不指定该字段，默认是项目根目录下的`index.ts`。如果没找到，就会报错。

```json
{
  "main": "./src/index.ts"
}
```

##### 2. browser

browser字段可以定义 `npm` 包在 `browser`环境下的入口文件。如果 `npm` 包只在 `web` 端使用，并且严禁在 `server` 端使用，使用 `browser` 来定义入口文件。

##### 3. module

`module`字段可以定义` npm` 包的 `ESM` 规范的入口文件，`browser `环境和 `node` 环境均可使用。如果 `npm`包导出的是 `ESM` 规范的包，使用 `module` 来定义入口文件。

```json
{
  "module": "./src/index.mjs"
}
```

上面三个的入口入口文件相关的配置是有差别的，特别是在不同的使用场景下。在Web环境中，如果使用loader加载ESM（ES module），那么这三个配置的加载顺序是browser→module→main，如果使用require加载CommonJS模块，则加载的顺序为main→module→browser。

Webpack在进行项目构建时，有一个target选项，默认为Web，即构建Web应用。如果需要编译一些同构项目，如node项目，则只需将webpack.config.js的target选项设置为node进行构建即可。如果再Node环境中加载CommonJS模块，或者ESM，则只有main字段有效。

##### 4. bin

bin字段用来指定各个内部命令对应的可执行文件的位置：

```json
{
  "bin": {
    "someTool": "./bin/someTool.js"
  }
}
```

这里，someTool 命令对应的可执行文件为 bin 目录下的 someTool.js，someTool.js会建立符号链接node_modules/.bin/someTool。由于node_modules/.bin/目录会在运行时加入系统的PATH变量，因此在运行npm时，就可以不带路径，直接通过命令来调用这些脚本。因此，下面的写法可以简写：

```bash
scripts: {
  start: './node_modules/bin/someTool.js build'
}

// 简写
scripts: {
  start: 'someTool build'
}
```

所有node_modules/.bin/目录下的命令，都可以用npm run [命令]的格式运行。

上面的配置在package.json包中提供了一个映射到本地文件名的bin字段，之后npm包将链接这个文件到prefix/fix里面，以便全局引入。或者链接到本地的node_modules/.bin/文件中，以便在本项目中使用。

##### 5. files

files配置是一个数组，用来描述当把npm包作为依赖包安装时需要说明的文件列表。当npm包发布时，files指定的文件会被推送到npm服务器中，如果指定的是文件夹，那么该文件夹下面所有的文件都会被提交。

```json
{
  "files": [
    "LICENSE",
    "Readme.md",
    "index.ts",
    "lib/"
  ]
}
```

如果有不想提交的文件，可以在项目根目录中新建一个 `.npmignore` 文件，并在其中说明不需要提交的文件，防止垃圾文件推送到npm上。这个文件的形式和.gitignore类似。写在这个文件中的文件即便被写在files属性里也会被排除在外。

#### 7. 发布设置

##### 1. private

`private`字段可以防止我们意外地将私有库发布到`npm`服务器。只需要将该字段设置为`true`。

##### 2. preferGlobal

`preferGlobal` 字段表示当用户不把该模块安装为全局模块时，如果设置为`true`就会显示警告。它并不会真正的防止用户进行局部的安装，只是对用户进行提示，防止产生误解

#### 8. 第三方配置

##### 1. browsersList

```json
{
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

#### 2. git hooks 配置

```json
"husky": {
    "hooks": {
      "applypatch-msg": "echo \"[Husky] applypatch-msg\"",
      "pre-applypatch": "echo \"[Husky] pre-applypatch\"",
      "post-applypatch": "echo \"[Husky] post-applypatch\"",
      "pre-commit": "echo \"[Husky] pre-commit\"",
      "pre-merge-commit": "echo \"[Husky] pre-merge-commit\"",
      "prepare-commit-msg": "echo \"[Husky] prepare-commit-msg\"",
      "commit-msg": "echo \"[Husky] commit-msg\"",
      "post-commit": "echo \"[Husky] post-commit\"",
      "pre-rebase": "echo \"[Husky] pre-rebase\"",
      "post-checkout": "echo \"[Husky] post-checkout\"",
      "post-merge": "echo \"[Husky] post-merge\"",
      "pre-push": "echo \"[Husky] pre-push\"",
      "pre-receive": "echo \"[Husky] pre-receive\"",
      "update": "echo \"[Husky] update\"",
      "post-receive": "echo \"[Husky] post-receive\"",
      "post-update": "echo \"[Husky] post-update\"",
      "reference-transaction": "echo \"[Husky] reference-transaction\"",
      "push-to-checkout": "echo \"[Husky] push-to-checkout\"",
      "pre-auto-gc": "echo \"[Husky] pre-auto-gc\"",
      "post-rewrite": "echo \"[Husky] post-rewrite\"",
      "sendemail-validate": "echo \"[Husky] sendemail-validate\"",
      "fsmonitor-watchman": "echo \"[Husky] fsmonitor-watchman\"",
      "p4-changelist": "echo \"[Husky] p4-changelist\"",
      "p4-prepare-changelist": "echo \"[Husky] p4-prepare-changelist\"",
      "p4-post-changelist": "echo \"[Husky] p4-post-changelist\"",
      "p4-pre-submit": "echo \"[Husky] p4-pre-submit\"",
      "post-index-change": "echo \"[Husky] post-index-change\""
    }
  },

"husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "npx --no-install commitlint --edit $1"
    }
  },
  "lint-staged": {
    "*.*": [
      "prettier --write"
    ],
    "*.{js,ts,tsx,jsx}": [
      "eslint --fix"
    ],
    "*.{less,css,scss,sass}": [
      "stylelint --config  ./.stylelintrc --fix"
    ]
  }
```
