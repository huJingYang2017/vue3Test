import { ref } from 'vue'
import { useEventListener } from './useEventListener'

/** 跟踪指针在视口中的坐标。组件卸载时，内部的 watchEffect 会一起停止。 */
export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'pointermove', (event) => {
    if (!(event instanceof PointerEvent)) return
    x.value = event.clientX
    y.value = event.clientY
  })

  return { x, y }
}
