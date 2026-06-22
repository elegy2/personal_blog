# 个人博客项目 | Personal Blog

[![Astro](https://img.shields.io/badge/Astro-5.14-ff69b4)](https://astro.build)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> 一个基于 **Astro** + **React** 构建的现代化个人博客网站，展示技术文章、项目经验和学习心得。

## ✨ 项目亮点

- 🚀 **高性能**：采用 Astro 静态站点生成（SSG），首屏加载速度快
- 📝 **Markdown 支持**：使用 Markdown 编写文章，支持代码高亮和标签分类
- 🎨 **精美设计**：毛玻璃效果、暗黑模式、响应式布局
- 🌸 **动态效果**：樱花飘落、Live2D 看板娘、塔罗卡片翻转
- 📱 **移动优先**：完美适配桌面端和移动端
- 🔍 **SEO 友好**：内置 RSS 订阅、sitemap 生成
- ⚡ **快速部署**：支持 Vercel、Netlify、GitHub Pages 一键部署

## 🎯 适用场景

- 个人技术博客和学习笔记
- 求职作品集展示
- 项目经验分享
- 前端技术栈学习实践

## 🛠️ 技术栈

- **框架**：Astro 5.14 + React 18
- **样式**：CSS3 + 毛玻璃效果
- **动效**：Pixi.js + Live2D
- **部署**：Vercel / Netlify
- **内容**：Markdown + Frontmatter

## 📂 项目结构

```bash
src/
├── assets/              # 静态资源
├── components/          # React/Astro 组件
│   ├── BlogPost.astro   # 博客文章卡片
│   ├── Header.astro     # 页头导航
│   ├── Live2D.jsx       # Live2D 看板娘
│   ├── Sakura.jsx       # 樱花飘落效果
│   └── ...
├── layouts/             # 页面布局
│   ├── BaseLayout.astro
│   └── MarkdownPostLayout.astro
├── pages/               # 页面路由
│   ├── index.astro      # 首页
│   ├── blog.astro       # 博客列表
│   ├── about.astro      # 关于页面
│   ├── posts/           # Markdown 文章
│   │   ├── post-5.md    # React性能优化
│   │   ├── post-6.md    # 微服务架构
│   │   ├── post-7.md    # Docker容器化
│   │   ├── post-8.md    # TypeScript类型系统
│   │   ├── post-9.md    # Git团队协作
│   │   └── post-10.md   # 数据库优化
│   └── tags/            # 标签页面
└── styles/              # 全局样式
```

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/elegy2/personal_blog.git
cd personal_blog
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```
访问 http://localhost:4321 查看效果

4. **构建生产版本**
```bash
npm run build
```

5. **预览生产构建**
```bash
npm run preview
```

## 📝 如何添加文章

1. 在 `src/pages/posts/` 目录下创建新的 `.md` 文件
2. 添加 frontmatter 元数据：

```markdown
---
layout: ../../layouts/MarkdownPostLayout.astro
title: '文章标题'
pubDate: 2026-06-20
description: '文章描述'
author: 'Elegy'
tags: ["标签1", "标签2"]
---

# 文章内容

这里是正文...
```

3. 保存后文章会自动出现在博客列表中

## 🎨 自定义配置

### 修改个人信息

编辑 `src/pages/index.astro` 中的个人资料部分：

```astro
<div class="author-info">
  <h3>你的名字</h3>
  <p>你的简介</p>
  <a href="https://github.com/yourusername">🌟 GitHub</a>
</div>
```

### 更换主题颜色

修改 `src/styles/global.css` 中的 CSS 变量：

```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
}
```

### 配置Live2D模型

在 `src/components/Live2D.jsx` 中修改模型路径和配置。

## 📚 已发布文章

项目包含6篇高质量技术文章：

1. **React性能优化实战** - 虚拟DOM、并发渲染、性能监控
2. **微服务架构实战** - 服务拆分、API网关、分布式追踪
3. **Docker容器化技术** - Dockerfile优化、Docker Compose、生产部署
4. **TypeScript高级类型** - 泛型、工具类型、类型守卫
5. **Git团队协作** - 工作流模式、提交规范、Code Review
6. **数据库选型与优化** - SQL vs NoSQL、索引优化、缓存策略

## 🌐 部署指南

### Vercel 部署（推荐）

1. 在 Vercel 中导入 GitHub 仓库
2. 构建命令：`npm run build`
3. 输出目录：`dist`
4. 点击部署即可

### Netlify 部署

1. 连接 GitHub 仓库
2. 构建命令：`npm run build`
3. 发布目录：`dist`
4. 部署

### GitHub Pages

```bash
npm run build
# 将 dist 目录内容推送到 gh-pages 分支
```

## 📈 性能优化

- ✅ 使用 Astro Islands 实现部分水合
- ✅ 图片懒加载和优化
- ✅ CSS 和 JS 代码分割
- ✅ 预加载关键资源
- ✅ 使用 CDN 加速静态资源

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建新分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m "feat: add new feature"`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request

## 📧 联系方式

- **邮箱**：3393205446@qq.com
- **GitHub**：[@elegy2](https://github.com/elegy2)
- **CSDN**：[Elegy的博客](https://blog.csdn.net/weixin_74177409)
- **Bilibili**：[@Elegy](https://space.bilibili.com/437559763)

## 📄 License

本项目采用 MIT 许可证，可自由使用和修改。

## 🙏 致谢

感谢以下开源项目：

- [Astro](https://astro.build) - 现代化的静态站点生成器
- [React](https://reactjs.org) - 用户界面库
- [Pixi.js](https://pixijs.com) - 2D 渲染引擎
- [Live2D](https://www.live2d.com) - 看板娘模型

---

⭐ 如果这个项目对你有帮助，欢迎给个 Star！