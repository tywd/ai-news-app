<script setup lang="ts">
// 导入样式隔离文件
import './style.css';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

// 检测是否在qiankun环境中运行
const isQiankun = qiankunWindow.__POWERED_BY_QIANKUN__;
</script>

<template>
  <div class="ai-news-app" :data-qiankun="isQiankun ? 'true' : 'false'">
    <header v-if="!isQiankun" class="app-header">
      <h1>AI News App</h1>
      <p>独立运行模式</p>
    </header>
    <router-view />
  </div>
</template>

<style scoped>
/* 使用特定的命名空间避免样式冲突 */
.ai-news-app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
  padding: 0;
}
</style>
