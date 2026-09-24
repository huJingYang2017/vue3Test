import { ref, shallowRef, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { onWatcherCleanup } from 'vue'

export interface FetchState<T> {
  data: T | null
  error: string | null
  loading: boolean
}

/**
 * 监听 url，变化时发请求。
 * onWatcherCleanup 是 Vue 3.5 的写法，作用和 watch 回调第三个参数 onCleanup 一样：
 * 在监听器下一次执行前、或停止时，取消上一次请求。
 * 它必须在 await 之前同步调用，这时当前 watcher 还处于激活状态。
 * data 用 shallowRef：接口返回的 JSON 通常整体替换，不需要深层代理。
 */
export function useFetch<T>(url: MaybeRefOrGetter<string | null>) {
  const data = shallowRef<T | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)
  const requestId = ref(0)

  async function run(current: string, controller: AbortController) {
    loading.value = true
    try {
      const response = await fetch(current, { signal: controller.signal })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      data.value = (await response.json()) as T
      error.value = null
    } catch (err) {
      if (controller.signal.aborted) return
      data.value = null
      error.value = err instanceof Error ? err.message : '请求失败'
    } finally {
      if (!controller.signal.aborted) loading.value = false
    }
  }

  watch(
    [() => toValue(url), requestId],
    () => {
      const current = toValue(url)
      if (!current) return
      const controller = new AbortController()
      onWatcherCleanup(() => controller.abort())
      void run(current, controller)
    },
    { immediate: true },
  )

  function execute() {
    requestId.value += 1
  }

  return { data, error, loading, execute }
}
