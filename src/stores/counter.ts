import { computed, ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'

/**
 * Setup Store：第二个参数是 setup 函数，和组件的 script setup 同一套心智模型。
 * 必须把 state、getter、action 都 return 出去，Pinia 才能识别。
 * ref 会成为 state，computed 会成为 getter，函数会成为 action。
 * mutations被 $patch 取代，$patch 是批量更新状态的函数，可以接受一个对象或函数，对象是按字段合并，函数是拿到 state 自己改。
 * Setup store 没有内置 $reset，需要自己写 reset。
 */
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubled = computed(() => count.value * 2)

  function inc(step = 1) {
    count.value += step
  }

  function reset() {
    count.value = 0
  }

  return { count, doubled, inc, reset }
})

// 这是给 Pinia store 接上 Vite 的热更新，让你改 counter.ts 时页面不整页刷新，已有的 count 尽量还留着。- 仅开发环境使用
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounterStore, import.meta.hot))
}
