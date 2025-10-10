# 微前端

## 1. qiankun原理

1. **初始化过程**：

   - 在主应用中调用 `start` 方法：在主应用中，调用 `start` 方法来初始化 qiankun，启动微前端应用。
   - 创建路由监听：qiankun 会在主应用中创建路由监听器，用于监听子应用的路由变化。

2. **加载子应用**：

   - 子应用注册：每个子应用需要通过 `registerMicroApps` 方法在主应用中进行注册。在注册过程中，指定子应用的名称、入口、路由前缀等信息。
   - 路由拦截：主应用会拦截所有与子应用相关的路由，并根据配置加载对应的子应用代码。

3. **沙箱隔离**：

   - 创建沙箱：qiankun 采用沙箱技术来隔离每个子应用的全局变量，以避免不同子应用之间的变量污染和冲突。每个子应用在加载时都会创建一个独立的沙箱环境。
   - 沙箱内联脚本：为了保证沙箱内脚本的执行顺序和稳定性，qiankun 会在每个子应用的代码中内联一段脚本，用于将全局变量绑定到沙箱中。

4. **资源加载**：

   - 动态加载：在主应用中，qiankun 会根据子应用的入口配置，动态地使用 `<script>` 标签加载子应用的 JavaScript 资源。
   - 资源预加载：qiankun 支持资源预加载，在子应用尚未激活时，预先加载子应用的代码和依赖资源，以加快子应用的加载速度。

5. **通信机制**：

   - 自定义事件通信：qiankun 提供了一套自定义事件通信机制，通过 `props`、`onGlobalStateChange`、`setGlobalState` 等方法来实现子应用之间的通信和数据共享。

6. **路由管理**：

   - 子应用路由匹配：在主应用中，qiankun 会根据子应用的路由前缀来匹配子应用的路由。
   - 路由拦截：qiankun 会拦截子应用的路由变化，并在主应用中执行对应的路由操作。

7. **生命周期管理**：

   - 应用生命周期：qiankun 提供了生命周期钩子，用于在子应用的不同阶段执行特定的逻辑，如应用的启动、激活、挂载和卸载等。

<br />

## 2. qiankun 在性能优化、提升子应用打开速度方面做了哪些工作

最基本的有 prefetch 这种配置，开了这个配置可以提前将一些还不需要渲染的微应用的静态资源做一下预加载。原理基于浏览器的 `prefetch` 和 `preload` 机制，通过提前请求资源，确保在用户需要时资源已经准备好，从而提升应用的响应速度。

<br />

## 3. 主子应用样式隔离、切换应用时 dom 副作用的清除有哪些比较好的方案

主子应用的样式隔离还是推荐构建时统一配置 prefix 的方案，比如 antd 就有这类配置，qiankun 官网也是这么推荐的。不过目前 qiankun 也有一个运行时隔离的方案，将子应用的 class 在运行时加一个统一的前缀，保证不会出现冲突。不过会有一定的性能损耗，而且那种全局样式的继承导致的冲突问题也很难避免。 DOM 的副作用 qiankun 默认没有做，只针对动态的脚本跟样式做了劫持，不过要做也是可以做的，比如在 beforeMount、afterMount 钩子里拿到沙箱实例，然后做一些自定义的劫持行为，但总的来说不太推荐

<br />

## 4. 如何实现对 localStorage/cookie 等进行隔离

沙箱里默认行为也是没有的，隔离 localStorage/cookie 带来的麻烦可能比收益会更多。因为大部分时候恰好是希望共享 cookie 或者 localStorage 的，比如登录这种场景。如果确实需要，也可以自己在钩子里拿到沙箱实例，植入自定义行为。

<br />

## 5. qiankun无法支持vite的原因

