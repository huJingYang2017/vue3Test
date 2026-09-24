<script setup lang="ts">
import { computed, ref } from 'vue'
import { cheatCards } from '@/data/cheatsheet'
import DemoBlock from '@/components/ui/DemoBlock.vue'
import LabPage from '@/components/ui/LabPage.vue'

const keyword = ref('')
const group = ref('全部')
const inputKey = ref(0)
const showIf = ref(true)
const showBlock = ref(true)

const groups = ['全部', ...new Set(cheatCards.map((card) => card.group))]

const visible = computed(() => {
  const text = keyword.value.trim().toLowerCase()
  return cheatCards.filter((card) => {
    const inGroup = group.value === '全部' || card.group === group.value
    const inText = !text || `${card.title}${card.answer}${card.scene}${card.pitfall}`.toLowerCase().includes(text)
    return inGroup && inText
  })
})
</script>

<template>
  <LabPage>
    <DemoBlock
      title="v-if 和 v-show"
      scene="没权限的管理按钮用 v-if，节点根本不出现。频繁开关的筛选面板用 v-show，藏起来时里面已选的条件还在。"
      hint="v-if 会销毁并重建节点；v-show 只切换 display，首次渲染的开销还在。"
    >
      <div class="row">
        <button type="button" @click="showIf = !showIf">切换 v-if</button>
        <button type="button" @click="showBlock = !showBlock">切换 v-show</button>
      </div>
      <p v-if="showIf" class="pill">v-if 为真时，这段节点才存在</p>
      <p v-show="showBlock" class="pill">v-show 为假时，节点还在，只是看不见</p>
    </DemoBlock>

    <DemoBlock
      title="key 会重建节点"
      scene="从用户 A 切到用户 B 时，用用户 id 当 key，强制重建表单，避免 A 没保存的输入留在 B 的编辑框里。"
      hint="key 变化后，Vue 会丢掉旧节点。输入框里的临时文字也会一起消失。"
    >
      <div class="row">
        <input :key="inputKey" class="text" type="text" placeholder="先打几个字，再切换 key" />
        <button type="button" @click="inputKey++">切换 key</button>
      </div>
    </DemoBlock>

    <div class="filters">
      <button
        v-for="name in groups"
        :key="name"
        type="button"
        :class="{ active: group === name }"
        @click="group = name"
      >
        {{ name }}
      </button>
    </div>
    <input v-model="keyword" class="search" type="search" placeholder="搜索题目、答案、场景或易错点" />
    <div class="cards">
      <article v-for="card in visible" :key="card.id" class="card-q">
        <h3>{{ card.group }} · {{ card.title }}</h3>
        <p>{{ card.answer }}</p>
        <p class="scene"><strong>用来干什么</strong>{{ card.scene }}</p>
        <p class="hint">易错：{{ card.pitfall }}</p>
      </article>
      <p v-if="visible.length === 0" class="empty">没有匹配的卡片</p>
    </div>
  </LabPage>
</template>
