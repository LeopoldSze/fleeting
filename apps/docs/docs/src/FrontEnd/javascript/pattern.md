# 设计模式

## 概述

1. 编程语言安装数据类型大体可以分为两类：一类是**静态类型**语言，一类是**动态类型**语言。

| 名称     | 特点                                                   | 优点                                                                                                                                   | 缺点                                                         |
| -------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 静态类型 | 在编译时便已确定变量的类型                             | 1. 在编译时就能发现类型不匹配的错误<br />2. 程序中明确地规定了数据类型，编译器可以针对这些信息对程序进行一些优化工作，提高程序执行速度 | 1. 依照强契约来编写程序<br />2. 类型的声明也会增加更多的代码 |
| 动态类型 | 到程序运行时，待变量被赋予某个值之后，才会具有某种类型 | 编写的代码数量更少，更简洁，程序员可以专注于业务逻辑                                                                                   | 无法保证变量的类型，在程序运行期可能发生跟类型相关的错误     |

2. 鸭子类型

通俗说法：如果它走起路来像鸭子，叫起来也是鸭子，那么它就是鸭子。

鸭子类型指导我们**只关注对象的行为**，而**不关注对象本身**。

3. 多态

**含义：同一操作作用于不同的对象上面，可以产生不同的解释和不同的执行结果。**

::: tip

多态背后的思想是将“**做什么**”和“**谁去做以及怎样去做**“分离开来，也就是将”**不变的事物**“与”**可能改变的事物**“分离开来。

:::

- 静态类型的面向对象语言通常被设计为可以**向上转型**：当给一个类变量赋值时，这个变量的类型既可以使用这个类本身，也可以使用这个类的超类。

- 使用继承来得到多态效果，是让对象表现出多态性的最常用手段。继承通常包括实现继承和接口继承。
- 多态最根本的作用就是通过把过程化的条件分支语句转化为对象的多态性，从而消除这些条件分支语句。
- 将行为分布在各个对象中，并让这些对象各自负责自己的行为，这正是面向对象设计的优点。
- 在以类为中心的面向对象编程语言中，类和对象的关系可以想象成铸模和铸件的关系，对象总是从类中创建而来。

<br />

## this、call和apply

js的 `this` 总是指向一个对象，而具体指向哪个对象是在运行时基于函数的执行环境动态绑定的，而非函数被声明时的环境。ES6的箭头函数是例外，`this` 是在定义时绑定。箭头函数没有自己的`this`，它继承的是父级作用域的`this`。

### 1. this指向的分类

大致可以分为以下几种：

1. 作为对象的方法调用
2. 作为普通函数调用
3. 构造器调用和类调用
4. `call`、`apply` 和 `bind` 调用
5. 箭头函数调用

**1. 作为对象的方法调用**

当函数作为对象的方法被调用时，this指向该对象。

```js
// 1. 作为对象的方法调用
const a = {
  name: 'sze',
  getName1() {
    console.log(this === a) // true
  },
  getName2() {
    console.log(this === a) // true
  }
}
a.getName1()
a.getName2()
```

**2. 作为普通函数调用**

非ESM模块化时默认严格模式，this指向undefined，否则通常this总是指向全局对象window。

```js
// 非严格模式
// 2. 作为普通函数调用
function b1() {
  console.log(this === window) // true
}
b1()

// 严格模式
export function b2() {
  console.log(this) // undefined
}
<script type="module">
  import
  {' '}
  { b2 }
  {' '}
  from './1-singleton.js'
  b2()
</script>
```

**3. 构造器调用和类调用**

当使用new运算符调用函数时，该函数总会返回一个对象，通常情况下，构造器里的this就指向返回的这个对象；类里的this指向实例对象。

::: warning

使用new调用构造器时，如果构造器显示地返回了一个object类型的对象，那么this指向显示返回的对象，而不是默认生成的对象。

:::

**4. `call`、`apply` 和 `bind` 调用**

改变this指向为传入的第一个参数，call和apply直接返回执行结果，bind返回一个this绑定后的函数。

**5. 箭头函数调用**

this在定义时绑定，且无法通过call/apply/bind动态修改this指向。

### 2. call和apply的区别

apply接受两个参数，第一个参数指定了函数体内this对象的指向，第二个参数为一个带下标的集合，可以为数组也可以是类数组，apply把这个集合中的元素作为参数传递给被调用的函数。

call传入的参数数量不固定，第一个参数也是代表函数体内this对象的指向，从第二个参数开始往后，每个参数被依次传入函数。

::: tip

当使用call或apply的时候，如果第一个参数为null，this会指向默认是宿主对象，在浏览器中是window，严格模式下还是null。通常使用call或apply的目的在于借用其他对象的方法。

