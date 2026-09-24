<script setup lang="ts">
defineProps<{
  title: string
  hint?: string
}>()
</script>

<template>
  <section class="demo">
    <header class="demo-head">
      <h2>{{ title }}</h2>
      <p v-if="hint" class="hint">{{ hint }}</p>
    </header>
    <div class="demo-body">
      <slot />
    </div>
  </section>
</template>
