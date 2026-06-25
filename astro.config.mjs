import { defineConfig } from 'astro/config';

// Astro 基础配置：输出静态站点，资源使用相对路径
export default defineConfig({
  output: 'static',
  base: '/feiyi/',  // GitHub Pages 部署路径
  build: {
    format: 'directory'
  }
});
