#### 特性

- 直观，像定义 `compnents` 一样地定义 `store`
- 完整的 `typescript` 支持
- 去除 `mutations`，只有 `state`, `getters`, `actions`
- `actions` 支持同步和异步
- `Vue Devtools` 支持 `Pinia`，提供更好的开发体验
- 能够构建多个 `stores`，并实现自动地代码拆分
- 极其轻量(1KB)，甚至感觉不到它的存在

<br />

#### 1. 安装

```shell
pnpm add pinia

# or

yarn add pinia

# or

npm install pinia
```

<br />

#### 2. 创建

```js
import { createPinia } from 'docs/src/FrontEnd/vue/pinia'

const pinia = createPinia()
app.use(pinia)
```

<br />

#### 3. 定义 store

```typescript
import { defineStore } from 'pinia'

export default defineStore('main', {
  state: () => ({
    count: 10,
  }),
})
```

<br />

#### 4. 使用

<br />

##### 1. 普通使用

```typescript
import { useMainStore, IMainStore } from '@/store/main'

const store: IMainStore = useMainStore()

// state 修改的方式
const handleAdd = () => {
    store.count++ // 第一种
}
```

<br />

##### 2. 解构使用

```typescript
import { useMainStore, IMainStore } from '@/store/main'
import { storeToRefs } from 'pinia'

const store: IMainStore = useMainStore()
let { count } = storeToRefs(store) // 第二种修改：保留解构响应式

// state 修改的方式
const handleAdd = () => {
    count.value++ // 第二种
}

// $patch 修改
const handleSub = () => {
    store.$patch({
        count: store.count - 1
    })
}

// $patch 函数修改
const handleTimes = () => {
    store.$patch((state: IMainStore) => {
        state.count *= 2
    })
}

// 替换state
const handleToggle = () => {
    store.$state = {
        count: 100
    }
}

// 重置state
const resetState = () => {
    store.$reset()
}

// 监听state
store.$subscribe((mutation, state) => {
    console.log('数据变化：', mutation, state)
}, {

})

// 监听actions
store.$onAction((args) => {
    console.log('args:', args)
}, true) // true表示组件销毁后继续监听
```

<br />

##### 3. getters

```js
export default defineStore('main', {
  state: (): IMainStore => ({
    count: 10,
  }),

  getters: {
    double: (state) => state.count * 2,

    // 使用this
    times: () => {
        return this.count * 2
    }
  },
})

// 普通使用
<div class="getters">{{ store.double }}</div>

// 解构使用
<div class="getters">{{ double }}</div>

let { double } = storeToRefs(store)
```

<br />

##### 4. actions

```js
// 同步和异步都可以
export default defineStore('main', {
  actions: {
    async getQuestion() {
      const res = await axios.get('/public/question.json')
      this.question = res.data.data
    },
  },
})

<button @click="store.getQuestion">获取异步数据</button>
```

<br />

##### 5. 插件

```js

```
