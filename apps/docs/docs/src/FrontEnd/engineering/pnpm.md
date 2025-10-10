#### 1. 安装

```bash
npm install -g pnpm

npx pnpm add -g pnpm
```

#### 2. 升级

一旦你安装了 pnpm，就无需再使用其他软件包管理器进行升级。 你可以使用 pnpm 升级自己：

```bash
pnpm add -g pnpm
```

#### 3. 兼容性

以下是各版本 pnpm 与各版本 Node.js 之间的支持表格。

| Node.js    | pnpm 1 | pnpm 2 | pnpm 3 | pnpm 4 | pnpm 5 | pnpm 6 |
| ---------- | ------ | ------ | ------ | ------ | ------ | ------ |
| Node.js 4  | ✔️     | ❌     | ❌     | ❌     | ❌     | ❌     |
| Node.js 6  | ✔️     | ✔️     | ❌     | ❌     | ❌     | ❌     |
| Node.js 8  | ✔️     | ✔️     | ✔️     | ❌     | ❌     | ❌     |
| Node.js 10 | ✔️     | ✔️     | ✔️     | ✔️     | ✔️     | ❌     |
| Node.js 12 | ❌     | ❌     | ✔️     | ✔️     | ✔️     | ✔️     |
| Node.js 14 | ❌     | ❌     | ✔️     | ✔️     | ✔️     | ✔️     |
| Node.js 16 | ?      | ?      | 未知   | 未知   | 未知   | ✔️     |

#### 4. 故障排查

如果 pnpm 损坏并且您无法通过重新安装来修复它，您可能需要从 PATH 中将其手动删除。

假设您在运行 `pnpm install`时遇到以下错误：

```powershell
C:\src>pnpm install
internal/modules/cjs/loader.js:883
  throw err;
  ^

Error: Cannot find module 'C:\Users\Bence\AppData\Roaming\npm\pnpm-global\4\node_modules\pnpm\bin\pnpm.js'
←[90m    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:880:15)←[39m
←[90m    at Function.Module._load (internal/modules/cjs/loader.js:725:27)←[39m
←[90m    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)←[39m
←[90m    at internal/main/run_main_module.js:17:47←[39m {
  code: ←[32m'MODULE_NOT_FOUND'←[39m,
  requireStack: []
}
```

#### 5. 查找pnpm位置

首先，尝试通过运行： `which pnpm`来找到 pnpm 的位置。

如果您使用的是 Windows，请在 Git Bash 中运行此命令。 您将获得 pnpm 命令的位置，例如：

```bash
$ which pnpm
/c/Program Files/nodejs/pnpm
```

现在您应该已经知道了 pnpm CLI 的所在目录。打开该目录并删除所有与 pnpm 相关的文件（如`pnpm.cmd`、 `pnpx.cmd`、 `pnpm`等）。 完成后，再次安装 pnpm。现在，它应该正按照预期工作。

