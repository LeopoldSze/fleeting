---
title: JavaScript
date: '2026-06-09 08:59:48'
updated: '2026-06-09 11:00:05'
slug: js
order: 2
---
## 判断数据类型
### 1. typeof
两种形式：`typeof x` 或者 `typeof(x)`

```javascript
// 原始类型
// number: number
console.log('number:', typeof 1)

// string: string
console.log('string:', typeof '1')

// boolean: boolean
console.log('boolean:', typeof true)

// undefined: undefined
console.log('undefined:', typeof undefined)

// symbol: symbol
console.log('symbol:', typeof Symbol(1))

// bigint: bigint
console.log('bigint:', typeof 10n)

// 引用类型
// null: object
console.log('null:', typeof null)

// array: object
console.log('array:', typeof [1])

// object: object
console.log('object:', typeof { name: 'Sze' })

// function: function
console.log('function:', typeof function () {
  console.log('func')
})
```

### 2. instance of
用于检查对象是否属于特定类型的实例：`constructor.name`，对象的 `constructor` 属性指向创建该对象的构造函数

```javascript
// instance: true
console.log('instance:', Array.isArray([]))
console.log([].__proto__.constructor.name) //
```

### 3. Object.prototype.toString
```javascript
const number = Object.prototype.toString.call(1)
const string = Object.prototype.toString.call('1')
const boolean = Object.prototype.toString.call(true)
const undef = Object.prototype.toString.call(undefined)
const symbol = Object.prototype.toString.call(Symbol(1))
const nu = Object.prototype.toString.call(null)
const bigint = Object.prototype.toString.call(1n)
const array = Object.prototype.toString.call([1])
const obj = Object.prototype.toString.call({ name: 'Sze' })
const func = Object.prototype.toString.call(() => {
  console.log('func--')
})

// number: [object Number]
console.log('number:', number)

// string: [object String]
console.log('string:', string)

// boolean: [object Boolean]
console.log('boolean:', boolean)

// undefined: [object Undefined]
console.log('undefined:', undef)

// symbol: [object Symbol]
console.log('symbol:', symbol)

// null: [object Null]
console.log('null:', nu)

// bigint: [object BigInt]
console.log('bigint:', bigint)

// array: [object Array]
console.log('array:', array)

// object: [object Object]
console.log('object:', obj)

// function: [object Function]
console.log('function:', func)
```

### 4. 补充
```javascript
// 判断数组
Array.isArray([1]) // true

// 判断非数字
isNaN(',') // true
```

### 5. 封装
```javascript
function getType(x) {
  const t = typeof x

  if (x === null) {
    return 'null'
  }

  // 处理基本类型
  if (t !== 'object') {
    return t
  }

  const toString = Object.prototype.toString
  const innerType = toString.call(x).slice(8, -1)

  // 处理包装类型
  if (['String', 'Number', 'Boolean'].includes(innerType)) {
    return innerType
  }

  // 处理自定义构造对象类型
  if (typeof x?.constructor?.name === 'string') {
    return x.constructor.name
  }

  // 处理内部类型
  const innerLowType = innerType.toLowerCase()
  return innerLowType
}
```



## 精确加法运算
```javascript
/**
 * 精确加法
 */
function accurate_add(num1, num2) {
  const num1Digits = (num1.toString().split('.')[1] || '').length
  const num2Digits = (num2.toString().split('.')[1] || '').length
  const baseNum = 10 ** Math.max(num1Digits, num2Digits)
  return (num1 * baseNum + num2 * baseNum) / baseNum
}
```

  


## once
> 作用：函数只执行一次
>
> 原理：通过闭包变量判断函数是否执行
>

```javascript
function once(fn) {
  let count = 0

  return function (...args) {
    if (count === 0) {
      count += 1
      return fn(...args)
    }
  }
}
```

  


## curry
> 作用：柯里化，将普通函数变成可以传入部分参数的函数，常用于预设函数参数
>
> 原理：通过一个数组来存储传入的参数列表，当参数列表中实际存储的参数的个数达到预设参数个数时，就执行函数并返回结果
>

```javascript
function curry(func) {
  // 获取函数参数个数，ES2015默认参数需考量
  const len = func.length

  function partial(fn, argsList, argsLen) {
    // 当参数的个数达到期望个数时，返回执行结果
    if (argsList.length >= argsLen) {
      return fn(...argsList)
    }

    // 当参数个数少于期望个数时，继续返回函数
    rerurn function(...args) {
      return partial(fn, [...argsList, ...args], argsLen)
    }
  }

  return partial(func, [], len);
}
```

  


## 判断是否符合Promise A+
```javascript
/**
 * 判断是否是promise对象，即对象是否包含then方法
 * @param obj
 * @returns {boolean}
 */
function isPromiseLike(obj) {
  return obj?.then === 'function'
}
```

  


## 模拟微任务
```javascript
/**
 * 运行微任务
 * @param {Function} fn - 需要运行的函数
 */
function runMicroTasks(fn) {
  // 检查 fn 是否为函数
  if (typeof fn !== 'function') {
    throw new TypeError(`Expected a function, but received ${typeof fn}`)
  }

  // 使用 Promise 运行微任务
  if (typeof Promise === 'function') {
    return Promise.resolve().then(fn)
  }

  // 使用 queueMicrotask 运行微任务
  if (typeof queueMicrotask === 'function') {
    return queueMicrotask(fn)
  }

  // 使用 MutationObserver 运行微任务
  if (typeof MutationObserver === 'function') {
    const text = document.createTextNode('')
    const observer = new MutationObserver(() => {
      observer.disconnect() // 断开观察器以防止内存泄漏
      fn()
    })
    observer.observe(text, { characterData: true })
    text.data = '1'
    return
  }

  // 使用 Node.js 的 process.nextTick 运行微任务
  if (typeof process === 'object' && typeof process.nextTick === 'function') {
    return process.nextTick(fn)
  }

  // 使用 setTimeout 运行任务
  setTimeout(fn)
}
```

  


## promise链
> 作用：promise 依次执行
>
> 原理：reduce实现
>

