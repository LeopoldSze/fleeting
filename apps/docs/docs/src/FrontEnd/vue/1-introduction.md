## 核心功能

- **声明式渲染**：`Vue` 基于标准 HTML 拓展了一套模板语法，使得我们可以声明式地描述最终输出的 HTML 和 JavaScript 状态之间的关系。
- **响应性**：`Vue` 会自动跟踪 JavaScript 状态并在其发生变化时响应式地更新 DOM。

<br />

## 渐进式框架

- 无需构建步骤，渐进式增强静态的 HTML
- 在任何页面中作为 `Web Components` 嵌入
- 单页应用 (SPA)
- 全栈 / 服务端渲染 (SSR)
- `Jamstack` / 静态站点生成 (SSG)
- 开发桌面端、移动端、WebGL，甚至是命令行终端中的界面

<br />

## 单文件组件

- 在大多数启用了构建工具的 `Vue` 项目中，可以使用一种类似 HTML 格式的文件来书写 `Vue` 组件，它被称为**单文件组件** (也被称为 `*.vue` 文件，英文 `Single-File Components`，缩写为 **SFC**)。
- `Vue` 的单文件组件会将一个组件的逻辑 (JavaScript)，模板 (HTML) 和样式 (CSS) 封装在同一个文件里。

<br />

## API风格

**1. 选项式**

- 使用选项式 API，可以用包含多个选项的对象来描述组件的逻辑，例如 `data`、`methods` 和 `mounted`。

- 选项所定义的属性都会暴露在函数内部的 `this` 上，它会指向当前的组件实例。

  ```vue
  <script>
  export default {
    // data() 返回的属性将会成为响应式的状态
    // 并且暴露在 `this` 上
    data() {
      return {
        count: 0
      }
    },

    // 生命周期钩子会在组件生命周期的各个不同阶段被调用
    // 例如这个函数就会在组件挂载完成后被调用
    mounted() {
      console.log(`The initial count is ${this.count}.`)
    },

    // methods 是一些用来更改状态与触发更新的函数
    // 它们可以在模板中作为事件监听器绑定
    methods: {
      increment() {
        this.count++
      }
    }
  }
  </script>

  <template>
    <button @click="increment">
  C                                                                            ount is: {{ count }}
  <                                                                          /button>
  </t           `<        b
  utt        e>`
  ``<                /t</b
  utt        emplate>`
  ``<        /t</b
  utton>emplate>`
  ``</template>`

<br />

**2. 组合式**

- 可以使用导入的 API 函数来描述组件逻辑。

- 在单文件组件中，组合式 API 通常会与 `<script setup>` 搭配使用。

- `setup` attribute 是一个标识，告诉 `Vue` 需要在编译时进行一些处理，让我们可以更简洁地使用组合式 API。

- `<script setup>` 中的导入和顶层变量/函数都能够在模板中直接使用。

  ````vue
  <script setup>
  import { onMounted, ref } from 'vue'

  // 响应式状态
  const count = ref(0)

  // 用来修改状态、触发更新的函数
  function increment() {
    count.value++
  }

  // 生命周期钩子
  onMounted(() => {
    console.log(`The initial count is ${count.value}.`)
  })
  </script>

  <template>
    <button @click="increment">
  Coun                                                                            t is: {{ count }}
  </bu              ``<         bu
  tton         ate>`
  ```<        /te</bu
  tton>mplate>`
  ```</template>`

::: tip 生产环境建议

- 当你不需要使用构建工具，或者打算主要在低复杂度的场景中使用 `Vue`，例如渐进增强的应用场景，推荐采用选项式 API。
- 当你打算用 `Vue` 构建完整的单页应用，推荐采用组合式 API + 单文件组件。

:::

<br />

## 通过CDN使用

- 通过 CDN 使用 `Vue` 时，不涉及“构建步骤”。这使得设置更加简单，并且可以用于增强静态的 HTML 或与后端框架集成。
- 但是，你将无法使用单文件组件 (SFC) 语法。

**版本区别：**

1. **全局构建版本**：该版本的所有顶层 API 都以属性的形式暴露在了全局的 `Vue` 对象上。

   ```js
   <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
   ```

2. **ES 模块构建版本**：

   ```vue
   <script type="module">
     import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
   <script>
   ```

   ES 模块构建版本支持 [导入映射表](https://caniuse.com/import-maps)：来告诉浏览器如何定位到导入的模块。

   ```vue
   <script type="importmap">
     {
       "imports": {
         "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
       }
     }
   </script>

   <script type="module">
     import { createApp } from 'vue'
   <script>
   ```

::: warning 注意

因为 ES 模块不能通过 `file://` 协议工作。为了使其工作，你需要使用本地 HTTP 服务器通过 `http://` 协议提供 `index.html`。

:::
