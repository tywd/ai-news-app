<script setup lang="ts">
import { ref, computed } from 'vue'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

const title = ref('AI 新闻应用')
const description = ref('这是一个基于 qiankun 微前端架构的 Vue3 子应用')

// 使用 composition API 计算属性
const isQiankun = computed(() => qiankunWindow.__POWERED_BY_QIANKUN__)
const qiankunMode = computed(() => isQiankun.value ? '微前端模式' : '独立运行模式')
const currentTime = ref(new Date().toLocaleString())

// 更新时间
setInterval(() => {
  currentTime.value = new Date().toLocaleString()
}, 1000)
</script>

<template>
  <div class="hello-world">
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    <div class="card">
      <p>
        这个子应用已成功接入到 qiankun 主应用中
      </p>
      <p>
        当前运行模式: <span class="mode">{{ qiankunMode }}</span>
      </p>
      <p>
        当前时间: {{ currentTime }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.hello-world {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem;
}

h1 {
  font-size: 2.6rem;
  margin-bottom: 1rem;
  color: #4a5568;
}

.card {
  padding: 2em;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}
</style>