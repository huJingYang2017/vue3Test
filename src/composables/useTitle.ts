import { onScopeDispose, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'

/**
 * 跟随一个标题源改 document.title。
 * onScopeDispose 在当前组件卸载、或外层 effectScope.stop() 时运行。
 * 路由 beforeEach 也会写标题，所以只有标题仍是我们设置的那句时才恢复。
 */
export function useTitle(title: MaybeRefOrGetter<string>) {
  const previous = document.title

  watchEffect(() => {
    document.title = toValue(title)
  })

  onScopeDispose(() => {
    if (document.title === toValue(title)) document.title = previous
  })
}
