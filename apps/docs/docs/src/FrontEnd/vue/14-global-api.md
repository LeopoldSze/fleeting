## 应用实例

### createApp()

创建一个应用实例。第一个参数是根组件。第二个参数可选，它是要传递给根组件的 props。

```js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
```

<br />

### app.mount()

将应用实例挂载在一个容器元素中。

参数可以是一个实际的 DOM 元素或一个 `CSS` 选择器 (使用第一个匹配到的元素)。返回根组件的实例。

如果该组件有模板或定义了渲染函数，它将替换容器内所有现存的 DOM 节点。否则在运行时编译器可用的情况下，容器元素的 `innerHTML` 将被用作模板。

在 SSR 激活模式下，它将激活容器内现有的 DOM 节点。如果出现了激活不匹配，那么现有的 DOM 节点将会被修改以匹配客户端的实际渲染结果。

对于每个应用实例，`mount()` 仅能调用一次。

```js
import { createApp } from 'vue'
const app = createApp(/* ... */)

app.mount('#app')

// 挂载到实际的DOM
app.mount(document.body.firstChild)
```

<br />

### app.unmount()

卸载一个已挂载的应用实例。卸载一个应用会触发该应用组件树内所有组件的卸载生命周期钩子。

<br />

### app.provide()

提供一个值，可以在应用中的所有后代组件中注入使用。

第一个参数应当是注入的 key，第二个参数则是提供的值。返回应用实例本身。

```js
import { createApp, inject } from 'vue'

const app = createApp(/* ... */)

app.provide('message', 'hello')

export default {
  setup() {
    console.log(inject('message')) // 'hello'
  }
}
```

<br />

### app.component()

如果同时传递一个组件名字符串及其定义，则注册一个全局组件；如果只传递一个名字，则会返回用该名字注册组件 (如果存在的话)。

```js
import { createApp } from 'vue'

const app = createApp({})

// 注册一个选项对象
app.component('my-component', {
  /* ... */
})

// 得到一个已注册的组件
const MyComponent = app.component('my-component')
```

<br />

### app.directive()

如果同时传递一个名字和一个指令定义，则注册一个全局指令；如果只传递一个名字，则会返回用该名字注册的指令 (如果存在的话)。

```js
import { createApp } from 'vue'

const app = createApp({
  /* ... */
})

// 注册（对象形式的指令）
app.directive('my-directive', {
  /* 自定义指令钩子 */
})

// 注册（函数形式的指令）
app.directive('my-directive', () => {
  /* ... */
})

// 得到一个已注册的指令
const myDirective = app.directive('my-directive')
```

<br />

### app.use()

安装插件。

第一个参数应是插件本身，可选的第二个参数是要传递给插件的选项。

插件可以是一个带 `install()` 方法的对象，亦或直接是一个将被用作 `install()` 方法的函数。插件选项 (`app.use()` 的第二个参数) 将会传递给插件的 `install()` 方法。

若 `app.use()` 对同一个插件多次调用，该插件只会被安装一次。

```js
import { createApp } from 'vue'
import MyPlugin from './plugins/MyPlugin'

const app = createApp({
  /* ... */
})

app.use(MyPlugin)
```

<br />

### app.version

提供当前应用所使用的 `Vue` 版本号。这在插件中很有用，因为可能需要根据不同的 `Vue` 版本执行不同的逻辑。

```js
// 在一个插件中对版本作判断
export default {
  install(app) {
    const version = Number(app.version.split('.')[0])
    if (version < 3) {
      console.warn('This plugin requires Vue 3')
    }
  }
}
```

<br />

### app.config

每个应用实例都会暴露一个 `config` 对象，其中包含了对这个应用的配置设定。你可以在挂载应用前更改这些属性。

```js
import { createApp } from 'vue'

const app = createApp(/* ... */)

console.log(app.config)
```

<br />

### app.config.errorHandler

用于为应用内抛出的未捕获错误指定一个全局处理函数。

错误处理器接收三个参数：错误对象、触发该错误的组件实例和一个指出错误来源类型信息的字符串。

它可以从下面这些来源中捕获错误：

- 组件渲染器
- 事件处理器
- 生命周期钩子
- `setup()` 函数
- 侦听器
- 自定义指令钩子
- 过渡 (Transition) 钩子

