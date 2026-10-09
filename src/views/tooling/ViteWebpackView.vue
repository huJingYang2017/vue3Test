<script setup lang="ts">
import DemoBlock from '@/components/ui/DemoBlock.vue'
import LabPage from '@/components/ui/LabPage.vue'

const hotOn = import.meta.hot != null

const rows = [
  ['角色', '打包器。开发和生产都从入口把依赖图打成包。', '开发服务器加构建工具。默认开发时不打包你的源码，生产才打包。'],
  ['第一次打开页面', '先解析完整张图、跑 loader、打出 bundle，服务器才能送页面。', '服务器马上起来。浏览器请求哪个模块，Vite 才转换哪个模块。'],
  ['你的源码', 'babel-loader、ts-loader、vue-loader 在打包流水线里转换。', '原生 ESM。JS/TS 由 Oxc 转换，.vue 由 @vitejs/plugin-vue 拆开。'],
  ['node_modules', '和业务代码一起进同一张依赖图。', '启动时用 Rolldown 预构建一次，缓存到 node_modules/.vite，避免浏览器逐个请求大量 CJS 小文件。'],
  ['生产构建', 'Webpack 自己打包、拆 chunk、压缩。', 'Rolldown 打包。JS 压缩用 Oxc，CSS 压缩用 Lightning CSS。'],
  ['改一个文件', '按模块 id 打一份 hot update，再沿着 chunk 里的依赖往上找接收方。', '按文件 URL 失效模块图，沿着 import 往上找 import.meta.hot.accept 的边界。'],
  ['热更新 API', 'module.hot.accept，只存在于开发 bundle。', 'import.meta.hot.accept。生产构建会把 import.meta.hot 去掉。'],
]
</script>

