import { ref, type Directive } from 'vue'

/** 指令自己的生命周期日志，页面直接读这份 ref。 */
export const directiveTrace = ref<string[]>([])

function mark(hook: string, el: HTMLElement) {
  directiveTrace.value = [`${hook} <${el.tagName.toLowerCase()}>`, ...directiveTrace.value].slice(0, 8)
}

/**
 * Vue 3 指令钩子和组件生命周期同名：
 * created → beforeMount → mounted → beforeUpdate → updated → beforeUnmount → unmounted。
 * Vue 2 的 bind / inserted / update / componentUpdated / unbind 已经换成这套名字。
 */
export const vTrace: Directive<HTMLElement> = {
  created(el) {
    mark('created', el)
  },
  beforeMount(el) {
    mark('beforeMount', el)
  },
  mounted(el) {
    mark('mounted', el)
  },
  beforeUpdate(el) {
    mark('beforeUpdate', el)
  },
  updated(el) {
    mark('updated', el)
  },
  beforeUnmount(el) {
    mark('beforeUnmount', el)
  },
  unmounted(el) {
    mark('unmounted', el)
  },
}
