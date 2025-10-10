# Node.js

Node.js是一个javascript运行环境。它让javascript可以开发后端程序，实现几乎其他后端语言实现的所有功能，可以与PHP、Java、Python、.NET、Ruby等后端语言平起平坐。Nodejs是基于V8引擎，V8是Google发布的开源JavaScript引擎，这个V8搬到了服务器上，用于做服务器的软件。

## 部署Node的ESM开发环境

`Node` 在 `v13.2.0`带来一些新特性，正式取消 `--experimental-modules` 启动参数。当然并不是删除`--experimental-modules`，而是在其原有基础上实现对`ESM`的实验性支持并默认启动。

`--experimental-modules`特性包括以下方面。

- 使用 `type` 指定模块方案
  - 在`package.json`中指定`type`为`commonjs`，则使用`CJS`
  - 在`package.json`中指定`type`为`module`，则使用`ESM`
- 使用 `--input-type` 指定入口文件的模块方案，与 `type` 一样
  - 命令中加上`--input-type=commonjs`，则使用`CJS`
  - 命令中加上`--input-type=module`，则使用`ESM`
- 支持新文件后缀 `.cjs | .mjs`
  - 文件后缀使用`.cjs`，则使用`CJS`
  - 文件后缀使用`.mjs`，则使用`ESM`
- 使用 `--es-module-specifier-resolution` 指定文件名称引用方式
  - 命令中加上`--es-module-specifier-resolution=explicit`，则引用模块时必须使用文件后缀(`默认`)
  - 命令中加上`--es-module-specifier-resolution=node`，则引用模块时无需使用文件后缀
- 使用 `main` 根据 `type` 指定模块方案加载文件
  - 在`package.json`中指定 `main` 后会根据 `type` 指定模块方案加载文件

::: tip ESM启用方式

`mjs文件`使用`ESM`解析，`cjs文件`使用`CJS`解析，`js文件`使用基于`package.json`指定的`type`解析(`type=commonjs`使用`CJS`，`type=module`使用`ESM`)。

- 文件后缀为`.mjs`
- 文件后缀为`.js`且在`package.json`中指定`type`为`module`
- 命令中加上`--input-type=module`
- 命令中加上`--eval cmd`

:::

::: warning

将`Node v13.2.0`作为高低版本分界线，当版本`>=13.2.0`则定为高版本，当版本`<13.2.0`则定为低版本。高版本使用`Node原生部署方案`，低版本使用`Node编译部署方案`。