:::

### 3. 高阶函数

高阶函数是指至少满足下列条件之一的函数：

- 函数可以作为参数被传递
- 函数可以作为返回值输出

#### 应用场景

**AOP**

`AOP` （面向切面编程）的主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来，这些跟业务逻辑无关的功能通常包括日志统计、安全控制、异常处理等。把这些功能抽离出来之后，再通过“动态织入”的方式掺入业务逻辑模块中。

通常，在js中实现 `AOP` ，都是指把一个函数“动态织入”到另一个函数中。

**柯里化**

`currying` 又称部分求值。一个柯里化的函数首先会接受一些参数，接受了这些参数之后，该函数并不会立即求值，而是继续返回另外一个函数，刚出传入的参数在函数形成的闭包中被保存起来。待到函数被真正需要求值的时候，之前传入的所有参数都会被一次性用于求值。

<br />

## 1. 原型模式

- 原型模式的实现关键，是语言本身是否提供了 `clone` 方法。ES5提供了 `Objece.create` 方法，可以用来克隆对象。

- 原型模式的真正目的并非在于需要得到一个一模一样的对象，而是提供了一种便捷的方式去创建某个类型的对象，克隆只是创建这个对象的过程和手段。

### 基本规则

- 所有的数据都是对象
- 要得到一个对象，不是通过实例化类，而是找到一个对象作为原型并克隆它
- 对象会记住它的原型
- 如果对象无法响应某个请求，它会把这个请求委托给它自己的原型

### js中的具体构建

**1. 所有的数据都是对象**

按照 `JavaScript` 设计者的本意，除了 `undefined` 之外，一切都应该是对象。为了实现这一目标，`number` 、`boolean`、`string` 这几种基本类型数据也可以通过“包装类”的方式变成对象类型数据来处理。

`JavaScript` 中的根对象是 `Object.prototype` 对象。它是一个空的对象。我们在 `JavaScript` 中遇到的每个对象，实际上都是从其克隆而来的，`Objec.prototype` 对象就是它们的原型。`Objec.prototype` 对象的原型是 `null`。

```js
const a = {}
Object.getPrototypeOf(a) === Object.prototype // tru
e
```

**2. 要得到一个对象，不是通过实例化类，而是找到一个对象作为原型并克隆它**

在js中，我们并不需要关心克隆的细节，因为这是引擎内部负责实现的。我们所需要做的只是显式地调用 `const a = new Object()` 或 `const b = {}`。此时，引擎内部会从 `Object.prototype` 上面克隆一个对象出来，我们最终得到的就是这个对象。

js中的函数既可以作为普通函数被调用，也可以作为构造器被调用。当使用 `new` 运算符来调用函数时，此时的函数就是一个构造器。

**3. 对象会记住它的原型**

就js真正的实现来说，并不能说对象有原型，而只能说对象的构造器有原型。js给对象提供了一个名为 `__proto__` 的属性，某个对象的 `__proto__` 属性默认会指向它的构造器的原型对象，即 `{Constructor}.prototype`。

**4. 如果对象无法响应某个请求，它会把这个请求委托给它自己的原型**

虽然js的对象最初都是由 `Objec.prototype` 对象克隆而来的，但对象构造器的原型并不仅限于 `Objec.prototype` 上，而是可以动态指向其他对象。这样一来，当对象a需要借用对象b的能力时，可以有选择性的把对象a的构造器的原型指向对象b，从而达到继承的效果。

<br />

## 2. 单例模式

定义：保证一个类仅有一个实例，并提供一个访问它的全局访问点。

```js
/**
 * 用代理实现单例模式
 * @param html
 * @constructor
 */
function CreateDiv(html) {
  this.html = html
  this.init()
}
CreateDiv.prototype.init = function () {
  const div = document.createElement('div')
  div.innerHTML = this.html
  document.body.appendChild(div)
}
const ProxySingleton = (function () {
  let instance = null
  return function (html) {
    if (instance) {
      return instance
    }

    return instance = new CreateDiv(html)
  }
})()
const div1 = new ProxySingleton('div1')
const div2 = new ProxySingleton('div2')
console.log(div1 === div2) // true
```

惰性单例：指在需要的时候才创建对象实例。

```js
/**
 * 惰性单例
 * @param fn
 * @returns {function()}
 */
function getSingle(fn) {
  let result = null
  return function () {
    return result || (result = fn.apply(this, arguments))
  }
}

/**
 * 创建登录弹窗
 * @returns {HTMLDivElement}
 */
function createLoginLayer() {
  const div = document.createElement('div')
  div.innerHTML = '我是登录弹窗'
  div.style.display = 'none'
  document.body.appendChild(div)
  return div
}
const createSingleLoginLayer = getSingle(createLoginLayer)
const btn = document.createElement('button')
btn.innerText = '登录'
document.body.appendChild(btn)

btn.onclick = function () {
  const loginLayer = createSingleLoginLayer()
  loginLayer.style.display = 'block'
}
```