```javascript
/**
 * 通过reduce实现promise依次执行
 * @param array
 * @param value
 * @returns {*}
 */
function runPromiseInSequence(array, value) {
  return array.reduce(
    (promiseChain, currentFn) => promiseChain.then(currentFn),
    Promise.resolve(value)
  )
}

function f1() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('p1 running')
      resolve(1)
    }, 1000)
  })
}

function f2() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('p2 running')
      resolve(2)
    }, 1000)
  })
}

const array = [f1, f2]
runPromiseInSequence(array, 'init')
```

  


## koa中的only
```javascript
/**
 * 通过reduce实现koa中的only模块
 * @param obj
 * @param keys
 * @returns {*}
 */
function only(obj = {}, keys = []) {
  return keys.reduce((result, key) => {
    if (obj[key] === null || obj[key] === undefined) {
      return result
    }
    result[key] = obj[key]
    return result
  }, {})
}
const onlyObj = {
  a: 1,
  b: 2,
  c: 3
}
const onlyRes = only(onlyObj, ['a', 'b', 'd'])
console.log('onlyRes:', onlyRes) // {a: 1, b: 2}
```

  


## 图片依次加载
```javascript
/**
 * 依次加载图片
 * @param urlId
 * @returns {Promise}
 */
function loadImg(urlId) {
  const url = `https://img2.woyaogexing.com/2023/05/28/${urlId}.jpg`
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onerror = () => {
      reject(urlId)
    }
    img.onload = () => {
      resolve(urlId)
    }
    img.src = url
    document.body.appendChild(img)
  })
}

const urlIds = ['ca3f6b2708148951062f1a10b567da6f', 'fc32bbba5b36a45b954a9775516a5f6f', 'f6cdf2ef5ae2ee10641937a2d47671d7', 'e52de5bf9a4fb8531dbf2eef50f0e9a0', '1dd1291e6a23211ce8096d063f405fba']
urlIds.reduce((prevPromise, urlId) => {
  return prevPromise.then(() => loadImg(urlId))
}, Promise.resolve())
```

  


## 控制并发加载
```javascript
function loadImg(urlId) {
  const url = `https://img2.woyaogexing.com/2023/05/28/${urlId}.jpg`
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onerror = () => {
      reject(urlId)
    }
    img.onload = () => {
      resolve(urlId)
    }
    img.src = url
    document.body.appendChild(img)
  })
}

const urlIds = ['ca3f6b2708148951062f1a10b567da6f', 'fc32bbba5b36a45b954a9775516a5f6f', 'f6cdf2ef5ae2ee10641937a2d47671d7', 'e52de5bf9a4fb8531dbf2eef50f0e9a0', '1dd1291e6a23211ce8096d063f405fba']

/**
 * 控制并发加载
 * @param urlIds
 * @param loadImg
 * @param limit
 * @returns {Promise|*}
 */
function loadByLimit(urlIds, loadImg, limit) {
  const urlIdsCopy = [...urlIds]

  // 如果数组长度小于最大并发数，则直接发出全部请求
  if (urlIdsCopy.length <= limit) {
    const promiseArray = urlIds.map(id => loadImg(id))
    return Promise.all(promiseArray)
  }

  const promiseArray = urlIdsCopy.splice(0, limit).map(id => loadImg(id))
  urlIdsCopy.reduce((prevPromise, urlId) => {
    prevPromise
      .then(() => Promise.race(promiseArray))
      .catch(error => console.log(error))
      .then((id) => {
        const pos = promiseArray.findIndex(promiseId => id === promiseId)
        promiseArray.splice(pos, 1)
        promiseArray.push(loadImg(urlId))
      })
  }, Promise.resolve())
}
loadByLimit(urlIds, loadImg, 3)
```

  


## pipe
> 作用：将指定的函数串起来执行，每次都将前一个函数的返回值传递给后一个函数作为输入，这个过程在函数式编程中称为pipe
>
> 顺序：从左到右执行
>
> 原理：使用数组的 `reduce` 方法
>

```javascript
function pipe(...fns) {
  return function (...args) {
    // 将前一个函数的输出preResult传递给下一个函数的参数，第一个函数的参数是用户传入的参数args
    return fns.reduce((preResult, fn) => fn(...preResult), args)
  }
}

/**
 * 通过reduce实现pipe
 * @param fns
 * @returns {function(*): *}
 */
const pipe = (...fns) => input => fns.reduce(
  (acc, fn) => fn(acc),
  input
);

const add = x => x + 1;
const multiply = x => x * 2;
const subtract = x => x - 3;
const compute = pipe(add, multiply, subtract);
console.log(compute(2)); // 3
```

  


## compose
> 作用：将指定的函数串起来执行，每次都将前一个函数的返回值传递给后一个函数作为输入
>
> 顺序：从右到左执行
>
> 使用场景：**设计中间件系统**
>

```javascript
// 方法一：使用reduceRight
function compose(...fns) {
  return function (...args) {
    // 将前一个函数的输出preResult传递给下一个函数的参数，第一个函数的参数是用户传入的参数args
    return fns.reduceRight((preResult, fn) => fn(...preResult), args)
  }
}
```

```javascript
// 方法二：依赖pipe
function compose(...fns) {
  return function (...args) {
    // 使用数组的reverse方法翻转数组
    return pipe(...args.reverse())
  }
}

/**
 * 面向过程的compose实现
 * @param fns
 * @returns {(function(...[*]): (*))|*}
 */
function compose(...fns) {
  const length = fns.length;
  let count = length - 1, result;

  return function fl(...args) {
    result = fns[count].apply(this, args);

    if (count <= 0) {
      count = length - 1;
      return result;
    }
    count -= 1;
    return fl.call(this, result);
  }
}

const add = x => x + 1;
const multiply = x => x * 2;
const subtract = x => x - 3;
const compute2 = compose(add, multiply, subtract);
console.log('compute2:', compute2(4)); // 3

/**
 * 与pipe反向执行的reduce实现
 */
