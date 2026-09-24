<script setup lang="ts">
import { useTemplateRef } from 'vue'

/**
 * script setup 的绑定默认是关闭的，父组件拿不到子组件里的变量。
 * defineExpose 显式打开一扇窗。父组件通过模板 ref 调用 focus。
 */
const input = useTemplateRef<HTMLInputElement>('input')

function focus() {
  input.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <input ref="input" class="text" type="text" placeholder="子组件输入框" />
</template>
