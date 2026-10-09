/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_API_BASE: string
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    group: string
    file: string
    summary: string
    nav?: string
  }
}

export {}