const reduceFn = (f, g) => (...args) => g.call(this, f.apply(this, args));
const compose2 = (...args) => args.reduceRight(reduceFn, args.pop());
const compute3 = compose2(add, multiply, subtract);
console.log('compute3:', compute3(4)); // 4
```

  


## createData
> 作用：创建指定深度和每层广度的数据
>

```javascript
function createData(depth, breadth) {
  const data = {}
  let temp = data

  for (let i = 0; i < depth; i++) {
    // 引用类型浅拷贝，data会同时改变
    temp = temp.data = {}

    for (let j = 0; j < breadth; j++) {
      temp[j] = j
    }
  }

  return data
}
```

  


## 浅拷贝
> 作用：对引用类型只进行一层拷贝
>

```javascript
funtion shallowClone(source) {
  const target = {}

  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key]
    }
  }

  return target
}
```

  


## 深拷贝
```plain
// 方法一：递归
function clone(source) {
  const target = {}

  for (let key in source) {
    if (source.hasOwnProperty[key]) {
      if (source[key] !== null && typeof source[key] === 'object') {
        // 递归
        target[key] = clone(target[key])
      } else {
        target[key] = source[key]
      }
    }
  }

  return target
}
```

```javascript
// 方法二：JSON.stringify 内部做了循环引用的检测
function cloneJSON(source) {
  return JSON.parse(JSON.stringify(source))
}
```

```javascript
// 特殊类型处理、防止原型污染
function cloneSpecialTypes(target) {
  // Date
  if (target instanceof Date)
    return new Date(target)

  // RegExp
  if (target instanceof RegExp)
    return new RegExp(target)

  // Map
  if (target instanceof Map) {
    const copy = new Map()
    target.forEach((val, key) => copy.set(key, deepClone(val)))
    return copy
  }

  // Set
  if (target instanceof Set) {
    const copy = new Set()
    target.forEach(val => copy.add(deepClone(val)))
    return copy
  }

  // ArrayBuffer
  if (target instanceof ArrayBuffer)
    return target.slice()

  // TypedArray (Uint8Array, Float32Array 等)
  if (ArrayBuffer.isView(target)) {
    return new target.constructor(
      target.buffer.slice(),
      target.byteOffset,
      target.length
    )
  }

  // 其他特殊对象（如 URL）
  if (target instanceof URL)
    return new URL(target.href)

  return null // 非特殊对象
}

function deepClone(obj, hash = new WeakMap()) {
  // 基本类型和函数
  if (obj === null || typeof obj !== 'object')
    return obj

  // 循环引用检查
  if (hash.has(obj))
    return hash.get(obj)

  // 特殊对象处理
  const specialClone = cloneSpecialTypes(obj)
  if (specialClone)
    return specialClone

  // 初始化拷贝对象
  const copy = Array.isArray(obj)
    ? []
    : Object.create(Object.getPrototypeOf(obj))

  hash.set(obj, copy)

  // 安全遍历属性
  const keys = [
    ...Object.keys(obj).filter(k => k !== '__proto__'),
    ...Object.getOwnPropertySymbols(obj)
  ]

  for (const key of keys) {
    copy[key] = deepClone(obj[key], hash)
  }

  return copy
}
```

  


## 破解递归爆栈
> 方法：第一种是消除尾递归，第二种是改用循环
>

:::info
+ 使用循环遍历一棵树需要借助一个栈，当栈为空时遍历完成
+ 栈里面存储下一个需要拷贝的节点，栈中每个节点要存储3个数据，分别是待拷贝的节点data，待拷贝节点的父节点parent，待拷贝节点在父节点中的属性值key

:::

```javascript
// 深拷贝方法三：使用循环

function cloneLoop(x) {
  const root = {}

  // 栈
  const loopList = [
    {
      parent: root,
      key: undefined,
      data: x
    }
  ]

  while (loopList.length) {
    // 深度优先
    const node = loopList.pop()
    const parent = node.parent
    const key = node.key
    const data = node.data

    // 初始化赋值目标，如果key为undefined，则拷贝到parent，否则拷贝到parent[key]
    let res = parent
    if (typeof key !== 'undefined') {
      res = parent[key] = {}
    }

    for (const k in data) {
      if (data.hasOwnProperty[k]) {
        if (typeof data[k] === 'object') {
          // 下一次循环
          loopList.push({
            parent: res,
            key: k,
            data: data[k]
          })
        }
        else {
          res[k] = data[i]
        }
      }
    }
  }

  return root
}
```

  


## 破解循环引用
```javascript
// 深拷贝方法四：保持引用关系
function cloneForce(x) {
  // 用来去重的数组
  const uniqueList = []

  const root = {}

  // 循环数组
  const loopList = [
    {
      parent: root,
      key: undefined,
      data: x
    }
  ]

  while (loopList.length) {
    // 深度优先
    const node = loopList.pop()
    const parent = node.parent
    const key = node.key
    const data = node.data

    // 初始化赋值目标，如果key为undefined，则拷贝到parent，否则拷贝到parent[key]
    let res = parent
    if (typeof key !== 'undefined') {
      res = parent[key] = {}
    }
    const uniqueData = find(uniqueList, data)
    // 如果数据存在，中断循环
    if (uniqueData) {
      parent[key] = uniqueData.target
      continue
    }

    // 数据不存在，将拷贝的数据存起来
    uniqueList.push({
      source: data,
      target: res
    })

    for (const k in data) {
      if (data.hasOwnProperty[k]) {
        if (typeof data[k] === 'object') {
          // 下一次循环
          loopList.push({
            parent: res,
            key: k,
            data: data[k]
          })
        }
        else {
          res[k] = data[i]
        }
      }
    }
  }

  return root
}

function find(arr, item) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].source === item) {
      return arr[i]
    }
  }

  return null
}
```

|  | clone | cloneJSON | cloneLoop | cloneForce |
| --- | --- | --- | --- | --- |
| 难度 | 2星 | 1星 | 3星 | 4星 |
| 兼容性 | IE6 | IE8 | IE6 | IE6 |
| 循环引用 | 一层 | 不支持 | 一层 | 支持 |
| 栈溢出 | 会 | 会 | 不会 | 不会 |
| 保持引用 | 否 | 否 | 否 | 是 |
| 适合场景 | 一般数据拷贝 | 一般数据拷贝 | 层级很多 | 保持引用关系 |


  


## promisify
> 将回调函数形式改成promise方式
>

```javascript
/**
 * 针对node回调模式
 */
const promisify = fn => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn(...args, (res, error) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
}

/**
 * 针对微信小程序回调模式
 */
const promisify = fn => args =>
  new Promise((resolve, reject) => {
    args.success = function (res) {
      resolve(res);
    };
    args.fail = function (error) {
      reject(error);
    }
  })

