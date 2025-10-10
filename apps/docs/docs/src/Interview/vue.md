## Vue-Router

### 路由模式及原理是什么？

在 Vue Router 中，有两种常见的路由模式：hash 模式和 history 模式。

1. **Hash 模式**：
   - Hash 模式是 Vue Router 的默认模式。在该模式下，URL 中的 hash（即 # 号后面的部分）用于管理路由状态。例如：`http://example.com/#/home`。
   - 原理：当路由发生变化时，浏览器不会向服务器发送请求，而是通过监听 `hashchange` 事件来感知 URL 的变化，并相应地更新路由状态。这种方式可以避免浏览器向服务器发送请求，但 URL 中会出现 # 号，可能不太美观。
   - 使用方式：在 Vue Router 中，可以通过创建路由器实例时设置 `mode: 'hash'` 来启用 Hash 模式。
2. **History 模式**：
   - History 模式通过使用 HTML5 History API，在没有 # 号的情况下管理路由状态。例如：`http://example.com/home`。
   - 原理：在 History 模式下，当路由发生变化时，浏览器会发送请求到服务器，并由服务器返回相应的页面。然后，前端使用 History API（`pushState` 和 `replaceState`）来修改 URL，但不会刷新页面，从而实现无刷新的页面切换。
   - 注意事项：由于 History 模式需要后端服务器的支持，因此在使用 History 模式时，需要配置后端服务器以始终返回同一页面（通常是 index.html），以确保路由切换时能正确加载前端应用。
   - 使用方式：在 Vue Router 中，可以通过创建路由器实例时设置 `mode: 'history'` 来启用 History 模式。

<br />

### 路由跳转尽量使用 name 而不是 path

如果我们页面跳转的地方全是使用的 `path`，那么我们需要修改所有涉及该 path 的页面，这样不利于项目的维护。而相对于 path，name 使用起来就方便多了，因为其具有唯一性，即使我们修改了 path，还可以使用原来的 `name` 值进行跳转。

```js
this.$router.push({
  name: 'page1'
})

// 而不是
this.$router.push({
  path: 'page1'
})
```

<br />

### 路由守卫的方法和使用？

在 Vue Router 中，路由守卫（Route Guards）是用于在导航过程中对路由进行监控和控制的功能。它可以让我们在导航到不同的路由之前或之后执行一些逻辑，比如验证用户是否登录、权限控制、页面加载状态等。

Vue Router 提供了多种路由守卫方法，可以分为全局守卫和路由级别守卫。

**全局守卫**:

全局守卫会在每次路由导航时都执行，不管是从哪个路由导航到哪个路由。全局守卫分为以下三种：

1. `beforeEach`: 在路由切换开始时触发，用于执行一些全局的前置逻辑，比如验证用户是否登录。
2. `afterEach`: 在路由切换成功完成时触发，用于执行一些全局的后置逻辑，比如页面加载状态的处理。
3. `beforeResolve`: 在导航被确认之前触发，用于异步路由组件解析完成之前执行额外的逻辑。

**路由独享的守卫：**

1. `beforeEnter`：针对单独路由配置守卫

**组件内守卫：**

1. `beforeRouteEnter`: 在路由进入之前触发，但是在组件实例被创建之前触发，因此无法访问组件实例，可以通过回调函数访问组件实例。
2. `beforeRouteUpdate`: 在当前路由改变，但是仍然加载了当前组件时触发，比如从 A 路由跳转到 B 路由，但 B 路由的组件和 A 路由的组件是同一个组件时触发。
3. `beforeRouteLeave`: 在路由离开之前触发，可以用于离开前的确认提示或数据保存等。

<br />

## Vuex

### namespace是什么？

在 Vuex 中，`namespace` 是用于模块化管理状态的一种机制。当在 Vuex 中创建多个模块时，每个模块都有自己的状态、操作、获取器等，为了避免不同模块之间的命名冲突，可以通过 `namespace` 属性对模块进行命名空间的隔离。

在 Vuex 中，`namespace` 是模块的一个属性，它可以是一个布尔值或字符串。

1. 如果 `namespace` 设置为 `true`，表示该模块启用命名空间，默认为 `false`。这意味着该模块的所有状态、操作和获取器都将被自动放置在一个命名空间下。
2. 如果 `namespace` 设置为字符串，那么模块的所有状态、操作和获取器都将被放置在该字符串指定的命名空间下。

<br />

## Pinia

<br />

## Vue2

### 如何理解MVVM？

1. Model：模型层，负责处理业务逻辑以及和服务器端进行交互
2. View：视图层：负责将数据模型转化为UI展示出来，可以简单的理解为HTML页面
3. ViewModel：视图模型层，用来连接Model和View，是Model和View之间的通信桥梁

在MVVM的架构下，**View层和Model层并没有直接联系，而是通过ViewModel层进行交互。** ViewModel层通过**双向数据绑定**将View层和Model层连接了起来，使得View层和Model层的同步工作完全是自动的。因此开发者只需关注业务逻辑，无需手动操作DOM。

需要说一下，Vue、React 这些现代框架并非第一批使用 MVVM 架构模式的框架，在此之前还有 knockout.js 以及 ember.js。

这里要强调一下，Vue 是 MVVM 架构模式。但是 React 并非 MVVM 架构模式。

在 Vue 中，有明确的哪个部分是 M，哪个部分是 V，哪个部分是 VM。

在 React 里面，没有明确的 VM 部分，采用的是 Flux 的架构模式，是单向数据流。

<br />

### 对vue的理解？

1. 核心特性：

   1. **数据驱动（MVVM)**

      ```
      MVVM`表示的是 `Model-View-ViewModel
      ```

      - Model：模型层，负责处理业务逻辑以及和服务器端进行交互
      - View：视图层：负责将数据模型转化为UI展示出来，可以简单的理解为HTML页面
      - ViewModel：视图模型层，用来连接Model和View，是Model和View之间的通信桥梁

   2. **组件化**

      组件化一句话来说就是把图形、非图形的各种逻辑均抽象为一个统一的概念（组件）来实现开发的模式，在`Vue`中每一个`.vue`文件都可以视为一个组件。

      组件化的优势：

      - 降低整个系统的耦合度，在保持接口不变的情况下，我们可以替换不同的组件快速完成需求，例如输入框，可以替换为日历、时间、范围等组件作具体的实现
      - 调试方便，由于整个系统是通过组件组合起来的，在出现问题的时候，可以用排除法直接移除组件，或者根据报错的组件快速定位问题，之所以能够快速定位，是因为每个组件之间低耦合，职责单一，所以逻辑会比分析整个系统要简单
      - 提高可维护性，由于每个组件的职责单一，并且组件在系统中是被复用的，所以对代码进行优化可获得系统的整体升级

   3. **指令系统**

      解释：指令 (Directives) 是带有 v- 前缀的特殊属性作用：当表达式的值改变时，将其产生的连带影响，响应式地作用于 DOM

      - 常用的指令
        - 条件渲染指令 `v-if`
        - 列表渲染指令`v-for`
        - 属性绑定指令`v-bind`
        - 事件绑定指令`v-on`
        - 双向数据绑定指令`v-model`

      没有指令之前我们是怎么做的？是不是先要获取到DOM然后再....干点啥

2. 跟传统开发的区别：

   - Vue所有的界面事件，都是只去操作数据的，Jquery操作DOM
   - Vue所有界面的变动，都是根据数据自动绑定出来的，Jquery操作DOM

3. 和react对比：

   **相同点**

   - 都有组件化思想
   - 都支持服务器端渲染
   - 都有Virtual DOM（虚拟dom）
   - 数据驱动视图
   - 都有支持native的方案：`Vue`的`weex`、`React`的`React native`
   - 都有自己的构建工具：`Vue`的`vue-cli`、`React`的`Create React App`

   **区别**

   - 数据流向的不同。`react`从诞生开始就推崇单向数据流，而`Vue`是双向数据流
   - 数据变化的实现原理不同。`react`使用的是不可变数据，而`Vue`使用的是可变的数据
   - 组件化通信的不同。`react`中我们通过使用回调函数来进行通信的，而`Vue`中子组件向父组件传递消息有两种方式：事件和回调函数
   - diff算法不同。`react`主要使用diff队列保存需要更新哪些DOM，得到patch树，再统一操作批量更新DOM。`Vue` 使用双向指针，边对比，边更新DOM

