# HTML5

## 代码结构

```html
<!doctype html>
<html>
  <head>
    <title>Page Title</title>
  </head>
  <body>
    <h1>This is a Heading</h1>
    <p>This is a paragraph.</p>
  </body>
</html>

```

`<!DOCTYPE>` 声明告诉浏览器使用 HTML5 规范来渲染页面。`<html>` 根元素包含整个页面的内容，`<head>` 元素包含页面的元数据，包括标题和其他信息。`<body>` 元素包含页面的主体内容，如文本、图像和其他元素。

<br />

## 新特性

- **语义化标签：** 比如 `<header>`，`<nav>`，`<footer>` 和 `<section>` 等。

  ::: details

  标签及其对应含义：

  - `<header>`：用于表示页面或者页面中某个区域的页眉，通常包含网站的标志、导航菜单、搜索框等内容。
  - `<nav>`：用于表示页面或者页面中某个区域的导航菜单。
  - `<main>`：用于表示页面的主要内容，每个页面只能有一个 `<main>` 标签。
  - `<section>`：用于表示文档中的一个区域，通常包含一个标题。
  - `<article>`：用于表示一篇独立的文章或者内容块，通常包括标题、作者、日期和正文等内容。
  - `<aside>`：用于表示页面或者页面中某个区域的附加内容，比如侧栏、广告、标签等。
  - `<footer>`：用于表示页面或者页面中某个区域的页脚，通常包含版权信息、联系方式等内容。
  - `<figure>`：定义一段独立的流内容（图像、图表、照片、代码清单等）。
  - `<figcaption>`：定义`<figure>`元素的标题或说明。

  :::

- **Web 表单 2.0：** 改进了 HTML Web 表单，为 标签引入了一些新的属性。

- **离线数据访问：** 为了不通过第三方插件实现。

- **WebSocket：** 用于 Web 应用程序的下一代双向通信技术。

- **服务器推送事件：** HTML5 引入了从 Web 服务器到 Web 浏览器的事件，也被称作服务器推送事件（SSE）。

- **Canvas：** 支持用 JavaScript 以编程的方式进行二维绘图。

- **音频和视频：** 在网页中嵌入音频或视频而无需借助第三方插件。

- **地理定位：** 用户可以选择与我们的网页共享他们的地理位置。

- **微数据：** 允许我们创建 HTML5 之外的自定义词汇表，以及使用自定义语义扩展网页。

- **拖放：** 把同一网页上的条目从一个位置拖放到另一个位置。

<br />

## 地理定位

### 请求授权并获取位置信息

```html{2,3}
<script>
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    // 成功获取用户位置
  }, function(error) {
    // 获取用户位置失败
  });
} else {
  // 浏览器不支持地理定位
}
</script>
```

- **`getCurrentPosition()` 返回值**

| 属性                      | 描述                   |
| ------------------------- | ---------------------- |
| `coords.latitude`         | 十进制数的纬度         |
| `coords.longitude`        | 十进制数的经度         |
| `coords.accuracy`         | 位置精度               |
| `coords.altitude`         | 海拔，海平面以上以米计 |
| `coords.altitudeAccuracy` | 位置的海拔精度         |
| `coords.heading`          | 方向，从正北开始以度计 |
| `coords.speed`            | 速度，以米/每秒计      |
| `timestamp`               | 响应的日期/时间        |

- **错误处理**

| 属性                                        | 描述                   |
| ------------------------------------------- | ---------------------- |
| `error.code === error.PERMISSION_DENIED`    | 用户拒绝了地理定位请求 |
| `error.code === error.POSITION_UNAVAILABLE` | 地理位置信息不可用     |
| `error.code === error.TIMEOUT`              | 获取位置信息超时       |
|                                             | 其他错误               |

<br />

### 实时监听位置

- 可以使用 `Geolocation.watchPosition(fn)` 来不断监听用户的位置信息以及更新过后的位置信息。

