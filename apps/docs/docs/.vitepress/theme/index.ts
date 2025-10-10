import type { EnhanceAppContext } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './custom.scss'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp(ctx: EnhanceAppContext) {
    console.log('ctx:', ctx)
  }
}