<br />

### new Vue初始化顺序？

创建vue实例和创建组件的流程基本一致：

1. 首先做一些初始化的操作，主要是设置一些私有属性到实例中

2. 运行生命周期钩子函数 `beforeCreate`

3. 进行注入流程：处理属性、computed、methods、data、provide、inject，最后使用代理模式将它们挂载到实例中

4. 运行声明周期钩子函数：`created`

5. 生成render函数：如果有配置，直接使用配置的render，如果没有，使用运行时编译器，将模板编译为render

6. 运行生命周期钩子函数：`beforeMount`

7. 创建一个 `Watcher`，传入一个函数 `updateComponent`，该函数会运行render，把得到的VNode再传入\_update函数执行

   ![](https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/202307161845054.png)

8. `this._init`：Vue的原型方法，`src\core\instance\index.js`

9. `initMixin`：`src\core\instance\init.js`

10. 初始化组件生命周期标志位 `initLifecycle(vm)`、初始化组件事件侦听 `initEvents(vm)`、初始化渲染方法 `initRender(vm)`

11. `beforeCreate`钩子执行：`callHook(vm, 'beforeCreate')`

12. 初始化依赖注入内容： `initInjections(vm)`

13. 初始化props/data/method/watch/methods ：`initState` - `src\core\instance\state.js`，顺序：

    ```js
    export function initState (vm: Component) {
      // 初始化组件的watcher列表
      vm._watchers = []
      const opts = vm.$options

      // 初始化props
      if (opts.props) initProps(vm, opts.props)

      // 初始化methods方法
      if (opts.methods) initMethods(vm, opts.methods)

      if (opts.data) {
        // 初始化data
        initData(vm)
      } else {
        observe(vm._data = {}, true /* asRootData */)
      }

      // 初始化computed
      if (opts.computed) initComputed(vm, opts.computed)

      // 初始化watch
      if (opts.watch && opts.watch !== nativeWatch) {
        initWatch(vm, opts.watch)
      }
    }
    ```

14. `initData`：- `src\core\instance\state.js`

    ```js
    function initData (vm: Component) {
      let data = vm.$options.data
      // 获取到组件上的data
      data = vm._data = typeof data === 'function'
        ? getData(data, vm)
        : data || {}
      if (!isPlainObject(data)) {
        data = {}
        process.env.NODE_ENV !== 'production' && warn(
          'data functions should return an object:\n' +
          'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
          vm
        )
      }
      // proxy data on instance
      const keys = Object.keys(data)
      const props = vm.$options.props
      const methods = vm.$options.methods
      let i = keys.length
      while (i--) {
        const key = keys[i]
        if (process.env.NODE_ENV !== 'production') {
          // 属性名不能与方法名重复
          if (methods && hasOwn(methods, key)) {
            warn(
              `Method "${key}" has already been defined as a data property.`,
              vm
            )
          }
        }
        // 属性名不能与props名称重复
        if (props && hasOwn(props, key)) {
          process.env.NODE_ENV !== 'production' && warn(
            `The data property "${key}" is already declared as a prop. ` +
            `Use prop default value instead.`,
            vm
          )
        } else if (!isReserved(key)) { // 验证key值的合法性
          // 将_data中的数据挂载到组件vm上,这样就可以通过this.xxx访问到组件上的数据
          proxy(vm, `_data`, key)
        }
      }
      // observe data
      // 响应式监听data是数据的变化
      observe(data, true /* asRootData */)
    }
    ```

15. 初始化provide `initProvide(vm)`

16. `created` 钩子执行：`callHook(vm, 'created')`

17. 执行挂载：`vm.$mount`方法

    ```js
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
    ```

    - 不要将根元素放到`body`或者`html`上
    - 可以在对象中定义`template/render`或者直接使用`template`、`el`表示元素选择器
    - 最终都会解析成`render`函数，调用`compileToFunctions`，会将`template`解析成`render`函数

    对`template`的解析步骤大致分为以下几步：

    - 将 `html` 文档片段解析成 `ast` 描述符
    - 将 `ast` 描述符解析成字符串
    - 生成 `render` 函数

    生成 `render` 函数，挂载到 `vm` 上后，会再次调用 `mount` 方法

    源码位置：`src\platforms\web\runtime\index.js`

18. 调用 `mountComponent` 渲染组件：

    - 会触发 `beforeCreate` 钩子
    - 定义 `updateComponent` 渲染页面视图的方法
    - 监听组件数据，一旦发生变化，触发 `beforeUpdate` 生命钩子

    `updateComponent `方法主要执行在 `vue` 初始化时声明的 `render`，`update` 方法

    `render` 的作用主要是生成 `vnode` - `src\core\instance\render.js`

    ```js
    // 定义更新函数
    updateComponent = () => {
      // 实际调⽤是在lifeCycleMixin中定义的_update和renderMixin中定义的_render
      vm._update(vm._render(), hydrating)
    }
    ```

    `_update`主要功能是调用`patch`，将`vnode`转换为真实`DOM`，并且更新到页面中 - `src\core\instance\lifecycle.js`

<br />

### Template和虚拟DOM的关系？

- 模板的存在，仅仅是为了让开发人员更加方便的书写界面代码。vue最终运行的时候，需要的是render函数，而不是模板。因此，模板中的各种语法，在虚拟DOM中都是不存在的，它们都会变成虚拟DOM的配置。

- vue框架中有一个 `compile` 模块，主要负责将模板转换为 `render` 函数，而 `render` 函数调用后将得到虚拟DOM。

编译的过程分为两步：

1. 将模板字符串转换为AST
2. 将AST转换为render函数

如果使用传统的 `<script>` 引入方式，则编译时间发生在组件第一次加载时，称之为运行时编译。

如果是在 `vue-cli` 的默认配置下，编译发生在打包时，称之为模板预编译。编译是一个极其耗费性能的操作，预编译可以有效的提高运行时的性能，而且由于运行的时候已不再需要编译， `vue-cli` 在打包时会排除掉 `compile` 模块，以减少打包体积。

<br />

### 编译过程？

Vue 的编译过程涉及将模板（Template）转换为渲染函数（Render Function），这是 Vue 在运行时将组件渲染到 DOM 的核心过程。

主要包括：

1. **模板解析**：

   - 首先，Vue 的编译器会将模板字符串解析为 AST（Abstract Syntax Tree，抽象语法树）表示形式。AST 是一个以 JavaScript 对象表示的抽象语法树结构，用于描述模板的各个部分以及它们之间的关系。

2. **静态分析**：

   - 在模板解析的过程中，编译器会进行静态分析，检查模板中是否有错误的语法或语义问题，例如未闭合的标签、无效的属性等。

3. **优化**：

   - 编译器会对 AST 进行一些优化处理，以提高渲染性能。其中，包括静态节点的标记（Static Node Tracking）和静态根节点提升（Static Root Node Hoisting）等优化手段。

4. **代码生成**：

   - 在 AST 的基础上，编译器会生成可执行的渲染函数（Render Function）。渲染函数是一个 JavaScript 函数，用于描述如何将组件渲染成 VNode（虚拟节点）。

5. **渲染过程**：

   - 在运行时，当组件需要被渲染时，Vue 会执行渲染函数，生成对应的虚拟DOM树，是 Vue 内部对真实 DOM 的一种抽象表示，它包含组件的信息和结构。

6. **Diff 算法及更新**：
   - 渲染函数生成 VNode 后，Vue 会通过 Diff 算法对新旧 VNode 进行比较，找出需要更新的部分，并进行最小化的 DOM 操作，以提高性能和效率。

<br />

### 虚拟DOM的理解？

