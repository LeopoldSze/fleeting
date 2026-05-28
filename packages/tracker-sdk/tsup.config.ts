import { defineConfig } from 'tsup'

export default defineConfig({
  // 入口文件
  entry: ['src/core/index.ts'],

  // 输出格式
  format: ['esm', 'cjs', 'iife'],

  // 全局变量名 - 对应 UMD 的 name
  globalName: 'tracker',

  // 输出目录
  outDir: 'dist',

  // 自动生成 .d.ts 声明文件
  dts: {
    entry: 'src/core/index.ts'
    // 或者简化为 dts: true
  },

  // 清理输出目录
  clean: true,

  // 生成 sourcemap
  sourcemap: false,

  // 目标环境
  target: 'es2015',

  // 最小化
  minify: true,

  // 文件命名规则
  outExtension: ({ format }) => {
    if (format === 'iife')
      return { js: '.js' }
    if (format === 'esm')
      return { js: '.esm.js' }
    if (format === 'cjs')
      return { js: '.cjs.js' }
    return { js: '.js' }
  }
})