```js
app.config.errorHandler = (err, instance, info) => {
  // 处理错误，例如：报告给一个服务
}
```

<br />

### app.config.warnHandler

用于为 `Vue` 的运行时警告指定一个自定义处理函数。

警告处理器将接受警告信息作为其第一个参数，来源组件实例为第二个参数，以及组件追踪字符串作为第三个参数。

这可以用户过滤筛选特定的警告信息，降低控制台输出的冗余。所有的 `Vue` 警告都需要在开发阶段得到解决，因此仅建议在调试期间选取部分特定警告，并且应该在调试完成之后立刻移除。

```js
app.config.warnHandler = (msg, instance, trace) => {
  // `trace` is the component hierarchy trace
}
```

::: warning

警告仅会在开发阶段显示，因此在生产环境中，这条配置将被忽略。

:::

<br />

### app.config.performance

设置此项为 `true` 可以在浏览器开发工具的“性能/时间线”页中启用对组件初始化、编译、渲染和修补的性能表现追踪。仅在开发模式和支持 [performance.mark](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark) `API` 的浏览器中工作。

<br />

### app.config.globalProperties

这是对 `Vue 2` 中 `Vue.prototype` 使用方式的一种替代，此写法在 `Vue 3` 已经不存在了。与任何全局的东西一样，应该谨慎使用。

如果全局属性与组件自己的属性冲突，组件自己的属性将具有更高的优先级。

```js
app.config.globalProperties.msg = 'hello'

export default {
  mounted() {
    console.log(this.msg) // 'hello'
  }
}
```

这使得 `msg` 在应用的任意组件模板上都可用，并且也可以通过任意组件实例的 `this` 访问到。

<br />

### app.config.optionMergeStrategies

一个用于定义自定义组件选项的合并策略的对象。

一些插件或库对自定义组件选项添加了支持 (通过注入全局 mixin)。这些选项在有多个不同来源时可能需要特殊的合并策略 (例如 mixin 或组件继承)。

可以在 `app.config.optionMergeStrategies` 对象上以选项的名称作为 key，可以为一个自定义选项注册分配一个合并策略函数。

合并策略函数分别接受在父实例和子实例上定义的该选项的值作为第一和第二个参数。

```js
const app = createApp({
  // option from self
  msg: 'Vue',
  // option from a mixin
  mixins: [
    {
      msg: 'Hello '
    }
  ],
  mounted() {
    // 在 this.$options 上暴露被合并的选项
    console.log(this.$options.msg)
  }
})

// 为  `msg` 定义一个合并策略函数
app.config.optionMergeStrategies.msg = (parent, child) => {
  return (parent || '') + (child || '')
}

app.mount('#app')
// 打印 'Hello Vue'
```

<br />

## 通用

### version

暴露当前所使用的 `Vue` 版本。

```js
import { version } from 'vue'

console.log(version)
```

<br />

### nextTick()

等待下一次 DOM 更新刷新的工具方法。

当你在 `Vue` 中更改响应式状态时，最终的 DOM 更新并不是同步生效的，而是由 `Vue` 将它们缓存在一个队列中，直到下一个“tick”才一起执行。这样是为了确保每个组件无论发生多少状态改变，都仅执行一次更新。

`nextTick()` 可以在状态改变后立即使用，以等待 DOM 更新完成。你可以传递一个回调函数作为参数，或者 await 返回的 Promise。

```vue
<script setup>
import { nextTick, ref } from 'vue'

const count = ref(0)

async function increment() {
  count.value++

  // DOM 还未更新
  console.log(document.getElementById('counter').textContent) // 0

  await nextTick()
  // DOM 此时已经更新
  console.log(document.getElementById('counter').textContent) // 1
}
</script>

<template>
  <button id="counter" @click="increment">
    {{ count }}
  </button>
</template>
```

<br />

### defineCustomElement()

这个方法和 `defineComponent` 接受的参数相同，不同的是会返回一个原生[自定义元素](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)类的构造器。

除了常规的组件选项，`defineCustomElement()` 还支持一个特别的选项 `styles`，它应该是一个内联 CSS 字符串的数组，所提供的 CSS 会被注入到该元素的 shadow root 上。

返回值是一个可以通过 [`customElements.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) 注册的自定义元素构造器。

```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  /* 组件选项 */
})

