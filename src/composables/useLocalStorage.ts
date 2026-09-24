import { ref, watch, type Ref } from 'vue'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/**
 * 一个会写回 localStorage 的 ref。
 * deep: true 是因为 T 可能是对象，只替换属性时也要保存。
 * 键名带上项目前缀，避免和别的页面抢同一个 key。
 */
export function useLocalStorage<T>(key: string, initial: T): Ref<T> {
  const data = ref(read(key, initial)) as Ref<T>

  watch(
    data,
    (value) => {
      localStorage.setItem(key, JSON.stringify(value))
    },
    { deep: true },
  )

  return data
}
