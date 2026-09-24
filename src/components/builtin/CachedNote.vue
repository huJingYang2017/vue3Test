<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'CachedNote' })

/** 文字放在组件内部。KeepAlive 缓存的是这个实例，而不是父组件上的变量。 */
const text = ref('')
</script>

<template>
  <label class="field">
    <span>缓存中的输入</span>
    <input v-model="text" type="text" />
  </label>
</template>
