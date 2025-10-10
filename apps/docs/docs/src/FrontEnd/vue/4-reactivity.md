## 选项式API

### 声明响应式状态

选用选项式 API 时，会用 `data` 选项来声明组件的响应式状态。此选项的值应为返回一个对象的函数。`Vue` 将在创建新组件实例的时候调用此函数，并将函数返回的对象用响应式系统进行包装。此对象的所有顶层属性都会被代理到组件实例 (即方法和生命周期钩子中的 `this`) 上。

::: tip

这些实例上的属性仅在实例首次创建时被添加，因此你需要确保它们都出现在 `data` 函数返回的对象上。若所需的值还未准备好，在必要时也可以使用 `null`、`undefined` 或者其他一些值占位。

:::

::: warning

- 也可以不在 `data` 上定义，直接向组件实例添加新属性，但这个属性将无法触发响应式更新。

- `Vue` 在组件实例上暴露的内置 API 使用 `$` 作为前缀。它同时也为内部属性保留 `_` 前缀。因此，你应该避免在顶层 `data` 上使用任何以这些字符作前缀的属性。

:::

<br />

### 声明方法

`Vue` 自动为 `methods` 中的方法绑定了永远指向组件实例的 `this`。这确保了方法在作为事件监听器或回调函数时始终保持正确的 `this`。

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    // 在其他方法或是生命周期中也可以调用方法
    this.increment()
  }
}
```

::: warning

不应该在定义 `methods` 时使用箭头函数，因为箭头函数没有自己的 `this` 上下文。

:::

<br />

### 有状态方法

我们可能需要动态地创建一个方法函数，比如创建一个预置防抖的事件处理器：

```js
import { debounce } from 'lodash-es'
// 这种方法对重用的组件有问题
export default {
  methods: {
    // 使用 Lodash 的防抖函数
    click: debounce(() => {
      // ... 对点击的响应 ...
    }, 500)
  }
}
```

这种方法对于被重用的组件来说是有问题的，因为这个预置防抖的函数是 **有状态的**：它在运行时维护着一个内部状态。如果多个组件实例都共享这同一个预置防抖的函数，那么它们之间将会互相影响。

**_要保持每个组件实例的防抖函数都彼此独立，我们可以改为在 `created` 生命周期钩子中创建这个预置防抖的函数：_**

```js
import { debounce } from 'lodash-es'

export default {
  created() {
    // 每个实例都有了自己的预置防抖的处理函数
    this.debouncedClick = _.debounce(this.click, 500)
  },

  unmounted() {
    // 最好是在组件卸载时
    // 清除掉防抖计时器
    this.debouncedClick.cancel()
  },

  methods: {
    click() {
      // ... 对点击的响应 ...
    }
  }
}
```

<br />

## 组合式API

### 声明响应式状态

要在组件模板中使用响应式状态，需要在 `setup()` 函数中定义并返回。也可以在同一个作用域下定义一个更新响应式状态的函数，并作为一个方法与状态一起暴露出去。

```js
import { reactive } from 'vue'

export default {
  setup() {
    const state = reactive({ count: 0 })

    function increment() {
      state.count++
    }

    // 不要忘记同时暴露 increment 函数
    return {
      state,
      increment
    }
  }
}
```

<br />

### setup 语法糖

在 `setup()` 函数中手动暴露大量的状态和方法非常繁琐。可以通过使用构建工具来简化该操作。当使用单文件组件（SFC）时，我们可以使用 `<script setup>` 来大幅度地简化代码。

::: tip

`<script setup>`中的顶层的导入和变量声明可在同一组件的模板中直接使用。你可以理解为模板中的表达式和 `<script setup> `中的代码处在同一个作用域中。

:::

<br />

### reactive

1. `reactive()` 返回的是一个原始对象的 `Proxy`，它和原始对象是不相等的
2. 只有代理对象是响应式的，更改原始对象不会触发更新。因此，使用 Vue 的响应式系统的最佳实践是 **仅使用你声明对象的代理版本**
3. 为保证访问代理的一致性，对同一个原始对象调用 `reactive()` 会总是返回同样的代理对象，而对一个已存在的代理对象调用 `reactive()` 会返回其本身
4. 这个规则对嵌套对象也适用。依靠深层响应性，响应式对象内的嵌套对象依然是代理

::: danger 限制

1. 仅对对象类型有效（对象、数组和 `Map`、`Set` 这样的集合类型），而对 `string`、`number` 和 `boolean` 这样的 原始类型 无效。
2. 因为 `Vue` 的响应式系统是通过属性访问进行追踪的，因此我们必须始终保持对该响应式对象的相同引用。这意味着我们不可以随意地“替换”一个响应式对象，或是将响应式对象的属性赋值或解构至本地变量时，或是将该属性传入一个函数时，我们会失去响应性。

:::

```js
/**
 * 响应性丢失
 */
