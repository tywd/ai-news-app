// 全局类型声明

// 为window对象添加qiankun相关属性
interface Window {
  __POWERED_BY_QIANKUN__?: boolean;
  __INJECTED_PUBLIC_PATH__?: string;
  __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string;
}

// 声明qiankun相关模块
declare module 'vite-plugin-qiankun/dist/helper' {
  export const qiankunWindow: Window;
  export function renderWithQiankun(options: any): void;
}