// 注册自定义元素
customElements.define('my-vue-element', MyVueElement)
```

<br />

## 组合式API

### setup()

`setup()` 钩子是在组件中使用组合式 `API` 的入口，通常只在以下情况下使用：

1. 需要在非单文件组件中使用组合式 `API` 时。
2. 需要在基于选项式 `API` 的组件中集成基于组合式 `API` 的代码时。

在 `setup()` 函数中返回的对象会暴露给模板和组件实例。其它的选项也可以通过组件实例来获取 `setup()` 暴露的属性。

```vue
<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    // 返回值会暴露给模板和其他的选项式 API 钩子
    return {
      count
    }
  },

  mounted() {
    console.log(this.count) // 0
  }
}
</script>

<template>
  <button @click="count++">
    {{ count }}
  </button>
</template>
```

在模板中访问从 `setup` 返回的 ref 时，它会[自动浅层解包](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html#deep-reactivity)，因此你无须再在模板中为它写 `.value`。当通过 `this` 访问时也会同样如此解包。

`setup()` 自身并不含对组件实例的访问权，即在 `setup()` 中访问 `this` 会是 `undefined`。你可以在选项式 API 中访问组合式 API 暴露的值，但反过来则不行。

`setup()` 应该*同步地*返回一个对象。唯一可以使用 `async setup()` 的情况是，该组件是 [Suspense](https://cn.vuejs.org/guide/built-ins/suspense.html) 组件的后裔。

<br />

#### 访问Props

`setup` 函数的第一个参数是组件的 `props`。和标准的组件一致，一个 `setup` 函数的 `props` 是响应式的，并且会在传入新的 props 时同步更新。

请注意如果你解构了 `props` 对象，解构出的变量将会丢失响应性。因此我们推荐通过 `props.xxx` 的形式来使用其中的 props。

如果你确实需要解构 `props` 对象，或者需要将某个 prop 传到一个外部函数中并保持响应性，那么你可以使用 `toRefs()` 和 `toRef()` 这两个工具函数：

```js
import { toRefs, toRef } from 'vue'

export default {
  setup(props) {
    // 将 `props` 转为一个其中全是 ref 的对象，然后解构
    const { title } = toRefs(props)
    // `title` 是一个追踪着 `props.title` 的 ref
    console.log(title.value)

    // 或者，将 `props` 的单个属性转为一个 ref
    const title = toRef(props, 'title')
  }
}
```

<br />

#### setup 上下文

传入 `setup` 函数的第二个参数是一个 **Setup 上下文**对象。上下文对象暴露了其他一些在 `setup` 中可能会用到的值，该上下文对象是非响应式的，可以安全地解构：

```js
export default {
  setup(props, { attrs, slots, emit, expose }) {
    ...
  }
}
```

`attrs` 和 `slots` 都是有状态的对象，它们总是会随着组件自身的更新而更新。这意味着你应当避免解构它们，并始终通过 `attrs.x` 或 `slots.x` 的形式使用其中的属性。此外还需注意，和 `props` 不同，`attrs` 和 `slots` 的属性都**不是**响应式的。如果你想要基于 `attrs` 或 `slots` 的改变来执行副作用，那么你应该在 `onBeforeUpdate` 生命周期钩子中编写相关逻辑。

<br />

#### 暴露公共属性

`expose` 函数用于显式地限制该组件暴露出的属性，当父组件通过模板引用访问该组件的实例时，将仅能访问 `expose` 函数暴露出的内容：

```js
export default {
  setup(props, { expose }) {
    // 让组件实例处于 “关闭状态”
    // 即不向父组件暴露任何东西
    expose()

    const publicCount = ref(0)
    const privateCount = ref(0)
    // 有选择地暴露局部状态
    expose({ count: publicCount })
  }
}
```

<br />

#### 搭配渲染函数使用

`setup` 也可以返回一个[渲染函数](https://cn.vuejs.org/guide/extras/render-function.html)，此时在渲染函数中可以直接使用在同一作用域下声明的响应式状态：

返回一个渲染函数将会阻止我们返回其他东西。对于组件内部来说，这样没有问题，但如果我们想通过模板引用将这个组件的方法暴露给父组件，那就有问题了。

我们可以通过调用 `expose()` 解决这个问题：

```js
import { h, ref } from 'vue'

