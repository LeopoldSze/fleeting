# Promise

## 简介

- `ES6` 异步编程的一种解决方案，比传统的方案（回调函数和事件）更加的合理和强大
- 好处是异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数
- `promise` 可以解决异步的问题，本身不能说 `promise` 是异步的

**特点：**

1. **对象的状态不受外界影响**。`Promise` 对象代表一个异步操作，有三种状态：`pending`（进行中）、`resolved`（已成功）和`rejected`（已失败）

2. **一旦状态改变，就不会再变，任何时候都可以得到这个结果**。`Promise` 对象的状态改变，只有两种可能：从`pending` 变为 `resolved` 和从 `pending` 变为 `rejected`

3. `promise` 内部发生错误，不会影响到外部程序的执行。

4. 无法取消 `Promise`。一旦新建它就会立即执行，无法中途取消。其次，如果不设置回调函数，`Promise` 内部抛出的错误，不会反应到外部。第三，当处于`pending`状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）

<br />

## 基础用法

1. 创造`Promise`实例时，必须传入一个函数作为参数。该函数可以接收另外两个由JavaScript引擎提供的函数，`resolve`和`reject`。函数作用：

   - `resolve`——将`Promise`对象的状态从`pending`变为`resolved`，将异步操作的结果，作为参数传递出去
   - `reject`——将`Promise`对象的状态从`pending`变为`rejected`，将异步操作报出的错误，作为参数传递出去

   ```js
   new Promise(() => {})
   new Promise() // 报错

   const promise = new Promise((resolve, reject) => {
     // do something
     if (true) {
       // 将参数返回，供then方法使用
       resolve('value')
     }
     else {
       // 将参数返回，供then方法使用
       reject('error')
     }
   })
   ```

2. `Promise` 实例生成以后，可以用`then`方法分别指定 `resolved` 状态和 `rejected` 状态的回调函数。

   ```js
   promise.then(
     (value) => {
       // resolved时调用，value为resolve函数返回的参数
       console.log(value)
     },
     (err) => {
       // rejected时调用，err为reject函数返回的参数
       console.log(err)
     }
   )
   ```

   当 `then` 方法只有一个函数参数时，此时为 `resolved` 状态的回调方法。

   ```js
   promise.then((value) => {
     // 只有状态为resolved时才能调用，如果返回的是rejected状态，则报错 Uncaught (in promise) error
     console.log(value)
   })
   ```

::: warning

- 只有当promise的状态变为resolved或者rejected时，then方法才会被调用

- Promise 新建后就会立即执行，并且调用 `resolve` 或 `reject` 后不会终结 `Promise` 的参数函数的执行

  ```js
  const promise = new Promise((resolve) => {
    console.log('Promise');
    resolve()
    console.log('!!!')
  })

  promisethen(() => {
    console.log('resolved.'))
  }
  console.log('Hi!'))

  // Promise
  // !!!
  // Hi!
  // resolved
  ```

:::

3. `resolve` 或者 `reject` 返回的是另外一个`Promise`实例

```js
const p1 = new Promise((_, reject) => {
  setTimeout(() => reject('error'), 3000)
})

const p2 = new Promise((resolve) => {
  setTimeout(() => resolve(p1), 1000)
})

p2.then(
  result => console.log(result),
  error => console.log(error) // error
)
```

::: details 代码说明

上面代码中，`p1`是一个 `Promise`，3 秒之后变为`rejected`。`p2`的状态在 1 秒之后改变，`resolve`方法返回的是`p1`。由于`p2`返回的是另一个 Promise，导致`p2`自己的状态无效了，由`p1`的状态决定`p2`的状态。所以，后面的`then`语句都变成针对后者（`p1`）。又过了 2 秒，`p1`变为`rejected`，导致触发`catch`方法指定的回调函数。

:::

<br />

## 静态方法

### Promise.resolve()

> **作用**：该方法返回一个以给定值解析后的 `Promise` 实例对象