const wxRequest = promisify(wx.request);
wxRequest({ url: 'xxx', success: fn, error: fn }).then().catch()
```

  


## callbackify
> 将promise形式改成callback方式
>

```javascript
function callbackify(fn) {
  return (...args) => {
    // 读取最后一个参数
    const callback = args.pop()
    fn(...args).then((res) => {
      callback(null, res)
    }).catch((error) => {
      callback(error)
    })
  }
}
```

  


## 字符串准确长度
```javascript
function codePointLength(text) {
  const result = text.match(/[\s\S]/gu)
  return result ? result.length : 0
}
```

  


## 获取页面大小
![](https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/js-clientWidth.gif)

+ 网页上的每个元素，都有`clientHeight`和 `clientWidth` 属性。这两个属性指元素的 `content` 再加上`padding` 的所占据的视觉面积，不包括 `border` 和滚动条占用的空间
+ 网页上的每个元素还有 `scrollHeight` 和 `scrollWidth` 属性，指包含滚动条在内的该元素的视觉面积。
+ 如果网页内容能够在浏览器窗口中全部显示，不出现滚动条，那么网页的 `clientWidth` 和 `scrollWidth` 应该相等
+ 但是实际上，不同浏览器有不同的处理，这两个值未必相等。所以，我们需要取它们之中较大的那个值

```javascript
function getPagearea() {
  if (document.compatMode === 'BackCompat') {
    return {
      width: Math.max(document.body.scrollWidth, document.body.clientWidth),
      height: Math.max(document.body.scrollHeight, document.body.clientHeight)
    }
  }
  else {
    return {
      width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
      height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
    }
  }
}
```

  


## 获取元素的绝对位置
![](https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/js-offsetWidth.gif)

+ 网页元素的绝对位置，指该元素的左上角相对于整张网页左上角的坐标。这个绝对位置要通过计算才能得到。
+ 首先，每个元素都有 `offsetTop` 和 `offsetLeft` 属性，表示该元素的左上角与父容器（`offsetParent` 对象）左上角的距离。所以，只需要将这两个值进行累加，就可以得到该元素的绝对坐标。

```javascript
// 获取横坐标
function getElementLeft(element) {
  let actualLeft = element.offsetLeft
  let current = element.offsetParent

  while (current !== null) {
    actualLeft += current.offsetLeft
    current = current.offsetParent
  }

  return actualLeft
}

// 获取纵坐标
function getElementTop(element) {
  let actualTop = element.offsetTop
  let current = element.offsetParent

  while (current !== null) {
    actualTop += current.offsetTop
    current = current.offsetParent
  }

  return actualTop
}
```

:::warning
由于在表格和 `iframe` 中，`offsetParent` 对象未必等于父容器，所以上面的函数对于表格和 `iframe` 中的元素不适用

:::

  


## 获取元素的相对位置
![](https://leopold.oss-cn-hangzhou.aliyuncs.com/tech/js-scroll.gif)

+ 网页元素的相对位置，指该元素左上角相对于浏览器窗口左上角的坐标。
+ 有了绝对位置以后，获得相对位置就很容易了，只要将绝对坐标减去页面的滚动条滚动的距离就可以了。
+ 滚动条滚动的垂直距离，是 `document` 对象的 `scrollTop` 属性；滚动条滚动的水平距离是 `document` 对象的 `scrollLeft` 属性。
+ `scrollTop` 和 `scrollLeft` 属性是可以赋值的，并且会立即自动滚动网页到相应位置，因此可以利用它们改变网页元素的相对位置。另外，`element.scrollIntoView()` 方法也有类似作用，可以使网页元素出现在浏览器窗口的左上角。

```javascript
function getElementViewLeft(element) {
  let actualLeft = element.offsetLeft
  let current = element.offsetParent
  let elementScrollLeft = null

  while (current !== null) {
    actualLeft += current.offsetLeft
    current = current.offsetParent
  }

  if (document.compatMode == 'BackCompat') {
    elementScrollLeft = document.body.scrollLeft
  }
  else {
    elementScrollLeft = document.documentElement.scrollLeft
  }

  return actualLeft - elementScrollLeft
}

function getElementViewTop(element) {
  let actualTop = element.offsetTop
  let current = element.offsetParent
  let elementScrollTop = null

  while (current !== null) {
    actualTop += current.offsetTop
    current = current.offsetParent
  }

  if (document.compatMode == 'BackCompat') {
    elementScrollTop = document.body.scrollTop
  }
  else {
    elementScrollTop = document.documentElement.scrollTop
  }

  return actualTop - elementScrollTop
}
```

  


## 获取元素相对视口的位置
那就是使用 `getBoundingClientRect()` 方法。它返回一个对象，其中包含了 `left、right、top、bottom` 四个属性，分别对应了该元素的左上角和右下角相对于浏览器窗口（`viewport`）左上角的距离。

```javascript
// 相对位置
const X = this.getBoundingClientRect().left;
const Y = this.getBoundingClientRect().top;

