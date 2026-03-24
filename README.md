# Nest Front + Backend Monorepo

[中文](#中文说明) | [English](#english)

## 中文说明

这是一个把后台管理系统前端和后端整合到同一个仓库中的 monorepo，也是一个面向企业级后台场景打造的 RBAC 一体化权限管理平台。

它不是“只能演示页面”的后台模板，也不是“只有接口缺少业务骨架”的半成品，而是一套可以直接落地、继续二开、适合作为真实项目底座的后台基础设施：

- `admin-front`：基于 Vue 3 + Vite + Element Plus 的管理端前端
- `admin-backend`：基于 NestJS + Prisma + PostgreSQL + Redis + MinIO 的后端 API

这个根目录现在作为统一入口，负责：

- 管理前后端代码目录
- 提供统一的 `pnpm workspace`
- 提供根级开发命令
- 提供适合放在 GitHub 首页的总说明

### 项目定位

如果你在找的不是一个“只会展示登录页和表格页”的后台壳子，而是一套可以直接支撑真实管理系统的权限中台型基础项目，这个仓库就是为这种场景准备的。

它强调三件事：

- 能打：账号、角色、菜单、按钮、部门、字典、上传这些后台常见核心能力已经串起来
- 能上手：本地开发、Docker 依赖、接口文档、前后端联调链路都已经配好
- 能扩展：权限模型、菜单树、角色关系、数据权限边界都留好了继续演进的空间

### 项目亮点

- 完整 RBAC 权限模型：覆盖账号、部门、角色、菜单、按钮权限和数据权限扩展能力，不是零散模块堆叠，而是完整权限链路
- 企业级后台核心能力现成可用：用户管理、角色管理、菜单管理、部门管理、数据字典、文件上传、认证鉴权一套齐全
- 动态菜单真正可落地：菜单驱动路由、按钮驱动权限、前后端权限消费链路打通，适合真实业务后台直接接入
- 实战导向而不是 Demo 导向：统一响应、参数校验、异常处理、OpenAPI/Scalar 文档、Docker 部署链路都已经具备
- 前后端职责清晰：前端负责权限消费、菜单渲染和页面体验，后端负责认证、菜单树、角色关系和访问边界
- 开箱即用又便于二开：既可以直接作为中后台脚手架使用，也适合作为团队内部管理平台、权限平台、SaaS 控台底座
- 单仓协作更省心：前后端放在同一个 monorepo 中，统一依赖、统一命令、统一说明，降低项目维护和交接成本

### 你能直接拿去做什么

- 作为公司内部管理后台的初始工程
- 作为业务系统的权限与系统管理基础模块
- 作为中后台项目脚手架，快速起盘一个“能登录、能控权、能配菜单、能上传”的管理系统
- 作为团队学习 NestJS + Vue 3 + Prisma + PostgreSQL 的实战型参考项目

### 适用场景

- 企业内部管理后台
- 中后台权限平台 / 系统管理平台
- 需要用户、角色、菜单、字典、上传能力的业务系统
- 希望“拿来即用”同时又保留二次开发空间的实战项目

### 项目结构

```text
.
├─ admin-backend/          NestJS 后端
├─ admin-front/            Vue 3 前端
├─ package.json            根级统一脚本
├─ pnpm-workspace.yaml     pnpm workspace 配置
└─ README.md               中英双语总说明
```

### 技术栈

- Frontend: Vue 3, Vite, Element Plus, Pinia, Vue Router
- Backend: NestJS 11, Prisma 6, PostgreSQL 15, Redis 7, MinIO
- Tooling: pnpm, Docker Compose

### 环境要求

- Node.js 18+
- pnpm 8+
- Docker Desktop / Docker Compose

### 快速开始

1. 安装依赖

```bash
pnpm install
```

2. 启动后端依赖服务

```bash
pnpm docker:deps:up
```

3. 同步数据库结构

```bash
pnpm db:push
```

4. 启动后端

```bash
pnpm dev:backend
```

5. 启动前端

```bash
pnpm dev:front
```

### 默认访问地址

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3101`
- API Docs: `http://localhost:3101/api-docs`
- OpenAPI JSON: `http://localhost:3101/api-docs-json`
- MinIO Console: `http://localhost:19001`

### 线上演示

- 前端演示地址：[http://cow.zenoly.cn/login](http://cow.zenoly.cn/login)
- 测试账号：`admin`
- 测试密码：`123456`
- 后端接口文档：[http://cow.zenoly.cn/api-docs#tag/%E8%AE%A4%E8%AF%81](http://cow.zenoly.cn/api-docs#tag/%E8%AE%A4%E8%AF%81)

### 独立仓库

- 如果需要单独的后端，请访问：[https://github.com/rowan766/admin-backend](https://github.com/rowan766/admin-backend)
- 如果需要单独的前端，请访问：[https://github.com/rowan766/admin-front](https://github.com/rowan766/admin-front)

### 前后端联调关系

- 前端开发服务器默认把 `/api` 代理到 `http://localhost:3101`
- 后端默认端口是 `3101`
- 因此前后端本地联调时，通常只需要先启动后端，再启动前端即可

### 根目录常用命令

```bash
pnpm dev:front
pnpm dev:backend
pnpm build
pnpm build:front
pnpm build:backend
pnpm lint:backend
pnpm test:backend
pnpm test:e2e:backend
pnpm docker:deps:up
pnpm docker:backend:up
pnpm docker:down
pnpm db:push
```

### 子项目文档

- Frontend README: [admin-front/README.md](./admin-front/README.md)
- Frontend Architecture: [admin-front/README_ARCHITECTURE.md](./admin-front/README_ARCHITECTURE.md)
- Backend README: [admin-backend/README.md](./admin-backend/README.md)
- Backend Architecture: [admin-backend/README_ARCHITECTURE.md](./admin-backend/README_ARCHITECTURE.md)
- Backend Deploy Guide: [admin-backend/deploy.md](./admin-backend/deploy.md)

### 仓库整合说明

这个目录原本是两个独立项目：

- `admin-front`
- `admin-backend`

现在已经改为单仓管理，更适合：

- 一个 GitHub 仓库同时管理前后端
- 统一维护 README 和开发入口
- 后续扩展 CI/CD、issue、release 和部署流程

为避免直接删除原仓库历史，两个子项目原有的 Git 元数据已被本地重命名为 `.git.backup` 作为备份；确认不再需要后可以手动删除。

## English

This repository is organized as a single monorepo for an enterprise-ready RBAC admin platform.

It is not just a visual admin template and not merely a set of backend endpoints. It is meant to serve as a production-oriented foundation that teams can launch with, extend, and keep evolving:

- `admin-front`: Vue 3 + Vite + Element Plus admin frontend
- `admin-backend`: NestJS + Prisma + PostgreSQL + Redis + MinIO backend API

The root directory is the single entry point for:

- keeping frontend and backend in one repository
- managing them with `pnpm workspace`
- providing shared root-level scripts
- offering a GitHub-friendly project overview

### Positioning

If you need more than a login page and a few demo tables, and you want a project that already captures the real backbone of an admin platform, this repository is aimed squarely at that use case.

It focuses on three things:

- Ready for real work: core admin modules and permission relationships are already connected
- Ready to start: local setup, Docker dependencies, API docs, and frontend/backend integration are already in place
- Ready to scale: the permission model and system boundaries are structured for further extension instead of blocking future growth

### Highlights

- Unified RBAC capability spanning accounts, departments, roles, menus, button permissions, and extensible data-scope logic
- Production-minded admin modules out of the box, including authentication, users, roles, menus, departments, dictionaries, and file uploads
- Dynamic menu and permission flow that is actually usable in real admin systems instead of remaining a disconnected demo
- Enterprise-oriented engineering practices with validation, exception handling, unified responses, OpenAPI/Scalar docs, and Docker-based deployment
- Clear frontend/backend ownership: the frontend consumes permissions and renders menu experiences, while the backend owns identity, role relations, and access boundaries
- Suitable both as a starter kit for business admin projects and as a reusable foundation for internal platforms or SaaS control panels
- Monorepo collaboration model that keeps frontend and backend aligned with shared tooling, shared commands, and lower maintenance overhead

### What You Can Build With It

- Internal enterprise admin systems
- Permission and system-management platforms
- Back-office products that need users, roles, menus, dictionaries, and upload capabilities from day one
- A practical learning or starter project for NestJS + Vue 3 + Prisma + PostgreSQL in a real admin scenario

### Best For

- Internal enterprise admin systems
- Back-office operation platforms
- Permission platforms and system-management portals
- Projects that should be usable out of the box while still remaining easy to extend

### Structure

```text
.
├─ admin-backend/          NestJS backend
├─ admin-front/            Vue 3 frontend
├─ package.json            root scripts
├─ pnpm-workspace.yaml     pnpm workspace config
└─ README.md               bilingual overview
```

### Stack

- Frontend: Vue 3, Vite, Element Plus, Pinia, Vue Router
- Backend: NestJS 11, Prisma 6, PostgreSQL 15, Redis 7, MinIO
- Tooling: pnpm, Docker Compose

### Requirements

- Node.js 18+
- pnpm 8+
- Docker Desktop / Docker Compose

### Quick Start

1. Install dependencies

```bash
pnpm install
```

2. Start backend dependencies

```bash
pnpm docker:deps:up
```

3. Push Prisma schema

```bash
pnpm db:push
```

4. Start backend

```bash
pnpm dev:backend
```

5. Start frontend

```bash
pnpm dev:front
```

### Default URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3101`
- API Docs: `http://localhost:3101/api-docs`
- OpenAPI JSON: `http://localhost:3101/api-docs-json`
- MinIO Console: `http://localhost:19001`

### Online Demo

- Frontend demo: [http://cow.zenoly.cn/login](http://cow.zenoly.cn/login)
- Demo account: `admin`
- Demo password: `123456`
- API docs: [http://cow.zenoly.cn/api-docs#tag/%E8%AE%A4%E8%AF%81](http://cow.zenoly.cn/api-docs#tag/%E8%AE%A4%E8%AF%81)

### Standalone Repositories

- Standalone backend: [https://github.com/rowan766/admin-backend](https://github.com/rowan766/admin-backend)
- Standalone frontend: [https://github.com/rowan766/admin-front](https://github.com/rowan766/admin-front)

### Local integration

- The frontend dev server proxies `/api` to `http://localhost:3101`
- The backend listens on port `3101` by default
- In local development, start backend first, then start frontend

### Root scripts

```bash
pnpm dev:front
pnpm dev:backend
pnpm build
pnpm build:front
pnpm build:backend
pnpm lint:backend
pnpm test:backend
pnpm test:e2e:backend
pnpm docker:deps:up
pnpm docker:backend:up
pnpm docker:down
pnpm db:push
```

### Subproject docs

- Frontend README: [admin-front/README.md](./admin-front/README.md)
- Frontend Architecture: [admin-front/README_ARCHITECTURE.md](./admin-front/README_ARCHITECTURE.md)
- Backend README: [admin-backend/README.md](./admin-backend/README.md)
- Backend Architecture: [admin-backend/README_ARCHITECTURE.md](./admin-backend/README_ARCHITECTURE.md)
- Backend Deploy Guide: [admin-backend/deploy.md](./admin-backend/deploy.md)

To avoid permanently deleting the original repository metadata, the former nested Git directories were renamed locally to `.git.backup` inside each subproject. You can remove them later if you no longer need the backups.
