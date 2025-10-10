## 组件定义

当使用构建步骤时，我们一般会将 Vue 组件定义在一个单独的 `.vue` 文件中，这被叫做[单文件组件](https://cn.vuejs.org/guide/scaling-up/sfc.html) (简称 SFC)：

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">
    You clicked me {{ count }} times.
  </button>
</template>
```

当不使用构建步骤时，一个 Vue 组件以一个包含 Vue 特定选项的 JavaScript 对象来定义。

```js
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
  // 或者 `template: '#my-template-element'`
}
```

这里的模板是一个内联的 JavaScript 字符串，Vue 将会在运行时编译它。你也可以使用 ID 选择器来指向一个元素 (通常是原生的 `<template>` 元素)，Vue 将会使用其内容作为模板来源。

也可以通过具名导出在一个文件中导出多个组件。

<br />

## 组件基础

每一个组件都维护着自己的状态，这是因为每当你使用一个组件，就创建了一个新的**实例**。

在单文件组件中，推荐为子组件使用 `PascalCase` 的标签名，以此来和原生的 HTML 元素作区分。虽然原生 HTML 标签名是不区分大小写的，但 `Vue` 单文件组件是可以在编译中区分大小写的。我们也可以使用 `/>` 来关闭一个标签。

如果你是直接在 DOM 中书写模板 (例如原生 `<template>` 元素的内容)，模板的编译需要遵从浏览器中 HTML 的解析行为。在这种情况下，你应该需要使用 `kebab-case` 形式并显式地关闭这些组件的标签。

```html
<!-- 如果是在 DOM 中书写该模板 -->
<button-counter></button-counter>
<button-counter></button-counter>
<button-counter></button-counter>

```

<br />

### props

`defineProps` 是一个仅 `<script setup>` 中可用的编译宏命令，并不需要显式地导入。声明的 props 会自动暴露给模板。`defineProps` 会返回一个对象，其中包含了可以传递给组件的所有 props：

```js
const props = defineProps(['title'])
console.log(props.title)
```

如果你没有使用 `<script setup>`，props 必须以 `props` 选项的方式声明，props 对象会作为 `setup()` 函数的第一个参数被传入：

```js
export default {
  props: ['title'],
  setup(props) {
    console.log(props.title)
  }
}
```

<br />

### 监听事件

子组件可以通过调用内置的 **`$emit`** 方法，通过传入事件名称来抛出一个事件：

```vue
<!-- BlogPost.vue, 省略了 <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlarge-text')">
      Enlarge text
    </button>
  </div>
</template>
```

可以通过 `defineEmits` 宏来声明需要抛出的事件：

```vue
<!-- BlogPost.vue -->
<script setup>
defineProps(['title'])
defineEmits(['enlarge-text'])
</script>
```

这声明了一个组件可能触发的所有事件，还可以对事件的参数进行验证。同时，这还可以让 `Vue` 避免将它们作为原生事件监听器隐式地应用于子组件的根元素。

和 `defineProps` 类似，`defineEmits` 仅可用于 `<script setup>` 之中，并且不需要导入，它返回一个等同于 `$emit` 方法的 `emit` 函数。它可以被用于在组件的 `<script setup>` 中抛出事件，因为此处无法直接访问 `$emit`：

```vue
<script setup>
const emit = defineEmits(['enlarge-text'])

emit('enlarge-text')
</script>
```

如果你没有在使用 `<script setup>`，你可以通过 `emits` 选项定义组件会抛出的事件。你可以从 `setup()` 函数的第二个参数，即 setup 上下文对象上访问到 `emit` 函数：

```js
export default {
  emits: ['enlarge-text'],
  setup(props, ctx) {
    ctx.emit('enlarge-text')
  }
}
```

与 `setup()` 上下文对象中的其他属性一样，`emit` 可以安全地被解构：

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, { emit }) {
    emit('submit')
  }
}
```

<br />

### 动态组件

通过 `Vue` 的 `<component>` 元素和特殊的 `is` attribute 实现的：

```vue
<!-- currentTab 改变时组件也改变 -->
<component :is="tabs[currentTab]"></component>
```

被传给 `:is` 的值可以是以下几种：

- 被注册的组件名
- 导入的组件对象

你也可以使用 `is` attribute 来创建一般的 HTML 元素。

当使用 `<component :is="...">` 来在多个组件间作切换时，被切换掉的组件会被卸载。我们可以通过 `<keep-alive>` 组件强制被切换掉的组件仍然保持“存活”的状态。

