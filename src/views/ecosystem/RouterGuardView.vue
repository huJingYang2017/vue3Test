<script setup lang="ts">
import { computed, ref } from 'vue'
// import { Modal } from 'ant-design-vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate, RouterLink, useRoute } from 'vue-router'
import DemoBlock from '@/components/ui/DemoBlock.vue'
import LabPage from '@/components/ui/LabPage.vue'
import { useLog } from '@/composables/useLog'
import { navLog } from '@/router/nav-log'

/**
 * 全局守卫写在 src/router/index.ts。
 * 一次从别的页面进入这里，日志里会先出现 beforeEach，然后是路由上的 beforeEnter，
 * 再是 beforeResolve 和 afterEach。组件此时才 setup。
 * 同一条路由记录只更换 params 时，组件会复用，所以走 onBeforeRouteUpdate，不会重新 mounted。
 * 没有 onBeforeRouteEnter：进入之前组件实例还不存在。
 */
const route = useRoute()
const step = computed(() => (route.params.step ? String(route.params.step) : '空'))
const dirty = ref(false)
const { lines, push } = useLog(8)

onBeforeRouteUpdate((to) => {
  push(`onBeforeRouteUpdate → ${String(to.params.step ?? '空')}`)
})

onBeforeRouteLeave(() => {
  if (!dirty.value) return true

  // return new Promise((resolve,reject) => {
  //   // resolve(false)
  //   reject(new Error('笔记还没保存，离开这一页吗？'))

  // //   Modal.confirm({
  // //     title: '笔记还没保存，离开这一页吗？',
  // //     content: '笔记还没保存，离开这一页吗？',
  // //     onOk: () => {
  // //       resolve(true)
  // //     },
  // //     onCancel: () => {
  // //       resolve(false)
  // //     },
  // //   // resolve(window.confirm('笔记还没保存，离开这一页吗？'))
  // // })
  return window.confirm('笔记还没保存，离开这一页吗？')
})
</script>

<template>
  <LabPage>
    <DemoBlock
      title="参数更新"
      scene="文章从 /post/1 切到 /post/2，页面组件不销毁。要在参数变化时重新拉正文，而不是继续显示上一篇。"
      hint="下面两个链接共用当前组件。切换时看本地日志里的 onBeforeRouteUpdate，全局日志里不会再出现 beforeEnter。"
    >
      <p>当前 step：{{ step }}</p>
      <div class="row">
        <RouterLink to="/ecosystem/router/1">步骤 1</RouterLink>
        <RouterLink to="/ecosystem/router/2">步骤 2</RouterLink>
      </div>
      <ol v-if="lines.length" class="log">
        <li v-for="line in lines" :key="line.id">{{ line.text }}</li>
      </ol>
    </DemoBlock>

    <DemoBlock
      title="离开确认"
      scene="编辑器里还有没保存的草稿。点侧栏或关掉页签前先问一句，取消就留在当前页。"
      hint="勾选后，侧栏跳到别的页面会先询问。onBeforeRouteLeave 返回 false 或用户取消确认时，导航会停住。"
    >
      <label class="row">
        <input v-model="dirty" type="checkbox" />
        有未保存的笔记
      </label>
    </DemoBlock>

    <DemoBlock
      title="全局守卫日志"
      scene="没登录就访问后台时，beforeEach 把人送到登录页，并在浏览器标题上带上当前页面名。"
      hint="beforeEach 改文档标题，beforeResolve 在导航确认前，afterEach 在导航确认后。组件内的离开守卫夹在 beforeEach 和 beforeEnter 之间。"
    >
      <ol v-if="navLog.length" class="log">
        <li v-for="line in navLog" :key="line.id">{{ line.text }}</li>
      </ol>
    </DemoBlock>
  </LabPage>
</template>
