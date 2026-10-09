<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { routes } from '@/router/routes'

const title = import.meta.env.VITE_APP_TITLE
const mode = import.meta.env.MODE
const apiBase = import.meta.env.VITE_API_BASE

const stack = [
  ['Vue 3.5', '组合式 API、响应式 props 解构、useTemplateRef、useId'],
  ['Vite 8', '开发服务器、环境变量、路径别名，生产构建交给 Rolldown'],
  ['Pinia 4', '当前官方状态库，Setup Store 和 Options Store 都能用'],
  ['Vuex 4', '保留 mutation 和命名空间，用来对照面试里的旧方案'],
  ['Vue Router 5', '懒加载、meta、全局守卫和组件内守卫'],
  ['TypeScript 6', '给 props、store 和组合式函数加上类型'],
]
</script>

<template>
  <article class="hero">
    <p class="eyebrow">从运行中的例子读 Vue 3</p>
    <h1>{{ title }}</h1>
    <p class="lead">当前模式 <code>{{ mode }}</code>，接口地址 <code>{{ apiBase }}</code>。</p>
    <p class="lead">
      侧栏每一页都是一块可以点击的样例，详细说明写在对应的 <code>&lt;script setup&gt;</code> 里。
      每个演示标题下有一行「用来干什么」，写的是这个特性在真实项目里解决什么问题。
      建议先看响应式，再看生命周期和组合式函数，最后把 Pinia、Vuex、路由和内置组件串起来。
    </p>
    <section class="stack">
      <article v-for="item in stack" :key="item[0]">
        <strong>{{ item[0] }}</strong>
        <span>{{ item[1] }}</span>
      </article>
    </section>
    <h2>目录怎么读</h2>
    <div class="link-list">
      <RouterLink v-for="item in routes" :key="item.path" :to="item.meta.nav ?? item.path">
        <strong>{{ item.meta.group }} · {{ item.meta.title }}</strong>
        <span>{{ item.meta.summary }}</span>
      </RouterLink>
    </div>
    <section class="panel">
      <h2>这套脚手架里的新写法</h2>
      <ul>
        <li><code>useTemplateRef</code> / <code>useId</code>：Vue 3.5 的模板引用和稳定 id。</li>
        <li><code>onWatcherCleanup</code>：在 watch 里登记清理，适合取消请求。</li>
        <li>响应式 props 解构：<code>const { n = 0 } = defineProps()</code> 仍然是响应式的。</li>
        <li><code>watch</code> 的返回值可以 <code>pause</code> / <code>resume</code>，<code>deep</code> 可以写成数字。</li>
        <li><code>&lt;Teleport to="body"&gt;</code> 把节点挪出父级；<code>defer</code> 只在目标节点渲染得更晚时才需要。</li>
        <li><code>defineModel</code>：组件 v-model 的日常写法。</li>
      </ul>
    </section>
  </article>
</template>
