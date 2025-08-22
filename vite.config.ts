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
    port: 5177, // 更新为当前实际运行的端口
    cors: true,
    origin: 'http://localhost:5177',
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
  base: mode === 'development' ? '/' : './', // 开发环境使用绝对路径，生产环境使用相对路径
  build: {
    // 确保正确生成资源路径
    assetsDir: 'assets',
    // 确保生成ES模块
    target: 'esnext',
    // 确保正确处理CSS
    cssCodeSplit: false,
    // 禁用modulePreload，避免可能的MIME类型问题
    modulePreload: false,
    // 确保正确处理静态资源
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // 确保所有文件都使用正确的扩展名
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.name || '';
          if (/\.(css|svg|png|jpe?g|gif|webp)$/.test(fileName)) {
            return `assets/[name].[hash].[ext]`;
          }
          // 所有其他文件都使用.js扩展名
          return `assets/[name].[hash].js`;
        },
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        // 确保生成的资源使用正确的MIME类型
        format: 'es',
        // 添加额外的输出选项
        generatedCode: {
          constBindings: true,
          objectShorthand: true
        },
        // 确保正确处理外部依赖
        inlineDynamicImports: false
      },
      // 确保Vue被正确处理
      external: []
    },
    // 使用esbuild压缩器
    minify: 'esbuild',
    // 确保生成sourcemap以便调试
    sourcemap: true
  },
  // 添加预览配置
  preview: {
    port: 8889,
    host: true,
    strictPort: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/javascript; charset=utf-8'
    }
  }
}))