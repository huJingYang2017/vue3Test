<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import DemoBlock from "@/components/ui/DemoBlock.vue";
import LabPage from "@/components/ui/LabPage.vue";
import LogList from "@/components/ui/LogList.vue";
import { useCartStore } from "@/stores/cart";
import { useCounterStore } from "@/stores/counter";
import { piniaTrace } from "@/stores/pinia";
import { useUserStore } from "@/stores/user";

/**
 * storeToRefs 只拆 state 和 getter，保证解构后仍然是 ref。
 * action 直接从 store 上解构，Pinia 已经绑定好了 store 实例。
 * 如果把 inc 放进 storeToRefs，它不是响应式状态，Pinia 4 会给出诊断并跳过。
 */
const counter = useCounterStore();
const user = useUserStore();
const cart = useCartStore();
const { count, doubled } = storeToRefs(counter);
const { inc, reset } = counter;
const draft = ref(user.name);
const actionText = ref("还没有 action");

counter.$onAction(({ name, args, after }) => {
  after(() => {
    actionText.value = `${name}(${args.join(", ")}) 已完成`;
  });
});

watch(
  () => user.name,
  (name) => {
    draft.value = name;
  },
);

function saveName() {
  user.rename(draft.value);
}
</script>

<template>
  <LabPage>
    <DemoBlock
      title="Setup Store"
      scene="全站未读数、当前登录用户。详情页改一次，顶栏和别的页面读到的是同一份数据。"
      hint="count 来自 storeToRefs。插件注入的 appName 每个 store 都能读到。$patch 一次加 5。"
    >
      <p>{{ counter.appName }} · 计数 {{ count }} · 双倍 {{ doubled }}</p>
      <p>{{ actionText }}</p>
      <div class="row">
        <button type="button" @click="inc(6)">+6</button>
        <button type="button" @click="counter.$patch({ count: count + 5 })">
          $patch +5
        </button>
        <button type="button" class="ghost" @click="reset()">
          自己的 reset
        </button>
      </div>
    </DemoBlock>

    <DemoBlock
      title="Options Store"
      scene="用户资料这种有明确初始值的状态。退出登录时 $reset 一次回到未登录，不用自己把每个字段清掉。"
      hint="没有 mutation。action 里直接改 this.name。$reset 回到 state() 的初始值。名字会写入 localStorage。"
    >
      <p>{{ user.label }}</p>
      <label class="field">
        <span>名字</span>
        <input v-model="draft" type="text" />
      </label>
      <div class="row">
        <button type="button" @click="saveName">保存</button>
        <button type="button" @click="user.login()">登录为 admin</button>
        <button type="button" class="ghost" @click="user.$reset()">
          $reset
        </button>
      </div>
    </DemoBlock>

    <DemoBlock
      title="另一个 store 就是另一个模块"
      scene="购物车和用户拆开。结算页只动购物车，不会把改昵称和加商品搅在同一个状态里。"
      hint="购物车不需要 namespaced。pushLater 在 action 里等待 400ms 再改 state。"
    >
      <p>件数 {{ cart.totalQty }}</p>
      <ul>
        <li v-for="item in cart.items" :key="item.id">
          {{ item.name }} × {{ item.qty }}
        </li>
      </ul>
      <div class="row">
        <button
          type="button"
          @click="cart.push({ id: 1, name: '钢笔', qty: 1 })"
        >
          加钢笔
        </button>
        <button
          type="button"
          @click="cart.pushLater({ id: 2, name: '笔记本', qty: 1 })"
        >
          稍后加笔记本
        </button>
        <button type="button" class="ghost" @click="cart.clear()">清空</button>
      </div>
    </DemoBlock>

    <DemoBlock
      title="插件订阅"
      scene="每次状态变化后写入本地草稿或打一条埋点。不用在每个加购、改数量的 action 里再手写一遍。"
      hint="$subscribe 在变更提交之后触发。direct 表示直接改 state，patch object 表示 $patch 传入了对象。"
    >
      <LogList :lines="piniaTrace" />
    </DemoBlock>
  </LabPage>
</template>
