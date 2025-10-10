## 条件渲染

### v-if

- `v-if` 指令用于条件性地渲染一块内容。这块内容只会在指令的表达式返回真值时才被渲染
- 可以使用 `v-else` 为 `v-if` 添加一个“else 区块”
- 一个 `v-else` 元素必须跟在一个 `v-if` 或者 `v-else-if` 元素后面，否则它将不会被识别
- `v-else-if` 提供的是相应于 `v-if` 的“else if 区块”。它可以连续多次重复使用
- 使用 `v-else-if` 的元素必须紧跟在一个 `v-if` 或一个 `v-else-if` 元素后面
- 在 `<template>` 上使用来切换多个元素，`v-else` 和 `v-else-if` 也可以在 `<template>` 上使用

```vue
<div v-if="type === 'A'">
  A
</div>

<div v-else-if="type === 'B'">
  B
</div>

<div v-else-if="type === 'C'">
  C
</div>

<div v-else>
  Not A/B/C
</div>
```

<br />

### v-show

- 不同之处在于 `v-show` 会在 DOM 渲染中保留该元素；`v-show` 仅切换了该元素上名为 `display` 的 CSS 属性。

- `v-show` 不支持在 `<template>` 元素上使用，也不能和 `v-else` 搭配使用。

::: warning v-if 和 v-show

`v-if` 是“真实的”按条件渲染，因为它确保了在切换时，条件区块内的事件监听器和子组件都会被销毁与重建。

`v-if` 有更高的切换开销，而 `v-show` 有更高的初始渲染开销。因此，如果需要频繁切换，则使用 `v-show` 较好；如果在运行时绑定条件很少改变，则 `v-if` 会更合适。

:::

<br />

### v-if 和 v-for

::: warning

同时使用 `v-if` 和 `v-for` 是**不推荐的**，因为这样二者的优先级不明显。

当 `v-if` 和 `v-for` 同时存在于一个元素上的时候，`v-if` 会首先被执行。这意味着 `v-if` 的条件将无法访问到 `v-for` 作用域内定义的变量别名。

:::

<br />

## 列表渲染

### 渲染数组

可以使用 `v-for` 指令基于一个数组来渲染一个列表：

- `v-for` 指令的值需要使用 `item in items` 形式的特殊语法，其中 `items` 是源数据的数组，而 `item` 是迭代项的**别名**，支持变量别名结构。
- 在 `v-for` 块中可以完整地访问父作用域内的属性和变量。`v-for` 也支持使用可选的第二个参数表示当前项的位置索引。
- 对于多层嵌套的 `v-for`，作用域的工作方式和函数的作用域很类似。每个 `v-for` 作用域都可以访问到父级作用域
- 也可以使用 `of` 作为分隔符来替代 `in`，这更接近 JavaScript 的迭代器语法
- 可以在 `<template>` 标签上使用 `v-for` 来渲染一个包含多个元素的块。

```vue
<li v-for="item in items">
  <span v-for="childItem in item.children">
    {{ item.message }} {{ childItem }}
  </span>
</li>

<ul>
  <template v-for="item of items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

<br />

### 渲染对象

可以使用 `v-for` 来遍历一个对象的所有属性。遍历的顺序会基于对该对象调用 `Object.keys()` 的返回值来决定。

```vue
<!-- 第一个参数表示属性值，第二个参数表示属性名，第三个参数表示位置索引 -->
<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>
```

<br />

### 渲染范围值

`v-for` 可以直接接受一个整数值。在这种用例中，会将该模板基于 `1...n` 的取值范围重复多次。

```vue
<span v-for="n in 10">
{{ n }}
</span>
```

::: warning

此处 `n` 的初值是从 `1` 开始而非 `0`

:::

<br />

### key 值管理状态

为了以便 `Vue`可以跟踪每个节点的标识，从而重用和重新排序现有的元素，你需要为每个元素对应的块提供一个唯一的 `key` attribute。

`key` 绑定的值期望是一个基础类型的值，例如字符串或 number 类型。不要用对象作为 `v-for` 的 key。

```vue
<div v-for="item in items" :key="item.id">
  <!-- 内容 -->
</div>
```

<br />

### 组件上使用v-for

可以直接在组件上使用 `v-for`，和在一般的元素上使用没有区别 (别忘记提供一个 `key`)：

```vue
<MyComponent v-for="item in items" :key="item.id" />
```

::: warning

这不会自动将任何数据传递给组件，因为组件有自己独立的作用域。为了将迭代后的数据传递到组件中，我们还需要传递 props

:::

<br />

### 数组变化侦测

`Vue` 能够侦听响应式数组的变更方法，并在它们被调用时触发相关的更新。这些变更方法包括：

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

**数组替换**

```js
// `items` 是一个数组的 ref
items.value = items.value.filter(item => item.message.match(/Foo/))
```

你可能认为这将导致 `Vue` 丢弃现有的 DOM 并重新渲染整个列表——幸运的是，情况并非如此。`Vue` 实现了一些巧妙的方法来最大化对 DOM 元素的重用，因此用另一个包含部分重叠对象的数组来做替换，仍会是一种非常高效的操作。