```js
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

> **参数**：分为四种情况：

1. 参数是一个 `Promise` 实例：如果参数是 `Promise` 实例，那么 `Promise.resolve` 将不做任何修改、原封不动地返回这个实例

   ```js
   const promise = new Promise((resolve, reject) => {
     reject('resolve')
   })

   const p = Promise.resolve(promise)
   console.log(p == promise) // true
   ```

2. 参数是一个 `thenable` 对象：`thenable` 对象指的是具有 `then` 方法的对象， `Promise.resolve()` 方法会将这个对象转为 `Promise` 对象，然后就立即执行 `thenable` 对象的 `then()` 方法,，返回的 `promise` 会“跟随”这个 `thenable` 的对象，采用它的最终状态

   ```js
   // thenable对象
   const thenable = {
     then(resolve, reject) {
       reject(42)
     }
   }

   constp1 = Promise.resolve(thenable))
   p1then((value) => {
     console.log('resolved', value)
   }, e(err)=> {
     console.log('rejected', err) // 42
   }))
   ```

3. 参数是非 `thenable` 对象，或非对象

   ```js
   const p = Promise.resolve('Hello')
   p.then((s) => {
     console.log(s) // Hello
   })
   ```

4. 不带任何参数：`Promise.resolve()` 方法允许调用时不带参数，直接返回一个 `resolved` 状态的 Promise 对象

   ```js
   Promise.resolve()
   // 相当于
   new Promise(resolve => resolve(undefined))
   ```

<br />

### Promise.reject()

> **作用**：返回一个新的状态为 `rejected` 的 `Promise` 实例

```js
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))
```

> **参数**：任何参数都会成为这个拒绝期约的理由，即使是一个 `resolved` 状态的 `promise` 也不行

```js
const promise = Promise.resolve('foo')
const p1 = Promise.reject(promise)

p1.then((value) => {
  console.log('resolved', value)
}, (err) => {
  console.log('rejected', err) // Promise {<fulfilled>: 'foo'}
})
```

<br />

### Promise.all()

> **作用**：用于将多个 `Promise` 实例，包装成一个新的 `Promise` 实例
>
> **特点**：参数全部 `resolved`，状态变为 `resolved`；参数有一个 `rejected`，状态变为 `rejected`
>
> **适用**：多个异步操作全部完成

```js
const p1 = new Promise(() => {})
const p2 = new Promise(() => {})
const p3 = new Promise(() => {})

const p = Promise.all([p1, p2, p3])
```

::: details 代码说明

上面代码中，`Promise.all() `方法接受一个数组作为参数，`p1`、`p2`、`p3` 都是 Promise 实例，如果不是，就会调用 `Promise.resolve` 方法，将参数转为 `Promise` 实例，再进一步处理。另外，`Promise.all() `方法的参数可以不是数组，但必须具有 `Iterator` 接口，且返回的每个成员都是 `Promise` 实例。
`p`的状态由`p1`、`p2`、`p3`决定，分成两种情况。

- 只有`p1`、`p2`、`p3`的状态都变成`resolved`，`p`的状态才会变成`resolved`，此时`p1`、`p2`、`p3`的返回值组成一个数组，传递给`p`的回调函数。
- 只要`p1`、`p2`、`p3`之中有一个被`rejected`，`p`的状态就变成`rejected`，此时第一个被`reject`的实例的返回值，会传递给`p`的回调函数。
- 如果作为参数的 `Promise` 实例，自己定义了`catch`方法，那么它一旦被`rejected`，并不会触发`Promise.all()` 的 `catch`方法。

:::

<br />

### Promise.race()

> **作用**：同样是将多个 `Promise` 实例，包装成一个新的 `Promise` 实例
>
> **特点**：只要参数中有一个实例状态发生改变，返回值就会传递给新实例
>
> **适用**：第一个异步操作完成

```js
const p1 = new Promise(() => {})
const p2 = new Promise(() => {})
const p3 = new Promise(() => {})

const p = Promise.race([p1, p2, p3])
```

::: details 代码说明

上面代码中，只要`p1`、`p2`、`p3`之中有一个实例率先改变状态，`p`的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给`p`的回调函数

:::

<br />

### Promise.allSettled()

> **作用**：接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例
>
> **特点**：所有这些参数实例都返回结果，不管是 `resolved `还是 `rejected`，传递给新实例
>
> **适用**：需要所有 `Promise` 的最终状态

```js
const p2 = Promise.reject(2)
const promise = Promise.allSettled([1, p2, 3])

promise.then((value) => {
  console.log(value)
})
console.log(promise)
// [{status: "fulfilled", value: 1},{status: "rejected", reason: 2},{status: "fulfilled", value: 3}]
```

<br />

### Promise.any()

> **作用**：接受一组 `Promise` 实例作为参数，包装成一个新的 `Promise` 实例返回
>
> **特点**：参数实例有一个变成`resolved`状态，新实例就会变成 `resolved` 状态；所有参数实例都变成`rejected`状态，新实例就会变成`rejected`状态

```js
const p1 = Promise.reject(1)
const p2 = Promise.reject(2)
const promise = Promise.any([p1, p2, 3])
promise.then((value) => {
  console.log(value) // 3
})
console.log(promise)
```

<br />

### Promise.withResolvers() <Badge type="tip" text="ES2024" />

> **作用**：返回一个包含 `Promise` 对象及其 `resolve` 和 `reject` 函数的对象
>
> **特点**：不接收参数，返回一个普通对象，包含以下属性：
>
> - `promise`：一个新的 `Promise` 对象
> - `resolve`：用于解决 `Promise` 的函数
> - `reject`：用于拒绝 `Promise` 的函数
>
> **适用**：
>
> - 需要在 `Promise` 创建后仍然能够访问 `resolve` 和 `reject` 函数的场景
> - 适用于处理流、队列或重复事件的场景

```js
const { promise, resolve, reject } = Promise.withResolvers()

