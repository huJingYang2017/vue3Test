import { ref } from 'vue'

/**
 * 开关类状态。next 不传时取反。
 * 从返回值里解构 state 仍然是 ref：解构丢掉响应式，发生在解构 reactive 对象时。
 */
export function useToggle(initial = false) {
  const state = ref(initial)

  function toggle(next?: boolean) {
    state.value = next ?? !state.value
  }

  return { state, toggle }
}
