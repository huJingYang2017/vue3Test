<script setup lang="ts">
import {
  inject,
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onDeactivated,
  onMounted,
  onRenderTracked,
  onRenderTriggered,
  onUnmounted,
  onUpdated,
} from 'vue'
import { LifeLogKey } from './log'

defineOptions({ name: 'Probe' })

const props = defineProps<{
  label: string
  trace?: boolean
}>()

// inject 是 Vue 3 新增的组合式 API，用来注入依赖。
const logger = inject(LifeLogKey, null)

function push(hook: string) {
  logger?.push(props.label, hook)
}

// setup 本身就处在 beforeCreate 和 created 的位置，没有对应的 onXxx。
push('setup')
onBeforeMount(() => push('onBeforeMount'))
onMounted(() => push('onMounted'))
onBeforeUpdate(() => push('onBeforeUpdate'))
onUpdated(() => push('onUpdated'))
onBeforeUnmount(() => push('onBeforeUnmount'))
onUnmounted(() => push('onUnmounted'))
onActivated(() => push('onActivated'))
onDeactivated(() => push('onDeactivated'))

if (props.trace) {
  // onRenderTracked 和 onRenderTriggered 是开发环境下的调试钩子，用来回答两个问题：这次渲染读了哪些响应式数据，以及是哪一次写入让组件要重新渲染。生产构建里它们不会执行，也不能用来写业务逻辑。
  onRenderTracked((event) => push(`onRenderTracked ${String(event.key)}`))
  onRenderTriggered((event) => push(`onRenderTriggered ${String(event.key)}`))
}
</script>

<template>
  <section class="probe">
    <header>{{ label }}</header>
    <slot />
  </section>
</template>
