# Nest Front + Backend Monorepo

[中文](#中文说明) | [English](#english)

## 中文说明

这是一个把后台管理系统前端和后端整合到同一个仓库中的 monorepo：

- `admin-front`：基于 Vue 3 + Vite + Element Plus 的管理端前端
- `admin-backend`：基于 NestJS + Prisma + PostgreSQL + Redis + MinIO 的后端 API

这个根目录现在作为统一入口，负责：

- 管理前后端代码目录
- 提供统一的 `pnpm workspace`
- 提供根级开发命令
- 提供适合放在 GitHub 首页的总说明

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

This repository is now organized as a single monorepo for the admin system:

- `admin-front`: Vue 3 + Vite + Element Plus admin frontend
- `admin-backend`: NestJS + Prisma + PostgreSQL + Redis + MinIO backend API

The root directory is the single entry point for:

- keeping frontend and backend in one repository
- managing them with `pnpm workspace`
- providing shared root-level scripts
- offering a GitHub-friendly project overview

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