let state = reactive({ count: 0 })

// 1. 替换响应式对象
state = reactive({ count: 1 })

// 2. 响应式对象属性赋值至本地变量
// n 是一个局部变量，同 state.count失去响应性连接
let n = state.count
// 不影响原始的 state
n++

// 3. 响应式对象属性赋值解构赋值
// count 也和 state.count 失去了响应性连接
let { count } = state
// 不会影响原始的 state
count++

// 4. 响应式对象属性赋值传入函数参数
// 该函数接收一个普通数字，并且将无法跟踪 state.count 的变化
callSomeFunction(state.count)
```

<br />

### ref

1. `reactive()` 的种种限制归根结底是因为 JavaScript 没有可以作用于所有值类型的 “引用” 机制。为此，`Vue` 提供了一个 `ref()` 方法来允许我们创建可以使用任何值类型的响应式 **ref**。
2. `ref()` 将传入参数的值包装为一个带 `.value` 属性的 ref 对象。
3. 和响应式对象的属性类似，ref 的 `.value` 属性也是响应式的。同时，当值为对象类型时，会用 `reactive()` 自动转换它的 `.value`。

::: tip

1. 一个包含对象类型值的 ref 可以响应式地替换整个对象
2. ref 被传递给函数或是从一般对象上被解构时，不会丢失响应性

:::

```js
const objectRef = ref({ count: 0 })

// 这是响应式的替换
objectRef.value = { count: 1 }

const obj = {
  foo: ref(1),
  bar: ref(2)
}

// 该函数接收一个 ref
// 需要通过 .value 取值
// 但它会保持响应性
callSomeFunction(obj.foo)

// 仍然是响应式的
const { foo, bar } = obj
```

::: tip

简言之，`ref()` 让我们能创造一种对任意值的 “引用”，并能够在不丢失响应性的前提下传递这些引用。

:::

<br />

#### ref 在模板中的解包

- 当 ref 在模板中作为顶层属性被访问时，它们会被自动“解包”，所以不需要使用 `.value`。

::: warning

1. 仅当 ref 是模板渲染上下文的顶层属性时才适用自动“解包”。

2. 如果一个 ref 是文本插值计算的最终值，它也将被解包。如果是文本插值的表达式，渲染的结果会是一个 `[object Object]1`，因为 `object.foo` 是一个 ref 对象。

   ```vue
   {{ object.foo }}
   ```

:::

<br />

#### ref 在响应式对象中的解包

- 当一个 `ref` 被嵌套在一个响应式对象中，作为属性被访问或更改时，它会自动解包，因此会表现得和一般的属性一样。
- 如果将一个新的 ref 赋值给一个关联了已有 ref 的属性，那么它会替换掉旧的 ref
- 只有当嵌套在一个深层响应式对象内时，才会发生 ref 解包。当其作为浅层响应式对象的属性被访问时不会解包。
- 跟响应式对象不同，当 ref 作为响应式数组或像 `Map` 这种原生集合类型的元素被访问时，不会进行解包。

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0
state.count = 1
console.log(count.value) // 1

const otherCount = ref(2)
state.count = otherCount
console.log(state.count) // 2
// 原始 ref 现在已经和 state.count 失去联系
console.log(count.value) // 1

const books = reactive([ref('Vue 3 Guide')])
// 这里需要 .value
console.log(books[0].value)
const map = reactive(new Map([['count', ref(0)]]))
// 这里需要 .value
console.log(map.get('count').value)
```

<br />

## 相同处

### DOM更新时机

当你更改响应式状态后，DOM 会自动更新。然而，你得注意 DOM 的更新并不是同步的。相反，Vue 将缓冲它们直到更新周期的 “下个时机” 以确保无论你进行了多少次状态更改，每个组件都只更新一次。

若要等待一个状态改变后的 DOM 更新完成，你可以使用 [nextTick()](https://cn.vuejs.org/api/general.html#nexttick) 这个全局 API：

```js
import { nextTick } from 'vue'

function increment() {
  state.count++
  nextTick(() => {
    // 访问更新后的 DOM
  })
}
```

<br />

### 深层响应性

在 Vue 中，状态都是默认深层响应式的。这意味着即使在更改深层次的对象或数组，你的改动也能被检测到。

```js
import { reactive } from 'vue'

const obj = reactive({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // 以下都会按照期望工作
  obj.nested.count++
  obj.arr.push('baz')
}
```

::: tip

你也可以直接创建一个[浅层响应式对象](https://cn.vuejs.org/api/reactivity-advanced.html#shallowreactive)。它们仅在顶层具有响应性，一般仅在某些特殊场景中需要。

:::

<br />