<template>
  <LabPage>
    <DemoBlock
      title="各自在干什么"
      scene="本地改一行样式就想马上看见，同时生产包又要合并、压缩、按路由拆开。这两件事对工具的要求不一样。"
      hint="本仓库是 Vite 8。开发服务器默认仍是按需转换的原生 ESM，没有打开实验性的 bundled dev。"
    >
      <p>
        Webpack 是打包器。它从入口出发，把能走到的文件收成一张依赖图，再用 loader 转换、用插件改产物，最后给出浏览器能运行的包。开发服务器发送的也是这份包，所以第一次启动要等打包走完。
      </p>
      <p>
        Vite 把「开发时尽快看到页面」和「生产时给出优化过的包」拆开。开发时浏览器自己按
        <code>import</code> 拉模块，Vite 只转换当前请求的那一个文件。生产构建才把项目交给 Rolldown 打成包。Vite 7 及以前，开发预构建和语法转换用 esbuild，生产打包用 Rollup。Vite 8 把预构建和生产打包都换成了 Rolldown，语法转换和 JS 压缩换成了 Oxc。
      </p>
      <p v-if="hotOn" class="ok">当前页面跑在开发服务器里，<code>import.meta.hot</code> 存在。生产构建里这句会是 false。</p>
    </DemoBlock>

    <section class="panel">
      <h2>对照</h2>
      <table class="map">
        <thead>
          <tr>
            <th></th>
            <th>Webpack</th>
            <th>Vite 8</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row[0]">
            <td>{{ row[0] }}</td>
            <td>{{ row[1] }}</td>
            <td>{{ row[2] }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <DemoBlock
      title="冷启动到第一屏"
      scene="项目有几百个文件时，Webpack 要先把图走完；Vite 先让你看到入口，其余模块等浏览器真的 import 了再转换。"
      hint="依赖预构建只针对 node_modules。src 里的业务文件不会在启动时被打成一个大包。"
    >
      <div class="grid-2">
        <div>
          <h3>Webpack</h3>
          <ol class="log">
            <li>从 webpack.config 的 entry 开始解析 import / require。</li>
            <li>每个文件交给对应 loader：TypeScript、Vue 单文件、CSS。</li>
            <li>插件可以改模块图和最终资源。</li>
            <li>打出 bundle。模块在包里用数字 id 互相引用。</li>
            <li>dev server 把这个包发给浏览器。之后的热更新也基于这份已打包的图。</li>
          </ol>
        </div>
        <div>
          <h3>Vite</h3>
          <ol class="log">
            <li>先用 Rolldown 把依赖预构建成少量 ESM，结果缓存在 node_modules/.vite。</li>
            <li>浏览器请求 /src/main.ts。Vite 用 Oxc 把 TypeScript 转成 JS，并把 import 改写成浏览器能请求的 URL。</li>
            <li>浏览器再按 import 逐个请求。遇到 .vue，插件把 script、template、style 拆开，样式变成一段会插入 CSS 的 JS。</li>
            <li>路径别名 @ 在转换时被解析成真实文件。本仓库的配置在 vite.config.ts。</li>
            <li>执行 vite build 时才走 Rolldown：合并模块、拆 chunk、压缩。</li>
          </ol>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      title="热更新要保住什么"
      scene="改一个按钮文案或一行样式时，不想整页刷新。刷新会丢掉输入框里的字、Pinia 里的计数和还没提交的表单。"
      hint="热更新换的是模块代码。没有任何模块声明自己能接收这次更新时，只能整页刷新。"
    >
      <p>
        热更新（HMR）的目标是：文件变了，只把受影响的模块换成新代码，并让已经接住这次更新的模块自己决定怎么用新代码。页面上没被换掉的状态还留着。
      </p>
      <p>
        模块图里每个文件都知道谁 import 了它。改动从被保存的文件开始，沿着「谁引用了我」往上走，直到遇见一个声明了「我能接收更新」的模块。这个模块叫热更新边界。边界自己的代码会重新执行；边界外面的模块不用卸载。
      </p>
    </DemoBlock>

    <DemoBlock
      title="Vite 的热更新"
      scene="保存 src/stores/counter.ts 时，计数不要归零。保存一个 .vue 的样式时，组件里已经输入的文字还在。"
      hint="开发服务器和浏览器之间有一条 WebSocket。消息里带的是文件 URL 和新的时间戳，用来绕过浏览器缓存。"
    >
      <ol class="log">
        <li>监视到文件保存。Vite 在服务端模块图里把这个模块标成失效，同时失效依赖它的、且自己不能单独接收更新的模块。</li>
        <li>从失效模块往上找边界。文件里写了 <code>import.meta.hot.accept(...)</code>，它自己就是边界。Vue 单文件组件由插件自动 accept：模板变化会重渲染并保留状态，script 变化通常会换掉该组件实例，样式变化只替换 CSS。</li>
        <li>找不到任何边界，就告诉浏览器整页刷新。这常发生在你改了 main.ts，或者一个被很多页面引用、却没有 accept 的工具模块。</li>
        <li>找到边界后，服务器通过 WebSocket 发送 update。内容大致是：哪个文件变了、由哪个已加载模块接收、用什么时间戳重新请求。</li>
        <li>浏览器里的 Vite 客户端给该模块 URL 加上时间戳再 import 一次，拿到新代码，然后调用 accept 回调。</li>
        <li>本仓库的 <code>src/stores/counter.ts</code> 用 <code>acceptHMRUpdate</code> 作为回调。Pinia 用新的 store 定义换掉旧定义，已经创建的 store 状态尽量保留。这段代码只在开发环境存在，生产构建会删掉。</li>
      </ol>
    </DemoBlock>

    <DemoBlock
      title="Webpack 的热更新"
      scene="老项目用 webpack-dev-server。改一个组件时，它不会按浏览器里的文件 URL 去替换，而是在已经打好的包里按模块 id 打补丁。"
      hint="补丁是两份小文件：一份清单说明哪些模块 id 变了，一份 JS 提供这些模块的新代码。"
    >
      <ol class="log">
        <li>保存文件后，Webpack 重新编译受影响的模块，不重新输出整个 bundle。</li>
        <li>编译结果多一个 hash。dev server 用 WebSocket 把新 hash 告诉页面里的 HMR runtime。</li>
        <li>runtime 下载 <code>*.hot-update.json</code>，里面是这次变更的模块 id 列表，再下载对应的 <code>*.hot-update.js</code>。</li>
        <li>对每个变更模块调用 <code>module.hot.accept</code>。vue-loader、style-loader 会在编译期帮组件和样式加上接收逻辑。</li>
        <li>若沿着引用一直走到入口，仍然没有模块接收，runtime 退回整页刷新。</li>
      </ol>
      <p>
        和 Vite 的差别在于身份和粒度。Webpack 的模块身份是 bundle 里的数字 id，更新以补丁 chunk 的形式打进已经运行的包。Vite 的模块身份就是那个文件的 URL，更新是再请求一次这个 URL。两边都是「自下而上找接收者，找不到就刷新」。
      </p>
    </DemoBlock>

    <section class="panel">
      <h2>改这个仓库时会看到什么</h2>
      <ul>
        <li>只改 <code>.vue</code> 的 <code>&lt;style&gt;</code>：样式换掉，组件状态还在。</li>
        <li>改 <code>.vue</code> 的模板：这个组件重渲染，状态通常还在。</li>
        <li>改 <code>.vue</code> 的 script：这个组件会按新脚本重新创建，它自己的局部状态会重置。父页面和其他组件不受影响。</li>
        <li>改带了 <code>acceptHMRUpdate</code> 的 store：store 的新动作生效，已有状态尽量保留。</li>
        <li>改 <code>main.ts</code>、<code>router/index.ts</code> 这类没有接收边界、又被应用根引用的文件：整页刷新。</li>
        <li>执行 <code>vite build</code> 之后没有热更新。那是 Rolldown 打出来的静态文件，里面没有 <code>import.meta.hot</code>。</li>
      </ul>
    </section>
  </LabPage>
</template>
