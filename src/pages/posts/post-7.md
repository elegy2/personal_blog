---
layout: ../../layouts/MarkdownPostLayout.astro

title: '深入理解Docker容器化技术与最佳实践'
pubDate: 2026-06-15
description: 'Docker容器化部署的完整指南'
author: 'Elegy'
tags: ["DevOps", "Docker", "容器化", "技术"]
---

# 深入理解Docker容器化技术与最佳实践

Docker已经成为现代应用部署的标准工具。本文将深入讲解Docker的核心概念和生产环境的最佳实践。

## 🐋 Docker核心概念

### 镜像（Image）vs 容器（Container）

- **镜像**：应用的只读模板，包含代码、运行时、库等
- **容器**：镜像的运行实例，可以启动、停止、删除

```bash
# 查看本地镜像
docker images

# 运行容器
docker run -d -p 8080:80 nginx

# 查看运行中的容器
docker ps
```

## 📝 编写高效的Dockerfile

### 基础示例

```dockerfile
# 使用官方Node.js镜像作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "server.js"]
```

## ⚡ 优化技巧

### 1. 利用构建缓存

```dockerfile
# ❌ 不好的做法 - 每次代码改动都要重新安装依赖
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install

# ✅ 好的做法 - 分层构建，利用缓存
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production  # 这层会被缓存
COPY . .                       # 只有这层需要重建
```

### 2. 多阶段构建

```dockerfile
# 构建阶段
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 生产阶段
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/server.js"]
```

### 3. 减小镜像大小

```dockerfile
# 使用Alpine Linux（更小的基础镜像）
FROM node:18-alpine

# 清理不必要的文件
RUN npm ci --only=production && \
    npm cache clean --force

# 使用.dockerignore排除不必要的文件
# .dockerignore 内容:
# node_modules
# npm-debug.log
# .git
# .env
```

## 🔧 Docker Compose实战

管理多容器应用：

```yaml
version: '3.8'

services:
  # Web应用
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://db:5432/myapp
    depends_on:
      - db
      - redis
    volumes:
      - ./logs:/app/logs
  
  # PostgreSQL数据库
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=secret
    volumes:
      - postgres_data:/var/lib/postgresql/data