<script setup lang="ts">
import { computed, ref } from 'vue'
import DemoBlock from '@/components/ui/DemoBlock.vue'
import LabPage from '@/components/ui/LabPage.vue'
import LogList from '@/components/ui/LogList.vue'
import { useVuexCart, useVuexStore, vuexTrace } from '@/stores/vuex'

/**
 * script setup 里不使用 mapState / mapActions。
 * 用 computed 读取 state 和 getter，用函数包住 commit / dispatch。
 * 命名空间模块的类型字符串是 cart/push、cart/pushLater。
 */
const store = useVuexStore()
const cart = useVuexCart()
const { items, totalQty, push, pushLater, clear } = cart
const count = computed(() => store.state.count)
const doubled = computed(() => store.getters.doubled as number)
const strictNote = ref('还没有绕过 mutation')

function inc() {
  store.commit('inc', 1)
}

function incLater() {
  void store.dispatch('incLater', 2)
}

function reset() {
  store.commit('reset')
}

function mutateDirectly() {
  try {
    store.state.count += 1
    strictNote.value = `赋值语句已经执行，当前 count = ${store.state.count}。开发模式下严格模式会接着抛错，请看控制台。`
  } catch (error) {
    strictNote.value = error instanceof Error ? error.message : '被严格模式拒绝'
  }
}
</script>

<template>
  <LabPage>
    <DemoBlock
      title="根状态"
      scene="老项目里的全局角标、权限开关。同步修改走 mutation，开发工具才能按步骤回放是谁改的。"
      hint="同步用 commit，异步用 dispatch。action 里再 commit，不直接改 state。"
    >
      <p>count {{ count }} · getter doubled {{ doubled }}</p>
      <div class="row">
        <button type="button" @click="inc">commit +1</button>
        <button type="button" @click="incLater">dispatch 稍后 +2</button>
        <button type="button" class="ghost" @click="reset">commit reset</button>
      </div>
    </DemoBlock>

    <DemoBlock
      title="严格模式"
      scene="有人在组件里直接改了 state，开发环境立刻报错。这样线上不会出现「界面变了，但 Vuex 记录对不上」。"
      hint="生产构建会关掉 strict。开发时绕过 mutation 的修改会被 Vuex 报错。"
    >
      <button type="button" class="danger" @click="mutateDirectly">直接改 state.count</button>
      <p>{{ strictNote }}</p>
    </DemoBlock>

    <DemoBlock
      title="命名空间模块 cart"
      scene="订单、用户、权限各一块状态。提交写成 cart/push，不会和用户模块里同名的 mutation 撞在一起。"
      hint="组件不直接写 store.commit('cart/push')，而是用 useVuexCart 把模块收成组合式函数。"
    >
      <p>件数 {{ totalQty }}</p>
      <ul>
        <li v-for="item in items" :key="item.id">{{ item.name }} × {{ item.qty }}</li>
      </ul>
      <div class="row">
        <button type="button" @click="push({ id: 1, name: '钢笔', qty: 1 })">加钢笔</button>
        <button type="button" @click="pushLater({ id: 2, name: '笔记本', qty: 1 })">稍后加笔记本</button>
        <button type="button" class="ghost" @click="clear()">清空</button>
      </div>
    </DemoBlock>

    <DemoBlock
      title="插件 subscribe"
      scene="每次改价、改库存后记一条操作日志。客服可以查是哪一次 mutation 把价格改了，组件里不用重复写日志。"
      hint="Vuex 插件在 createStore 时注册，subscribe 能看到每一次 mutation 的 type。"
    >
      <LogList :lines="vuexTrace" />
    </DemoBlock>
  </LabPage>
</template>
