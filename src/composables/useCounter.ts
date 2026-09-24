import { computed, ref } from 'vue'

/** 最小的计数组合式函数。组件里可以同时调用多次，每次都有自己的状态。 */
export function useCounter(initial = 0) {
  const count = ref(initial)
  const doubled = computed(() => count.value * 2)

  function inc(step = 1) {
    count.value += step
  }

  function reset() {
    count.value = initial
  }

  return { count, doubled, inc, reset }
}
