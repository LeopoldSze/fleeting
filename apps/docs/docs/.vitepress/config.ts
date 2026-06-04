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
    }
  ]
}

export default defineConfig({
  /**
   * 站点元数据
   */
  title: 'Leopold-Sze Blog',
  description: 'Leopold-Sze的博客网站',
  head: getHeadMetaConfig(),
  lang: 'zh-CN',
  base: '/',
  srcDir: 'src',
  srcExclude: ['**/README.md', '**/TODO.md'],
  outDir: './dist',
  ignoreDeadLinks: true,
  metaChunk: true,
  lastUpdated: true,
  markdown: {
    lineNumbers: true,
    container: {
      tipLabel: '提示',
      warningLabel: '注意',
      dangerLabel: '警告',
      infoLabel: '信息',
      detailsLabel: '详情'
    },
    image: {
      lazyLoading: true
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
      label: '本页目录',
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
