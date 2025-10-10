/**
 * This file is used to declare modules that don't have typescript support
 */

/**
 * 声明svg模块
 */
declare module '*.svg' {
  const content: any
  export default content
}

/**
 * 声明 vue 单文件组件模块
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

/**
 * 声明window扩充属性
 */
declare global {
  interface Window {
    isSze: boolean
  }
}

export {}