<br />

## 3. 策略模式

定义：定义一系列的算法，把它们各自封装成策略类，算法被封装在策略类内部的方法里，并且使它们可以相互替换。在客户对Context发起请求的时候，Context总是把请求委托给这些策略对象中间的某一个进行计算。

一个基于策略模式的程序至少由两部分组成：第一个部分是一组策略类，封装了具体的算法，并负责具体的计算过程。第二个部分是环境类Context，接受客户的请求，随后把请求委托给某一个策略类。要做到这点，说明Context中要维持对某个策略对象的引用。

```js
/**
 * js版本策略模式
 * @param level
 * @param salary
 * @returns {*}
 */
// context委托
function calculateBonus(level, salary) {
  return strategies[level](salary)
}
// 策略对象
const strategies = {
  S(salary) {
    return salary * 4
  },
  A(salary) {
    return salary * 3
  },
  B(salary) {
    return salary * 2
  }
}
console.log(calculateBonus('S', 10000)) // 40000
console.log(calculateBonus('A', 8000)) // 24000
```

```js
/**
 * 表单验证-策略模式
 */
class Validator {
  constructor() {
    this.cache = []
  }

  add(dom, rules) {
    const len = rules.length
    for (let i = 0; i < len; i++) {
      const rule = rules[i]
      const strategyArr = rule.strategy.split(':')
      const errorMsg = rule.errorMsg

      function handler() {
        const strategy = strategyArr.shift()
        strategyArr.unshift(dom.value)
        strategyArr.push(errorMsg)
        return formStrategies[strategy].apply(dom, strategyArr)
      }

      this.cache.push(handler)
    }
  }

  start() {
    for (let i = 0; i < this.cache.length; i++) {
      const errorMsg = this.cache[i]()
      if (errorMsg) {
        return errorMsg
      }
    }
  }
}

/**
 * 策略对象
 * @type {{minLength(*, *, *): (*|undefined), isNonEmpty(*, *): (*|undefined), isMobile(*, *): (*|undefined)}}
 */
const formStrategies = {
  isNonEmpty(value, errorMsg) {
    if (value === '') {
      return errorMsg
    }
  },
  minLength(value, length, errorMsg) {
    if (value.length < length) {
      return errorMsg
    }
  },
  isMobile(value, errorMsg) {
    const reg = /^(13\d|14[579]|15[0-3,5-9]|166|17[0135-8]|18\d|19[89])\d{8}$/
    if (!reg.test(value)) {
      return errorMsg
    }
  }
}
const registerForm = document.getElementById('registerForm')
function validate() {
  const validator = new Validator()
  validator.add(registerForm.username, [
    {
      strategy: 'isNonEmpty',
      errorMsg: '用户名不能为空'
    },
    {
      strategy: 'minLength:10',
      errorMsg: '用户名长度不能小于10位'
    }
  ])
  validator.add(registerForm.password, [
    {
      strategy: 'isNonEmpty',
      errorMsg: '密码不能为空'
    },
    {
      strategy: 'minLength:8',
      errorMsg: '密码长度不能小于8位'
    }
  ])
  validator.add(registerForm.phone, [
    {
      strategy: 'isNonEmpty',
      errorMsg: '手机号不能为空'
    },
    {
      strategy: 'isMobile',
      errorMsg: '手机号格式不正确'
    }
  ])

  return validator.start()
}

registerForm.onsubmit = function () {
  const errorMsg = validate()
  if (errorMsg) {
    alert(errorMsg)
    return false
  }
  alert('提交成功')
}
```

<br />

## 4. 代理模式

代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问。

代理模式的关键是，当客户不方便直接访问一个对象或者不满足需要的时候，提供一个替身对象来控制对这个对象的访问，客户实际上访问的是替身对象。替身对象对请求做出一些处理之后，再把请求转交给本体对象。

好处：

- 用户可以放心的请求代理，他只关心是否能得到想要的结果
- 在任何使用本体的地方都可以替换成使用代理

```js
/**
 * 代理模式
 */
function mult(...args) {
  let a = 1
  args.forEach((item) => {
    a *= item
  })
  return a
}
function add(...args) {
  let a = 0
  args.forEach((item) => {
    a += item
  })
  return a
}

/**
 * 缓存代理工厂函数
 * @param fn
 * @returns {(function(...[*]): (*))|*}
 */
function proxyFactory(fn) {
  const cache = {}
  return function (...args) {
    const key = args.join(',')
    if (cache[key]) {
      return cache[key]
    }

    return cache[key] = fn.apply(this, args)
  }
}
const proxyMult = proxyFactory(mult)
const proxyAdd = proxyFactory(add)
console.log(proxyMult(1, 2, 3, 4)) // 24
console.log(proxyMult(1, 2, 3, 4)) // 24
console.log(proxyAdd(1, 2, 3, 4)) // 10
console.log(proxyAdd(1, 2, 3, 4)) // 10
```