Vue 的 **虚拟 DOM（Virtual DOM）** 是一种用于优化 DOM 操作的技术。它通过在内存中维护一个轻量级的 JavaScript 对象树（即虚拟 DOM），来减少直接操作真实 DOM 的开销，从而提升渲染性能。虚拟 DOM 是一个 JavaScript 对象，它是对真实 DOM 的抽象表示。虚拟 DOM 的结构与真实 DOM 类似，但它只包含必要的信息（如标签名、属性、子节点等），并且操作虚拟 DOM 比操作真实 DOM 更快。

虚拟 DOM 的核心思想是通过对比新旧虚拟 DOM 树的差异，计算出最小的 DOM 操作，然后将这些操作批量应用到真实 DOM 上。这种方式避免了直接操作真实 DOM 的性能瓶颈。

**工作流程：**

1. **生成虚拟 DOM**：
   - Vue 在编译模板时，会将模板转换为渲染函数。
   - 渲染函数执行后，生成虚拟 DOM 树。
2. **对比新旧虚拟 DOM**：
   - 当数据发生变化时，Vue 会重新执行渲染函数，生成新的虚拟 DOM 树。
   - 使用 **Diff 算法** 对比新旧虚拟 DOM 树，找出需要更新的部分。
3. **更新真实 DOM**：
   - 根据 **Diff 算法**的结果，将最小的 DOM 操作应用到真实 DOM 上。

**优点：**

1. **性能优化**：
   - 减少直接操作真实 DOM 的次数，避免重排和重绘的开销。
   - 通过批量更新 DOM，提升渲染性能。
2. **跨平台支持**：
   - 虚拟 DOM 是平台无关的，可以用于浏览器、小程序、Native 等环境。
3. **简化开发**：
   - 开发者只需关注数据的变化，Vue 会自动处理 DOM 的更新。

**缺点：**

1. **内存占用**：
   - 虚拟 DOM 需要在内存中维护一棵树，可能会占用较多内存。
2. **首次渲染较慢**：
   - 初次渲染需要生成虚拟 DOM 并转换为真实 DOM，可能比直接操作 DOM 慢。
3. **不适合简单场景**：
   - 对于简单的静态页面，直接操作 DOM 可能更高效。

<br />

### Diff算法的理解？

Diff 算法是虚拟 DOM 的核心，它通过对比新旧虚拟 DOM 树的差异，计算出需要更新的部分。Vue 的 Diff 算法基于以下策略：

- **同层比较**：
  - 只对比同一层级的节点，不跨层级比较。
- **Key 值优化**：
  - 通过 `key` 属性标识节点，避免不必要的节点销毁和重建。
- **节点复用**：
  - 如果节点类型相同，则复用现有节点，只更新属性和子节点。

**具体步骤：**

1. **对比根节点**：
   - 如果根节点类型不同，则直接替换整个树。
   - 如果根节点类型相同，则对比属性和子节点。
2. **对比子节点**：
   - 使用双指针算法（头尾对比）高效地对比子节点。
   - 通过 `key` 值匹配节点，减少不必要的操作。

<br />

### 响应式原理

响应式数据的最终模板，是当对象本身或对象属性发生变化时，将会运行一些函数，最常见的就是render函数。

在具体实现上，vue用到了几个核心部件：

1. Observer
2. Dep
3. Watcher
4. Scheduler

**Observer：**

要实现的目标非常简单，就是把一个普通对象转换为响应式的对象。把对象的每个属性通过 `Object.defineProperty` 转换为带有 `getter` 和 `setter` 的属性。会递归遍历，完成深度的属性转换。

`Observe` 是vue内部的构造器，可以通过vue提供的静态方法 `Vue.observable(obj)` 间接的使用该功能。在组件的生命周期中，这件事发生在 `beforeCreate` 之后，`created` 之前。

由于遍历时只能遍历到对象的当前属性，因此无法检测到将来动态增加或删除的属性，因此vue提供了 `$set` 和 `$delete` 实例方法，通过这两个实例方法对已有响应式对象添加或删除属性。

对于数组，vue会更改它的隐式原型，以便监听可能改变数组内容的方法。

**Dep:**

读取属性时要做什么，属性变化时要做什么，这两个问题需要依赖 `Dep` 来解决。

vue会为响应式对象中的每个属性、对象本身、数组本身创建一个 `Dep` 实例，每个 `Dep` 实例都有能力做以下两件事：

1. 依赖记录：是谁在使用
2. 派发更新：我变了，我要通知哪些用到我的人

当读取响应式对象的某个属性时，会进行依赖收集；当改变某个属性时，会派发更新。

**Watcher：**

还有一个问题，就是Dep如何知道谁在用我？就需要 `Watcher` 解决。

当某个函数执行的过程中，用到了响应式数据，响应式数据是无法知道是哪个函数在用自己。

因此，不会直接执行函数，而是把函数交给一个叫做 `Watcher` 的东西去执行，它是一个对象，每个这样的函数执行时都应该创建一个 `Watcher`，通过 `Watcher` 去执行。

`Watcher`会设置一个全局变量，让全局变量记录负责执行的 `Watcher`等于自己，然后再去执行函数。在函数的执行过程中，如果发生了依赖记录 `dep.depend()`，那么 `Dep` 就会把这个全局变量记录下来，表示：有一个 `Watcher`用到了我的属性。

当 `Dep` 进行派发更新时，会通知之前记录的所有 `Watcher`：我改变了。

每一个vue组件实例，都至少对应一个 `Watcher`， 该 `Watcher`中记录了该组件的 `render` 函数。

`Watcher`首先会把 `render` 函数运行一次以收集依赖，于是那些在 `render` 中用到的响应式数据就会记录这个 `Watcher`。当数据变化时，Dep就会通知该 `Watcher`，而 `Watcher`将重新运行 `render` 函数，从而让界面重新渲染同时重新记录当前的依赖。

**Scheduler：**

Dep通知 `Watcher`之后，如果 `Watcher` 执行重新运行的函数，就有可能导致频繁运行，从而导致效率低下。

因此，`Watcher`收到派发更新的通知后，实际上不是立即执行对应函数，而是把自己交给一个叫调度器的东西。

调度器维护一个执行队列，该队列同一个 `Watcher`仅会存在一次，队列中的 `Watcher`不是立即执行，会通过一个 `nextTick` 的工具方法，把这些需要执行的 `Watcher`放入到事件循环的微队列中。

也就是说，当响应式数据变化时，`render` 函数的执行是异步的，并且在微队列中。

<br />

### 如何检测数组的变化？

在 Vue 2 中，检测数组的变化是通过重写数组的变异方法（如 `push`、`pop`、`splice` 等）来实现的。由于 JavaScript 的限制，Vue 2 无法直接通过 `Object.defineProperty` 监听数组索引的变化（如 `arr[0] = 1`），因此 Vue 2 采用了重写数组方法的方式来拦截数组的变化并触发视图更新。

1. Vue 2 通过 `Object.create` 创建一个新的数组原型对象，并将重写后的方法挂载到这个原型对象上。然后将数组的原型指向这个新的原型对象
2. 当调用重写后的数组方法时，Vue 2 会通过 `Observer` 实例的 `dep.notify()` 方法通知所有依赖该数组的 Watcher 进行更新

<br />

### diff算法

当组件创建和更新时，vue均会执行内部的update函数，该函数使用render函数生成虚拟的DOM树，将新旧两树进行对比，找到差异点，最终更新到真实DOM。对比差异的过程叫diff，内部通过patch函数完成。

在对比时，采用深度优先、同层比较的方式进行比对，在判断两个节点是否相同时，vue是通过虚拟节点的key和tag来进行判断。

首先对比根节点，如果相同则将旧节点关联的真实DOM的引用挂载到新节点，然后根据需要更新属性到真实DOM，然后对比其子节点；如果不相同，则按照新节点的信息递归创建所有真实DOM，同时挂载到对应虚拟节点上，然后移除掉旧的DOM。

然后在对比子节点时，对子节点数组使用两个指针，分别指向头尾，然后不断向中间靠拢来进行对比，这样做的目的是尽量复用真实DOM，尽量减少销毁和创建真实DOM，如果发现相同，则进入和根节点一样的对比流程；如果发现不同，则移动真实DOM到合适的位置。

一直递归遍历，直到整棵树完成对比。

