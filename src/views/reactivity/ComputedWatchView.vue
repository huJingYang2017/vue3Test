<script setup lang="ts">
import { computed, reactive, ref, watch, watchEffect, watchPostEffect } from 'vue'
import { useTemplateRef } from 'vue'
import DemoBlock from '@/components/ui/DemoBlock.vue'
import LabPage from '@/components/ui/LabPage.vue'
import LogList from '@/components/ui/LogList.vue'
import { useLog } from '@/composables/useLog'

const { lines, push, clear } = useLog(12)

/**
 * computed 有缓存：依赖 base 不变时，重复读取不会重新执行 getter。
 * 下面用一个普通数字计数，避免在 computed 里写入另一个 ref，那样会把自己也变成依赖。
 * 正式代码不要在 computed 里做计数这种副作用，这里只为了把缓存看见。
 */
const base = ref(1)
const unrelated = ref(0)
let computedHits = 0
const computedHitsView = ref(0)
const methodHits = ref(0)
const methodResult = ref(0)
const first = ref('Lin')
const last = ref('Yu')

const doubled = computed(() => {
  computedHits += 1
  queueMicrotask(() => {
    computedHitsView.value = computedHits
  })
  return base.value * 2
})

const full = computed({
  get: () => `${first.value} ${last.value}`.trim(),
  set(value: string) {
    const [given = '', family = ''] = value.split(' ')
    first.value = given
    last.value = family
  },
})

function runMethod() {
  methodHits.value += 1
  methodResult.value = base.value * 2
}

/**
 * 这几个 watch 盯着同一个 n，方便对照它们的触发时机。
 * flush 默认是 pre：回调时组件还没把新值写进 DOM。
 * post 在 DOM 更新之后。watchPostEffect 是 flush: 'post' 的简写，但没有旧值。
 */
const n = ref(0)
const label = useTemplateRef<HTMLElement>('label')
const postText = ref('')
const onceText = ref('尚未触发')
const paused = ref(false)

watch(n, () => {
  push(`pre：DOM 仍是「${label.value?.textContent ?? ''}」`)
})

watch(
  n,
  () => {
    push(`post：DOM 已是「${label.value?.textContent ?? ''}」`)
  },
  { flush: 'post' },
)

watchPostEffect(() => {
  postText.value = `watchPostEffect：n=${n.value}，DOM=${label.value?.textContent ?? ''}`
})

watch(
  n,
  (value) => {
    onceText.value = `once 只记下第一次变化：${value}`
  },
  { once: true },
)

const follow = watch(n, (value) => {
  push(`可暂停监听：${value}`)
})

function toggleFollow() {
  if (paused.value) follow.resume()
  else follow.pause()
  paused.value = !paused.value
}

/**
 * 直接 watch reactive 对象时会深度遍历，回调里的新旧值是同一个对象。
 * deep: 1 只收集根上的属性，嵌套字段的修改不会触发。
 * 只关心某一个深层字段时，把来源写成 getter，而不是把整棵树都遍历一遍。
 */
const tree = reactive({ folder: { file: { hits: 0 } } })

watch(tree, (value, oldValue) => {
  push(`默认深度遍历，新旧是否同一引用：${value === oldValue}`)
})

watch(
  tree,
  () => {
    push('deep: 1 只看见根属性被替换')
  },
  { deep: 1 },
)

watch(
  () => tree.folder.file.hits,
  (value, oldValue) => {
    push(`精确来源：${oldValue} → ${value}`)
  },
)

/**
 * watchEffect 立刻执行，自动跟踪回调里读到的 keyword。
 * onCleanup 在下一次执行前运行，用来取消上一次的定时器。
 * 计数放在普通变量里，避免写 ref 时把 effect 自己变成死循环。
 */
const keyword = ref('')
let effectRuns = 0
let cleanups = 0
const effectReport = ref('输入后点采样')

watchEffect((onCleanup) => {
  const current = keyword.value
  effectRuns += 1
  const timer = window.setTimeout(() => undefined, 300)
  onCleanup(() => {
    cleanups += 1
    window.clearTimeout(timer)
  })
  void current
})

function sampleEffect() {
  effectReport.value = `effect 执行 ${effectRuns} 次，清理 ${cleanups} 次`
}
</script>

<template>
  <LabPage>
    <DemoBlock
      title="computed 缓存"
      scene="购物车总价、搜索后的列表、表单能不能提交。这些都从现有数据算出来，商品没变就不用重新算一遍。"
      hint="只刷新无关计数时，计算属性的求值次数保持不变。方法每次调用都会算一遍。"
    >
      <p>计算属性 {{ doubled }}，求值 {{ computedHitsView }} 次</p>
      <p>方法结果 {{ methodResult }}，调用 {{ methodHits }} 次</p>
      <p>无关计数 {{ unrelated }}</p>
      <div class="row">
        <button type="button" @click="base++">改变依赖</button>
        <button type="button" @click="unrelated++">只刷新视图</button>
        <button type="button" class="ghost" @click="runMethod">调用方法</button>
      </div>
      <label class="field">
        <span>可写 computed：{{ first }} / {{ last }}</span>
        <input v-model="full" type="text" />
      </label>
    </DemoBlock>

    <DemoBlock
      title="watch 的时机"
      scene="筛选条件一变就重新请求列表。要量更新后的表格高度时用 flush: post。登录成功只跳转一次用 once。输入草稿时可以先暂停自动保存。"
      hint="pre 读到旧 DOM，post 读到新 DOM。once 只记录第一次。暂停后，可暂停监听不再写日志。"
    >
      <p>当前 n = <span ref="label">{{ n }}</span></p>
      <p>{{ postText }}</p>
      <p>{{ onceText }}</p>
      <div class="row">
        <button type="button" @click="n++">n + 1</button>
        <button type="button" @click="toggleFollow">{{ paused ? '恢复监听' : '暂停监听' }}</button>
        <button type="button" class="ghost" @click="clear">清空日志</button>
      </div>
    </DemoBlock>

    <DemoBlock
      title="深度"
      scene="表单任意字段一改就标成「未保存」。订单详情只在整份订单被换成另一单时才重新拉关联数据，用 deep: 1 就够。"
      hint="改 hits 会触发默认深度遍历和精确来源。替换 folder 才会触发 deep: 1。"
    >
      <p>hits = {{ tree.folder.file.hits }}</p>
      <div class="row">
        <button type="button" @click="tree.folder.file.hits++">改深层 hits</button>
        <button type="button" @click="tree.folder = { file: { hits: 0 } }">替换根上的 folder</button>
      </div>
    </DemoBlock>

    <DemoBlock
      title="watchEffect"
      scene="搜索框、依赖好几个筛选条件的请求。内容一变就发请求，新的输入会先取消上一次还没回来的请求。"
      hint="它会立刻跑一次。每改一个字都会先清理上一次的定时器。"
    >
      <label class="field">
        <span>关键字</span>
        <input v-model="keyword" type="text" />
      </label>
      <div class="row">
        <button type="button" @click="sampleEffect">采样</button>
        <span>{{ effectReport }}</span>
      </div>
    </DemoBlock>

    <LogList :lines="lines" />
  </LabPage>
</template>
