<script setup lang="ts">
import { ref, shallowReactive, shallowRef, triggerRef, watch } from 'vue'
import DemoBlock from '@/components/ui/DemoBlock.vue'
import LabPage from '@/components/ui/LabPage.vue'

/**
 * shallowRef 只把 .value 这一层变成响应式。
 * 替换整个对象会更新视图；改对象内部的字段不会。
 * 如果必须原地修改，改完后调用 triggerRef，手动通知依赖。
 */
const box = shallowRef({ hits: 0 })
const memory = ref('')
const shownHits = ref(box.value.hits)

// 只在 .value 被替换或 triggerRef 时更新。模板不直接读 box.hits，
// 否则任何一次别的渲染都会把内部的新值带出来，浅层「不通知」就看不出来了。
watch(box, (value) => {
  shownHits.value = value.hits
})

function mutateInside() {
  box.value.hits += 1
}

function replaceBox() {
  box.value = { hits: box.value.hits + 1 }
}

function force() {
  box.value.hits += 1
  triggerRef(box)
}

function shootBox() {
  memory.value = JSON.stringify(box.value)
}

/**
 * shallowReactive 只代理根上的属性。
 * id 这种根属性一改，视图就会更新。
 * nested.hits 改了，模板仍停在上一次渲染读到的值。
 */
const bag = shallowReactive({
  id: 1,
  nested: { hits: 0 },
})
const bagMemory = ref('')
const shownNested = ref(bag.nested.hits)

watch(
  () => bag.id,
  () => {
    shownNested.value = bag.nested.hits
  },
)

function shootBag() {
  bagMemory.value = JSON.stringify(bag)
}
</script>

<template>
  <LabPage>
    <DemoBlock
      title="shallowRef"
      hint="先改内部，页面上的数字不动；再点「拍摄内存」，可以看到对象其实已经变了。替换 .value 或 triggerRef 都会让视图跟上。"
    >
      <p>视图中的 hits：{{ shownHits }}</p>
      <div class="row">
        <button type="button" @click="mutateInside">只改内部</button>
        <button type="button" @click="replaceBox">替换 .value</button>
        <button type="button" @click="force">改内部并 triggerRef</button>
        <button type="button" class="ghost" @click="shootBox">拍摄内存</button>
      </div>
      <p>内存快照：{{ memory || '还没有拍摄' }}</p>
    </DemoBlock>

    <DemoBlock title="shallowReactive" hint="根上的 id 会更新视图，嵌套的 hits 不会。">
      <p>视图：id {{ bag.id }}，nested.hits {{ shownNested }}</p>
      <div class="row">
        <button type="button" @click="bag.id++">改根属性</button>
        <button type="button" @click="bag.nested.hits++">改嵌套属性</button>
        <button type="button" class="ghost" @click="shootBag">拍摄内存</button>
      </div>
      <p>内存快照：{{ bagMemory || '还没有拍摄' }}</p>
    </DemoBlock>
  </LabPage>
</template>
