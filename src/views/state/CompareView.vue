<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import DemoBlock from '@/components/ui/DemoBlock.vue'
import LabPage from '@/components/ui/LabPage.vue'
import { useCartStore } from '@/stores/cart'
import { useCounterStore } from '@/stores/counter'
import { useVuexCart, useVuexStore } from '@/stores/vuex'

const piniaCounter = useCounterStore()
const { count: piniaCount } = storeToRefs(piniaCounter)
const vuex = useVuexStore()
const vuexCount = computed(() => vuex.state.count)
const piniaCart = useCartStore()
const { totalQty: vuexQty, push: pushVuex } = useVuexCart()

const rows = [
  ['状态', 'ref 或 state()', 'state'],
  ['派生', 'computed 或 getters', 'getters'],
  ['同步修改', '在 action 里直接改', 'commit mutation'],
  ['异步', 'async action', 'dispatch action，再 commit'],
  ['模块', '一个 defineStore 一份状态', 'modules，通常加上 namespaced'],
  ['解构', 'storeToRefs 拆状态，action 直接拆', '用 computed 读取，避免丢掉响应式'],
  ['重置', 'Options store 用 $reset；Setup store 自己写', '自己写 reset mutation'],
  ['新项目', '官方推荐，类型推导直接', '维护旧代码、对照 mutation 题目时使用'],
]
</script>

<template>
  <LabPage>
    <div class="grid-2">
      <DemoBlock title="Pinia 计数">
        <p>{{ piniaCount }}</p>
        <button type="button" @click="piniaCounter.inc()">+1</button>
      </DemoBlock>
      <DemoBlock title="Vuex 计数">
        <p>{{ vuexCount }}</p>
        <button type="button" @click="vuex.commit('inc', 1)">commit +1</button>
      </DemoBlock>
      <DemoBlock title="Pinia 购物车">
        <p>件数 {{ piniaCart.totalQty }}</p>
        <button type="button" @click="piniaCart.push({ id: 1, name: '钢笔', qty: 1 })">加钢笔</button>
      </DemoBlock>
      <DemoBlock title="Vuex 购物车">
        <p>件数 {{ vuexQty }}</p>
        <button type="button" @click="pushVuex({ id: 1, name: '钢笔', qty: 1 })">加钢笔</button>
      </DemoBlock>
    </div>
    <section class="panel">
      <h2>概念对照</h2>
      <table class="map">
        <thead>
          <tr>
            <th>概念</th>
            <th>Pinia</th>
            <th>Vuex</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row[0]">
            <td>{{ row[0] }}</td>
            <td>{{ row[1] }}</td>
            <td>{{ row[2] }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </LabPage>
</template>
