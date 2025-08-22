// 简单的静态文件服务器，用于测试构建后的应用
import { createServer } from 'http';
import { readFile } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MIME类型映射
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
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
  
  // 读取文件
  readFile(fullPath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 文件不存在，尝试返回index.html（用于SPA路由）
        readFile(join(__dirname, 'dist', 'index.html'), (err, content) => {
          if (err) {
            res.writeHead(404);
            res.end('文件不存在');
            return;
          }
          
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        });
      } else {
        // 服务器错误
        res.writeHead(500);
        res.end(`服务器错误: ${err.code}`);
      }
      return;
    }
    
    // 成功读取文件
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content, 'utf-8');
  });
});

// 设置端口
const PORT = 8888;

// 启动服务器
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}/`);
});