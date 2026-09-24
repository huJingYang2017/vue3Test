import type { InjectionKey, Ref } from 'vue'

export type ThemeName = '墨色' | '纸色'

export const ThemeKey: InjectionKey<Ref<ThemeName>> = Symbol('theme')
