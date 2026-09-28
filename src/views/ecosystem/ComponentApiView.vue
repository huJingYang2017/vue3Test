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

// provide(钥匙, 值) 写在祖先的 setup 里。ThemeKey 只是 Symbol，真正传下去的是这个 ref。
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
    <DemoBlock
      title="props 与 emits"
      scene="评分星星、分页器把「用户点了第几颗」交给父页面。分数存在父页面，提交订单时父页面说了算。"
      hint="数据从父组件流进 props，子组件用事件把意图交还父组件。父组件自己决定要不要改 count。"
    >
      <CountBox :count="count" label="库存" @increment="onIncrement" />
    </DemoBlock>

    <DemoBlock
      title="defineModel"
      scene="输入框、开关做成组件后，父页面用 v-model 收集昵称和是否同意协议，提交时一次性交给接口。"
      hint="父组件仍持有 nickname。子组件里的输入框通过 defineModel 写回这里。"
    >
      <p>父组件看到：{{ nickname }}</p>
      <NameField v-model="nickname" />
    </DemoBlock>

    <DemoBlock
      title="插槽"
      scene="表格的操作列、卡片外壳由组件库提供。删除按钮写什么、标题显示哪篇文章，由业务页面填进去。"
      hint="默认插槽放主体，具名插槽 title 还能拿到子组件传出的 item。"
    >
      <SlotCard>
        <template #title="{ item }">正在读 {{ item }}</template>
        <p>这是父组件填进默认插槽的内容。</p>
      </SlotCard>
    </DemoBlock>

    <DemoBlock
      title="provide / inject"
      scene="主题色、当前语言、表单校验上下文。中间隔了好几层布局，不用每一层都把 props 再传一次。"
      hint="主题没有经过 props 层层下传。ThemeLabel 用同一个 Symbol 取到这个 ref。"
    >
      <ol class="log">
        <li><code>const ThemeKey: InjectionKey&lt;Ref&lt;ThemeName&gt;&gt; = Symbol('theme')</code>：钥匙，用来查找，本身不能调用。</li>
        <li><code>provide(ThemeKey, theme)</code>：写在祖先组件的 setup 里，把这个 ref 挂到钥匙上。</li>
        <li><code>const theme = inject(ThemeKey, null)</code>：写在任意后代里。第二个参数是这条链上没有 provide 时的默认值。</li>
      </ol>
      <p>后代用的是 <code>inject</code> 取回来的 <code>theme</code>。父组件改 <code>theme.value</code>，子组件读到的是同一个 ref。</p>
      <div class="row">
        <button type="button" @click="toggleTheme">切换主题</button>
        <ThemeLabel />
      </div>
    </DemoBlock>

    <DemoBlock
      title="defineExpose 与 useTemplateRef"
      scene="页头的保存按钮调用子表单的 validate()。打开弹层后，让里面的搜索框聚焦。"
      hint="父组件只能调用子组件 expose 出来的 focus。模板 ref 在挂载之后才有值。"
    >
      <FocusField ref="field" />
      <button type="button" @click="field?.focus()">聚焦子组件输入框</button>
    </DemoBlock>

    <DemoBlock
      title="响应式 props 解构"
      scene="分页组件从 props 里解构出 page、pageSize。父页面一改筛选，子组件里的请求参数和页码一起变。"
      hint="子组件把 n 从 props 里解构出来，并带了默认值。改父组件的 passed，子组件的加倍和 watch 会一起变。"
    >
      <div class="row">
        <button type="button" @click="passed++">父组件 passed = {{ passed }}</button>
      </div>
      <DestructureChild :n="passed" />
    </DemoBlock>
  </LabPage>
</template>
