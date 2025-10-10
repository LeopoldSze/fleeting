# 前端路由

## 概述

实现方式：

- Hash模式：使用URL的hash标识作为路径标记，通过监听 `hashchange` 事件实现回调逻辑
- History模式：使用URL的path作为路径标记，借助HIstory API 及其相关事件实现跳转和回调逻辑

一个完整的URL包括协议、用户、域名、端口、路径、查询参数和hash标识，如：`http://www.foo.com/user?name=bar#message`

| 协议 | 用户 | 域名        | 端口 | 路径  | 查询参数 | hash标识 |
| ---- | ---- | ----------- | ---- | ----- | -------- | -------- |
| HTTP | 空   | www.foo.com | 80   | /user | name=bar | message  |

::: info

当一个URL的协议、用户、域名、端口、路径和查询参数改变后，浏览器便将其判断为新的URL，进而以新的URL发起网络请求，然后hash标识的改变并不触发此行为，所以hash模式的优点是不需要服务端支持，是前端完全自主的路由机制

:::

## 数据格式

> 基础参数：路径、回调函数、名称(动态路由使用)、全局钩子函数、局部钩子函数

```js
// Router格式
new Router({
  routes: [
    {
      paht: '/',
      name: 'home',
      beforeEnter() {}, // action之前执行，为阻塞式，根据返回值决定继续跳转还是终止跳转
      action() {},
      afterEnter() {}, // action之后执行
      beforeUpdate() {}, // update之前执行，为阻塞式
      afterUpdate() {}, // update之后执行
      beforeLeave() {} // 路由离开之前执行，为阻塞式
    }
  ],
  // 全局钩子函数
  beforeEach() {}, // 进入路由之前执行
  afterEach() {} // 进入路由之后执行
})
```

<br />

## History路由

History路由需要服务端配合，支持刷新的前提条件是服务端将所有子路由的请求 rewrite(不是redirect)到根路由，然后前端在浏览器环境下进行子路由恢复。

- 跳转新路径使用 `history.pushState()` ，回退和前进使用 `history.back()` 和 `history.go()`
- 通过监听 `popstate` 事件处理路由回调，但是该事件只在回退和前进时被触发，针对 `pushState` 需要特殊处理

```js
// 创建pushstate事件
function createPushstateEvent(state: KV<string>): PushStateEvent {
  const ev = new CustomEvent('pushstate');
  ev['state'] = state;
  return <PushStateEvent>ev;
}

// 监听pushstate事件
window.addEventListener('pushstate', (ev: PushStateEvent) => {
  this._onRouteChange(window.location.pathname, ev.state.name);
})

// 路由跳转方法
class Router {
  private _pushState(state: KV<string>, path: string) {
    this._history.pushState(state, '', path);
    window.dispatchEvent(createPushstateEvent(state));
  }
}
// 实例化路由跳转
this._pushState({
  name: targetRoute.name
}, path)
```

<br />
