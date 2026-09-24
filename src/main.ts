import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { pinia } from './stores/pinia'
import { vuexKey, vuexStore } from './stores/vuex'
import { installLabPlugin } from './plugins/labPlugin'
import { vFocus } from './directives/vFocus'
import './styles/main.css'

/**
 * 一个应用可以同时 use 多个插件。
 * Pinia 和 Vuex 都是插件：内部调用 app.provide，所以组件里才能 useStore。
 * 插件要在 mount 之前安装。路由守卫如果要读 store，也要先 use pinia。
 */
const app = createApp(App)

installLabPlugin(app)
app.directive('focus', vFocus)
app.use(pinia)
app.use(vuexStore, vuexKey)
app.use(router)
app.mount('#app')