<br />

## 5. 迭代器模式

迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。迭代器模式可以把迭代的过程从业务逻辑中分离出来，在使用迭代器模式之后，即使不关心对象的内部构造，也可以按照顺序访问其中的每个元素。

| 迭代器     | 优点                                                               | 缺点               |
| ---------- | ------------------------------------------------------------------ | ------------------ |
| 内部迭代器 | 内部定义好了迭代规则，完全接手整个迭代过程，外部只需要一次初始调用 | 无法更改迭代规则   |
| 外部迭代器 | 增强了迭代器的灵活性，可以手工控制迭代的过程和顺序                 | 增加了调用的复杂度 |

```js
/**
 * 迭代器模式
 * @param obj
 * @returns {{next: (function(): number), getCurrentItem: (function(): *), isDone: (function(): boolean)}}
 */
function iterator(obj) {
  let current = 0

  const next = () => current += 1

  const isDone = () => current >= obj.length

  const getCurrentItem = () => obj[current]

  return {
    next,
    isDone,
    getCurrentItem
  }
}
function compare(iterator1, iterator2) {
  if (iterator1.length !== iterator2.length) {
    throw new TypeError('iterator1和iterator2不相等')
  }

  while (!iterator1.isDone() && !iterator2.isDone()) {
    if (iterator1.getCurrentItem() !== iterator2.getCurrentItem()) {
      throw new TypeError('iterator1和iterator2不相等')
    }
    iterator1.next()
    iterator2.next()
  }

  console.log('iterator1和iterator2相等')
}

compare(iterator([1, 2, 3]), iterator([1, 2, 3])) // iterator1和iterator2相等
```

<br />

## 6. 发布-订阅模式

又叫观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。在js开发中，一般用事件模型来代替传统的发布-订阅模式。

实现步骤：

1. 制定好谁充当发布者
2. 给发布者添加一个缓存列表，用于存放回调函数以便通知订阅者
3. 发布消息的时候，发布者会遍历这个缓存列表，依次触发里面存放的订阅者回调函数；还可以往回调函数里填入一些参数，订阅者可以接收这些参数

```js
/**
 * 发布-订阅模式
 * @type {{clientList: {}, trigger(...[*]): (boolean|undefined), listen(*, *): void}}
 */
const event = {
  clientList: {},
  listen(key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = []
    }
    // 订阅的消息添加进缓存列表
    this.clientList[key].push(fn)
  },
  trigger(...args) {
    const key = args.shift()
    const fns = this.clientList[key]

    // 没有绑定对应的消息
    if (!fns || fns.length === 0) {
      return false
    }

    for (let i = 0; i < fns.length; i++) {
      const fn = fns[i]
      fn.apply(this, args)
    }
  },
  remove(key, fn) {
    const fns = this.clientList[key]

    // 如果key对应的消息没有被人订阅，则直接返回
    if (!fns) {
      return false
    }

    // 如果没有传入具体的回调函数，表示需要取消key对应消息的所有订阅
    if (!fn) {
      fns && (fns.length = 0)
    }
    else {
      // 反向遍历订阅的回调函数列表
      for (let i = fns.length - 1; i >= 0; i--) {
        const _fn = fns[i]
        if (_fn === fn || _fn.toString() === fn.toString()) {
          fns.splice(i, 1)
        }
      }
    }
  }
}
function installEvent(obj) {
  for (const key in event) {
    obj[key] = event[key]
  }
}
const saleOffices = {}
installEvent(saleOffices)
saleOffices.listen('sm88', (price, time) => {
  console.log('价格是：', price, time)
})
saleOffices.listen('sm88', (price, time, size) => {
  console.log('价格2是：', price, time, size)
})
function fn100(price, time) {
  console.log('价格是：', price, time)
}
saleOffices.listen('sm100', fn100)
saleOffices.remove('sm100', fn100)
saleOffices.trigger('sm88', 100, '2023-06-09', 'big')
saleOffices.trigger('sm100', 200, '2023-06-12', 'huge')
saleOffices.trigger('sm100', 200, '2023-06-30', 'large')
// 价格是： 100 2023-06-09
// 价格2是： 100 2023-06-09 bi
```

