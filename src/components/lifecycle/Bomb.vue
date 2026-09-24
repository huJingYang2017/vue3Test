<script setup lang="ts">
defineOptions({ name: 'Bomb' })

function explode() {
  throw new Error('子组件点击回调抛出的错误')
}
</script>

<template>
  <button type="button" class="danger" @click="explode">让子组件抛错</button>
</template>