1. diff的时机

   当组件创建时，以及依赖的属性或数据变化时，会运行一个函数，该函数会做两件事：

   - 运行 `_render` 生成一棵新的虚拟DOM树
   - 运行 `_update`，传入虚拟DOM树的根节点，对新旧两棵树进行对比，最终完成对真实DOM的更新

   diff就发生在 `_update` 函数的运行过程中。

2. `_update` 函数在干什么

   接收一个 `vnode` 参数，这就是新生成的虚拟DOM树。同时，通过当前组件的 `_vnode` 属性，拿到旧的虚拟DOM树。首先会给组件的 `_vnode` 属性重新赋值，让它指向新树。

   然后会判断旧树是否存在：

   - 不存在：说明这是第一次加载组件，于是通过内部的 `patch` 函数，直接遍历新树，为每个节点生成真实的DOM，挂载到每个节点的 `elm` 属性上。
   - 存在：说明之前已经渲染过该组件，于是通过内部的 `patch` 函数，对新旧两棵树进行对比，以实现两个目标：
     - 完成对所有真实DOM的最小化处理
     - 让新树的节点对应到合适的真实DOM

3. patch 函数对比流程

   1. 根节点比较：

      - 相同：进入更新流程
        1. 将旧节点的真实DOM赋值到新节点：`newVnode.elm = oldVnode.elm`
        2. 对比新节点和旧节点的属性，有变化的更新到真实DOM中
        3. 当前两个节点处理完毕，开始对比子节点
      - 不相同：
        1. 新节点递归新建元素
        2. 旧节点销毁元素

   2. 对比子节点

      - 尽量不改动
      - 不行的话，尽量改动元素属性
      - 还不行，尽量移动元素
      - 还不行，删除和创建元素

<br />

### 组件实例原理？

在 Vue 中，**组件实例**是一个对象，它是 Vue 组件的运行时表示。每个组件实例都包含了组件的状态（如 `data`、`props`）、方法（如 `methods`）、生命周期钩子、计算属性（`computed`）等。组件实例的底层实现原理涉及 Vue 的响应式系统、虚拟 DOM 和组件化机制。

- 每次在模板中使用组件时，都会创建一个新的组件实例。
- 组件实例是独立的，每个实例都有自己的状态和作用域。
- 组件实例的复用是 Vue 组件化开发的核心机制。

在 Vue 2 中，组件实例是通过 `Vue.extend` 或 `Vue.component` 定义的。每次使用组件时，Vue 会调用 `new VueComponent()` 创建一个新的组件实例。

1. **组件定义**：
   - 使用 `Vue.extend` 或 `Vue.component` 定义组件。
   - 组件定义会被转换为一个构造函数（`VueComponent`）。
2. **实例化组件**：
   - 当在模板中使用组件时，Vue 会调用 `new VueComponent()` 创建组件实例。
   - 组件实例会继承 Vue 的原型方法，并初始化组件的状态（`data`、`props` 等）。
3. **挂载组件**：
   - 组件实例会被挂载到父组件或根实例中，生成对应的 DOM 节点。

每个组件实例都包含以下核心属性：

- **`$data`**：组件的 `data` 对象。
- **`$props`**：组件的 `props` 对象。
- **`$options`**：组件的配置选项。
- **`$el`**：组件对应的 DOM 元素。
- **`$parent`**：父组件实例。
- **`$children`**：子组件实例列表。
- **`$refs`**：通过 `ref` 注册的 DOM 元素或组件实例。
- **`$slots`**：插槽内容。
- **`$scopedSlots`**：作用域插槽内容。

<br />

### Vue2生命周期？

**创建阶段**

1. **`beforeCreate`**：
   - 在实例初始化之后，数据观测（`data`）和事件配置之前调用。
   - 此时无法访问 `data`、`computed`、`methods` 等。
2. **`created`**：
   - 在实例创建完成后调用。
   - 此时可以访问 `data`、`computed`、`methods`，但 DOM 还未挂载。

**挂载阶段**

1. **`beforeMount`**：
   - 在挂载开始之前调用，此时模板已经编译完成，但尚未将 DOM 插入页面。
2. **`mounted`**：
   - 在实例挂载到 DOM 后调用。
   - 此时可以访问 DOM 元素。

**更新阶段**

1. **`beforeUpdate`**：
   - 在数据更新导致虚拟 DOM 重新渲染之前调用。
   - 适合在更新之前访问现有的 DOM 状态。
2. **`updated`**：
   - 在数据更新导致虚拟 DOM 重新渲染并打补丁后调用。
   - 避免在此钩子中修改状态，否则可能导致无限更新循环。

**销毁阶段**

1. **`beforeDestroy`**：
   - 在实例销毁之前调用。
   - 适合清理定时器、解绑事件等操作。
2. **`destroyed`**：
   - 在实例销毁后调用。
   - 此时所有的事件监听器和子实例都已被移除。

<br />

### 组件通信方式有哪些？

1. **Props / $emit**：通过父组件向子组件传递数据，子组件通过 `$emit` 事件触发向父组件发送消息。
2. **Vuex/Pinia**：全局状态管理，实现了组件之间的集中式状态管理。
3. **Event Bus**：使用一个空的 Vue 实例作为中央事件总线，充当事件的中介者，组件通过订阅和触发自定义事件来进行通信。
4. **Provide / Inject**：在父组件中使用 `provide` 提供数据，子组件通过 `inject` 来注入数据，实现了祖先组件向后代组件传递数据。
5. **$refs**：通过 `$refs` 引用子组件的实例，从而直接访问和调用子组件的方法和属性。
6. **$parent / $children**：通过 `$parent` 和 `$children` 来访问父组件和子组件的实例，可以进行跨级通信。
7. `$attrs / $listeners`：用于传递父组件中未被子组件 props 所识别的属性和监听器。
8. **Sync Modifier/v-model**：使用 `.sync` 修饰符来进行双向数据绑定，实现了父组件与子组件之间的双向数据流。
9. **LocalStorage / SessionStorage**：使用浏览器的本地存储来在组件之间共享数据。

<br />

### 动态组件和异步组件区别？

| 特性         | 动态组件                               | 异步组件                             |
| :----------- | :------------------------------------- | :----------------------------------- |
| **加载时机** | 初始化时加载所有组件                   | 需要显示时加载组件                   |
| **使用场景** | 组件切换频繁且组件数量较少             | 组件较大或不需要立即加载             |
| **实现方式** | `<component :is="currentComponent" />` | `import()` 或 `defineAsyncComponent` |
| **性能**     | 初始加载可能较慢，切换速度快           | 初始加载快，切换时可能有延迟         |
| **代码分割** | 不支持                                 | 支持，配合 Webpack 实现按需加载      |

<br />

### v-if和v-show的区别？

v-if：根据条件动态地创建或销毁元素及其组件，只有当条件为真时才会渲染元素到 DOM 中。频繁切换开销较大。

v-show：根据条件设置元素的 `display` CSS 属性，通过控制元素的显示和隐藏来实现条件渲染。初始渲染开销较大。

频繁切换显隐使用v-show。

<br />

### computed和methods的区别？

| 特性           | `computed`                 | `methods`                    |
| :------------- | :------------------------- | :--------------------------- |
| **缓存**       | 有缓存，依赖变化才重新计算 | 无缓存，每次调用都执行       |
| **调用方式**   | 作为属性使用，无需括号     | 作为方法调用，需要加括号     |
| **响应式依赖** | 自动追踪依赖               | 不自动追踪依赖               |
| **性能**       | 高效，适合复杂计算         | 每次调用都执行，适合简单逻辑 |
| **使用场景**   | 动态计算、格式化数据       | 事件处理、需要参数的逻辑     |

- 如果需要 **缓存** 和 **高效计算**，使用 `computed`。
- 如果需要 **每次调用都执行** 或 **处理事件**，使用 `methods`。

![](https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/202307161927308.png)

<br />

### 全局挂载如何实现？

1. vue2挂载到vue原型上

2. vue3中使用app.config.globalProperty

<br />

### scope原理是什么？

