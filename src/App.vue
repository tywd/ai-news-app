<script setup lang="ts">
// 导入样式隔离文件
import './style.css';
</script>

<template>
  <div class="ai-news-app">
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