`Node`与`Npm`是成双成对地安装，可通过[Node Releases](https://link.juejin.cn/?target=https%3A%2F%2Fnodejs.org%2Fzh-cn%2Fdownload%2Freleases)查询到`Node v13.2.0`对应`Npm v6.13.1`。

:::

### 原生部署方案

`高版本Node`在默认情况下，对`import命令`的文件后缀存在强制性，因此`import "./file"`并不等于`import ./file.js`。其次`CJS`的自动后缀处理行为可通过`--es-module-specifier-resolution=node`开启，但模块主入口并不会受到`ESM`的影响，例如`import Path from "path"`照样可正常运行。在命令中加上`--es-module-specifier-resolution=node`就能解决显示文件名称的问题。

```json
{
  "scripts": {
    "dev": "node --es-module-specifier-resolution=node src/index.js"
  }
}
```

`ESM`不再提供`Node`某些特性与不能灵活引用`json文件`了，因此`__dirname`、`__filename`、`require`、`module`和`exports`这几个特性将无法使用。

可采用以下方式解决这些问题。

- `__filename`与`__dirname`可用`import.meta`对象重建
- `require`、`module`和`exports`可用`import`与`export`代替
- `json文件`的引用可用 `fs模块` 的`readFileSync`与`JSON.parse()`代替

```js
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
console.log(__filename, __dirname)

const json = readFileSync(join(__dirname, './info.json'))
const info = JSON.parse(json)
```

### 编译部署方案

可用`babel`将代码从`ESM`转换为`CJS`，因此使用`babel`编译`ESM`代码是低版本`Node`支持`ESM`最稳定的方案无之一。在`Node v8.9.0`前的版本无法使用`--experimental-modules`支持`ESM`，也就更需`babel`解决该问题了。

```bash
npm i @babel/cli @babel/core @babel/node @babel/preset-env -D
```

- **@babel/cli**：提供支持`@babel/core`的命令运行环境
- **@babel/core**：提供转译函数
- **@babel/node**：提供支持`ESM`的命令运行环境
- **@babel/preset-env**：提供预设语法转换集成环境

```json
{
  "scripts": {
    "start": "babel-node src/index.js"
  },
  "babel": {
    "presets": [
      "@babel/preset-env"
    ]
  }
}
```

### 监听脚本自动重启

- 第三方依赖：[nodemon](https://nodemon.io/)
- 安装：`pnpm add -D nodemon`

```json
{
  "nodemonConfig": {
    "env": {
      "NODE_ENV": "dev"
    },
    "execMap": {
      "js": "node --harmony"
    },
    "ext": "js json",
    "ignore": [
      "dist/"
    ],
    "watch": [
      "src/"
    ]
  }
}
```

<br />

## 基础

### jsonp

```js{9}
const http = require('http')
const url = require('url')

const app = http.createServer((req, res) => {
  let urlObj = url.parse(req.url, true)

  switch (urlObj.pathname) {
    case '/api/user':
      res.end(`${urlObj.query.cb}({"name": "gp145"})`)
      break
    default:
      res.end('404.')
      break
  }
})

app.listen(8080, () => {
  console.log('localhost:8080')
})
```

### CORS

```js{11}
const http = require('http')
const url = require('url')
const querystring = require('querystring')

const app = http.createServer((req, res) => {
  let data = ''
  let urlObj = url.parse(req.url, true)

  res.writeHead(200, {
    'content-type': 'application/json;charset=utf-8',
    'Access-Control-Allow-Origin': '*'
  })

  req.on('data', (chunk) => {
    data += chunk
  })

  req.on('end', () => {
    responseResult(querystring.parse(data))
  })

  function responseResult(data) {
    switch (urlObj.pathname) {
      case '/api/login':
        res.end(JSON.stringify({
          message: data
        }))
        break
      default:
        res.end('404.')
        break
    }
  }
})

app.listen(8080, () => {
  console.log('localhost:8080')
})
```

### event模块

```js
const EventEmitter = require('node:events')
class MyEventEmitter extends EventEmitter {}
const event = new MyEventEmitter()

event.on('play', (movie) => {
  console.log(movie)
})

event.emit('play', '我和我的祖国')
event.emit('play', '中国机长')
```

### fs模块

```js
const fs = require('fs')

// 创建文件夹
fs.mkdir('./logs', (err) => {
  console.log('done.')
})

// 文件夹改名
fs.rename('./logs', './log', () => {
  console.log('done')
})

// 删除文件夹
fs.rmdir('./log', () => {
  console.log('done.')
})

// 写内容到文件里
fs.writeFile(
  './logs/log1.txt',
  'hello',
  // 错误优先的回调函数
  (err) => {
    if (err) {
      console.log(err.message)
    } else {
      console.log('文件创建成功')
    }
  }
)

// 给文件追加内容
fs.appendFile('./logs/log1.txt', '\nworld', () => {
  console.log('done.')
})

// 读取文件内容
fs.readFile('./logs/log1.txt', 'utf-8', (err, data) => {
  console.log(data)
})

// 删除文件
fs.unlink('./logs/log1.txt', (err) => {
  console.log('done.')
})

// 批量写文件
for (let i = 0; i < 10; i++) {
  fs.writeFile(`./logs/log-${i}.txt`, `log-${i}`, (err) => {
    console.log('done.')
  })
}

// 读取文件/目录信息
fs.readdir('./', (err, data) => {
  data.forEach((value, index) => {
    fs.stat(`./${value}`, (err, stats) => {
      // console.log(value + ':' + stats.size)
      console.log(value + ' is ' + (stats.isDirectory() ? 'directory' : 'file'))
    })
  })
})

// 同步读取文件
try {
  const content = fs.readFileSync('./logs/log-1.txt', 'utf-8')
  console.log(content)
  console.log(0)
} catch (e) {
  console.log(e.message)
}

// 异步读取文件：方法一
fs.readFile('./logs/log-0.txt', 'utf-8', (err, content) => {
  console.log(content)
  console.log(0)
})
console.log(1)

// 异步读取文件：方法二
const fs = require("fs").promises
fs.readFile('./logs/log-0.txt', 'utf-8').then(result => {
  console.log(result)
})

```

在`fs`模块中，提供同步方法是为了方便使用。那我们到底是应该用异步方法还是同步方法呢？

由于Node环境执行的JavaScript代码是服务器端代码，所以，绝大部分需要在服务器运行期反复执行业务逻辑的代码，_必须使用异步代码_，否则，同步代码在执行时期，服务器将停止响应，因为JavaScript只有一个执行线程。

服务器启动时如果需要读取配置文件，或者结束时需要写入到状态文件时，可以使用同步代码，因为这些代码只在启动和结束时执行一次，不影响服务器正常运行时的异步执行。

### stream流模块

`stream`是Node.js提供的又一个仅在服务区端可用的模块，目的是支持“流”这种数据结构。

什么是流？流是一种抽象的数据结构。想象水流，当在水管中流动时，就可以从某个地方（例如自来水厂）源源不断地到达另一个地方（比如你家的洗手池）。我们也可以把数据看成是数据流，比如你敲键盘的时候，就可以把每个字符依次连起来，看成字符流。这个流是从键盘输入到应用程序，实际上它还对应着一个名字：标准输入流（stdin）。

如果应用程序把字符一个一个输出到显示器上，这也可以看成是一个流，这个流也有名字：标准输出流（stdout）。流的特点是数据是有序的，而且必须依次读取，或者依次写入，不能像Array那样随机定位。

有些流用来读取数据，比如从文件读取数据时，可以打开一个文件流，然后从文件流中不断地读取数据。有些流用来写入数据，比如向文件写入数据时，只需要把数据不断地往文件流中写进去就可以了。

在Node.js中，流也是一个对象，我们只需要响应流的事件就可以了：`data` 事件表示流的数据已经可以读取了，`end` 事件表示这个流已经到末尾了，没有数据可以读取了，`error` 事件表示出错了。

```js
const fs = require('node:fs')

// 打开一个流:
const rs = fs.createReadStream('sample.txt', 'utf-8')

rs.on('data', (chunk) => {
  console.log('DATA:', chunk)
})

rs.on('end', () => {
  console.log('END')
})

rs.on('error', (err) => {
  console.log(`ERROR: ${err}`)
})

```

要注意，`data`事件可能会有多次，每次传递的`chunk`是流的一部分数据。

要以流的形式写入文件，只需要不断调用`write()`方法，最后以`end()`结束：

```js
const fs = require('node:fs')
const ws1 = fs.createWriteStream('output1.txt', 'utf-8')
ws1.write('使用Stream写入文本数据...\n')
ws1.write('END.')
ws1.end()
```

`pipe` 就像可以把两个水管串成一个更长的水管一样，两个流也可以串起来。一个 `Readable` 流和一个 `Writable` 流串起来后，所有的数据自动从 `Readable` 流进入 `Writable` 流，这种操作叫 `pipe`。

在Node.js中，`Readable` 流有一个 `pipe()` 方法，就是用来干这件事的。

让我们用 `pipe()` 把一个文件流和另一个文件流串起来，这样源文件的所有数据就自动写入到目标文件里了，所以，这实际上是一个复制文件的程序：

```js
const fs = require('node:fs')

const readstream = fs.createReadStream('./1.txt')
const writestream = fs.createWriteStream('./2.txt')

readstream.pipe(writestream)
```

### zlib模块

```js
const fs = require('node:fs')
const zlib = require('node:zlib')

const gzip = zlib.createGzip()

const readstream = fs.createReadStream('./note.txt')
const writestream = fs.createWriteStream('./note2.txt')

readstream
  .pipe(gzip)
  .pipe(writestream)
```

### crypto

crypto模块的目的是为了提供通用的加密和哈希算法。用纯JavaScript代码实现这些功能不是不可能，但速度会非常慢。Nodejs用C/C++实现这些算法后，通过cypto这个模块暴露为JavaScript接口，这样用起来方便，运行速度也快。

1. MD5是一种常用的哈希算法，用于给任意数据一个“签名”。这个签名通常用一个十六进制的字符串表示：

```js
const crypto = require('node:crypto')

const hash = crypto.createHash('md5')

// 可任意多次调用update():
hash.update('Hello, world!')
hash.update('Hello, nodejs!')

console.log(hash.digest('hex'))
```

`update()`方法默认字符串编码为`UTF-8`，也可以传入Buffer。

如果要计算SHA1，只需要把`'md5'`改成`'sha1'`，就可以得到SHA1的结果`1f32b9c9932c02227819a4151feed43e131aca40`。

2. Hmac算法也是一种哈希算法，它可以利用MD5或SHA1等哈希算法。不同的是，Hmac还需要一个密钥：

```js
const crypto = require('node:crypto')

const hmac = crypto.createHmac('sha256', 'secret-key')

hmac.update('Hello, world!')
hmac.update('Hello, nodejs!')

console.log(hmac.digest('hex')) // 80f7e22570...
```

只要密钥发生了变化，那么同样的输入数据也会得到不同的签名，因此，可以把Hmac理解为用随机数“增强”的哈希算法。

3. AES是一种常用的对称加密算法，加解密都用同一个密钥。crypto模块提供了AES支持，但是需要自己封装好函数，便于使用：

```js
const crypto = require('node:crypto')

function encrypt(key, iv, data) {
  const decipher = crypto.createCipheriv('aes-128-cbc', key, iv)
  // decipher.setAutoPadding(true);
  return decipher.update(data, 'binary', 'hex') + decipher.final('hex')
}

function decrypt(key, iv, crypted) {
  crypted = Buffer.from(crypted, 'hex').toString('binary')
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
  return decipher.update(crypted, 'binary', 'utf8') + decipher.final('utf8')
}
// key,iv必须是16个字节
```

可以看出，加密后的字符串通过解密又得到了原始内容。

### 路由

<br />

#### 基础

```js
const fs = require('node:fs')
const path = require('node:path')

function render(res, path) {
  res.writeHead(200, { 'Content-Type': 'text/html;charset=utf8' })
  res.write(fs.readFileSync(path, 'utf8'))
  res.end()
}

const route = {
  '/login': (req, res) => {
    render(res, './static/login.html')
  },
  '/home': (req, res) => {
    render(res, './static/home.html')
  },
  '/404': (req, res) => {
    res.writeHead(404, { 'Content-Type': 'text/html;charset=utf8' })
    res.write(fs.readFileSync('./static/404.html', 'utf8'))
  }
}
```

<br />

#### 获取参数

get请求

```js
"/api/login":(req,res)=>{
  const myURL = new URL(req.url, 'http://127.0.0.1:3000');
  console.log(myURL.searchParams.get("username"))
  render(res,`{ok:1}`)
}
```

post请求

```js
"/api/login": (req, res) => {
  let post = '';
  // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
  req.on('data', function (chunk) {
    post += chunk;
  });

  // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
  req.on('end', function () {
    post = JSON.parse(post);
    render(res, `{ok:1}`)
  });
}
```

<br />

#### 静态资源处理

```js
function readStaticFile(req, res) {
  const myURL = new URL(req.url, 'http://127.0.0.1:3000')
  const filePathname = path.join(__dirname, '/static', myURL.pathname)

  if (fs.existsSync(filePathname)) {
    res.writeHead(200, { 'Content-Type': `${mime.getType(myURL.pathname.split('.')[1])};charset=utf8` })
    res.write(fs.readFileSync(filePathname, 'utf8'))
    res.end()
    return true
  }
  else {
    return false
  }
}
```

<br />

## Express

- 作用：基于 Node.js 平台，快速、开放、极简的 web 开发框架。
- 安装：`pnpm add express -D`
- 文档：[Express](https://www.expressjs.com.cn/)

### 路由

路由路径和请求方法一起定义了请求的端点，它可以是字符串、字符串模式或者正则表达式。

```js
const express = require('express')
const app = express()

// 匹配根路径的请求
app.get('/', (req, res) => {
  res.send('root')
})

// 匹配 /about 路径的请求
app.get('/about', (req, res) => {
  res.send('about')
})

// 匹配 /random.text 路径的请求
app.get('/random.text', (req, res) => {
  res.send('random.text')
})
```

使用字符串模式的路由路径示例：

```js
// 匹配 acd 和 abcd
app.get('/ab?cd', (req, res) => {
  res.send('ab?cd')
})

// 匹配 /ab/******
app.get('/ab/:id', (req, res) => {
  res.send('aaaaaaa')
})

// 匹配 abcd、abbcd、abbbcd等
app.get('/ab+cd', (req, res) => {
  res.send('ab+cd')
})

// 匹配 abcd、abxcd、abRABDOMcd、ab123cd等
app.get('/ab*cd', (req, res) => {
  res.send('ab*cd')
})

// 匹配 /abe 和 /abcde
app.get('/ab(cd)?e', (req, res) => {
  res.send('ab(cd)?e')
})
```

使用正则表达式的路由路径示例：

```js
// 匹配任何路径中含有 a 的路径：
app.get(/a/, (req, res) => {
  res.send('/a/')
})

// 匹配 butterfly、dragonfly，不匹配 butterflyman、dragonfly man等
app.get(/.*fly$/, (req, res) => {
  res.send('/.*fly$/')
})
```

可以为请求处理提供多个回调函数，其行为类似 中间件。唯一的区别是这些回调函数有可能调用 next('route') 方法而略过其他路由回调函数。可以利用该机制为路由定义前提条件，如果在现有路径上继续执行没有意义，则可将控制权交给剩下的路径。

```js
app.get('/example/b', (req, res, next) => {
  console.log('response will be sent by the next function ...')
  next()
}, (req, res) => {
  res.send('Hello from B!')
})
```

使用回调函数数组处理路由：

```js
function cb0(req, res, next) {
  console.log('CB0')
  next()
}

function cb1(req, res, next) {
  console.log('CB1')
  next()
}

function cb2(req, res) {
  res.send('Hello from C!')
}

app.get('/example/c', [cb0, cb1, cb2])
```

混合使用函数和函数数组处理路由：

```js
function cb0(req, res, next) {
  console.log('CB0')
  next()
}

function cb1(req, res, next) {
  console.log('CB1')
  next()
}

app.get('/example/d', [cb0, cb1], (req, res, next) => {
  console.log('response will be sent by the next function ...')
  next()
}, (req, res) => {
  res.send('Hello from D!')
})
```

### 中间件

Express 是一个自身功能极简，完全是由路由和中间件构成一个的 web 开发框架：从本质上来说，一个 Express 应用就是在调用各种中间件。

**中间件（Middleware） 是一个函数，它可以访问请求对象（req）, 响应对象（res）, 和 web 应用中处于请求-响应循环流程中的中间件，一般被命名为 next 的变量。**

::: tip 中间件的功能包括：

- 执行任何代码
- 修改请求和响应对象
- 终结请求-响应循环
- 调用堆栈中的下一个中间件

::: warning

如果当前中间件没有终结请求-响应循环，则必须调用 next() 方法将控制权交给下一个中间件，否则请求就会挂起。

:::

::: tip Express 应用可使用如下几种中间件：

- 应用级中间件
- 路由级中间件
- 错误处理中间件
- 内置中间件
- 第三方中间件

:::

使用可选择挂载路径，可在应用级别或路由级别装载中间件。另外，还可以同时装载一系列中间件函数，从而在一个挂载点上创建一个子中间件栈。

#### 应用级中间件

应用级中间件绑定到 app 对象 使用 `app.use()` 和 `app.METHOD()`， 其中， METHOD 是需要处理的 HTTP 请求的方法，例如 GET, PUT, POST 等等，全部小写。例如：

```js
const app = express()

// 没有挂载路径的中间件，应用的每个请求都会执行该中间件
app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})
```

<br />

#### 路由级中间件

路由级中间件和应用级中间件一样，只是它绑定的对象为 `express.Router()` 。

```js
const router = express.Router()
```

```js
const app = express()
const router = express.Router()

// 没有挂载路径的中间件，通过该路由的每个请求都会执行该中间件
router.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

// 一个中间件栈，显示任何指向 /user/:id 的 HTTP 请求的信息
router.use('/user/:id', (req, res, next) => {
  console.log('Request URL:', req.originalUrl)
  next()
}, (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})

// 一个中间件栈，处理指向 /user/:id 的 GET 请求
router.get('/user/:id', (req, res, next) => {
  // 如果 user id 为 0, 跳到下一个路由
  if (req.params.id == 0)
    next('route')
  // 负责将控制权交给栈中下一个中间件
  else next() //
}, (req, res, next) => {
  // 渲染常规页面
  res.render('regular')
})

// 处理 /user/:id， 渲染一个特殊页面
router.get('/user/:id', (req, res, next) => {
  console.log(req.params.id)
  res.render('special')
})

// 将路由挂载至应用
app.use('/', router)
```

<br />

#### 错误处理中间件

错误处理中间件和其他中间件定义类似，只是要使用 4 个参数，而不是 3 个，其签名如下：`(err, req, res, next)`。

```js
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
```

<br />

#### 内置的中间件

`express.static` 是 Express 唯一内置的中间件。它基于 serve-static，负责在 Express 应用中提托管静态资源。每个应用可有多个静态目录。

```js
app.use(express.static('public'))
app.use(express.static('uploads'))
app.use(express.static('files'))
```

现在，public 目录下面的文件就可以访问了。

```js
http://localhost:3000/images/kitten.jpg
http://localhost:3000/css/style.css
http://localhost:3000/js/app.js
http://localhost:3000/hello.html
```

> 所有文件的路径都是相对于存放目录的，因此，存放静态文件的目录名不会出现在 URL 中。

如果希望所有通过 express.static 访问的文件都存放在一个“虚拟（virtual）”目录（即目录根本不存在）下面，可以通过为静态资源目录指定一个挂载路径的方式来实现，如下所示：

```
app.use('/static', express.static('public'))
```

现在，你就可以通过带有 “/static” 前缀的地址来访问 public 目录下面的文件了。

```js
http://localhost:3000/static/images/kitten.jpg
http://localhost:3000/static/css/style.css
http://localhost:3000/static/js/app.js
http://localhost:3000/static/hello.html
```

#####

<br />

#### 第三方中间件

安装所需功能的 node 模块，并在应用中加载，可以在应用级加载，也可以在路由级加载。

下面的例子安装并加载了一个解析 cookie 的中间件： cookie-parser

```bash
pnpm add cookie-parser
```

```js
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')

// 加载用于解析 cookie 的中间件
app.use(cookieParser())
```

<br />

#### 获取请求参数

**get**

```js
req.query
```

**post**

```js
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
req.body
```

<br />

#### 服务端渲染（模板引擎）

```bash
pnpm add ejs
```

需要在应用中进行如下设置才能让 Express 渲染模板文件：

- views, 放模板文件的目录，比如： `app.set('views', './views')`
- view engine, 模板引擎，比如： `app.set('view engine', 'ejs')`

<br />

## MongoDB

### 安装

https://docs.mongodb.com/manual/administration/install-community/

### 启动

**windows**

```bash
mongod --dbpath d:/data/db
mongo
```

**mac**

```bash
mongod --config /usr/local/etc/mongod.conf
mongo
```

### 命令行使用

### 可视化工具使用

Robomongo Robo3T adminMongo

### nodejs连接操作数据库

1. 连接数据库：

   ```js
   const mongoose = require('mongoose')
   mongoose.connect('mongodb://127.0.0.1:27017/company-system')
   ```

2. 创建模型：

   ```js
   const mongoose = require('mongoose')
   const Schema = mongoose.Schema
   const UserType = {
     username: String,
     password: String,
     gender: Number,
     introduction: String,
     avatar: String,
     role: Number
   }
   const UserModel = mongoose.model('user', new Schema(UserType))
   module.exports = UserModel
   ```

3. 增加数据：

   ```js
   UserModel.create({
     introduction,
     username,
     gender,
     avatar,
     password,
     role
   })
   ```

4. 查询数据：

   ```js
   UserModel.find({ username: 'kerwin' }, ['username', 'role', 'introduction', 'password']).sort({ createTime: -1 }).skip(10).limit(10)
   ```

5. 更新数据：

   ```js
   UserModel.updateOne({
     _id
   }, {
     introduction,
     username,
     gender,
     avatar
   })
   ```

6. 删除数据：

   ```js
   UserModel.deleteOne({ _id })
   ```

<br />

## MySQL

付费的商用数据库：

- Oracle，典型的高富帅
- SQL Server，微软自家产品，Windows定制专款
- DB2，IBM的产品，听起来挺高端
- Sybase，曾经跟微软是好基友，后来关系破裂，现在家境惨淡

这些数据库都是不开源而且付费的，最大的好处是花了钱出了问题可以找厂家解决，不过在Web的世界里，常常需要部署成千上万的数据库服务器，当然不能把大把大把的银子扔给厂家，所以，无论是Google、Facebook，还是国内的BAT，无一例外都选择了免费的开源数据库：

- MySQL，大家都在用，一般错不了
- PostgreSQL，学术气息有点重，其实挺不错，但知名度没有MySQL高
- sqlite，嵌入式数据库，适合桌面和移动应用

作为一个JavaScript全栈工程师，选择哪个免费数据库呢？当然是MySQL。因为MySQL普及率最高，出了错，可以很容易找到解决方法。而且，围绕MySQL有一大堆监控和运维的工具，安装和使用很方便。

### 与非关系数据库区别

关系型和非关系型数据库的主要差异是数据存储的方式。关系型数据天然就是表格式的，因此存储在数据表的行和列中。数据表可以彼此关联协作存储，也很容易提取数据。

与其相反，非关系型数据不适合存储在数据表的行和列中，而是大块组合在一起。非关系型数据通常存储在数据集中，就像文档、键值对或者图结构。你的数据及其特性是选择数据存储和提取方式的首要影响因素。

**关系型数据库最典型的数据结构是表，由二维表及其之间的联系所组成的一个数据组织**

优点：

1. 易于维护：都是使用表结构，格式一致
2. 使用方便：SQL语言通用，可用于复杂查询
3. 复杂操作：支持SQL，可用于一个表以及多个表之间非常复杂的查询

缺点：

1. 读写性能比较差，尤其是海量数据的高效率读写
2. 固定的表结构，灵活度稍欠
3. 高并发读写需求，传统关系型数据库来说，硬盘I/O是一个很大的瓶颈

**非关系型数据库严格上不是一种数据库，应该是一种数据结构化存储方法的集合，可以是文档或者键值对等。**

优点：

1. 格式灵活：存储数据的格式可以是key,value形式、文档形式、图片形式等等，文档形式、图片形式等等，使用灵活，应用场景广泛，而关系型数据库则只支持基础类型
2. 速度快：nosql可以使用硬盘或者随机存储器作为载体，而关系型数据库只能使用硬盘
3. 高扩展性
4. 成本低：nosql数据库部署简单，基本都是开源软件

缺点：

1. 不提供sql支持
2. 无事务处理
3. 数据结构相对复杂，复杂查询方面稍欠

### sql语句

插入：

```sql
INSERT INTO `students`(`id`, `name`, `score`, `gender`) VALUES (null,'kerwin',100,1)
// 可以不设置id, create_time
```

更新：

```sql
UPDATE `students` SET `name`='tiechui',`score`=20,`gender`=0 WHERE id=2;
```

删除：

```sql
DELETE FROM `students` WHERE id=2;
```

查询：

```sql
# 查所有的数据所有的字段
SELECT * FROM `students` WHERE 1;

# 查所有的数据某个字段
SELECT `id`, `name`, `score`, `gender` FROM `students` WHERE 1;

# 条件查询
SELECT * FROM `students` WHERE score>=80;
SELECT * FROM `students` where score>=80 AND gender=1

# 模糊查询
SELECT * FROM `students` where name like '%k%'

# 排序
SELECT id, name, gender, score FROM students ORDER BY score;
SELECT id, name, gender, score FROM students ORDER BY score DESC;

# 分页查询
SELECT id, name, gender, score FROM students LIMIT 50 OFFSET 0

# 记录条数
SELECT COUNT(*) FROM students;
SELECT COUNT(*) kerwinnum FROM students;

# 多表查询
SELECT * FROM students, classes;
#（这种多表查询又称笛卡尔查询，使用笛卡尔查询时要非常小心，由于结果集是目标表的行数乘积，对两个各自有100行记录的表进行笛卡尔查询将返回1万条记录，对两个各# 自有1万行记录的表进行笛卡尔查询将返回1亿条记录）
SELECT
    students.id sid,
    students.name,
    students.gender,
    students.score,
    classes.id cid,
    classes.name cname
FROM students, classes;
#（要使用表名.列名这样的方式来引用列和设置别名，这样就避免了结果集的列名重复问题。）

SELECT
    s.id sid,
    s.name,
    s.gender,
    s.score,
    c.id cid,
    c.name cname
FROM students s, classes c;
#（SQL还允许给表设置一个别名）

# 联表查询
SELECT s.id, s.name, s.class_id, c.name class_name, s.gender, s.score
FROM students s
INNER JOIN classes c
ON s.class_id = c.id;
#（连接查询对多个表进行JOIN运算，简单地说，就是先确定一个主表作为结果集，然后，把其他表的行有选择性地“连接”在主表结果集上。）
```

::: warning

1. InnoDB 支持事务，MyISAM 不支持事务。这是 MySQL 将默认存储引擎从 MyISAM 变成 InnoDB 的重要原因之一
2. InnoDB 支持外键，而 MyISAM 不支持。对一个包含外键的 InnoDB 表转为 MYISAM 会失败

:::

### 外键约束

`CASCADE`：在父表上update/delete记录时，同步update/delete掉子表的匹配记录

`SET NULL`：在父表上update/delete记录时，将子表上匹配记录的列设为null (要注意子表的外键列不能为not null)

`NO ACTION`：如果子表中有匹配的记录,则不允许对父表对应候选键进行update/delete操作

`RESTRICT`：同no action, 都是立即检查外键约束

### nodejs 操作数据库

```js
const express = require('express')
const mysql2 = require('mysql2')

const app = express()
const port = 9000

app.get('/', async (req, res) => {
  const config = getDBConfig()
  const promisePool = mysql2.createPool(config).promise()
  const user = await promisePool.query('select * from students')
  if (user[0].length) {
    // 存在用户
    res.send(user[0])
  }
  else {
    // 不存在
    res.send({
      code: -2,
      msg: 'user not exsit',
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

function getDBConfig() {
  return {
    host: '127.0.0.1',
    user: 'root',
    port: 3306,
    password: '',
    database: 'kerwin_test',
    connectionLimit: 1 // 创建一个连接池
  }
}
```

```js
// 查询：
promisePool.query('select * from users')

// 插入：
promisePool.query('INSERT INTO `users`(`id`,`name`,`age`, `password`) VALUES (?,?,?,?)', [null, 'kerwin', 100, '123456'])

// 更新：
promisePool.query(`UPDATE users SET name = ? ,age=? WHERE id = ?`, ['xiaoming2', 20, 1])

// 删除：
promisePool.query(`delete from users where id=?`, [1])
```

<br />

## 接口规范与业务分层

<br />

## 登录鉴权

### Cookie&Session

「HTTP 无状态」**我们知道，HTTP 是无状态的。也就是说，HTTP 请求方和响应方间无法维护状态，都是一次性的，它不知道前后的请求都发生了什么。但有的场景下，我们需要维护状态。最典型的，一个用户登陆微博，发布、关注、评论，都应是在登录后的用户状态下的。**「标记」那解决办法是什么呢？

```js
const MongoStore = require('connect-mongo')
const express = require('express')
const session = require('express-session')
const app = express()

app.use(
  session({
    secret: 'this is session', // 服务器生成 session 的签名
    resave: true,
    saveUninitialized: true, // 强制将为初始化的 session 存储
    cookie: {
      maxAge: 1000 * 60 * 10, // 过期时间
      secure: false, // 为 true 时候表示只有 https 协议才能访问cookie
    },
    rolling: true, // 为 true 表示 超时前刷新，cookie 会重新计时； 为 false 表示在超时前刷新多少次，都是按照第一次刷新开始计时。
    store: MongoStore.create({
      mongoUrl: 'mongodb://127.0.0.1:27017/kerwin_session',
      ttl: 1000 * 60 * 10 // 过期时间
    }),

  })
)

app.use((req, res, next) => {
  if (req.url === '/login') {
    next()
    return
  }
  if (req.session.user) {
    req.session.garbage = String(new Date())
    next()
  }
  else {
    res.redirect('/login')
  }
})

```

##### 2. JSON Web Token (JWT)

###### （1）介绍

我为什么要保存这可恶的session呢， 只让每个客户端去保存该多好？

当然， 如果一个人的token 被别人偷走了， 那我也没办法， 我也会认为小偷就是合法用户， 这其实和一个人的session id 被别人偷走是一样的。

这样一来， 我就不保存session id 了， 我只是生成token , 然后验证token ， 我用我的CPU计算时间获取了我的session 存储空间 ！

解除了session id这个负担， 可以说是无事一身轻， 我的机器集群现在可以轻松地做水平扩展， 用户访问量增大， 直接加机器就行。 这种无状态的感觉实在是太好了！

缺点：

> 1. 占带宽，正常情况下要比 session_id 更大，需要消耗更多流量，挤占更多带宽，假如你的网站每月有 10 万次的浏览器，就意味着要多开销几十兆的流量。听起来并不多，但日积月累也是不小一笔开销。实际上，许多人会在 JWT 中存储的信息会更多；
> 2. 无法在服务端注销，那么久很难解决劫持问题；
> 3. 性能问题，JWT 的卖点之一就是加密签名，由于这个特性，接收方得以验证 JWT 是否有效且被信任。对于有着严格性能要求的 Web 应用，这并不理想，尤其对于单线程环境。

注意：

> CSRF攻击的原因是浏览器会自动带上cookie，而不会带上token；
>
> 以CSRF攻击为例：
>
> cookie：用户点击了链接，cookie未失效，导致发起请求后后端以为是用户正常操作，于是进行扣款操作；
> token：用户点击链接，由于浏览器不会自动带上token，所以即使发了请求，后端的token验证不会通过，所以不会进行扣款操作；

###### （2）实现

```js
// jsonwebtoken 封装
const jsonwebtoken = require('jsonwebtoken')
const secret = 'kerwin'
const JWT = {
  generate(value, exprires) {
    return jsonwebtoken.sign(value, secret, { expiresIn: exprires })
  },
  verify(token) {
    try {
      return jsonwebtoken.verify(token, secret)
    }
    catch (e) {
      return false
    }
  }
}

module.exports = JWT
```

```js
// node中间件校验
app.use((req, res, next) => {
  // 如果token有效 ,next()
  // 如果token过期了, 返回401错误
  if (req.url === '/login') {
    next()
    return
  }

  const token = req.headers.authorization.split(' ')[1]
  if (token) {
    const payload = JWT.verify(token)
    // console.log(payload)
    if (payload) {
      const newToken = JWT.generate({
        _id: payload._id,
        username: payload.username
      }, '1d')
      res.header('Authorization', newToken)
      next()
    }
    else {
      res.status(401).send({ errCode: '-1', errorInfo: 'token过期' })
    }
  }
})

```

```js
// 生成token
const token = JWT.generate({
  _id: result[0]._id,
  username: result[0].username
}, '1d')

res.header('Authorization', token)
```

```js
// 前端拦截
/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
import axios from 'axios'
// Add a request interceptor
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  config.headers.Authorization = `Bearer ${token}`

  return config
}, (error) => {
  return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use((response) => {
  const { authorization } = response.headers
  authorization && localStorage.setItem('token', authorization)
  return response
}, (error) => {
  const { status } = error.response
  if (status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
  return Promise.reject(error)
})

```

#### 六、文件上传管理

Multer 是一个 node.js 中间件，用于处理 `multipart/form-data` 类型的表单数据，它主要用于上传文件。

**注意**: Multer 不会处理任何非 `multipart/form-data` 类型的表单数据。

```
npm install --save multer
```

```js
// 前后端分离-前端

const params = new FormData()
params.append('kerwinfile', file.file)
params.append('username', this.username)
const config = {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
}
http.post('/api/upload', params, config).then((res) => {
  this.imgpath = `http://localhost:3000${res.data}`
})
```

Multer 会添加一个 `body` 对象 以及 `file` 或 `files` 对象 到 express 的 `request` 对象中。 `body` 对象包含表单的文本域信息，`file` 或 `files` 对象包含对象表单上传的文件信息。

```js
// 前后端分离-后端
router.post('/upload', upload.single('kerwinfile'), (req, res, next) => {
  console.log(req.file)
})
```

#### 七、APIDOC - API 文档生成工具

apidoc 是一个简单的 RESTful API 文档生成工具，它从代码注释中提取特定格式的内容生成文档。支持诸如 Go、Java、C++、Rust 等大部分开发语言，具体可使用 `apidoc lang` 命令行查看所有的支持列表。

apidoc 拥有以下特点：

1. 跨平台，linux、windows、macOS 等都支持；
2. 支持语言广泛，即使是不支持，也很方便扩展；
3. 支持多个不同语言的多个项目生成一份文档；
4. 输出模板可自定义；
5. 根据文档生成 mock 数据；

```
npm install -g apidoc
```

注意：

(1) 在当前文件夹下 apidoc.json

```json
{
  "name": "****接口文档",
  "version": "1.0.0",
  "description": "关于****的接口文档描述",
  "title": "****"
}
```

（2）可以利用vscode apidoc snippets 插件创建api

#### 八、Koa2

##### 1.简介

koa 是由 Express 原班人马打造的，致力于成为一个更小、更富有表现力、更健壮的 Web 框架。使用 koa 编写 web 应用，通过组合不同的 generator，可以免除重复繁琐的回调函数嵌套，并极大地提升错误处理的效率。koa 不在内核方法中绑定任何中间件，它仅仅提供了一个轻量优雅的函数库，使得编写 Web 应用变得得心应手。

##### 2. 快速开始

###### 2.1 安装koa2

```bash
# 初始化package.json
npm init

# 安装koa2
npm install koa
```

###### 2.2 hello world 代码

```js
const Koa = require('koa')
const app = new Koa()

app.use(async (ctx) => {
  ctx.body = 'hello koa2' // json数据
})

app.listen(3000)

```

###### 2.3 启动demo

```bash
node index.js
```

##### 3. koa vs express

通常都会说 Koa 是洋葱模型，这重点在于中间件的设计。但是按照上面的分析，会发现 Express 也是类似的，不同的是Express 中间件机制使用了 Callback 实现，这样如果出现异步则可能会使你在执行顺序上感到困惑，因此如果我们想做接口耗时统计、错误处理 Koa 的这种中间件模式处理起来更方便些。最后一点响应机制也很重要，Koa 不是立即响应，是整个中间件处理完成在最外层进行了响应，而 Express 则是立即响应。

###### 3.1更轻量

- koa 不提供内置的中间件；
- koa 不提供路由，而是把路由这个库分离出来了（koa/router）

###### 3.2 Context对象

koa增加了一个Context的对象，作为这次请求的上下文对象（在koa2中作为中间件的第一个参数传入）。同时Context上也挂载了Request和Response两个对象。和Express类似，这两个对象都提供了大量的便捷方法辅助开发, 这样的话对于在保存一些公有的参数的话变得更加合情合理

###### 3.3 异步流程控制

​ express采用callback来处理异步， koa v1采用generator，koa v2 采用async/await。

​ generator和async/await使用同步的写法来处理异步，明显好于callback和promise，

###### 3.4 中间件模型

​ express基于connect中间件，线性模型；

​ koa中间件采用洋葱模型（对于每个中间件，在完成了一些事情后，可以非常优雅的将控制权传递给下一个中间件，并能够等待它完成，当后续的中间件完成处理后，控制权又回到了自己）

```js
// 同步
var express = require('express')
var app = express()

app.use((req, res, next) => {
  console.log(1)
  next()
  console.log(4)
  res.send('hello')
})
app.use(() => {
  console.log(3)
})

app.listen(3000)
// 异步
var express = require('express')
var app = express()

app.use(async (req, res, next) => {
  console.log(1)
  await next()
  console.log(4)
  res.send('hello')
})
app.use(async () => {
  console.log(2)
  await delay(1)
  console.log(3)
})

function delay(time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 1000)
  })
}
```

```js
// 同步
var koa = require('koa')
var app = new koa()

