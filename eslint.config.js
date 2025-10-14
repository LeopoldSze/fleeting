import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  unocss: true,
  vue: true,
  react: true,
  svelte: true,
  astro: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false
  },
  rules: {
    // 自定义规则
    'no-console': 'off',
    'style/comma-dangle': ['error', 'never']
  },
  ignores: ['**/*.md']
})
