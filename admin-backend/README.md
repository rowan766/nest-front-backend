# Admin Backend

基于 `NestJS + Prisma + PostgreSQL + Redis + MinIO` 的后台管理系统后端。

这个项目提供后台平台基础能力，包括：

- 登录鉴权
- 用户、部门、角色管理
- 菜单与按钮权限管理
- 数据字典
- 文件上传
- 动态菜单所需菜单树接口

如果你想看更偏“给同事讲模块职责和架构”的版本，请看：

- [README_ARCHITECTURE.md](./README_ARCHITECTURE.md)

## 技术栈

- NestJS 11
- Prisma 6
- PostgreSQL 15
- Redis 7
- MinIO
- Scalar / OpenAPI
- Docker Compose
- pnpm

## 目录结构

```text
src/
  modules/                业务模块
  common/                 公共能力
  infrastructure/         基础设施层
  main.ts
  app.module.ts
prisma/
docker-compose.yml
deploy.md
deploy.sh
```

## 当前模块

- `auth` 登录认证
- `user` 用户管理
- `department` 部门管理
- `role` 角色管理
- `menu` 菜单与按钮管理
- `dict` 数据字典
- `upload` 文件上传
- `system` 开发调试接口

## 环境要求

- Node.js 18+
- pnpm 8+
- Docker / Docker Compose

如果不使用 Docker，也需要准备：

- PostgreSQL
- Redis
- MinIO

## 安装依赖

```bash
pnpm install
```

## 推荐启动方式：Docker

进入项目目录：

```powershell
Set-Location 'd:\workspace_20260228\nest-front-backend\admin-backend'
```

启动依赖服务：

```powershell
docker compose up -d postgres redis minio
```

启动后端：

```powershell
docker compose up -d --build backend
```

同步数据库结构：

```powershell
docker exec nestjs-project1-backend pnpm prisma db push
```

## 本机直跑方式

确保数据库、Redis、MinIO 已可用后，执行：

```bash
pnpm install
pnpm start:dev
```

## 默认访问地址

- 后端服务：`http://localhost:3101`
- API 文档：`http://localhost:3101/api-docs`
- OpenAPI JSON：`http://localhost:3101/api-docs-json`
- MinIO 控制台：`http://localhost:19001`

## 默认本地端口映射

- Backend：`3101 -> 3001`
- PostgreSQL：`15432 -> 5432`
- Redis：`16379 -> 6379`
- MinIO API：`19000 -> 9000`
- MinIO Console：`19001 -> 9001`

## 环境变量说明

项目当前区分两套环境变量：

- `.env`
  - 本机直连 Docker 服务时使用
- `.env.docker`
  - 后端容器内部访问 `postgres / redis / minio` 时使用

常见变量包括：

- `DATABASE_URL`
- `PORT`
- `MINIO_ENDPOINT`
- `MINIO_PORT`
- `REDIS_HOST`
- `REDIS_PORT`

## 常用命令

- `pnpm start:dev` 开发模式启动
- `pnpm build` 构建项目
- `pnpm test` 运行单元测试
- `pnpm test:e2e` 运行端到端测试
- `pnpm prisma generate` 生成 Prisma Client

Docker 常用命令：

```powershell
docker compose up -d
docker compose up -d --build backend
docker compose down
docker logs -f nestjs-project1-backend
```

## 数据初始化说明

数据库启动后需要先同步表结构：

```powershell
docker exec nestjs-project1-backend pnpm prisma db push
```

如果你要直接联调前端，建议准备：

- 管理员账号
- 基础菜单数据
- 角色与菜单关系

否则前端登录后可能会进入“未分配菜单”页面。

## 开发说明

### 菜单与按钮权限

菜单表同时承载两类数据：

- 页面菜单 `type = menu`
- 按钮权限 `type = button`

前端动态菜单、动态路由和按钮权限，都是基于这里的数据驱动。

### 数据权限

角色模块已经支持：

- 全部数据
- 本部门及以下
- 本部门
- 仅本人
- 自定义

当前模型已经具备，后续可继续在业务查询中接入。

## 备注

这个 `README.md` 主要面向 GitHub 项目首页和快速启动。  
如果你需要看详细的模块职责、公共封装、权限链路，请看 [README_ARCHITECTURE.md](./README_ARCHITECTURE.md)。