setTimeout(() => {
  resolve('成功！')
}, 1000)

promise.then(value => console.log(value)) // 输出: 成功！
```

<br />

### Promise.try() <Badge type="tip" text="ES2025" />

> **作用**：将任意回调函数（无论同步或异步）封装为一个 `Promise`，并统一处理其成功或失败的结果
>
> **特点**：返回一个 `Promise`，其状态取决于回调函数的执行结果：
>
> - 如果回调函数同步返回一个值，`Promise` 状态为 `fulfilled`
> - 如果回调函数同步抛出错误，`Promise` 状态为 `rejected`
> - 如果回调函数返回一个 `Promise`，则 `Promise` 状态由该 `Promise` 决定
>
> **适用**：
>
> - 需要将同步或异步操作统一封装为 `Promise`，避免手动处理错误
> - 适用于需要统一处理同步和异步错误的场景

```js
function doSomething(action) {
  return Promise.try(action)
    .then(result => console.log(result))
    .catch(error => console.error(error))
    .finally(() => console.log('完成'))
}

doSomething(() => '同步的结果') // 输出: 同步的结果
doSomething(() => {
  throw new Error('同步的错误') // 输出: Error: 同步的错误
})
```

<br />

| 方法                          | 功能描述                                                             | 返回值                                       | 使用场景                          | ES 版本    | 支持时间     |
| :---------------------------- | :------------------------------------------------------------------- | :------------------------------------------- | :-------------------------------- | :--------- | :----------- |
| **`Promise.resolve()`**       | 将值转换为已解决的 `Promise`                                         | `fulfilled` 的 `Promise`                     | 包装非 `Promise` 值               | ES6 (2015) | 2015 年 6 月 |
| **`Promise.reject()`**        | 返回已拒绝的 `Promise`                                               | `rejected` 的 `Promise`                      | 快速创建失败的 `Promise`          | ES6 (2015) | 2015 年 6 月 |
| **`Promise.all()`**           | 等待所有 `Promise` 成功，或第一个失败                                | 结果数组或第一个失败原因                     | 多个异步操作全部完成              | ES6 (2015) | 2015 年 6 月 |
| **`Promise.allSettled()`**    | 等待所有 `Promise` 完成（无论成功或失败）                            | 包含每个 `Promise` 结果的对象数组            | 需要所有 `Promise` 的最终状态     | ES2020     | 2020 年 6 月 |
| **`Promise.any()`**           | 等待第一个成功的 `Promise`，或所有失败                               | 第一个成功的结果或 `AggregateError`          | 任意一个异步操作成功即可          | ES2021     | 2021 年 6 月 |
| **`Promise.race()`**          | 返回第一个完成的 `Promise`（无论成功或失败）                         | 第一个完成的 `Promise` 的结果                | 第一个完成的异步操作，或超时控制  | ES6 (2015) | 2015 年 6 月 |
| **`Promise.withResolvers()`** | 返回一个包含 `Promise` 及其 `resolve` 和 `reject` 函数的对象         | 包含 `promise`、`resolve` 和 `reject` 的对象 | 需要手动控制 `Promise` 状态的场景 | ES2024     | 2024 年 3 月 |
| **`Promise.try()`**           | 将回调函数（同步或异步）封装为 `Promise`，并统一处理成功或失败的结果 | 一个 `Promise`                               | 统一处理同步和异步错误            | ES2025     | 2025 年 1 月 |

::: info 总结对比

- `Promise.all()` 返回全部实例的一组 `resolved` 或者任意一个实例 `rejected`，类似 &。
- `Promise.race()` 返回全部实例中最先状态改变的那个实例结果，不论是 `resolved` 还是 `rejected`。
- `Promise.any()` 返回全部实例中任意一个 `resolved` 或者一组 `rejected` 状态，类似 |。
- `Promise.allSettled()` 只有当全部实例状态都改变，才返回，不管是 `resolved` 还是 `rejected`。

:::

<br />

## 原型方法

### then()

> **说明**：定义在原型对象 `Promise.prototype` 上的，用于 `Promise` 兑现和拒绝情况的回调函数。它立即返回一个等效的 `Promise` 对象，允许你链接到其他 Promise 方法，从而实现链式调用。
>
> **参数**：两个参数都是非必选的
>
> **返回值**：返回一个全新的 `promise` 实例，因此then方法可以链式调用。如果参数处理函数：
>
> - 返回一个值：`p` 以该返回值作为其兑现值。
> - 没有返回任何值：`p` 以 `undefined` 作为其兑现值。
> - 抛出一个错误：`p` 抛出的错误作为其拒绝值。
> - 返回一个已兑现的 Promise 对象：`p` 以该 Promise 的值作为其兑现值。
> - 返回一个已拒绝的 Promise 对象：`p` 以该 Promise 的值作为其拒绝值。
> - 返回另一个待定的 Promise 对象：`p` 保持待定状态，并在该 Promise 对象被兑现/拒绝后立即以该 Promise 的值作为其兑现/拒绝值。

1. 当未传入处理程序时或者未成功调用then方法时则原样向后传。

   ```js
   // 未传入处理程序
   const p1 = Promise.resolve('foo')
   const pt1 = p1.then()
   console.log(p1) // Promise <resolved>: foo
   console.log(pt1) // Promise <resolved>: foo

   // 未成功调用then方法
   const p2 = Promise.reject('bar')
   const pt2 = p2.then((value) => {
     console.log(value)
   }))
   consolelog(p2) // Promise <rejected>: bar
   console.log(pt2) // Promise <rejected>: bar
   ```

2. 用`Promise.resolve()`包装返回值，默认的返回值为`undefined`。

   ```js
   const pt3 = p1.then((value) => {
     console.log(value) // foo
   })
   console.log(pt3) // Promise <>
   ```

<br />

### catch()

> **作用**：用于注册一个在 promise 被拒绝时调用的函数
>
> **参数**：`onRejected`，一个在此 Promise 对象被拒绝时异步执行的函数。它的返回值将成为 `catch()` 返回的 Promise 对象的兑现值
>
> **返回值**：立即返回一个等效的 `Promise` 对象，这可以允许你链式调用其他 promise 的方法。无论当前的 promise 状态如何，这个新的 promise 在返回时总是处于待定（pending）状态。如果调用了 `onRejected`，则返回的 promise 将根据此调用的返回值进行兑现，或者使用此调用引发的错误进行拒绝。如果当前的 promise 已兑现，则 `onRejected` 不会被调用，并且返回的 promise 具有相同的兑现值。

`catch()`方法是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数。`catch()`方法也会返回一个 Promise 对象(同then方法）。

```js
const promise = new Promise((_, reject) => {
  reject('reject')
})