发布-订阅模式可以用一个全局的Event对象来实现，订阅者不需要了解消息来自哪个发布者，发布者也不知道消息会推送给哪些订阅者，Event作为一个类似“中介者”的角色，把订阅者和发布者联系起来。

<br />

## 7. 命令模式

命令模式中的命令指的是一个执行某些特定事情的指令。

命令模式最常见的应用场景是：有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的操作是什么。此时希望用一种松耦合的方式来设计程序，使得请求发送者和接收者能够消除彼此之间的耦合关系。

<br />

## 8. 组合模式

组合模式就是用小的对象来构建更大的对象，而这些小的对象本身也许是由更小的“孙对象”构成的。

```js
/**
 * 宏命令 - 组合模式
 * @type {{execute(): void}}
 */
const closeDoorCommand = {
  execute() {
    console.log('关门')
  }
}
const openPcCommand = {
  execute() {
    console.log('开电脑')
  }
}
const openQQCommand = {
  execute() {
    console.log('登录QQ')
  }
}
class MacroCommand {
  constructor() {
    this.commandList = []
  }

  add(command) {
    this.commandList.push(command)
  }

  execute() {
    this.commandList.forEach(command => command.execute())
  }
}
const macroCommand = new MacroCommand()
macroCommand.add(closeDoorCommand)
macroCommand.add(openPcCommand)
macroCommand.add(openQQCommand)
macroCommand.execute()
// 关门
// 开电脑
// 登录QQ
```

::: tip

macroCommand表现得像一个命令，但它实际上只是一组真正命令的代理。并非真正的代理，只是结构上相似，但它只负责传递请求给叶对象，它的目的不在于控制对叶对象的访问。

:::

**组合模式的好处：**

1. 将对象组合成树形结构，以表示“部分-整体”的层次结构。
2. 通过对象的多态性表现，使得用户对单个对象和组合对象的使用具有一致性。

总而言之，如果子节点是叶对象，叶对象自身会处理这个请求，而如果子节点还是组合对象，请求会继续往下传递。每当对最上层的对象进行一次请求时，实际上是对整个树进行深度优先的搜索，而创建组合对象的程序员并不关心这些内在的细节。

组合模式最大的优点在于可以一致地对待组合对象和基本对象。客户不需要知道当前处理的是宏命令还是普通命令，只要它是一个命令 ，并且有execute方法，这个命令就可以被添加到树中。

**组合模式的适用情况：**

- 表示对象的部分-整体层次结构
- 希望统一对待树中的所有对象

<br />

## 9. 模板方法模式

模板方法模式是一种只需使用继承就可以实现的非常简单的模式。由两部分结构组成，第一部分是抽象父类，第二部分是具体的实现子类。通常在抽象父类中封装了子类的算法框架，包括实现一些公共方法以及封装子类中所有方法的执行顺序。子类通过继承这个抽象类，也继承了整个算法结构，并且可以选择重写父类的方法。子类实现中的相同部分被上移到父类中，而将不同的部分留待子类来实现。

抽象方法被声明在抽象类中，抽象方法并没有具体的实现过程，当子类继承了这个抽象类时，必须重写父类的抽象方法。

<br />

## 10. 享元模式

是一种用于性能优化的模式，核心是运用共享技术来有效支持大量细粒度的对象。

享元模式要求将对象的属性划分为内部状态和外部状态。

- 内部状态存储于对象内部
- 内部状态可以被一些对象共享
- 内部状态独立于具体的场景，通常不会改变
- 外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享

这样一来，便可以把所有内部状态相同的对象都指定为同一个共享的对象，而外部状态可以从对象身上剥离下来，并存储在外部。

::: warning

通常来讲，内部状态有多少种组合，系统中便最多存多少个对象

:::

一般来说，以下情况发生时便可以使用享元模式：

- 一个程序中使用了大量的相似对象
- 由于使用了大量对象，造成很大的内存开销
- 对象的大多数状态都可以变为内部状态
- 剥离出对象的外部状态之后，可以用相对较少的共享对象取代大量对象

### 10.1 对象池

对象池维护一个装载空闲对象的池子，如果需要对象的时候，不是直接new，而是转从对象池里获取。如果对象池里没有空闲对象，则创建一个新的对象，当获取出的对象完成它的职责之后，在进入池子等待被下次获取。

对象池技术的应用非常广泛，HTTP连接池和数据库连接池都是其代表应用。在web前端开发中，对象池使用最多的场景大概就是跟DOM有关的操作。

