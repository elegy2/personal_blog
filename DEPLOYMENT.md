# 🚀 部署指南

## 方式一：Vercel部署（推荐 - 最简单）

### 前提条件
- 拥有GitHub账号
- 代码已推送到GitHub仓库

### 部署步骤

1. **访问Vercel**
   - 打开 https://vercel.com
   - 使用GitHub账号登录

2. **导入项目**
   - 点击 "New Project"
   - 选择你的 `personal_blog` 仓库
   - 点击 "Import"

3. **配置项目**
   - Framework Preset: 自动检测为 Astro
   - Build Command: `npm run build`（自动填充）
   - Output Directory: `dist`（自动填充）
   - 点击 "Deploy"

4. **等待部署**
   - 部署过程约1-2分钟
   - 完成后会获得一个 `.vercel.app` 域名

5. **绑定自定义域名**（可选）
   - 在项目设置中添加自定义域名
   - 按照提示配置DNS记录

### 环境变量（如需要）

如果使用了API密钥等环境变量：
```
Settings > Environment Variables
```

---

## 方式二：Netlify部署

### 部署步骤

1. **访问Netlify**
   - 打开 https://netlify.com
   - 使用GitHub账号登录

2. **新建站点**
   - 点击 "Add new site" > "Import an existing project"
   - 选择 GitHub
   - 选择你的仓库

3. **配置构建**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **部署**
   - 点击 "Deploy site"
   - 获得 `.netlify.app` 域名

---

## 方式三：GitHub Pages部署

### 1. 创建GitHub Actions工作流

在项目根目录创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

### 2. 配置GitHub Pages

1. 进入仓库 Settings
2. 找到 Pages 设置
3. Source 选择 "GitHub Actions"
4. 保存设置

### 3. 推送代码触发部署

```bash
git add .
git commit -m "feat: setup GitHub Pages deployment"
git push
```

访问 `https://yourusername.github.io/personal_blog`

---

## 更新博客内容

部署后，每次更新只需：

```bash
# 1. 修改文章或代码
# 编辑 src/pages/posts/xxx.md

# 2. 提交更改
git add .
git commit -m "feat: add new article"

# 3. 推送到GitHub
git push

# 4. 自动重新部署（Vercel/Netlify会自动检测）
```

---

## 本地预览生产构建

部署前建议本地测试：

```bash
# 构建
npm run build

# 预览（访问 http://localhost:4321）
npm run preview
```

---

## 域名配置（可选）

### 购买域名

推荐平台：
- Namecheap
- GoDaddy
- Cloudflare

### 配置DNS

#### Vercel
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### Netlify
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: xxx.netlify.app
```

---

## 性能优化建议

### 1. 图片优化

使用 Astro 的图片优化：

```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/image.jpg';
---

<Image src={myImage} alt="Description" />
```

### 2. 启用压缩

Vercel 和 Netlify 默认启用 Gzip/Brotli 压缩。

### 3. CDN加速

- Vercel: 自动全球CDN
- Netlify: 自动全球CDN
- Cloudflare: 可添加额外CDN层

---

## 监控与分析

### 添加Google Analytics

1. 创建GA4账号
2. 获取测量ID（G-XXXXXXXXXX）
3. 在 `src/layouts/BaseLayout.astro` 中添加：

```astro
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 常见问题

### Q: 构建失败怎么办？

A: 检查 Node.js 版本是否为 18+：
```bash
node -v
```

### Q: 样式显示异常？

A: 检查 `astro.config.mjs` 中的 `base` 配置。

### Q: 图片加载失败？

A: 确保图片路径正确，使用相对路径。

### Q: 更新后页面没变化？

A: 清除浏览器缓存，或使用隐身模式访问。

---

## 下一步

- [ ] 选择部署平台并完成部署
- [ ] 测试所有页面和功能
- [ ] 添加Google Analytics
- [ ] 配置自定义域名（可选）
- [ ] 在简历中添加博客链接
- [ ] 在LinkedIn/GitHub个人资料中添加博客链接

---

🎉 **恭喜！你的个人博客即将上线！**

有任何问题欢迎通过邮件联系：3393205446@qq.com