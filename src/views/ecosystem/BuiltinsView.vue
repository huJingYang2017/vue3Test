<script setup lang="ts">
import { ref } from 'vue'
import SlowPanel from '@/components/async/SlowPanel.vue'
import CachedNote from '@/components/builtin/CachedNote.vue'
import DemoBlock from '@/components/ui/DemoBlock.vue'
import LabPage from '@/components/ui/LabPage.vue'

const open = ref(false)
const showText = ref(true)
const ticket = ref(0)
const alive = ref(true)

function reopen() {
  ticket.value += 1
}
</script>

<template>
  <LabPage>
    <DemoBlock
      title="Teleport"
      hint="defer 等当前组件挂载后再传送。遮罩挂到 body 上，不会被本页的 overflow 或层叠上下文裁切。"
    >
      <button type="button" @click="open = true">打开传送层</button>
      <Teleport to="body" defer>
        <div v-if="open" class="modal-mask" @click.self="open = false">
          <div class="modal" role="dialog" aria-modal="true">
            <h2>这层节点在 body 下</h2>
            <p>检查元素时，它不在 #app 的层级里面。</p>
            <button type="button" @click="open = false">关闭</button>
          </div>
        </div>
      </Teleport>
    </DemoBlock>

    <DemoBlock title="Suspense" hint="SlowPanel 的 setup 使用顶层 await。等待时显示 fallback，改 key 会重新等待。">
      <button type="button" @click="reopen">重新加载异步组件</button>
      <Suspense>
        <SlowPanel :key="ticket" />
        <template #fallback>
          <p class="pending">异步组件正在等待 setup 里的 await。</p>
        </template>
      </Suspense>
    </DemoBlock>

    <DemoBlock title="KeepAlive" hint="切走再切回来，输入框里的文字还在。没有 KeepAlive 时，v-if 会把输入框销毁。">
      <button type="button" @click="alive = !alive">{{ alive ? '卸下' : '装回' }}</button>
      <KeepAlive>
        <CachedNote v-if="alive" />
      </KeepAlive>
    </DemoBlock>

    <DemoBlock title="Transition" hint="name=&quot;rise&quot; 会使用 rise-enter-active、rise-enter-from 这些类名。样式写在 src/styles/main.css。">
      <button type="button" @click="showText = !showText">切换文字</button>
      <Transition name="rise">
        <p v-if="showText" class="pill">这段文字带进入和离开过渡</p>
      </Transition>
    </DemoBlock>
  </LabPage>
</template>
