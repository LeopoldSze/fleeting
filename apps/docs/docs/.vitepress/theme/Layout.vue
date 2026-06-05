<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { nextTick, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import BackToTop from './components/BackToTop.vue'
import HomeLatest from './components/HomeLatest.vue'
import PostFooter from './components/PostFooter.vue'
import PostHeader from './components/PostHeader.vue'

// 获取深色模式状态
const { isDark } = useData()

// 随机名言相关
const randomQuote = ref('加载中...')
let refreshTimer: number | null = null

/**
 * 从 一言 接口获取数据
 *
 * 接口说明：
 * - 地址：https://v1.hitokoto.cn/
 * - 作用：随机返回一句动漫、游戏、文学等类型的名言
 * - 返回字段：hitokoto (句子内容), from (出处), from_who (作者) 等
 */
async function fetchQuote() {
  try {
    const response = await fetch('https://v1.hitokoto.cn/')
    // 检查网络请求是否成功
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    // 组合句子和出处，让显示更完整
    // data.hitokoto: 句子内容, data.from: 出处
    randomQuote.value = `✨ ${data.hitokoto} —— 「${data.from || '未知出处'}」`
  }
  catch (error) {
    // 请求失败时，显示一个备用的友好提示，避免页面空白
    console.error('获取一言失败:', error)
    randomQuote.value = '✨ 代码是思想的具现，逻辑是智慧的延伸 —— 「佚名」'
  }
}

/**
 * 手动刷新名言
 */
function refreshQuote() {
  fetchQuote()
}

onMounted(() => {
  fetchQuote()
  // 设置定时器，每隔 60 秒自动刷新一次名言，增加页面的活跃感
  refreshTimer = window.setInterval(() => {
    fetchQuote()
  }, 60000)
})

// 组件销毁前清理定时器，防止内存泄漏
onBeforeUnmount(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
})

// 深色模式切换动画
function enableTransitions() {
  return 'startViewTransition' in document
    && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
}

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`
  ]

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: 'ease-in',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`
    }
  )
})
</script>

<template>
  <div class="TopBanner" aria-hidden="true" />
  <DefaultTheme.Layout>
    <!-- 首页 Hero 区域下方添加随机名言 -->
    <template #home-hero-after>
      <div class="random-quote" @click="refreshQuote">
        {{ randomQuote }}
        <span class="refresh-icon" style="margin-left: 8px; font-size: 14px; opacity: 0.6;">↻</span>
      </div>
    </template>

    <!-- 首页特性区域下方添加最新文章列表 -->
    <template #home-features-after>
      <HomeLatest />
    </template>

    <!-- 文档内容前添加文章头部信息 -->
    <template #doc-before>
      <PostHeader />
    </template>

    <!-- 文档内容后添加文章底部导航 -->
    <template #doc-after>
      <PostFooter />
    </template>
  </DefaultTheme.Layout>
  <BackToTop />
</template>
