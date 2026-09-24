<script setup lang="ts">
import { reactive, readonly, shallowReadonly } from 'vue'
import DemoBlock from '@/components/ui/DemoBlock.vue'
import LabPage from '@/components/ui/LabPage.vue'

/**
 * readonly 返回源对象的深层只读代理，不是拷贝。
 * 改 deepSource，deepLocked 会一起变。
 * 改 deepLocked，开发模式只在控制台警告，界面上的值不动。
 */
const deepSource = reactive({ n: 1, nested: { n: 1 } })
const deepLocked = readonly(deepSource)

/**
 * shallowReadonly 只把根属性标成只读。
 * nested 仍然是原来的响应式对象，所以改 nested.n 会成功，
 * 并且因为它们共享源对象，deep 那一侧如果包的是同一个对象也会看见。
 * 这里特意用了另一份源，避免两个实验缠在一起。
 */
const shallowSource = reactive({ n: 1, nested: { n: 1 } })
const shallowLocked = shallowReadonly(shallowSource)

function writeDeepRoot() {
  ;(deepLocked as { n: number }).n = 99
}

function writeDeepNested() {
  ;(deepLocked.nested as { n: number }).n = 99
}

function writeShallowRoot() {
  ;(shallowLocked as { n: number }).n = 99
}
</script>

<template>
  <LabPage>
    <DemoBlock title="readonly" hint="它是视图，不是快照。源对象一变，只读代理跟着变；反过来写会被拦住。">
      <p>源 n = {{ deepSource.n }}，只读 n = {{ deepLocked.n }}</p>
      <p>源 nested.n = {{ deepSource.nested.n }}，只读 nested.n = {{ deepLocked.nested.n }}</p>
      <div class="row">
        <button type="button" @click="deepSource.n++">改源对象</button>
        <button type="button" @click="writeDeepRoot">尝试写只读根属性</button>
        <button type="button" @click="writeDeepNested">尝试写只读嵌套属性</button>
      </div>
    </DemoBlock>

    <DemoBlock title="shallowReadonly" hint="根属性写不进去。嵌套对象没有被包成只读，所以 nested.n 可以增加。">
      <p>根 n = {{ shallowLocked.n }}，嵌套 n = {{ shallowLocked.nested.n }}</p>
      <div class="row">
        <button type="button" @click="writeShallowRoot">尝试替换根属性</button>
        <button type="button" @click="shallowLocked.nested.n++">修改嵌套属性</button>
      </div>
    </DemoBlock>
  </LabPage>
</template>