export default {
  setup(props, { expose }) {
    const count = ref(0)
    const increment = () => ++count.value

    expose({
      increment
    })

    return () => h('div', count.value)
  }
}
```

此时父组件可以通过模板引用来访问这个 `increment` 方法。

<br />

### 响应式

<br />

#### ref()

ref 对象是可更改的，也就是说你可以为 `.value` 赋予新的值。它也是响应式的，即所有对 `.value` 的操作都将被追踪，并且写操作会触发与之相关的副作用。

如果将一个对象赋值给 ref，那么这个对象将通过 reactive() 转为具有深层次响应式的对象。这也意味着如果对象中包含了嵌套的 ref，它们将被深层地解包。

若要避免这种深层次的转换，请使用 `shallowRef()` 来替代。

<br />

#### computed()

接受一个 getter 函数，返回一个只读的响应式 ref 对象。该 ref 通过 `.value` 暴露 getter 函数的返回值。它也可以接受一个带有 `get` 和 `set` 函数的对象来创建一个可写的 ref 对象。

<br />

#### reactive()

响应式转换是“深层”的：它会影响到所有嵌套的属性。一个响应式对象也将深层地解包任何 ref 属性，同时保持响应性。

值得注意的是，当访问到某个响应式数组或 `Map` 这样的原生集合类型中的 ref 元素时，不会执行 ref 的解包。

若要避免深层响应式转换，只想保留对这个对象顶层次访问的响应性，请使用 shallowReactive() 作替代。

返回的对象以及其中嵌套的对象都会通过 [ES Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 包裹，因此**不等于**源对象，建议只使用响应式代理，避免使用原始对象。

ref 的解包：

```js
const count = ref(1)
const obj = reactive({ count })

// ref 会被解包
console.log(obj.count === count.value) // true

// 会更新 `obj.count`
count.value++
console.log(count.value) // 2
console.log(obj.count) // 2

// 也会更新 `count` ref
obj.count++
console.log(obj.count) // 3
console.log(count.value) // 3
```

注意当访问到某个响应式数组或 `Map` 这样的原生集合类型中的 ref 元素时，**不会**执行 ref 的解包：

```js
const books = reactive([ref('Vue 3 Guide')])
// 这里需要 .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// 这里需要 .value
console.log(map.get('count').value)
```

将一个 ref 赋值给为一个 `reactive` 属性时，该 ref 会被自动解包：

```js
const count = ref(1)
const obj = reactive({})

obj.count = count

console.log(obj.count) // 1
console.log(obj.count === count.value) // true
```

<br />

#### readonly()

接受一个对象 (不论是响应式还是普通的) 或是一个 ref，返回一个原值的只读代理。

只读代理是深层的：对任何嵌套属性的访问都将是只读的。它的 ref 解包行为与 `reactive()` 相同，但解包得到的值是只读的。

要避免深层级的转换行为，请使用 shallowReadonly() 作替代。

```js
const original = reactive({ count: 0 })

const copy = readonly(original)

watchEffect(() => {
  // 用来做响应性追踪
  console.log(copy.count)
})

// 更改源属性会触发其依赖的侦听器
original.count++

// 更改该只读副本将会失败，并会得到一个警告
copy.count++ // warning!
```

<br />

#### watchEffect()

立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行。

第一个参数就是要运行的副作用函数。这个副作用函数的参数也是一个函数，用来注册清理回调。清理回调会在该副作用下一次执行前被调用，可以用来清理无效的副作用，例如等待中的异步请求 (参见下面的示例)。

第二个参数是一个可选的选项，可以用来调整副作用的刷新时机或调试副作用的依赖。

默认情况下，侦听器将在组件渲染之前执行。设置 `flush: 'post'` 将会使侦听器延迟到组件渲染之后再执行。详见回调的触发时机。在某些特殊情况下 (例如要使缓存失效)，可能有必要在响应式依赖发生改变时立即触发侦听器。这可以通过设置 `flush: 'sync'` 来实现。然而，该设置应谨慎使用，因为如果有多个属性同时更新，这将导致一些性能和数据一致性的问题。

返回值是一个用来停止该副作用的函数。

```js
// 副作用清除
watchEffect(async (onCleanup) => {
  const { response, cancel } = doAsyncWork(id.value)
  // `cancel` 会在 `id` 更改时调用
  // 以便取消之前
  // 未完成的请求
  onCleanup(cancel)
  data.value = await response
})

