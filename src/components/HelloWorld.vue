<script setup lang="ts">
import { ref } from 'vue'

const title = ref('AI 新闻应用')
const description = ref('这是一个基于 qiankun 微前端架构的 Vue3 子应用')
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
        当前运行模式: {{ qiankunMode }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

export default {
  name: 'HelloWorld',
  computed: {
    qiankunMode() {
      // 使用 qiankunWindow 而不是直接访问 window
      return qiankunWindow.__POWERED_BY_QIANKUN__ ? '微前端模式' : '独立运行模式'
    }
  }
}
</script>

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