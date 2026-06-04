<script setup lang="ts">
import type { BlogPost } from '../../../src/posts.data'
import { useRoute, withBase } from 'vitepress'
import { computed } from 'vue'
import * as postsModule from '../../../src/posts.data'

interface PostsDataModule { data: BlogPost[] }

const route = useRoute()
const isHome = computed(() => route.path === '/')

const posts = computed(() => (postsModule as unknown as PostsDataModule).data ?? [])
const latest = computed(() => posts.value.slice(0, 4)) // 只显示4篇最新文章
</script>

<template>
  <div v-if="isHome" class="HomeLatest">
    <section class="HomeLatest__panel">
      <div class="HomeLatest__head">
        <div class="HomeLatest__title">
          最新更新
        </div>
        <a class="HomeLatest__more" :href="withBase('/blog/')">查看更多</a>
      </div>

      <div v-if="!latest.length" class="HomeLatest__empty">
        还没有文章
      </div>

      <div v-else class="HomeLatest__cards">
        <a v-for="p in latest" :key="p.url" class="HomeLatest__card" :href="withBase(p.url)">
          <div class="HomeLatest__cardTitle">{{ p.title }}</div>
          <div class="HomeLatest__cardMeta">
            <span v-if="p.pinned" class="HomeLatest__pill">置顶</span>
            <span v-if="p.date" class="HomeLatest__date">{{ p.date }}</span>
          </div>
          <div v-if="p.description" class="HomeLatest__desc">{{ p.description }}</div>
        </a>
      </div>
    </section>
  </div>
</template>
