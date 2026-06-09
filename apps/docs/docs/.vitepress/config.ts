import type { DefaultTheme, HeadConfig } from 'vitepress'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { globbySync } from 'globby'
import matter from 'gray-matter'
import { defineConfig } from 'vitepress'

type NavItem = DefaultTheme.NavItem
type Sidebar = DefaultTheme.Sidebar
type SidebarItem = DefaultTheme.SidebarItem

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
        { text: 'JavaScript', link: '/front/function/js' },
        { text: 'CSS', link: '/front/function/css' }
      ]
    },
    { text: '核心方案', link: '/front/other/core' },
    { text: '常见问题', link: '/front/other/problem' },
    {
      text: '官方文档',
      items: [{ text: 'Vue', link: 'https://v3.cn.vuejs.org/guide/introduction.html' }]
    }
  ]
}

/**
 * sidebar配置
 */
interface DocFrontmatter {
  /**
   * 侧边栏显示标题。
   * - 未填写时，使用文件名（目录 index.md 默认显示为“概览”）
   */
  title?: string
  /**
   * 侧边栏排序，数字越小越靠前。
   * - 适合配合语雀同步：在语雀文档里写入 front matter 即可控制排序
   */
  order?: number
  /**
   * 是否出现在侧边栏（仅影响“侧边栏条目是否生成”）。
   * - `false` 会隐藏该页面条目，但页面仍可通过 URL 访问
   * - 适合用于：页面通过 nav/首页入口访问，但不希望在侧边栏出现
   */
  inSidebar?: boolean | 'false' | 'true'
  /**
   * VitePress 内置字段：是否渲染侧边栏组件。
   * - `false` 会让当前页面完全不显示侧边栏（即使当前分区还有其它条目）
   * - 如需“隐藏条目但仍显示侧边栏”，请使用 `inSidebar: false`
   */
  sidebar?: boolean | 'false' | 'true'
}

interface FileNode {
  kind: 'file'
  name: string
  title: string
  order: number
  link: string
}

interface DirNode {
  kind: 'dir'
  name: string
  children: Map<string, DirNode | FileNode>
}

/**
 * 顶层分类目录的显示名称映射。
 * - 例如：src/front/** 会被识别为一个分区，默认显示为“前端”
 * - 后续新增分类只需要在这里补一行即可，不需要改生成逻辑
 */
const CATEGORY_LABELS: Record<string, string> = {
  front: '前端',
  back: '后端',
  devops: '运维',
  interview: '面试',
  other: '其他',
  yuque: '语雀'
}

function formatDirLabel(key: string) {
  return key.replace(/[-_]+/g, ' ').trim() || key
}

function safeOrder(input: unknown, fallback: number) {
  return typeof input === 'number' && Number.isFinite(input) ? input : fallback
}

function isFalseLike(input: unknown) {
  if (input === false)
    return true
  if (typeof input === 'string')
    return input.trim().toLowerCase() === 'false'
  return input === 0
}

function formatSectionLabel(key: string) {
  return CATEGORY_LABELS[key] ?? formatDirLabel(key)
}

function linkFromSegments(segments: string[]) {
  const last = segments.at(-1) ?? ''
  if (last === 'index' && segments.length > 1)
    return `/${segments.slice(0, -1).join('/')}/`
  return `/${segments.join('/')}`
}

function readFrontmatter(absFile: string): DocFrontmatter {
  const raw = readFileSync(absFile, 'utf-8')
  const { data } = matter(raw)
  return (data ?? {}) as DocFrontmatter
}

const SIDEBAR_GLOB = ['**/*.md']
const SIDEBAR_IGNORE = [
  'assets/**',
  'public/**',
  '**/README.md',
  '**/TODO.md'
]

function buildDirTreeFromSrc(srcRoot: string) {
  const relFiles = globbySync(SIDEBAR_GLOB, {
    cwd: srcRoot,
    gitignore: true,
    ignore: SIDEBAR_IGNORE
  })

  const root: DirNode = { kind: 'dir', name: '', children: new Map() }

  for (const relFile of relFiles) {
    const relPosix = relFile.split(path.sep).join('/')
    if (relPosix === 'index.md' || relPosix === 'intro.md')
      continue

    const noExt = relPosix.replace(/\.md$/i, '')
    const segments = noExt.split('/').filter(Boolean)
    const top = segments[0]
    if (!top || top === 'assets' || top === 'public')
      continue

    const absFile = path.join(srcRoot, relFile)
    const fm = readFrontmatter(absFile)
    if (isFalseLike(fm.inSidebar) || isFalseLike(fm.sidebar))
      continue

    const basename = segments.at(-1) ?? ''
    const title = (fm.title ?? (basename === 'index' ? '概览' : basename)).toString().trim() || basename
    const order = safeOrder(fm.order, basename === 'index' ? -1 : Number.POSITIVE_INFINITY)
    const link = linkFromSegments(segments)

    let cursor: DirNode = root
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i] ?? ''
      const isLeaf = i === segments.length - 1
      if (isLeaf) {
        cursor.children.set(seg, { kind: 'file', name: seg, title, order, link })
        continue
      }

      const existing = cursor.children.get(seg)
      if (existing && existing.kind === 'dir') {
        cursor = existing
        continue
      }

      const created: DirNode = { kind: 'dir', name: seg, children: new Map() }
      cursor.children.set(seg, created)
      cursor = created
    }
  }

  return root
}

function sortSidebarNodes(nodes: Array<DirNode | FileNode>) {
  return nodes.sort((a, b) => {
    if (a.kind !== b.kind)
      return a.kind === 'dir' ? -1 : 1

    if (a.kind === 'file' && b.kind === 'file') {
      if (a.order !== b.order)
        return a.order - b.order
      return a.title.localeCompare(b.title, 'zh-CN')
    }

    const ad = a as DirNode
    const bd = b as DirNode
    return ad.name.localeCompare(bd.name, 'zh-CN')
  })
}

function dirToSidebarItems(dir: DirNode, depth: number): SidebarItem[] {
  const children = sortSidebarNodes(Array.from(dir.children.values()))

  return children.map((child) => {
    if (child.kind === 'file') {
      return {
        text: child.title,
        link: child.link
      }
    }

    return {
      text: formatDirLabel(child.name),
      collapsed: depth >= 2,
      items: dirToSidebarItems(child, depth + 1)
    }
  })
}

function getSidebar(): Sidebar {
  /**
   * VitePress 的 srcDir 是 `src`，这里用绝对路径扫描源文件，以便构建阶段稳定运行。
   * - __dirname: apps/docs/docs/.vitepress
   */
  const srcRoot = path.resolve(__dirname, '..', 'src')
  const tree = buildDirTreeFromSrc(srcRoot)

  /**
   * 侧边栏使用 Multi Sidebar：
   * - key 是路径前缀，例如 `/front/`
   * - value 是该路径下的侧边栏分组数组
   */
  const sidebar: DefaultTheme.SidebarMulti = {}

  for (const [key, node] of tree.children) {
    if (node.kind !== 'dir')
      continue

    const items = dirToSidebarItems(node, 1)
    if (!items.length)
      continue

    const sectionLabel = formatSectionLabel(key)
    const prefix = `/${key}/`
    sidebar[prefix] = [
      {
        text: sectionLabel,
        collapsed: false,
        items
      }
    ]
  }

  return sidebar
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
  cleanUrls: true,
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
        link: 'https://github.com/LeopoldSze/fleeting',
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
      title: '页面不见了',
      quote: '页面不存在，或已被删除',
      linkText: '返回首页'
    }
  }
})
