<script setup lang="ts">
import { inject } from 'vue'
import { ThemeKey } from './theme'

/** inject 拿到的是父级 provide 的那个 ref，改父级的值，这里会一起更新。 */
const theme = inject(ThemeKey, null)
</script>

<template>
  <p v-if="theme" class="pill">注入到子组件的主题：{{ theme }}</p>
  <p v-else class="empty">这一层没有 provide 主题</p>
</template>
