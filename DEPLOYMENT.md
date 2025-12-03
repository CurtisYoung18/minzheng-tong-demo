# 部署指南

## 环境要求

- Node.js 18+
- npm 或 pnpm

## 环境配置

创建 `.env.local` 文件：

```bash
GPTBOTS_API_KEY=your_api_key
GPTBOTS_BASE_URL=https://your-gptbots-endpoint
USE_MOCK_DB=true
```

| 变量 | 说明 | 必填 |
|------|------|------|
| `GPTBOTS_API_KEY` | GPTBots API 密钥 | ✅ |
| `GPTBOTS_BASE_URL` | GPTBots API 地址 | ✅ |
| `USE_MOCK_DB` | 使用本地 Mock 数据库 | 可选，默认 true |

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 生产构建

```bash
# 构建
npm run build

# 启动生产服务器
npm run start
```

## Vercel 部署

1. Fork 或 Clone 此仓库
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 配置环境变量（Settings → Environment Variables）
4. 部署完成

## 测试账号

| 用户 | 账号 | 密码 | 初始阶段 |
|------|------|------|----------|
| 张三 | 13800138001 | admin123 | 未开始 (1000) |
| 李四 | 13800138002 | admin123 | 手机签约 (1015) |
| 王五 | 13800138003 | admin123 | 银行卡签约 (1018) |
| 赵六 | 13800138004 | admin123 | 满足提取 (1029) |

## 项目结构

```
app/                  # Next.js App Router
  api/                # API 路由
    chat/             # 对话相关 API
    user/             # 用户属性 API
    account/          # 账户信息 API
components/chat/      # 聊天组件
  chat-layout.tsx     # 主布局
  chat-main.tsx       # 聊天主界面
  chat-sidebar.tsx    # 侧边栏流程图
  message-card.tsx    # 消息卡片（含 JSON 提取逻辑）
  auth-card.tsx       # 授权卡片
  sign-card.tsx       # 签约卡片
  account-details-card.tsx  # 账户详情卡片
  finish-card.tsx     # 完成卡片
lib/
  gptbots.ts          # GPTBots API 客户端
  mock-db.ts          # 本地模拟数据库
```

## 技术栈

| 技术 | 说明 |
|------|------|
| Next.js 16 | React 全栈框架 (Turbopack) |
| React 19 | 用户界面库 |
| TypeScript | 类型安全 |
| Tailwind CSS | 原子化 CSS 框架 |
| shadcn/ui | UI 组件库 |
| Framer Motion | 动画库 |
| GPTBots API | AI 对话引擎 |

