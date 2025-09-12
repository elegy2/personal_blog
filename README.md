# 个人博客项目

这是一个基于 **Astro** + **React** 的现代化个人博客网站。  

它不仅能展示文章内容，还内置了 **标签分类、RSS 订阅、主题切换** 等基础功能，同时还加入了许多动态交互元素，比如 **Live2D 看板娘、樱花飘落效果、塔罗卡片翻转动画**，让网站更具趣味性和个性化。  

整个项目采用 **Astro 的静态站点生成（SSG）** 与 **React 组件化开发** 相结合，既保证了良好的性能与 SEO，又能灵活扩展前端交互。  

项目整体风格简洁清新，支持暗黑模式，桌面端与移动端都能获得良好体验，适合：

- 想要快速搭建一个 **个人博客/技术笔记/作品集** 的开发者  
- 希望在博客中加入 **互动元素和动态特效** 的创作者  
- 想要学习 **Astro + React + 前端动效** 结合实践的同学  

通过少量配置，你就可以将它部署到 **Vercel / Netlify / GitHub Pages** 等平台，轻松拥有一个既美观又实用的个人博客站点。


---

## 📂 项目结构

```bash
src
├─ assets/                 # 静态资源（SVG、背景图）
│   ├─ astro.svg
│   └─ background.svg
│
├─ components/             # 可复用的组件
│   ├─ BlogPost.astro      # 博客文章列表项
│   ├─ Footer.astro        # 页脚
│   ├─ Greeting.jsx        # 问候语
│   ├─ Hamburger.astro     # 移动端菜单按钮
│   ├─ Header.astro        # 页头导航
│   ├─ Live2D.jsx          # Live2D 模型
│   ├─ Live2DWithCards.jsx # Live2D + 卡片交互
│   ├─ Navigation.astro    # 导航栏
│   ├─ Sakura.jsx          # 樱花飘落效果
│   ├─ Social.astro        # 社交媒体链接
│   ├─ TarotGallery.jsx    # 塔罗卡片翻转
│   ├─ ThemeIcon.astro     # 主题切换图标
│   └─ Welcome.astro       # 首页欢迎组件
│
├─ layouts/                # 页面布局模板
│   ├─ BaseLayout.astro
│   ├─ Layout.astro
│   └─ MarkdownPostLayout.astro
│
├─ pages/                  # 页面
│   ├─ about.astro         # 关于页面
│   ├─ blog.astro          # 博客文章列表
│   ├─ index.astro         # 首页
│   ├─ rss.xml.js          # RSS 订阅
│   ├─ show.astro          # 特殊展示页
│   │
│   ├─ posts/              # 博客文章 (Markdown 格式)
│   │   ├─ post-1.md
│   │   ├─ post-2.md
│   │   ├─ post-3.md
│   │   └─ post-4.md
│   │
│   └─ tags/               # 标签相关页面
│       ├─ index.astro     # 标签索引页
│       └─ [tag].astro     # 标签详情页
│
├─ scripts/
│   └─ menu.js             # 菜单控制脚本
│
└─ styles/                 # 样式文件
    ├─ global.css          # 全局样式
    └─ Sakura.css          # 樱花效果样式
```

---

## 🚀 使用说明


1. 安装依赖
```
npm install
```

2. 启动开发服务器
```
npm run dev 
```
启动后在浏览器访问 http://localhost:4321。

3. 构建生产环境
```
npm run build
```

4. 预览构建结果
```
npm run preview
```


## ✨ 功能特色

📖 Markdown 博客系统（支持标签分类、RSS）

🎴 塔罗卡片翻转效果（文章预览更有趣）

🌸 樱花飘落特效（浪漫氛围）

🧩 Live2D 看板娘（动态互动）

🌓 暗黑模式切换

📱 移动端自适应

## 📝 License

本项目仅供学习和个人使用，禁止商用。
