/**
 * lint-staged 独立配置（ESM）：统一使用 ESLint 修复并格式化
 * 与 @antfu/eslint-config 搭配（formatters: true），无需 Prettier。
 */
export default {
  // 代码与组件文件
  '**/*.{js,cjs,mjs,ts,tsx,jsx,vue,svelte,astro}': 'eslint --fix',
  // 文档与配置文件（由 Antfu 的 ESLint 格式化器处理）
  '**/*.{json,jsonc,yml,yaml,md,mdx,html,css,scss,sass,less,gql,graphql,toml,xml,svg}': 'eslint --fix',
}
