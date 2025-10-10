# Network

## 网络分层模型和应用协议

### 分层模型

#### 五层网络模型

- 应用层：跟具体应用相关的消息格式，如 HTTP、FTP、DNS、SMTP、POP3
- 传输层：如何保证消息的可靠传递，如TCP、UDP
- 网络层：如何在互联网中找到对方，如IP、路由器
- 数据链路层：如何在一个子网中找到对方，如MAC、交换机
- 物理层：上层传递的东西如何用信号表示，如物理信号

<br />

#### 数据的传输

- 封装：从上层到下层，每一层对消息添加头部封装
- 解封：从目标下层到上菜，每一层解除对消息的封装

<br />

### 应用层协议

#### URL

> 定义：统一资源定位符，用于定位网络服务，是URI的子集
>
> 格式：是一个固定格式的字符串，`schema://domain:port[/path]?query=xx#hash`
>
> 含义：表达了从网络中**哪台计算机(domain)**中的**哪个程序(port)**寻找**哪个服务(path)**，并注明了获取服务的**具体细节(path)**，以及要使用什么样的**协议通信(schema)**

<br />

#### HTTP

> 定义：超文本传输协议，使用了一种极为简单的消息传递模式，【请求-响应】模式，发起请求的称之为客户端，接收请求并完成响应的称之为服务器。

**传递消息的格式**

```http
# 请求行
GET/POST/XXX /path?query HTTP/1.1
# 请求头：键值对格式
Host: www.taobao.com
# 空行换行

# 请求体
xxx

# 响应行
HTTP/1.1 200 OK
# 响应头
Server： xxx
Content-Type: xxx
...
# 空行换行

# 响应体
xxx
```

<br />

## 浏览器的通信能力

请求路径：

- 绝对路径：以完整URL格式或者 `/` 开头，不会受当前请求path的影响，只会复用协议、域名等
- 相对路径：通常以 `./` 或者 `../` 或者直接文件名开头，会受到当前请求path的影响

<br />

## XHR

