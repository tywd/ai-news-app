import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import App from './App.vue'
import './style.css'

// 定义动态公共路径变量
// @ts-ignore
window.__INJECTED_PUBLIC_PATH__ = '/'

// 创建一个全局错误处理函数，用于处理所有类型的资源加载错误
const handleResourceError = (event: Event | ErrorEvent) => {
  const target = event.target as HTMLElement;
  if (target && target.tagName === 'SCRIPT') {
    console.error('Script loading error detected:', (event as ErrorEvent).message || 'Unknown error');
    
    // 尝试重新加载脚本，使用正确的MIME类型
    const scriptSrc = (target as HTMLScriptElement).src;
    if (scriptSrc) {
      console.log('Attempting to reload script with correct MIME type:', scriptSrc);
      
      // 移除原始脚本
      target.remove();
      
      // 创建新的脚本元素
      const newScript = document.createElement('script');
      newScript.src = `${scriptSrc}?t=${Date.now()}`; // 添加时间戳避免缓存
      newScript.type = 'application/javascript';
      newScript.crossOrigin = 'anonymous';
      
      // 添加加载和错误处理
      newScript.onload = () => console.log('Script successfully reloaded:', scriptSrc);
      newScript.onerror = () => console.error('Failed to reload script:', scriptSrc);
      
      // 添加到文档
      document.head.appendChild(newScript);
      
      // 阻止错误继续传播
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }
};

// 确保在qiankun环境中正确加载资源
if (qiankunWindow.__POWERED_BY_QIANKUN__) {
  // 动态设置公共路径
  // @ts-ignore
  window.__INJECTED_PUBLIC_PATH__ = qiankunWindow.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ || '/';
  console.log('Running in qiankun mode, public path:', window.__INJECTED_PUBLIC_PATH__);
  
  // 添加全局错误处理
  window.addEventListener('error', handleResourceError, true);
  
  // 处理动态导入错误
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && typeof event.reason.message === 'string' && 
        event.reason.message.includes('Failed to fetch dynamically imported module')) {
      console.error('Dynamic import error:', event.reason.message);
      
      // 尝试提取URL
      const match = event.reason.message.match(/https:\/\/[^"'\s]+/);
      if (match && match[0]) {
        const scriptUrl = match[0];
        console.log('Attempting to reload failed module:', scriptUrl);
        
        // 创建新的脚本元素
        const script = document.createElement('script');
        script.src = `${scriptUrl}?t=${Date.now()}`;
        script.type = 'application/javascript';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
        
        // 通知主应用
        window.dispatchEvent(new CustomEvent('qiankun:warning', { 
          detail: { message: '正在尝试修复资源加载问题...' } 
        }));
        
        event.preventDefault();
      }
    }
  });
  
  // 检查容器元素
  setTimeout(() => {
    if (!document.getElementById('subapp-container')) {
      console.error('Container #subapp-container not found in parent application');
      window.dispatchEvent(new CustomEvent('qiankun:error', { 
        detail: { message: '子应用容器未找到，请检查主应用配置' } 
      }));
    }
  }, 100);
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
  const { container, baseRoute, scriptAttrs } = props
  
  // 处理脚本属性，解决MIME类型问题
  if (scriptAttrs && import.meta.env.PROD) {
    // 为所有动态加载的脚本设置正确的MIME类型
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName: string) {
      const element = originalCreateElement.call(document, tagName);
      if (tagName.toLowerCase() === 'script') {
        // 为脚本元素设置属性
        Object.keys(scriptAttrs).forEach(key => {
          element.setAttribute(key, scriptAttrs[key]);
        });
      }
      return element;
    };
  }
  
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