## 搭配typescript使用

在基于 Vite 的配置中，开发服务器和打包器将只会对 TypeScript 文件执行语法转译，而不会执行任何类型检查，这保证了 Vite 开发服务器在使用 TypeScript 时也能始终保持飞快的速度。

- 在开发阶段，我们推荐你依赖一个好的 IDE 配置来获取即时的类型错误反馈。
- 对于单文件组件，你可以使用工具 [`vue-tsc`](https://github.com/johnsoncodehk/volar/tree/master/vue-language-tools/vue-tsc) 在命令行检查类型和生成类型声明文件。`vue-tsc` 是对 TypeScript 自身命令行界面 `tsc` 的一个封装。它的工作方式基本和 `tsc` 一致。除了 TypeScript 文件，它还支持 Vue 的单文件组件。你可以在开启 Vite 开发服务器的同时以侦听模式运行 `vue-tsc`，或是使用 [vite-plugin-checker](https://vite-plugin-checker.netlify.app/) 这样在另一个 worker 线程里做静态检查的插件。

<br />

### 配置 tsconfig.json

通过 `create-vue` 搭建的项目包含了预先配置好的 `tsconfig.json`。其底层配置抽象于 [`@vue/tsconfig`](https://github.com/vuejs/tsconfig) 包中。在项目内我们使用 [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) 来确保运行在不同环境下的代码的类型正确 (比如应用代码和测试代码应该有不同的全局变量)。

手动配置 `tsconfig.json` 时，请留意以下选项：

- [`compilerOptions.isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules) 应当设置为 `true`，因为 Vite 使用 [esbuild](https://esbuild.github.io/) 来转译 TypeScript，并受限于单文件转译的限制。
- 如果你正在使用选项式 API，需要将 [`compilerOptions.strict`](https://www.typescriptlang.org/tsconfig#strict) 设置为 `true` (或者至少开启 [`compilerOptions.noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis)，它是 `strict` 模式的一部分)，才可以获得对组件选项中 `this` 的类型检查。否则 `this` 会被认为是 `any`。
- 如果你在构建工具中配置了路径解析别名，例如 `@/*` 这个别名被默认配置在了 `create-vue` 项目中，你需要通过 [`compilerOptions.paths`](https://www.typescriptlang.org/tsconfig#paths) 选项为 TypeScript 再配置一遍。

<br />

### 常见使用说明

<br />

#### defineComponet()

为了让 TypeScript 正确地推导出组件选项内的类型，我们需要通过 `defineComponent()` 这个全局 API 来定义组件。当没有结合 `<script setup>` 使用组合式 API 时，`defineComponent()` 也支持对传递给 `setup()` 的 prop 的推导：

```js
import { defineComponent } from 'vue'

export default defineComponent({
  // 启用了类型推导
  props: {
    message: String
  },
  setup(props) {
    props.message // 类型：string | undefined
  }
})
```

<br />

#### 在单文件组件中的用法

要在单文件组件中使用 TypeScript，需要在 `<script>` 标签上加上 `lang="ts"` 的 attribute。当 `lang="ts"` 存在时，所有的模板内表达式都将享受到更严格的类型检查。

```vue
<script setup lang="ts">
// 启用了 TypeScript
import { ref } from 'vue'

const count = ref(1)
</script>

<template>
  <!-- 启用了类型检查和自动补全 -->
  {{ count.toFixed(2) }}
</template>
```

<br />

#### 模板中的typescript

在使用了 `<script lang="ts">` 或 `<script setup lang="ts">` 后，`<template>` 在绑定表达式中也支持 TypeScript。这对需要在模板表达式中执行类型转换的情况下非常有用。

```vue
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  {{ (x as number).toFixed(2) }}
</template>
```

<br />

## TypeScript 与组合式 API

### 为组件的 props 标注类型

<br />

#### 使用 `<script setup>`

当使用 `<script setup>` 时，`defineProps()` 宏函数支持从它的参数中推导类型：

```vue
<script setup lang="ts">
    import type { PropType } from 'vue'
    interface Book {
      title: string
      author: string
      year: number
    }

// 运行时声明：因为传递给 `defineProps()` 的参数会作为运行时的 `props` 选项使用，可以使用 PropType 工具类型
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number,
  book: Object as PropType<Book>
})

props.foo // string
props.bar // number | undefined
</script>

<script setup lang="ts">
// 基于类型的声明
const props = defineProps<{
  foo: string
  bar?: number
}>()
</script>
```

::: warning

基于类型的声明或者运行时声明可以择一使用，但是不能同时使用。

:::

基于类型的声明限制，为了生成正确的运行时代码，传给 `defineProps()` 的泛型参数必须是以下之一：

- 一个类型字面量：`defineProps<{ /*... */ }>()`

- 对**同一个文件**中的一个接口或对象类型字面量的引用：

  ```typescript
  interface Props {/* ... */}

  defineProps<Props>()
  ```

::: danger

在 3.2 及以下版本中，`defineProps()` 的泛型类型参数仅限于类型文字或对本地接口的引用。

这个限制在 3.3 中得到了解决。最新版本的 Vue 支持在类型参数位置引用导入和有限的复杂类型。但是，由于类型到运行时转换仍然基于 AST，一些需要实际类型分析的复杂类型，例如条件类型，还未支持。您可以使用条件类型来指定单个 prop 的类型，但不能用于整个 props 对象的类型。

:::

<br />

#### Props 解构默认值

当使用基于类型的声明时，我们失去了为 props 声明默认值的能力。这可以通过 `withDefaults` 编译器宏解决：

```typescript
export interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

这将被编译为等效的运行时 props `default` 选项。此外，`withDefaults` 帮助程序为默认值提供类型检查，并确保返回的 props 类型删除了已声明默认值的属性的可选标志。

<br />

### 非 `<script setup>` 场景下

如果没有使用 `<script setup>`，那么为了开启 props 的类型推导，必须使用 `defineComponent()`。传入 `setup()` 的 props 对象类型是从 `props` 选项中推导而来。

<br />

## 为组件的 emits 标注类型

在 `<script setup>` 中，`emit` 函数的类型标注也可以通过运行时声明或是类型声明进行：

```vue
<script setup lang="ts">
// 运行时
const emit = defineEmits(['change', 'update'])

// 基于类型
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

这个类型参数应该是一个带[调用签名](https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures)的类型字面量。这个类型字面量的类型就是返回的 `emit` 函数的类型。我们可以看到，基于类型的声明使我们可以对所触发事件的类型进行更细粒度的控制。

若没有使用 `<script setup>`，`defineComponent()` 也可以根据 `emits` 选项推导暴露在 setup 上下文中的 `emit` 函数的类型。

<br />

## 为 `ref()` 标注类型

有时我们可能想为 ref 内的值指定一个更复杂的类型，可以通过使用 `Ref` 这个类型：

```typescript
import { ref } from 'vue'
import type { Ref } from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // 成功！
```

或者，在调用 `ref()` 时传入一个泛型参数，来覆盖默认的推导行为：

```typescript
// 得到的类型：Ref<string | number>
const year = ref < string | number > ('2020')

year.value = 2020 // 成功！
```

如果你指定了一个泛型参数但没有给出初始值，那么最后得到的就将是一个包含 `undefined` 的联合类型：

```typescript
// 推导得到的类型：Ref<number | undefined>
const n = ref<number>()
```

<br />

## 为 `reactive()` 标注类型

要显式地标注一个 `reactive` 变量的类型，我们可以使用接口：

```typescript
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 指引' })
```

::: tip

不推荐使用 `reactive()` 的泛型参数，因为处理了深层次 ref 解包的返回值与泛型参数的类型不同。

:::

<br />

## 为 `computed()` 标注类型

`computed()` 会自动从其计算函数的返回值上推导出类型：

```typescript
import { computed, ref } from 'vue'

const count = ref(0)

// 推导得到的类型：ComputedRef<number>
const double = computed(() => count.value * 2)

// => TS Error: Property 'split' does not exist on types 'number'
const result = double.value.split('')
```

还可以通过泛型参数显式指定类型：

```typescript
const double = computed < number > (() => {
  // 若返回值不是 number 类型则会报错
})
```

<br />

## 为事件处理函数标注类型

没有类型标注时，这个 `event` 参数会隐式地标注为 `any` 类型。这也会在 `tsconfig.json` 中配置了 `"strict": true` 或 `"noImplicitAny": true` 时报出一个 TS 错误。因此，建议显式地为事件处理函数的参数标注类型。此外，你可能需要显式地强制转换 `event` 上的属性：

```typescript
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

<br />

## 为 provide / inject 标注类型

provide 和 inject 通常会在不同的组件中运行。要正确地为注入的值标记类型，`Vue` 提供了一个 `InjectionKey` 接口，它是一个继承自 `Symbol` 的泛型类型，可以用来在提供者和消费者之间同步注入值的类型：

建议将注入 key 的类型放在一个单独的文件中，这样它就可以被多个组件导入。

当使用字符串注入 key 时，注入值的类型是 `unknown`，需要通过泛型参数显式声明：

```typescript
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'foo') // 若提供的是非字符串值会导致错误

const foo = inject(key) // foo 的类型：string | undefined

// 通过泛型参数显式声明
const foo = inject<string>('foo') // 类型：string | undefined
```

注意注入的值仍然可以是 `undefined`，因为无法保证提供者一定会在运行时 provide 这个值。

当提供了一个默认值后，这个 `undefined` 类型就可以被移除：

```typescript
const foo = inject < string > ('foo', 'bar') // 类型：string
```

如果你确定该值将始终被提供，则还可以强制转换该值：

```typescript
const foo = inject('foo') as string
```

<br />

## 为模板引用标注类型

模板引用需要通过一个显式指定的泛型参数和一个初始值 `null` 来创建：

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'

const el = ref < HTMLInputElement | null > (null)

onMounted(() => {
  el.value?.focus()
})
</script>

<template>
  <input ref="el">
</template>
```

注意为了严格的类型安全，有必要在访问 `el.value` 时使用可选链或类型守卫。这是因为直到组件被挂载前，这个 ref 的值都是初始的 `null`，并且在由于 `v-if` 的行为将引用的元素卸载时也可以被设置为 `null`。

<br />

## 为组件模板引用标注类型

有时，你可能需要为一个子组件添加一个模板引用，以便调用它公开的方法。举例来说，我们有一个 `MyModal` 子组件，它有一个打开模态框的方法：

```vue
<!-- MyModal.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const isContentShown = ref(false)
const open = () => (isContentShown.value = true)

defineExpose({
  open
})
</script>
```

为了获取 `MyModal` 的类型，我们首先需要通过 `typeof` 得到其类型，再使用 TypeScript 内置的 `InstanceType` 工具类型来获取其实例类型：

```vue
<!-- App.vue -->
<script setup lang="ts">
import MyModal from './MyModal.vue'

const modal = ref<InstanceType<typeof MyModal> | null>(null)

const openModal = () => {
  modal.value?.open()
}
</script>
```

如果组件的具体类型无法获得，或者你并不关心组件的具体类型，那么可以使用 `ComponentPublicInstance`。这只会包含所有组件都共享的属性，比如 `$el`。

```typescript
import { ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'

const child = ref<ComponentPublicInstance | null>(null)
```

<br />

## 扩展全局属性

某些插件会通过 `app.config.globalProperties` 为所有组件都安装全局可用的属性。举例来说，我们可能为了请求数据而安装了 `this.$http`，或者为了国际化而安装了 `this.$translate`。为了使 TypeScript 更好地支持这个行为，Vue 暴露了一个被设计为可以通过 [TypeScript 模块扩展](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)来扩展的 `ComponentCustomProperties` 接口：

```typescript
import axios from 'axios'

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
    $translate: (key: string) => string
  }
}
```

我们可以将这些类型扩展放在一个 `.ts` 文件，或是一个影响整个项目的 `*.d.ts` 文件中。无论哪一种，都应确保在 `tsconfig.json` 中包括了此文件。对于库或插件作者，这个文件应该在 `package.json` 的 `types` 属性中被列出。

为了利用模块扩展的优势，你需要确保将扩展的模块放在 [TypeScript 模块](https://www.typescriptlang.org/docs/handbook/modules.html) 中。 也就是说，该文件需要包含至少一个顶级的 `import` 或 `export`，即使它只是 `export {}`。如果扩展被放在模块之外，它将覆盖原始类型，而不是扩展!

```typescript
// 不工作，将覆盖原始类型。
declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

```typescript
// 正常工作。
export {}

declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

<br />

## 扩展自定义选项

某些插件，比如 `vue-router`，提供了一些自定义的组件选项，比如 `beforeRouteEnter`。

如果没有确切的类型标注，这个钩子函数的参数会隐式地标注为 `any` 类型。我们可以为 `ComponentCustomOptions` 接口扩展自定义的选项来支持：

```typescript
import { Route } from 'vue-router'

declare module 'vue' {
  interface ComponentCustomOptions {
    beforeRouteEnter?(to: Route, from: Route, next: () => void): void
  }
}
```
