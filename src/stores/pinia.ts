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
 */
function tracePlugin({ store }: PiniaPluginContext) {
  /**
   * store.$subscribe(callback, options?)：state 已经改完之后调用 callback。
   * 返回值是取消订阅的函数。在组件 setup 里调用时，组件卸载会自动取消；
   * 插件里没有组件，这条订阅会跟着 Pinia 实例一直在。
   * 它看的是状态变化，不看 action 有没有被调用。$patch 不进 $onAction，但会进这里。
   *
   * callback(mutation, state)
   * - mutation.type：这次变更从哪条路进来。
   *   - 'direct'：直接改 state。例如 this.name = 'x'、count.value++、store.$state.count = 1、list.push()。
   *   - 'patch object'：store.$patch({ count: 1 }) 这种传入对象。一次 $patch 只触发一次订阅。
   *   - 'patch function'：store.$patch(state => { ... }) 这种传入函数。函数必须同步。
   * - mutation.storeId：发生变更的 store id，和 store.$id 相同。
   * - mutation.payload：只有 type 为 'patch object' 时才有，就是传给 $patch 的那个对象。
   *   另外两种 type 上没有 payload，直接读会得到类型错误。
   * - mutation.events：开发环境才有，来自 Vue 的调试事件，用来看具体改了哪个字段。生产环境不要依赖它。
   * - state：变更之后的整份 state。适合整份持久化，不要在回调里再改它，否则会再次触发订阅。
   *
   * options 是 Vue watch 的选项，再加一个 detached。内部已经按 deep: true 监听。
   * - detached：true 时不跟组件一起卸载。组件里想在离开页面后继续听，要传 true。插件里不需要。
   * - flush：'pre' | 'sync' | 'post'。默认 'pre'，回调在组件渲染前。
   *   'sync' 在每次直接改完立刻跑；'post' 在组件更新 DOM 之后跑。
   *   这个选项不影响 $patch，对象和函数形式的 $patch 都会同步触发订阅。
   * - immediate：true 时订阅建立后立刻用当前 state 跑一次。
   * - once：true 时只跑第一次变更，然后自动取消。
   * - onTrack / onTrigger：Vue 调试用，依赖被追踪或被触发时调用。
   */
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
  /**
   * 第二个参数 state 是变更后的整份用户 state。
   * 这里不看 mutation：无论 rename 直接赋值，还是 $reset、$patch，只要 name 变了就写入 localStorage。
   */
  store.$subscribe((_mutation, state) => {
    const name = (state as { name?: string }).name
    if (name) localStorage.setItem(key, name)
  })
}

export const pinia = createPinia()
pinia.use(() => ({ appName: 'Vue3 预习台' }))
pinia.use(tracePlugin)
pinia.use(persistUserPlugin)