app.use((ctx, next) => {
  console.log(1)
  next()
  console.log(4)
  ctx.body = 'hello'
})
app.use(() => {
  console.log(3)
})

app.listen(3000)

// 异步
var koa = require('koa')
var app = new koa()

app.use(async (ctx, next) => {
  console.log(1)
  await next()
  console.log(4)
  ctx.body = 'hello'
})
app.use(async () => {
  console.log(2)
  await delay(1)
  console.log(3)
})

function delay(time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 1000)
  })
}

app.listen(3000)
```

##### 4. 路由

###### 4.1基本用发

```js
const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()
const router = new Router()

router.post('/list', (ctx) => {
  ctx.body = ['111', '222', '333']
})
app.use(router.routes()).use(router.allowedMethods())
app.listen(3000)
```

###### 4.2 router.allowedMethods作用

###### 4.3 请求方式

Koa-router 请求方式： `get` 、 `put` 、 `post` 、 `patch` 、 `delete` 、 `del` ，而使用方法就是 `router.方式()` ，比如 `router.get()` 和 `router.post()` 。而 `router.all()` 会匹配所有的请求方法。

```js
const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()
const router = new Router()

router.get('/user', (ctx) => {
  ctx.body = ['aaa', 'bbb', 'ccc']
})
  .put('/user/:id', (ctx) => {
    ctx.body = { ok: 1, info: 'user update' }
  })
  .post('/user', (ctx) => {
    ctx.body = { ok: 1, info: 'user post' }
  })
  .del('/user/:id', (ctx) => {
    ctx.body = { ok: 1, info: 'user del' }
  })

