# Tracker SDK

一个轻量的前端埋点 SDK，支持路由变更、DOM 交互以及 JS/Promise 异常上报，优先使用 `sendBeacon` 进行可靠传输。

## 安装

- 使用 pnpm：`pnpm add @leopoldsze/tracker-sdk`
- 使用 npm：`npm i @leopoldsze/tracker-sdk`

## 快速使用（ESM/Node）

```ts
import Tracker from '@leopoldsze/tracker-sdk'
// 或：import { Tracker } from '@leopoldsze/tracker-sdk'

const tracker = new Tracker({
  requestUrl: 'https://your-server.com/track',
  uuid: 'user-123',
  historyTracker: true,
  hashTracker: true,
  domTracker: true,
  jsError: true
})

// 手动上报自定义事件（需包含 event 与 targetKey）
tracker.sendTracker({
  event: 'custom',
  targetKey: 'button-signup'
})

// 页面卸载或不再需要监听时
tracker.destroy()
```

## 脚本直接引入（IIFE）

构建后的浏览器产物位于 `dist/index.js`，全局变量为 `tracker`：

```html
<script src="/path/to/index.js"></script>
<script>
  const { Tracker } = window.tracker
  const t = new Tracker({
    requestUrl: 'https://your-server.com/track',
    domTracker: true,
    jsError: true
  })

  // 标记需要上报的元素：
  // <button data-track-key="button-submit">提交</button>

  // 结束时：
  // t.destroy()
</script>
```

## 配置项（Options）

- `requestUrl` 必填：上报接口地址
- `uuid` 选填：用户标识
- `extra` 选填：透传字段（对象）
- `sdkVersion` 只读：SDK 版本
- `historyTracker`：是否上报 `pushState/replaceState/popstate`
- `hashTracker`：是否上报 `hashchange`
- `domTracker`：是否上报 DOM 交互（默认监听 `click/dblclick/contextmenu`）
- `jsError`：是否上报 JS 与资源错误、Promise 未捕获错误

## 上报内容

SDK 会在每次上报中自动携带如下公共字段：

- `uuid`、`sdkVersion`、`extra`
- `pageUrl`、`referrer`、`userAgent`
- `time`（Unix 毫秒）

同时保留事件本身字段：

- `event`、`targetKey`
- 异常事件会包含 `message/filename/stack` 等结构化信息；资源错误包含 `tagName/resourceUrl`

## 注意事项

- DOM 交互上报需在元素上添加 `data-track-key`（或 `target-key`）属性。
- `destroy()` 会移除所有已注册监听，并恢复 `history.pushState/replaceState`。
- 非浏览器环境（如 Node）下会自动跳过监听安装，确保引用安全。

## 构建

在项目根目录执行：

```bash
pnpm -C packages/tracker-sdk typecheck
pnpm -C packages/tracker-sdk build
```

构建产物位于 `packages/tracker-sdk/dist/`：

- `index.esm.js`：ESM 模块
- `index.cjs.js`：CommonJS 模块
- `index.js`：IIFE 浏览器脚本（全局 `tracker`）