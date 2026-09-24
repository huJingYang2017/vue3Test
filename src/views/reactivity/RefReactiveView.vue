<script setup lang="ts">
import { isRef, reactive, ref } from 'vue'
import DemoBlock from '@/components/ui/DemoBlock.vue'
import LabPage from '@/components/ui/LabPage.vue'

/**
 * ref 适合三种值：
 * 1. 数字、字符串、布尔这些原始值
 * 2. 以后要整个换成另一个对象的值
 * 3. 从组合式函数里返回、让调用方按需解构的状态
 * 在 script 中读写必须经过 .value。模板里的顶层 ref 会自动去掉这层包装。
 */
const count = ref(0)

/**
 * reactive 只能接收对象、数组、Map、Set。
 * 直接改属性即可，没有 .value。
 * 把它整个换掉（form = {}）会失去代理，页面仍指向原来的对象。
 */
const form = reactive({
  name: 'Vue',
  score: 90,
})

function replaceWrong() {
  // 这行如果写成 form = { name: '丢失', score: 0 }，TypeScript 会直接拦住，
  // 因为 script setup 里的绑定是常量。正确的整体替换方式是改用 ref。
  Object.assign(form, { name: '仍在原代理上', score: form.score + 1 })
}

/**
 * ref 放进 reactive 后，作为对象属性访问时会自动解包。
 * pocket.score 的类型看起来是 number，实际读写会转到 scoreRef.value。
 */
const scoreRef = ref(1)
const pocket = reactive({ score: scoreRef })

/**
 * 同一个 ref 放进数组时不会解包。
 * 模板如果写 list[0]，拿到的仍是 ref 对象，所以这里用计算后的说明文字展示。
 */
const title = ref('指南')
const list = reactive([title])
const arrayText = () => {
  const item = list[0]
  return isRef(item) ? `数组元素仍是 ref，.value = ${item.value}` : '数组元素被解包了'
}

function renameTitle() {
  title.value = title.value === '指南' ? '参考' : '指南'
}
</script>

<template>
  <LabPage>
    <DemoBlock title="ref" hint="点按钮只改 count.value。模板写 count，不写 count.value。">
      <div class="row">
        <strong>{{ count }}</strong>
        <button type="button" @click="count++">+1</button>
      </div>
    </DemoBlock>

    <DemoBlock title="reactive" hint="改属性会更新视图。整体替换要换一个 ref，而不是给 reactive 绑定重新赋值。">
      <label class="field">
        <span>名称</span>
        <input v-model="form.name" type="text" />
      </label>
      <div class="row">
        <span>分数 {{ form.score }}</span>
        <button type="button" @click="form.score++">分数 +1</button>
        <button type="button" @click="replaceWrong">在原对象上合并</button>
      </div>
    </DemoBlock>

    <DemoBlock title="ref 的自动解包" hint="对象属性会解包，数组元素不会。这是面试里很常见的追问。">
      <p>pocket.score = {{ pocket.score }}，scoreRef = {{ scoreRef }}</p>
      <div class="row">
        <button type="button" @click="pocket.score++">通过 reactive 属性 +1</button>
        <button type="button" @click="scoreRef++">通过 ref +1</button>
      </div>
      <p>{{ arrayText() }}</p>
      <button type="button" @click="renameTitle">修改数组里的 ref</button>
    </DemoBlock>
  </LabPage>
</template>