app.use(router.routes()).use(router.allowedMethods())
app.listen(3000)
```

###### 4.4 拆分路由

list.js

```js
const Router = require('koa-router')
const router = new Router()
router.get('/', (ctx) => {
  ctx.body = ['111', '222', '333']
})
  .put('/:id', (ctx) => {
    ctx.body = { ok: 1, info: 'list update' }
  })
  .post('/', (ctx) => {
    ctx.body = { ok: 1, info: 'list post' }
  })
  .del('/:id', (ctx) => {
    ctx.body = { ok: 1, info: 'list del' }
  })
module.exports = router
```

index.js

```js
const Router = require('koa-router')
const router = new Router()
const list = require('./list')
const user = require('./user')
router.use('/user', user.routes(), user.allowedMethods())
router.use('/list', list.routes(), list.allowedMethods())

module.exports = router
```

entry入口

```js
const Koa = require('koa')
const router = require('./router/index')

const app = new Koa()
app.use(router.routes()).use(router.allowedMethods())
app.listen(3000)
```

###### 4.5 路由前缀

```js
router.prefix('/api')
```

###### 4.6 路由重定向

```js
router.get('/home', (ctx) => {
  ctx.body = 'home页面'
})
// 写法1
router.redirect('/', '/home')
// 写法2
router.get('/', (ctx) => {
  ctx.redirect('/home')
})
```

##### 5. 静态资源

```js
const Koa = require('koa')
const path = require('path')
const static = require('koa-static')