// 绝对位置
const X = this.getBoundingClientRect().left +document.documentElement.scrollLeft;
const Y = this.getBoundingClientRect().top+document.documentElement.scrollTop;
```

  


## 属性遍历
在JavaScript中，我们可以使用以下方法遍历对象的属性：

1. 遍历自身属性：
    - `Object.keys(obj)`：返回由对象自身的可枚举属性所组成的数组
    - `Object.getOwnPropertyNames(obj)`：返回由对象自身的属性所组成的数组，包括不可枚举属性
    - `Object.getOwnPropertyDescriptors(obj)`：返回由对象自身的属性及其描述符所组成的对象
    - `Reflect.ownKeys(obj)`：返回由对象自身的属性键组成的数组，包括Symbol类型的属性键
2. 遍历原型属性：
    - `Object.getPrototypeOf(obj)`：返回对象的原型
    - `Object.keys(Object.getPrototypeOf(obj))`：返回的是原型对象中的所有可枚举属性
    - `Object.getOwnPropertyNames(Object.getPrototypeOf(obj))`：返回对象原型中所有的属性
    - `Object.getOwnPropertyDescriptors(Object.getPrototypeOf(obj))`：返回对象原型中的所有属性及其描述符
3. 遍历全部属性：
+ `for…in` 循环：遍历对象的可枚举属性，包括自身属性和继承的属性，但不包括Symbol类型的属性，也不保证属性的顺序
+ `Object.getOwnPropertyNames(obj)` 和`Object.getOwnPropertyNames(Object.getPrototypeOf(obj))` 的结合：返回对象及其原型链上所有的属性

需要注意的是，在使用以上方法遍历属性时，如果需要修改属性，必须使用 `Object.defineProperty` 等方法来进行修改，否则会抛出“TypeError: Cannot assign to read only property”的异常。

总之，JavaScript中有多种方法来遍历对象的属性，开发者可以根据自己的需要选择对应的方法。不过需要注意，如果需要对对象及其原型链上的属性进行操作，建议使用 `Object.getOwnPropertyNames(obj)` 和`Object.getOwnPropertyNames(Object.getPrototypeOf(obj))` 的结合来进行操作。

  


## 数组去重
1. 使用 `for` 循环和 `indexOf` 方法，复杂度 O(n^2)

```javascript
function uniqueArray(arr) {
  const result = []

  for (let i = 0; i < arr.length; i++) {
    if (result.indexOf(arr[i] === -1)) {
      result.push(arr[i])
    }
  }

  return result
}
```

2. 使用 `for` 循环和对象，复杂度 O(n^2)

```javascript
function uniqueArray(arr) {
  const result = []
  const obj = {}

  for (let i = 0; i < arr.length; i++) {
    if (!obj[arr[i]]) {
      result.push(arr[i])
      obj[arr[i]] = true
    }
  }

  return result
}
```

3. 使用 `filter` 方法和 `indexOf` 方法，复杂度 O(n^2)

```javascript
function uniqueArray(arr) {
  return arr.filter((item, index, array) => array.indexOf(item) === index)
}
```

4. 使用 `filter` 方法和对象，复杂度 O(n)

```javascript
function uniqueArray(arr) {
  const obj = {}
  return arr.filter(item => obj.hasOwnProperty(item) ? false : (obj[item] = true))
}
```

5. 使用 `Set` 数据结构，复杂度 O(n)

```javascript
function uniqueArray(arr) {
  return Array.from(new Set(arr))
}

// 使用解构 + Set
function uniqueArray(arr) {
  return [...new Set(arr)]
}
```

6. 使用 `Map` 数据结构，复杂度 O(n)

```javascript
function uniqueArray(arr) {
  const map = new Map();
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (!map.has(arr[i])) {
      map.set(arr[i], true);
      result.push(arr[i]);
    }
  }
  return result;
}

// or
function uniqueArray(arr) {
  const map = new Map();
  return arr.filter(function(item) {
    return !map.has(item) && map.set(item, true);
  });
}
```

7. 使用双重循环和 `splice` 方法，复杂度 O(n^2)

```javascript
function uniqueArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        arr.splice(j, 1)
        j--
      }
    }
  }
  return arr
}
```

8. 使用排序和双指针：使用排序和双指针可以实现 O(nlogn) 的时间复杂度。先对数组进行排序，然后使用双指针遍历数组，如果左指针和右指针指向的值相同，就把右指针向右移动，直到找到不同的值，然后把左指针向右移动，继续遍历。

```javascript
function uniqueArray(arr) {
  arr.sort()
  let left = 0; let right = 1
  const result = []
  while (right <= arr.length) {
    if (arr[left] === arr[right]) {
      right++
    }
    else {
      result.push(arr[left])
      left = right
      right++
    }
  }
  return result
}
```

9. 使用 `reduce` 方法和 `includes`，复杂度 O(n^2)

```javascript
function uniqueArray(arr) {
  return arr.reduce((prev, cur) => {
    if (!prev.includes(cur)) {
      prev.push(cur)
    }
    return prev
  }, [])
}
```

10. 使用递归和 `includes`，复杂度 O(n^2)

```javascript
function uniqueArray(arr) {
  if (arr.length === 1) {
    return arr
  }
  else {
    const first = arr[0]
    const rest = uniqueArray(arr.slice(1))
    if (rest.includes(first)) {
      return rest
    }
    else {
      return [first].concat(rest)
    }
  }
}
```

11. 双层循环，复杂度 O(n^2)

```javascript
function uniqueArray(arr) {
  const result = []
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < result.length; j++) {
      if (arr[i] === result[j]) {
        break
      }
    }
    if (j === result.length) {
      result.push(arr[i])
    }
  }
  return result
}
```

  


## 页面时间指标
```javascript
const timing = {
  // 同一个浏览器上一个页面卸载(unload)结束时的时间戳。如果没有上一个页面，这个值会和fetchStart相同。
  navigationStart: 1543806782096,

  // 上一个页面unload事件抛出时的时间戳。如果没有上一个页面，这个值会返回0。
  unloadEventStart: 1543806782523,

  // 和 unloadEventStart 相对应，unload事件处理完成时的时间戳。如果没有上一个页面,这个值会返回0。
  unloadEventEnd: 1543806782523,

  // 第一个HTTP重定向开始时的时间戳。如果没有重定向，或者重定向中的一个不同源，这个值会返回0。
  redirectStart: 0,

  // 最后一个HTTP重定向完成时（也就是说是HTTP响应的最后一个比特直接被收到的时间）的时间戳。
  // 如果没有重定向，或者重定向中的一个不同源，这个值会返回0.
  redirectEnd: 0,

  // 浏览器准备好使用HTTP请求来获取(fetch)文档的时间戳。这个时间点会在检查任何应用缓存之前。
  fetchStart: 1543806782096,

  // DNS 域名查询开始的UNIX时间戳。
  // 如果使用了持续连接(persistent connection)，或者这个信息存储到了缓存或者本地资源上，这个值将和fetchStart一致。
  domainLookupStart: 1543806782096,

  // DNS 域名查询完成的时间.
  // 如果使用了本地缓存（即无 DNS 查询）或持久连接，则与 fetchStart 值相等
  domainLookupEnd: 1543806782096,

  // HTTP（TCP） 域名查询结束的时间戳。
  // 如果使用了持续连接(persistent connection)，或者这个信息存储到了缓存或者本地资源上，这个值将和 fetchStart一致。
  connectStart: 1543806782099,

  // HTTP（TCP） 返回浏览器与服务器之间的连接建立时的时间戳。
  // 如果建立的是持久连接，则返回值等同于fetchStart属性的值。连接建立指的是所有握手和认证过程全部结束。
  connectEnd: 1543806782227,

  // HTTPS 返回浏览器与服务器开始安全链接的握手时的时间戳。如果当前网页不要求安全连接，则返回0。
  secureConnectionStart: 1543806782162,

  // 返回浏览器向服务器发出HTTP请求时（或开始读取本地缓存时）的时间戳。
  requestStart: 1543806782241,

  // 返回浏览器从服务器收到（或从本地缓存读取）第一个字节时的时间戳。
  // 如果传输层在开始请求之后失败并且连接被重开，该属性将会被数制成新的请求的相对应的发起时间。
  responseStart: 1543806782516,

  // 返回浏览器从服务器收到（或从本地缓存读取，或从本地资源读取）最后一个字节时
  // （如果在此之前HTTP连接已经关闭，则返回关闭时）的时间戳。
  responseEnd: 1543806782537,

  // 当前网页DOM结构开始解析时（即Document.readyState属性变为“loading”、相应的 readystatechange事件触发时）的时间戳。
  domLoading: 1543806782573,

  // 当前网页DOM结构结束解析、开始加载内嵌资源时（即Document.readyState属性变为“interactive”、相应的readystatechange事件触发时）的时间戳。
  domInteractive: 1543806783203,

  // 当解析器发送DOMContentLoaded 事件，即所有需要被执行的脚本已经被解析时的时间戳。
  domContentLoadedEventStart: 1543806783203,

  // 当所有需要立即执行的脚本已经被执行（不论执行顺序）时的时间戳。
  domContentLoadedEventEnd: 1543806783216,

  // 当前文档解析完成，即Document.readyState 变为 'complete'且相对应的readystatechange 被触发时的时间戳
  domComplete: 1543806783796,

  // load事件被发送时的时间戳。如果这个事件还未被发送，它的值将会是0。
  loadEventStart: 1543806783796,

  // 当load事件结束，即加载事件完成时的时间戳。如果这个事件还未被发送，或者尚未完成，它的值将会是0.
  loadEventEnd: 1543806783802
}

