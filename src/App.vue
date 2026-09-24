<script setup lang="ts">
import { computed, getCurrentInstance, inject, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { labInfoKey } from '@/plugins/labPlugin'
import { routes } from '@/router/routes'

const route = useRoute()
const menuOpen = ref(false)
const appTitle = inject(labInfoKey, 'Vue3 预习台')
const version = getCurrentInstance()?.appContext.config.globalProperties.$labVersion

const groups = computed(() => {
  const order: string[] = []
  const map = new Map<string, typeof routes>()
  for (const item of routes) {
    const name = item.meta.group
    if (!map.has(name)) {
      map.set(name, [])
      order.push(name)
    }
    map.get(name)?.push(item)
  }
  return order.map((name) => ({ name, items: map.get(name) ?? [] }))
})

function isCurrent(path: string) {
  if (path === '/') return route.path === '/'
  const base = path.replace(/\/:[^/]+/g, '')
  return route.path === base || route.path.startsWith(`${base}/`)
}

watch(
  () => route.path,
  () => {
    menuOpen.value = false
  },
)
</script>

<template>
  <div class="shell">
    <header class="topbar">
      <button type="button" @click="menuOpen = !menuOpen">目录</button>
    </header>
    <aside class="sidebar" :class="{ open: menuOpen }">
      <div class="brand">
        <strong>{{ appTitle }}</strong>
        <span>Vue 3.5 · Vite 8 · Pinia 4 · Vuex 4</span>
      </div>
      <nav>
        <section v-for="group in groups" :key="group.name" class="nav-group">
          <p class="group-name">{{ group.name }}</p>
          <RouterLink
            v-for="item in group.items"
            :key="item.path"
            :to="item.meta.nav ?? item.path"
            :class="{ active: isCurrent(item.path) }"
          >
            {{ item.meta.title }}
          </RouterLink>
        </section>
      </nav>
    </aside>
    <main class="main">
      <RouterView />
      <p class="footer-note">插件写入的全局属性：{{ version }}。侧栏标题来自 provide。</p>
    </main>
  </div>
</template>
