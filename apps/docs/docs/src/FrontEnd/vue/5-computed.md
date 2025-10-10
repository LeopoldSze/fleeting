## 基础

使用**计算属性**来描述依赖响应式状态的复杂逻辑。

`computed()` 方法期望接收一个 getter 函数，返回值为一个**计算属性 ref**。和其他一般的 ref 类似，你可以通过 `.value` 访问计算结果。计算属性 ref 也会在模板中自动解包，因此在模板表达式中引用时无需添加 `.value`。

Vue 的计算属性会自动追踪响应式依赖。

<br />

## 计算属性缓存 VS 方法

若我们将同样的函数定义为一个方法而不是计算属性，两种方式在结果上确实是完全相同的，然而，不同之处在于**计算属性值会基于其响应式依赖被缓存**。

一个计算属性仅会在其响应式依赖更新时才重新计算。这意味着只要**响应式依赖**不改变，无论多少次访问**计算属性**都会立即返回先前的计算结果，而不用重复执行 getter 函数。

::: warning

方法调用**总是**会在重渲染发生时再次执行函数。

:::

<br />

## 可写计算属性

可以通过同时提供 getter 和 setter 来创建：

```vue
<script setup>
import { computed, ref } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // getter
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  // setter
  set(newValue) {
    // 注意：我们这里使用的是解构赋值语法
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```

<br />

::: warning

计算属性的 getter 应只做计算而没有任何其他的副作用，这一点非常重要，请务必牢记。举例来说，**不要在 getter 中做异步请求或者更改 DOM**！一个计算属性的声明中描述的是如何根据其他值派生一个值。因此 getter 的职责应该仅为计算和返回该值。

:::