1. **唯一标识符**：每个 Vue 单文件组件在编译过程中都会生成一个唯一的标识符，例如一个哈希值或者使用 BEM 风格的类名。
2. **元素匹配**：当组件渲染到页面上时，组件的元素都会添加一个唯一的 `data-v` 属性，其值与编译时生成的唯一标识符相对应。
3. **编译样式**：在编译单文件组件时，Vue 的编译器会解析 `<style>` 标签中的样式，并根据唯一标识符为每个选择器添加一个额外的属性选择器。

<br />

### 为什么使用状态管理工具而不用localStorage？

1. **数据响应性**：`localStorage` 不提供响应式能力，即当数据变化时，无法自动更新视图。在 Vue 应用中，需要实时地响应数据变化并更新视图，以保持应用的一致性和实时性。
2. **数据共享和管理**：`localStorage` 是全局的存储，所有组件都可以直接访问和修改其中的数据。这种方式导致了数据共享和管理的困难，容易导致代码混乱和难以维护。
3. **数据流的追踪和调试**：`localStorage` 中的数据变化不容易追踪和调试。在复杂的应用中，需要对数据流进行追踪和调试，以便更好地理解应用的状态变化和调试潜在问题。

相比之下，`pinia` 和 `Vuex` 是专门设计用于状态管理的库，它们提供了以下优势：

1. **响应式数据**：`pinia` 和 `Vuex` 提供响应式能力，当状态发生变化时，相关组件会自动更新。这使得状态变化可以实时地反映到视图上，保持应用的一致性和实时性。
2. **数据共享和管理**：`pinia` 和 `Vuex` 提供了一种结构化的方式来共享和管理应用的状态和数据流。它们提供了状态的中心化管理，可以将数据存储在统一的地方，并通过 getter 和 mutation 来访问和修改数据。这样，可以更好地组织和维护应用的状态。
3. **开发工具支持**：`pinia` 和 `Vuex` 都提供了开发工具支持，可以帮助开发者更好地追踪和调试数据流。这些工具可以展示状态的变化历史、调试状态变化的过程，并提供其他有用的开发辅助功能。

<br />

### v-for中key的作用？

当使用 `v-for` 渲染列表时，通常应该为每个循环项指定一个唯一的 `key` 属性。`key` 属性的作用是帮助 Vue 跟踪每个节点的身份，在列表发生变化时进行优化和重用，从而提高性能和避免出现一些潜在的问题。

1. **优化列表渲染性能**：使用 `key` 属性可以帮助 Vue 识别列表中每个节点的唯一身份，当列表数据发生变化时，Vue 可以更加高效地更新 DOM，而不是重新渲染整个列表。
2. **防止重复渲染和错误**：在列表中不设置 `key` 属性，或者设置相同的 `key` 值，可能会导致 Vue 难以区分每个节点的身份，从而可能出现重复渲染或错误的情况。
3. **维持组件状态**：在使用 `v-for` 渲染组件时，每个组件都应该有一个唯一的 `key`，以确保组件状态正确地保持在重新渲染时。

<br />

### vue常见优化手段有哪些？

1. v-for 使用key属性
2. 对不用深度响应式的数据使用对象冻结：`Object.freeze()`
3. 使用函数式组件：functional: true，没有状态（data），没有实例（this）
4. 使用计算属性，自动追踪响应式依赖并缓存
5. 组件太多可以使用延迟装载：通过requestAnimationFrame分批渲染

<br />

### v-html的安全怎么考虑？

将一段 HTML 字符串直接渲染到 Vue 模板中，但需要注意它存在一定的安全风险，因为可以插入恶意脚本或不受信任的内容。

**输入验证和过滤**：在接收用户输入并将其传递给 `v-html` 指令之前，应该进行输入验证和过滤，确保输入的内容符合预期的格式和规范。可以使用安全的输入验证库，如 DOMPurify，来过滤和清理输入的 HTML 字符串，去除潜在的恶意代码和危险标签。

**特定组件的使用**：考虑使用特定的组件或工具来显示富文本内容，而不是直接使用 `v-html`。例如，Vue 提供了 `vue-markdown` 和 `vue-html-render` 等组件，可以帮助你以更安全的方式渲染富文本内容。

<br />

### 自定义指令是什么？

自定义指令是一种扩展 Vue 模板语法的方法，允许开发者直接在模板中使用自定义指令，并且可以在指令中定义一些特定的行为和交互逻辑。

自定义指令可以用于以下情况：

1. **DOM 操作**：自定义指令可以用于直接操作 DOM 元素，比如设置样式、添加事件监听器、操作 DOM 属性等。
2. **用户交互**：自定义指令可以用于处理用户交互，比如添加特定的事件监听、捕获用户输入等。
3. **复用逻辑**：如果在多个组件中有相同的行为或交互逻辑，可以将这部分逻辑封装为自定义指令，从而实现逻辑的复用。

```js
// 示例：自定义指令 v-example
Vue.directive('example', {
  // 钩子函数
  bind(el, binding, vnode) {
    // 绑定时的逻辑
  },
  inserted(el, binding, vnode) {
    // 插入到 DOM 时的逻辑
  },
  update(el, binding, vnode, oldVnode) {
    // 组件更新时的逻辑
  },
  componentUpdated(el, binding, vnode, oldVnode) {
    // 组件更新完成时的逻辑
  },
  unbind(el, binding, vnode) {
    // 解绑时的逻辑
  }
})
```

<br />

### 自定义指令实现一个水印功能？

需要在全局范围注册一个自定义指令，然后在需要添加水印的元素上使用该指令即可。

```js
// main.js
Vue.directive('watermark', {
  bind(el, binding) {
    const watermarkText = binding.value || 'Watermark'
    el.style.position = 'relative'
    el.style.overflow = 'hidden'
    el.style.padding = '0'
    el.style.backgroundRepeat = 'repeat'
    el.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ctext x='0' y='50' font-size='20' fill='rgba(0, 0, 0, 0.2)' transform='rotate(-45 0,50)'%3E${encodeURIComponent(watermarkText)}%3C/text%3E%3C/svg%3E")`
  },
})

new Vue({
  el: '#app',
})
```

<br />

### 自定义指令权限的缺点？

当自定义指令用于组件上控制权限时，就算移除节点，组件的生命周期流程依然会执行，比如接口请求等，暴露的数据和方法也可以调用。

优化方案：外面通过 `v-if` 包装一层组件，来控制权限展示组件是否渲染

<br>

### h函数常见的应用场景？

1. antd-vue 表格自定义列

2. 全局命令式弹窗，点击事件中，定义弹窗组件为返回VNode的函数，attributes中包含取消事件，需要取消挂载并销毁，否则会发生内存泄露；

   创建容器元素添加到页面，根据弹窗组件创建vue根实例并挂载，再定义umount函数，实现根组件卸载及容器元素从页面移除

3. 二次封装动态组件，实现参数和插槽的透传

   `<component :is="h(Comp, $attrs, $slots)" />`

<br>

### 组件二次封装参数和插槽的传递方式？

方式一：通过h函数实现虚拟DOM

```vue
<script setup>
import { h, useAttrs, useSlots } from 'vue'
import Compo from './Compo.vue'

const Comp = h(Compo, useAttrs(), useSlots())
</script>

<template>
  <Comp />
</template>
```

方拾二：动态组件

```vue
<script setup>
import { h } from 'vue'
import Comp from './Comp.vue'
</script>

<template>
  <component :is="h(Comp, $attrs, $slots)" />
</template>
```

<br>

### EventBus是什么？

Event Bus 是一种设计模式，用于在不同组件之间进行通信。它是一种简单而强大的模式，可以让组件在没有直接父子关系的情况下进行通信，实现组件之间的解耦和复用。

Event Bus 的基本原理是通过创建一个独立的 Vue 实例作为中央事件总线（Event Bus），其他组件通过该实例来触发事件和监听事件，从而实现组件之间的通信。

在需要进行通信的组件中，通过导入事件总线，并使用 `$emit` 方法触发事件，使用 `$on` 方法监听事件。

```js
// event-bus.js
import Vue from 'vue'

