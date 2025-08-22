# AI News App - qiankun 子应用

这是一个基于 Vue 3 + TypeScript + Vite 构建的 qiankun 微前端子应用。

## 特性

- 🚀 Vue 3 + TypeScript + Vite
- 🔄 qiankun 微前端架构
- 📱 响应式设计
- 🌐 可独立运行或作为子应用集成到主应用

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 构建

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 部署

项目已配置为可以直接部署到 Vercel。

## 集成到主应用

在主应用的配置中添加：

```typescript
{
  name: 'ai-news-app',
  entry: import.meta.env.MODE === 'development'
    ? 'http://localhost:5176/' // 本地开发环境
    : 'https://ai-news-app-two.vercel.app/', // 线上环境
  container: '#subapp-container',
  activeRule: '/micro/ai-news-app',
  props: {
    actions: qiankunActions,
    from: 'main-app',
    version: '1.0.0',
    baseRoute: '/micro/ai-news-app',
    devMode: import.meta.env.MODE === 'development'
  }
}