```js
/**
 * 对象池
 * @param createObjFn
 * @returns {{recover(*): void, create(...[*]): *}|*}
 */
function objectPoolFactory(createObjFn) {
  const objectPool = []

  return {
    create(...args) {
      return objectPool.length === 0 ? createObjFn.apply(this, args) : objectPool.shift()
    },
    recover(obj) {
      objectPool.push(obj)
    }
  }
}
const iframeFactory = objectPoolFactory(() => {
  const iframe = document.createElement('iframe')
  document.body.appendChild(iframe)

  iframe.onload = function () {
    iframe.onload = null // 防止iframe重复加载的bug
    iframeFactory.recover(iframe) // iframe加载完成之后回收节点
  }

  return iframe
})
const iframe1 = iframeFactory.create()
iframe1.src = 'https://www.google.com'
const iframe2 = iframeFactory.create()
iframe2.src = 'https://www.bilibili.com'
setTimeout(() => {
  const iframe3 = iframeFactory.create()
  iframe3.src = 'https://movie.douban.com/'
}, 3000)
```

<br />

## 11. 职责链模式

使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。

```js
/**
 * 职责链模式
 * @param orderType
 * @param pay
 * @param stock
 * @returns {string}
 */
function order500(orderType, pay, stock) {
  if (orderType === 1 && pay === true) {
    console.log('500元定金预购，得到100优惠券')
  }
  else {
    return 'nextSuccessor'
  }
}
function order200(orderType, pay, stock) {
  if (orderType === 2 && pay === true) {
    console.log('200元定金预购，得到50优惠券')
  }
  else {
    return 'nextSuccessor'
  }
}
function orderNormal(orderType, pay, stock) {
  if (stock > 0) {
    console.log('普通购买，无优惠券')
  }
  else {
    console.log('手机库存不足')
  }
}
class Chain {
  constructor(fn) {
    this.fn = fn
    this.successor = null
  }

  setNextSuccessor(successor) {
    return this.successor = successor
  }

  passReq(...args) {
    const result = this.fn.apply(this, args)

    if (result === 'nextSuccessor') {
      return this.successor && this.successor.passReq.apply(this.successor, args)
    }

    return result
  }
}
// 定义职责链的节点
const chainOrder500 = new Chain(order500)
const chainOrder200 = new Chain(order200)
const chainOrderNormal = new Chain(orderNormal)
// 指定节点在职责链的顺序
chainOrder500.setNextSuccessor(chainOrder200)
chainOrder200.setNextSuccessor(chainOrderNormal)
// 传递请求给第二个节点
chainOrder200.passReq(2, false, 0) // 手机库存不足
```

<br />

## 12. 中介者模式

中介者模式的作用是解除对象与对象之间的紧耦合关系。增加一个中介者对象后，所有的相关对象都通过中介者来通信，而不是互相引用。中介者使各个对象之间耦合松散，而且可以独立地改变它们之间的交互。中介者模式使网状的多对多关系变成了相对简单的一对多关系。

```js
/**
 * 中介者模式
 */
class Player {
  constructor(name, teamColor) {
    this.name = name
    this.teamColor = teamColor
    this.state = 'alive'
  }

  win() {
    console.log(`${this.name} win`)
  }

  lose() {
    console.log(`${this.name} lose`)
  }

  die() {
    this.state = 'dead'
    playDirector.ReceiveMessage('playerDead', this) // 给中介者发消息，玩家死亡
  }

  remove() {
    playDirector.ReceiveMessage('removePlayer', this) // 给中介者发消息，移除玩家
  }

  changeTeam(color) {
    playDirector.ReceiveMessage('changeTeam', this, color) // 给中介者发消息，玩家换队
  }
}

/**
 * 新增玩家工厂函数
 * @param name
 * @param teamColor
 * @returns {Player}
 */
function playerFactory(name, teamColor) {
  const newPlayer = new Player(name, teamColor)
  playDirector.ReceiveMessage('addPlayer', newPlayer) // 给中介者发消息，新增玩家

  return newPlayer
}

const playDirector = (function () {
  const players = {}; const operations = {}

  // 新增玩家
  operations.addPlayer = function (player) {
    const teamColor = player.teamColor
    players[teamColor] = players[teamColor] || [] // 如果该颜色的玩家还没有成立队伍，则新成立一个队伍
    players[teamColor].push(player)
  }

  // 移除玩家
  operations.removePlayer = function (player) {
    const teamColor = player.teamColor
    players[teamColor] = players[teamColor].filter(item => item !== player)
  }

  // 玩家换队
  operations.changeTeam = function (player, newTeamColor) {
    operations.removePlayer(player) // 从原队伍中删除
    player.teamColor = newTeamColor // 改变队伍颜色
    operations.addPlayer(player) // 添加到新队伍
  }

  // 玩家死亡
  operations.playerDead = function (player) {
    const teamColor = player.teamColor
    const teamPlayers = players[teamColor] || []
    let ALL_DEAD = true
    for (let i = 0; i < teamPlayers.length; i++) {
      if (teamPlayers[i].state !== 'dead') {
        ALL_DEAD = false
        break
      }
    }

    // 全部死亡
    if (ALL_DEAD) {
      // 本队所有玩家死亡
      teamPlayers.forEach((item) => {
        item.lose()
      })

      for (const color in players) {
        if (color !== teamColor) {
          const winTeam = players[color]
          winTeam.forEach((item) => {
            item.win()
          })
        }
      }
    }
  }

  // 接收消息
  function ReceiveMessage(...args) {
    const message = args[0] || ''
    operations[message].apply(this, args.slice(1))
  }

  return {
    ReceiveMessage
  }
})()

// 红队
const player1 = playerFactory('红队1号', 'red')
const player2 = playerFactory('红队2号', 'red')
const player3 = playerFactory('红队3号', 'red')
const player4 = playerFactory('红队4号', 'red')
// 蓝队
const player5 = playerFactory('蓝队1号', 'blue')
const player6 = playerFactory('蓝队2号', 'blue')
const player7 = playerFactory('蓝队3号', 'blue')
const player8 = playerFactory('蓝队4号', 'blue')

player1.die()
player2.die()
player3.die()
player4.die()

// 红队1号 lose
// 红队2号 lose
// 红队3号 lose
// 红队4号 lose
// 蓝队1号 win
// 蓝队2号 win
// 蓝队3号 win
// 蓝队4号 win
```

