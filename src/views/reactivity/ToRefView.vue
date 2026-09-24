<script setup lang="ts">
import { reactive, toRef, toRefs, toValue, type MaybeRefOrGetter } from 'vue'
import DemoBlock from '@/components/ui/DemoBlock.vue'
import LabPage from '@/components/ui/LabPage.vue'

/**
 * 源对象是 reactive。toRef(state, 'title') 返回的 ref 和 state.title 指向同一份数据：
 * 改任何一边，另一边都会变。适合把某一个字段交给子逻辑，又不用把整个对象传过去。
 */
const state = reactive<{ title: string; score: number; year?: number }>({
  title: 'Vue',
  score: 98,
})
const title = toRef(state, 'title')

/**
 * 普通解构发生在读取的那一瞬间，plainTitle 只是一个字符串。
 * 之后 state.title 再变，plainTitle 也不会变。
 */
const plainTitle = state.title

/**
 * toRefs 把「当前已经存在的键」各转成一个 ref。
 * 返回的是普通对象，所以可以解构，而且每个字段仍和源对象相连。
 * 它不会变成一个响应式的键集合：稍后新增的 year，不会出现在 refs 上。
 */
const refs = toRefs(state)

/**
 * 属性还不存在时，第三个参数作为默认值。
 * 一旦写入这个 ref，源对象上就会出现 nickname。
 */
const profile = reactive<{ city: string; nickname?: string }>({ city: '杭州' })
const nickname = toRef(profile, 'nickname', '未命名')

/**
 * toRef 也可以接收 getter。这样得到的是只读 ref，适合把一段派生读取传给只接受 ref 的函数。
 * 真正要缓存的派生值仍然优先用 computed。
 */
const upper = toRef(() => state.title.toUpperCase())

/** toValue 把 ref、getter、普通值统一读成原始值。unref 不会调用 getter。 */
function shout(input: MaybeRefOrGetter<string>) {
  return toValue(input).toUpperCase()
}

const shouted = () => shout(() => state.title)

function addYear() {
  state.year = 2026
}
</script>

<template>
  <LabPage>
    <DemoBlock title="toRef 保持连接" hint="plainTitle 是解构出来的字符串，title 是连着源对象的 ref。">
      <label class="field">
        <span>toRef</span>
        <input v-model="title" type="text" />
      </label>
      <p>state.title = {{ state.title }}</p>
      <p>解构得到的 plainTitle = {{ plainTitle }}</p>
      <p>getter 形式的 toRef：{{ upper }}</p>
      <p>toValue 读到：{{ shouted() }}</p>
    </DemoBlock>

    <DemoBlock title="toRefs" hint="改 scoreRef 会写回 state。点击新增年份后，源对象有 year，toRefs 的结果里没有。">
      <div class="row">
        <span>分数 {{ refs.score.value }}</span>
        <button type="button" @click="refs.score.value++">分数 +1</button>
        <button type="button" @click="addYear">给源对象加 year</button>
      </div>
      <p>state.year = {{ state.year ?? '还没有' }}</p>
      <p>refs.year = {{ refs.year ? refs.year : 'toRefs 没有这个键' }}</p>
    </DemoBlock>

    <DemoBlock title="缺省属性" hint="默认值只在属性缺失时使用。写入后，源对象才真正拥有 nickname。">
      <label class="field">
        <span>{{ profile.city }}</span>
        <input v-model="nickname" type="text" />
      </label>
      <p>源对象上的 nickname：{{ profile.nickname ?? '字段仍不存在' }}</p>
    </DemoBlock>
  </LabPage>
</template>
