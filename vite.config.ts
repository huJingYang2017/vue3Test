import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// Vite 8 默认使用 Rolldown 打包。别名 @ 让示例可以写成 @/stores/counter，
// 避免一层层的相对路径。面试里常把 alias、环境变量、插件称作「工程化」。
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
