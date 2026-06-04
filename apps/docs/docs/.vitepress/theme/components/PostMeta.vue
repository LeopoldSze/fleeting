<script setup lang="ts">
import { useData, useRoute, withBase } from 'vitepress'
import { computed } from 'vue'

interface PostFrontmatter {
  title?: string
  date?: string | number | Date
  tags?: string[] | string
  pinned?: boolean
}

const route = useRoute()
const { frontmatter } = useData()

const isPost = computed(() => route.path.startsWith('/posts/'))

function normalizeTags(tags: PostFrontmatter['tags']): string[] {
  if (!tags)
    return []
  if (Array.isArray(tags))
    return tags.map(v => String(v).trim()).filter(Boolean)
  return String(tags).split(',').map(v => v.trim()).filter(Boolean)
}

const fm = computed(() => (frontmatter.value ?? {}) as PostFrontmatter)
const tags = computed(() => normalizeTags(fm.value.tags))
const pinned = computed(() => Boolean(fm.value.pinned))
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
</script>

<template>
  <div v-if="isPost" class="PostMeta">
    <div class="PostMeta__row">
      <span v-if="pinned" class="PostMeta__pill PostMeta__pill--pinned">置顶</span>
      <span v-if="date" class="PostMeta__date">{{ date }}</span>
    </div>

    <div v-if="tags.length" class="PostMeta__tags">
      <a v-for="t in tags" :key="t" class="PostMeta__tag" :href="withBase(`/tags/#tag-${encodeURIComponent(t)}`)">
        {{ t }}
      </a>
    </div>
  </div>
</template>
