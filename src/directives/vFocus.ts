import type { Directive } from 'vue'

/**
 * 本地指令：在 script setup 里把变量命名为 vFocus，模板就能写 v-focus。
 * main.ts 里又 app.directive('focus', vFocus) 注册了全局指令，两种用法并存。
 * 指令钩子拿到的是真实 DOM 元素。binding.value 是等号右边的值。
 */
export const vFocus: Directive<HTMLElement, boolean | undefined> = {
  mounted(el, binding) {
    if (binding.value === false) return
    el.focus()
  },
}