const app = new Koa()

app.use(static(
  path.join( __dirname,  "public")
))

app.use( async ( ctx ) => {
  ctx.body = 'hello world'
})

app.listen(3000, () => {
  console.log('[demo] static-use-middleware is starting at port 3000')
})

```

##### 6. 获取请求参数

###### 6.1get参数

在koa中，获取GET请求数据源头是koa中request对象中的query方法或querystring方法，query返回是格式化好的参数对象，querystring返回的是请求字符串，由于ctx对request的API有直接引用的方式，所以获取GET请求数据有两个途径。

- 是从上下文中直接获取 请求对象ctx.query，返回如 { a:1, b:2 } 请求字符串 ctx.querystring，返回如 a=1&b=2
- 是从上下文的request对象中获取 请求对象ctx.request.query，返回如 { a:1, b:2 } 请求字符串 ctx.request.querystring，返回如 a=1&b=2

###### 6.2post参数

对于POST请求的处理，koa-bodyparser中间件可以把koa2上下文的formData数据解析到ctx.request.body中

```js
const bodyParser = require('koa-bodyparser')

// 使用ctx.body解析中间件
app.use(bodyParser())

```

##### 7. ejs模板

###### 7.1 安装模块

```js
# 安装koa模板使用中间件
npm install --save koa-views

# 安装ejs模板引擎
npm install --save ejs

```

###### 7.2 使用模板引擎

**文件目录**

```
├── package.json
├── index.js
└── view
    └── index.ejs
```

**./index.js文件**

```js
const path = require('node:path')
const Koa = require('koa')
const views = require('koa-views')
const app = new Koa()

// 加载模板引擎
app.use(views(path.join(__dirname, './view'), {
  extension: 'ejs'
}))

app.use(async (ctx) => {
  const title = 'hello koa2'
  await ctx.render('index', {
    title,
  })
})

app.listen(3000)
```

**./view/index.ejs 模板**

```html
<!doctype html>
<html>
  <head>
    <title><%= title %></title>
  </head>
  <body>
    <h1><%= title %></h1>
    <p>EJS Welcome to <%= title %></p>
  </body>
</html>

```

##### 8. cookie&session

###### 8.1 cookie

koa提供了从上下文直接读取、写入cookie的方法

- ctx.cookies.get(name, [options]) 读取上下文请求中的cookie
- ctx.cookies.set(name, value, [options]) 在上下文中写入cookie

###### 8.2 session

- koa-session-minimal 适用于koa2 的session中间件，提供存储介质的读写接口 。

  ```js
  const session = require('koa-session-minimal')
  app.use(session({
    key: 'SESSION_ID',
    cookie: {
      maxAge: 1000 * 60
    }
  }))
  ```

  ```js
  app.use(async (ctx, next) => {
    // 排除login相关的路由和接口
    if (ctx.url.includes('login')) {
      await next()
      return
    }

    if (ctx.session.user) {
        / 重新设置以下sesssion
      ctx.session.mydate = Date.now()
        wait next()
    }
   else {
       tx.redirect('/login')
    }
  })
  ```

##### 9. JWT

```js
app.use(async (ctx, next) => {
 // 排除login相关的路由和接口
 if (ctx.url.includes('login')) {
       await next()
     return
 }
 const token = ctx.headers.authorization?.split(' ')[1]
 // console.log(req.headers["authorization"])
 if (token) {
     const payload =  JWT.verify(token)
     if (payload) {
         // 重新计算token过期时间
         const newToken = JWT.generate({
           _id: payload._id,
             username: payload.username
         }, "10s")

       tx.set("'Authorization'n ewToken)
         await next()
     e
   lse{
          tx.status = 401
         ctx.body = {e rrCode:- 1,e rrInfo:" token过期"}

 }e
   lse{
     wait next()

})
```

##### 10.上传文件

> https://www.npmjs.com/package/@koa/multer

```js
npm install --save @koa/multer multer
```

```js
const multer = require('@koa/multer')
const upload = multer({ dest: 'public/uploads/' })

router.post('/', upload.single('avatar'), (ctx, next) => {
  console.log(ctx.request.body, ctx.file)
  ctx.body = {
    ok: 1,
    info: 'add user success'
  }
})

```

##### 11.操作MongoDB

```js
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/kerwin_project')
// 插入集合和数据,数据库kerwin_project会自动创建
```

```js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserType = {
  username: String,
  password: String,
  age: Number,
  avatar: String
}

const UserModel = mongoose.model('user', new Schema(UserType))
// 模型user 将会对应 users 集合,
module.exports = UserModel
```

<br />

## Socket编程

##### 1.websocket介绍

**应用场景：**

- 弹幕

- 媒体聊天

- 协同编辑

- 基于位置的应用

- 体育实况更新

- 股票基金报价实时更新

WebSocket并不是全新的协议，而是利用了HTTP协议来建立连接。我们来看看WebSocket连接是如何创建的。

首先，WebSocket连接必须由浏览器发起，因为请求协议是一个标准的HTTP请求，格式如下：

```js
GET ws://localhost:3000/ws/chat HTTP/1.1
Host: localhost
Upgrade: websocket
Connection: Upgrade
Origin: http://localhost:3000
Sec-WebSocket-Key: client-random-string
Sec-WebSocket-Version: 13
```

该请求和普通的HTTP请求有几点不同：

1. GET请求的地址不是类似`/path/`，而是以`ws://`开头的地址；
2. 请求头`Upgrade: websocket`和`Connection: Upgrade`表示这个连接将要被转换为WebSocket连接；
3. `Sec-WebSocket-Key`是用于标识这个连接，并非用于加密数据；
4. `Sec-WebSocket-Version`指定了WebSocket的协议版本。

随后，服务器如果接受该请求，就会返回如下响应：

```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: server-random-string
```

该响应代码`101`表示本次连接的HTTP协议即将被更改，更改后的协议就是`Upgrade: websocket`指定的WebSocket协议。

版本号和子协议规定了双方能理解的数据格式，以及是否支持压缩等等。如果仅使用WebSocket的API，就不需要关心这些。

现在，一个WebSocket连接就建立成功，浏览器和服务器就可以随时主动发送消息给对方。消息有两种，一种是文本，一种是二进制数据。通常，我们可以发送JSON格式的文本，这样，在浏览器处理起来就十分容易。

为什么WebSocket连接可以实现全双工通信而HTTP连接不行呢？实际上HTTP协议是建立在TCP协议之上的，TCP协议本身就实现了全双工通信，但是HTTP协议的请求－应答机制限制了全双工通信。WebSocket连接建立以后，其实只是简单规定了一下：接下来，咱们通信就不使用HTTP协议了，直接互相发数据吧。

安全的WebSocket连接机制和HTTPS类似。首先，浏览器用`wss://xxx`创建WebSocket连接时，会先通过HTTPS创建安全的连接，然后，该HTTPS连接升级为WebSocket连接，底层通信走的仍然是安全的SSL/TLS协议。

**浏览器支持**

很显然，要支持WebSocket通信，浏览器得支持这个协议，这样才能发出`ws://xxx`的请求。目前，支持WebSocket的主流浏览器如下：

- Chrome
- Firefox
- IE >= 10
- Sarafi >= 6
- Android >= 4.4
- iOS >= 8

**服务器支持**

由于WebSocket是一个协议，服务器具体怎么实现，取决于所用编程语言和框架本身。Node.js本身支持的协议包括TCP协议和HTTP协议，要支持WebSocket协议，需要对Node.js提供的HTTPServer做额外的开发。已经有若干基于Node.js的稳定可靠的WebSocket实现，我们直接用npm安装使用即可。

##### 2.ws模块

服务器：

```js
const WebSocket = require('ws')
WebSocketServer = WebSocket.WebSocketServer
const wss = new WebSocketServer({ port: 8080 })
wss.on('connection', (ws) => {
  ws.on('message', (data, isBinary) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary })
      }
    })
  })

  ws.send('欢迎加入聊天室')
})
```

客户端：

```js
const ws = new WebSocket('ws://localhost:8080')
ws.onopen = () => {
  console.log('open')
}
ws.onmessage = (evt) => {
  console.log(evt.data)
}
```

授权验证：

```js
// 前端
const ws = new WebSocket(`ws://localhost:8080?token=${localStorage.getItem('token')}`)
ws.onopen = () => {
  console.log('open')
  ws.send(JSON.stringify({
    type: WebSocketType.GroupList
  }))
}
ws.onmessage = (evt) => {
  console.log(evt.data)
}
// 后端
const WebSocket = require('ws')
const JWT = require('../util/JWT')
WebSocketServer = WebSocket.WebSocketServer
const wss = new WebSocketServer({ port: 8080 })
wss.on('connection', (ws, req) => {
  const myURL = new URL(req.url, 'http://127.0.0.1:3000')
  const payload = JWT.verify(myURL.searchParams.get('token'))
  if (payload) {
    ws.user = payload
    ws.send(createMessage(WebSocketType.GroupChat, ws.user, '欢迎来到聊天室'))

    sendBroadList() // 发送好友列表
  }
  else {
    ws.send(createMessage(WebSocketType.Error, null, 'token过期'))
  }
  // console.log(3333,url)
  ws.on('message', (data, isBinary) => {
    const messageObj = JSON.parse(data)
    switch (messageObj.type) {
      case WebSocketType.GroupList:
        ws.send(createMessage(WebSocketType.GroupList, ws.user, JSON.stringify(Array.from(wss.clients).map(item => item.user))))
        break
      case WebSocketType.GroupChat:
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(createMessage(WebSocketType.GroupChat, ws.user, messageObj.data))
          }
        })
        break
      case WebSocketType.SingleChat:
        wss.clients.forEach((client) => {
          if (client.user.username === messageObj.to && client.readyState === WebSocket.OPEN) {
            client.send(createMessage(WebSocketType.SingleChat, ws.user, messageObj.data))
          }
        })
        break
    }

    ws.on('close', () => {
      // 删除当前用户
      wss.clients.delete(ws.user)
      sendBroadList() // 发送好用列表
    })
  })
})
const WebSocketType = {
  Error: 0, // 错误
  GroupList: 1, // 群列表
  GroupChat: 2, // 群聊
  SingleChat: 3// 私聊
}
function createMessage(type, user, data) {
  return JSON.stringify({
    type,
    user,
    data
  })
}

function sendBroadList() {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(createMessage(WebSocketType.GroupList, client.user, JSON.stringify(Array.from(wss.clients).map(item => item.user))))
    }
  })
}
```

##### 3.socket.io模块

服务端：

```js
const io = require('socket.io')(server)
io.on('connection', (socket) => {
  const payload = JWT.verify(socket.handshake.query.token)
  if (payload) {
    socket.user = payload
    socket.emit(WebSocketType.GroupChat, createMessage(socket.user, '欢迎来到聊天室'))
    sendBroadList() // 发送好友列表
  }
  else {
    socket.emit(WebSocketType.Error, createMessage(null, 'token过期'))
  }

  socket.on(WebSocketType.GroupList, () => {
    socket.emit(WebSocketType.GroupList, createMessage(null, Array.from(io.sockets.sockets).map(item => item[1].user).filter(item => item)))
  })

  socket.on(WebSocketType.GroupChat, (messageObj) => {
    socket.broadcast.emit(WebSocketType.GroupChat, createMessage(socket.user, messageObj.data))
  })

  socket.on(WebSocketType.SingleChat, (messageObj) => {
    Array.from(io.sockets.sockets).forEach((socket) => {
      if (socket[1].user.username === messageObj.to) {
        socket[1].emit(WebSocketType.SingleChat, createMessage(socket[1].user, messageObj.data))
      }
    })
  })

  socket.on('disconnect', (reason) => {
    sendBroadList() // 发送好用列表
  })
})