```html{4}
<script>
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition);
  } else {
      console.log("浏览器不支持地理定位 API");
  }
}
function showPosition(position) {
  console.log(`用户当前位置: Latitude: ${position.coords.latitude} Longitude: ${position.coords.longitude}`);
}
</script>
```

- **取消实时监听**：可以使用 `Geolocation.clearWatch()` 方法取消对用户地理位置信息的监听。

<br />

## Drag & Drop

在拖放过程中，通常需要用到两个事件：`dragstart` 和 `dragover`。

- 当用户开始拖动一个元素时，会触发 `dragstart` 事件。
- 当用户将拖动的元素拖到指定的区域时，会触发 `dragover` 事件。

除了这两个核心事件之外，还有一些其他的 API 会在拖放的不同阶段触发。

| 事件        | 描述                                                                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `dragstart` | 用户开始拖动对象时触发。                                                                                                                                     |
| `dragenter` | 鼠标初次移到目标元素并且正在进行拖动时触发。这个事件的监听器应该指出这个位置是否允许放置元素。如果没有监听器或者监听器不执行任何操作，默认情况下不允许放置。 |
| `dragover`  | 拖动时鼠标移到某个元素上的时候触发。大多数时候，监听器触发的操作与 `dragenter` 事件相同。                                                                    |
| `dragleave` | 拖动时鼠标离开某个元素的时候触发。监听器应该移除用于放置反馈的高亮或插入标记。                                                                               |
| `drag`      | 对象被拖拽时每次鼠标移动都会触发。                                                                                                                           |
| `drop`      | 拖动操作结束，放置元素时触发。监听器负责检索被拖动的数据以及在放置位置插入它。                                                                               |
| `dragend`   | 拖动对象时用户释放鼠标按键的时候触发。                                                                                                                       |

::: tip

拖放 API 在拖放期间只会触发拖放事件，对于拖放操作期间的鼠标事件，比如 `mousemove` 事件并不会触发。

:::

<br />

### 拖放对象 DragTransfer

拖放对象（DragTransfer）是 HTML5 中用于表示拖动操作的数据传输对象。它包含了一些属性和方法，可以帮助开发者在拖放过程中传输数据。

- **DragTransfer 属性**

| 属性                    | 描述                                             |
| ----------------------- | ------------------------------------------------ |
| `types`                 | 包含了可用数据类型的 DOMString 列表。            |
| `effectAllowed`         | 表示拖动操作的可接受效果的 DOMString。           |
| `dropEffect`            | 表示放置操作的效果的 DOMString。                 |
| `files`                 | 包含了用户拖动到拖放区域内的文件的 FileList。    |
| `setData(format, data)` | 添加指定类型给定的数据                           |
| `getData(format)`       | 返回指定的数据。如果没有该数据则返回空字符串。   |
| `clearData([format])`   | 移除指定格式的数据。如果省略参数则移除所有数据。 |

- **拖放Types**：包含了可用数据类型的 DOMString 列表，表示可以在拖放操作中传输的数据类型。

| 类型               | 描述                           |
| ------------------ | ------------------------------ |
| `text/plain`       | 表示纯文本数据类型。           |
| `text/html`        | 表示 HTML 格式的文本数据类型。 |
| `text/xml`         | 表示 XML 格式的文本数据类型。  |
| `text/uri-list`    | 表示一个 URL 列表。            |
| `application/json` | 表示 JSON 格式的数据类型。     |
| `image/png`        | 表示 PNG 格式的图片数据类型。  |
| `image/jpeg`       | 表示 JPEG 格式的图片数据类型。 |
| `image/gif`        | 表示 GIF 格式的图片数据类型。  |
| `audio/mpeg`       | 表示 MP3 格式的音频数据类型。  |
| `video/mp4`        | 表示 MP4 格式的视频数据类型。  |
| `application/pdf`  | 表示 PDF 格式的文档数据类型。  |

<br />

### 如何使用 DragTransfer 对象

