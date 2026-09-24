<script setup lang="ts">
import { ref, useId } from 'vue'
import { useTemplateRef } from 'vue'
import DemoBlock from '@/components/ui/DemoBlock.vue'
import LabPage from '@/components/ui/LabPage.vue'
import { vClickOutside } from '@/directives/vClickOutside'
import { directiveTrace, vTrace } from '@/directives/vTrace'

/**
 * useId 生成当前应用内稳定的 id，用来关联 label 和 input。
 * 服务端渲染时同一段模板会得到相同 id；在这个纯客户端项目里，它仍然避免手写容易重复的字符串。
 * useTemplateRef 的参数必须和模板 ref 的名字一致。Vue 3.5 推荐它，而不是再声明一个同名 ref。
 */
const fieldId = useId()
const query = useTemplateRef<HTMLInputElement>('query')
const menuOpen = ref(false)
const traceOn = ref(true)
const traceTick = ref(0)

function focusQuery() {
  query.value?.focus()
}

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <LabPage>
    <DemoBlock title="useId 与 useTemplateRef" hint="全局还注册了 v-focus。带 false 时指令不会在挂载时抢焦点。">
      <label class="field" :for="fieldId">
        <span>昵称</span>
        <input :id="fieldId" v-focus="false" class="text" type="text" />
      </label>
      <div class="row">
        <input ref="query" class="text" type="text" placeholder="模板引用" />
        <button type="button" @click="focusQuery">聚焦</button>
      </div>
    </DemoBlock>

    <DemoBlock title="v-click-outside" hint="指令在 mounted 里监听 document，在 unmounted 里移除。点按钮外部会关闭菜单。">
      <div class="row">
        <button type="button" @click="menuOpen = true">打开菜单</button>
      </div>
      <div v-if="menuOpen" v-click-outside="closeMenu" class="panel">
        <p>点这一块的外面，菜单会关掉。</p>
      </div>
    </DemoBlock>

    <DemoBlock
      title="指令钩子"
      hint="v-trace 会在指令的 created、beforeMount、mounted、beforeUpdate、updated、beforeUnmount、unmounted 时记一行。改数字会触发 update。"
    >
      <div class="row">
        <button type="button" @click="traceOn = !traceOn">{{ traceOn ? '卸下节点' : '挂上节点' }}</button>
        <button type="button" @click="traceTick++">触发更新 {{ traceTick }}</button>
      </div>
      <p v-if="traceOn" v-trace>被追踪的段落 {{ traceTick }}</p>
      <ol v-if="directiveTrace.length" class="log">
        <li v-for="(line, index) in directiveTrace" :key="`${line}-${index}`">{{ line }}</li>
      </ol>
    </DemoBlock>
  </LabPage>
</template>
