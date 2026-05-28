/**
 * 创建 history 事件包装，仅支持 pushState 与 replaceState
 */
export function createHistoryEvent(type: 'pushState' | 'replaceState'): (...args: Parameters<History['pushState']>) => any {
  const origin = history[type]

  return function (this: any, ...args: Parameters<History['pushState']>) {
    const res = origin.apply(this, args)
    const e = new Event(type)
    window.dispatchEvent(e)
    return res
  }
}
