<script setup lang="ts">
import { inject, ref } from "vue";
import { ThemeKey, type ThemeName } from "./theme";
const item = ref("第二章 · 响应式");

const theme = inject(ThemeKey, ref<ThemeName>("墨色"));

function toggleTheme() {
  theme!.value = theme!.value === "墨色" ? "纸色" : "墨色";
}
/**
 * defineSlots 只提供类型，运行时会被编译器拿掉。
 * 具名插槽把 item 传出去，父组件用 #title="{ item }" 接收。
 * 插槽上的默认内容会在父组件没有提供该插槽时显示。
 */
defineSlots<{
  title(props: { item: string }): unknown;
  default(): unknown;
}>();
</script>

<template>
  <article class="slot-card">
    <header>
      <p>主题：{{ theme }}</p>
      <button type="button" @click="toggleTheme">子组件内切换主题</button>
      <br />
      <slot name="title" :item="item">还没有标题插槽</slot>
    </header>
    <slot>还没有默认插槽</slot>
  </article>
</template>
