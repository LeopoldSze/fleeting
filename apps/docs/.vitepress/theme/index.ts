import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './custom.scss'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp(ctx) {
    console.log('ctx:', ctx)
  }
}
