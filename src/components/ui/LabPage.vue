<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <article class="lab">
    <header class="lab-head">
      <p class="eyebrow">{{ route.meta.group }} · {{ route.meta.file }}</p>
      <h1>{{ route.meta.title }}</h1>
      <p class="summary">{{ route.meta.summary }}</p>
    </header>
    <slot />
  </article>
</template>