promise.then((value) => {
  console.log(value)
}).catch((value) => { // 发生错误，或者reject时执行
  console.log(value)
})
```

::: warning

- 如果 Promise 状态已经变成 `resolved`，再抛出错误是无效的

- Promise 内部的错误不会影响到 Promise 外部的代码
- promise中所有**没有被处理的错误**都会冒泡到最后一个catch中
- 在异步函数内部抛出的错误会像未捕获的错误一样，如 `setTimeout` 中抛出错误，无法捕获
- 如果Promise已 `resolved`，catch方法不会被调用

:::

```js
const promise = new Promise((resolve) => {
  resolve('resolve')
})
promise
  .then((value) => {
    console.log(value)
    throw new Error('fail1')
  })
  .then(() => {
    throw new Error('fail2')
  })
  .catch((value) => {
    console.log(value)
  })
```

::: details 代码说明
在上面的代码中，catch会优先打印打印第一个错误，当第一个错误解决之后（注释掉就ok），catch里才会打印第二个错误**catch的返回值仍是promise**，返回promise的方式和then相似，因此，catch后仍然可以调用then方法。

:::

<br />

### finally()

> **作用**：用于注册一个在 promise 敲定（兑现或拒绝）时调用的函数。它会立即返回一个等效的 `Promise` 对象，这可以允许你链式调用其他 promise 方法
>
> **参数**：无需参数
>
> **返回值**：返回值将被忽略，除非返回一个被拒绝的 promise。立即返回一个新的 `Promise`。无论当前 promise 的状态如何，此新的 promise 在返回时始终处于待定（pending）状态。如果 `onFinally` 抛出错误或返回被拒绝的 promise，则新的 promise 将使用该值进行拒绝。否则，新的 promise 将以与当前 promise 相同的状态敲定（settled）

```js
const promise = new Promise((resolve) => {
  resolve('resolve')
})
promise.finally(() => {
  console.log(11) // 11
})
```

<br />