在拖放过程中，可以使用 `dataTransfer` 属性来访问拖放对象。在拖动元素时，使用 `setData` 方法来设置要传输的数据。

```js
// 设置传输数据
event.dataTransfer.setData('text/plain', 'Drag Data')

// 获取传输数据
const data = event.dataTransfer.getData('text/plain') // 获取到的应该是 "Drag Data"
```

::: warning

`getData(format)` 的数据类型必须与 `setData(format, data)` 类型保持一致，如果没有找到对应的数据类型，则返回一个空字符串。

:::

<br />

### 过程示例

1. 创建一个可拖放的对象

   为了让元素可以被拖放，需要将目标元素的标签属性 `draggable` 设置为 `true`。设置完成后，这个元素在页面上就会被标记为可被拖放。

   ```html
   <img src="./image.svg" draggable="true" />
   ```

2. 拖动开始事件 `ondragstart` 和 `DataTransfer.setData`

   设置完成可拖放对象后，需要对元素被拖动的时候会发生什么事件做相应的处理，一般来说通过 `ondragstart` 事件调用一个函数，拖动过程中通过 `DataTransfer.setData` 来对拖动的数据格式以及内容做处理。

   ```html
   <img src="./image.svg" draggable="true" ondragstart="drag(event)" id="drag_container1" />
   ```

   ```js
   function drag(event) {
     event.dataTransfer.setData('text/plain', event.target.id)
   }
   ```

3. 放置到哪里 `ondragover`

   需要处理拖拽元素要放置的位置，`ondragover` 事件规定在何处放置被拖动的数据。

   ```html
   <div class="container" ondragover="allowDrop(event)"></div>
   <div class="container" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
   
   ```

```

```

```

```

```

```

```js{2}
function allowDrop(event) {
  event.preventDefault();
}
```

::: warning

默认情况下，无法将数据或者元素放置到其他元素中。**如果需要设置允许放置，必须阻止对应元素的默认处理方式**。

:::

4. 进行放置 `ondrop`

   当放置被拖元素以及携带的数据时，会发生 `ondrop` 事件，方便开发者处理元素拖放后要处理的回调内容。

   ```html
   <div class="container" ondrop="drop(event)"></div>
   ```

   ```js
   function drop(event) {
     event.preventDefault()
     const data = event.dataTransfer.getData('text/plain')
     event.target.appendChild(document.getElementById(data))
   }
   ```

<br />

## Web Storage

- `localStorage` 对象允许您在浏览器中存储键值对数据，并在用户关闭浏览器后仍然保留这些数据，也就是**永久性存储**。

- `sessionStorage` 对象也允许您在浏览器中存储键值对数据，但是它只在用户关闭浏览器之前保留这些数据，也就是**会话级别存储**。

`localStorage` 和 `sessionStorage` 除了存储时间不同之外，具有完全相同的 API，具体如下：

| API                   | 描述                                    |
| --------------------- | --------------------------------------- |
| `setItem(key, value)` | 存储键值对                              |
| `getItem(key)`        | 获取对应键的内容，如果没有返回为 `null` |
| `removeItem(key)`     | 移除对应键的内容                        |
| `clear()`             | 移除当前域名下面所有的存储内容          |

::: warning

Web Storage 的存储内容只能是 String 类型，如果是其他类型会通过元素自身的 `toString()` 方法将其转换成 String 类型后进行存储，因此如果需要存储对象，需要使用 `JSON.stringify()` 进行转换后存储。

:::

### 与 Cookie 的不同之处

|                  | Cookie                           | Web Storage                                                        |
| ---------------- | -------------------------------- | ------------------------------------------------------------------ |
| 是否与服务器交互 | 会跟随每次 HTTP 请求发送到服务端 | 完全存放到浏览器本地，不与服务端交互，**更安全**                   |
| 存储容量         | 4KB                              | ≈5MB                                                               |
| 存储周期         | 可以通过 js 设置过期时间         | localStorage 永久存储，sessionStorage 会话级别存储                 |
| 可操作性         | 需要自己封装 js 方法操作         | 内置丰富的 api，比如 `getItem()`、`setItem()` 和 `removeItem()` 等 |
| 是否跨域         | 跨域，且需要设置作用域           | 跨域，仅在当前域可用                                               |

