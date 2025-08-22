/// <reference types="vite/client" />

// 为 qiankun 全局变量添加类型声明
interface Window {
  __POWERED_BY_QIANKUN__?: boolean;
  __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string;
}