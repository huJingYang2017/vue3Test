import { computed, ref, type InjectionKey } from 'vue'
import {
  createStore,
  useStore,
  type ActionContext,
  type Module,
  type Store,
} from 'vuex'
import { pushLine, type LogLine } from '@/composables/useLog'
import type { CartItem } from '@/types/cart'
import { delay } from '@/utils/delay'

export interface CountState {
  count: number
}

export interface CartState {
  items: CartItem[]
}

/** 模块注册之后，运行时的根状态才会带上 cart。 */
export interface RootState extends CountState {
  cart: CartState
}

/**
 * 组件里 useStore(key) 才能拿到带类型的 store。
 * app.use(store, key) 时要把同一个 key 传进去。
 */
export const vuexKey: InjectionKey<Store<RootState>> = Symbol('vuex')

export const vuexTrace = ref<LogLine[]>([])

const cart: Module<CartState, CountState> = {
  namespaced: true,
  state: () => ({ items: [] }),
  getters: {
    totalQty(state) {
      return state.items.reduce((sum, item) => sum + item.qty, 0)
    },
  },
  mutations: {
    push(state, item: CartItem) {
      const found = state.items.find((row) => row.id === item.id)
      if (found) found.qty += item.qty
      else state.items.push({ ...item })
    },
    clear(state) {
      state.items = []
    },
  },
  actions: {
    async pushLater({ commit }: ActionContext<CartState, CountState>, item: CartItem) {
      await delay(400)
      commit('push', item)
    },
  },
}

/**
 * Vuex 4 仍然是 Vue 3 可用的旧状态库。
 * 同步改数据走 commit(mutation)，异步走 dispatch(action)，action 里再 commit。
 * strict 只建议在开发环境打开：它会深度监听整棵状态树，发现 mutation 之外的修改就抛错。
 * 模块挂上之后运行时才有 state.cart，因此这里把创建结果断言成 Store<RootState>。
 */
export const vuexStore = createStore({
  strict: import.meta.env.DEV,
  state: () => ({
    count: 0,
  }),
  getters: {
    doubled: (state): number => state.count * 2,
  },
  mutations: {
    inc(state, step: number) {
      state.count += step
    },
    reset(state) {
      state.count = 0
    },
  },
  actions: {
    async incLater({ commit }, step: number) {
      await delay(300)
      commit('inc', step)
    },
  },
  modules: { cart },
  plugins: [
    (store) => {
      store.subscribe((mutation, state) => {
        pushLine(vuexTrace, `${mutation.type} · count=${state.count}`)
      })
    },
  ],
}) as Store<RootState>

export function useVuexStore() {
  return useStore(vuexKey)
}

export function useVuexCart() {
  const store = useVuexStore()
  const items = computed(() => store.state.cart.items)
  const totalQty = computed(() => store.getters['cart/totalQty'] as number)

  function push(item: CartItem) {
    store.commit('cart/push', item)
  }

  function pushLater(item: CartItem) {
    return store.dispatch('cart/pushLater', item) as Promise<void>
  }

  function clear() {
    store.commit('cart/clear')
  }

  return { items, totalQty, push, pushLater, clear }
}
