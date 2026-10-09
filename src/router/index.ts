import { createRouter, createWebHistory } from 'vue-router'
import { pushNav } from './nav-log'
import { routes } from './routes'

/**
 * Vue Router 5 对「手写 routes」没有破坏性变化，并收编了基于文件的路由插件。
 * 本项目用手写路由，是为了把 meta、懒加载和 beforeEnter 显式放在 routes.ts 里。
 */
export const router = createRouter({
  history: createWebHistory(),
  routes: [...routes, { path: '/:pathMatch(.*)*', redirect: '/' }],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  document.title = `${to.meta.title ?? '预习台'} · ${import.meta.env.VITE_APP_TITLE}`
  pushNav(`beforeEach → ${to.path}`)
})

router.beforeResolve((to) => {
  pushNav(`beforeResolve → ${to.path}`)
})

router.afterEach((to) => {
  pushNav(`afterEach → ${to.path}`)
})