// 停止侦听器
const stop = watchEffect(() => {})
// 当不再需要此侦听器时:
stop()

// 选项
watchEffect(() => {}, {
  flush: 'post',
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})
```

`watchPostEffect()`：`watchEffect()` 使用 `flush: 'post'` 选项时的别名。

`watchSyncEffect()`：`watchEffect()` 使用 `flush: 'sync'` 选项时的别名。

<br />

#### watch()

`watch()` 默认是懒侦听的，即仅在侦听源发生变化时才执行回调函数。

第一个参数是侦听器的**源**。这个来源可以是以下几种：

- 一个函数，返回一个值
- 一个 ref
- 一个响应式对象
- ...或是由以上类型的值组成的数组

第二个参数是在发生变化时要调用的回调函数。这个回调函数接受三个参数：新值、旧值，以及一个用于注册副作用清理的回调函数。该回调函数会在副作用下一次重新执行前调用，可以用来清除无效的副作用，例如等待中的异步请求。

当侦听多个来源时，回调函数接受两个数组，分别对应来源数组中的新值和旧值。

当直接侦听一个响应式对象时，侦听器会自动启用深层模式。

第三个可选的参数是一个对象，支持以下这些选项：

- **`immediate`**：在侦听器创建时立即触发回调。第一次调用时旧值是 `undefined`。
- **`deep`**：如果源是对象，强制深度遍历，以便在深层级变更时触发回调。参考深层侦听器。
- **`flush`**：调整回调函数的刷新时机。参考回调的刷新时机及 `watchEffect()`。
- **`onTrack / onTrigger`**：调试侦听器的依赖。参考调试侦听器。

`watch()` 和 `watchEffect()` 享有相同的刷新时机和调试选项。

与 `watchEffect()` 相比，`watch()` 使我们可以：

- 懒执行副作用；
- 更加明确是应该由哪个状态触发侦听器重新执行；
- 可以访问所侦听状态的前一个值和当前值。

<br />

#### isRef()

检查某个值是否为 ref。

<br />

#### unref()

如果参数是 ref，则返回内部值，否则返回参数本身。这是 `val = isRef(val) ? val.value : val` 计算的一个语法糖。

<br />

#### toRef()

基于响应式对象上的一个属性，创建一个对应的 ref。这样创建的 ref 与其源属性保持同步：改变源属性的值将更新 ref 的值，反之亦然。

```js
const state = reactive({
  foo: 1,
  bar: 2
})

const fooRef = toRef(state, 'foo')

// 更改该 ref 会更新源属性
fooRef.value++
console.log(state.foo) // 2

// 更改源属性也会更新该 ref
state.foo++
console.log(fooRef.value) // 3
```

当 `toRef` 与组件 props 结合使用时，关于禁止对 props 做出更改的限制依然有效。尝试将新的值传递给 ref 等效于尝试直接更改 props，这是不允许的。在这种场景下，你可能可以考虑使用带有 `get` 和 `set` 的 `computed` 替代。

即使源属性当前不存在，`toRef()` 也会返回一个可用的 ref。这让它在处理可选 props 的时候格外实用，相比之下 `toRefs` 就不会为可选 props 创建对应的 refs。

<br />

#### toRefs()

将一个响应式对象转换为一个普通对象，这个普通对象的每个属性都是指向源对象相应属性的 ref。每个单独的 ref 都是使用 `toRef()` 创建的。

```js
const state = reactive({
  foo: 1,
  bar: 2
})

const stateAsRefs = toRefs(state)
/*
stateAsRefs 的类型：{
  foo: Ref<number>,
  bar: Ref<number>
}
*/

// 这个 ref 和源属性已经“链接上了”
state.foo++
console.log(stateAsRefs.foo.value) // 2

