import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import App from './App.vue'
import './style.css'

// 定义动态公共路径变量
// Vite不使用webpack，所以需要自己定义这个变量
// @ts-ignore
window.__INJECTED_PUBLIC_PATH__ = '/'

// 确保在qiankun环境中正确加载资源
if (qiankunWindow.__POWERED_BY_QIANKUN__) {
  // 动态设置公共路径
  // @ts-ignore
  window.__INJECTED_PUBLIC_PATH__ = qiankunWindow.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
  console.log('Running in qiankun mode, public path:', window.__INJECTED_PUBLIC_PATH__)
  
  // 开发环境特殊处理
  if (import.meta.env.DEV) {
    console.log('Running in development qiankun mode')
    // 在开发环境中，需要特殊处理Vite的HMR客户端
    // 这里不做任何处理，让Vite的开发服务器正常工作
  } else {
    // 生产环境下，为了解决MIME类型问题，手动设置资源类型
    const setResourceType = () => {
      const scripts = document.querySelectorAll('script');
      scripts.forEach(script => {
        if (script.type !== 'module' && !script.type) {
          script.type = 'application/javascript';
        }
      });
    };
    
    // 在DOM更新后执行
    setTimeout(setResourceType, 100);
  }
} else if (import.meta.env.PROD) {
  // 在生产环境下，如果不是在qiankun环境中，则设置正确的资源路径
  // @ts-ignore
  window.__INJECTED_PUBLIC_PATH__ = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1)
  console.log('Running in production standalone mode, public path:', window.__INJECTED_PUBLIC_PATH__)
} else {
  // 在开发环境下，如果不是在qiankun环境中，则设置正确的资源路径
  // @ts-ignore
  window.__INJECTED_PUBLIC_PATH__ = '/'
  console.log('Running in development standalone mode, public path: /')
}

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
  const basePath = qiankunWindow.__POWERED_BY_QIANKUN__ ? baseRoute : import.meta.env.BASE_URL || '/'
  history = createWebHistory(basePath)
  router = createRouter({
    history,
    routes
  })
  
  // 创建 Vue 应用实例
  app = createApp(App)
  app.use(router)
  
  // 挂载应用
  const targetContainer = qiankunWindow.__POWERED_BY_QIANKUN__ ? container : document.getElementById('app')
  app.mount(targetContainer instanceof Element ? targetContainer : '#app')
}

// 定义qiankun生命周期钩子的参数类型
interface QiankunProps {
  container?: HTMLElement;
  baseRoute?: string;
  actions?: {
    setLoading?: (loading: boolean) => void;
    [key: string]: any;
  };
  [key: string]: any;
}

// qiankun 生命周期钩子
renderWithQiankun({
  // 应用初始化
  mount(props: QiankunProps) {
    console.log('AI News App mounted with props:', props)
    render(props)
    
    // 通知主应用子应用已加载完成
    if (props.actions) {
      // 延迟一点时间确保应用完全渲染
      setTimeout(() => {
        if (props.actions?.setLoading) {
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
  update(props: QiankunProps) {
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