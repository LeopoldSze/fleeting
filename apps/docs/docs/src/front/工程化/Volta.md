---
title: Volta
date: '2026-09-09 15:07:58'
updated: '2026-09-09 17:09:35'
slug: Volta
---
# Volta 前端工具链完整指南（Windows 版）
> 适用场景：换新机器 / 重装系统后，从零开始重新搭建 Volta + Node + npm + yarn + pnpm 的完整开发环境。  
本文档基于 Volta 官方文档（docs.volta.sh）整理，结合国内网络环境做了镜像源适配。  
适用人群：纯前端方向（网页端 / H5 / 小程序端），兼顾 Flutter App 开发场景。
>

---

## 目录
1. [Volta 是什么，为什么用它](#1-volta-是什么为什么用它)
2. [安装](#2-安装)
3. [核心概念：理解 Volta 的工作机制](#3-核心概念理解-volta-的工作机制)
4. [常用命令速查](#4-常用命令速查)
5. [Node / npm 版本管理](#5-node--npm-版本管理)
6. [Yarn 使用注意事项](#6-yarn-使用注意事项)
7. [pnpm 使用注意事项（实验性功能）](#7-pnpm-使用注意事项实验性功能)
8. [全局 CLI 工具管理（Package Binaries）](#8-全局-cli-工具管理package-binaries)
9. [项目级版本锁定（pin）与团队协作](#9-项目级版本锁定pin与团队协作)
10. [Monorepo / Workspaces 场景](#10-monorepo--workspaces-场景)
11. [镜像源配置一：hooks.json（管 Volta 自身下载工具）](#11-镜像源配置一hooksjson管-volta-自身下载工具)
12. [镜像源配置二：.npmrc（管日常依赖包下载，别漏了这步）](#12-镜像源配置二npmrc管日常依赖包下载别漏了这步)
13. [存储路径与 C 盘空间管理](#13-存储路径与-c-盘空间管理)
14. [卸载 Volta](#14-卸载-volta)
15. [换新机器 / 重装系统 Checklist](#15-换新机器--重装系统-checklist)
16. [常见问题 FAQ](#16-常见问题-faq)
17. [重要提醒：Volta 项目现状与 mise 详细对比](#17-重要提醒volta-项目现状与-mise-详细对比)
18. [Flutter / JDK / Android SDK 环境配置建议](#18-flutter--jdk--android-sdk-环境配置建议)

---

## 1. Volta 是什么，为什么用它
Volta 是一个 JavaScript 工具链版本管理器，核心解决两个问题：

+ **多版本共存**：电脑上可以装多个 Node 版本，不同项目自动切换到对应版本，不用手动 `nvm use`。
+ **团队一致性**：把 Node / npm / yarn / pnpm 的版本写进 `package.json`，团队里所有人 `git clone` 下来直接就是同一套工具版本，不会出现"我这能跑你那不能跑"的问题。

它的实现方式是在 `PATH` 里放一批"垫片"（shim）程序，你敲 `node`、`npm`、`pnpm` 这些命令时，实际上先被 Volta 的垫片拦截，垫片再根据你当前所在目录（是否有项目级 pin 配置）去调用真正对应版本的可执行文件。

---

## 2. 安装
### 2.1 Windows 安装方式
直接从[官网](https://github.com/volta-cli/volta/releases)下载安装包（`.msi`），双击安装即可，无需额外配置。

### 2.2 安装后的目录结构
| 位置 | 作用 |
| --- | --- |
| `C:\Program Files\Volta` | Volta 本体和垫片（shim）程序，包含 `volta.exe`、`node.exe`、`npm.exe`、`pnpm.exe`、`yarn.exe` 等，**这些 exe 是预置的占位垫片，不代表对应工具已安装** |
| `%LOCALAPPDATA%\Volta`（即 `C:\Users\<用户名>\AppData\Local\Volta`） | 也叫 `VOLTA_HOME`，真正干活的地方，包含已安装的 Node 版本、全局包、缓存、日志、以及 `hooks.json` 配置文件 |


`VOLTA_HOME` 下的关键子目录：

```plain
VOLTA_HOME/
├── bin/                          # 命令垫片
├── tools/
│   ├── image/
│   │   ├── node/<version>/       # 各个 Node 版本
│   │   └── packages/             # volta install 安装的全局 CLI 工具
├── cache/
├── log/
└── hooks.json                    # 全局镜像源配置（需手动创建）
```

### 2.3 环境变量确认
安装包通常自动配置好，可以用以下命令确认：

```powershell
echo $env:VOLTA_HOME
# 应输出 C:\Users\<用户名>\AppData\Local\Volta

$env:Path -split ';' | Select-String Volta
# 应能看到 Program Files\Volta 和 %VOLTA_HOME%\bin 两条
```

**不要**手动设置 `npm_config_prefix`、`NODE_PATH` 等变量，会和 Volta 的 shim 机制冲突。

---

## 3. 核心概念：理解 Volta 的工作机制
### 3.1 全局默认版本 vs 项目锁定版本
+ **全局默认**：`volta install node@22` 会设置一个全局默认 Node 版本，在没有项目锁定配置的地方（比如你在桌面新建的临时脚本）都用这个版本。
+ **项目锁定**：在项目目录执行 `volta pin node@20`，会把版本写进该项目的 `package.json`，此后**只要在这个项目目录（或子目录）里**，Volta 会自动切换到锁定的版本，不影响全局默认，也不影响其他项目。

这意味着你不需要手动切换版本，Volta 会根据你当前所在的目录自动判断。

### 3.2 全局安装的 CLI 工具也是"项目感知"的
比如你全局装了 TypeScript（`npm install -g typescript`，Volta 会拦截这个命令纳入管理），执行 `tsc` 的时候，Volta 会用你安装 TypeScript 时的默认 Node 版本来运行它，且这个绑定关系不会因为你切换了全局 Node 版本而改变，除非你重新安装/更新这个工具。

---

## 4. 常用命令速查
| 命令 | 作用 |
| --- | --- |
| `volta install node` | 安装最新 LTS 版本的 Node，并设为全局默认 |
| `volta install node@20` | 安装指定大版本 |
| `volta install node@20.11.0` | 安装指定精确版本 |
| `volta install yarn` / `volta install pnpm` | 安装包管理器 |
| `volta install <包名>` | 全局安装某个 npm 包（如 `typescript`），效果等同于传统的 `npm i -g` |
| `volta uninstall <工具名>` | 卸载某个工具 |
| `volta pin node@20` | **在当前项目目录**锁定 Node 版本，写入 `package.json` |
| `volta pin yarn@1.22.22` | 锁定 Yarn 版本 |
| `volta list` | 查看已安装的全部工具 |
| `volta list --current` | 查看当前生效（会被实际调用）的版本 |
| `volta list --default` | 查看全局默认版本 |
| `volta which node` | 查看某命令实际会调用哪个可执行文件路径 |
| `volta fetch node@18` | 只下载某版本到本地，不设为默认也不锁定（预热缓存用） |
| `volta run --node 20 -- node app.js` | 临时用指定版本执行一次命令，不改变任何默认/锁定配置 |
| `volta completions powershell` | 生成 PowerShell 命令补全脚本 |


---

## 5. Node / npm 版本管理
+ 如果你**没有单独安装过 npm**（即没执行过 `volta install npm`），Volta 会自动使用当前 Node 版本自带的 npm，随 Node 版本切换而切换。
+ 一旦你手动执行过 `volta install npm@xxx`，Volta 就会**始终使用这个全局固定的 npm 版本**，不再跟随 Node 自带的 npm 变化。
+ 如果固定了全局 npm 之后，又想临时用回某个 Node 版本自带的 npm，可以用：

```powershell
volta run --node 20 -- npm -v
```

**建议**：除非有特殊版本需求（比如某个老项目要求特定 npm 版本），否则不要手动 `volta install npm`，让它跟随 Node 走更省心。

---

## 6. Yarn 使用注意事项
Volta 默认管理的是 **Yarn Classic（1.x）**。如果你需要用 **Yarn Berry（2.x 及以上，也叫 yarn modern）**，情况会不一样：

```powershell
volta install yarn          # 默认装的是 Classic 1.x 系列最新版
volta pin yarn@1.22.22      # 锁定 Classic 具体版本
```

如果项目要求 Berry，通常的做法是配合 Node 自带的 `corepack` 来管理（Volta 装好 Node 后，`corepack` 命令本身也可以纳入 Volta 管理），而不是指望 Volta 直接管理 Berry 版本。如果你的项目主要用 Classic，直接 `volta pin yarn@x.y.z` 即可，不用额外操心。

---

## 7. pnpm 使用注意事项（实验性功能）
Volta 对 pnpm 的支持目前仍标注为 **experimental（实验性）**，使用前必须先设置环境变量：

```plain
变量名：VOLTA_FEATURE_PNPM
变量值：1
```

Windows 下：系统设置 → 高级系统设置 → 环境变量 → 新增用户变量，**设置后要重启终端**才生效。

设置好之后：

```powershell
volta install pnpm
volta pin pnpm@9
```

**已知限制**（截至撰写本文时官方文档标注的）：

+ **全局安装不支持**：`pnpm install -g <包名>` 目前会报错，这不是配置问题，是功能本身还没做完。
+ **无自动迁移**：如果你之前用其他方式装过 pnpm，Volta 不会自动接管，需要先 `volta uninstall pnpm`（如果之前是用 Volta 装的）再重新走 `volta install pnpm` 流程。

---

## 8. 全局 CLI 工具管理（Package Binaries）
任何带可执行文件的 npm 包，用 `npm install -g` 或 `volta install` 安装后，都会被 Volta 接管并加入工具链管理，例如：

```powershell
volta install typescript
volta install @vue/cli
volta install create-react-app
```

安装时，Volta 会把**当前的全局默认 Node 版本**绑定给这个工具，之后即使你切换了全局 Node 默认版本，这个工具依然使用安装时绑定的版本运行，除非你重新安装/更新它。这样可以保证工具行为不会因为你日常切换 Node 版本而"背着你"发生变化。

查看已装的全局工具：

```powershell
volta list
```

---

## 9. 项目级版本锁定（pin）与团队协作
在项目根目录（`package.json` 所在目录）执行：

```powershell
volta pin node@20.11.0
volta pin pnpm@9.1.0
```

会在 `package.json` 里自动生成类似这样的字段：

```json
{
  "volta": {
    "node": "20.11.0",
    "pnpm": "9.1.0"
  }
}
```

把这个文件提交到 git 仓库，团队里任何人只要装了 Volta，`git clone` 项目、`cd` 进目录后，Volta 会自动识别并使用这里锁定的版本，无需任何手动切换。

**注意**：`volta pin` 只管 Node 和包管理器本身的版本，不涉及依赖包的版本——依赖版本还是靠 `npm install` / `pnpm install` 之类的命令和 `package.json` 里的 `dependencies` 字段管理。

---

## 10. Monorepo / Workspaces 场景
如果你有一个 monorepo，多个子项目希望共享同一套 Volta 配置（避免每个子项目都要单独 `pin` 一遍），可以在子项目的 `package.json` 的 `volta` 字段里加一个 `extends` 指向根目录的配置文件：

```json
{
  "volta": {
    "extends": "../../package.json"
  }
}
```

`extends` 指向的文件里也需要有自己的 `volta` 字段。设置了 `extends` 之后，Volta 会把当前文件的配置和被指向文件的配置做合并，**当前文件的设置优先级更高**（可以覆盖被继承的值）。这个功能需要 Volta 0.8.2 及以上版本。

---

## 11. 镜像源配置一：hooks.json（管 Volta 自身下载工具）
### 11.1 作用
Volta 默认从 `nodejs.org`、`npmjs.com`、`yarnpkg.com` 这些海外源下载，国内直连经常很慢或超时。可以通过 `hooks.json` 把下载源替换成国内镜像（阿里巴巴 npmmirror）。

**重要边界**：`hooks.json` 只管 **Volta 自己安装 node/npm/yarn/pnpm 这几个工具本身**（也就是 `volta install xxx` 这个动作）的下载源，**不管你平时 **`npm install`**/**`pnpm add`** 装依赖包时走的源**——那部分要靠第 12 节的 `.npmrc` 单独配置，两者是完全独立的两条线，很容易被误以为配一个就够了。

### 11.2 文件位置
+ **全局生效**：`%LOCALAPPDATA%\Volta\hooks.json`（即 `VOLTA_HOME\hooks.json`）
+ **仅项目内生效**：项目根目录的 `.volta\hooks.json`

### 11.3 推荐配置
```json
{
    "node": {
        "index": {
            "template": "https://npmmirror.com/mirrors/node/index.json"
        },
        "distro": {
            "template": "https://npmmirror.com/mirrors/node/v{{version}}/node-v{{version}}-{{os}}-x64.{{ext}}"
        }
    },
    "npm": {
        "index": {
            "prefix": "https://registry.npmmirror.com/"
        },
        "distro": {
            "template": "https://registry.npmmirror.com/npm/-/npm-{{version}}.tgz"
        }
    },
    "yarn": {
        "index": {
            "prefix": "https://registry.npmmirror.com/"
        },
        "distro": {
            "template": "https://registry.npmmirror.com/yarn/-/yarn-{{version}}.tgz"
        }
    },
    "pnpm": {
        "index": {
            "prefix": "https://registry.npmmirror.com/"
        },
        "distro": {
            "template": "https://registry.npmmirror.com/pnpm/-/pnpm-{{version}}.tgz"
        }
    }
}
```

> 这份配置用 `npmmirror.com` 和 `registry.npmmirror.com` 两个域名，都是阿里巴巴开源镜像站（同一家，不同子服务），国内直连可用，**不需要开代理**。
>
> `yarn` 这段配置的是 Yarn Classic（1.x）。如果需要 Yarn Berry（2.x+），需要换成指向 `@yarnpkg/cli-dist` 这个包的镜像地址，两者不能共存于同一份 hooks.json。
>
> `pnpm` 这段要生效，别忘了前面第 7 节提到的 `VOLTA_FEATURE_PNPM=1` 环境变量。
>

### 11.4 hooks.json 语法说明（供以后自己排查问题用）
每个工具（`node`/`npm`/`yarn`/`pnpm`）下面可以配置三个动作：`index`（版本列表）、`latest`（最新版本号）、`distro`（安装包下载地址），每个动作可以用三种钩子类型之一：

+ `prefix`：把默认请求地址的域名部分替换成你给的前缀，其余路径 Volta 自动补全。适合 `index`/`latest` 这种结构简单的请求。
+ `template`：完整手写 URL，用 `{{version}}`、`{{os}}`、`{{arch}}`、`{{ext}}`、`{{filename}}` 占位符拼接。适合 `distro` 这种路径结构较复杂的下载地址，确定性更强，不依赖 Volta 内部的自动补全逻辑。
+ `bin`：指向一个可执行脚本，脚本输出最终 URL，用于更复杂的场景（比如企业内网需要认证）。

### 11.5 验证是否生效
```powershell
volta install node@24
```

如果几秒内就开始下载（而不是卡很久没反应），说明镜像生效了。也可以关掉代理后再测试一次，确认不依赖代理也能正常访问。

---

## 12. 镜像源配置二：.npmrc（管日常依赖包下载，别漏了这步）
### 12.1 为什么这一步不能省
第 11 节的 `hooks.json` 配好之后，`volta install node/pnpm/yarn` 这些命令会很快，**但如果你没做这一步，平时 **`npm install express`**、**`pnpm add react`** 这种装项目依赖的操作，依然会去连海外的 **`registry.npmjs.org`，一样会很慢或者超时。这是两套完全独立的机制：

| 场景 | 由谁负责下载源 | 配置文件 |
| --- | --- | --- |
| `volta install node@24`（装工具本身） | Volta | `hooks.json`（见第 11 节） |
| `npm install express`（装项目依赖） | npm 自己 | `.npmrc` |
| `pnpm add react` | pnpm 自己 | `.npmrc`（pnpm 兼容 npm 的配置格式） |
| `yarn add lodash`（Classic） | yarn 自己 | `.yarnrc` 或读取 `.npmrc` |


### 12.2 一次性配置，一劳永逸
不需要装 nrm 这类"切换源"的工具——nrm 是给需要**频繁在多个源之间来回切**的人用的（比如公司内网源和公开源来回切）。如果只是长期固定用一个国内镜像，直接写死更简单：

```powershell
npm config set registry https://registry.npmmirror.com
pnpm config set registry https://registry.npmmirror.com
```

或者更彻底一点，编辑全局配置文件 `%USERPROFILE%\.npmrc`（npm 和 pnpm 都会读这个文件）：

```plain
registry=https://registry.npmmirror.com
```

配一次之后，新装的项目、新建的 pnpm store 都会默认走这个源，不需要每个项目单独配置。

### 12.3 验证
```powershell
npm config get registry
pnpm config get registry
# 都应输出 https://registry.npmmirror.com
```

新建一个测试项目 `npm install lodash`，几秒内完成即为生效。

---

## 13. 存储路径与 C 盘空间管理
### 13.1 默认存储位置一览
| 内容 | 默认位置 |
| --- | --- |
| Volta 管理的 Node/Yarn/Pnpm 各版本 | `%LOCALAPPDATA%\Volta\tools\image\` |
| npm 缓存 | `%APPDATA%\npm-cache` |
| yarn 缓存（Classic） | `%LOCALAPPDATA%\Yarn\Cache` |
| pnpm store（全局依赖仓库） | `%LOCALAPPDATA%\pnpm-store` 或 `%LOCALAPPDATA%\pnpm\store` |
| 各项目的 `node_modules` | 项目目录本身，不受 Volta 管理 |


### 13.2 空间占用的两个来源
1. **Volta 管理的工具版本本身**：一个 Node 版本几十到一百多 MB，装五六个版本也就大约 1GB 左右，不是空间大头。
2. `node_modules`：这才是真正的大头，与包管理器行为有关：
    - npm / yarn classic：每个项目独立完整拷贝一份依赖，项目多了几十 GB很常见。
    - **pnpm**：用全局内容寻址存储（pnpm store），所有项目共享同一份物理依赖文件，项目内的 `node_modules` 通过链接指向全局 store，长期能省下大量空间，**推荐优先使用 pnpm**。

### 13.3 pnpm 在 Windows 上的符号链接问题
pnpm 依赖符号链接（symlink）或硬链接来实现依赖共享，Windows 创建 symlink 默认需要管理员权限或开启开发者模式：

```powershell
# 方法一（推荐）：设置 → 隐私和安全性 → 开发者选项 → 打开"开发人员模式"

# 方法二：让 pnpm 不用 symlink
pnpm config set node-linker hoisted
```

### 13.4 迁移到其他盘（C 盘紧张时）
```powershell
# 1. 先关闭所有终端和 IDE，复制 VOLTA_HOME 整个文件夹到目标盘，例如：
# C:\Users\<用户名>\AppData\Local\Volta → D:\Volta

# 2. 设置环境变量指向新位置
[Environment]::SetEnvironmentVariable("VOLTA_HOME", "D:\Volta", "User")
# 重启终端后 PATH 里对应的 %VOLTA_HOME%\bin 会自动生效

# 3. 迁移 npm 缓存
npm config set cache "D:\npm-cache" --global

# 4. 迁移 pnpm store（体积最大，最值得迁）
pnpm config set store-dir "D:\pnpm-store"

# 5. 迁移 yarn 缓存（如果用 Classic）
yarn config set cache-folder "D:\yarn-cache"
```

`C:\Program Files\Volta` 里的内容很小（几十 MB 的垫片程序），不需要迁移。

---

## 14. 卸载 Volta
如果需要完全卸载重装（比如出现难以排查的问题）：

```powershell
# 1. 通过"控制面板 → 程序和功能"卸载 Volta 主程序
# 2. 手动删除残留目录
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\Volta"
# 3. 检查环境变量，手动删除 PATH 中残留的 Volta 相关条目和 VOLTA_HOME 变量
```

删除后重新安装即可从头开始。

---

## 15. 换新机器 / 重装系统 Checklist
按顺序执行，即可快速恢复整套环境：

- [ ] 下载并安装 Volta 官方 `.msi` 安装包
- [ ] 确认环境变量 `VOLTA_HOME` 和 `PATH` 已自动配置（见第 2.3 节）
- [ ] 创建 `hooks.json` 配置国内镜像源（见第 11 节），放在 `%LOCALAPPDATA%\Volta\hooks.json`
- [ ] 配置 `.npmrc` 的 registry（见第 12 节），**这步和 hooks.json 是两回事，不要漏**
- [ ] 如需 pnpm：设置环境变量 `VOLTA_FEATURE_PNPM=1` 并重启终端
- [ ] 安装 Node：`volta install node@22`（按需替换版本号）
- [ ] 如需多版本共存：额外 `volta install node@20`
- [ ] 安装包管理器：`volta install pnpm`（和/或 `volta install yarn`）
- [ ] （可选）迁移缓存路径到非 C 盘（见第 13.4 节），避免占用系统盘
- [ ] 常用全局工具重新安装（比如 `volta install typescript`，具体按自己需求）
- [ ] 拉取项目代码后，`cd` 进项目目录，Volta 会自动读取 `package.json` 里的 `volta` 字段切换版本，无需手动操作
- [ ] 如涉及 Flutter App 开发，另外走第 18 节的 JDK / Android SDK / Flutter 配置

---

## 16. 常见问题 FAQ
**Q：**`Program Files\Volta`** 目录里为什么有 **`pnpm.exe`**/**`yarn.exe`**，但我明明没装？**

A：这些是 Volta 预置的"垫片"（shim），不是真正的可执行文件——它们体积完全相同（都是垫片程序的拷贝），启动后会根据文件名判断你要调用谁，再去 `VOLTA_HOME\tools\image\packages\` 里找有没有对应版本。没装就会提示未安装，而不是"命令不存在"。

**Q：**`hooks.json`** 里 **`prefix`** 和 **`template`** 有什么区别，能混用吗？**

A：`prefix` 只是简单替换域名，Volta 自动补全剩余路径；`template` 需要你手写完整 URL。同一个动作（`index`/`latest`/`distro`）只能三选一，但不同工具、不同动作之间可以自由搭配（比如 `index` 用 `prefix`，`distro` 用 `template`）。

**Q：配了 **`hooks.json`** 是不是就不用管 npm 的镜像源了？**

A：不是，两者管的东西不一样——`hooks.json` 只管 Volta 装工具本身，日常 `npm install`/`pnpm add` 装依赖包走的是 `.npmrc` 里的 `registry` 配置，两个都得配（见第 12 节）。

**Q：关代理后镜像源还能用吗？**

A：能，`npmmirror.com` 系列域名是国内镜像站，专门为免代理直连设计的，这正是配置它的意义所在。

**Q：pnpm 全局安装报错怎么办？**

A：这是 Volta 对 pnpm 支持仍处于实验阶段的已知限制，`pnpm install -g` 目前不支持，不是配置错误。

**Q：C 盘空间被 **`node_modules`** 占满怎么办？**

A：优先用 pnpm（依赖全局共享，省空间），并把 pnpm store、npm 缓存迁移到其他盘（见第 13.4 节）。

---

## 17. 重要提醒：Volta 项目现状与 mise 详细对比
### 17.1 Volta 现状
Volta 官方已于 **2025 年 11 月**在 GitHub 上宣布项目进入"**无人维护（unmaintained）**"状态，维护者建议迁移到一个新工具 **mise**（[https://mise.jdx.dev/），据称这也是维护者自己目前在用的工具。](https://mise.jdx.dev/），据称这也是维护者自己目前在用的工具。)

官方原话大意是：**已经能正常工作的功能会继续正常工作，不需要因此惊慌立刻迁移**，但今后操作系统升级、Node 生态变化导致的兼容性问题，Volta 不会再修复，建议把"迁移"这件事放进长期的维护计划里留意，不用现在就动手。

### 17.2 mise 是什么
mise（读作"meez"，来自法语 "mise en place"）是一个**多语言**版本管理工具，定位上比 Volta 更大——Volta 从设计上只服务 JS 生态（Node/npm/yarn/pnpm），**永远不会支持 Java/Dart 这类其他语言**，这是两者根本性的定位差异，不是"以后 Volta 更新一下就能补上"的问题。

### 17.3 Windows 支持现状
好消息是，mise 现在**官方原生支持 Windows**，包括 PowerShell 的 shell 集成（`mise activate`），推荐安装方式：

```powershell
winget install jdx.mise
```

**需要注意的坑**：mise 内置的"核心插件"（如 Node/Python/Go/Java）在 Windows 上是原生支持、不依赖额外环境的；但很多**社区维护的插件走的是 asdf 插件机制，这类插件通常依赖 Bash 脚本**，官方文档明确说明这类插件在 Windows 上跑不了，必须放到 WSL 里用。也就是说：**mise 本身在 Windows 原生能装能跑，但具体某个语言的插件能不能在 Windows 原生用，要看这个插件是"核心插件"还是"社区 asdf 插件"**，这是与 Volta（纯 JS、天然对 Windows 友好）相比一个真实存在的落差点，不能一概而论说"支持 Windows"。

### 17.4 与技术栈相关的支持情况
| 工具 | mise 支持情况 |
| --- | --- |
| Node / npm / yarn / pnpm | 核心插件，原生跨平台，可平替 Volta 的日常功能 |
| JDK / Java | 核心插件，原生跨平台，Windows 上不依赖 Bash |
| Flutter / Dart | 社区插件 `mise-plugins/mise-flutter`（脱胎于 asdf 插件，同时管 flutter 和 dart），**在 Windows 原生下是否完全可用没有官方保证，建议先在 WSL 里验证** |
| Android SDK | **不管是 Volta 还是 mise 都没有真正意义上的支持**，原因见下 |


### 17.5 关于 Android SDK 的特别说明
Android SDK 本质上不是"一个版本号对应一个二进制文件"这种简单模型，它是一整套包含 `platform-tools`、`build-tools`、多个 API Level、NDK、以及许可证接受流程的复杂系统。**目前业界不管用 Volta、mise 还是 nvm，主流做法都是绕开这些版本管理器，单独用 Android Studio 自带的 SDK Manager 或命令行的 **`sdkmanager`** 来管理**，这条线天然就是独立的，切换 JS 工具链管理器（Volta → mise）解决不了 Android SDK 的问题，具体配置方式见第 18 节。

### 17.6 迁移成本对比
|  | Volta | mise |
| --- | --- | --- |
| 维护状态 | 已停止维护 | 活跃维护 |
| 支持范围 | 仅 JS 生态 | 多语言（Node/Python/Java/Go 等核心插件 + 社区插件覆盖更多） |
| 项目锁定方式 | `package.json` 里的 `volta` 字段 | 项目根目录的 `.mise.toml` 文件 |
| 迁移成本 | — | 需要重新配置项目锁定文件，`package.json` 里已有的 `volta` 字段**不会**被 mise 自动读取，需要手动转换 |
| Windows 原生程度 | 高（纯 JS 场景无短板） | 核心插件高，社区 asdf 插件（如 Flutter）不确定，需要个案验证 |


### 17.7 建议
结合"纯前端为主、兼顾 Flutter App"的情况：

+ **不用现在就切**，Volta 现在功能上完全正常用，环境也刚搭好。
+ **如果未来决定要统一管理 JDK/Flutter/Dart**，mise 是更合适的长期方向，因为 Volta 从设计上永远做不到这一点。
+ 真要切换时，**建议先在一个不重要的小项目上、在 WSL 里试跑一遍 mise + **`mise-flutter`** 插件**，确认插件在你的实际场景下没问题，再考虑迁移日常主力项目；Windows 原生下 Flutter 相关插件的稳定性没有官方保证，不要一上来就在主力开发机上裸切。

---

## 18. Flutter / JDK / Android SDK 环境配置建议
这部分和 Volta/mise 是相对独立的一条线（原因见 17.5），不管你用哪个 JS 工具链管理器，Flutter 开发环境都建议按下面的方式单独配置。

### 18.1 整体思路
Flutter App 开发通常涉及三个相对独立的组件，**不建议指望用一个统一的版本管理工具（无论 Volta 还是 mise）把三者都管起来**：

| 组件 | 作用 | 推荐管理方式 |
| --- | --- | --- |
| JDK | 运行 Gradle 构建脚本、编译 Android 原生代码 | Flutter 官方推荐直接用 Android Studio 自带的 JBR（JetBrains Runtime）；如果需要独立可控的 JDK 版本，也可以单独装 Temurin/Zulu 等发行版，手动配置 `JAVA_HOME` |
| Android SDK | 提供 `platform-tools`、`build-tools`、各 API Level 等编译/调试所需组件 | 通过 Android Studio 的 SDK Manager 图形界面，或命令行 `sdkmanager` 管理，不走版本管理器 |
| Flutter SDK / Dart SDK | Flutter 框架本身和 Dart 语言运行时 | 官方推荐用 `flutter` 自带的 `flutter upgrade`/`flutter channel` 命令切换版本，或用 FVM（Flutter Version Management，专门给 Flutter 用的多版本管理工具，类似 nvm 但专为 Flutter 设计）管理多版本共存 |


### 18.2 JDK 配置要点
+ Flutter 官方文档明确提到，**Flutter 本身不自带 JDK**，构建 Android 部分依赖外部 JDK。
+ 大部分情况下，装了 Android Studio 之后，它自带的 JBR 就够用，Flutter 会自动探测到。
+ 如果需要手动指定 JDK 路径（比如多个 JDK 版本共存、或者不想依赖 Android Studio 自带的）：

```powershell
flutter config --jdk-dir="C:\Path\To\Your\JDK"
```

+ 常见报错 `Unable to determine bundled Java version` 通常是 Android Studio 安装不完整或 JBR 缺失，重装/更新 Android Studio 一般能解决。

### 18.3 Android SDK 配置要点
+ 通过 Android Studio 首次启动时的引导向导会自动下载 SDK 到默认路径（一般是 `C:\Users\<用户名>\AppData\Local\Android\Sdk`）。
+ 环境变量：

```powershell
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\<用户名>\AppData\Local\Android\Sdk", "User")
```

+ 首次配置完，务必执行：

```powershell
flutter doctor --android-licenses
```

接受所有许可证，否则编译会卡住。

+ 用 `flutter doctor -v` 可以检查 Android 工具链是否配置完整，报错信息里通常会直接给出修复建议。

### 18.4 Flutter / Dart 版本管理
如果只用单一 Flutter 版本，直接官方安装包 + `flutter upgrade` 即可，不需要额外工具。

如果需要**多个 Flutter 版本共存**（比如维护老项目要求旧版 Flutter，新项目用最新版），推荐用社区工具 **FVM**：

```powershell
# 需要先有 Dart（Flutter 自带），通过 pub 安装 FVM
dart pub global activate fvm

# 项目内锁定版本
fvm install 3.24.0
fvm use 3.24.0
```

FVM 的锁定方式类似 Volta 的 `pin`，会在项目里生成配置文件，团队协作时能保证 Flutter 版本一致，思路上和 Volta/mise 对 Node 版本的管理是同一个逻辑，但它是 Flutter 生态专用的独立工具，不整合进 Volta 或 mise。

### 18.5 换新机器时 Flutter 环境 Checklist
- [ ] 安装 Android Studio，跟随首次启动向导装好 Android SDK
- [ ] 配置 `ANDROID_HOME` 环境变量
- [ ] 执行 `flutter doctor --android-licenses` 接受许可证
- [ ] 安装 Flutter SDK（或用 FVM 管理多版本）
- [ ] 运行 `flutter doctor -v`，逐条检查绿勾，红叉/黄叹号按提示逐一修复
- [ ] 如需真机调试，检查手机开发者模式和 USB 调试是否开启，`flutter devices` 能否识别设备

---

_文档整理自 docs.volta.sh 官方文档（Guide / Reference / Advanced 三个模块）、mise.jdx.dev 官方文档及 Flutter 官方文档，并结合国内网络环境做了镜像源适配，撰写于 2026 年 9 月。_

