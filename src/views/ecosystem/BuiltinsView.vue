<script setup lang="ts">
import { ref } from 'vue'
import SlowPanel from '@/components/async/SlowPanel.vue'
import CachedNote from '@/components/builtin/CachedNote.vue'
import DemoBlock from '@/components/ui/DemoBlock.vue'
import LabPage from '@/components/ui/LabPage.vue'

const open = ref(false)
const localOpen = ref(false)
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
      scene="弹层要盖住整页。留在父组件里时，父级的 overflow 和 transform 会把它裁掉；送到 body 之后，这些祖先影响不到它。"
      hint="传送到 body 不用 defer，body 在页面打开时就存在。defer 只用在目标节点写在 Teleport 后面：渲染到 Teleport 时那个节点还不在文档里，要等当前组件挂载完再找。不加 defer，控制台会报找不到目标。"
    >
      <div class="teleport-demo">
        <div class="clip-box">
          <p>这个盒子有 overflow: hidden 和 transform。浮层仍是它的子节点。</p>
          <button type="button" @click="localOpen = true">在盒子里打开</button>
          <div v-if="localOpen" class="local-pop">
            <p>上半截还在盒子里。</p>
            <p>下半截超出了父级，被裁掉了，所以盖不住页面。</p>
            <button type="button" @click="localOpen = false">关闭</button>
          </div>
        </div>
        <div>
          <button type="button" @click="open = true">传送到 body</button>
          <Teleport to="body">
            <div v-if="open" class="modal-mask" @click.self="open = false">
              <div class="modal" role="dialog" aria-modal="true">
                <h2>这层节点在 body 下</h2>
                <p>检查元素时，它不在这个盒子里，也不在 #app 的层级里面。父级因此裁不到它。</p>
                <button type="button" @click="open = false">关闭</button>
              </div>
            </div>
          </Teleport>
        </div>
      </div>
      <div class="defer-demo">
        <p>这句写在 Teleport 里。目标节点在模板的更后面，所以这里带了 defer。</p>
        <!-- defer 要解决的是目标节点出现得更晚。比如 Teleport 写在模板前面，目标元素写在同一个组件的后面： 
         <Teleport defer to="#dialog-root">...</Teleport>
         <div id="dialog-root"></div>
        -->
        <Teleport defer to="#builtin-teleport-target">
          <span class="pill">我被送到了后面的目标节点里。</span>
        </Teleport>
        <div id="builtin-teleport-target" class="late-target">
          <span class="late-label">目标节点</span>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      title="Suspense"
      scene="路由页面在 setup 里直接 await 首屏接口。数据还没到时先显示骨架屏，到了再换成真正内容。"
      hint="SlowPanel 的 setup 使用顶层 await。等待时显示 fallback，改 key 会重新等待。"
    >
      <button type="button" @click="reopen">重新加载异步组件</button>
      <Suspense>
        <SlowPanel :key="ticket" />
        <template #fallback>
          <p class="pending">异步组件正在等待 setup 里的 await。</p>
        </template>
      </Suspense>
    </DemoBlock>

    <DemoBlock
      title="KeepAlive"
      scene="后台多页签、分步向导的上一步。切走再回来，输入框里已经填的字还在，不用重新请求才能看到。"
      hint="切走再切回来，输入框里的文字还在。没有 KeepAlive 时，v-if 会把输入框销毁。"
    >
      <button type="button" @click="alive = !alive">{{ alive ? '卸下' : '装回' }}</button>
      <KeepAlive>
        <CachedNote v-if="alive" />
      </KeepAlive>
    </DemoBlock>

    <DemoBlock
      title="Transition"
      scene="抽屉、下拉菜单、提示条出现和消失时淡入淡出。用户能看清是哪一块刚打开，而不是突然冒出来。"
      hint="name=&quot;rise&quot; 会使用 rise-enter-active、rise-enter-from 这些类名。样式写在 src/styles/main.css。"
    >
      <button type="button" @click="showText = !showText">切换文字</button>
      <Transition name="rise">
        <p v-if="showText" class="pill">这段文字带进入和离开过渡</p>
      </Transition>
    </DemoBlock>
  </LabPage>
</template>
