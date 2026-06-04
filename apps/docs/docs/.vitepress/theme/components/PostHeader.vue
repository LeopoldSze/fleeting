<script setup lang="ts">
import { inBrowser, useData, useRoute, withBase } from 'vitepress'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

interface PostFrontmatter {
  title?: string
  description?: string
  date?: string | number | Date
  tags?: string[] | string
  pinned?: boolean
  cover?: string
}

const route = useRoute()
const { frontmatter, page } = useData()

const isPost = computed(() => route.path.startsWith('/posts/'))
const fm = computed(() => (frontmatter.value ?? {}) as PostFrontmatter)

function normalizeTags(tags: PostFrontmatter['tags']): string[] {
  if (!tags)
    return []
  if (Array.isArray(tags))
    return tags.map(v => String(v).trim()).filter(Boolean)
  return String(tags).split(',').map(v => v.trim()).filter(Boolean)
}

const title = computed(() => fm.value.title || page.value.title)
const description = computed(() => fm.value.description || page.value.description)
const tags = computed(() => normalizeTags(fm.value.tags))
const pinned = computed(() => Boolean(fm.value.pinned))
const cover = computed(() => fm.value.cover || '')
const date = computed(() => {
  const v = fm.value.date
  if (!v)
    return ''
  const d = v instanceof Date ? v : new Date(v)
  const ts = d.getTime()
  if (!Number.isFinite(ts))
    return ''
  return new Date(ts).toISOString().slice(0, 10)
})

const readingMinutes = ref<number | null>(null)
let readingTimer: number | undefined

function calcReadingMinutes() {
  if (!inBrowser)
    return
  const root = document.querySelector('.VPDoc .content') || document.querySelector('.VPDoc')
  const text = (root?.textContent ?? '').replace(/\s+/g, ' ').trim()
  if (!text) {
    readingMinutes.value = null
    return
  }

  const cjk = (text.match(/[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uFF00-\uFFEF]/g) ?? []).length
  const words = (text.match(/[a-z0-9]+/gi) ?? []).length
  const minutes = Math.ceil(cjk / 320 + words / 220)
  readingMinutes.value = Math.max(1, minutes)
}

onMounted(() => {
  if (!isPost.value)
    return
  readingTimer = window.setTimeout(calcReadingMinutes, 0)
})

onBeforeUnmount(() => {
  if (!inBrowser)
    return
  if (readingTimer != null)
    window.clearTimeout(readingTimer)
})
</script>

<template>
  <header v-if="isPost" class="PostHeader">
    <div class="PostHeader__top">
      <a class="PostHeader__back" :href="withBase('/blog/')">← 返回博客</a>
      <div class="PostHeader__meta">
        <span v-if="pinned" class="PostHeader__pill PostHeader__pill--pinned">置顶</span>
        <span v-if="date" class="PostHeader__kv">{{ date }}</span>
        <span v-if="readingMinutes" class="PostHeader__kv">{{ readingMinutes }} 分钟阅读</span>
      </div>
    </div>

    <div class="PostHeader__title">
      {{ title }}
    </div>

    <div v-if="description" class="PostHeader__desc">
      {{ description }}
    </div>

    <div v-if="tags.length" class="PostHeader__tags">
      <a v-for="t in tags" :key="t" class="PostHeader__tag" :href="withBase(`/blog/?tag=${encodeURIComponent(t)}`)">
        {{ t }}
      </a>
    </div>

    <div v-if="cover" class="PostHeader__cover">
      <img class="PostHeader__coverImg" :src="withBase(cover)" alt="">
    </div>
  </header>
</template>
