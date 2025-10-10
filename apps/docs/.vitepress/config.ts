import type { DefaultTheme, HeadConfig } from 'vitepress'
import { defineConfig } from 'vitepress'

type NavItem = DefaultTheme.NavItem

const wechatIcon
  = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1703837111010" class="icon" viewBox="0 0 1170 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4501" xmlns:xlink="http://www.w3.org/1999/xlink" width="228.515625" height="200"><path d="M331.429 263.429q0-23.429-14.286-37.715t-37.714-14.285q-24.572 0-43.429 14.571t-18.857 37.429q0 22.285 18.857 36.857t43.429 14.571q23.428 0 37.714-14t14.286-37.428zM756 553.143q0-16-14.571-28.572T704 512q-15.429 0-28.286 12.857t-12.857 28.286q0 16 12.857 28.857T704 594.857q22.857 0 37.429-12.571T756 553.143zM621.143 263.429q0-23.429-14-37.715t-37.429-14.285q-24.571 0-43.428 14.571t-18.857 37.429q0 22.285 18.857 36.857t43.428 14.571q23.429 0 37.429-14t14-37.428zM984 553.143q0-16-14.857-28.572T932 512q-15.429 0-28.286 12.857t-12.857 28.286q0 16 12.857 28.857T932 594.857q22.286 0 37.143-12.571T984 553.143zM832 326.286Q814.286 324 792 324q-96.571 0-177.714 44T486.57 487.143 440 651.429q0 44.571 13.143 86.857-20 1.714-38.857 1.714-14.857 0-28.572-0.857t-31.428-3.714-25.429-4-31.143-6-28.571-6L124.57 792l41.143-124.571Q0 551.429 0 387.429q0-96.572 55.714-177.715T206.571 82t207.715-46.571q100.571 0 190 37.714T754 177.429t78 148.857z m338.286 320.571q0 66.857-39.143 127.714t-106 110.572l31.428 103.428-113.714-62.285q-85.714 21.143-124.571 21.143-96.572 0-177.715-40.286T512.857 797.714t-46.571-150.857T512.857 496t127.714-109.429 177.715-40.285q92 0 173.143 40.285t130 109.715 48.857 150.571z" fill="#28BE2C" p-id="4502"></path></svg>'

/**
 * 头部元信息配置
 */
function getHeadMetaConfig(): HeadConfig[] {
  return [
    [
      'meta',
      {
        name: 'viewport',
        content:
          'width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'
      }
    ],
    [
      'meta',
      {
        name: 'keywords',
        content: 'Leopold-Sze VitePress Leopold Sze Blog'
      }
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png'
      }
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png'
      }
    ],
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.ico'
      }
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png'
      }
    ],
    [
      'meta',
      {
        name: 'theme-color',
        content: '#ffffff'
      }
    ]
    // ['link', { rel: 'stylesheet', href: 'https://unpkg.com/gitalk/dist/gitalk.css' }],
    // ['script', { src: 'https://unpkg.com/gitalk/dist/gitalk.min.js' }]
  ]
}

/**
 * nav配置
 */
function getNavConfig(): NavItem[] {
  return [
    {
      text: '工具库',
      items: [
        { text: 'JavaScript', link: '/FrontEnd/function/js' },
        { text: 'CSS', link: '/FrontEnd/function/css' }
      ]
    },
    { text: '核心方案', link: '/FrontEnd/other/core' },
    { text: '常见问题', link: '/FrontEnd/other/problem' },
    {
      text: '官方文档',
      items: [{ text: 'Vue', link: 'https://v3.cn.vuejs.org/guide/introduction.html' }]
    }
  ]
}

/**
 * sidebar配置
 */