<br />

### DOM 模板解析注意事项

只适用于直接在 DOM 中编写模板的情况。

#### 大小写区分

HTML 标签和属性名称是不分大小写的，所以浏览器会把任何大写的字符解释为小写。这意味着当你使用 DOM 内的模板时，无论是 `PascalCase` 形式的组件名称、`camelCase` 形式的 prop 名称还是 v-on 的事件名称，都需要转换为相应等价的 `kebab-case` (短横线连字符) 形式：

```vue
<!-- HTML 中的 kebab-case -->
<blog-post post-title="hello!" @update-post="onUpdatePost"></blog-post>

// JavaScript 中的 camelCase
const BlogPost = {
  props: ['postTitle'],
  emits: ['updatePost'],
  template: `
    <h3>
{{ postTitle }}
</h3>
  `
}
```

<br />

#### 闭合标签

因为 `Vue` 的模板解析器支持任意标签使用 `/>` 作为标签关闭的标志。然而在 DOM 模板中，我们必须显式地写出关闭标签：

```vue
<my-component></my-component>
```

这是由于 HTML 只允许[一小部分特殊的元素](https://html.spec.whatwg.org/multipage/syntax.html#void-elements)省略其关闭标签，最常见的就是 `<input>` 和 `<img>`。对于其他的元素来说，如果你省略了关闭标签，原生的 HTML 解析器会认为开启的标签永远没有结束。

<br />

#### 元素位置限制

某些 HTML 元素对于放在其中的元素类型有限制，例如 `<ul>`，`<ol>`，`<table>` 和 `<select>`，相应的，某些元素仅在放置于特定元素中时才会显示，例如 `<li>`，`<tr>` 和 `<option>`。

使用特殊的 `is` attribute 作为一种解决方案：

```vue
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

::: tip

当使用在原生 HTML 元素上时，`is` 的值必须加上前缀 `vue:` 才可以被解析为一个 Vue 组件。这一点是必要的，为了避免和原生的[自定义内置元素](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example)相混淆。

:::

<br />

## 组件注册

一个 `Vue` 组件在使用前需要先被“注册”，这样 `Vue` 才能在渲染模板时找到其对应的实现。组件注册有两种方式：全局注册和局部注册。

### 全局注册

可以使用 `Vue 应用实例` 的 `app.component()` 方法，让组件在当前 `Vue` 应用中全局可用。`app.component()` 方法可以被链式调用：

```js
import MyComponent from './App.vue'
...

app
  .component('MyComponent', MyComponent)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```

所有的子组件也可以使用全局注册的组件，这意味着这三个组件也都可以在*彼此内部*使用。

问题：

1. 全局注册，但并没有被使用的组件无法在生产打包时被自动移除 (也叫“tree-shaking”)。如果你全局注册了一个组件，即使它并没有被实际使用，它仍然会出现在打包后的 JS 文件中。
2. 全局注册在大型项目中使项目的依赖关系变得不那么明确。在父组件中使用子组件时，不太容易定位子组件的实现。和使用过多的全局变量一样，这可能会影响应用长期的可维护性。

<br />

### 局部注册

局部注册的组件需要在使用它的父组件中显式导入，并且只能在该父组件中使用。它的优点是使组件之间的依赖关系更加明确，并且对 tree-shaking 更加友好。

在使用 `<script setup>` 的单文件组件中，导入的组件可以直接在模板中使用，无需注册：

```vue
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>
```

如果没有使用 `<script setup>`，则需要使用 `components` 选项来显式注册：

```js
import ComponentA from './ComponentA.js'

export default {
  components: {
    ComponentA
  },
  setup() {
    // ...
  }
}
```

::: warning

对于每个 `components` 对象里的属性，它们的 key 名就是注册的组件名，而值就是相应组件的实现。

局部注册的组件在后代组件中并**不**可用，仅在当前组件可用，而在任何的子组件或更深层的子组件中都不可用。

:::

<br />

### 组件名格式

使用 `PascalCase` 作为组件名的注册格式，这是因为：

1. `PascalCase` 是合法的 JavaScript 标识符。这使得在 JavaScript 中导入和注册组件都很容易，同时 IDE 也能提供较好的自动补全。
2. `<PascalCase />` 在模板中更明显地表明了这是一个 `Vue` 组件，而不是原生 HTML 元素。同时也能够将 `Vue` 组件和自定义元素 (web components) 区分开来。

在单文件组件和内联字符串模板中，我们都推荐这样做。但是，`PascalCase` 的标签名在 DOM 模板中是不可用的，详情参见 [DOM 模板解析注意事项](https://cn.vuejs.org/guide/essentials/component-basics.html#dom-template-parsing-caveats)。

为了方便，`Vue` 支持将模板中使用 `kebab-case` 的标签解析为使用 `PascalCase` 注册的组件。这意味着一个以 `MyComponent` 为名注册的组件，在模板中可以通过 `<MyComponent>` 或 `<my-component>` 引用。这让我们能够使用同样的 JavaScript 组件注册代码来配合不同来源的模板。

<br />

## Props

一个组件需要显式声明它所接受的 props，这样 `Vue` 才能知道外部传入的哪些是 props，哪些是透传 attribute。

注意传递给 `defineProps()` 的参数和提供给 `props` 选项的值是相同的，两种声明方式背后其实使用的都是 prop 选项。

对于以对象形式声明中的每个属性，key 是 prop 的名称，而值则是该 prop 预期类型的构造函数。比如，如果要求一个 prop 的值是 `number` 类型，则可使用 `Number` 构造函数作为其声明的值。

### prop 命名格式

虽然理论上你也可以在向子组件传递 props 时使用 camelCase 形式 (使用 [DOM 模板](https://cn.vuejs.org/guide/essentials/component-basics.html#dom-template-parsing-caveats)时例外)，但实际上为了和 HTML attribute 对齐，我们通常会将其写为 kebab-case 形式：

```vue
<MyComponent greeting-message="hello" />
```

对于组件名我们推荐使用 `PascalCase`，因为这提高了模板的可读性，能帮助我们区分 `Vue` 组件和原生 HTML 元素。然而对于传递 props 来说，使用 `camelCase` 并没有太多优势，因此我们推荐更贴近 HTML 的书写风格。

<br />

### 使用一个对象绑定多个prop

实际上**任何**类型的值都可以作为 props 的值被传递。

想要将一个对象的所有属性都当作 props 传入，你可以使用没有参数的 `v-bind`，即只使用 `v-bind` 而非 `:prop-name`。

```vue
<BlogPost v-bind="post" />

<!-- 等价于 -->
<BlogPost :id="post.id" :title="post.title" />

const post = {
  id: 1,
  title: 'My Journey with Vue'
}
```

<br />

### 单向数据流

所有的 props 都遵循着**单向绑定**原则，props 因父组件的更新而变化，自然地将新的状态向下流往子组件，而不会逆向传递。这避免了子组件意外修改父组件的状态的情况，不然应用的数据流将很容易变得混乱而难以理解。

另外，每次父组件更新后，所有的子组件中的 props 都会被更新到最新值，这意味着你**不应该**在子组件中去更改一个 prop。

**更改props：**

1. **prop 被用于传入初始值；而子组件想在之后将其作为一个局部数据属性**。在这种情况下，最好是新定义一个局部数据属性，从 props 上获取初始值即可
2. **需要对传入的 prop 值做进一步的转换**。在这种情况中，最好是基于该 prop 值定义一个计算属性

<br />

### Props 校验

```js
defineProps({
  // 基础类型检查
  // （给出 `null` 和 `undefined` 值则会跳过任何类型检查）
  propA: Number,
  // 多种可能的类型
  propB: [String, Number],
  // 必传，且为 String 类型
  propC: {
    type: String,
    required: true
  },
  // Number 类型的默认值
  propD: {
    type: Number,
    default: 100
  },
  // 对象类型的默认值
  propE: {
    type: Object,
    // 对象或数组的默认值
    // 必须从一个工厂函数返回。
    // 该函数接收组件所接收到的原始 prop 作为参数。
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // 自定义类型校验函数
  propF: {
    validator(value) {
      // The value must match one of these strings
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // 函数类型的默认值
  propG: {
    type: Function,
    // 不像对象或数组的默认，这不是一个工厂函数。这会是一个用来作为默认值的函数
    default() {
      return 'Default function'
    }
  }
})
```

::: warning

`defineProps()` 宏中的参数**不可以访问 `<script setup>` 中定义的其他变量**，因为在编译时整个表达式都会被移到外部的函数中。

:::

- 所有 prop 默认都是可选的，除非声明了 `required: true`。
- 除 `Boolean` 外的未传递的可选 prop 将会有一个默认值 `undefined`。
- `Boolean` 类型的未传递 prop 将被转换为 `false`。这可以通过为它设置 `default` 来更改——例如：设置为 `default: undefined` 将与非布尔类型的 prop 的行为保持一致。
- 如果声明了 `default` 值，那么在 prop 的值被解析为 `undefined` 时，无论 prop 是未被传递还是显式指明的 `undefined`，都会改为 `default` 值。

<br />

### 运行时类型检查

校验选项中的 `type` 可以是下列这些原生构造函数：

- `String`
- `Number`
- `Boolean`
- `Array`
- `Object`
- `Date`
- `Function`
- `Symbol`

另外，`type` 也可以是自定义的类或构造函数，`Vue` 将会通过 `instanceof` 来检查类型是否匹配。

<br />

## 事件

与 prop 大小写格式一样，在模板中我们也推荐使用 kebab-case 形式来编写监听器。

在组件的模板表达式中，可以直接使用 `$emit` 方法触发自定义事件 (例如：在 `v-on` 的处理函数中)：

```vue
<!-- MyComponent -->
<button @click="$emit('someEvent')">
click me
</button>
```

::: tip

和原生 DOM 事件不一样，组件触发的事件**没有冒泡机制**。你只能监听直接子组件触发的事件。平级组件或是跨越多层嵌套的组件间通信，应使用一个外部的事件总线，或是使用一个全局状态管理方案。

:::

::: tip 事件参数
所有传入 `$emit()` 的额外参数都会被直接传向监听器。举例来说，`$emit('foo', 1, 2, 3)` 触发后，监听器函数将会收到这三个参数值。

:::

### 声明触发的事件

在 `<template>` 中使用的 `$emit` 方法不能在组件的 `<script setup>` 部分中使用，但 `defineEmits()` 会返回一个相同作用的函数供我们使用：

`emits` 选项还支持对象语法，它允许我们对触发事件的参数进行验证：

```vue
<script setup>
const emit = defineEmits({
  submit(payload) {
    // 通过返回值为 `true` 还是为 `false` 来判断
    // 验证是否通过
  }
})
</script>

// 搭配ts
<script setup lang="ts">
    const emit = defineEmits<{
      (e: 'change', id: number): void
      (e: 'update', value: string): void
    }>()
</script>
```

::: warning

如果一个原生事件的名字 (例如 `click`) 被定义在 `emits` 选项中，则监听器只会监听组件触发的 `click` 事件而不会再响应原生的 `click` 事件。

:::

<br />

### 事件校验

要为事件添加校验，那么事件可以被赋值为一个函数，接受的参数就是抛出事件时传入 `emit` 的内容，返回一个布尔值来表明事件是否合法。

```js
<script setup>
const emit = defineEmits({
  // 没有校验
  click: null,

  // 校验 submit 事件
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Invalid submit event payload!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```

<br />

## 配合 `v-model` 使用

当使用在一个组件上时，`v-model` 会被展开为如下的形式：

```vue
<CustomInput
  :modelValue="searchText"
  @update:modelValue="newValue => searchText = newValue"
/>
```

要让这个例子实际工作起来，`<CustomInput>` 组件内部需要做两件事：

1. 将内部原生 `input` 元素的 `value` attribute 绑定到 `modelValue` prop
2. 输入新的值时在 `input` 元素上触发 `update:modelValue` 事件

```vue
<!-- CustomInput.vue -->
<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  >
</template>

<!-- 父组件 -->
<CustomInput v-model="searchText" />
```

另一种在组件内实现 `v-model` 的方式是使用一个可写的，同时具有 getter 和 setter 的计算属性。`get` 方法需返回 `modelValue` prop，而 `set` 方法需触发相应的事件：

```vue
<!-- CustomInput.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <input v-model="value">
</template>
```

<br />

### v-model的参数

默认情况下，`v-model` 在组件上都是使用 `modelValue` 作为 prop，并以 `update:modelValue` 作为对应的事件。我们可以通过给 `v-model` 指定一个参数来更改这些名字：

```vue
<MyComponent v-model:title="bookTitle" />

<!-- MyComponent.vue -->
<script setup>
defineProps(['title'])
defineEmits(['update:title'])
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  >
</template>
```

<br />

### 多个 `v-model` 绑定

以在一个组件上创建多个 `v-model` 双向绑定，每一个 `v-model` 都会同步不同的 prop：

```vue
<!-- 父组件 -->
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>

<!-- 子组件 -->
<script setup>
defineProps({
  firstName: String,
  lastName: String
})

defineEmits(['update:firstName', 'update:lastName'])
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  >
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  >
</template>
```

<br />

### `v-model` 修饰符

组件的 `v-model` 上所添加的修饰符，可以通过 `modelModifiers` prop 在组件内访问到：

```vue
<script setup>
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})

defineEmits(['update:modelValue'])

console.log(props.modelModifiers) // { capitalize: true }
</script>

<template>
  <input
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  >
</template>
```

对于又有参数又有修饰符的 `v-model` 绑定，生成的 prop 名将是 `arg + "Modifiers"`。举例来说：

```js
<MyComponent v-model:title.capitalize="myText">

const props = defineProps(['title', 'titleModifiers'])
defineEmits(['update:title'])

console.log(props.titleModifiers) // { capitalize: true }
```

<br />

## 透传 Attributes

### Attributes 继承

“透传 attribute”指的是传递给一个组件，却没有被该组件声明为 props 或 emits 的 attribute 或者 `v-on` 事件监听器。最常见的例子就是 `class`、`style` 和 `id`。

当一个组件以单个元素为根作渲染时，透传的 attribute 会自动被添加到根元素上。

```vue
<MyButton class="large" />

<!-- 渲染结果 -->
<button class="large">
click me
</button>
```

`<MyButton>` 并没有将 `class` 声明为一个它所接受的 prop，所以 `class` 被视作透传 attribute，自动透传到了 `<MyButton>` 的根元素上。

如果一个子组件的根元素已经有了 `class` 或 `style` attribute，它会和从父组件上继承的值合并。

<br />

### `v-on` 监听器继承

```vue
<MyButton @click="onClick" />
```

`click` 监听器会被添加到 `<MyButton>` 的根元素，即那个原生的 `<button>` 元素之上。当原生的 `<button>` 被点击，会触发父组件的 `onClick` 方法。同样的，如果原生 `button` 元素自身也通过 `v-on` 绑定了一个事件监听器，则这个监听器和从父组件继承的监听器都会被触发。

<br />

### 深层组件继承

有些情况下一个组件会在根节点上渲染另一个组件。例如，我们重构一下 `<MyButton>`，让它在根节点上渲染 `<BaseButton>`：

```vue
<!-- <MyButton/> 的模板，只是渲染另一个组件 -->
<BaseButton />
```

此时 `<MyButton>` 接收的透传 attribute 会直接继续传给 `<BaseButton>`。

请注意：

1. 透传的 attribute 不会包含 `<MyButton>` 上声明过的 props 或是针对 `emits` 声明事件的 `v-on` 侦听函数，换句话说，声明过的 props 和侦听函数被 `<MyButton>`“消费”了。
2. 透传的 attribute 若符合声明，也可以作为 props 传入 `<BaseButton>`。

<br />

### 禁用 Attributes 继承

如果你**不想要**一个组件自动地继承 attribute，你可以在组件选项中设置 `inheritAttrs: false`。

如果你使用了 `<script setup>`，你需要一个额外的 `<script>` 块来书写这个选项声明：

```vue
<script>
// 使用普通的 <script> 来声明选项
export default {
  inheritAttrs: false
}
</script>

<script setup>
// ...setup 部分逻辑
</script>
```

从 3.3 开始你也可以直接在 `<script setup>` 中使用 `defineOptions`：

```vue
<script setup>
defineOptions({
  inheritAttrs: false
})
// ...setup 逻辑
</script>
```

<br />

最常见的需要禁用 attribute 继承的场景就是 attribute 需要应用在根节点以外的其他元素上。通过设置 `inheritAttrs` 选项为 `false`，你可以完全控制透传进来的 attribute 被如何使用。

这些透传进来的 attribute 可以在模板的表达式中直接用 `$attrs` 访问到。

```vue
<span>
Fallthrough attribute: {{ $attrs }}
</span>
```

这个 `$attrs` 对象包含了除组件所声明的 `props` 和 `emits` 之外的所有其他 attribute，例如 `class`，`style`，`v-on` 监听器等等。

有几点需要注意：

- 和 props 有所不同，透传 attributes 在 JavaScript 中保留了它们原始的大小写，所以像 `foo-bar` 这样的一个 attribute 需要通过 `$attrs['foo-bar']` 来访问。
- 像 `@click` 这样的一个 `v-on` 事件监听器将在此对象下被暴露为一个函数 `$attrs.onClick`。

我们想要所有像 `class` 和 `v-on` 监听器这样的透传 attribute 都应用在内部的 `<button>` 上而不是外层的 `<div>` 上。我们可以通过设定 `inheritAttrs: false` 和使用 `v-bind="$attrs"` 来实现：

```vue
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">click me</button>
</div>
```

<br />

### 多根节点的 Attributes 继承

和单根节点组件有所不同，有着多个根节点的组件没有自动 attribute 透传行为。如果 `$attrs` 没有被显式绑定，将会抛出一个运行时警告。

如果 `<CustomLayout>` 有下面这样的多根节点模板，由于 Vue 不知道要将 attribute 透传到哪里，所以会抛出一个警告。

如果 `$attrs` 被显式绑定，则不会有警告：

```vue
<header>
...
</header>

<main v-bind="$attrs">
...
</main>

<footer>
...
</footer>
```

<br />

### 在 JS 中访问透传 Attributes

可以在 `<script setup>` 中使用 `useAttrs()` API 来访问一个组件的所有透传 attribute：

```vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```

如果没有使用 `<script setup>`，`attrs` 会作为 `setup()` 上下文对象的一个属性暴露：

```js
export default {
  setup(props, ctx) {
    // 透传 attribute 被暴露为 ctx.attrs
    console.log(ctx.attrs)
  }
}
```

::: warning

虽然这里的 `attrs` 对象总是反映为最新的透传 attribute，但它并不是响应式的 (考虑到性能因素)。你不能通过侦听器去监听它的变化。如果你需要响应性，可以使用 prop。或者你也可以使用 `onUpdated()` 使得在每次更新时结合最新的 `attrs` 执行副作用。

:::

<br />

## 插槽 Slots

### 插槽内容与出口

`<slot>` 元素是一个**插槽出口** (slot outlet)，标示了父元素提供的**插槽内容** (slot content) 将在哪里被渲染。

插槽内容可以是任意合法的模板内容，不局限于文本。例如我们可以传入多个元素，甚至是组件：

![](https://cn.vuejs.org/assets/slots.dbdaf1e8.png)

<br />

### 渲染作用域

插槽内容可以访问到父组件的数据作用域，因为插槽内容本身是在父组件模板中定义的。

```vue
<span>
{{ message }}
</span>

<FancyButton>
{{ message }}
</FancyButton>
```

这里的两个 `{{ message }}` 插值表达式渲染的内容都是一样的。

插槽内容**无法访问**子组件的数据。`Vue` 模板中的表达式只能访问其定义时所处的作用域，这和 JavaScript 的词法作用域规则是一致的。

::: warning

父组件模板中的表达式只能访问父组件的作用域；子组件模板中的表达式只能访问子组件的作用域。

:::

<br />

### 默认内容

如果我们想在父组件没有提供任何插槽内容时在子组件内渲染默认内容，只需要将默认内容写在 `<slot>` 标签之间来作为默认内容：

```vue
<button type="submit">
  <slot>
    Submit <!-- 默认内容 -->
  </slot>
</button>
```

在父组件中使用 `<SubmitButton>` 且没有提供任何插槽内容时："Submit”将会被作为默认内容渲染；

如果我们提供了插槽内容，那么被显式提供的内容会取代默认内容。

<br />

### 具名插槽

有时在一个组件中包含多个插槽出口是很有用的。对于这种场景，`<slot>` 元素可以有一个特殊的 attribute `name`，用来给各个插槽分配唯一的 ID，以确定每一处要渲染的内容：

```vue
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

这类带 `name` 的插槽被称为具名插槽 (named slots)。没有提供 `name` 的 `<slot>` 出口会隐式地命名为“default”。

在父组件中使用 `<BaseLayout>` 时，我们需要一种方式将多个插槽内容传入到各自目标插槽的出口。此时就需要用到**具名插槽**了：

要为具名插槽传入内容，我们需要使用一个含 `v-slot` 指令的 `<template>` 元素，并将目标插槽的名字传给该指令：

```vue
<BaseLayout>
  <template v-slot:header>
    <!-- header 插槽的内容放这里 -->
  </template>

  <template #default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```

`v-slot` 有对应的简写 `#`，因此 `<template v-slot:header>` 可以简写为 `<template #header>`。其意思就是“将这部分模板片段传入子组件的 header 插槽中”。

![](https://cn.vuejs.org/assets/named-slots.ebb7b207.png)

当一个组件同时接收默认插槽和具名插槽时，所有位于顶级的非 `<template>` 节点都被隐式地视为默认插槽的内容。所以上面也可以写成：

```vue
<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <!-- 隐式的默认插槽 -->
  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```

<br />

### 动态插槽名

动态指令参数在 `v-slot` 上也是有效的，即可以定义下面这样的动态插槽名：

```vue
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>

  <!-- 缩写为 -->
  <template #[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

::: warning

注意这里的表达式和动态指令参数受相同的语法限制（参考模板语法指令章节）。

:::

<br />

### 作用域插槽

在某些场景下插槽的内容可能想要同时使用父组件域内和子组件域内的数据。要做到这一点，我们需要一种方法来让子组件在渲染时将一部分数据提供给插槽。

可以像对组件传递 props 那样，向一个插槽的出口上传递 attributes：

```vue
<!-- <MyComponent> 的模板 -->
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>
```

当需要接收插槽 props 时，默认插槽和具名插槽的使用方式有一些小区别。

**默认作用域插槽**

通过子组件标签上的 `v-slot` 指令，直接接收到了一个插槽 props 对象：

```vue
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```

<img src="https://cn.vuejs.org/assets/scoped-slots.1c6d5876.svg"  />

`v-slot="slotProps"` 可以类比这里的函数签名，和函数的参数类似，支持响应式，我们也可以在 `v-slot` 中使用解构：

```vue
<MyComponent v-slot="{ text, count }">
  {{ text }} {{ count }}
</MyComponent>
```

**具名作用域插槽**

插槽 props 可以作为 `v-slot` 指令的值被访问到：`v-slot:name="slotProps"`。当使用缩写时是这样：

```vue
<MyComponent>
  <template #header="headerProps">
    {{ headerProps }}
  </template>

  <template #default="defaultProps">
    {{ defaultProps }}
  </template>

  <template #footer="footerProps">
    {{ footerProps }}
  </template>
</MyComponent>
```

如果你混用了具名插槽与默认插槽，则需要为默认插槽使用显式的 `<template>` 标签。尝试直接为组件添加 `v-slot` 指令将导致编译错误。这是为了避免因默认插槽的 props 的作用域而困惑。

```vue
<template>
  <MyComponent>
    <!-- 使用显式的默认插槽 -->
    <template #default="{ message }">
      <p>{{ message }}</p>
    </template>

    <template #footer>
      <p>Here's some contact info</p>
    </template>
  </MyComponent>
</template>
```

::: tip

作用域插槽在需要**同时**封装逻辑、组合视图界面时还是很有用

:::

<br />

## 依赖注入

### Provide (提供)

要为组件后代提供数据，需要使用到 `provide()` 函数：

```vue
<script setup>
import { provide } from 'vue'

provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
</script>
```

如果不使用 `<script setup>`，请确保 `provide()` 是在 `setup()` 同步调用的：

```js
import { provide } from 'vue'

export default {
  setup() {
    provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
  }
}
```

`provide()` 函数接收两个参数。第一个参数被称为**注入名**，可以是一个字符串或是一个 `Symbol`。后代组件会用注入名来查找期望注入的值。一个组件可以多次调用 `provide()`，使用不同的注入名，注入不同的依赖值。

第二个参数是提供的值，值可以是任意类型，包括响应式的状态，比如一个 ref：

提供的响应式状态使后代组件可以由此和提供者建立响应式的联系。

```js
import { provide, ref } from 'vue'

const count = ref(0)
provide('key', count)
```

<br />

### 全局 Provide

除了在一个组件中提供依赖，我们还可以在整个应用层面提供依赖：

```js
import { createApp } from 'vue'

const app = createApp({})

app.provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
```

在应用级别提供的数据在该应用内的所有组件中都可以注入。这在你编写[插件](https://cn.vuejs.org/guide/reusability/plugins.html)时会特别有用，因为插件一般都不会使用组件形式来提供值。

<br />

### Inject (注入)

要注入上层组件提供的数据，需使用 `inject()` 函数：

```vue
<script setup>
import { inject } from 'vue'

const message = inject('message')
</script>
```

如果提供的值是一个 ref，注入进来的会是该 ref 对象，而**不会**自动解包为其内部的值。这使得注入方组件能够通过 ref 对象保持了和供给方的响应性链接。

同样的，如果没有使用 `<script setup>`，`inject()` 需要在 `setup()` 内同步调用：

```js
import { inject } from 'vue'

export default {
  setup() {
    const message = inject('message')
    return { message }
  }
}
```

```js
// 如果没有祖先组件提供 "message"
// `value` 会是 "这是默认值"
const value = inject('message', '这是默认值')
```

在一些场景中，默认值可能需要通过调用一个函数或初始化一个类来取得。为了避免在用不到默认值的情况下进行不必要的计算或产生副作用，我们可以使用工厂函数来创建默认值：

```js
const value = inject('key', () => new ExpensiveClass())
```

<br />

### 和响应式数据配合使用

当提供 / 注入响应式的数据时，**建议尽可能将任何对响应式状态的变更都保持在供给方组件中**。这样可以确保所提供状态的声明和变更操作都内聚在同一个组件内，使其更容易维护。

有的时候，我们可能需要在注入方组件中更改数据。在这种情况下，我们推荐在供给方组件内声明并提供一个更改数据的方法函数：

```vue
<!-- 在供给方组件内 -->
<script setup>
import { provide, ref } from 'vue'

const location = ref('North Pole')

function updateLocation() {
  location.value = 'South Pole'
}

provide('location', {
  location,
  updateLocation
})
</script>
```

```vue
<!-- 在注入方组件 -->
<script setup>
import { inject } from 'vue'

const { location, updateLocation } = inject('location')
</script>

<template>
  <button @click="updateLocation">
    {{ location }}
  </button>
</template>
```

如果你想确保提供的数据不能被注入方的组件更改，你可以使用 [`readonly()`](https://cn.vuejs.org/api/reactivity-core.html#readonly) 来包装提供的值。

```vue
<script setup>
import { provide, readonly, ref } from 'vue'

const count = ref(0)
provide('read-only-count', readonly(count))
</script>
```

<br />

### 使用 Symbol 作注入名

至此，我们已经了解了如何使用字符串作为注入名。但如果你正在构建大型的应用，包含非常多的依赖提供，或者你正在编写提供给其他开发者使用的组件库，建议最好使用 Symbol 来作为注入名以避免潜在的冲突。

我们通常推荐在一个单独的文件中导出这些注入名 Symbol：

```js
// keys.js
export const myInjectionKey = Symbol()
```

```js
// 在供给方组件中
import { provide } from 'vue'
import { myInjectionKey } from './keys.js'

provide(myInjectionKey, { /*
  要提供的数据
*/ });

// 注入方组件
import { inject } from 'vue'
import { myInjectionKey } from './keys.js'

const injected = inject(myInjectionKey)
```

<br />

## 异步组件

`defineAsyncComponent` 方法接收一个返回 Promise 的加载函数。这个 Promise 的 `resolve` 回调方法应该在从服务器获得组件定义时调用。你也可以调用 `reject(reason)` 表明加载失败。

ES 模块动态导入也会返回一个 Promise，所以多数情况下我们会将它和 `defineAsyncComponent` 搭配使用。类似 `Vite` 和 `Webpack` 这样的构建工具也支持此语法 (并且会将它们作为打包时的代码分割点)，因此我们也可以用它来导入 `Vue` 单文件组件：

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

最后得到的 `AsyncComp` 是一个外层包装过的组件，仅在页面需要它渲染时才会调用加载内部实际组件的函数。它会将接收到的 props 和插槽传给内部组件，所以你可以使用这个异步的包装组件无缝地替换原始组件，同时实现延迟加载。

与普通组件一样，异步组件可以使用 `app.component()` 全局注册：

```js
app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))
```

也可以直接在父组件中直接定义它们：

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
  <AdminPage />
</template>
```

<br />

### 加载与错误状态

异步操作不可避免地会涉及到加载和错误状态，因此 `defineAsyncComponent()` 也支持在高级选项中处理这些状态：

```js
const AsyncComp = defineAsyncComponent({
  // 加载函数
  loader: () => import('./Foo.vue'),

  // 加载异步组件时使用的组件
  loadingComponent: LoadingComponent,
  // 展示加载组件前的延迟时间，默认为 200ms
  delay: 200,

  // 加载失败后展示的组件
  errorComponent: ErrorComponent,
  // 如果提供了一个 timeout 时间限制，并超时了
  // 也会显示这里配置的报错组件，默认值是：Infinity
  timeout: 3000
})
```

如果提供了一个加载组件，它将在内部组件加载时先行显示。在加载组件显示之前有一个默认的 200ms 延迟——这是因为在网络状况较好时，加载完成得很快，加载组件和最终组件之间的替换太快可能产生闪烁，反而影响用户感受。

如果提供了一个报错组件，则它会在加载器函数返回的 Promise 抛错时被渲染。你还可以指定一个超时时间，在请求耗时超过指定时间时也会渲染报错组件。

<br />
