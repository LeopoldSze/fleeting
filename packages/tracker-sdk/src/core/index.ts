import type { DefaultOptions, Options, reportTrackerData } from '@/types'
import { createHistoryEvent } from '@/utils/pv'
import { version as pkgVersion } from '../../package.json'

const MouseEventList: string[] = [
  'click',
  'dblclick',
  'contextmenu'
]

class Tracker {
  data: Options
  private version: string | undefined
  private listeners: Array<{ type: string, handler: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions }>
  private originalHistory?: { push?: History['pushState'], replace?: History['replaceState'] }

  constructor(options: Options) {
    this.listeners = []
    this.data = Object.assign(this.initDefaultOptions(), options)
    this.installInnerTrack()
  }

  private initDefaultOptions(): DefaultOptions {
    this.version = pkgVersion
    if (typeof window !== 'undefined' && window.history) {
      this.originalHistory = {
        push: window.history.pushState,
        replace: window.history.replaceState
      }
      window.history.pushState = createHistoryEvent('pushState')
      window.history.replaceState = createHistoryEvent('replaceState')
    }

    return {
      uuid: undefined,
      requestUrl: undefined,
      extra: undefined,
      sdkVersion: this.version,
      historyTracker: false,
      hashTracker: false,
      domTracker: false,
      jsError: false
    }
  }

  setUserId<T extends DefaultOptions['uuid']>(uuid: T) {
    this.data.uuid = uuid
  }

  setExtra<T extends DefaultOptions['extra']>(extra: T) {
    this.data.extra = extra
  }

  sendTracker<T extends reportTrackerData>(data: T) {
    this.reportTracker(data)
  }

  /**
   * 监听事件
   * @param eventList
   * @param targetKey
   * @param data
   * @private
   */
  private captureEvents<T>(eventList: string[], targetKey: string, data?: T) {
    eventList.forEach((event) => {
      const handler = () => {
        this.reportTracker({
          event,
          targetKey,
          data
        } as any)
      }
      this.on(event, handler)
    })
  }

  private on(type: string, handler: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
    window.addEventListener(type, handler as EventListener, options)
    const entry = options !== undefined ? { type, handler, options } : { type, handler }
    this.listeners.push(entry as any)
  }

  private offAll() {
    this.listeners.forEach(({ type, handler, options }) => {
      window.removeEventListener(type, handler as EventListener, options as any)
    })
    this.listeners = []
  }

  /**
   * 监听内部事件
   * @private
   */
  private installInnerTrack() {
    if (typeof window === 'undefined')
      return
    if (this.data.historyTracker) {
      this.captureEvents(['pushState', 'replaceState', 'popstate'], 'history-pv')
    }
    if (this.data.hashTracker) {
      this.captureEvents(['hashchange'], 'hash-pv')
    }
    if (this.data.domTracker) {
      this.targetKeyReport()
    }
    if (this.data.jsError) {
      this.jsError()
    }
  }

  /**
   * DOM事件上报
   * @private
   */
  private targetKeyReport() {
    MouseEventList.forEach((event) => {
      const handler = (e: Event) => {
        const orig = e.target as HTMLElement | null
        const el = orig && orig.closest ? orig.closest('[data-track-key],[target-key]') as HTMLElement | null : orig
        const targetValue = el?.getAttribute('data-track-key') ?? el?.getAttribute('target-key')
        if (targetValue) {
          this.sendTracker({
            event,
            targetKey: targetValue
          })
        }
      }
      this.on(event, handler)
    })
  }

  /**
   * js错误
   * @private
   */
  private jsError() {
    this.errorEvent()
    this.promiseReject()
  }

  /**
   * 捕获js错误
   * @private
   */
  private errorEvent() {
    const handler = (e: ErrorEvent | Event) => {
      // 区分 JS 运行时错误与资源加载错误
      const isResourceError = !!(e as Event).target && (e as Event).target !== window
      if (isResourceError) {
        const t = (e as Event).target as any
        const resourceUrl = t?.src || t?.href || ''
        const tagName = (t?.tagName || '').toLowerCase()
        this.sendTracker({
          event: 'error',
          targetKey: 'resource',
          message: 'resource load error',
          detail: { tagName, resourceUrl }
        } as any)
        return
      }
      const err = e as ErrorEvent
      this.sendTracker({
        event: 'error',
        targetKey: 'runtime',
        message: err.message,
        filename: err.filename,
        detail: { name: err.error?.name, stack: err.error?.stack },
        lineno: (err as any).lineno,
        colno: (err as any).colno
      } as any)
    }
    this.on('error', handler, true)
  }

  /**
   * 捕获promise错误
   * @private
   */
  private promiseReject() {
    const handler = (e: Event) => {
      const pe = e as PromiseRejectionEvent
      const reason = pe.reason
      const message = typeof reason === 'object' && reason && 'message' in reason ? String((reason as any).message) : String(reason)
      const detail = typeof reason === 'object' ? { name: (reason as any).name, stack: (reason as any).stack } : reason
      this.sendTracker({
        event: 'promise',
        targetKey: 'reject',
        message,
        detail
      } as any)
    }
    this.on('unhandledrejection', handler)
  }

  /**
   * 上报数据
   * @param data
   * @private
   */
  private reportTracker<T>(data: T) {
    if (!this.data.requestUrl)
      return
    const common = this.getCommonFields()
    const params = { ...common, ...(data as any), time: Date.now() }
    const json = JSON.stringify(params)
    const blob = new Blob([json], { type: 'application/json' })
    const hasBeacon = typeof navigator !== 'undefined' && typeof (navigator as any).sendBeacon === 'function'
    if (hasBeacon) {
      ;(navigator as any).sendBeacon(this.data.requestUrl, blob)
    }
    else {
      fetch(this.data.requestUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json,
        keepalive: true
      }).catch(() => {})
    }
  }

  private getCommonFields() {
    return {
      uuid: this.data.uuid,
      sdkVersion: this.data.sdkVersion,
      extra: this.data.extra,
      pageUrl: typeof location !== 'undefined' ? location.href : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    }
  }

  destroy() {
    this.offAll()
    if (this.originalHistory) {
      if (this.originalHistory.push)
        window.history.pushState = this.originalHistory.push
      if (this.originalHistory.replace)
        window.history.replaceState = this.originalHistory.replace
    }
  }
}

export { Tracker }
export default Tracker
