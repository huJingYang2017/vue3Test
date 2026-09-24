<script setup lang="ts">
/**
 * 选项式 API 里这是 props + $emit。
 * script setup 用 defineProps / defineEmits，它们是编译器宏，不用 import。
 * 元组写法 increment: [step: number] 表示事件载荷的类型。
 */
const props = withDefaults(
  defineProps<{
    count: number
    label?: string
  }>(),
  { label: '计数' },
)

const emit = defineEmits<{
  increment: [step: number]
}>()

function add() {
  emit('increment', 1)
}
</script>

<template>
  <div class="row">
    <strong>{{ props.label }}：{{ props.count }}</strong>
    <button type="button" @click="add">子组件 +1</button>
  </div>
</template>
