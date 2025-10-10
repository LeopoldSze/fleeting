# 手写实现

## call

```js
/**
 * 手写call方法
 * @param context
 * @param args
 * @returns {*}
 * @constructor
 */
Function.prototype.SzeCall = function (context = window, ...args) {
  // 判断调用call的是否是函数
  if (typeof this !== 'function') {
    throw new TypeError('SzeCall函数只能通过函数调用')
  }

  // 在context上添加一个selfMethod属性，并将它的值设置为函数本身
  const key = Symbol('selfMethod')
  context[key] = this

  // 调用context[key]()并传入后续参数
  const result = context[key](...args)

  // 删除添加的selfMethod属性
  delete context[key]

  // 返回函数执行的结果
  return result
}

// **********************************************
// 此部分为手写call方法测试代码
function bar(c) {
  return this.a + this.b + c
}
const barObj = {
  a: 1,
  b: 2
}
const barCall = bar.SzeCall(barObj, 1, 2, 3)
console.log('barCall:', barCall) // 4
// **********************************************
```

<br />

## apply

```js
/**
 * 手写apply方法
 * @param context
 * @param args
 * @returns {*}
 * @constructor
 */
Function.prototype.SzeApply = function (context = window, args) {
  if (typeof this !== 'function') {
    throw new TypeError('SzeApply方法只能通过函数调用')
  }

  // 在context上添加一个selfMethod属性，并将它的值设置为函数本身
  const key = Symbol('selfApply')
  context[key] = this

  let result = null
  // 判断args是否是数组或类数组对象
  if (Array.isArray(args) || (!!args && typeof args.length === 'number')) {
    // 如果是数组或类数组对象，则将其拆成参数列表传递给context[key]()方法
    result = context[key](...args)
  }
  else {
    // 如果其他类型的参数，则直接调用context[key]()方法
    result = context[key]()
  }

  return result
}

// ********************************************************
const barApply = bar.SzeApply(barObj, [5, 4])
console.log('barApply:', barApply) // 8
// ********************************************************
```

<br />

## bind

```js
/**
 * ES5 手写bind函数
 * @param context
 * @returns {function(): any}
 */
Function.prototype.ES5SzeBind = function (context) {
  // 需要判断调用SzeBind函数的是否为函数
  if (typeof this !== 'function') {
    throw new TypeError('ES5SzeBind函数必须通过函数调用')
  }

  // 获取slice函数引用指针，优化对象查询
  const sliceFn = Array.prototype.slice
  // 将从第2位开始的函数参数转为数组，因为第一位为要绑定this的对象参数
  const args = sliceFn.call(arguments, 1)
  // 保存当前环境this的指针
  const self = this

  // 定义中介函数
  function Bound() {
    // 禁止用构造函数方式调用，因为new绑定的优先级高于bind，bind绑定的this会被忽略
    if (this instanceof Bound) {
      throw new TypeError('当前函数不可以通过构造函数方式调用')
    }
    // 将函数执行时的参数转为数组
    const boundArgs = sliceFn.call(arguments)
    // 将定义的参数和执行参数组合到一起
    const finalArgs = args.concat(boundArgs)
    // 判断当前函数的调用方式，是通过普通函数调用，还是通过构造函数new调用，来决定this的指向。
    return self.apply(
      this instanceof Bound ? this : context,
      finalArgs
    )
  }

  // 使用闭包维护调用bind函数时传递的参数和函数本身被调用时的参数
  Bound.prototype = Object.create(this.prototype)

  return Bound
}

/**
 * ES6 手写bind函数
 * @param context
 * @param args
 * @returns {function(...[*]): *}
 */
Function.prototype.ES6SzeBind = function (context, ...args) {
  // 需要判断调用SzeBind函数的是否为函数
  if (typeof this !== 'function') {
    throw new TypeError('ES6SzeBind函数必须通过函数调用')
  }

  // 定义中介函数，因为此处函数被定义为箭头函数，new调用会报错，这是相对于普通函数定义的问题
  const self = this
  const Bound = function (...boundArgs) {
    const finalArgs = args.concat(boundArgs)
    return self.apply(
      this instanceof Bound ? this : context,
      finalArgs
    )
  }

  // 使用闭包维护调用bind函数时传递的参数和函数本身被调用时的参数
  Bound.prototype = Object.create(this.prototype)
  return Bound
}

// ***********************************************
// 此部分为手写bind函数测试代码
function foo(a, b) {
  return a + b + this.c
}
const testBindObj = {
  c: 3
}
const fooES5Bind = foo.ES5SzeBind(testBindObj, 1, 2)
console.log(fooES5Bind(4, 5))
const fooES6Bind = foo.ES6SzeBind(testBindObj, 1, 2)
console.log(fooES6Bind(4, 5))
// ***********************************************
```

<br />

## new

```js
/**
 * 手写new方法
 * @param Constructor
 * @param args
 * @returns {*}
 * @constructor
 */
function SzeNew(Constructor, ...args) {
  // 创建一个新对象，使其原型指向构造函数的原型
  const obj = Object.create(Constructor.prototype)

  // 执行构造函数，并将this绑定到对象上
  const result = Constructor.apply(obj, args)

  // 如果构造函数返回了一个对象，则直接返回该对象
  if (typeof result === 'object' && result !== null) {
    return result
  }

  // 否则返回新对象
  return obj
}

// ************************************************************
function Person(name, age) {
  this.name = name
  this.age = age
}
const person = SzeNew(Person, 'sze', 18)
console.log('person:', person) // Person {name: 'sze', age: 18}

function Animal(sound) {
  this.sound = sound
  return {
    name: 'doge',
    sound: 'wow'
  }
}
const animal = SzeNew(Animal, 'wang')
console.log('animal:', animal) // Animal {name: 'doge', sound: 'wow'}
```

<br />

## promise

```js

```

<br>