| npm 命令        | pnpm 等效                                        |
| --------------- | ------------------------------------------------ |
| `npm install`   | [`pnpm install`](https://pnpm.io/zh/cli/install) |
| `npm i <pkg>`   | [`pnpm add <pkg>`]                               |
| `npm run <cmd>` | [`pnpm <cmd>`]                                   |

当你使用一个未知命令时, pnpm 会查找一个具有指定名称的脚本, 所以 `pnpm run lint` 和 `pnpm lint`相同.

#### 6. CLI命令

##### 1. 管理依赖

###### 1. pnpm add

`pnpm add <pkg>`: 安装软件包及其依赖的任何软件包。

默认情况下，任何新软件包都安装为生产依赖项。

`pnpm add package-name` 默认会从 [npm registry](https://www.npmjs.com/)安装最新的 `package-name`.

| Command                 | 含义                          |
| ----------------------- | ----------------------------- |
| `pnpm add sax`          | 保存到 `dependencies`         |
| `pnpm add -D sax`       | 保存到 `devDependencies`      |
| `pnpm add -O sax`       | 保存到 `optionalDependencies` |
| `pnpm add sax@next`     | 安装 `next` tag               |
| `pnpm add sax@3.0.0`    | 安装指定版本 `3.0.0`          |
| `pnpm add -P sax`       | 保存到 `dependencies`         |
| `pnpm add sax --global` | 安装全局依赖                  |

###### 2. pnpm install

`pnpm install | i` 用于安装项目所有依赖.

| Command                    | Meaning                          |
| -------------------------- | -------------------------------- |
| `pnpm i --offline`         | 仅从 store 中离线下载            |
| `pnpm i --frozen-lockfile` | `pnpm-lock.yaml` is not updated  |
| `pnpm i --lockfile-only`   | Only `pnpm-lock.yaml` is updated |

###### 3. pnpm update

`pnpm update | up` 根据指定的范围更新软件包的最新版本。

在不带参数的情况下使用时，将更新所有依赖关系。

| Command                | Meaning                                        |
| ---------------------- | ---------------------------------------------- | ------------------------------------------------------ |
| `pnpm up`              | 遵循 `package.json` 指定的范围更新所有的依赖项 |
| `pnpm up --latest      | -L`                                            | 更新所有依赖项，此操作会忽略 `package.json` 指定的范围 |
| `pnpm up foo@2`        | 将 `foo` 更新到 v2 上的最新版本                |
| `pnpm up "@babel/*"`   | 更新 `@babel` 范围内的所有依赖项               |
| `pnpm up --interactive | -i`                                            | 显示过时的依赖项并选择要更新的依赖项                   |

###### 4. pnpm remove

Aliases: rm, uninstall, un

Removes packages from `node_modules` and from the project's `package.json`.

| Command                | Meaning              |
| ---------------------- | -------------------- |
| `pnpm remove --global` | 从全局删除一个依赖包 |

###### 5. pnpm import

`pnpm import` 从另一个软件包管理器的 lock 文件生成 `pnpm-lock.yaml`。 支持的源文件：

- `package-lock.json`
- `npm-shrinkwrap.json`
- `yarn.lock` (v6.14.0 起)

###### 6. pnpm rebuild

别名： `rb`

重建一个`package`。

###### 7. pnpm prune

移除不需要的软件包

| Command                    | Meaning                                    |
| -------------------------- | ------------------------------------------ |
| `pnpm prune --prod`        | 删除在 `devDependencies` 中指定的包。      |
| `pnpm prune --no-optional` | 删除在 `optionalDependencies` 中指定的包。 |

##### 2. 查看依赖

###### 1. pnpm audit

检查已安装包的已知安全问题。

如果发现安全问题，请尝试通过 `pnpm update `更新您的依赖项。 如果简单的更新不能解决所有问题，请使用 [overrides ](https://pnpm.io/zh/package_json#pnpmoverrides)来强制使用 不易受攻击的版本。 例如，如果 `lodash@<2.1.0` 易受攻击，可用这个`overrides`来强制使用 `lodash@^2.1.0`：

```json
{
  "pnpm": {
    "overrides": {
      "lodash@<2.1.0": "^2.1.0"
    }
  }
}
```

或者，运行 `pnpm audit --fix`，强制将不易受攻击的版本，添加覆盖到 `package.json` 文件中。

###### 2. pnpm list

别名: `ls`

此命令会以一个树形结构输出所有的已安装`package`的版本及其依赖。

如果位置参数是 `name-pattern@version-range` 标识符，会将输出限制为仅为这样命名的包。 例如，`pnpm list "babel-*" "eslint-*" semver@5`。

| Command                      | Meaning                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| `pnpm list --parseable`      | 以可解析的格式输出`package`目录而不是它们的树结构视图                                  |
| `pnpm list --global`         | 列出在全局安装目录的`package`，而不是在当前项目中                                      |
| `pnpm list --depth <number>` | 依赖项的树的最大显示深度: `--depth 0` 将仅列出直接的依赖项。 `--depth -1` 将仅列出项目 |

###### 3. pnpm outdated

检查过期的 `packages`。

| Command                  | Meaning                 |
| ------------------------ | ----------------------- |
| `pnpm outdated --global` | 列出过期的全局`package` |
| `pnpm outdated --long`   | 打印详细信息            |

##### 3. 运行脚本

###### 1. pnpm run

别名: `run-script`

运行一个在 `package`的 manifest 文件中定义的脚本。

###### 2. pnpm exec

在项目范围内执行 shell 命令。

###### 3. pnpm start

别名: `run start`

运行在` package` 的` scripts` 对象中`start` 属性指定的任意的命令。 如果`scripts` 对象没有指定` start` 属性，那么默认将尝试执行 `node server.js`，如果都不存在则会执行失败。

该属性的预期的作用是想为您的程序指定一个`start`命令。

##### 4. 管理环境

###### 1. pnpm env [cmd]

管理 Node.js 环境，安装并使用指定版本的 Node.js。

| Command                  | Meaning |
| ------------------------ | ------- | -------- |
| `pnpm env [cmd] --global | -g`     | 全局生效 |

```bash
// 安装 LTS 版本的 Node.js
pnpm env use --global lts

// 安装 v16 的Node.js
pnpm env use --global 16

// 安装 Node.js 的预发行版本
pnpm env use --global nightly
pnpm env use --global rc
pnpm env use --global 16.0.0-rc.0
pnpm env use --global rc/14

// 安装最新版本的 Node.js
pnpm env use --global latest
```

#### 7. 配置

##### 1. package.json

###### 1. engines

你可以指定你的软件能够运行的 Node 版本和 pnpm 版本：

```bash
{
    "engines": {
        "node": ">=10",
        "pnpm": ">=3"
    }
}
```

###### 2. .npmrc

pnpm 从命令行、环境变量和 `.npmrc` 文件中获取其配置。

`pnpm config` 命令可用于更新和编辑 用户和全局 `.npmrc` 文件的内容。

四个相关文件分别为：

- 每个项目的配置文件（`/path/to/my/project/.npmrc`）
- 每个工作区的配置文件（包含 `pnpm-workspace.yaml` 文件的目录）
- 每位用户的配置文件（ `~/.npmrc` ）
- 全局配置文件（ `/etc/npmrc` ）

#### 8. 卸载pnpm

##### 1. 移除全局安装的包

要列出所有全局包，请运行 `pnpm ls -g`。 有两种方法可以删除全局包：

1. 运行 `pnpm rm -g <pkg>...` 列出每个全局包。
2. 运行 `pnpm root -g` 找到全局目录的位置并手动删除它。

##### 2. 移除 pnpm CLI

如果您使用独立脚本安装 pnpm（或 npx），那么您应该能够使用以下命令卸载 pnpm CLI：

```bash
pnpm rm -g pnpm
```

复制

如果您使用 npm 安装 pnpm，那么您应该使用 npm 卸载 pnpm：

```bash
npm rm -g pnpm
```

##### 3. 删除全局内容可寻址存储

如果您仅在主磁盘中使用 pnpm，那么您将在主目录中拥有一个全局存储。 所以只需通过以下方式删除它：

```bash
rm -rf ~/.pnpm-store
```

复制

如果您在非主磁盘中使用 pnpm，则存储位于该磁盘的根目录中。 例如，如果您 `D:` 上使用 pnpm，请从 `D:\.pnpm-store`删除存储。

##### 4. 删除状态文件

pnpm 也在 `~/.pnpm-state.json` 保存了一些状态。 您可以删除此文件。