function getSidebar() {
  return [
    {
      text: 'HTML',
      collapsed: true,
      base: '/FrontEnd/html',
      items: [
        { text: 'HTML5', link: '/html5.md' },
        { text: 'IndexedDB', link: '/indexedDB' },
        { text: 'Web Worker', link: '/webWorker' },
        { text: '移动端适配', link: '/responsive' }
      ]
    },
    {
      text: 'CSS',
      collapsed: true,
      base: '/FrontEnd/css',
      items: [
        { text: 'CSS2.1', link: '/css' },
        { text: '选择器', link: '/selector' },
        { text: 'CSS3', link: '/css3' },
        { text: 'Less', link: '/less' }
      ]
    },
    {
      text: 'JavaScript',
      collapsed: true,
      base: '/FrontEnd/javascript',
      items: [
        { text: '基础', link: '/js' },
        { text: 'Promise', link: '/promise' },
        { text: '手写实现', link: '/handWriting' },
        { text: '设计模式', link: '/pattern' },
        { text: 'Deno', link: '/deno' }
      ]
    },
    {
      text: 'NodeJS',
      collapsed: true,
      base: '/FrontEnd/nodejs',
      items: [
        { text: 'NodeJS', link: '/nodejs' },
        { text: 'Bun', link: '/bun' }
      ]
    },
    {
      text: 'Vue',
      collapsed: true,
      base: '/FrontEnd/vue',
      items: [
        { text: '简介', link: '/1-introduction' },
        { text: '应用创建', link: '/2-application' },
        { text: '模板语法', link: '/3-template' },
        { text: '响应式', link: '/4-reactivity' },
        { text: '计算属性', link: '/5-computed' },
        { text: '类与样式绑定', link: '/6-class-and-style' },
        { text: '渲染', link: '/7-render' },
        { text: '事件处理及表单', link: '/8-event-handling' },
        { text: '生命周期钩子', link: '/9-lifecycle' },
        { text: '侦听器和模板引用', link: '/10-watchers-and-refs' },
        { text: '组件', link: '/11-component' },
        { text: '逻辑复用和自定义指令', link: '/12-logic-reuse' },
        { text: '内置组件', link: '/13-inside-components' },
        { text: '搭配ts', link: '/13-vue-and-ts' },
        { text: 'API', link: '/14-global-api' },
        { text: '性能优化', link: '/15-performance' },
        { text: '工程化配置', link: '/16-engineering' },
        { text: 'vue-router', link: '/20-router' },
        { text: 'Pinia', link: '/pinia' },
        { text: 'Vue CLI 项目构建', link: '/vue-cli' },
        { text: 'Vue2 原理', link: '/vue2' }
      ]
    },
    {
      text: 'React',
      collapsed: true,
      base: '/FrontEnd/react',
      items: [{ text: '基础', link: '/base' }]
    },
    {
      text: 'TypeScript',
      collapsed: true,
      base: '/FrontEnd/typescript',
      items: [
        { text: '基础', link: '/basic' },
        { text: 'tsconfig', link: '/tsconfig' },
        { text: '声明文件', link: '/declaration-files' }
      ]
    },
    {
      text: '工具链',
      collapsed: true,
      base: '/FrontEnd/engineering',
      items: [
        { text: 'NPM', link: '/npm' },
        { text: 'Git', link: '/git' },
        { text: '前端工程化', link: '/engineering' },
        { text: '前端路由', link: '/router' },
        { text: 'Browserslist', link: '/browserslist' },
        { text: 'Semver', link: '/semver' }
      ]
    },
    {
      text: '浏览器&网络',
      collapsed: true,
      base: '/FrontEnd/browser',
      items: [
        { text: '缓存', link: '/cache' },
        { text: '网络', link: '/network' }
      ]
    },
    {
      text: '数据结构&算法',
      collapsed: true,
      base: '/FrontEnd/algorithm',
      items: [
        { text: '数据结构', link: '/data-structure' },
        { text: '算法', link: '/algorithm' }
      ]
    },
    {
      text: '跨平台',
      collapsed: true,
      base: '/FrontEnd/cross-platform',
      items: [
        { text: 'Electron', link: '/electron' },
        { text: 'Flutter', link: '/flutter' }
      ]
    },
    {
      text: '图形',
      collapsed: true,
      base: '/FrontEnd/graph',
      items: [
        { text: 'Canvas', link: '/canvas' },
        { text: 'WebGL', link: '/webgl' },
        { text: 'ThreeJS', link: '/threejs' }
      ]
    },
    {
      text: '后端',
      collapsed: true,
      base: '/BackEnd',
      items: [
        { text: 'MongoDB', link: '/mongodb' },
        { text: 'NestJS', link: '/nestjs' },
        { text: 'Java', link: '/java' },
        { text: 'MySQL', link: '/mysql' },
        { text: 'JDBC', link: '/JDBC' }
      ]
    },
    {
      text: '运维',
      collapsed: true,
      base: '/DevOps',
      items: [
        {
          text: 'Linux',
          link: '/linux'
        },
        {
          text: 'Docker',
          link: '/docker'
        }
      ]
    },
    {
      text: '开发工具',
      collapsed: true,
      base: '/Tools',
      items: [
        { text: 'WebStorm', link: '/webstorm' },
        { text: 'Markdown', link: '/markdown' },
        { text: 'YAML', link: '/yaml' },
        { text: 'TOML', link: '/toml' },
        { text: 'Cmder', link: '/cmder' }
      ]
    },
    {
      text: '源码解析',
      collapsed: true,
      base: '/FrontEnd/source',
      items: [{ text: 'Axios', link: '/axios' }]
    },
    {
      text: '面试',
      collapsed: true,
      base: '/Interview',
      items: [
        {
          text: 'HTML',
          link: '/html'
        },
        {
          text: 'CSS',
          link: '/css'
        },
        {
          text: 'JavaScript',
          link: '/js'
        },
        {
          text: '浏览器',
          link: '/browser'
        },
        {
          text: 'Vue',
          link: '/vue'
        },
        { text: 'React', link: '/react' },
        { text: '微前端', link: '/microfrontend' },
        {
          text: '综合',
          link: '/synthesis'
        }
      ]
    },
    {
      text: '媒体',
      collapsed: true,
      base: '/Media',
      items: [
        {
          text: '英语',
          link: '/english'
        }
        /* {
          text: '电影',
          link: '/movie'
        },
        {
          text: '历史',
          link: '/history'
        } */
      ]
    }
  ]
}

