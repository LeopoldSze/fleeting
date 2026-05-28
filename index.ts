console.warn('Hello via Bun!')

interface EventFace {
  on: (name: string, callback: (...args: any[]) => void) => void
  emit: (name: string, ...args: Array<any>) => void
  off: (name: string, fn: (...args: any[]) => void) => void
  once: (name: string, fn: (...args: any[]) => void) => void
}

interface List {
  [key: string]: Array<(...args: any[]) => void>
}

class Dispatch implements EventFace {
  list: List

  constructor() {
    this.list = {}
  }

  // 订阅事件
  on(name: string, callback: (...args: any[]) => void) {
    const callbackList: Array<(...args: any[]) => void> = this.list[name] || []
    callbackList.push(callback)
    this.list[name] = callbackList
  }

  // 发布事件
  emit(name: string, ...args: Array<any>) {
    const eventName = this.list[name]
    if (eventName) {
      eventName.forEach((fn) => {
        fn.apply(this, args)
      })
    }
    else {
      console.error('该事件未监听')
    }
  }

  // 解除绑定
  off(name: string, fn: (...args: any[]) => void) {
    const eventName = this.list[name]
    if (eventName && fn) {
      const index = eventName.findIndex(fns => fns === fn)
      eventName.splice(index, 1)
    }
    else {
      console.error('该事件未监听')
    }
  }

  // 一次性订阅
  once(name: string, fn: (...args: any[]) => void) {
    const decorator = (...args: Array<any>) => {
      fn.apply(this, args)
      this.off(name, decorator)
    }
    this.on(name, decorator)
  }
}

const o = new Dispatch()

// 订阅事件 'abc'，输出参数和数字 1
o.on('abc', (...arg: Array<any>) => {
  console.log(arg, 1)
})

// 一次性订阅事件 'abc'，输出参数和字符串 'once'，只会触发一次
o.once('abc', (...arg: Array<any>) => {
  console.log(arg, 'once')
})

// 发布事件 'abc'，输出参数 1、true 和字符串 '小满'
o.emit('abc', 1, true, '小满')

// 再次发布事件 'abc'，输出参数 2、true 和字符串 '小满'
o.emit('abc', 2, true, '小满')

console.log('func types:', typeof function () {})