1. 在Vite3.2之前，Vite不支持**runtime publicPath**，webpack中由内置变量** webpack_public_path **来提供，**runtime publicPath**是qiankun加载子应用的核心，qiankun需要根据publicPath来预加载子应用和异步引入脚本，Vite3.2中引入了experimental.renderBuiltUrl来支持runtime publicPath
2. Vite打包后是ESM，qiankun的js沙箱需要通过IIFE执行来绑定自己代理的window，而import语句只能出现在顶级作用域

<br />

## 6. qiankun中js沙箱原理

`ProxySandbox` 是 qiankun 中用于实现 JavaScript 隔离的核心机制，基于 ES6 的 `Proxy` 对象。它通过创建一个虚拟的全局对象（如 `window`），拦截对全局对象的操作，确保子应用的修改不会污染主应用或其他子应用的全局环境。

**工作流程**

1. **创建代理对象**：
   - 当子应用加载时，qiankun 会为子应用创建一个 `ProxySandbox` 实例。
   - 该实例会生成一个代理对象（如 `fakeWindow`），用于替代真实的 `window` 对象。
   - **每个子应用都会有一个独立的 `ProxySandbox` 实例**，每个实例都会创建一个独立的代理对象（`fakeWindow`）。这样，每个子应用的全局操作都会被隔离在自己的代理对象中，互不影响。
2. **拦截全局操作**：
   - 通过 `Proxy` 的 `get` 和 `set` 陷阱，拦截子应用对全局对象的访问和修改。
   - 例如，当子应用尝试读取或设置 `window` 属性时，操作会被代理到 `fakeWindow` 上。
3. **隔离全局状态**：
   - 子应用对 `window` 的修改只会作用于 `fakeWindow`，不会影响真实的 `window` 对象。
   - 子应用读取 `window` 属性时，优先从 `fakeWindow` 中查找，如果不存在，则从真实的 `window` 中读取。
4. **卸载时清理**：
   - 当子应用卸载时，`ProxySandbox` 会清理子应用对 `fakeWindow` 的修改，确保不会留下副作用。

<br />

## 7. qiankun中js沙箱隔离存在的问题

1. 全局变量污染问题：

   - 一些特殊的全局变量（如 `window.top`、`window.parent`、`window.location`）无法通过 `Proxy` 完全代理。

   - 如果子应用直接修改了这些全局变量，可能会影响主应用或其他子应用。

2. 原型链污染问题：如果子应用通过原型链修改了全局对象（如 `Object.prototype`、`Array.prototype`），这些修改会影响到主应用和其他子应用

3. 动态脚本加载问题：如果子应用通过动态插入 `<script>` 标签加载外部脚本，这些脚本中的全局变量修改无法被沙箱拦截

   - **解决**：通过重写 `document.createElement` 和 `appendChild` 方法，拦截动态加载的脚本，并将其放入沙箱环境中执行

4. 事件监听器泄露问题：如果子应用在挂载期间注册了全局事件监听器（如 `window.addEventListener`），但在卸载时未正确清理，这些监听器会一直存在，导致内存泄漏或意外行为

   - **解决**：在子应用卸载时，遍历 `window` 上的事件监听器并移除

5. 异步任务未清理问题：如果子应用在挂载期间启动了异步任务（如 `setInterval`、`Promise`、`requestAnimationFrame`），但在卸载时未正确清理，这些任务会继续运行

   - **解决**：在子应用卸载时，清理所有定时器、Promise 和异步任务

6. 第三方库兼容问题：某些第三方库可能直接依赖或操作真实的 `window` 对象，导致沙箱隔离失效

<br />

## 8. qiankun中CSS沙箱原理

1. Scoped CSS 实现：Qiankun 通过动态修改子应用的样式规则，为其添加作用域限制。具体步骤如下：

   - **为子应用根节点添加唯一属性**：

     - 在子应用挂载时，Qiankun 会为子应用的根节点添加一个唯一的属性，例如 `data-qiankun="appName"`。

   - **重写样式规则**：

     - Qiankun 会遍历子应用的所有样式表（`<style>` 或 `<link>`），解析样式规则，并为每条规则添加属性选择器前缀。
     - 例如，将 `.container { color: red; }` 重写为 `[data-qiankun="appName"] .container { color: red; }`。

   - **动态样式隔离**：
     - 通过 `MutationObserver` 监听子应用的 DOM 变化，动态处理新增的样式规则，确保新样式也被正确隔离。

