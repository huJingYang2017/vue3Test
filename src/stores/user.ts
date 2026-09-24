import { acceptHMRUpdate, defineStore } from 'pinia'

export type UserRole = 'guest' | 'admin'

/**
 * Options Store：和 Vuex 的 state / getters / actions 外形接近。
 * 差别是没有 mutations，action 里直接改 this.xxx。
 * state 必须是函数，保证每个应用实例拿到独立的初始数据。
 * Options store 自带 $reset，会回到 state() 的返回值。
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    name: '学员',
    role: 'guest' as UserRole,
  }),
  getters: {
    label: (state) => `${state.name}（${state.role}）`,
  },
  actions: {
    rename(name: string) {
      this.name = name.trim() || '学员'
    },
    login() {
      this.role = 'admin'
    },
    logout() {
      this.role = 'guest'
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
