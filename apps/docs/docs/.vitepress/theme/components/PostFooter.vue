<script setup lang="ts">
import type { BlogPost } from '../../../src/posts.data'
import { useRoute, withBase } from 'vitepress'
import { computed } from 'vue'
import * as postsModule from '../../../src/posts.data'

interface PostsDataModule { data: BlogPost[] }

const route = useRoute()
const isPost = computed(() => route.path.startsWith('/posts/'))
const posts = computed(() => (postsModule as unknown as PostsDataModule).data ?? [])

function normalizePath(p: string) {
  return p.replace(/\/$/, '')
}

const currentIndex = computed(() => {
  const current = normalizePath(route.path)
  return posts.value.findIndex(p => normalizePath(p.url) === current)
})

const prevPost = computed(() => {
  if (currentIndex.value <= 0)
    return null
  return posts.value[currentIndex.value - 1] ?? null
})

const nextPost = computed(() => {
  if (currentIndex.value < 0)
    return null
  return posts.value[currentIndex.value + 1] ?? null
})
</script>

<template>
  <footer v-if="isPost" class="PostFooter">
    <div class="PostFooter__nav">
      <a v-if="prevPost" class="PostFooter__card" :href="withBase(prevPost.url)">
        <div class="PostFooter__cardLabel">上一篇</div>
        <div class="PostFooter__cardTitle">{{ prevPost.title }}</div>
        <div v-if="prevPost.date" class="PostFooter__cardMeta">{{ prevPost.date }}</div>
      </a>
      <div v-else class="PostFooter__card PostFooter__card--empty">
        <div class="PostFooter__cardLabel">
          上一篇
        </div>
        <div class="PostFooter__cardTitle">
          没有了
        </div>
      </div>

      <a v-if="nextPost" class="PostFooter__card" :href="withBase(nextPost.url)">
        <div class="PostFooter__cardLabel">下一篇</div>
        <div class="PostFooter__cardTitle">{{ nextPost.title }}</div>
        <div v-if="nextPost.date" class="PostFooter__cardMeta">{{ nextPost.date }}</div>
      </a>
      <div v-else class="PostFooter__card PostFooter__card--empty">
        <div class="PostFooter__cardLabel">
          下一篇
        </div>
        <div class="PostFooter__cardTitle">
          没有了
        </div>
      </div>
    </div>

    <div class="PostFooter__bottom">
      <a class="PostFooter__back" :href="withBase('/blog/')">返回博客列表</a>
    </div>
  </footer>
</template>
