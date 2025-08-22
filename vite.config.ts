import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    qiankun('ai-news-app', {
      useDevMode: true
    })
  ],
  server: {
    port: 5175, // 与主应用中配置的端口一致
    cors: true,
    origin: 'http://localhost:5175'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 生产环境下的基础路径，用于部署到 Vercel
  base: process.env.NODE_ENV === 'production' ? '/ai-news-app/' : '/'
})