### Cookie

1. 不可跨域共享，一级域名可以与二级域名共享，domain属性
2. 数量有限制，约50个
3. 容量小，约4KB

```js
// cookie操作

// 读取cookie
const cookie = document.cookie;

// 设置cookie
document.cookie = 'name=sze;path=xxx;xxx=xxx'; // 键值对形式，名称具有唯一性
```

<br />

## 服务器推送事件 SSE

HTML5 Server-Sent Events（SSE）是一种用于实现服务器向客户端推送数据的技术，它允许服务器向客户端发送事件流（Event Stream），并在客户端自动更新。与传统的 Ajax 技术通过使用轮询来不断获取更新相比，HTML5 SSE 具有更低的延迟和更高的可扩展性，因为它使用单个长连接来保持数据流，而不是发送多个短连接。

HTML5 SSE 技术的核心是 `EventSource` 对象，它是 HTML5 API 中的一部分，用于创建服务器发送事件流的连接。`EventSource` 对象具有以下特点：

- **单向通信**：`EventSource` 对象只能从服务器接收数据，而不能向服务器发送数据。
- **自动重连**：如果连接断开，`EventSource` 对象会自动尝试重新连接服务器，直到连接成功或达到最大重连次数为止。
- **事件处理**：`EventSource` 对象可以监听来自服务器的事件，并在事件发生时触发相应的事件处理程序。

### 客户端

- 连接服务器端点：需要先创建一个 `EventSource` 对象并将其连接到指定路径上的服务器端点。

  ```js
  const eventSource = new EventSource('/backend-path')
  ```

- `onopen` 事件：当 `EventSource` 对象成功连接到服务器端点时，会触发 `onopen` 事件，该事件通常用于在连接建立后初始化客户端状态。

  ```js
  eventSource.onopen = function (event) {
    console.log('Connection opened.')
  }
  ```

- `onmessage` 事件：当 `EventSource` 对象接收到从服务器发来的事件时，会触发 `onmessage` 事件，该事件通常用于处理从服务器接收到的数据。

  ```js
  eventSource.onmessage = function (event) {
    console.log(`Received data: ${data}`)
  }
  ```

- `onerror` 事件：如果 EventSource 对象与服务器的连接发生错误，会触发 `onerror` 事件，该事件通常用于处理连接错误并进行相应的处理。

  ```js
  eventSource.onerror = function (event) {
    console.log(`Error occurred: ${event}`)
  }
  ```

### 服务端

::: warning

- **协议问题**：使用 HTML5 SSE 需要服务端的配合，服务端需要支持 SSE 所依赖的 `text/event-stream` 协议，然后客户端订阅服务端点后才能自动获取服务端更新。
- **发送的数据格式不正确**：在 SSE 中，每条消息必须以 `data:` 开头，后跟消息内容，并以两个换行符结尾。例如，`data: hello world\n\n`。请确保服务器端代码正确地格式化 SSE 数据。
- **缓存问题**：浏览器可能会缓存 SSE 数据，导致无法接收新的数据。为了避免这种情况，开发者可以在服务器端向客户端发送一个 `Cache-Control` 响应头，以指示浏览器不要缓存 SSE 数据。例如，`Cache-Control: no-cache`。
- **CORS 问题**：如果 SSE 服务器与 HTML 页面位于不同的域，则可能会遇到跨域资源共享 (CORS) 问题。在这种情况下，开发者需要在服务器端设置适当的 CORS 响应头，以允许浏览器从其他域接收 SSE 数据。例如 `Access-Control-Allow-Origin: *`。

