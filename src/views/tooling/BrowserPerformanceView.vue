<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DemoBlock from '@/components/ui/DemoBlock.vue'
import LabPage from '@/components/ui/LabPage.vue'

const moduleUrl = ref('正在从性能记录里找本页的请求')

const screenRows = [
  ['白屏', '页面还没有任何内容，通常只剩浏览器默认背景。', 'HTML 到了，但 #app 仍是空的，Vue 还没把第一块 DOM 画出来。'],
  ['首屏', '不用滚动就能看到的那一屏已经有可用内容。', '侧栏、标题和第一块说明都出现了。下面还要继续滚的内容不算进首屏。'],
  ['首屏里最显眼的一块', '首屏中最大的文字或图片绘制完成。', '性能工具里常叫 LCP。本页没有大图，多半是标题或第一段文字。'],
]

onMounted(() => {
  const hit = performance
    .getEntriesByType('resource')
    .find((entry) => entry.name.includes('BrowserPerformanceView'))
  moduleUrl.value = hit?.name ?? '性能记录里还没有本页文件。刷新后再看一次。'
})
</script>

<template>
  <LabPage>
    <DemoBlock
      title="白屏和首屏不是同一段时间"
      scene="用户点开链接，先盯着一块空白，然后侧栏和标题一起出来。前面那段空白是白屏，内容进入第一屏才算首屏完成。"
      hint="这个项目是浏览器里渲染的 Vue 应用。index.html 里的 #app 一开始是空节点，要等 /src/main.ts 下载并执行完，页面才有东西。"
    >
      <p>
        浏览器收到 HTML 之后，先解析文档、下载 CSS 和 JS，再执行脚本。脚本执行完，Vue 才把组件挂到 <code>#app</code>。从进入页面到这里，屏幕上还没有本站内容，这段就是白屏。
      </p>
      <p>
        首屏是第一屏里用户能读、能点的内容已经画出来。侧栏出现、标题出现，首屏就结束了，即使用户还要往下滚动才能看到后面的章节。白屏结束得早，首屏结束得晚：中间可能已经画出了背景色或一个转圈，但主要内容还没到。
      </p>
      <table class="map">
        <thead>
          <tr>
            <th></th>
            <th>用户看到的</th>
            <th>在这个项目里</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in screenRows" :key="row[0]">
            <td>{{ row[0] }}</td>
            <td>{{ row[1] }}</td>
            <td>{{ row[2] }}</td>
          </tr>
        </tbody>
      </table>
    </DemoBlock>

    <DemoBlock
      title="白屏通常耗在哪"
      scene="接口还没返回时，页面可以先画出标题和骨架。真正把白屏拉长的，是主脚本还没执行完。"
      hint="缩短白屏要让主路径上的 JS 更小、更早执行。首屏数据可以后到，但第一块稳定的界面最好不要等所有接口。"
    >
      <ol class="log">
        <li>HTML 本身很大，或者被服务器堵了很久才发出来。本仓库的 index.html 很短，这一段通常不是主因。</li>
        <li>CSS、字体挡在首次绘制前面。字体用了很重的文件又没给备用字体时，文字会晚一拍出现。</li>
        <li>入口 JS 要下载、解析、执行。路由、状态库、整站都写进入口时，白屏就等于在等这个大文件。</li>
        <li>入口脚本里同步发了很多请求，并且渲染被这些请求挡住。setup 顶层 await 会让组件先不渲染，父级需要 Suspense 的 fallback，否则这块就是空的。</li>
      </ol>
      <p>
        首屏要再往前看一步：最大的那块内容从哪来。如果它是一张大图，白屏结束后用户仍在等图片。如果它是接口返回的列表，骨架可以先占住位置，数据到了再换上真正的行。
      </p>
    </DemoBlock>

    <DemoBlock
      title="懒加载"
      scene="用户打开总览时，不必把生命周期、Pinia、路由守卫这些页的代码一起下载。点到哪一页，再取那一页。"
      hint="懒加载省的是当前用不到的代码和图片。首屏自己要用的脚本和最大图不要懒加载，否则首屏会更慢。"
    >
      <p>
        路由懒加载就是把页面写成函数：<code>() =&gt; import('@/views/...')</code>。打包器给每个这样的页面单独成块。打开网站时只下载当前路由需要的那一块，其余留在服务器上。本仓库 <code>src/router/routes.ts</code> 里每一页都是这种写法。你现在这份说明自己也是打开 <code>/tooling/performance</code> 之后才请求的。
      </p>
      <p class="ok">本页资源：{{ moduleUrl }}</p>
      <p>组件也可以懒加载。一块很少打开的弹层、图表、富文本编辑器，用异步组件包起来，第一次渲染到它时再下载。和路由懒加载是同一件事，只是边界从「一页」收成「一块」。</p>
      <p>
        图片的懒加载用 <code>loading="lazy"</code>，或自己用交叉观察器，等图片接近视口再设置 <code>src</code>。它只适合首屏以下的图。首屏那张最大的图如果也懒加载，浏览器会故意晚一点再去取，前端性能指标 LCP（Largest Contentful Paint） 反而变差。
      </p>
    </DemoBlock>

    <DemoBlock
      title="图片优化"
      scene="商品图、头图、用户相册。原图直接丢进页面，会同时拖慢下载、把后面的字挤得上下跳。"
      hint="先决定这张图是不是首屏最大的那块。是的话尽早下载；不是的话再懒加载、再缩体积。"
    >
      <ol class="log">
        <li>按显示尺寸导出。卡片里只显示 400 像素宽，就不要传 4000 像素的原图。体积差一个数量级。</li>
        <li>用适合网页的格式。照片用 WebP 或 AVIF，图标和简单图形用 SVG。本仓库的站点图标就是 <code>favicon.svg</code>。</li>
        <li>给 <code>img</code> 写上宽高，或用 CSS 留出比例。图片还没到时，浏览器已经知道要占多大地方，文字不会被突然顶下去。</li>
        <li>同一张图准备两三种宽度，用 <code>srcset</code> 和 <code>sizes</code> 让手机下小的、桌面下大的。</li>
        <li>首屏主图加 <code>fetchpriority="high"</code>，并且不要加 <code>loading="lazy"</code>。其余图再懒加载。</li>
      </ol>
    </DemoBlock>

    <DemoBlock
      title="内存泄漏"
      scene="后台开着几十个页签，或一个长列表来回筛选。页面越用越卡，刷新就好，多半是离开页面时还有东西指着旧数据。"
      hint="泄漏是指这块内存本该随组件卸掉而回收，却被还活着的函数、定时器或全局监听抓住了。"
    >
      <p>
        浏览器会回收没有人再引用的对象。组件卸掉之后，只要还有一个定时器、全局事件或观察器拿着它的回调，回调里用到的响应式数据和 DOM 就都不能回收。这就是泄漏。刷新能好，是因为整页的 JavaScript 环境被丢掉了。
      </p>
      <ol class="log">
        <li>
          <code>document.addEventListener</code> 或 <code>window</code> 上的监听。组件没了，监听还在。本仓库的 <code>v-click-outside</code> 在 <code>unmounted</code> 里 <code>removeEventListener</code>。<code>useEventListener</code> 则在 <code>watchEffect</code> 的 <code>onCleanup</code> 里解绑，组件卸载时会走到。
        </li>
        <li><code>setInterval</code>、<code>setTimeout</code> 没清。回调每次都读组件里的 ref，这块组件就一直活着。离开页面前要 <code>clearInterval</code>。</li>
        <li>图表、地图、编辑器有自己的 <code>dispose</code> 或 <code>destroy</code>。只把 DOM 用 <code>v-if</code> 拿掉不够，实例还占着 WebGL 或大量缓存。</li>
        <li><code>ResizeObserver</code>、<code>IntersectionObserver</code>、<code>MutationObserver</code> 要 <code>disconnect</code>。观察器本身会抓住被观察的元素。</li>
        <li>Pinia 的 <code>$subscribe</code>、<code>$onAction</code> 如果在组件里订阅，卸载时会自动取消。在插件里订阅、或传了 <code>detached: true</code>，就要自己留取消函数，在合适的时候调用。</li>
      </ol>
      <p>
        <code>KeepAlive</code> 把切走的组件留在内存里，这是故意的缓存，不是泄漏。泄漏的判断是：你以为它已经结束了，它的回调却还在跑。缓存则是你还打算切回来继续用。缓存太多页时内存也会涨，那就限制缓存数量，而不是到卸载钩子里再销毁。
      </p>
    </DemoBlock>

    <section class="panel">
      <h2>改这个仓库时怎么对上</h2>
      <ul>
        <li>白屏：看 <code>index.html</code> 的空 <code>#app</code>，以及入口 <code>src/main.ts</code> 要先执行完。</li>
        <li>首屏：第一屏是侧栏加当前页标题。下面的长说明不属于首屏。</li>
        <li>懒加载：<code>src/router/routes.ts</code> 的 <code>() =&gt; import(...)</code>。打开别的菜单项时，网络面板里才会出现那个 <code>.vue</code> 或对应的 chunk。</li>
        <li>图片：这个预习台几乎没有内容图。真要加头图时，首屏那张不要懒加载，并写上宽高。</li>
        <li>监听：全局监听走 <code>useEventListener</code> 或在 <code>onUnmounted</code> 里摘掉。指令则像 <code>vClickOutside</code> 一样写在 <code>unmounted</code>。</li>
      </ul>
    </section>
  </LabPage>
</template>
