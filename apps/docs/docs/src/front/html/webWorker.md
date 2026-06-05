# Web Worker

Web Workers 是一种在浏览器后台线程中运行 JavaScript 的机制。它允许将长时间运行的 JavaScript 脚本放在后台线程中运行，从而不会阻塞 UI 线程（也就是我们常说的主线程）。Web Workers 可以与主线程进行通信，从而将后台线程中运行任务结果返回给主线程，并且此过程完全由开发者自行掌控。

## 基础用法

### 创建Worker文件

- Worker 线程内部需要有一个监听函数，用来监听 `message` 事件，也就是监听主线程传过来的数据
- `self` 代表子线程本身，也就是子线程的全局对象，等价于 `this | global` 等全局对象
- 可以通过 `self.postMessage(result)` 方法来给主线程传回处理后的结果数据

```js
// worker.js
self.addEventListener('message', (e) => {
  const n = e.data
  const result = fibonacci(n)
  self.postMessage(result)
}, false)

function fibonacci(n) {
  if (n <= 1)
    return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}
```

<br />

### 创建Web Worker对象

- 主线程创建 Worker 对象：

  ```js
  const worker = new Worker('js/worker.js')
  ```

- 主线程向子线程传递数据：

  ```js
  worker.postMessage(data)
  ```

- 主线程接收子线程传递回的结果：

  ```js
  woker.addEventListener('message', (e) => {
    result = e.data
  }, false)
  ```

::: info

主进程创建 Web Worker 对象的同时，子进程也就是 Web Worker 文件的代码就会运行，可以简单理解为一个 JavaScript 文件被加载完成。

:::

<br />

### 终止Worker对象

当创建 Worker 后，主线程会不断监听来自子线程的消息，即使是子线程已经完成工作再也不会被用到了，如需终止 Worker，并释放浏览器资源，开发者可以使用 `terminate()` 方法。

```js
worker.terminal()
```

<br />

## Workers 分类

::: tip 共享Worker与专用Worker的区别

1. 创建一个 `SharedWorker` 对象，并监听 `onconnect` 事件。
2. 当一个页面连接到 Shared Worker 时，将添加一个 `message` 事件监听器，以接收从页面发送的消息。
3. 开发者应该保存一个数组来存储所有连接到 Shared Worker 的页面的端口，以便必要时向它们发送消息。

:::

<br />

## 高级用法

### 使用第三方库

1. 在 Worker 文件中导入第三方库的脚本文件，可以使用 `importScripts()` 函数来加载这些文件

   ```js
   // worker.js
   importScripts('xxx.js')
   ```

2. 在Worker文件中编写代码，使用该库提供的API来完成任务

   ```js
   // worker.js
   const result = xxx.doSth()
   ```

3. 将结果发送回主线程

   ```js
   // worker.js
   postMessage(result)
   ```

4. 在主线程中，监听Worker对象的message事件，以获取Worker发送的消息

   ```js
   // main.js
   worker.addEventListener('message', (event) => {
     console.log('Received message from Web Worker:', event.data)
   })
   ```

::: warning

有些第三方库可能依赖于 DOM 或其他浏览器特定的 API，这些 API 在 Web Workers 中是不可用的。因此开发者需要确保使用的库是 Web Workers 兼容的

:::

<br />

### 处理错误

每个 Worker 实例都具有自己的全局上下文，因此错误处理需要在对应的 Worker 文件中进行。

1. 在Worker文件中添加错误处理，使用 `onerror` 事件监听器来捕获未捕获的错误，并执行适当的操作

   ```js
   // worker.js
   onerror = function (event) {
     console.error('Error in Web Worker:', event)
   }
   ```

2. 在 Worker 文件中，使用 `try-catch` 语句来捕获可能引发错误的代码块，并在 `catch` 语句中执行适当的操作

   ```js
   try {
     const result = 1 / 0 // 引发除以零的错误
   }
   catch (error) {
     console.error('Error in Web Worker:', error.message)
     // 可以在这里执行适当的操作，例如向主线程发送错误消息
   }
   ```

3. 在主线程中，监听 `worker` 对象的 `error` 事件，以获取 Worker 的错误消息

   ```js
   worker.addEventListener('error', (event) => {
     console.error('Error in Web Worker:', event.message, 'at', event.filename, 'line', event.lineno)
     // 可以在这里执行适当的操作，例如显示错误消息给用户
   })
   ```

<br />

## 注意事项

- **无法访问 DOM**

Web Workers 运行在一个与主线程分离的上下文中，因此它们**不能直接访问 DOM**，这是使用 Web Workers 之前需要了解并注意的最重要的一点。如果需要操作 DOM，开发者需要向 Web Workers 传递必要的数据，然后在 Worker 线程中执行操作，并将结果传递回主线程。

- 访问主线程数据

Web Workers 运行在一个与主线程分离的上下文中，因此无法直接访问主线程的数据。如果开发者需要将数据传递给 Worker 线程，需要对数据进行序列化操作，并将其传递给 Worker 线程。

- 内存管理

Web Workers 运行在独立的 JavaScript 线程中，因此它们具有自己独立的内存空间，如果在 Web Workers 中创建了大量的对象或数组，开发者需要确保在使用它们后及时释放它们，以避免内存泄漏的问题。

- 资源限制

Web Workers 受到一些资源限制，例如它们不能打开新的窗口或访问本地文件系统。如果您需要执行这些操作，可能需要使用其他技术，例如 Shared Workers 或 Service Workers 等方案。

<br />