:::

```js{18-20,,27}
// app.js
const express = require("express");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// SSE route
app.get('/sse', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  res.flushHeaders();

  setInterval(() => {
    const message = `Current time is ${new Date().toLocaleTimeString()}`
    res.write(`data: ${message}\n\n`);
  }, 1000);
});

http.listen(3006, () => {
  console.log("Server listening on port http://localhost:3006/");
});
```

<br />

## WebSockets

一种全新的建立在单个 TCP 连接上进行全双工通讯的协议。它允许在浏览器和服务器之间建立一个持久的、双向的通信通道，使得浏览器和服务器之间可以实时地进行双向数据传输，而无需像传统的 HTTP 请求那样每次都建立和关闭连接。

![websocket vs ajax](/assets/html/websocket-vs-ajax.png)

### 基础用法

1. WebSocket 对象

   ```js
   const Socket = new WebSocket(url, [protocols])
   ```

   - 第一个参数 `url` 参数是 WebSocket 服务器的地址，可以是一个绝对 URL 或相对 URL；
   - 第二个参数 `protocols` 参数是可选的，用来指定一组子协议，以便服务器选择最合适的子协议。如果没有指定子协议，则使用空字符串。

2. WebSocket 属性

   | 属性             | 说明                                                                                                      |
   | ---------------- | --------------------------------------------------------------------------------------------------------- |
   | `readyState`     | 表示 WebSocket 连接的当前状态，可能的值有：0（`CONNECTING`）、1（`OPEN`）、2（`CLOSING`）和 3（`CLOSED`） |
   | `bufferedAmount` | 表示还有多少字节的数据没有发送出去，如果值为 0，则表示数据已经全部发送出去了                              |
   | `extensions`     | 表示服务器选择的扩展协议，如果没有选择扩展协议，则该属性为空字符串                                        |
   | `protocol`       | 表示服务器选择的子协议，如果没有选择子协议，则该属性为空字符串                                            |

3. WebSocket 事件

   | 事件        | 描述                       |
   | ----------- | -------------------------- |
   | `onopen`    | 连接建立时触发             |
   | `onmessage` | 客户端接收服务端数据时触发 |
   | `onerror`   | 通信发生错误时触发         |
   | `onclose`   | 连接关闭时触发             |

4. WebSocket 方法

   | 方法      | 描述             |
   | --------- | ---------------- |
   | `send()`  | 使用连接发送数据 |
   | `close()` | 关闭连接         |

   <br />

### 示例

1. 服务端

```js
const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 3000 })

wss.on('connection', (ws) => {
  console.log('有新用户连接上来了')

  setInterval(() => {
    const messages = ['你好啊~', '你在干嘛呢?', '有人吗？', '大家好', '我来了']
    const message = messages[Math.floor(Math.random() * messages.length)]

    console.log(`模拟其他用户发言：${message}`)

    // 广播消息给所有连接到服务器的客户端
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })
  }, (Math.random() * 6) + 5000)

  // 监听客户端发送的消息
  ws.on('message', (msg) => {
    console.log(`收到一条新消息：${msg}`)

    // 广播消息给所有连接到服务器的客户端
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg)
      }
    })
  })

  // 监听客户端断开连接事件
  ws.on('close', () => {
    console.log('有用户离开了')
  })
})
```

2. 客户端

```js
const socket = new WebSocket("ws://localhost:3000");

// 获取聊天记录的容器元素
const chatHistory = document.getElementById("chat-history");

// 监听服务器发送的消息
socket.addEventListener("message", (event) => {
  const data = event.data;
  ...
});

// 监听表单提交事件
document.querySelector("#send-btn").addEventListener("click", (e) => {
  e.preventDefault();
  const input = document.getElementById("input");
  const msg = input.value;
  // 发送消息给服务器
  socket.send(msg);
});
```

<br />

> 参考：[HTML5 入门教程](https://juejin.cn/book/7307129524007731238/section)
