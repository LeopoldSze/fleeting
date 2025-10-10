::: tip 小提示

在底层机制中，Vue 会将模板编译成高度优化的 JavaScript 代码。结合响应式系统，当应用状态变更时，Vue 能够智能地推导出需要重新渲染的组件的最少数量，并应用最少的 DOM 操作。

如果你对虚拟 DOM 的概念比较熟悉，并且偏好直接使用 JavaScript，你也可以结合可选的 JSX 支持[直接手写渲染函数](https://cn.vuejs.org/guide/extras/render-function.html)而不采用模板。但请注意，这将不会享受到和模板同等级别的编译时优化。

:::

## 文本插值

最基本的数据绑定形式是文本插值，它使用的是“Mustache”语法 (即双大括号)：

```vue
<span>
Message: {{ msg }}
</span>
```

<br />

## 原始HTML

双大括号会将数据解释为纯文本，而不是 HTML。若想插入 HTML，你需要使用 `v-html` 指令：

```vue
<p>
Using v-html directive: <span v-html="rawHtml"></span>
</p>
```

指令由 `v-` 作为前缀，表明它们是一些由 `Vue` 提供的特殊 attribute，它们将为渲染的 DOM 应用特殊的响应式行为。

::: warning

不能使用 `v-html` 来拼接组合模板，因为 Vue 不是一个基于字符串的模板引擎。在使用 Vue 时，应当使用组件作为 UI 重用和组合的基本单元。

:::

<br />

## Attribute 绑定

双大括号不能在 HTML attributes 中使用。想要响应式地绑定一个 attribute，应该使用 `v-bind` 指令：

```vue
<!--完整写法-->
<div v-bind:id="dynamicId"></div>

<!--简写-->
<div :id="dynamicId"></div>
```

`v-bind` 指令指示 `Vue` 将元素的 `id` attribute 与组件的 `dynamicId` 属性保持一致。

::: tip

如果绑定的值是 `null` 或者 `undefined`，那么该 attribute 将会从渲染的元素上移除。

:::[](https://github.com/vuejs/core/blob/main/packages/shared/src/globalsAllowList.ts#L3)

<br />

### 布尔型Attribute

[布尔型 attribute](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes#布尔值属性) 依据 true / false 值来决定 attribute 是否应该存在于该元素上。

```vue
<button :disabled="isButtonDisabled">
Button
</button>
```

当 `isButtonDisabled` 为[真值](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)或一个空字符串 (即 `<button disabled="">`) 时，元素会包含这个 `disabled` attribute。而当其为其他[假值](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)时 attribute 将被忽略。

<br />

### 绑定多个值

```vue
<div v-bind="objectOfAttrs"></div>

<script>
export default {
  data() {
    return {
      objectOfAttrs: {
        id: 'container',
        class: 'wrapper'
      }
    }
  }
}
</script>
```

<br />

### 使用 JavaScript 表达式

这些表达式都会被作为 JavaScript ，**以当前组件实例为作用域**解析执行。

在 `Vue` 模板内，JavaScript 表达式可以被使用在如下场景上：

- 在文本插值中 (双大括号)
- 在任何 `Vue` 指令 (以 `v-` 开头的特殊 attribute) attribute 的值中

<br />

#### 仅支持表达式

```vue
{{ number + 1 }}
{{ ok ? 'YES' : 'NO' }}
{{ message.split('').reverse().join('') }}
<div :id="`list-${id}`"></div>
```

::: warning 注意

每个绑定仅支持**单一表达式**，也就是一段能够被求值的 JavaScript 代码。一个简单的判断方法是是否可以合法地写在 `return` 后面。

:::

<br />

#### 调用函数

```vue
<span :title="toTitleDate(date)">
  {{ formatDate(date) }}
</span>
```

::: warning 注意

支持调用组件暴露的方法，绑定在表达式中的方法在组件每次更新时都会被重新调用，因此**不**应该产生任何副作用，比如改变数据或触发异步操作。

:::

<br />

#### 受限的全局访问

模板中的表达式将被沙盒化，仅能够访问到[有限的全局对象列表](https://github.com/vuejs/core/blob/main/packages/shared/src/globalsAllowList.ts#L3)。该列表中会暴露常用的内置全局对象，比如 `Math` 和 `Date`。

没有显式包含在列表中的全局对象将不能在模板内表达式中访问，例如用户附加在 `window` 上的属性。然而，你也可以自行在 `app.config.globalProperties` 上显式地添加它们，供所有的 `Vue` 表达式使用。

```js
// 有限的全局对象列表
const GLOBALS_WHITE_LISTED
  = 'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,'
    + 'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,'
    + 'Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt'
```

<br />

## 指令 Directives

一个指令的任务是在其表达式的值变化时响应式地更新 DOM。

某些指令会需要一个“参数”，在指令名后通过一个冒号隔开做标识。例如：

```vue
<a v-bind:href="url">
 ...
</a>

<!-- 简写 -->
<a :href="url">
 ...
</a>
```

### 动态参数

```vue
<a v-bind:[attributeName]="url">
 ...
</a>

<!-- 简写 -->
<a :[attributeName]="url">
 ...
</a>
```

::: warning 动态参数值的限制

动态参数中表达式的值应当是一个字符串，或者是 `null`。特殊值 `null` 意为显式移除该绑定。其他非字符串的值会触发警告。

:::

::: warning 动态参数语法的限制

1. 动态参数表达式因为某些字符的缘故有一些语法限制，比如空格和引号，在 HTML attribute 名称中都是不合法的。

2. 如果你需要传入一个复杂的动态参数，我们推荐使用**计算属性**替换复杂的表达式。

3. 当使用 DOM 内嵌模板 (直接写在 HTML 文件里的模板) 时，我们需要避免在名称中使用大写字母，因为浏览器会强制将其转换为小写

:::

<br />

### 修饰符 Modifiers

修饰符是以点开头的特殊后缀，表明指令需要以一些特殊的方式被绑定。

![](https://cn.vuejs.org/assets/directive.69c37117.png)
