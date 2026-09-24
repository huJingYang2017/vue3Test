import { ref, type Ref } from 'vue'
import { createPinia, type PiniaPluginContext } from 'pinia'
import { pushLine, type LogLine } from '@/composables/useLog'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    appName: string
  }
}

/** 插件里记录的订阅轨迹，供 Pinia 页面直接展示。 */
export const piniaTrace: Ref<LogLine[]> = ref([])

/**
 * Pinia 插件签名是 (context) => 要合并进每个 store 的属性。
 * 这里做两件事：给所有 store 挂上 appName，并监听变更。
 * $subscribe 的回调发生在 mutation 之后，适合做日志和持久化。
 */
function tracePlugin({ store }: PiniaPluginContext) {
  store.$subscribe((mutation) => {
    pushLine(piniaTrace, `${store.$id} · ${mutation.type}`)
  })
}

function persistUserPlugin({ store }: PiniaPluginContext) {
  if (store.$id !== 'user') return
  const key = 'vue3-lab:user-name'
  const saved = localStorage.getItem(key)
  if (saved) {
    store.$patch((state) => {
      ;(state as { name: string }).name = saved
    })
  }
  store.$subscribe((_mutation, state) => {
    const name = (state as { name?: string }).name
    if (name) localStorage.setItem(key, name)
  })
}

export const pinia = createPinia()
pinia.use(() => ({ appName: 'Vue3 预习台' }))
pinia.use(tracePlugin)
pinia.use(persistUserPlugin)
