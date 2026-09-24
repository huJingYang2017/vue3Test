import { computed, ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import type { CartItem } from '@/types/cart'
import { delay } from '@/utils/delay'

/**
 * 和 Vuex 的 namespaced cart 模块做同一件事。
 * Pinia 里每个 defineStore 天然就是一个模块，不需要 namespaced 开关。
 */
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const totalQty = computed(() => items.value.reduce((sum, item) => sum + item.qty, 0))

  function push(item: CartItem) {
    const found = items.value.find((row) => row.id === item.id)
    if (found) found.qty += item.qty
    else items.value.push({ ...item })
  }

  async function pushLater(item: CartItem) {
    await delay(400)
    push(item)
  }

  function clear() {
    items.value = []
  }

  return { items, totalQty, push, pushLater, clear }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot))
}
