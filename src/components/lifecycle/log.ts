import type { InjectionKey } from 'vue'

export interface LifeLogger {
  push: (source: string, hook: string) => void
}

export const LifeLogKey: InjectionKey<LifeLogger> = Symbol('life-log')
// hjy test 