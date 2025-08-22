import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import App from './App.vue'
import './style.css'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./components/HelloWorld.vue')
  }
]

let app: ReturnType<typeof createApp> | null = null
let router: ReturnType<typeof createRouter> | null = null
let history: ReturnType<typeof createWebHistory> | null = null

// 创建 Vue 应用实例的函数
function render(props: any = {}) {
  const { container, baseRoute } = props
  
  // 创建路由实例，处理基础路径
  history = createWebHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? baseRoute : '/')
  router = createRouter({
    history,
    routes
  })
  
  // 创建 Vue 应用实例
  app = createApp(App)
  app.use(router)
  
  // 挂载应用
  const targetContainer = qiankunWindow.__POWERED_BY_QIANKUN__ ? container : document.getElementById('app')
  app.mount(targetContainer)
}

// qiankun 生命周期钩子
renderWithQiankun({
  // 应用初始化
  mount(props) {
    console.log('AI News App mounted with props:', props)
    render(props)
    
    // 通知主应用子应用已加载完成
    if (props.actions) {
      // 延迟一点时间确保应用完全渲染
      setTimeout(() => {
        if (props.actions.setLoading) {
          props.actions.setLoading(false)
        }
      }, 100)
    }
  },
  // 应用启动
  bootstrap() {
    console.log('AI News App bootstrapped')
  },
  // 应用更新
  update(props) {
    console.log('AI News App updated with props:', props)
  },
  // 应用卸载
  unmount() {
    console.log('AI News App unmounted')
    app?.unmount()
    app = null
    router = null
    history = null
  }
})

// 如果不在 qiankun 环境中，则直接渲染
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render()
}