// 重定向耗时
const redirect = timing.redirectEnd - timing.redirectStart

// DOM 渲染耗时
const dom = timing.domComplete - timing.domLoading

// 页面加载耗时
const load = timing.loadEventEnd - timing.navigationStart

// 页面卸载耗时
const unload = timing.unloadEventEnd - timing.unloadEventStart

// 请求耗时
const request = timing.responseEnd - timing.requestStart

// 获取性能信息时当前时间
const time = new Date().getTime()

// 白屏时间
const whiteScreen = new Date() - timing.navigationStart

// 获取相关资源（js、css、img...）的加载时间，它会返回页面当前所加载的所有资源
const resourceTime = window.performance.getEntriesByType('resource')
```

  


## 文件下载
1. 方法一：通过创建一个带有 `href` 和 `download` 属性的 `<a>` 标签，可以实现文件的下载。`href` 指定文件的 URL，`download` 属性指定文件的下载名称

```html
<a href="path/to/file.pdf" download="filename.pdf">Download PDF</a>

```

2. 方法二：调用接口也能下载，后台返回文件数据，然后转 blob。通过 `URL.createObjectURL(blob)`转成一个下载链接，然后 `createElement `一个a元素， href 指向链接，最后click 模拟点击就可以了

```javascript
fetch('path/to/file.pdf')
  .then(response => response.blob())
  .then((blob) => {
    const downloadLink = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = downloadLink
    a.download = 'filename.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    // 释放临时的 URL 地址
    URL.revokeObjectURL(downloadLink)
  })
```

  


## 主题切换
```typescript
import { watchEffect } from 'vue'

// 获取主题变量
let appearance = ref<string>(localStorage.getItem('appearance') || 'auto')
// 查询当前系统主题颜色
const match:MediaQueryList = window.matchMedia("(prefers-color-scheme: dark)")
// 监听系统主题变化
match.addEventListener('change', followSystem)

function followSystem() {
  const theme = match.matches ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
}

watchEffect(() => {
    // 如果主题变量为 auto, 则跟随系统主题
  if (appearance.value === 'auto') {
    followSystem()
  } else {
    document.documentElement.setAttribute('data-theme', appearance.value)
  }
})

export default function useThemeColor() {
  return {
    appearance,
  }
}
```

> 参考：[Vue3自定义一个Hooks，实现一键换肤](https://juejin.cn/post/7237020208648634429)
>

  


## 大屏自适应
```javascript
function autoScale(selector, options) {
  const el = document.querySelector(selector)
  const { width, height } = options
  el.style.transformOrigin = 'top left'
  el.style.transition = 'transform 0.5s'

  function init() {
    const scaleX = window.innerWidth / width
    const scaleY = window.innerHeight / height
    const scale = Math.min(scaleX, scaleY)
    const left = (innerWidth - width * scale) / 2
    const top = (innerHeight - height * scale) / 2
    el.style.transform = `translate(${left}px, ${top}px) scale(${scale})`
  }

  init()
  window.addEventListener('resize', init)
}
```

  


## 防抖
防抖和节流其实都是在规避频繁触发回调导致大量计算，从而影响页面发生抖动甚至卡顿。

+ 指定的时间间隔内，事件多次触发则重新计时，如果时间间隔内没有事件触发再执行
+ 适用于需要等待一段时间后再执行函数的场景，如搜索框输入、窗口调整等

```javascript
function debounce(func, delay) {
  let timer
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, arguments)
    }, delay)
  }
}

function handleInput() {
  console.log('Input event triggered')
  // 执行实际的逻辑
}

const debouncedInput = debounce(handleInput, 300)

// 绑定事件处理函数
document.getElementById('input').addEventListener('input', debouncedInput)
```

  


## 节流
+ 节流的原理是在指定的时间间隔内，无论事件触发多少次，都只执行一次函数。按时间间隔执行
+ 适用于需要在一定频率下执行函数的场景，如滚动事件、鼠标移动等

```javascript
function throttle(func, delay) {
  let timer
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, arguments)
        timer = null
      }, delay)
    }
  }
}

function handleScroll() {
  console.log('Scroll event triggered')
  // 执行实际的逻辑
}

const throttledScroll = throttle(handleScroll, 300)

// 绑定事件处理函数
window.addEventListener('scroll', throttledScroll)
```

  


## 发布-订阅
```typescript
type CbFn = (...args: any[]) => void

class EventBus {
  private events: Record<string, Set<CbFn>> = {}

  on(eventName: string, cb: CbFn) {
    this.events[eventName] ??= (new Set().add(cb) as Set<CbFn>)
  }