<br />

## 13. 装饰者模式

<br />

## 14. 状态模式

状态模式的关键是把事物的每种状态都封装成单独的类，跟此种状态有关的行为都被封装在这个类的内部。

```js
/**
 * 状态模式
 */
// 上传插件
const plugin = (function () {
  const plugin = document.createElement('embed')
  plugin.style.display = 'none'
  plugin.type = 'application/txftn-webkit'

  plugin.sign = function () {
    console.log('开始文件扫描')
  }
  plugin.pause = function () {
    console.log('暂停文件上传')
  }
  plugin.uploading = function () {
    console.log('开始文件上传')
  }
  plugin.del = function () {
    console.log('删除文件上传')
  }
  plugin.done = function () {
    console.log('文件上传完成')
  }
  document.body.appendChild(plugin)

  return plugin
})()

class Upload {
  constructor(fileName) {
    this.plugin = plugin
    this.fileName = fileName
    this.button1 = null
    this.button2 = null
    this.signState = new SignState(this) // 设置初始状态为waiting
    this.uploadingState = new UploadingState(this)
    this.pauseState = new PauseState(this)
    this.doneState = new DoneState(this)
    this.errorState = new ErrorState(this)
    this.currentState = this.signState // 设置当前状态
  }

  init() {
    this.dom = document.createElement('div')
    this.dom.innerHTML = `<span>文件名称:${this.fileName}</span>
                          <button data-action="button1">扫描中</button>
                          <button data-action="button2">删除</button>`
    document.body.appendChild(this.dom)
    this.button1 = this.dom.querySelector('[data-action="button1"]')
    this.button2 = this.dom.querySelector('[data-action="button2"]')
    this.bindEvent()
  }

  bindEvent() {
    const self = this
    this.button1.onclick = function () {
      self.currentState.clickHandler1()
    }
    this.button2.onclick = function () {
      self.currentState.clickHandler2()
    }
  }

  sign() {
    this.plugin.sign()
    this.currentState = this.signState
  }

  uploading() {
    this.button1.innerHTML = '正在上传，点击暂停'
    this.plugin.uploading()
    this.currentState = this.uploadingState
  }

  pause() {
    this.button1.innerHTML = '已暂停，点击继续上传'
    this.plugin.pause()
    this.currentState = this.pauseState
  }

  done() {
    this.button1.innerHTML = '上传完成'
    this.plugin.done()
    this.currentState = this.doneState
  }

  error() {
    this.button1.innerHTML = '上传失败'
    this.currentState = this.errorState
  }

  del() {
    this.plugin.del()
    this.dom.parentNode.removeChild(this.dom)
  }
}

const StateFactory = (function () {
  class State {
    clickHandler1() {
      throw new Error('子类必须重写父类的clickHandler1方法')
    }

    clickHandler2() {
      throw new Error('子类必须重写父类的clickHandler2方法')
    }
  }

  return function (param) {
    function F(uploadObj) {
      this.uploadObj = uploadObj
    }

    F.prototype = new State()

    for (const key in param) {
      F.prototype[key] = param[key]
    }

    return F
  }
})()

const SignState = StateFactory({
  clickHandler1() {
    console.log('扫描中，点击无效...')
  },
  clickHandler2() {
    console.log('文件正在上传中，不能删除')
  }
})
const UploadingState = StateFactory({
  clickHandler1() {
    this.uploadObj.pause()
  },
  clickHandler2() {
    console.log('文件正在上传中，不能删除')
  }
})
const PauseState = StateFactory({
  clickHandler1() {
    this.uploadObj.uploading()
  },
  clickHandler2() {
    this.uploadObj.del()
  }
})
const DoneState = StateFactory({
  clickHandler1() {
    console.log('文件已完成上传，点击无效')
  },
  clickHandler2() {
    this.uploadObj.del()
  }
})
const ErrorState = StateFactory({
  clickHandler1() {
    console.log('文件上传失败，点击无效')
  },
  clickHandler2() {
    this.uploadObj.del()
  }
})
const uploadObj = new Upload('javascript 设计模式与开发实践')
uploadObj.init()
window.external.upload = function (state) {
  console.log(state) // 可能为sign uploading done error
  uploadObj[state]()
}
window.external.upload('sign')
setTimeout(() => {
  window.external.upload('uploading')
}, 1000)
setTimeout(() => {
  window.external.upload('done')
}, 5000)
```

