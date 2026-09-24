import type { App, InjectionKey } from 'vue'

/**
 * provide / inject 用唯一的 key，避免字符串撞名。
 * InjectionKey 把注入值的类型绑在这个 Symbol 上。
 */
export const labInfoKey: InjectionKey<string> = Symbol('lab-info')

declare module 'vue' {
  interface ComponentCustomProperties {
    /** 旧式全局属性。script setup 里没有 this，新代码优先用 provide。 */
    $labVersion: string
  }
}

export function installLabPlugin(app: App) {
  app.provide(labInfoKey, import.meta.env.VITE_APP_TITLE)
  app.config.globalProperties.$labVersion = 'Vue 3.5 · Pinia 4 · Vuex 4 · Router 5'

  // 未被组件接住的错误会到这里。组件里 onErrorCaptured 返回 false 时，错误不再继续上传。
  app.config.errorHandler = (err, instance, info) => {
    const name = instance?.$options.name ?? '匿名组件'
    console.error('[lab errorHandler]', info, name, err)
  }
}
