<script setup lang="ts">
import { provide, ref } from 'vue'
import { useTemplateRef } from 'vue'
import CountBox from '@/components/comm/CountBox.vue'
import DestructureChild from '@/components/comm/DestructureChild.vue'
import FocusField from '@/components/comm/FocusField.vue'
import NameField from '@/components/comm/NameField.vue'
import SlotCard from '@/components/comm/SlotCard.vue'
import ThemeLabel from '@/components/comm/ThemeLabel.vue'
import { ThemeKey, type ThemeName } from '@/components/comm/theme'
import DemoBlock from '@/components/ui/DemoBlock.vue'
import LabPage from '@/components/ui/LabPage.vue'

const count = ref(0)
const nickname = ref('阿宁')
const passed = ref(2)
const theme = ref<ThemeName>('墨色')

provide(ThemeKey, theme)

const field = useTemplateRef<{ focus: () => void }>('field')

function onIncrement(step: number) {
  count.value += step
}

function toggleTheme() {
  theme.value = theme.value === '墨色' ? '纸色' : '墨色'
}
</script>

<template>
  <LabPage>
    <DemoBlock title="props 与 emits" hint="数据从父组件流进 props，子组件用事件把意图交还父组件。父组件自己决定要不要改 count。">
      <CountBox :count="count" label="库存" @increment="onIncrement" />
    </DemoBlock>

    <DemoBlock title="defineModel" hint="父组件仍持有 nickname。子组件里的输入框通过 defineModel 写回这里。">
      <p>父组件看到：{{ nickname }}</p>
      <NameField v-model="nickname" />
    </DemoBlock>

    <DemoBlock title="插槽" hint="默认插槽放主体，具名插槽 title 还能拿到子组件传出的 item。">
      <SlotCard>
        <template #title="{ item }">正在读 {{ item }}</template>
        <p>这是父组件填进默认插槽的内容。</p>
      </SlotCard>
    </DemoBlock>

    <DemoBlock title="provide / inject" hint="主题没有经过 props 层层下传。ThemeLabel 用同一个 Symbol 取到这个 ref。">
      <div class="row">
        <button type="button" @click="toggleTheme">切换主题</button>
        <ThemeLabel />
      </div>
    </DemoBlock>

    <DemoBlock title="defineExpose 与 useTemplateRef" hint="父组件只能调用子组件 expose 出来的 focus。模板 ref 在挂载之后才有值。">
      <FocusField ref="field" />
      <button type="button" @click="field?.focus()">聚焦子组件输入框</button>
    </DemoBlock>

    <DemoBlock title="响应式 props 解构" hint="子组件把 n 从 props 里解构出来，并带了默认值。改父组件的 passed，子组件的加倍和 watch 会一起变。">
      <div class="row">
        <button type="button" @click="passed++">父组件 passed = {{ passed }}</button>
      </div>
      <DestructureChild :n="passed" />
    </DemoBlock>
  </LabPage>
</template>
