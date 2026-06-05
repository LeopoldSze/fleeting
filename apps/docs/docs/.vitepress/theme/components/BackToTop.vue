<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const SCROLL_THRESHOLD = 400
const visible = ref(false)
let ticking = false

function handleScroll(): void {
  if (!ticking) {
    requestAnimationFrame(() => {
      visible.value = window.scrollY > SCROLL_THRESHOLD
      ticking = false
    })
    ticking = true
  }
}

function toTop(): void {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <Transition name="fade-scale">
    <a
      v-if="visible"
      class="totop"
      aria-label="回到顶部"
      @click.prevent="toTop"
    >
      <img
        src="../../../src/assets/toTop.svg"
        alt="回到顶部"
        class="totop__img"
        @dragstart.prevent
      >
    </a>
  </Transition>
</template>

<style scoped lang="scss">
.totop {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 100;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
  }
}

.totop__img {
  width: 48px;
  height: 48px;
  display: block;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.25s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.6);
}

@media (max-width: 768px) {
  .totop {
    bottom: 20px;
    right: 20px;
  }

  .totop__img {
    width: 40px;
    height: 40px;
  }
}
</style>
