// 增强版静态文件服务器，专门处理MIME类型问题
import { createServer } from 'http';
import { readFile } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 增强的MIME类型映射
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

// 创建服务器
const server = createServer((req, res) => {
  console.log(`请求: ${req.url}`);
  
  // 解析URL
  let filePath = req.url;
  
  // 默认为index.html
  if (filePath === '/') {
    filePath = '/index.html';
  }
  
  // 构建完整的文件路径
  const fullPath = join(__dirname, 'dist', filePath);
  
  // 获取文件扩展名
  const extName = extname(fullPath);
  
  // 设置默认的MIME类型
  let contentType = mimeTypes[extName] || 'application/octet-stream';
  
  // 特殊处理JavaScript文件，确保正确的MIME类型
  if (filePath.includes('.js') || filePath.endsWith('.js')) {
    contentType = 'application/javascript; charset=utf-8';
  }
  
  // 添加CORS头
  const headers = {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
    'X-Content-Type-Options': 'nosniff'
  };
  
  // 读取文件
  readFile(fullPath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 文件不存在，尝试返回index.html（用于SPA路由）
        console.log(`文件不存在: ${fullPath}，尝试返回index.html`);
        readFile(join(__dirname, 'dist', 'index.html'), (err, content) => {
          if (err) {
            res.writeHead(404, headers);
            res.end('文件不存在');
            return;
          }
          
          res.writeHead(200, { ...headers, 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content, 'utf-8');
        });
      } else {
        // 服务器错误
        console.error(`服务器错误: ${err.code}`, err);
        res.writeHead(500, headers);
        res.end(`服务器错误: ${err.code}`);
      }
      return;
    }
    
    // 成功读取文件
    console.log(`成功读取文件: ${fullPath}，MIME类型: ${contentType}`);
    res.writeHead(200, headers);
    res.end(content, 'utf-8');
  });
});

// 设置端口
const PORT = process.env.PORT || 8888;

// 启动服务器
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}/`);
  console.log(`服务静态文件目录: ${join(__dirname, 'dist')}`);
  console.log('MIME类型处理已增强，特别针对JavaScript文件');
});