|          | 优点                                                                                                                                                                                                                                                                                                                                                      | 缺点                                                                                                                                                                                       |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 状态模式 | 1. 定义了状态与行为之间的关系，并将它们封装在一个类里，通过增加新的状态类，很容易增加新的状态和转换<br />2. 避免context无限膨胀，状态切换的逻辑被分布在状态类中，也去掉了context中原本过多的条件分支<br />3. 用对象代替字符串来记录当前状态，使得状态的切换更加一目了然<br />4. context中的请求动作和状态类中的封装的行为可以非常容易地独立变化而互不影响 | 1. 会在系统中定义许多状态类，系统中会因此增加不少对象<br />2. 由于逻辑分散在状态类中，虽然避开了不受欢迎的条件分支语句，但也造成了逻辑分散的问题，我们无法在一个地方就看出整个状态机的逻辑 |

**和策略模式的对比：**

- 相同点：它们都有一个上下文、一些策略或者状态类，上下文把请求委托给这些类来执行。
- 不同点：策略模式中的各个策略类之间是平等又平行的，它们之间没有任何联系，所以客户必须熟知这些策略类的作用，以便客户可以随时主动切换算法；在状态模式中，状态和状态对应的行为是早已被封装好的，状态之间的切换也早被规定完成，“改变行为”这件事发生在状态模式的内部。对客户来说，并不需要了解这些细节。

```js
/**
 * 对象属性版-状态机
 */
class Light1 {
  constructor() {
    this.currentState = FSM.off // 设置当前状态
    this.button = null
  }

  init() {
    const button = document.createElement('button')
    const self = this
    button.innerHTML = '已关灯'
    this.button = document.body.appendChild(button)
    this.button.onclick = function () {
      self.currentState.buttonWasPressed.call(self)
    }
  }
}

const FSM = {
  off: {
    buttonWasPressed() {
      console.log('关灯')
      this.button.innerHTML = '下一次按我是开灯'
      this.currentState = FSM.on
    }
  },
  on: {
    buttonWasPressed() {
      console.log('开灯')
      this.button.innerHTML = '下一次按我是关灯'
      this.currentState = FSM.off
    }
  }
}
const light1 = new Light1()
light1.init()

/**
 * 闭包版-状态机
 */
function delegate(client, delegation) {
  return {
    buttonWasPressed(...args) {
      return delegation.buttonWasPressed.apply(client, args)
    }
  }
}
class Light2 {
  constructor() {
    this.offState = delegate(this, FSM.off)
    this.onState = delegate(this, FSM.on)
    this.currentState = FSM.off // 设置当前状态
    this.button = null
  }

  init() {
    const button = document.createElement('button')
    const self = this
    button.innerHTML = '已关灯'
    this.button = document.body.appendChild(button)
    this.button.onclick = function () {
      self.currentState.buttonWasPressed.call(self)
    }
  }
}
const light2 = new Light2()
light2.init()
```

<br />

## 15. 适配器模式

作用是解决两个软件实体间的接口不兼容的问题。别名是包装器。它不考虑这些接口是怎样实现的，也不考虑它们将来可能会如何演化。不需要改变已有的接口，就能够使它们协同作用。

<br />

## 16. 单一职责原则

体现为：一个对象（方法）只做一件事情。

|                   | 优点                                                                                                                                | 缺点                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 单一职责原则(SRP) | 1. 降低了单个类或者对象的复杂度<br />2. 把对象分解成更小的粒度，有利于代码的复用<br />3. 当一个职责变更的时候，不会影响到其他的职责 | 1. 会增加代码的复杂度<br />2. 增大了对象间相互联系的难度 |

<br />
