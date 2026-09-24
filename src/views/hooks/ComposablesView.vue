<script setup lang="ts">
import { ref } from 'vue'
import { useTemplateRef } from 'vue'
import DemoBlock from '@/components/ui/DemoBlock.vue'
import LabPage from '@/components/ui/LabPage.vue'
import { useCounter } from '@/composables/useCounter'
import { useDebouncedRef } from '@/composables/useDebouncedRef'
import { useFetch } from '@/composables/useFetch'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { useMouse } from '@/composables/useMouse'
import { useTitle } from '@/composables/useTitle'
import { useToggle } from '@/composables/useToggle'
import { useEventListener } from '@/composables/useEventListener'
import { useWindowSize } from '@/composables/useWindowSize'

const { state: panelOpen, toggle } = useToggle(true)
const { count: alphaCount, doubled: alphaDoubled, inc: incAlpha } = useCounter(0)
const { count: betaCount, doubled: betaDoubled, inc: incBeta } = useCounter(10)
const note = useLocalStorage('vue3-lab:note', '刷新页面后我还在')
const keyword = useDebouncedRef('', 400)
const { x, y } = useMouse()
const { width, height } = useWindowSize()
const pageTitle = ref('组合式函数')
useTitle(pageTitle)

const pad = useTemplateRef<HTMLButtonElement>('pad')
const padText = ref('指针还在按钮外')
useEventListener(pad, 'pointerenter', () => {
  padText.value = '指针进入按钮'
})
useEventListener(pad, 'pointerleave', () => {
  padText.value = '指针离开按钮'
})

/**
 * data URL 让示例在没有接口时也能跑通 useFetch。
 * 把 url 换成真实地址时，取消、loading 和 error 的逻辑不用改。
 */
const sampleUrl = `data:application/json,${encodeURIComponent(
  JSON.stringify({ title: '离线 JSON', year: 2026 }),
)}`
const url = ref<string | null>(null)
const { data, error, loading, execute } = useFetch<{ title: string; year: number }>(url)

function loadSample() {
  url.value = sampleUrl
  execute()
}
</script>

<template>
  <LabPage>
    <DemoBlock title="useToggle / useCounter" hint="两次调用 useCounter 得到两份独立状态。解构出来的 count 仍是 ref。">
      <div class="row">
        <button type="button" @click="toggle()">{{ panelOpen ? '收起' : '展开' }}</button>
        <span v-if="panelOpen">面板开着</span>
      </div>
      <div class="row">
        <button type="button" @click="incAlpha()">甲 {{ alphaCount }} / {{ alphaDoubled }}</button>
        <button type="button" @click="incBeta()">乙 {{ betaCount }} / {{ betaDoubled }}</button>
      </div>
    </DemoBlock>

    <DemoBlock title="useLocalStorage" hint="刷新之后这段文字还在。键名是 vue3-lab:note。">
      <label class="field">
        <span>本地笔记</span>
        <textarea v-model="note" rows="3" />
      </label>
    </DemoBlock>

    <DemoBlock title="useDebouncedRef" hint="停手大约 400ms 后，下面的句子才会跟上输入框。">
      <label class="field">
        <span>输入</span>
        <input v-model="keyword" type="text" />
      </label>
      <p>防抖后的值：{{ keyword || '空' }}</p>
    </DemoBlock>

    <DemoBlock title="useMouse / useWindowSize / useEventListener" hint="事件在组合式函数里注册，离开页面时 watchEffect 的清理函数会移除监听。">
      <p>指针 {{ x }}, {{ y }}</p>
      <p>窗口 {{ width }} × {{ height }}</p>
      <button ref="pad" type="button">{{ padText }}</button>
    </DemoBlock>

    <DemoBlock title="useTitle / useFetch" hint="标题写入 document.title。连续点击加载会让上一次请求在 onWatcherCleanup 里被取消。">
      <label class="field">
        <span>文档标题</span>
        <input v-model="pageTitle" type="text" />
      </label>
      <div class="row">
        <button type="button" @click="loadSample">加载 JSON</button>
        <button type="button" class="ghost" @click="execute()">再请求一次</button>
      </div>
      <p v-if="loading">加载中</p>
      <p v-else-if="error">失败：{{ error }}</p>
      <p v-else-if="data">{{ data.title }} · {{ data.year }}</p>
      <p v-else class="empty">还没有请求</p>
    </DemoBlock>
  </LabPage>
</template>
