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
    semi: false,
  },
})
