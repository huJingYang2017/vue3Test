<script setup lang="ts">
/**
 * defineModel 是 Vue 3.4 起的双向绑定宏。
 * 不传名字时对应父组件的 v-model；父组件写 v-model:count 时，这里就 defineModel('count')。
 * 返回值是一个可写的 ref，改它会向父组件发出 update:modelValue。
 */
const model = defineModel<string>({ default: '' })
</script>

<template>
  <label class="field">
    <span>子组件里的 v-model</span>
    <input v-model="model" type="text" autocomplete="off" />
  </label>
</template>