export const eventBus = new Vue()
```

<br />

### mixin混入使用的方法，以及优缺点？

在 Vue 中，Mixin 是一种用于复用组件选项的特性。它允许我们将一些公共的逻辑、方法、生命周期钩子等提取到一个单独的对象中，并将其混入到多个组件中，从而实现代码的复用和组件间的共享。

优点：

1. **代码复用**：Mixin 允许我们将公共的逻辑和功能抽离出来，然后在多个组件中进行复用，减少了重复代码，提高了代码的可维护性。
2. **组件间共享逻辑**：Mixin 允许多个组件之间共享相同的逻辑和状态，当多个组件需要相同的功能时，可以通过混入来实现。
3. **灵活性**：组件可以使用多个 Mixin，从而实现更多样化的功能组合，使得代码更加灵活。

缺点：

1. **命名冲突**：如果不小心，在多个 Mixin 中使用相同的属性或方法名称可能导致命名冲突，使得代码变得难以理解和维护。
2. **组件依赖关系不明确**：过多使用 Mixin 可能导致组件间的依赖关系变得不明确，使得代码难以理解。
3. **难以追踪数据来源**：当一个组件使用了多个 Mixin，追踪数据的来源可能变得困难，从而增加了代码的复杂性。

<br />

### provide和inject的使用场景？

`provide` 和 `inject` 是 Vue 中用于父组件向子组件传递数据的高级组件通信方式。它们主要用于解决跨层级组件之间共享数据的问题，适用于特定的场景。

vue2中无法传递响应式数据，vue3中可以通过ref 和 reactive传递响应式数据。

`provide` 和 `inject` 的使用场景和作用如下：

1. **传递全局配置或状态**：
   - 在某些情况下，可能有一些全局的配置或状态，需要在多个嵌套层级的组件中访问。通过 `provide` 可以在父组件中提供这些数据，然后通过 `inject` 在子组件中访问这些数据，从而避免了在每个子组件中单独传递这些数据。
2. **透传数据**：
   - 有时候，某个组件（父组件）需要传递更深层级组件（孙子组件）的数据，而中间存在多层嵌套的组件。在这种情况下，使用 `provide` 和 `inject` 可以方便地透传数据，避免了在中间层级组件中额外传递数据。

<br />

### nextTick作用及原理？

`nextTick` 是 Vue 提供的一个异步方法，用于在 DOM 更新完成后执行回调函数。它的主要作用是确保在数据变化后，DOM 已经更新完毕，然后再执行某些操作。`nextTick` 在 Vue 2 和 Vue 3 中的作用和底层原理基本相同，但在实现细节上有所差异。

`nextTick` 的实现依赖于 JavaScript 的事件循环机制（Event Loop），特别是微任务（Microtask）和宏任务（Macrotask）的执行顺序。

在 Vue 2 中，`nextTick` 的实现基于以下策略：

1. **优先使用微任务**：
   - 如果环境支持 `Promise`，则使用 `Promise.then` 将回调推入微任务队列。
   - 如果不支持 `Promise`，则降级使用 `MutationObserver`（微任务）。
2. **降级使用宏任务**：
   - 如果微任务不可用，则降级使用 `setImmediate` 或 `setTimeout`（宏任务）。

在 Vue 3 中，`nextTick` 的实现更加简洁，直接使用 `Promise` 作为微任务的实现方式。

**工作流程**

1. **将回调推入队列**：
   - 每次调用 `nextTick`，都会将回调函数推入一个队列中。
2. **异步执行回调**：
   - 通过微任务或宏任务机制，确保回调函数在当前事件循环的所有同步任务执行完毕后执行。
3. **执行回调**：
   - 在 DOM 更新完成后，依次执行队列中的回调函数。

<br />

### 如何优雅的封装组件？

1. 自定义组件中，给组件库基础组件 `v-bind="props"` 绑定获取到的剔除特定属性之后的属性，然后添加处理事件等
2. 注意的是父组件的属性继承包含了事件继承，单根子组件可能会二次触发事件，需要取消默认继承属性 `inheritAttrs: false`
3. 然后可以在函数中调用 $attrs 中的属性和事件，也可以将剔除的属性作为响应式状态数据，在自定义组件中实现简化封装

<br>

### 如何实现全局页面loading组件？

1. 封装全局组件`loading.vue`

2. 封装插件逻辑：用到了Vue 的构造器extend，可以接受一个已有组件也可以自定义组件，返回一个实例。

   给实例创建容器，并挂载到body下面。

   ```js
   import Vue from 'vue'
   import loading from './index.vue'

   const $app = Vue.extend(loading)
   const $loading = new $app().$mount(document.createElement('div'))
   document.body.appendChild($loading.$el)

   export default {
     install(vm) {
       vm.prototype.$loading = {
         show: (params) => {
           Object.keys(params).forEach((key) => {
             $loading[key] = params[key]
           })
           $loading.visable = true
         },
         hide: () => {
           $loading.visable = false
         }
       }
     }
   }
   ```

3. 注册插件：Vue.use 接受一个含有install方法的对象或函数， 并将vue实例传入第一个参数。

## Vue3

### Vue2和Vue3的区别？

| 不同点                  | Vue2                                                                                                                                                                                          | Vue3                                                                                                                                                                                                                  |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 响应式系统的实现        | 1. 使用 Object.defineProperty 实现响应式。 <br />2. 只能拦截对象的属性读取和写入，无法直接监听属性的添加或删除。 <br />3. 对数组的响应式支持有限，需要重写数组的变异方法（如 push、pop 等）。 | 1. 使用 Proxy 实现响应式。 <br />2. 可以监听对象的属性添加、删除以及数组的索引变化。 <br />3. 性能更好，尤其是在处理大型对象或深层嵌套对象时。                                                                        |
| 性能优化                | 1. 在组件更新时，会递归地遍历整个虚拟 DOM 树，性能开销较大。 <br />2. 响应式系统的初始化较慢，尤其是在处理大型对象时。                                                                        | 1. 引入了 **静态树提升（Static Tree Hoisting）**，将静态节点提升到渲染函数外部，减少重复渲染。 <br />2. 使用 **Patch Flag** 标记动态节点，优化虚拟 DOM 的 diff 算法。 <br />3. 响应式系统的初始化更快，内存占用更少。 |
| Composition API         | 1. 使用 **Options API**，将逻辑分散在 `data`、`methods`、`computed` 等选项中。 <br />2. 在复杂组件中，逻辑复用和代码组织较为困难。                                                            | 1. 引入了 **Composition API**，通过 `setup` 函数组织逻辑。 <br />2. 支持逻辑复用（如自定义 Hook），代码组织更加灵活。 <br />3. 更适合大型项目或复杂组件。                                                             |
| 生命周期钩子            | 提供了 `beforeCreate`、`created`、`beforeMount`、`mounted`、`beforeUpdate`、`updated`、`beforeDestory`、`destroyed` 等生命周期钩子。                                                          | 1. 保留了 Vue 2 的生命周期钩子，但名称有所变化（如 `beforeDestroy` 改为 `beforeUnmount`，`destroyed`改为 `unmounted`）。 <br />2. Composition API 中提供了 `onMounted`、`onUpdated` 等新的生命周期钩子。              |
| 全局API                 | 全局 API（如 `Vue.component`、`Vue.directive`）直接挂载在 `Vue` 对象上。全局属性挂载在Vue.prototype上                                                                                         | 1. 全局 API 改为通过 `createApp` 创建的实例方法（如 `app.component`、`app.directive`），全局属性挂载在`app.config.globalProperties` 上。 <br />2. 支持 Tree Shaking，未使用的 API 不会被打包。                        |
| `v-model`               | `v-model` 只能绑定一个值，默认使用 `value` 和 `input` 事件                                                                                                                                    | 1. `v-model` 支持绑定多个值（如 `v-model:title`、`v-model:content`）<br />2. 默认使用 `modelValue` 和 `update:modelValue` 事件                                                                                        |
| `Suspense`              | 不支持异步组件的加载状态处理                                                                                                                                                                  | 引入了 **Suspense** 组件，可以更好地处理异步组件的加载状态                                                                                                                                                            |
| `Fragment` & `Teleport` | 1. 组件模板必须有一个根元素，不支持多根节点。 <br />2. 没有内置的 Portal（传送门）功能。                                                                                                      | 1. 支持 **Fragment**，组件模板可以有多个根节点。 <br />2. 引入了 **Teleport** 组件，可以将子组件渲染到 DOM 中的任意位置。                                                                                             |
| 自定义渲染器            | 自定义渲染器的支持较弱，难以实现非 DOM 环境的渲染（如小程序、Canvas）                                                                                                                         | 提供了更灵活的自定义渲染器 API，支持在非 DOM 环境中使用 Vue（如 Weex、小程序）                                                                                                                                        |
| 事件API                 | 使用 `$on`、`$off`、`$once` 来管理事件                                                                                                                                                        | 移除了 `$on`、`$off`、`$once`，推荐使用外部库（如 `mitt`）或 Composition API 实现事件管理                                                                                                                             |
| 插槽                    | 插槽内容的作用域是父组件                                                                                                                                                                      | 支持 **作用域插槽** 的简写语法，插槽内容的作用域可以更灵活                                                                                                                                                            |
| 打包体积                | 打包体积较大，尤其是包含所有特性时                                                                                                                                                            | 通过 Tree Shaking 和模块化设计，打包体积更小                                                                                                                                                                          |

<br />

### 组件实例原理？

- 每次在模板中使用组件时，都会创建一个新的组件实例。
- 组件实例是独立的，每个实例都有自己的状态和作用域。
- 组件实例的复用是 Vue 组件化开发的核心机制。

在 Vue 3 中，组件实例的创建过程更加模块化，使用了 `createComponentInstance` 函数。

1. **组件定义**：
   - 组件可以是一个普通对象（如 `{ setup, template }`）。
   - Vue 3 使用 `defineComponent` 或直接使用对象定义组件。
2. **实例化组件**：
   - 使用 `createComponentInstance` 函数创建组件实例。
   - 组件实例会初始化 `setup` 函数返回的状态和方法。
3. **挂载组件**：
   - 组件实例会被挂载到父组件或根实例中，生成对应的 DOM 节点。

<br />

### Vue3生命周期？

| 阶段     | Vue 2 钩子      | Vue 3 钩子      | Composition API 钩子 |
| :------- | :-------------- | :-------------- | :------------------- |
| 创建阶段 | `beforeCreate`  | `beforeCreate`  | 无直接对应           |
|          | `created`       | `created`       | 无直接对应           |
| 挂载阶段 | `beforeMount`   | `beforeMount`   | `onBeforeMount`      |
|          | `mounted`       | `mounted`       | `onMounted`          |
| 更新阶段 | `beforeUpdate`  | `beforeUpdate`  | `onBeforeUpdate`     |
|          | `updated`       | `updated`       | `onUpdated`          |
| 卸载阶段 | `beforeDestroy` | `beforeUnmount` | `onBeforeUnmount`    |
|          | `destroyed`     | `unmounted`     | `onUnmounted`        |

::: warning

- **`beforeCreate` 和 `created`**：
  - 在 Vue 3 的 Composition API 中，`setup` 函数在 `beforeCreate` 和 `created` 之间执行，因此可以在 `setup` 中替代这两个钩子的逻辑。
- **`beforeDestroy` 和 `destroyed`**：
  - Vue 3 将这两个钩子重命名为 `beforeUnmount` 和 `unmounted`，以更准确地反映其功能。
- **Composition API 钩子**：
  - Composition API 的钩子需要在 `setup` 函数中显式调用，且可以多次调用。

:::

<br />

### v-model原理？

`v-model` 既可以作用于表单元素，也可以作用于自定义组件，无论是哪种情况，都是一个语法糖，最终都会生成一个属性和一个事件。

当作用于表单元素时，vue会根据作用的表单元素的类型生成合适的属性和事件。

`v-model` 作用于自定义组件时，默认情况下，会生成一个 `value` 属性和 `input` 事件。可以通过组件的 `model` 配置来改变生成的属性和事件。

Vue 2 ： `v-model` 会将 `value` 属性和 `input` 事件进行双向绑定，从而实现了父子组件之间的数据双向通信。

Vue3：可以通过 `modelValue` 属性和 `update:modelValue` 事件来实现 `v-model` 的功能。自动将 `modelValue` 属性和 `update:modelValue` 事件与父组件的数据进行绑定。当子组件需要更新值时，会触发 `update:modelValue` 事件并将新的值传递给父组件，同时父组件的数据会更新。反过来，如果父组件的数据发生变化，子组件的 `modelValue` 属性也会随之更新，保持视图与数据的同步。

<br>

### 子组件v-model绑定的值修改后不更新是为什么？

通过语法糖实现emits之后，父组件的绑定值已经更新，但是子组件render渲染更新是放在微队列中异步实现，所以需要子组件中在 `nextTick` 之后才能获取到更新的 `v-model` 绑定值。

<br>

### 如何监听子组件的生命周期？

方法一：子组件中在对应的生命周期钩子函数中，通过 emits 抛出事件，父组件监听触发

方法二(推荐)：

1. 在vue2中，可以使用 `@hook:[生命周期钩子函数名称]="自定义函数"` 来实现。父组件通过自定义函数，在子组件对应钩子函数触发后执行，如 `<Child @hook:mounted="childMounted" />`
2. 在vue3中同样如此实现，换成 `<Child @vue:mounted="childMounted" />`

<br>

### vue3的静态树提升和Patch Flag是什么?

静态树提升：Vue 3 在编译阶段识别模板中的静态节点（即不会变化的节点），并将它们提升到渲染函数外部，避免在每次渲染时重新创建这些节点。

- 在编译模板时，Vue 3 会分析模板中的静态节点（如纯文本、静态的 HTML 标签等）。
- 将这些静态节点提取到渲染函数的外部，生成一个静态的虚拟 DOM 树。
- 在后续渲染中，直接复用这些静态节点，而不需要重新创建和比对。

Patch Flag 是 Vue 3 在编译阶段为动态节点添加的标记，用于指示节点的哪些部分是动态的（如属性、文本、子节点等）。在虚拟 DOM 的 diff 过程中，Vue 3 可以根据这些标记快速定位需要更新的部分，避免不必要的比对。

Vue 3 将静态树提升和 Patch Flag 结合起来，进一步优化渲染性能：

- **静态树提升**：减少静态节点的创建和比对。
- **Patch Flag**：优化动态节点的比对过程。

<br />

### 如何重置响应式ref数据？

```typescript
import { ref } from 'vue'