  emit(eventName: string, ...args: any[]) {
    this.events[eventName]?.forEach(cb => cb(...args))
  }

  off(eventName: string, cb: CbFn) {
    this.events[eventName]?.delete(cb)
  }

  once(eventName: string, cb: CbFn) {
    const onceCb = (...args: any[]) => {
      cb(...args)
      this.off(eventName, onceCb)
    }
    this.on(eventName, onceCb)
  }
}

export const bus = new EventBus()
```

  


## 单例
```typescript
class EventBus {
  private static _instance: EventBus
  private constructor() {}

  static getInstance() {
    return EventBus._instance ??= new EventBus()
  }
}

export const singleBus = EventBus.getInstance()
```

  


## 图片预加载
```typescript
const images = [...]

export async function preloadImages(max = 3) {
  const _images = [...images]

  function loadImage() {
    const src = _images.shift()
    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link,as = 'image'
      link.href = src
      document.head.appendChild(link)
      link.onload = resolve
      link.onerror = reject
      setTimeout(reject, 10000) // 10s超时
    })
  }

  function _loadImage() {
    loadImage().finally(() => {
            if(_images.length) {
        _loadImage()
      }
    })
    }

  for (let i = 0; i < max; i++) {
    _loadImage()
  }
}
```

```typescript
// 封装成vite插件
import type { Plugin } from 'vite'
import fg from 'fast-glob'

interface PreloadImagesOptions {
  dir: string,
  attrs?: {
    rel: 'preload | prefetch'
  }
}
export const preloadImages = (options: PreloadImagesOptions): Plugin => {
  const { dir, attrs: { rel = 'prefetch' } = {} } = options // 设置默认加载方式为prefetch

  return {
    name: 'vite-plugin-image-prefetch',
    transformIndexHtml(html, ctx) {
      const files = fg.sync(dir, {
        cwd: ctx.server?.config.publicDir // 手动获取publicDir名称
      })
      const images = files.map(file => ctx.server?.config.base + file) // 手动拼接base路径
      return images.map(href => {
        return {
          tag: 'link',
          attrs: {
               rel,
              href,
            as: 'image'
          }
        }
      })
    }
  }
}

// 使用
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { preloadImages } from './plugins/preloadImages'