2. Shadow DOM 实现：如果启用 Shadow DOM，Qiankun 会将子应用的 DOM 结构封装在 Shadow DOM 中：

   - **创建 Shadow DOM 容器**：

     - 在子应用挂载时，Qiankun 会创建一个 Shadow DOM 容器，并将子应用的 DOM 结构挂载到该容器中。

   - **样式天然隔离**：
     - Shadow DOM 的特性使得子应用的样式不会泄漏到外部，同时外部的样式也不会影响子应用。

<br />

## 9. qiankun CSS沙箱隔离存在的问题

1. **全局样式污染**：
   - 某些组件库（如 Ant Design、Element UI）会将模态框、下拉菜单等组件的 DOM 直接插入到 `body` 中，导致这些组件的样式不受子应用沙箱的限制。
   - 如果多个子应用或主应用使用相同的组件库，可能会出现样式冲突。
2. **样式优先级问题**：
   - 由于子应用的样式被限制在作用域内，可能导致子应用的样式优先级低于全局样式，从而无法正确覆盖全局样式。
3. **动态加载样式**：
   - 如果子应用动态加载样式（如通过 JavaScript 插入 `<style>` 或 `<link>` 标签），Qiankun 可能无法及时处理这些样式，导致样式泄漏。
4. **Shadow DOM 问题**：
   - Shadow DOM 虽然提供了天然的样式隔离，但其兼容性较差（尤其是对 IE 浏览器），且某些第三方库可能无法在 Shadow DOM 中正常运行。
   - 样式隔离存在局限性
   - 全局事件监听无效，事件不会冒泡到外部

解决：

1. 全局样式问题

   ```js
   // 手动为模态框添加作用域样式
   function fixModalStyle(appName) {
     const modal = document.querySelector('.ant-modal')
     if (modal) {
       modal.setAttribute(`data-qiankun`, appName)
     }
   }

   // 在子应用挂载时调用
   export async function mount(props) {
     renderApp()
     fixModalStyle(props.name)
   }
   ```

2. shadow DOM方案问题

   ```js
   // 全局组件挂载到body问题，手动将DOM移动到shadow DOM内部

   const originalAppendChild = Element.prototype.appendChild
   Element.prototype.appendChild = function (node) {
     if (this === document.body && node.classList.contains('ant-modal')) {
       // 将模态框插入到 Shadow DOM 中
       const shadowRoot = document.querySelector('#subapp-shadow-root')
       return shadowRoot.appendChild(node)
     }
     return originalAppendChild.call(this, node)
   }}
   ```

   **使用 `::part` 和 `::slotted`**进行外部样式穿透，从而改变内部DOM样式

   - Shadow DOM 支持 `::part` 和 `::slotted` 伪元素，允许外部样式穿透 Shadow DOM。
   - 通过为 Shadow DOM 中的元素添加 `part` 属性，可以在外部定义样式。

   ```html
   <!-- Shadow DOM 内部 -->
   <div part="modal">Modal Content</div>

   <!-- 外部样式 -->
   <style>
     #subapp-shadow-root::part(modal) {
       color: red;
     }
   </style>

   ``


```

``

```

```

```

````

-如果无法使用 `::part` 或 `::slotted`，可以通过 JavaScript 动态将子应用的样式注入到全局 `document` 中 ```js function
injectStylesToDocument(styles) { const styleElement = document.createElement('style')leElement.textContent = styles
  dodocument.head.appendChild(styleElement) } // 在子应用加载时调用 injectStylesToDocument(` .ant-modal { color: red; } `)

<br />
````
