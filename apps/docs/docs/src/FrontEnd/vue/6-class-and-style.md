Vue 专门为 `class` 和 `style` 的 `v-bind` 用法提供了特殊的功能增强。除了字符串外，表达式的值也可以是对象或数组。

## 绑定 HTML class

### 绑定对象

```vue
<!-- 第一种 -->
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>

<script>
const isActive = ref(true)
const hasError = ref(false)
</script>

<!-- 第二种 -->
<div :class="classObject"></div>

<script>
    const classObject = reactive({
      active: true,
      'text-danger': false
    })
</script>

<!-- 第三种：计算属性 -->
<div :class="classObject"></div>

<script>
	const isActive = ref(true)
	const error = ref(null)

    const classObject = computed(() => ({
      active: isActive.value && !error.value,
      'text-danger': error.value && error.value.type === 'fatal'
    }))
</script>
```

<br />

### 绑定数组

```vue
<!-- 第一种 -->
<div :class="[activeClass, errorClass]"></div>

<!-- 第二种 -->
<div :class="[isActive ? activeClass : '', errorClass]"></div>

<!-- 第三种 -->
<div :class="[{ active: isActive }, errorClass]"></div>

<script>
const activeClass = ref('active')
const errorClass = ref('text-danger')
const isActive = ref(true)
</script>
```

<br />

### 绑定组件

1. 对于只有一个根元素的组件，当你使用了 `class` attribute 时，这些 class 会被添加到根元素上，并与该元素上已有的 class 合并。

2. 如果你的组件有多个根元素，你将需要指定哪个根元素来接收这个 class。你可以通过组件的 `$attrs` 属性来实现指定。

   ```vue
   <!-- MyComponent 模板使用 $attrs 时 -->
   <p :class="$attrs.class">
   Hi!
   </p>

   <span>
   This is a child component
   </span>

   <!-- 父组件 -->
   <MyComponent class="baz" />

   <!-- 渲染结果 -->
   <p class="baz">
   Hi!
   </p>

   <span>
   This is a child component
   </span>
   ```

<br />

## 绑定内联样式

### 绑定对象

```vue
<!-- 第一种 -->
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>

<!-- 尽管推荐使用 camelCase，但 :style 也支持 kebab-cased 形式的 CSS 属性 key (对应其 CSS 中的实际名称) -->
<div :style="{ 'font-size': fontSize + 'px' }"></div>

<script>
const activeColor = ref('red')
const fontSize = ref(30)
</script>

<!-- 第二种 -->
<div :style="styleObject"></div>

<script>
	const styleObject = reactive({
      color: 'red',
      fontSize: '13px'
    })
</script>
```

::: tip

第三种：如果样式对象需要更复杂的逻辑，也可以使用返回样式对象的计算属性。

:::

<br />

### 绑定数组

我们还可以给 `:style` 绑定一个包含多个样式对象的数组。这些对象会被合并后渲染到同一元素上：

```vue
<div :style="[baseStyles, overridingStyles]"></div>
```

<br />

### 自动前缀

当你在 `:style` 中使用了需要[浏览器特殊前缀](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix)的 CSS 属性时，Vue 会自动为他们加上相应的前缀。Vue 是在运行时检查该属性是否支持在当前浏览器中使用。如果浏览器不支持某个属性，那么将尝试加上各个浏览器特殊前缀，以找到哪一个是被支持的。

<br />

### 样式多值

数组仅会渲染浏览器支持的最后一个值。

```vue
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```