stateAsRefs.foo.value++
console.log(state.foo) // 3
```

当从组合式函数中返回响应式对象时，`toRefs` 相当有用。使用它，消费者组件可以解构/展开返回的对象而不会失去响应性。

`toRefs` 在调用时只会为源对象上可以枚举的属性创建 ref。如果要为可能还不存在的属性创建 ref，请改用 `toRef`。

<br />

#### isProxy()

检查一个对象是否是由 `reactive()`、`readonly()`、`shallowReactive()` 或 `shallowReadonly()` 创建的代理。

<br />

#### isReactive()

检查一个对象是否是由 `reactive()` 或 `shallowReactive()` 创建的代理。

<br />

#### isReadonly()

检查传入的值是否为只读对象。只读对象的属性可以更改，但他们不能通过传入的对象直接赋值。

通过 `readonly()` 和 `shallowReadonly()` 创建的代理都是只读的，因为他们是没有 `set` 函数的 `computed()` ref。

<br />

#### shallowRef()

和 `ref()` 不同，浅层 ref 的内部值将会原样存储和暴露，并且不会被深层递归地转为响应式。只有对 `.value` 的访问是响应式的。

`shallowRef()` 常常用于对大型数据结构的性能优化或是与外部的状态管理系统集成。

```js
const state = shallowRef({ count: 1 })

// 不会触发更改
state.value.count = 2

// 会触发更改
state.value = { count: 2 }
```

<br />

#### triggerRef()

强制触发依赖于一个浅层 ref 的副作用，这通常在对浅引用的内部值进行深度变更后使用。

```js
const shallow = shallowRef({
  greet: 'Hello, world'
})

// 触发该副作用第一次应该会打印 "Hello, world"
watchEffect(() => {
  console.log(shallow.value.greet)
})

// 这次变更不应触发副作用，因为这个 ref 是浅层的
shallow.value.greet = 'Hello, universe'

// 打印 "Hello, universe"
triggerRef(shallow)
```

<br />

#### customRef()

创建一个自定义的 ref，显式声明对其依赖追踪和更新触发的控制方式。

`customRef()` 预期接收一个工厂函数作为参数，这个工厂函数接受 `track` 和 `trigger` 两个函数作为参数，并返回一个带有 `get` 和 `set` 方法的对象。

一般来说，`track()` 应该在 `get()` 方法中调用，而 `trigger()` 应该在 `set()` 中调用。然而事实上，你对何时调用、是否应该调用他们有完全的控制权。

创建一个防抖 ref，即只在最近一次 set 调用后的一段固定间隔后再调用：

```js
import { customRef } from 'vue'

export function useDebouncedRef(value, delay = 200) {
  let timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}
```

```vue
<script setup>
import { useDebouncedRef } from './debouncedRef'
const text = useDebouncedRef('hello')
</script>

<template>
  <input v-model="text">
</template>
```

<br />

#### shallowReactive()

和 `reactive()` 不同，这里没有深层级的转换：一个浅层响应式对象里只有根级别的属性是响应式的。属性的值会被原样存储和暴露，这也意味着值为 ref 的属性**不会**被自动解包了。

::: warning

浅层数据结构应该只用于组件中的根级状态。请避免将其嵌套在深层次的响应式对象中，因为它创建的树具有不一致的响应行为，这可能很难理解和调试。

:::

<br />

#### shallowReadonly()

和 `readonly()` 不同，这里没有深层级的转换：只有根层级的属性变为了只读。属性的值都会被原样存储和暴露，这也意味着值为 ref 的属性**不会**被自动解包了。

```js
const state = shallowReadonly({
  foo: 1,
  nested: {
    bar: 2
  }
})

// 更改状态自身的属性会失败
state.foo++

// ...但可以更改下层嵌套对象
isReadonly(state.nested) // false

// 这是可以通过的
state.nested.bar++
```

<br />

#### toRaw()

根据一个 `Vue` 创建的代理返回其原始对象。

`toRaw()` 可以返回由 `reactive()`、`readonly()`、`shallowReactive()` 或者 `shallowReadonly()` 创建的代理对应的原始对象。

这是一个可以用于临时读取而不引起代理访问/跟踪开销，或是写入而不触发更改的特殊方法。不建议保存对原始对象的持久引用，请谨慎使用。

```js
const foo = {}
const reactiveFoo = reactive(foo)

console.log(toRaw(reactiveFoo) === foo) // true
```

<br />

#### markRaw()

将一个对象标记为不可被转为代理。返回该对象本身。

```js
const foo = markRaw({})
console.log(isReactive(reactive(foo))) // false

// 也适用于嵌套在其他响应性对象
const bar = reactive({ foo })
console.log(isReactive(bar.foo)) // false
```

<br />