export default defineConfig {
  plugins: [vue(), vueJsx(), preloadImages({
    dir: 'images/*.{jpg,png,svg,webp,bmp}' // 假设图片路径位于xxx/images
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
}
```

  


## React实现自定义storage hook
> 原理：通过 `useSyncExternalStore` 实现一个类似发布-订阅模式，可以多Tab页签共享存储数据
>
> `useSyncExternalStore` 是 React 18 引入的一个 Hook，用于从外部存储（例如状态管理库、浏览器 API 等）获取状态并在组件中同步显示。这对于需要跟踪外部状态的应用非常有用。
>

```typescript
import { useSyncExternalStore } from 'react'

export const useStorage = (key: string, initialValue: any) => {
  /**
   * 订阅数据源状态变化
   * @param callback
   */
  const subscribe = (callback: () => void) => {
    window.addEventListener('storage', callback)

    // 返回一个取消订阅的函数
    return () => {
      window.removeEventListener('storage', callback)
    }
  }

  /**
   * 获取当前数据源状态快照
   */
  const getSnapshot = () => {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  }

  const res = useSyncExternalStore(subscribe, getSnapshot)
  const updateStorage = (value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
    // 手动触发storage事件
    window.dispatchEvent(new StorageEvent('storage'))
  }

  return [res, updateStorage]
}
```

```tsx
// 用法
import { useStorage } from './hooks/useStorage.ts'

function App() {
  const [count, setCount] = useStorage('count', 1)

  return (
    <>
      <div className="card">
        <button onClick={() => setCount(count - 1)}>
          -
        </button>

        <button onClick={() => setCount(count + 1)}>
          +
        </button>

        <p>
          { count }
        </p>

      </div>

    </>
  )
}
```

  


## webpack统计阶段耗时
```javascript
// WebpackTimingPlugin.js

const chalk = require('chalk')

const PluginName = 'TimingPlugin'

class WebpackTiming {
  apply(compiler) {
    const applyStart = Date.now()
    let afterCompileStart
    compiler.hooks.afterCompile.tap(PluginName, () => {
      afterCompileStart = Date.now()
    })
    compiler.hooks.done.tap(PluginName, () => {
      console.log(
        'after Compile Time',
        `${chalk.magentaBright(Date.now() - afterCompileStart)}ms, `,
        `build duration: ${Date.now() - applyStart}ms`
      )
    })
    compiler.hooks.compilation.tap(PluginName, (compilation) => {
      const lifeHooks = [
        {
          name: 'optimizeDependencies',
          start: 'optimizeDependencies',
          end: 'afterOptimizeDependencies',
        },
        { name: 'createChunks', start: 'beforeChunks', end: 'afterChunks' },
        { name: 'optimizeModules', start: 'optimize', end: 'optimizeChunks' },
        {
          name: 'optimizeChunks',
          start: 'optimizeChunks',
          end: 'afterOptimizeChunks',
        },
        {
          name: 'optimizeTree',
          start: 'optimizeTree',
          end: 'afterOptimizeTree',
        },
        {
          name: 'optimizeChunkModules',
          start: 'optimizeChunkModules',
          end: 'afterOptimizeChunkModules',
        },
        {
          name: 'moduleIds',
          start: 'beforeModuleIds',
          end: 'afterOptimizeModuleIds',
        },
        {
          name: 'chunkIds',
          start: 'beforeChunkIds',
          end: 'afterOptimizeChunkIds',
        },
        { name: 'hash', start: 'beforeHash', end: 'afterHash' },
        {
          name: 'moduleAssets',
          start: 'beforeModuleAssets',
          end: 'shouldGenerateChunkAssets',
        },
        {
          name: 'chunkAssets',
          start: 'beforeChunkAssets',
          end: 'additionalAssets',
        },
        {
          name: 'optimizeChunkAssets',
          start: 'optimizeChunkAssets',
          end: 'afterOptimizeChunkAssets',
        },
        {
          name: 'optimizeAssets',
          start: 'optimizeAssets',
          end: 'afterOptimizeAssets',
        },
      ]

      lifeHooks.forEach(({ name, start, end }) => {
        let startTime
        if (!compilation.hooks[start]) {
          console.log('no hooks', start)
        }
        if (!compilation.hooks[end]) {
          console.log('no hooks', end)
        }
        compilation.hooks[start].tap(PluginName, () => {
          startTime = Date.now()
        })
        compilation.hooks[end].tap(PluginName, () => {
          const cost = Date.now() - startTime
          // if (cost < 10) {
          //   return
          // }
          console.log(
            `[Step ${name}] costs: ${chalk.red(cost)}ms, `,
            `build duration: ${Date.now() - applyStart}ms`
          )
        })
      })
    })
  }
}

module.exports = WebpackTiming
```

  


## babel插件实现console调试代码定位
```plain
// 插件代码 parameters-insert-plugin.js
const targetCalleeName = ['log', 'info', 'error', 'debug'].map(item => `console.${item}`);

module.exports = function({types, template}) {
    return {
        visitor: {
            CallExpression(path, state) {
                if (path.node.isNew) {
                    return;
                }

                const calleeName = generate(path.node.callee).code;

                 if (targetCalleeName.includes(calleeName)) {
                    const { line, column } = path.node.loc.start;

                    const newNode = template.expression(`console.log("${state.filename || 'unkown filename'}: (${line}, ${column})")`)();
                    newNode.isNew = true;

                    if (path.findParent(path => path.isJSXElement())) {
                        path.replaceWith(types.arrayExpression([newNode, path.node]))
                        path.skip();
                    } else {
                        path.insertBefore(newNode);
                    }
                }
            }
        }
    }
}

// 插件使用
const { transformFileSync } = require('@babel/core');
const insertParametersPlugin = require('./plugin/parameters-insert-plugin');
const path = require('path');

const { code } = transformFileSync(path.join(__dirname, './sourceCode.js'), {
    plugins: [insertParametersPlugin],
    parserOpts: {
        sourceType: 'unambiguous',
        plugins: ['jsx']
    }
});

console.log(code);
```

  


## babel插件实现自动埋点
```javascript
const { declare } = require('@babel/helper-plugin-utils');
const importModule = require('@babel/helper-module-imports');

const autoTrackPlugin = declare((api, options, dirname) => {
    api.assertVersion(7);

    return {
        visitor: {
            Program: {
                enter (path, state) {
                    path.traverse({
                        ImportDeclaration (curPath) {
                            const requirePath = curPath.get('source').node.value;
                            if (requirePath === options.trackerPath) {
                                const specifierPath = curPath.get('specifiers.0');
                                if (specifierPath.isImportSpecifier()) {
                                    state.trackerImportId = specifierPath.toString();
                                } else if(specifierPath.isImportNamespaceSpecifier()) {
                                    state.trackerImportId = specifierPath.get('local').toString();
                                }
                                path.stop();
                            }
                        }
                    });
                    if (!state.trackerImportId) {
                        state.trackerImportId  = importModule.addDefault(path, 'tracker',{
                            nameHint: path.scope.generateUid('tracker')
                        }).name;
                        state.trackerAST = api.template.statement(`${state.trackerImportId}()`)();
                    }
                }
            },
            'ClassMethod|ArrowFunctionExpression|FunctionExpression|FunctionDeclaration'(path, state) {
                const bodyPath = path.get('body');
                if (bodyPath.isBlockStatement()) {
                    bodyPath.node.body.unshift(state.trackerAST);
                } else {
                    const ast = api.template.statement(`{${state.trackerImportId}();return PREV_BODY;}`)({PREV_BODY: bodyPath.node});
                    bodyPath.replaceWith(ast);
                }
            }
        }
    }
});

module.exports = autoTrackPlugin;

// 使用
const { transformFromAstSync } = require('@babel/core');
const  parser = require('@babel/parser');
const autoTrackPlugin = require('./plugin/auto-track-plugin');
const fs = require('fs');
const path = require('path');

const sourceCode = fs.readFileSync(path.join(__dirname, './sourceCode.js'), {
    encoding: 'utf-8'
});

const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous'
});

const { code } = transformFromAstSync(ast, sourceCode, {
    plugins: [[autoTrackPlugin, {
        trackerPath: 'tracker'
    }]]
});

console.log(code);
```

  


## vant组件增强注册
```typescript
/**
 * 组件增强：
 * 1.可以通过 app.use(MyComponent) 全局安装
 * 2.支持 onClick 等事件处理
 * 3.保留原有组件的所有属性和方法
 */
import { camelize } from './format';
import type { App, Component } from 'vue';

// https://github.com/vant-ui/vant/issues/8302
type EventShim = {
  new (...args: any[]): {
    $props: {
      onClick?: (...args: any[]) => void;
    };
  };
};

export type WithInstall<T> = T & {
  install(app: App): void;
} & EventShim;

export function withInstall<T extends Component>(options: T) {
  (options as Record<string, unknown>).install = (app: App) => {
    const { name } = options;
    if (name) {
      app.component(name, options);
      app.component(camelize(`-${name}`), options);
    }
  };

  return options as WithInstall<T>;
}
```

  


## Vant BEM实现
```typescript
export type Mod = string | { [key: string]: any };
export type Mods = Mod | Mod[];

function genBem(name: string, mods?: Mods): string {
  if (!mods) {
    return '';
  }

  if (typeof mods === 'string') {
    return ` ${name}--${mods}`;
  }

  if (Array.isArray(mods)) {
    return (mods as Mod[]).reduce<string>(
      (ret, item) => ret + genBem(name, item),
      '',
    );
  }

  return Object.keys(mods).reduce(
    (ret, key) => ret + (mods[key] ? genBem(name, key) : ''),
    '',
  );
}

/**
 * bem helper
 * b() // 'button'
 * b('text') // 'button__text'
 * b({ disabled }) // 'button button--disabled'
 * b('text', { disabled }) // 'button__text button__text--disabled'
 * b(['disabled', 'primary']) // 'button button--disabled button--primary'
 */
export function createBEM(name: string) {
  return (el?: Mods, mods?: Mods): Mods => {
    if (el && typeof el !== 'string') {
      mods = el;
      el = '';
    }

    el = el ? `${name}__${el}` : name;

    return `${el}${genBem(el, mods)}`;
  };
}

export type BEM = ReturnType<typeof createBEM>;
```

  


