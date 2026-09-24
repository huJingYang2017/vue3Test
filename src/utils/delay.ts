/** 教学用延时。真实请求里会换成 fetch 的等待时间。 */
export function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}
