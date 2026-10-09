import { reactive } from 'vue'

export interface NavLine {
  id: number
  text: string
}

let seed = 0

/** 路由钩子共用的导航日志。放在模块作用域，守卫和页面能读到同一份。 */
export const navLog = reactive<NavLine[]>([])

export function pushNav(text: string) {
  const clock = new Date().toLocaleTimeString()
  navLog.unshift({ id: ++seed, text: `${clock}  ${text}` })//将新日志添加到数组开头
  if (navLog.length > 12) navLog.pop()//如果日志长度大于12，则删除最后一个
}
