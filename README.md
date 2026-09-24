# Vue3 预习台

一套用来预习 Vue 3 最新脚手架和生态的本地项目：Vue 3.5、Vite 8、TypeScript、Pinia 4、Vuex 4、Vue Router 5。

Pinia 是现在的官方状态库。Vuex 留在项目里，是为了把 mutation、命名空间和严格模式这些面试题落到可以点击的例子上。

## 环境

Vite 8 需要 Node.js `^20.19.0` 或 `>=22.12.0`。仓库根目录的 `.nvmrc` 写的是 `22.23.2`。

```bash
nvm install 22.23.2
nvm use 22.23.2
npm install
npm run dev
```

浏览器打开终端里打印的本地地址。生产构建用 `npm run build`。

## 怎么预习

侧栏从上往下读。每一页都能点，说明写在该页的 `<script setup>` 和对应的 `src/composables`、`src/stores` 里。

1. 响应式：`ref`、`reactive`、`toRef` / `toRefs`、`shallow*`、`readonly`、`computed`、`watch`
2. 生命周期：挂载顺序、`nextTick`、`KeepAlive`、`onErrorCaptured`
3. 组合式函数：`useToggle`、`useLocalStorage`、`useDebouncedRef`、`useFetch` 等
4. 状态管理：Pinia、Vuex，以及同一需求的左右对照
5. 生态链：组件通信、路由守卫、Teleport / Suspense / KeepAlive / Transition、自定义指令、`useTemplateRef`、`useId`

面试前可以先看「面试速查」。

## 目录

```text
src/router          路由表和全局守卫
src/stores          Pinia 的 counter / user / cart，以及 Vuex 根状态和 cart 模块
src/composables     日常组合式函数
src/components      演示用的子组件、探针和异步组件
src/views           每一页一个主题
src/directives      v-focus、v-click-outside、v-trace
```

环境变量在 `.env`：只有 `VITE_` 开头的变量会进入 `import.meta.env`。
