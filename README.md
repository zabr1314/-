# 玄机阁 ✨ 

<div align="center">
  <h1>AI驱动的中式算命平台</h1>
  <p>传统智慧与现代AI的完美结合</p>
  
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/Supabase-Database-green?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/AI-DeepSeek-blue?logo=openai" alt="DeepSeek AI" />
  <img src="https://img.shields.io/badge/UI-shadcn/ui-violet" alt="shadcn/ui" />
</div>

---

## 🎯 项目简介

玄机阁是一个基于 Next.js 15 + Supabase 构建的现代化中式算命平台，集成了八字详批和六爻占卜功能。通过 DeepSeek AI 提供专业的命理解读，为用户带来深度的人生洞察。

### ✨ 核心功能

- **🔮 八字详批** - 基于出生信息的全面人生分析（15玄机值）
- **⭐ 六爻占卜** - 针对具体问题的精准预测（5玄机值）
- **🤖 AI解读** - DeepSeek大模型提供专业命理分析
- **💰 积分系统** - 玄机值购买和消费管理
- **📱 响应式设计** - 完美适配移动端和桌面端
- **🌓 主题切换** - 支持深色/浅色模式
- **📊 历史记录** - 查看过往推算结果
- **🔗 结果分享** - 生成精美的分享图片

## 🚀 快速部署

### 一键部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fzabr1314%2F-&project-name=xuanji-fortune&repository-name=xuanji-fortune&demo-title=玄机阁-AI算命平台&demo-description=传统智慧与现代AI结合的中式算命平台，支持八字详批和六爻占卜)

### 环境变量配置

部署前需要配置以下环境变量：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your-supabase-anon-key

# AI 配置
DEEPSEEK_API_KEY=your-deepseek-api-key

# 支付配置（可选）
ZPAY_PID=your-zpay-merchant-id
ZPAY_PKEY=your-zpay-secret-key

# 站点配置
NEXT_PUBLIC_SITE_URL=your-deployed-site-url
```

## 🛠️ 本地开发

### 1. 克隆项目

```bash
git clone https://github.com/zabr1314/-.git
cd with-supabase-app
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 3. 环境配置

1. 复制 `.env.example` 为 `.env.local`
2. 填入必要的环境变量（见上方配置说明）

### 4. 数据库初始化

1. 在 [Supabase](https://supabase.com) 创建新项目
2. 访问 `/api/admin/init-db` 获取SQL脚本
3. 在 Supabase SQL 编辑器中执行脚本

### 5. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📋 技术栈

### 前端框架
- **Next.js 15** - React 全栈框架，使用 App Router
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 原子化 CSS 框架
- **shadcn/ui** - 现代化 React 组件库

### 后端服务
- **Supabase** - 开源的 Firebase 替代方案
- **Supabase Auth** - 用户认证和会话管理
- **PostgreSQL** - 关系型数据库
- **Row Level Security** - 数据安全策略

### AI & 算法
- **DeepSeek** - 大语言模型 API
- **传统算法** - 八字排盘、六爻起卦算法
- **@vercel/og** - 动态图片生成

### 支付集成
- **ZPay** - 中国本土化支付解决方案
- **积分系统** - 玄机值购买和消费

## 📁 项目结构

```
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── readings/      # 推算相关 API
│   │   ├── payment/       # 支付相关 API
│   │   ├── admin/         # 管理员 API
│   │   └── images/        # 图片生成 API
│   ├── auth/              # 认证页面
│   ├── protected/         # 受保护的页面
│   └── pricing/           # 套餐购买页面
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 基础组件
│   └── ...               # 业务组件
├── lib/                   # 工具库
│   ├── supabase/         # Supabase 客户端
│   ├── ai/               # AI 集成
│   ├── fortune/          # 算命算法
│   └── payment/          # 支付集成
└── docs/                  # 项目文档
```

## 🎮 功能演示

### 八字详批
1. 输入出生年月日时和性别
2. AI 自动排盘并生成详细分析
3. 包含性格、事业、财运、婚姻等维度

### 六爻占卜
1. 提出具体问题
2. 系统自动起卦
3. AI 根据卦象给出针对性建议

### 积分系统
- **初心套餐**: ¥9.90 = 30玄机值
- **进阶套餐**: ¥29.90 = 100玄机值  
- **至尊套餐**: ¥99.90 = 380玄机值

## 🔧 开发命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
```

## 📄 许可证

本项目仅供学习交流使用，请勿用于商业用途。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

<div align="center">
  <p>Made with ❤️ by AI & Human</p>
  <p>🤖 Generated with <a href="https://claude.ai/code">Claude Code</a></p>
</div>