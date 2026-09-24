import { ref, type Ref } from 'vue'

export interface LogLine {
  id: number
  text: string
}

let seed = 0

/** 往日志 ref 头部插入一行，并丢掉超出上限的旧记录。 */
export function pushLine(lines: Ref<LogLine[]>, text: string, limit = 10) {
  lines.value = [{ id: ++seed, text }, ...lines.value].slice(0, limit)
}

/**
 * 页面里的操作日志。
 * 组合式函数就是普通函数：在 setup 里调用，返回 ref，模板会自动解包。
 */
export function useLog(limit = 10) {
  const lines = ref<LogLine[]>([])

  function push(text: string) {
    pushLine(lines, text, limit)
  }

  function clear() {
    lines.value = []
  }

  return { lines, push, clear }
}
