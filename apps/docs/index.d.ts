/**
 * 该文件用于声明不支持typescript的模块类型定义
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

declare module '*.data' {
  export const data: any
  const loader: any
  export default loader
}

declare module '*.data.ts' {
  export const data: any
  const loader: any
  export default loader
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