> [介绍-MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest#%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0)
>
> [示例代码](https://github.com/LeopoldSze/sze-source-code/blob/main/network/client/index.html)

<br />

## fetch

> [介绍-MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)
>
> [示例代码](https://github.com/LeopoldSze/sze-source-code/blob/main/network/client/index.html)

<br />

## 同源-跨域

### 同源策略

是一种安全机制，用于保护浏览器中不同来源的网页之间的数据隔离和安全性。同源策略要求在浏览器中运行的脚本只能访问与其来源**_具有相同协议、域名和端口_**的资源，限制了跨域的数据访问。

限制内容：

- DOM访问限制：如iframe中 `iframe.contentWindow.document`
- Cookie访问限制：因为无法获取document对象，所以无法获取 `document.cookie`
- Ajax响应数据限制：可以发送请求，但是无法获取响应的数据

同源策略的原则如下：

1. 协议（Protocol）：两个页面的协议必须相同，如 http:// 或 https://
2. 域名（Host）：两个页面的域名必须相同，包括子域名（如 sub.example.com 和 example.com 不同源）
3. 端口（Port）：两个页面的端口号必须相同（若指定端口号）；若未指定端口号，默认为 80

<br />

### 简单请求与复杂请求

CORS会把请求分为两类：简单请求和复杂请求

| 简单请求                                                                                                                               | 复杂请求                                                 |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 请求方法为：GET、HEAD、POST                                                                                                            |                                                          |
| 请求头字段要符合《CORS安全规范》<br />只要不手动修改请求头，一般都能符合规范                                                           |                                                          |
| 请求头中的 Content-Type值只能是以下三种：<br />- `text/plain`<br />- `multipart/form-data` <br />- `application/x-www-form-urlencoded` | 非简单请求，就是复杂请求<br />复杂请求会自动发送预检请求 |

<br />

### 预检请求

> 基本流程：先发起 OPTIONS 请求，如果通过预检，继续发起实际的跨域请求

请求头内容：

| 请求头                         | 含义                                 |
| ------------------------------ | ------------------------------------ |
| Origin                         | 发起请求的源                         |
| Access-Control-Request-Method  | 实际请求的HTTP方法                   |
| Access-Control-Request-Headers | 实际请求中使用的自定义头(如果有的话) |

<br />

### 跨域

- 原因：浏览器同源策略(请求时：协议、域名、端口只要有一个不同就是跨域)

- 解决：

  1. `JSONP`

     - 原理：`script` 标签src不受同源策略影响
     - 缺点：只支持GET请求，敏感信息不安全
     - 实现：前端定义函数，后端返回函数，将响应值注入返回的函数参数

     ```js
     /**
      * 方法1：JSONP
      * @param name
      * @returns {Promise}
      */
     function jsonp (name) {
       const script = document.createElement('script')
       script.src = `http://localhost:3000/api/jsonp?callback=${name}`
       document.body.appendChild(script)

       return new Promise((resolve) => {
         window[name] = (data) => {
           resolve(data)
         }
       })
     }

     jsonp(`callback${Date.now()}`).then((res) => {
       console.log('jsonp:', res)
     })

     *
      * server
      */
     const express = require('express')
     const app = express()

     /**
      * jsonp请求
      */
     app.get('/api/jsonp', (req, res) => {
       const { callback = 'callback' } = req.query
       res.send(`${callback}('hello, jsonp')`)
     })
     ```

  2. 前端代理(仅限开发环境)

     ```js
     /**
      * 方法2：前端代理
      */
     // vite.config.ts
     import { defineConfig } from 'vite'

     fetch('/api/json').then(res => res.json()).then((res) => {
       console.log('proxy:', res)
     })

     export default defineConfig({
       server: {
         host: 'localhost',
         proxy: {
           '/api': {
             target: 'http://localhost:3000',
             changeOrigin: true
           }
         }
       }
     })

     *
      * server
      */
     const express = require('express')
     const app = express()

     /**
      * 普通请求
      */
     app.get('/api/json', (req, res) => {
       res.send({ name: 'sze' })
     })
     ```

  3. 后端 `CORS`

     - 要先通过浏览器的预检请求，需要返回如下响应头

       | 响应头                       | 含义                         |
       | ---------------------------- | ---------------------------- |
       | Access-Control-Allow-Origin  | 允许的源                     |
       | Access-Control-Allow-Methods | 允许的方法                   |
       | Access-Control-Allow-Headers | 允许的自定义头               |
       | Access-Control-Allow-Max-Age | 预检请求的结果缓存时间(可选) |

     ```js
     /**
      * 方法3：后端cors
      */
     fetch('http://localhost:3000/api/cors').then(res => res.json()).then((res) => {
       console.log('cors:', res)
     })

     const cors = require('cors') // 需要按照第三方库：cors
     /**
      * server
      */
     const express = require('express')
     const app = express()
     app.use(cors({
       origin: 'xxx',
       methods: ['xxx'],
       allowedHeaders: ['xxx'],
       exposedHeaders: ['xxx']
     }))

     /**
      * cors请求
      */
     app.get('/api/cors', (req, res) => {
       res.send({ method: 'cors' })
     })
     ```

  4. 运维端 `nginx` 代理

     ```bash
     # 获取主机IP
     cat /etc/resolv.conf

     location /api {
     	proxy_pass http:xxxxxx
     }
     ```

<br />

## 请求库的封装

### 背景

虽然前端具有诸多成熟的请求库，但在实际项目开发中发现，它们很难完全契合实际的开发需求。

**axios**

axios 虽然很成熟，但是只是一个基础库，没有提供诸多的上层功能，比如：

- 请求重试
- 请求缓存
- 请求幂等
- 请求串行
- 请求并发...

**VueRequest & SWR**

- 与上层框架深度绑定
- 不符合公司规范协议要求
- 问题修复过程缓慢

<br />

### 方案和实现

- 顶层：`request-bus`
- 中间层：`request-core`
- 底层请求实现层：`axios/fetch/xhr...`

整个库结构包含三层，从下往上依次是：

- 请求实现层：提供请求基本功能，但是实现的多样性可能导致这一层的不稳定，因为此层是基础层，不稳定性会传导到上一层，必须寻求一种方案来隔离这种不稳定性
- `request-core`：提供网络上层能力，比如请求串行、请求并行、请求重试、请求防重等功能
- `request-bus`：为请求绑定业务功能，该层接入公司内部协议规范和接口文档，向外提供业务接口API

::: tip 解决请求实现层的不稳定性

可以基于DIP(Dependence Inversion Principle，依赖倒置原则)，彻底和请求的实现解耦，而TypeScript的类型系统让这一切的落地成为了可能。

即 `request-core` 层提供接口规范，不负责实现，让底层请求实现层去实现这个接口

:::

<br />

### 请求缓存

> 定义：请求缓存是指创建一个带有缓存的请求，当没有命中缓存时发送请求并缓存结果，当有缓存时直接返回缓存
>
> 位置：`request-core`
>
> 核心：请求结果怎么存？存在哪？缓存键是什么？缓存何时失效？

```typescript
// 核心逻辑

function createCacheRequestor(cacheOptions) {
  const options = normalizeOptions(cacheOptions) // 参数归一化
  const store = useCacheStore(options.presist) // 使用缓存仓库
  const req = useRequestor() // 获取请求实例
  // 请求配置
  req.on('beforeRequest', async (config) => {
    const key = options.key(config) // 获取缓存键
    const hasKey = await store.has(key) // 判断是否存在缓存
    if (hasKey && options.isValid(key, config)) {
      // 存在缓存且缓存有效
      return store.get(key)
    }
  })

  // 结果缓存配置
  req.on('responseBody', (config, resp) => {
    const key = options.key(config) // 获得缓存键
    store.get(key, resp.toPlain())
  })

  return req
}
```

<br />

### 请求幂等

> 定义：要求幂等的请求不能重复提交，可以把重复定义为：请求方法、请求头、请求体完全一致

```js
// hash编码请求头和请求体，判断生成的字符串是否相等
function hashRequest(req) {
  const spark = new SparkMD5()
  spark.append(req.url)
  for (const [key, value] of req.headers) {
    spark.append(key)
    spark.append(value)
  }
  spark.append(req.body)
  return spark.end()
}

function createIdempotentRequestor(genKey) {
  return createCacheRequestor({
    key: config => genKey ? genKey(config) : hashRequest(config),
    presisit: false
  })
}
```

<br />

### 样板代码

当项目中接口数量非常庞大，为了减少开发和维护成本，可以使用node实现一个自动化工具，通过解析接口标准文档，自动为每个接口生成请求样板代码，并扩展打补丁功能，既减少了开发量，同时也保证了灵活度。

落地效果可以保证业务开发人员再也无须关心请求封装，只需要调用请求库的业务函数即可，无须关心内部的并发、幂等这些复杂问题，对开发人员完全无感。整个请求库为公司的业务开发带来30%的效率提升，并依靠自动生成的样板代码，减少了50%的接口联调的时间。

<br />