/**
 * 传递函数生成对象型
 */
export function useResetTableRefFn<T>(cb: () => T) {
  const state = ref(cb())
  const reset = () => {
    state.value = cb()
  }

  return { state, reset }
}

/**
 * 直接传递对象型
 */
export function useResetTableRef<T>(value: T) {
  const initialValue = deepClone(value)
  const state = ref(value)
  const reset = () => {
    state.value = deepClone(initialValue)
  }

  return { state, reset}
}
```

<br>

### 如何重置reactive数据？

```typescript
import { reactive } from 'vue'

export function useResetTableReactive<T extends object>(value: T, clone = defaultClone) {
  const state = reactive(clone(value)) as T
  const reset = () => {
    Object.keys(state).forEach(key => delete state[key])
    Object.assign(state, clone(value))
  }

  return { state, reset } as c
}
```

<br>

### proxy只会代理对象的第一层，vue3是如何实现深层代理的?

深层代理是通过 **递归代理** 实现的。Vue 3 使用 JavaScript 的 `Proxy` 对象来拦截对数据的操作（如读取、写入等），并通过递归的方式对嵌套对象进行代理，从而实现对深层属性的响应式处理。

- Vue 3 提供了 `reactive` 函数，用于将普通对象转换为响应式对象。`reactive` 内部会递归地对对象的所有属性进行代理。
- 为了避免重复代理，Vue 3 使用了一个 **WeakMap** 来缓存已经代理过的对象。如果对象已经被代理过，则直接返回缓存的代理对象，而不是重新创建。

<br />

### watch深度监听对象时无法获取oldValue是为什么？

因为对象的引用地址相同，并没有深拷贝一个新对象，所以是同一个对象

```typescript
/**
 * 封装实现
 */