function sendBroadList() {
  io.sockets.emit(WebSocketType.GroupList, createMessage(null, Array.from(io.sockets.sockets).map(item => item[1].user).filter(item => item)))
}
// 最后filter，是因为 有可能存在null的值

```

客户端：

```js
const WebSocketType = {
  Error: 0, // 错误
  GroupList: 1, // 群列表
  GroupChat: 2, // 群聊
  SingleChat: 3 // 私聊
}

const socket = io(`ws://localhost:3000?token=${localStorage.getItem('token')}`)
socket.on('connect', () => {
  socket.emit(WebSocketType.GroupList)
})
socket.on(WebSocketType.GroupList, (messageObj) => {
  select.innerHTML = ''
  select.innerHTML = `<option value="all">all</option>${messageObj.data.map(item => `
    <option value="${item.username}">${item.username}</option>`).join('')}`
})

socket.on(WebSocketType.GroupChat, (msg) => {
  console.log(msg)
})

socket.on(WebSocketType.SingleChat, (msg) => {
  console.log(msg)
})

socket.on(WebSocketType.Error, (msg) => {
  localStorage.removeItem('token')
  location.href = '/login'
})

send.onclick = () => {
  if (select.value === 'all') {
    socket.emit(WebSocketType.GroupChat, {
      data: text.value
    })
  }
  else {
    socket.emit(WebSocketType.SingleChat, {
      data: text.value,
      to: select.value
    })
  }
}
```

## mocha

单元测试是用来对一个模块、一个函数或者一个类来进行正确性检验的测试工作。

比如对函数abs()，我们可以编写出以下几个测试用例：

输入正数，比如1、1.2、0.99，期待返回值与输入相同；

输入负数，比如-1、-1.2、-0.99，期待返回值与输入相反；

输入0，期待返回0；

输入非数值类型，比如null、[]、{}，期待抛出Error。

把上面的测试用例放到一个测试模块里，就是一个完整的单元测试。

如果单元测试通过，说明我们测试的这个函数能够正常工作。如果单元测试不通过，要么函数有bug，要么测试条件输入不正确，总之，需要修复使单元测试能够通过。

单元测试通过后有什么意义呢？如果我们对abs()函数代码做了修改，只需要再跑一遍单元测试，如果通过，说明我们的修改不会对abs()函数原有的行为造成影响，如果测试不通过，说明我们的修改与原有行为不一致，要么修改代码，要么修改测试。

这种以测试为驱动的开发模式最大的好处就是确保一个程序模块的行为符合我们设计的测试用例。在将来修改的时候，可以极大程度地保证该模块行为仍然是正确的。

mocha是JavaScript的一种单元测试框架，既可以在浏览器环境下运行，也可以在Node.js环境下运行。

使用mocha，我们就只需要专注于编写单元测试本身，然后，让mocha去自动运行所有的测试，并给出测试结果。

mocha的特点主要有：

1. 既可以测试简单的JavaScript函数，又可以测试异步代码，因为异步是JavaScript的特性之一；
2. 可以自动运行所有测试，也可以只运行特定的测试；
3. 可以支持before、after、beforeEach和afterEach来编写初始化代码。

##### 1.编写测试

```js
const assert = require('node:assert')
const sum = require('../test')
describe('#hello.js', () => {
  describe('#sum()', () => {
    it('sum() should return 0', () => {
      assert.strictEqual(sum(), 0)
    })

    it('sum(1) should return 1', () => {
      assert.strictEqual(sum(1), 1)
    })

    it('sum(1, 2) should return 3', () => {
      assert.strictEqual(sum(1, 2), 3)
    })

    it('sum(1, 2, 3) should return 6', () => {
      assert.strictEqual(sum(1, 2, 3), 6)
    })
  })
})
```

##### 2.chai断言库

```js
const chai = require('chai')
const assert = chai.assert

describe('assert Demo', () => {
  it('use assert lib', () => {
    const value = 'hello'
    assert.typeOf(value, 'string')
    assert.equal(value, 'hello')
    assert.lengthOf(value, 5)
  })
})

```

```js
const chai = require('chai')
chai.should()

describe('should Demo', () => {
  it('use should lib', () => {
    const value = 'hello'
    value.should.exist.and.equal('hello').and.have.length(5).and.be.a('string')
    // value.should.be.a('string')
    // value.should.equal('hello')
    // value.should.not.equal('hello2')
    // value.should.have.length(5);
  })
})

```

```js
const chai = require('chai')
const expect = chai.expect

describe('expect Demo', () => {
  it('use expect lib', () => {
    const value = 'hello'
    const number = 3

    expect(number).to.be.at.most(5)
    expect(number).to.be.at.least(3)
    expect(number).to.be.within(1, 4)

    expect(value).to.exist
    expect(value).to.be.a('string')
    expect(value).to.equal('hello')
    expect(value).to.not.equal('您好')
    expect(value).to.have.length(5)
  })
})

```

##### 3.异步测试

```js
const fs = require('node:fs').promises
const chai = require('chai')
const expect = chai.expect
it('test async function', async () => {
  const data = await fs.readFile('./1.txt', 'utf8')
  expect(data).to.equal('hello')
})
```

##### 4.http测试

```js
const request = require('supertest')
const app = require('../app')

