import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    qiankun('ai-news-app', {
      useDevMode: mode === 'development' // 根据环境动态设置，兼容开发和生产环境
    })
  ],
  server: {
    port: 5175, // 与主应用中配置的端口一致
    cors: true,
    origin: 'http://localhost:5175',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/javascript; charset=utf-8'
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  // 生产环境下的基础路径，用于部署到 Vercel
  base: '/',  // 使用绝对路径而不是相对路径
  build: {
    // 确保正确生成资源路径
    assetsDir: 'assets',
    // 确保生成ES模块
    target: 'esnext',
    // 确保正确处理CSS
    cssCodeSplit: false,
    // 确保资源能够被正确加载
    modulePreload: {
      polyfill: true
    },
    // 确保正确处理静态资源
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // 确保所有文件都使用正确的扩展名
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/\.(css|svg|png|jpe?g|gif|webp)$/.test(assetInfo.name)) {
            return `assets/[name].[hash].[ext]`;
          }
          // 所有其他文件都使用.js扩展名
          return `assets/[name].[hash].js`;
        },
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        // 确保生成的资源使用正确的MIME类型
        format: 'es'
      }
    }
  }
}))
