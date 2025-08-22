# AI 新闻应用 (qiankun 子应用)

这是一个基于 Vue3 + TypeScript + Vite 的 qiankun 微前端子应用，可以独立运行，也可以作为子应用集成到 qiankun 主应用中。

## 功能特点

- 基于 Vue3 + TypeScript + Vite 构建
- 支持作为 qiankun 微前端子应用运行
- 支持独立部署和运行
- 自动部署到 Vercel

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 构建部署

```bash
# 构建生产版本
pnpm build

# 本地预览生产构建
pnpm preview

# 部署到 Vercel
pnpm deploy
```

## 微前端集成

该应用已配置为 qiankun 微前端子应用，可以被主应用加载。

### 独立运行模式

访问 `http://localhost:5175/` 可以独立运行该应用。

### 微前端模式

在主应用中，通过 `/micro/ai-news-app` 路径访问该子应用。

## 部署说明

### Vercel 部署

1. 在 Vercel 上创建新项目并关联 GitHub 仓库
2. 设置以下环境变量：
   - `NODE_ENV`: `production`

3. 在 GitHub 仓库的 Secrets 中添加以下变量：
   - `VERCEL_TOKEN`: Vercel API 令牌
   - `VERCEL_ORG_ID`: Vercel 组织 ID
   - `VERCEL_PROJECT_ID`: Vercel 项目 ID

### 主应用集成

部署后，需要在主应用的配置中更新子应用的线上地址：

```typescript
// 在主应用的 apps.ts 中
{
  name: 'ai-news-app',
  entry: import.meta.env.MODE === 'development'
    ? 'http://localhost:5175'
    : 'https://ai-news-app-your-vercel-url.vercel.app', // 更新为实际的 Vercel URL
  container: '#subapp-container',
  activeRule: '/micro/ai-news-app'
}
```

## 常见问题解决方案

### 模块加载失败问题

如果遇到 "Failed to load module script" 或 "Failed to fetch dynamically imported module" 错误，可能是由于以下原因：

1. **MIME 类型不正确**：确保 Vercel 配置中设置了正确的 MIME 类型
2. **路径配置错误**：检查 vite.config.ts 中的 base 配置
3. **跨域问题**：确保 CORS 配置正确

已在当前配置中解决这些问题：
- 使用根路径作为 base 配置
- 在 vercel.json 中添加了正确的 MIME 类型和 CORS 头
- 在 main.ts 中添加了对 qiankun 环境的特殊处理

### 样式隔离问题

使用了以下方法确保样式隔离：
- 使用 CSS 命名空间 (.ai-news-app)
- 使用 scoped 样式
- 在 style.css 中使用 all: initial 重置样式