<script setup lang="ts">
import type { LogLine } from '@/composables/useLog'

defineProps<{
  lines: LogLine[]
}>()
</script>

<template>
  <ol v-if="lines.length" class="log">
    <li v-for="line in lines" :key="line.id">{{ line.text }}</li>
  </ol>
  <p v-else class="empty">还没有记录</p>
</template>
