### 初始化过程

- 文件位置：`src/core/instance/init.js`

```js
export function initMixin (Vue: Class<Component>) {
    Vue.prototype._init = function (options?: Object) {}
}
```

![](https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/vue2-init.png)

<br />

### 挂载过程

**公用$mount方法**

- 文件位置：`src/platforms/web/runtime/index.js`

  ```js
  // public mount method
  Vue.prototype.$mount = function (
    el?: string | Element,
    hydrating?: boolean
  ): Component {
    el = el && inBrowser ? query(el) : undefined
    return mountComponent(this, el, hydrating)
  }
  ```

  1. `$mount` 方法支持传入 2 个参数，第一个是 `el`，它表示挂载的元素，可以是字符串，也可以是 DOM 对象，如果是字符串在浏览器环境下会调用 `query` 方法转换成 DOM 对象的
  2. 第二个参数是和服务端渲染相关，在浏览器环境下我们不需要传第二个参数

**完整版$mount方法**

- 文件位置：`src/platforms/web/entry-runtime-with-compiler.js`![](https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/vue2-mount.png)
  1. 首先缓存了原型上的 `$mount` 方法，再重新定义该方法
  2. 它对 `el` 做了限制，Vue 不能挂载在 `body`、`html` 这样的根节点上
  3. 如果没有定义 `render` 方法，则会把 `el` 或者 `template` 字符串转换成 `render` 方法。这里我们要牢记，在 Vue 2.0 版本中，所有 Vue 的组件的渲染最终都需要 `render` 方法，无论我们是用单文件 .vue 方式开发组件，还是写了 `el` 或者 `template` 属性，最终都会转换成 `render` 方法，那么这个过程是 Vue 的一个“在线编译”的过程，它是调用 `compileToFunctions` 方法实现的，编译过程我们之后会介绍。
  4. 最后，调用原先原型上的 `$mount` 方法挂载。

**mountComponent**

- 文件位置：`src/core/instance/lifecycle.js`

![](https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/202307071845893.png)

1. `mountComponent` 核心就是先实例化一个渲染`Watcher`，在它的回调函数中会调用 `updateComponent` 方法，在此方法中调用 `vm._render` 方法先生成虚拟 Node，最终调用 `vm._update` 更新 DOM。

2. `Watcher` 在这里起到两个作用，一个是初始化的时候会执行回调函数，另一个是当 vm 实例中的监测的数据发生变化的时候执行回调函数，这块儿我们会在之后的章节中介绍。

3. 函数最后判断为根节点的时候设置 `vm._isMounted` 为 `true`， 表示这个实例已经挂载了，同时执行 `mounted` 钩子函数。 这里注意 `vm.$vnode` 表示 Vue 实例的父虚拟 Node，所以它为 `Null` 则表示当前是根 Vue 的实例。

<br />

### render

- 文件位置：`src/core/instance/render.js`

- 作用：是实例的一个私有方法，它用来把实例渲染成一个虚拟 Node。`vm._render` 最终是通过执行 `createElement` 方法并返回的是 `vnode`，它是一个虚拟 Node。

- 声明：

  ```js
  export function renderMixin (Vue: Class<Component>) {
      Vue.prototype.$nextTick = function (fn: Function) {
      return nextTick(fn, this)
    }

    Vue.prototype._render = function (): VNode {
        ....
        return vnode
    }
  }
  ```

  ![](https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/202307072139878.png)

```js
vnode = render.call(vm._renderProxy, vm.$createElement)
```

`$createElement` 方法定义在同一文件内的 `initRender` 方法中：

![](https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/202307072147697.png)

除了 `vm.$createElement` 方法，还有一个 `vm._c` 方法，它是被模板编译成的 `render` 函数使用，而 `vm.$createElement` 是用户手写 `render` 方法使用的， 这俩个方法支持的参数相同，并且内部都调用了 `createElement` 方法。

<br />

### 虚拟DOM - VNode

在 Vue.js 中，Virtual DOM 是用 `VNode` 这么一个 Class 去描述。

- 文件位置： `src/core/vdom/vnode.js`

  ![](https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/202307072151994.png)

::: tip

