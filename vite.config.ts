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
  base: '/',
  build: {
    // 确保正确生成资源路径
    assetsDir: 'assets',
    // 确保生成ES模块
    target: 'esnext',
    // 确保正确处理CSS
    cssCodeSplit: false,
    // 确保正确处理静态资源
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // 确保生成的资源使用相对路径
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  }
})