export default defineConfig({
  /**
   * 站点元数据
   */
  title: 'Leopold-Sze Site',
  description: 'Leopold-Sze的小站',
  head: getHeadMetaConfig(),
  lang: 'zh-CN',
  base: '/',
  /**
   * 构建
   */
  srcDir: 'src',
  srcExclude: ['**/README.md', '**/TODO.md'],
  outDir: './dist',
  ignoreDeadLinks: true,
  metaChunk: true,
  /**
   * 主题
   */
  lastUpdated: true,
  /**
   * 自定义
   */
  markdown: {
    lineNumbers: true, // 启用代码行号
    container: {
      tipLabel: '提示',
      warningLabel: '注意',
      dangerLabel: '警告',
      infoLabel: '信息',
      detailsLabel: '详情'
    },
    image: {
      lazyLoading: true // 为所有图片启用懒加载
    }
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler' // 使用现代 Sass API，避免 legacy JS API 弃用警告
        }
      }
    }
  },
  vue: {},
  /**
   * 默认主题配置
   */
  themeConfig: {
    logo: {
      light: '/main.jpg',
      dark: '/main.jpg',
      alt: 'logo'
    },
    nav: getNavConfig(),
    sidebarMenuLabel: '目录',
    sidebar: getSidebar(),
    outline: {
      /**
       * 大纲标题
       */
      label: '本页目录',
      /**
       * 识别<h2>-<h4>的标题
       */
      level: [2, 5]
    },
    search: {
      provider: 'local'
    },
    darkModeSwitchLabel: '深色模式',
    darkModeSwitchTitle: '切换到深色模式',
    lightModeSwitchTitle: '切换到浅色模式',
    langMenuLabel: '切换语言',
    externalLinkIcon: true,
    socialLinks: [
      {
        icon: 'github',
        link: 'https://LeopoldSze.github.io/sze-blog',
        ariaLabel: 'GitHub'
      },
      {
        icon: {
          svg: wechatIcon
        },
        link: '/wx-qrcode.jpg'
      }
    ],
    lastUpdated: {
      text: '上次更新'
    },
    returnToTopLabel: '返回顶部',
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    footer: {
      message: '路虽弥，不行不至；事虽小，不为不成',
      copyright: `Copyright © 2019-present Leopold-Sze`
    },
    notFound: {
      title: '页面不见啦~',
      quote: '久等百里蒹葭，伊人入画',
      linkLabel: '回首页吧',
      linkText: '返回首页'
    }
  }
})
