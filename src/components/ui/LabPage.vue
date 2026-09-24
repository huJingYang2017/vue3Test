<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const openError = ref('')

async function openSource() {
  const file = route.meta.file
  if (!file) return
  openError.value = ''
  try {
    const res = await fetch(`/__open-in-editor?file=${encodeURIComponent(file)}`)
    if (!res.ok) openError.value = '打不开这个文件'
  } catch {
    openError.value = '只有 npm run dev 时才能打开源文件'
  }
}
</script>

<template>
  <article class="lab">
    <header class="lab-head">
      <p class="eyebrow">
        <button type="button" class="file-link" title="在编辑器中打开这个文件" @click="openSource">
          {{ route.meta.group }} · {{ route.meta.file }}
        </button>
      </p>
      <p v-if="openError" class="hint">{{ openError }}</p>
      <h1>{{ route.meta.title }}</h1>
      <p class="summary">{{ route.meta.summary }}</p>
    </header>
    <slot />
  </article>
</template>
