import type { Directive } from 'vue'

const listeners = new WeakMap<HTMLElement, (event: MouseEvent) => void>()

/**
 * 点击元素外部时调用绑定的函数。
 * 用 WeakMap 记住监听器，卸载时能精确移除，也不用往 DOM 上挂自定义字段。
 * 全局 click 一定要在 unmounted 里摘掉，否则会泄漏。
 */
export const vClickOutside: Directive<HTMLElement, () => void> = {
  mounted(el, binding) {
    const listener = (event: MouseEvent) => {
      const target = event.target
      if (target instanceof Node && el.contains(target)) return
      binding.value()
    }
    listeners.set(el, listener)
    document.addEventListener('click', listener)
  },
  unmounted(el) {
    const listener = listeners.get(el)
    if (!listener) return
    document.removeEventListener('click', listener)
    listeners.delete(el)
  },
}