实际上 Vue.js 中 Virtual DOM 是借鉴了一个开源库 [snabbdom](https://github.com/snabbdom/snabbdom) 的实现，然后加入了一些 Vue.js 特色的东西。

:::

<br />

### createElement

- 文件位置：`src/core/vdom/create-element.js`

  ```js
  // wrapper function for providing a more flexible interface
  // without getting yelled at by flow
  export function createElement (
    context: Component,
    tag: any,
    data: any,
    children: any,
    normalizationType: any,
    alwaysNormalize: boolean
  ): VNode | Array<VNode> {
    if (Array.isArray(data) || isPrimitive(data)) {
      normalizationType = children
      children = data
      data = undefined
    }
    if (isTrue(alwaysNormalize)) {
      normalizationType = ALWAYS_NORMALIZE
    }
    return _createElement(context, tag, data, children, normalizationType)
  }
  ```

  `createElement` 方法实际上是对 `_createElement` 方法的封装，它允许传入的参数更加灵活，在处理这些参数后，调用真正创建 VNode 的函数 `_createElement`：

  - 文件位置：`src/core/vdom/create-element.js`
  - 说明：`_createElement` 方法有 5 个参数，`context` 表示 VNode 的上下文环境，它是 `Component` 类型；`tag` 表示标签，它可以是一个字符串，也可以是一个 `Component`；`data` 表示 VNode 的数据，它是一个 `VNodeData` 类型，可以在 `flow/vnode.js` 中找到它的定义，这里先不展开说；`children` 表示当前 VNode 的子节点，它是任意类型的，它接下来需要被规范为标准的 VNode 数组；`normalizationType` 表示子节点规范的类型，类型不同规范的方法也就不一样，它主要是参考 `render` 函数是编译生成的还是用户手写的。

#### children的规范化

由于 Virtual DOM 实际上是一个树状结构，每一个 VNode 可能会有若干个子节点，这些子节点应该也是 VNode 的类型。`_createElement` 接收的第 4 个参数 children 是任意类型的，因此我们需要把它们规范成 VNode 类型。

这里根据 `normalizationType` 的不同，调用了 `normalizeChildren(children)` 和 `simpleNormalizeChildren(children)` 方法。

- 文件位置：`src/core/vdom/helpers/normalzie-children.js`

  ```js
  // 模板编译器尝试通过在编译时静态分析模板，最大程度地减少规范化的需求。
  // 对于纯 HTML 标记，可以完全跳过规范化，因为生成的渲染函数是保证返回数组<VNode>。
  // 有需要额外规范化的两种情况：

  // 1. When the children contains components - because a functional component
  // may return an Array instead of a single root. In this case, just a simple
  // normalization is needed - if any child is an Array, we flatten the whole
  // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
  // because functional components already normalize their own children.
  export function simpleNormalizeChildren (children: any) {
    for (let i = 0; i < children.length; i++) {
      if (Array.isArray(children[i])) {
        return Array.prototype.concat.apply([], children)
      }
    }
    return children
  }

  // 2. When the children contains constructs that always generated nested Arrays,
  // e.g. <template>, <slot>, v-for, or when the children is provided by user
  // with hand-written render functions / JSX. In such cases a full normalization
  // is needed to cater to all possible types of children values.
  export function normalizeChildren (children: any): ?Array<VNode> {
    return isPrimitive(children)
      ? [createTextVNode(children)]
      : Array.isArray(children)
        ? normalizeArrayChildren(children)
        : undefined
  }
  ```

  `simpleNormalizeChildren` 方法调用场景是 `render` 函数是编译生成的。理论上编译生成的 `children` 都已经是 VNode 类型的，但这里有一个例外，就是 `functional component` 函数式组件返回的是一个数组而不是一个根节点，所以会通过 `Array.prototype.concat` 方法把整个 `children` 数组打平，让它的深度只有一层。

  `normalizeChildren` 方法的调用场景有 2 种，一个场景是 `render` 函数是用户手写的，当 `children` 只有一个节点的时候，Vue.js 从接口层面允许用户把 `children` 写成基础类型用来创建单个简单的文本节点，这种情况会调用 `createTextVNode` 创建一个文本节点的 VNode；另一个场景是当编译 `slot`、`v-for` 的时候会产生嵌套数组的情况，会调用 `normalizeArrayChildren` 方法。

  ![](https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/202307072220213.png)

`normalizeArrayChildren` 接收 2 个参数，`children` 表示要规范的子节点，`nestedIndex` 表示嵌套的索引，因为单个 `child` 可能是一个数组类型。 `normalizeArrayChildren` 主要的逻辑就是遍历 `children`，获得单个节点 `c`，然后对 `c` 的类型判断，如果是一个数组类型，则递归调用 `normalizeArrayChildren`; 如果是基础类型，则通过 `createTextVNode` 方法转换成 VNode 类型；否则就已经是 VNode 类型了，如果 `children` 是一个列表并且列表还存在嵌套的情况，则根据 `nestedIndex` 去更新它的 key。这里需要注意一点，在遍历的过程中，对这 3 种情况都做了如下处理：如果存在两个连续的 `text` 节点，会把它们合并成一个 `text` 节点。

经过对 `children` 的规范化，`children` 变成了一个类型为 VNode 的 Array。

<br />

#### VNode的创建

回到 `createElement` 函数，规范化 `children` 后，接下来会去创建一个 VNode 的实例：

![](https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/202307072223299.png)

这里先对 `tag` 做判断，如果是 `string` 类型，则接着判断如果是内置的一些节点，则直接创建一个普通 VNode，如果是为已注册的组件名，则通过 `createComponent` 创建一个组件类型的 VNode，否则创建一个未知的标签的 VNode； 否则直接创建一个组件类型的 VNode 节点。

<br />

### update

Vue 的 `_update` 是实例的一个私有方法，它被调用的时机有 2 个，一个是首次渲染，一个是数据更新的时候。

- 文件位置：`src/core/instance/lifecycle.js`