describe('#test koa app', () => {
  const server = app.listen(3000)
  describe('#test server', () => {
    it('#test GET /', async () => {
      await request(server)
        .get('/')
        .expect('Content-Type', /text\/html/)
        .expect(200, '<h1>hello world</h1>')
    })

    after(() => {
      server.close()
    })
  })
})
```

##### 5.钩子函数

```js
describe('#hello.js', () => {
  describe('#sum()', () => {
    before(() => {
      console.log('before:')
    })

    after(() => {
      console.log('after.')
    })

    beforeEach(() => {
      console.log('  beforeEach:')
    })

    afterEach(() => {
      console.log('  afterEach.')
    })
  })
})
```

<br />

## 模块化

### CommonJS

Node.js 中 CommonJS 规范的模块导入导出用法：

- 导出；
  - module.exports；
  - exports；
- 导入；
  - require。

<br />

### ESM

ES Modules (ESM) 模块系统是在 ECMAScript 6 (ES2015/ES6) 中引入的一项重要特性，旨在取代 CommonJS 和 AMD 规范，成为 JavaScript 模块化的主要标准。

为了使 Node.js 正确识别 ESM 模块，通常有 2 种方式：

- 使用 `.mjs` 作为文件后缀名
- 在 `package.json` 中设置 `type` 字段为 `module`

ES Modules 中的导入导出有多种用法，主要介绍了以下 4 种使用场景：

- 默认导入导出 (`export default`，`import xx from 'module'`)
- 具名导入导出 (`export xx`，`import { xx } from 'module'`)
- 导入导出所有 (`export *`，`import * as xx from 'module'`)
- 重新导出 (`export { xx } from 'module'`，`export * from 'module'`)

最后介绍了 2 种将 ESM 模块转换为 CJS 模块的工具，`tsup` 和 `ncc`。

<br />

### 模块加载时机

- `CJS` 支持动态加载模块 (`require` 语句可以出现在任意位置)
- ESM会在所有模块都加载完毕后才执行代码 (通常会将 `import` 导入语句放在模块的顶部)
  - ESM 是静态解析的，它会在编译时首先解析模块中的导入语句，虽然通常会将导入语句放在模块的顶部，**但并不是要求所有的 import 语句必须在文件顶部**，只要在使用导入的内容之前进行导入即可

::: tip

**_因此 `ESM` 可以在代码执行前进行静态分析和优化，从而提高性能 (比如自动移除无用的死代码)。不管何时import，都会统一执行模块代码_**

**_而 `CJS` 需要等到代码运行时才能确定依赖关系和加载模块，会在require之后才会执行模块代码。_**

:::

<br />

### 导出内容的区别

ES Modules (ESM) 和 CommonJS (CJS) 在导入模块的对象引用上有不同的行为。

在 ESM 中，当我们导入一个变量时，实际上是导入了该变量的引用。这意味着，如果导出的变量在导入模块中发生了改变，导入的变量也会随之改变。

而在 CommonJS 中，导入的是导出模块的值的拷贝，而不是引用。这意味着，即使导出模块中的值发生了改变，导入模块中导入的变量不会受到影响。

简而言之，**ESM 导入的是值的引用，而 CJS 导入的是值的拷贝**。

<br />

### 文件命名

通常情况下模块一般都以 `.js` 结尾，通过 `package.json` 中 `"type":"module"` 区分模块类型，

实际上还可以通过文件命名来区分 `.cjs` 表明是 CJS 规范的模块，`.mjc` 表明是 ESM 规范的模块。

<br />

## 内置模块

| 模块名称      | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| global        | 全局对象，挂载了一些常用方法和属性                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| path          | 提供与文件路径相关的实用工具方法                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| fs            | 文件系统模块，用于操作文件和目录                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| util          | 提供一些实用工具函数                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| http          | 用于创建 HTTP 服务器，也可用于向已有服务发起请求并获取响应                                                                                                                                                                                                                                                                                                                                                                                                                |
| child_process | 用于创建操作子进程                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 其他工具模块  | [ url](https://link.juejin.cn/?target=https%3A%2F%2Fnodejs.cn%2Fdist%2Flatest-v18.x%2Fdocs%2Fapi%2Furl.html)，[Timers](https://link.juejin.cn/?target=https%3A%2F%2Fnodejs.cn%2Fdist%2Flatest-v18.x%2Fdocs%2Fapi%2Ftimers.html)，[Readline](https://link.juejin.cn/?target=https%3A%2F%2Fnodejs.cn%2Fdist%2Flatest-v18.x%2Fdocs%2Fapi%2Freadline.html)，[crypto](https://link.juejin.cn/?target=https%3A%2F%2Fnodejs.cn%2Fdist%2Flatest-v18.x%2Fdocs%2Fapi%2Fcrypto.html) |

### global

`JavaScript` 中存在一个特殊的全局对象，可以在任意位置被访问，通常用 `globalThis` 指代。

在浏览器中，指向 `window` 这个全局对象，而 Node.js 中指向 `global`，

当我们直接使用一些无需定义的方法时 (例如 `console`，`setTimeout` 等)，它们都是 `global` ([Global objects](https://link.juejin.cn/?target=https%3A%2F%2Fnodejs.org%2Fdocs%2Flatest-v18.x%2Fapi%2Fglobals.html%23global-objects)) 上的属性。

<br />

#### 1. 特殊的全局变量

- `__filename` ：表示当前正在执行的脚本文件的绝对路径。
- `__dirname` ：表示当前执行脚本所在目录的绝对路径。

::: danger

这 2 个变量，只在 CJS 模块下存在！

:::

<br />

#### 2. ESM中使用CJS特有的变量和方法

```js
import { createRequire } from 'node:module'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('__filename', __filename)
console.log('__dirname', __dirname)

const require = createRequire(import.meta.url)
console.log('name', require('./package.json').name)
```

<br />

#### 3. 常用属性

**process**：提供了与当前 `Node.js` 进程相关的信息和控制方法。

- `process.argv` ：返回一个数组，包含启动 Node.js 进程时传递的命令行参数。

  - 第一个参数是 Node 在机器上的位置
  - 第二个参数是执行文件的绝对路径
  - 后续参数都为用户传递的自定义参数。

- `process.cwd()` ：获取当前工作目录的绝对路径

- `process.env` ：获取当前执行环境的环境变量 (对象形式)

- `process.version` ：获取当前 Node 版本

- `process.exit([code])`：终止 Node.js 进程，如果指定了 `code` 参数，则使用该参数作为退出状态码

- `process.pid`：返回进程的 PID (进程 ID)

- `process.platform`：返回运行 `Node.js` 的操作系统平台

- `process.arch`：获取 CPU 架构信息

- `process.stdout`：标准输出流，常用 `process.stdout.write` 进行数据写入

  ```js
  process.stdout.write('hello')
  process.stdout.write(' ')
  process.stdout.write('world')
  process.stdout.write('\n')
  ```

- `process.stdin`：用于从标准输入流 (stdin) 读取数据

  ```js
  // 监听用户输入数据
  process.stdin.on('data', (data) => {
    console.log(`User input: ${data}`)
  })
  ```

<br />

**Buffer**：用于处理二进制数据。类似于数组，并提供了一些方便的方法来操作二进制数据。

下面是一些常见用法。

**① 创建 Buffer 对象**

```js
const buf = Buffer.alloc(10) // 创建一个大小为 10 的 Buffer 对象，默认会用 0 填充
const buf2 = Buffer.from('Hello, world!') // 创建一个包含字符串 'Hello, world!' 的 Buffer 对象
const buf3 = Buffer.from([0x68, 0x65, 0x6C, 0x6C, 0x6F]) // 内容为hello构成的16进制数组 Buffer 对象
```

**② 转换内容格式**

```js
const buf = Buffer.from('Hello, world!')
// 转为字符串输出
console.log(buf.toString()) // 输出 'Hello, world!'

// 转为16进制字符串输出
console.log(buf.toString('hex')) // 输出 '48656c6c6f2c20776f726c6421'（对应的是 'Hello, world!' 的 ASCII 码）

// 转为数组输出
console.log(Array.from(buf)) // 输出 [
//    72, 101, 108, 108, 111,
//    44,  32, 119, 111, 114,
//   108, 100,  33
// ]

// 转为base64格式输出
console.log(buf.toString('base64')) // 输出 'SGVsbG8sIHdvcmxkIQ=='
```

**③ 写入内容**

```javascript
// 创建一个长度为 10 的 Buffer 实例并将它填充为 0
const buf = Buffer.alloc(10)

// 将字符串 'Hello' 写入 Buffer 实例的前 5 个字节
buf.write('Hello')

// 将字符串 'world' 写入 Buffer 实例的第 6 个字节开始的位置，由于 'world' 的长度为 5，所以不会覆盖掉之前写入的 'Hello'
buf.write('world', 5)

