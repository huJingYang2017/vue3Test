import { toValue, watchEffect, type MaybeRefOrGetter } from 'vue'

/**
 * 给一个可能稍后才出现的目标绑事件，并在目标变化或作用域停止时解绑。
 * MaybeRefOrGetter 是 Vue 3.3 起组合式函数的常见入参：普通值、ref 或 getter 都可以。
 * watchEffect 的 onCleanup 会在下一次执行前、以及作用域销毁时调用。
 */
export function useEventListener(
  target: MaybeRefOrGetter<EventTarget | null | undefined>,
  type: string,
  listener: (event: Event) => void,
  options?: AddEventListenerOptions,
) {
  watchEffect((onCleanup) => {
    const el = toValue(target)
    if (!el) return
    el.addEventListener(type, listener, options)
    onCleanup(() => el.removeEventListener(type, listener, options))
  })
}
