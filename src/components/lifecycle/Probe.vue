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
