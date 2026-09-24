<script setup lang="ts">
import { computed, ref, watch } from 'vue'

/**
 * Vue 3.5 默认开启响应式 props 解构。
 * 编译器会把 n 改写成对 props.n 的访问，所以默认值、computed 和 watch 都还能跟着变。
 * 这和「从 reactive 对象里解构出一个普通值」不是一回事。
 */
const { n = 0 } = defineProps<{ n?: number }>()

const doubled = computed(() => n * 2)
const seen = ref(n)

watch(
  () => n,
  (value) => {
    seen.value = value
  },
)
</script>

<template>
  <p>解构后的 n = {{ n }}，加倍 = {{ doubled }}，watch 记录 = {{ seen }}</p>
</template>
