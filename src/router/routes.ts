import type { RouteRecordRaw } from 'vue-router'
import { pushNav } from './nav-log'

export interface LabMeta {
  title: string
  group: string
  file: string
  summary: string
  nav?: string
}

//这里的 & 写在类型位置，表示交叉类型：一个值必须同时满足两边的类型。
export type LabRoute = RouteRecordRaw & { meta: LabMeta }

export const routes: LabRoute[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      title: '总览',
      group: '开始',
      file: 'src/views/HomeView.vue',
      summary: '先看地图：这套脚手架里每一页对应一块 Vue 3 能力，建议按侧栏从上往下读。',
    },
  },
  {
    path: '/cheatsheet',
    name: 'cheatsheet',
    component: () => import('@/views/CheatsheetView.vue'),
    meta: {
      title: '面试速查',
      group: '开始',
      file: 'src/views/CheatsheetView.vue',
      summary: '把响应式、生命周期、组件通信和状态管理收成可以检索的短答案。',
    },
  },
  {
    path: '/reactivity/ref',
    name: 'ref',
    component: () => import('@/views/reactivity/RefReactiveView.vue'),
    meta: {
      title: 'ref 与 reactive',
      group: '响应式',
      file: 'src/views/reactivity/RefReactiveView.vue',
      summary: '原始值放进 ref，对象放进 reactive，并看清模板在什么时候自动解包。',
    },
  },
  {
    path: '/reactivity/toref',
    name: 'toref',
    component: () => import('@/views/reactivity/ToRefView.vue'),
    meta: {
      title: 'toRef / toRefs',
      group: '响应式',
      file: 'src/views/reactivity/ToRefView.vue',
      summary: '从响应式对象上取出属性时，用 toRef 和 toRefs 保住和源对象的连接。',
    },
  },
  {
    path: '/reactivity/shallow',
    name: 'shallow',
    component: () => import('@/views/reactivity/ShallowView.vue'),
    meta: {
      title: 'shallow 家族',
      group: '响应式',
      file: 'src/views/reactivity/ShallowView.vue',
      summary: 'shallowRef 和 shallowReactive 只追踪第一层，适合大列表和整体替换的数据。',
    },
  },
  {
    path: '/reactivity/readonly',
    name: 'readonly',
    component: () => import('@/views/reactivity/ReadonlyView.vue'),
    meta: {
      title: 'readonly',
      group: '响应式',
      file: 'src/views/reactivity/ReadonlyView.vue',
      summary: 'readonly 给出深层只读视图，shallowReadonly 只锁住根上的属性。',
    },
  },
  {
    path: '/reactivity/watch',
    name: 'watch',
    component: () => import('@/views/reactivity/ComputedWatchView.vue'),
    meta: {
      title: 'computed 与 watch',
      group: '响应式',
      file: 'src/views/reactivity/ComputedWatchView.vue',
      summary: '派生数据用 computed，副作用用 watch。这一页覆盖缓存、flush、once、pause 和 deep。',
    },
  },
  {
    path: '/reactivity/advanced',
    name: 'advanced',
    component: () => import('@/views/reactivity/AdvancedReactiveView.vue'),
    meta: {
      title: '进阶响应式',
      group: '响应式',
      file: 'src/views/reactivity/AdvancedReactiveView.vue',
      summary: 'customRef、markRaw、toRaw、effectScope、toValue，以及一组 is 判断函数。',
    },
  },
  {
    path: '/lifecycle',
    name: 'lifecycle',
    component: () => import('@/views/lifecycle/LifecycleView.vue'),
    meta: {
      title: '生命周期',
      group: '生命周期',
      file: 'src/views/lifecycle/LifecycleView.vue',
      summary: '从 setup 到卸载、缓存激活和错误捕获，按真实调用顺序看钩子。',
    },
  },
  {
    path: '/composables',
    name: 'composables',
    component: () => import('@/views/hooks/ComposablesView.vue'),
    meta: {
      title: '组合式函数',
      group: '组合式函数',
      file: 'src/views/hooks/ComposablesView.vue',
      summary: '日常会写的 useToggle、useLocalStorage、useEventListener、useFetch 都在这里。',
    },
  },
  {
    path: '/state/pinia',
    name: 'pinia',
    component: () => import('@/views/state/PiniaView.vue'),
    meta: {
      title: 'Pinia',
      group: '状态管理',
      file: 'src/views/state/PiniaView.vue',
      summary: '官方推荐的 store：Setup 与 Options 两种写法、storeToRefs、插件和订阅。',
    },
  },
  {
    path: '/state/vuex',
    name: 'vuex',
    component: () => import('@/views/state/VuexView.vue'),
    meta: {
      title: 'Vuex',
      group: '状态管理',
      file: 'src/views/state/VuexView.vue',
      summary: 'state、getter、mutation、action，再加上一个带命名空间的购物车模块。',
    },
  },
  {
    path: '/state/compare',
    name: 'compare',
    component: () => import('@/views/state/CompareView.vue'),
    meta: {
      title: 'Pinia 与 Vuex',
      group: '状态管理',
      file: 'src/views/state/CompareView.vue',
      summary: '同一件计数和购物车需求，左右两边各做一遍，对照两边的概念。',
    },
  },
  {
    path: '/ecosystem/component',
    name: 'component',
    component: () => import('@/views/ecosystem/ComponentApiView.vue'),
    meta: {
      title: '组件通信',
      group: '生态链',
      file: 'src/views/ecosystem/ComponentApiView.vue',
      summary: 'props、emits、defineModel、插槽、provide / inject、defineExpose 和响应式 props 解构。',
    },
  },
  {
    path: '/ecosystem/router/:step?',
    name: 'router-guard',
    component: () => import('@/views/ecosystem/RouterGuardView.vue'),
    beforeEnter: (to) => {
      pushNav(`beforeEnter ${to.path}`)
    },
    meta: {
      title: '路由守卫',
      group: '生态链',
      file: 'src/views/ecosystem/RouterGuardView.vue',
      summary: '全局 beforeEach、beforeResolve、afterEach，以及组件内的离开确认和参数更新。',
      nav: '/ecosystem/router',
    },
  },
  {
    path: '/ecosystem/builtins',
    name: 'builtins',
    component: () => import('@/views/ecosystem/BuiltinsView.vue'),
    meta: {
      title: '内置组件',
      group: '生态链',
      file: 'src/views/ecosystem/BuiltinsView.vue',
      summary: 'Teleport、Suspense、KeepAlive、Transition，都是模板里直接可用的内置能力。',
    },
  },
  {
    path: '/ecosystem/directives',
    name: 'directives',
    component: () => import('@/views/ecosystem/DirectivesView.vue'),
    meta: {
      title: '指令与模板引用',
      group: '生态链',
      file: 'src/views/ecosystem/DirectivesView.vue',
      summary: '自定义指令的全部钩子、useTemplateRef 和 useId。',
    },
  },
]
