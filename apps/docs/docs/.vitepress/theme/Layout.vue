<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { nextTick, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import HomeLatest from './components/HomeLatest.vue'
import PostFooter from './components/PostFooter.vue'
import PostHeader from './components/PostHeader.vue'

const { isDark } = useData()
const randomQuote = ref('')

const quotes = [
  '探索未知的形状，发现无限的可能',
  '代码是思想的具现，逻辑是智慧的延伸',
  '每一次学习都是对世界的重新认识',
  '技术改变生活，创新引领未来',
  '在知识的海洋中，我们都是探索者',
  '简单是复杂的极致，优雅是功能的升华',
  '编程不仅是技能，更是创造的艺术',
  '持续学习，持续进步，持续创造',
  '细节决定成败，思考决定高度',
  '用代码书写未来，用技术改变世界'
]

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)]
}

function updateQuote() {
  randomQuote.value = getRandomQuote() ?? ''
}

let quoteTimer: number | undefined

onMounted(() => {
  updateQuote()
  quoteTimer = window.setInterval(updateQuote, 30000)
})

onBeforeUnmount(() => {
  if (quoteTimer) {
    window.clearInterval(quoteTimer)
    quoteTimer = undefined
  }
})

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
    <template #home-hero-after>
      <div class="random-quote" @click="updateQuote">
        {{ randomQuote }}
      </div>
    </template>

    <template #home-features-after>
      <HomeLatest />
    </template>
    <template #doc-before>
      <PostHeader />
    </template>
    <template #doc-after>
      <PostFooter />
    </template>
  </DefaultTheme.Layout>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}
</style>