// 将 Buffer 实例转换为字符串并输出 'Hello world'
console.log(buf.toString())
```

**④ 合并多个 Buffer 对象**

```js
const buf1 = Buffer.from('Hello')
const buf2 = Buffer.from('World')
const buf3 = Buffer.concat([buf1, buf2])
console.log(buf3.toString()) // 输出 'HelloWorld'
```

**⑤ 截取 Buffer 对象**

```js
const buf = Buffer.from('Hello, world!')
const buf2 = buf.slice(0, 5)
console.log(buf2.toString()) // 输出 'Hello'
```

<br />

### path

```js
// 两种获取绝对路径方法
path.resolve('xxx')
path.join(__dirname, 'xxx')
```

- `path.join`：将多个路径拼接成一个相对路径 (或绝对路径，取决于第一个路径是否为根路径)。
- `path.resolve`：将多个路径拼接成一个绝对路径，返回一个解析后的绝对路径。即如果传入相对路径，会以当前工作目录为基准，计算出绝对路径，如果传入了绝对路径，则以传入的绝对路径为基准。
- `path.dirname`：返回路径中的目录名
- `path.basename`：返回路径中的文件名，并可选地去除给定的文件扩展名
- `path.extname`：获取路径中的文件扩展名
- `path.normalize`：主要用于规范化路径，将路径中的不规范部分调整为标准格式，可以用于处理以下问题：
  - 路径中的斜杠数量过多的情况。
  - 路径中存在的 `./` 或 `../`，即相对路径的情况。
- `path.parse`：用于解析文件路径，将其拆分为一个对象
- `path.sep`：返回当前系统文件路径使用的分隔符。例如在 Windows 操作系统上，`path.sep` 的值为反斜杠 `\`，而在 Unix 操作系统上则为正斜杠 `/`。

::: tip

path 模块常用的方法：

- 拼接路径：`join`，`resolve`；
- 解析路径：`parse`，`dirname`，`basename`，`extname`；
- 规范化路径：`normalize`；
- 获取分隔符：`sep`。

使用 path 模块可以更加方便和安全地处理文件路径，避免因为不同操作系统使用不同的文件路径分隔符而导致程序运行出错。

:::

<br />

### fs

是文件系统模块，用于操作文件和目录。支持同步 (sync) 或者异步 (async/callback) 调用，其中同步调用会阻塞主线程，异步调用不会阻塞。

三种调用文件系统 API 的方式：

- 同步 (Sync)：例如 `fs.readFileSync`，会阻塞主线程；
- 异步 (Async/Callback)：`fs.promises.readFile`，`fs.readFile`，不会阻塞主线程。

日常使用中推荐使用 `fs/promise` 的方式。

<br />

### util

- `util.inspect(object, [options])`，常与 `console.log` 搭配使用，可以友好的将对象转为字符串，打印更加友好。

<br />

### http

`http.request` 和 `http.response` 对象上常用的方法和属性的获取方式：

- request：`url` (请求路径)、`method` (请求方法)、`headers` (请求头部)、`body` (请求体)、`query` (url 携带查询参数)；
- response：`statusCode` (响应状态码)、`setHeader` (设置响应头)、`write/end` (设置响应内容)。

<br />

### child_process

因此虽然 js 是单线程的，但通过创建子进程也能实现多任务并行处理，也可通过其调用系统的功能指令完成复杂的任务。

主要提供了 4 个方法：`spawn`、`exec`、`execFile` 和 `fork`。

- `spawn` 启动一个子进程来执行指定的命令，并且可以通过流式数据通信与子进程进行交互
- `exec` 启动一个 shell，并在 shell 中执行指定命令，执行完毕后插入 `stdout/stderr` 中，适用于一些命令行工具
- `execFile` 与 `exec` 类似，但是可以直接执行某个文件，而无需通过 shell 执行
- `fork` 专门用于在 `Node.js` 中衍生新的进程来执行 JavaScript 文件，并且建立一个与子进程的 `IPC` 通信管道

<br />

## Event Loop

1. 先执行同步代码
2. 执行微任务队列中所有的回调：首先执行 `nextTick队列`，然后 `promise队列`
3. 执行计时器队列中的所有回调，**执行过程中如果存在微任务队列，则在每个回调之后就执行微任务队列中的回调**
4. 执行 I/O 队列中的所有回调，如果过程中存在微任务队列，则先执行微任务
5. 执行 `setImmediate` 回调，同理有微任务，优先执行微任务
6. 执行关闭队列中的所有回调，最后执行剩余的微任务

## TypeScript支持

`TypeScript` 是当下最流行的变成语言之一，本节内容分类介绍了多种通过 Node.js 运行 TS 的方法：

- 编译 TS 为 JS：`tsc`，`ncc`，`tsup`，`bun`；
- Node.js 加载自定义文件支持：自定义 `module.Module._extensions` 支持；
- 支持运行 TS 的 Node CLI 工具：`ts-node`，`tsx`，`swno`；
- 其它的 TS 运行时：`Deno`，`Bun`。

### 编译为JS

1. tsc
2. ncc
3. tsup
4. bun

<br />

### 加载自定义文件类型

Node.js 中可以通过自定义 `module.Module._extensions` 的值来实现加载自定义的文件类型的功能。

```typescript
const fs = require('node:fs') // 导入文件系统模块
const ts = require('typescript') // 导入 TypeScript 编译器

// 自定义 .ts 文件的加载器
require.extensions['.ts'] = function (module, filename) {
  const content = fs.readFileSync(filename, 'utf8') // 读取文件内容
  const compiled = ts.transpileModule(content, {
    // 编译 TypeScript 代码
    compilerOptions: { module: ts.ModuleKind.CommonJS }
  })
  module._compile(compiled.outputText, filename) // 执行编译后的代码
}
```

同时可以通过 `-r` 参数指定预加载的模块或执行的文件文件，因此两者结合就可以直接运行 `TS` 文件。

```js
node -r ./ts-register.js index.ts
```

<br />

### CLI工具

这些CLI工具都使用全局依赖的形式安装。

1. ts-node：Node.js 的 TypeScript 执行引擎和 REPL
2. tsx：支持直接执行 TypeScript：基于 esbuild 增强的 Node.js 实现，速度更快
3. swno：由 SWC 驱动的 TS 运行时

<br />

### TS运行时

1. deno
2. bun

<br />

## 单元测试

Node.js 中编写单元测试，大体分为如下两类：

- 内置的测试模块：`assert`、`test`；
- 第三方测试框架：`Vitest`、`Jest`、`Mocha` 等。

## web-server

下面是业界里较出名的一些 Node.js 框架。

国外：

- [NestJS](https://link.juejin.cn/?target=https%3A%2F%2Fnestjs.com%2F)：用于构建高效、可扩展的 Node.js 服务器端应用程序的开发框架；
- [Express](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fexpressjs%2Fexpress)：高度包容、快速而极简的 Node.js Web 框架；
- [Koa](https://link.juejin.cn/?target=https%3A%2F%2Fkoajs.com%2F)：基于 Node.js 平台的下一代 web 开发框架；
- [fastify](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ffastify%2Ffastify)：快速并且低开销的 web 框架，专为 Node.js 平台量身打造。

国内 (都是阿里出品)：

- [Egg](https://link.juejin.cn/?target=https%3A%2F%2Fwww.eggjs.org%2Fzh-CN)：Egg.js 为企业级框架和应用而生；
- [Midway](https://link.juejin.cn/?target=https%3A%2F%2Fmidwayjs.org%2F)：Node.js 框架，通过自研的依赖注入容器，搭配各种上层模块，组合出适用于不同场景的解决方案。

其它当下还比较小众的：

- [hono](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fhonojs%2Fhono)：小巧、简单且超快的 Web 框架，支持在任何 JS 运行时上运行；
- [Deepkit](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fdeepkit%2Fdeepkit-framework)：高性能 TypeScript 框架，适用于企业级 TypeScript 应用程序开发。

其中 `NestJS, Egg, Midway` 都是非常适合开发大型项目的，内置了许多开箱即用的能力和解决方案。

其它的框架都是比较轻量级的，适合个人/小团队开发小型项目，利用社区生态中提供的丰富功能插件完成应用开发。

### http

#### 1. 请求方法

| 方法    | 场景                                                                         |
| ------- | ---------------------------------------------------------------------------- |
| GET     | 用于获取资源，如网页、图片等数据。GET 请求通常不会对服务器资源进行修改       |
| POST    | 用于向服务器提交数据，通常会对服务器进行修改。常用于表单提交、注册、登录场景 |
| PUT     | 更新服务器上的资源。通常用于更新或替换已有的资源                             |
| DELETE  | 通常用于删除服务器上的资源                                                   |
| OPTIONS | 用于获取与资源相关的选项，如允许的请求方法、代理等。通常用于跨域请求的预检   |
| PATCH   | 用于对资源进行局部修改。常用于更新资源的部分属性                             |
| HEAD    | 类似于 GET 请求，但不返回响应体。常用于检查资源的元数据，如长度、类型等      |
| CONNECT | 用于建立一个 TCP/IP 隧道到另一个服务器，如 `WebSocket` 场景                  |
| TRACE   | 用于调试信息。通常用于开发和测试场景                                         |

<br />

#### 2. URL构成

```sh
scheme://host:port/path?query
```

| 名称   | 含义                             |
| ------ | -------------------------------- |
| scheme | 协议（HTTP/HTTPS/FTP..）         |
| host   | 主机名（通常说的域名或ip）       |
| port   | 端口号（默认HTTP 80，HTTPS 443） |
| path   | 资源路径（例如 /hello）          |
| query  | 用于查询的参数 (?id=1)           |

<br />

#### 3. RESTful API

在当下的 Web 开发中，REST (Representational State Transfer) 架构风格被广泛采用。

RESTful API 是一个基于 REST 架构风格构建的 Web 服务。

它对数据的操作分别使用 HTTP 协议提供的 GET (获取数据)、POST (添加数据)、PUT (更新数据)、DELETE (删除数据) 等方法来表示。

同时还可以配合路由传参，来编写更加语义化的 API。

| 方法   | 路径           | 描述                                               |
| ------ | -------------- | -------------------------------------------------- |
| GET    | /api/users     | 获取所有用户信息                                   |
| GET    | /api/users/:id | 根据用户ID获取用户信息                             |
| POST   | /api/users     | 创建新用户，请求体包含新用户的信息                 |
| PUT    | /api/users/:id | 根据用户ID更新用户信息，请求体包含更新后的用户信息 |
| DELETE | /api/users/:id | 根据用户ID删除用户信息                             |

<br />

## npm 包开发

### 1. 项目结构

当下通常的 npm 包源码结构如下，`src` 目录存放源码，同时使用 `ts` 进行开发。

```sh
├── package.json
└── src
   └── index.ts
```

<br />

### 2. 开发&构建

实际用户运行的肯定是 js 代码，所以这里我们需要将 ts 代码编译成 js 代码。

## Node原生部署方案

`Node`要求使用`ESM`的文件采用`.mjs`后缀，只要文件中存在`import/export命令`就必须使用`.mjs`后缀。若不希望修改文件后缀，可在`package.json`中指定`type`为`module`。基于此，若其他文件使用`CJS`，就需将其文件后缀改成`.cjs`。若在`package.json`中未指定`type`或指定`type`为`commonjs`，则以`.js`为后缀的文件会被解析为`CJS`。

简而言之，`mjs文件`使用`ESM`解析，`cjs文件`使用`CJS`解析，`js文件`使用基于`package.json`指定的`type`解析(`type=commonjs`使用`CJS`，`type=module`使用`ESM`)。

将`Node v13.2.0`作为高低版本分界线，当版本`>=13.2.0`则定为高版本，当版本`<13.2.0`则定为低版本。高版本使用`Node原生部署方案`，低版本使用`Node编译部署方案`。

```js
import { readFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
console.log(__filename, __dirname)

const json = readFileSync('./info.json')
const info = JSON.parse(json)
```

## Node编译部署方案

`Npm`很多模块都使用`CJS`编码，因为同时使用`require`与`export/import`会报错，所以单个模块无法切换到`ESM`。

可用`babel`将代码从`ESM`转换为`CJS`，因此使用`babel`编译`ESM`代码是低版本`Node`支持`ESM`最稳定的方案无之一。在`Node v8.9.0`前的版本无法使用`--experimental-modules`支持`ESM`，也就更需`babel`解决该问题了。

当然在任何版本中，`babel`都能让新语法转换为与旧环境兼容的代码，因此在`高版本Node`中也同样适用。
