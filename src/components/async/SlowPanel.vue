<script setup lang="ts">
defineOptions({ name: 'SlowPanel' })

/**
 * script setup 里的顶层 await 会让这个组件变成异步组件。
 * 父级用 Suspense 包住它，等待期间显示 fallback。
 */
const waitMs = 3000
await new Promise<void>((resolve) => {
  window.setTimeout(resolve, waitMs)
})
</script>

<template>
  <p class="ok">SlowPanel 的 setup 已经结束，它在渲染前等待了 {{ waitMs }} ms。</p>
</template>
