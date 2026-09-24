import { customRef } from 'vue'

/**
 * customRef 把 get / set 交给你。
 * track() 告诉 Vue「这次读取要建立依赖」，trigger() 告诉 Vue「值变了，请更新视图」。
 * 这里把 trigger 推迟到停止输入之后，输入框因此不会每个键都刷新下游。
 */
export function useDebouncedRef<T>(value: T, delayMs = 400) {
  let current = value
  let timer: ReturnType<typeof setTimeout> | undefined

  return customRef<T>((track, trigger) => ({
    get() {
      track()
      return current
    },
    set(next) {
      current = next
      window.clearTimeout(timer)
      // 值马上记住，通知稍后再发。输入框因此不会被旧值盖回去。
      timer = window.setTimeout(() => trigger(), delayMs)
    },
  }))
}
