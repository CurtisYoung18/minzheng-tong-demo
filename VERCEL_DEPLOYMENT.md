# Vercel 部署指南

## 问题1: GitHub 邮箱不匹配

### 原因
Vercel 需要提交者的邮箱与 GitHub 账户关联的邮箱匹配，才能正确识别提交者。

### 解决方案

#### 方法1: 修改 Git 邮箱配置（推荐）

1. **查看你的 GitHub 邮箱**：
   - 访问 https://github.com/settings/emails
   - 找到你的主要邮箱地址（Primary email）

2. **修改本地 Git 配置**：
```bash
git config user.email "your-github-email@example.com"
git config user.name "Your Name"
```

3. **修改最后一次提交的邮箱**（如果需要）：
```bash
git commit --amend --author="Your Name <your-github-email@example.com>" --no-edit
git push --force
```

#### 方法2: 在 GitHub 设置中添加邮箱

1. 访问 https://github.com/settings/emails
2. 点击 "Add email address"
3. 添加 `curtisyoung18@example.com`（如果这是你使用的邮箱）
4. 验证邮箱后，Vercel 就能识别了

#### 方法3: 使用 GitHub 的 no-reply 邮箱

GitHub 提供了特殊的 no-reply 邮箱格式：
```
username@users.noreply.github.com
```

设置方法：
```bash
git config user.email "CurtisYoung18@users.noreply.github.com"
```

## 问题2: Vercel 对 Java 的支持

### Vercel 支持的语言

Vercel **不支持**传统的 Java 应用（如 Spring Boot），但支持：

✅ **Serverless Functions**:
- Node.js (JavaScript/TypeScript)
- Python
- Go
- Ruby
- Edge Functions (基于 WebAssembly)

### 全栈项目部署方案

#### 方案1: Next.js 全栈（当前方案）✅

**优点**：
- Next.js API Routes 运行在 Serverless Functions 中
- 前后端一体化部署
- 自动处理路由和 API
- 支持 SSR、SSG、ISR

**当前项目**：
- 前端：React/Next.js 页面
- 后端：Next.js API Routes (`/app/api/*`)
- 数据库：Neon (PostgreSQL) - 通过环境变量连接

**部署**：
```bash
# Vercel 自动检测 Next.js 项目
# 只需连接 GitHub 仓库即可
```

#### 方案2: 前后端分离部署

**架构**：
- 前端：Next.js → Vercel
- 后端：Java Spring Boot → 其他平台

**后端部署平台选择**：

1. **Railway** (推荐)
   - 支持 Java/Spring Boot
   - 自动检测和部署
   - 免费额度充足
   - https://railway.app

2. **Render**
   - 支持 Java
   - 免费套餐可用
   - https://render.com

3. **Fly.io**
   - 支持 Java
   - 全球边缘部署
   - https://fly.io

4. **Heroku**
   - 传统选择，但免费套餐已取消
   - https://heroku.com

5. **AWS/GCP/Azure**
   - 企业级方案
   - 需要更多配置

**配置示例**：
```typescript
// 前端环境变量
NEXT_PUBLIC_API_URL=https://your-java-backend.railway.app
```

#### 方案3: 使用 Vercel Edge Functions

对于简单的 API 代理，可以使用 Edge Functions：
- 运行在全球边缘节点
- 超低延迟
- 支持 TypeScript

## 当前项目的部署

### 当前架构 ✅

你的项目已经是 **Next.js 全栈应用**：
- ✅ 前端：React 组件
- ✅ 后端：Next.js API Routes
- ✅ 数据库：Neon PostgreSQL
- ✅ SSL 证书问题：已通过 Node.js https 模块解决

### 部署步骤

1. **连接 GitHub 仓库到 Vercel**
   - 登录 Vercel
   - Import Project
   - 选择你的 GitHub 仓库

2. **配置环境变量**
   ```
   GPTBOTS_API_KEY=app-O9qte2NIaa2JgFFS7ePpK69c
   GPTBOTS_BASE_URL=https://27.156.118.33:40443
   DATABASE_URL=你的数据库连接字符串
   ```

3. **部署**
   - Vercel 自动检测 Next.js
   - 自动构建和部署
   - 完成后获得部署 URL

### 为什么不需要 Java 后端？

你的项目**不需要单独的 Java 后端**，因为：
- Next.js API Routes 已经提供了后端功能
- 所有 API 调用都在 Serverless Functions 中运行
- SSL 证书问题已通过 Node.js 解决
- 性能更好（Serverless 自动扩展）

## 总结

✅ **当前方案最佳**：Next.js 全栈部署到 Vercel
- 简单、快速、成本低
- 无需管理服务器
- 自动扩展

❌ **不需要 Java 后端**：
- Vercel 不支持 Java
- Next.js API Routes 已足够
- 避免额外的部署复杂度