import { watch, toValue, reactive } from 'vue'

function cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export const watchOldVAlue: (
	source: Parameters<typeof watch>[0],
  cb: Parameters<typeof watch>[1],
  options: Parameters<typeof watch>[2] & { clone?: <T>(obj: T) => T}
) => ReturnType<typeof watch> = (source, cb, options) => {
  const { clone = cloneDeep } = options
  const val = toValue(source)
  if (typeof val !== 'object' || val === null) {
    return watch(source, cb, options)
  }

  let oldValue = clone(val)
  return watch(source, (newValue, _) => {
    cb(newValue, reactive(oldValue))
    oldValue = cloneDeep(newValue)
  }, options)
}
```

<br>

### watchEffect不起作用是什么情况？

1. 里面做了条件判断，导致响应式依赖没有收集到，后续更新响应式就会失效
2. 响应式依赖收集在异步代码后，也会导致响应式依赖收集失败

<br>

### watch和watchEffect区别，flush配置项区别?

1. `watch` 是一个 API，用于监听特定的响应式数据（或 ref、reactive 对象）的变化，并在数据发生变化时执行回调函数。
2. `watchEffect` 是一个函数，它会自动追踪其中使用到的响应式数据，并在这些数据变化时立即执行回调函数。与 `watch` 不同的是，`watchEffect` 不需要显式地指定要监听的数据，它会自动捕获依赖。
3. **flush 配置项**： 在 `watch` 和 `watchEffect` 中都可以设置 `flush` 配置项，用于控制回调函数的调用时机。`flush` 可以取以下三个值：
   - `'pre'`：在依赖变化前立即执行回调函数，默认值。组件更新DOM前
   - `'post'`：在依赖变化后立即执行回调函数。组件更新DOM后
   - `'sync'`：在依赖变化前后都立即执行回调函数。

`watch` 和 `watchEffect` 都能响应式地执行有副作用的回调。它们之间的主要区别是追踪响应式依赖的方式：

- `watch` 只追踪明确侦听的数据源。它不会追踪任何在回调中访问到的东西。另外，仅在数据源确实改变时才会触发回调。`watch` 会避免在发生副作用时追踪依赖，因此，我们能更加精确地控制回调函数的触发时机。
- `watchEffect`，则会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式属性。这更方便，而且代码往往更简洁，但有时其响应性依赖关系会不那么明确。

<br />

### 如何暴露子组件的属性和方法？

可以通过 ref 获取组件DOM实例，然后通过proxy暴露整个DOM的属性和方法，就可以简化。

注意仅仅通过get拦截无法实现，vue内部做了in判断，需要通过has返回true

```typescript
const inputRef = ref()

defineExpose(
  new Proxy({}, {
    get(target, key) {
      return inputRef.value?.[key]
    },
    has(target, key) {
      return key in inputRef.value
    }
  })
)
```

<br>

### 全局注册组件封装

```js
// plugin.js

import Antd from 'ant-design-vue'
import Router from 'vue-router'
...

export function loadPlugins(app) {
  app.use(Antd)
  app.use(Router)
}
```

<br />

### 如何实现命令式弹框

```js
import { loadPlugins } from '@/plugins'
import { Modal } from 'ant-design-vue'
import { createApp, h } from 'vue'

export function renderDialog(component, props, modelProps) {
  const open = ref(false)
  let app = null; let el = null
  const instance = ref() // 获取component实例
  const isLoading = ref(false) // 按钮加载

  const dialog = () => h(
    Modal,
    {
      ...modalProps,
      open: open.value,
      onCancel() {
        unmount() // 或者使用组件库的afterClose方法
      },
      async onOk() {
        isLoading.value = true
        try {
          await instance.value?.submit?.()
          umount()
        }
        finally {
          isLoading.value = false
        }
      }
    },
    { default: () => h(component, { ref: instance, ...props }) }
  )

  app = createApp(dialog)
  loadPlugins(app)
  el = document.createElement('div')
  document.body.appendChild(el)
  app.mount(el)

  function ummount() {
    open.value = false
    setTimeout(() => {
      app?.unmount()
      document.body.removeChild(el)
      el = null
    }, 1000)
  }

  return unmount
}
```

<br />

### Vite插件实现图片预加载

```js
const images = [...]

export async function preloadImages(max = 3) {
  const _images = [...images]

  function loadImage() {
    const src = _images.shift()
    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
      link.onload = resolve
      link.onerror = reject
      setTimeout(reject, 10000) // 10s超时
    })
  }

  function _loadImage() {
    loadImage().finally(() => {
			if(_images.length) {
        _loadImage()
      }
    })
	}

  for (let i = 0; i < max; i++) {
    _loadImage()
  }
}
```

```js
// 封装成vite插件
import type { Plugin } from 'vite'
import fg from 'fast-glob'

interface PreloadImagesOptions {
  dir: string,
  attrs?: {
    rel: 'preload | prefetch'
  }
}
export const preloadImages = (options: PreloadImagesOptions): Plugin => {
  const { dir, attrs: { rel = 'prefetch' } = {} } = options // 设置默认加载方式为prefetch
  const assetsImages = []

  return {
    name: 'vite-plugin-image-prefetch',
    generateBundle(_, bundle) { // rollup钩子函数
      const values = Object.values(bundle)
      const files = fg.sync(dir)
      values.forEach(item => {
        if (file.includes(Reflect.get(item, 'originalFileName'))) {
          assetsImages.push(item.fileName)
        }
      })
    },
    transformIndexHtml(html, ctx) {
      let images = []
      if (ctx.server) {
        // 获取publicDir，只能加载public目录的资源
        // const files = fg.sync(dir, {
        //  	cwd: ctx.server?.config.publicDir
        // })
        // 获取指定目录的文件
        const files = fg.sync(dir)
        images = files.map(file => ctx.server?.config.base + file) // 手动拼接base路径
      } else {
        images = assetsImages
      }
      return images.map(href => {
        return {
          tag: 'link',
          attrs: {
           	rel,
          	href,
            as: 'image'
          }
        }
      })
    }
  }
}

// 使用
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { preloadImages } from './plugins/preloadImages'

export default defineConfig {
  plugins: [vue(), vueJsx(), preloadImages({
    dir: 'images/*.{jpg,png,svg,webp,bmp}'
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
}
```

<br />

## SSR

### 原理及流程？

Vue SSR（Server-Side Rendering，服务器端渲染）的原理是将 Vue 组件在服务器端渲染成 HTML 字符串，再发送到客户端。

**服务器端渲染流程**

1. **请求处理**：
   - 用户请求页面时，服务器接收到请求。
2. **创建 Vue 实例**：
   - 服务器根据路由匹配对应的 Vue 组件，并创建 Vue 实例。
3. **渲染 HTML**：
   - 使用 `vue-server-renderer` 将 Vue 实例渲染为 HTML 字符串。
4. **注入状态**：
   - 将 Vue 实例的状态（如 `data`）嵌入 HTML，以便客户端复用。
5. **返回 HTML**：
   - 将生成的 HTML 发送给客户端。

**客户端激活流程**

1. **接收 HTML**：
   - 客户端收到服务器渲染的 HTML 并展示。
2. **挂载 Vue 实例**：
   - Vue 在客户端重新创建实例，并复用服务器嵌入的状态。
3. **激活交互**：
   - Vue 接管 DOM，使其具备响应式功能。

**关键点**

- **同构代码**：同一套代码在服务器和客户端运行。
- **数据预取**：服务器在渲染前预取数据，确保页面内容完整。
- **状态同步**：服务器将状态嵌入 HTML，客户端复用，避免重复请求。

**优点：**

- **SEO 友好**：搜索引擎能直接抓取 HTML 内容。
- **更快首屏渲染**：用户立即看到完整页面，无需等待 JavaScript 加载。

**缺点：**

- **服务器压力**：每次请求都需渲染，增加服务器负担。
- **开发复杂度**：需处理服务器和客户端的差异。

<br />
