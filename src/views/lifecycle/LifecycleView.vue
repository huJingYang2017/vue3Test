<script setup lang="ts">
import { nextTick, onErrorCaptured, provide, ref } from 'vue'
import { useTemplateRef } from 'vue'
import Bomb from '@/components/lifecycle/Bomb.vue'
import { LifeLogKey } from '@/components/lifecycle/log'
import Probe from '@/components/lifecycle/Probe.vue'
import DemoBlock from '@/components/ui/DemoBlock.vue'
import LabPage from '@/components/ui/LabPage.vue'
import LogList from '@/components/ui/LogList.vue'
import { useLog } from '@/composables/useLog'

/**
 * 子组件通过 inject 把钩子名字写进同一份日志。
 * 选项式 API 的 beforeCreate / created 没有 onXxx，它们的位置就是 setup 本身。
 * 父 onMounted 会晚于子 onMounted。卸载时顺序反过来。
 */
const { lines, push, clear } = useLog(24)
provide(LifeLogKey, {
  push(source, hook) {
    push(`${source} · ${hook}`)
  },
})

const showChild = ref(true)
const showCached = ref(false)
const traceRender = ref(false)
const parentTick = ref(0)
const tickBox = useTemplateRef<HTMLElement>('tickBox')
const domText = ref('还没有读取 DOM')
const errorText = ref('还没有捕获到错误')

onErrorCaptured((err, instance, info) => {
  const message = err instanceof Error ? err.message : String(err)
  const name = instance?.$options.name ?? '匿名组件'
  errorText.value = `${name} / ${info} / ${message}`
  return false
})

async function readDom() {
  parentTick.value += 1
  domText.value = `同步读到「${tickBox.value?.textContent ?? ''}」`
  await nextTick()
  domText.value += `；nextTick 后读到「${tickBox.value?.textContent ?? ''}」`
}
</script>

<template>
  <LabPage>
    <DemoBlock
      title="父子钩子顺序"
      scene="父页面在 onMounted 里拉首屏数据，子表格在自己的 onMounted 里量列宽。离开页面前用 onUnmounted 断开 WebSocket，避免切走后还在收消息。"
      hint="预期首次出现：父级 setup、父级 onBeforeMount、子级 setup、子级 onBeforeMount、子级 onMounted、父级 onMounted。关掉子级时会看到 onBeforeUnmount 然后 onUnmounted。"
    >
      <Probe label="父级">
        <div class="row">
          <button type="button" @click="showChild = !showChild">{{ showChild ? '卸载子级' : '挂载子级' }}</button>
          <button type="button" @click="showCached = !showCached">
            {{ showCached ? '停用缓存子级' : '显示缓存子级' }}
          </button>
          <button type="button" @click="parentTick++">触发更新 {{ parentTick }}</button>
          <button type="button" class="ghost" @click="clear">清空</button>
        </div>
        <Probe v-if="showChild" label="子级" />
          <!-- KeepAlive 把切走的组件留在内存里，而不是销毁。再显示时用的还是原来那一份实例，里面的输入、ref 和已经请求过的数据都还在。 -->
        <KeepAlive>
          <Probe v-if="showCached" label="缓存子级" />
        </KeepAlive>
      </Probe>
      <LogList :lines="lines" />
    </DemoBlock>

    <DemoBlock
      title="nextTick"
      scene="点「新建」后列表多了一行，要等这一行真正出现在页面上，再把焦点放进新输入框，或把聊天记录滚到最底。"
      hint="同步读取时 DOM 还是旧文本，await nextTick() 之后才是新文本。"
    >
      <strong ref="tickBox">tick {{ parentTick }}</strong>
      <div class="row">
        <button type="button" @click="readDom">加一并读取 DOM</button>
      </div>
      <p>{{ domText }}</p>
    </DemoBlock>

    <DemoBlock
      title="KeepAlive 与错误捕获"
      scene="后台多页签切走再回来，表单里已经填的内容还在。某一块子模块渲染失败时，只显示「这一块加载失败」，不让整个后台白屏。"
      hint="缓存子级第一次会 mounted，之后切换只出现 onDeactivated / onActivated。下面的按钮抛出的错误由本页 onErrorCaptured 接住，并返回 false，不再交给 app.config.errorHandler。"
    >
      <p>{{ errorText }}</p>
      <Bomb />
    </DemoBlock>

    <DemoBlock
      title="渲染调试钩子"
      scene="页面突然变卡时，看是哪一次数据写入把整页又渲染了一遍。查完就关掉，不要留到生产环境。"
      hint="onRenderTracked / onRenderTriggered 只在开发模式有意义，日志会很多。"
    >
      <button type="button" @click="traceRender = !traceRender">
        {{ traceRender ? '关闭渲染追踪' : '打开渲染追踪' }}
      </button>
      <Probe v-if="traceRender" label="渲染追踪" trace />
    </DemoBlock>

    <section class="panel">
      <h2>和选项式 API 的对应关系</h2>
      <table class="map">
        <thead>
          <tr>
            <th>选项式</th>
            <th>组合式</th>
            <th>真实项目里</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>beforeCreate / created</td><td>setup 本身</td><td>进页面就声明状态、读路由参数。这时还没有 DOM，不能量宽高。</td></tr>
          <tr><td>beforeMount / mounted</td><td>onBeforeMount / onMounted</td><td>首屏请求、初始化图表、让搜索框聚焦，放在 onMounted，元素已经在页面上。</td></tr>
          <tr><td>beforeUpdate / updated</td><td>onBeforeUpdate / onUpdated</td><td>列表变长后要滚到底，更常见的是改完数据再 await nextTick()。</td></tr>
          <tr><td>beforeUnmount / unmounted</td><td>onBeforeUnmount / onUnmounted</td><td>离开页面时断开 WebSocket、清掉定时器、销毁图表。</td></tr>
          <tr><td>activated / deactivated</td><td>onActivated / onDeactivated</td><td>多页签切回来时刷新列表，切走时暂停视频或停掉轮询。</td></tr>
          <tr><td>errorCaptured</td><td>onErrorCaptured</td><td>某一块渲染失败时换成「加载失败」，整页还在。</td></tr>
          <tr><td>renderTracked / renderTriggered</td><td>onRenderTracked / onRenderTriggered</td><td>排查是谁触发了多余渲染，上线前拿掉。</td></tr>
          <tr><td>serverPrefetch</td><td>onServerPrefetch，只在服务端渲染时调用</td><td>服务端先把文章正文取回来再输出 HTML，搜索引擎拿到的不是空壳。</td></tr>
        </tbody>
      </table>
    </section>
  </LabPage>
</template>
