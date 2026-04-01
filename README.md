# NestJS + Vue 3 Admin System | Enterprise RBAC Permission Management Monorepo

**一个生产级的企业后台管理系统单仓项目**，集成 RBAC 权限管理、用户角色菜单部门字典、MinIO 文件上传、Prisma + PostgreSQL、Redis 等完整能力。

[中文](#中文说明) | [English](#english)

**Enterprise-ready admin system monorepo** built with NestJS, Vue 3, Prisma, PostgreSQL, Redis, and MinIO. Production-grade solution for admin dashboards, RBAC permission management, file upload systems, back-office platforms, and internal management tools.

**Keywords:** NestJS, Vue 3, Admin System, Admin Template, RBAC, Permission Management, MinIO, File Upload, Prisma, PostgreSQL, Redis, Monorepo, 后台管理系统, 权限管理, 管理中台, 企业级后台

### Core Features

- **完整 RBAC 权限体系**：JWT 认证、角色权限、菜单权限、按钮权限、数据权限、权限指令
- **企业级用户管理**：用户管理、角色管理、菜单管理、部门管理、字典管理、用户分配
- **动态菜单系统**：菜单树形结构、动态路由、权限指令、按钮级权限控制
- **文件管理系统**：MinIO 集成、文件上传、资源管理、文件预览
- **生产级后端**：NestJS 11、Prisma ORM、PostgreSQL 15、Redis 7、Docker 支持
- **现代化前端**：Vue 3、Vite、Element Plus、Pinia 状态管理、Vue Router
- **开箱即用**：完整的 API 文档、Swagger/Scalar、Docker Compose、示例数据
- **适用场景**：企业后台管理系统、权限管理平台、运营中台、数据中台、SaaS 控台

### Quick Links

- Demo: [http://cow.zenoly.cn/login](http://cow.zenoly.cn/login)
- API Docs: [http://cow.zenoly.cn/api-docs#tag/%E8%AE%A4%E8%AF%81](http://cow.zenoly.cn/api-docs#tag/%E8%AE%A4%E8%AF%81)
- Frontend: [admin-front/README.md](./admin-front/README.md)
- Backend: [admin-backend/README.md](./admin-backend/README.md)

## 中文说明

这是一个面向企业后台场景的 `NestJS + Vue 3` 管理后台 monorepo，也是一个可直接二开的 `RBAC 权限管理系统 / 后台管理模板 / Admin System Starter`。

### 搜索关键词

如果你正在 GitHub 搜索下面这些关键词，这个仓库就是对应方向的项目：

**框架与技术栈：**
- NestJS / nest.js / Node.js 后端框架
- Vue 3 / Vue3 / 前端框架
- Prisma / ORM / 数据库 ORM
- PostgreSQL / 关系型数据库
- Redis / 缓存 / 会话管理
- MinIO / 对象存储 / 文件存储

**功能与特性：**
- RBAC / 权限管理 / 权限控制系统
- 后台管理系统 / Admin System / Admin Dashboard
- 管理后台模板 / Admin Template / Admin UI
- 用户管理 / 角色管理 / 菜单管理
- 部门管理 / 组织结构 / 组织管理
- 字典管理 / 数据字典 / 枚举管理
- 文件上传 / 文件管理 / 文件系统
- 动态菜单 / 菜单权限 / 按钮权限
- 数据权限 / 权限指令 / 权限装饰器

**应用场景：**
- 企业级后台 / 企业管理系统
- 中后台 / 管理中台 / 数据中台
- 权限平台 / 权限管理平台
- 运营平台 / 运营后台
- SaaS 控台 / SaaS 管理系统
- 内部系统 / 内部管理工具
- 业务系统脚手架 / 项目模板

**项目类型：**
- Monorepo / 单仓 / 前后端一体
- 全栈项目 / 全栈应用
- 开源项目 / GitHub 项目
- 学习项目 / 参考项目 / 示例项目
- 生产级项目 / 企业级项目

它不是“只能演示页面”的后台模板，也不是“只有接口缺少业务骨架”的半成品，而是一套可以直接落地、继续二开、适合作为真实项目底座的后台基础设施：

- `admin-front`：基于 Vue 3 + Vite + Element Plus 的管理端前端
- `admin-backend`：基于 NestJS + Prisma + PostgreSQL + Redis + MinIO 的后端 API

这个根目录现在作为统一入口，负责：

- 管理前后端代码目录
- 提供统一的 `pnpm workspace`
- 提供根级开发命令
- 提供适合放在 GitHub 首页的总说明

### 项目定位

这不是一个"只会展示登录页和表格页"的后台壳子，也不是"只有接口缺少业务骨架"的半成品。这是一套**可以直接支撑真实管理系统的生产级权限中台型基础项目**。

**三大核心承诺：**

- **能打**：账号认证、角色权限、菜单权限、按钮权限、部门隔离、字典管理、文件上传等后台常见核心能力已经完整串联，形成闭环的权限链路
- **能上手**：本地开发环境、Docker 依赖一键启动、完整 API 文档、前后端联调链路、示例数据全部配置完毕，开箱即用
- **能扩展**：权限模型、菜单树结构、角色关系、数据权限边界都预留了充分的扩展空间，支持二次开发和业务演进

### 项目亮点

- **完整 RBAC 权限体系**：账号认证、部门隔离、角色权限、菜单权限、按钮权限、数据权限，形成完整权限链路而非零散模块
- **生产级企业能力**：用户管理、角色管理、菜单管理、部门管理、数据字典、文件上传、认证鉴权、日志审计等一套齐全
- **真正可落地的动态菜单**：菜单驱动路由、按钮驱动权限、前后端权限消费链路打通，适合真实业务系统直接接入
- **实战工程实践**：统一响应格式、参数校验、异常处理、OpenAPI/Scalar 文档、Docker 部署、健康检查等完整配置
- **清晰的前后端分工**：前端负责权限消费、菜单渲染、用户体验；后端负责认证、授权、菜单树、角色关系、访问边界
- **开箱即用 + 易于扩展**：可直接作为中后台脚手架、权限平台、SaaS 控台底座，同时保留充分的二次开发空间
- **Monorepo 单仓协作**：前后端统一仓库、统一依赖、统一命令、统一文档，降低维护成本和团队交接难度
- **完整的本地开发体验**：Docker Compose 一键启动依赖、示例数据、API 文档、前后端联调链路全部配置完毕

### 项目预览

- 在线体验地址：[http://cow.zenoly.cn/login](http://cow.zenoly.cn/login)
- 演示账号：`admin`
- 演示密码：`123456`
- 后端接口文档：[http://cow.zenoly.cn/api-docs#tag/%E8%AE%A4%E8%AF%81](http://cow.zenoly.cn/api-docs#tag/%E8%AE%A4%E8%AF%81)

![NestJS Vue 3 admin system login page](image.png)
![Vue 3 admin dashboard home page](image-1.png)
![RBAC user management page](image-2.png)
![Role and permission management page](image-3.png)
![Menu management page](image-4.png)
![Department management page](image-5.png)
![Dictionary management page](image-6.png)
![File upload management page](image-7.png)

### 你能直接拿去做什么

- **企业内部管理系统**：公司内部管理后台、行政管理系统、员工管理平台
- **权限与访问控制平台**：权限管理平台、角色管理系统、访问控制框架
- **中后台与运营平台**：业务运营后台、运营管理系统、运营中台
- **数据与资产平台**：数据中台、资产管理平台、资源管理系统
- **SaaS 与多租户系统**：SaaS 控台、租户管理系统、订阅管理平台
- **快速项目启动**：中后台项目脚手架、管理系统模板、快速原型开发
- **团队学习参考**：NestJS + Vue 3 + Prisma + PostgreSQL 实战项目、全栈开发学习

### 适用场景

- **企业级应用**：企业内部管理后台、公司管理系统、行政管理平台
- **权限管理系统**：权限平台、角色管理、访问控制、权限审计
- **中后台平台**：业务中台、运营中台、数据中台、管理中台
- **资产与数据管理**：资产管理平台、数据管理系统、资源管理平台
- **SaaS 与多租户**：SaaS 控台、多租户系统、订阅管理、租户隔离
- **业务系统底座**：需要用户、角色、菜单、部门、字典、文件上传的业务系统
- **快速原型与启动**：需要"开箱即用"同时保留二次开发空间的项目
- **学习与参考**：全栈开发学习、企业级架构参考、生产级代码示例

### 项目结构

```text
.
├─ admin-backend/          NestJS 后端 API 服务
├─ admin-front/            Vue 3 前端管理应用
├─ package.json            根级统一脚本和依赖
├─ pnpm-workspace.yaml     pnpm workspace 单仓配置
├─ docker-compose.yml      本地依赖服务编排
├─ admin_system_dump_utf8.sql  示例数据 SQL 文件
└─ README.md               中英双语项目说明
```

### 技术栈

**前端技术栈：**
- Vue 3（渐进式 JavaScript 框架）
- Vite（下一代前端构建工具）
- Element Plus（企业级 UI 组件库）
- Pinia（Vue 3 状态管理）
- Vue Router（前端路由）

**后端技术栈：**
- NestJS 11（企业级 Node.js 框架）
- Prisma 6（现代 ORM）
- PostgreSQL 15（关系型数据库）
- Redis 7（缓存和会话管理）
- MinIO（对象存储服务）

**工程工具：**
- pnpm（高效的包管理器）
- Docker Compose（容器编排）
- OpenAPI/Scalar（API 文档）
- ESLint + Prettier（代码质量）

### 环境要求

- **Node.js 18+**（JavaScript 运行时）
- **pnpm 8+**（高效的包管理器）
- **Docker Desktop / Docker Compose**（容器运行环境）

### 本地运行前提

在本地启动项目前，请先确认下面 3 个依赖服务已经可用：

- **PostgreSQL 15**（关系型数据库）
- **Redis 7**（缓存和会话存储）
- **MinIO**（对象存储服务）

**本地默认端口配置：**

| 服务 | 端口 | 说明 |
|------|------|------|
| PostgreSQL | `localhost:15432` | 数据库服务 |
| Redis | `localhost:16379` | 缓存服务 |
| MinIO API | `localhost:19000` | 对象存储 API |
| MinIO Console | `localhost:19001` | MinIO 管理控制台 |

**一键启动所有依赖服务：**

如果你不想手动逐个启动服务，直接执行下面这条命令即可一键拉起所有本地依赖：

```bash
pnpm docker:deps:up
```

这个命令会使用 Docker Compose 自动启动 PostgreSQL、Redis 和 MinIO 容器。

### 本地快速开始

**第 1 步：克隆项目**

```bash
git clone https://github.com/rowan766/nest-front-backend.git
cd nest-front-backend
```

**第 2 步：安装依赖**

```bash
pnpm install
```

**第 3 步：启动依赖服务（PostgreSQL、Redis、MinIO）**

```bash
pnpm docker:deps:up
```

等待所有容器启动完成（通常需要 10-30 秒）。

**第 4 步：初始化数据库**

```bash
pnpm db:push
```

这个命令会根据 Prisma schema 创建数据库表结构。

**第 5 步：启动后端服务**

```bash
pnpm dev:backend
```

后端服务将运行在 `http://localhost:3101`，API 文档在 `http://localhost:3101/api-docs`

**第 6 步：启动前端应用**

在新的终端窗口中执行：

```bash
pnpm dev:front
```

前端应用将运行在 `http://localhost:5173`

### 推荐启动顺序

为了避免第一次启动时出现连接失败或数据不完整的问题，建议按下面顺序运行：

1. `pnpm docker:deps:up` — 启动 PostgreSQL、Redis、MinIO 容器
2. `pnpm install` — 安装前后端依赖
3. `pnpm db:push` — 创建数据库表结构
4. `pnpm dev:backend` — 启动后端 API 服务
5. `pnpm dev:front` — 启动前端开发服务器

**等待提示：** 每一步完成后，请等待命令行提示成功后再执行下一步。

### 首次初始化说明

**重要：** `pnpm db:push` 只会创建数据库表结构，**不会自动导入管理员账号、角色、菜单、字典等业务数据**。

这意味着，如果你是第一次 clone 仓库并使用全新的本地数据库：

- ✅ 后端可以正常启动
- ✅ 前端页面可以打开
- ❌ 但登录可能失败，因为数据库里还没有初始化管理员账号和菜单数据

**要体验完整的后台系统，你需要准备以下数据：**

- 一个管理员账号（用于登录）
- 基础角色数据（如超级管理员、普通用户等）
- 基础菜单数据（如仪表板、用户管理、角色管理等）
- 用户与角色的关联关系
- 角色与菜单的关联关系

**推荐方案：** 使用仓库提供的示例数据 SQL 文件快速初始化（见下一节）。

### 导入仓库内置示例数据

仓库根目录已经提供了一份完整的示例数据 SQL 文件：

- [admin_system_dump_utf8.sql](./admin_system_dump_utf8.sql)

这个文件包含了完整的管理员账号、角色、菜单、部门、字典等初始化数据，可以让你快速体验完整的后台系统。

**前置条件：** 确保已经执行了 `pnpm docker:deps:up` 启动了 PostgreSQL 容器。

**导入步骤：**

**第 1 步：确认 PostgreSQL 容器已启动**

```bash
docker ps
```

你应该看到 `nestjs-project1-postgres` 容器在运行中。

**第 2 步：创建数据库（如果还没有创建）**

```bash
docker exec -it nestjs-project1-postgres psql -U postgres -c "CREATE DATABASE admin_system;"
```

**第 3 步：导入示例数据**

根据你的操作系统选择对应的命令：

**Windows PowerShell：**

```powershell
Get-Content .\admin_system_dump_utf8.sql | docker exec -i nestjs-project1-postgres psql -U postgres -d admin_system
```

**macOS / Linux / Git Bash：**

```bash
docker exec -i nestjs-project1-postgres psql -U postgres -d admin_system < admin_system_dump_utf8.sql
```

**第 4 步：启动后端和前端**

```bash
pnpm dev:backend
pnpm dev:front
```

**导入完成后，你可以直接使用以下凭证登录：**

- 账号：`admin`
- 密码：`123456`

系统会自动加载所有预置的管理员、角色、菜单、部门、字典等基础数据，无需手动创建。

### 本地访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端应用 | `http://localhost:5173` | Vue 3 管理后台 |
| 后端 API | `http://localhost:3101` | NestJS API 服务 |
| API 文档 | `http://localhost:3101/api-docs` | Swagger/Scalar 交互式文档 |
| OpenAPI JSON | `http://localhost:3101/api-docs-json` | OpenAPI 规范 JSON |
| MinIO 控制台 | `http://localhost:19001` | 对象存储管理界面 |

### 本地联调说明

**前后端自动代理配置：**

- 前端开发服务器已配置自动代理：`/api` → `http://localhost:3101`
- 前端本地访问接口时，**无需手动改成完整后端域名**
- 只要后端本地启动成功，前端就可以直接联调

**环境隔离：**

- 本地开发使用的是仓库中的本地环境配置（`.env.local`）
- 不会影响你服务器上的生产配置
- 前后端可以独立开发和测试

**调试建议：**

- 使用浏览器开发者工具（F12）查看网络请求
- 查看 API 文档：`http://localhost:3101/api-docs`
- 后端日志会在终端中实时输出

### 常见问题

**Q1：`pnpm db:push` 成功了但登录失败？**

A：这通常不是后端没启动，而是数据库里还没有初始化管理员账号或菜单数据。

解决方案：
- 导入示例数据：`docker exec -i nestjs-project1-postgres psql -U postgres -d admin_system < admin_system_dump_utf8.sql`
- 或手动在数据库中创建管理员账号和菜单数据

**Q2：前端能打开但接口请求失败？**

A：请检查以下几点：

- 确认后端是否成功运行在 `http://localhost:3101`
- 查看浏览器控制台（F12）的网络请求，检查错误信息
- 确认后端没有报错，查看后端终端输出
- 尝试直接访问 `http://localhost:3101/api-docs` 检查 API 文档是否可用

**Q3：文件上传失败？**

A：请确认以下几点：

- MinIO 容器已启动：`docker ps | grep minio`
- MinIO API 端口 `19000` 和控制台端口 `19001` 可访问
- 检查 MinIO 控制台：`http://localhost:19001`
- 查看后端日志中的 MinIO 连接错误

**Q4：API 文档中接口请求失败？**

A：API 文档需要认证令牌才能测试受保护的接口。

解决方案：
- 先在前端页面登录（`http://localhost:5173`）
- 登录成功后，去浏览器缓存中取 token
- 或手动复制 token 到 API 文档的 Authorization 头中

**Q5：Docker 容器启动失败？**

A：检查以下几点：

- 确认 Docker Desktop 已启动
- 检查端口是否被占用：`netstat -an | grep 15432` 等
- 查看容器日志：`docker logs nestjs-project1-postgres`
- 尝试重启 Docker：`docker restart` 或重启 Docker Desktop

**Q6：pnpm 命令找不到？**

A：确认 pnpm 已全局安装：

```bash
npm install -g pnpm
pnpm --version
```

如果仍然失败，尝试使用 npm 替代：

```bash
npm install
npm run dev:backend
npm run dev:front
```

### 线上演示

**完整的在线演示环境已部署，你可以直接体验：**

- **前端演示地址**：[http://cow.zenoly.cn/login](http://cow.zenoly.cn/login)
- **测试账号**：`admin`
- **测试密码**：`123456`
- **后端 API 文档**：[http://cow.zenoly.cn/api-docs#tag/%E8%AE%A4%E8%AF%81](http://cow.zenoly.cn/api-docs#tag/%E8%AE%A4%E8%AF%81)

演示环境包含完整的管理员、角色、菜单、部门、字典等数据，可以体验所有核心功能。

### 独立仓库

如果你只需要前端或后端，可以访问独立的仓库：

- **独立后端仓库**：[https://github.com/rowan766/admin-backend](https://github.com/rowan766/admin-backend)
- **独立前端仓库**：[https://github.com/rowan766/admin-front](https://github.com/rowan766/admin-front)

### 前后端联调关系

**本地开发时的联调流程：**

- 前端开发服务器已配置代理：`/api` → `http://localhost:3101`
- 后端默认监听端口：`3101`
- 因此本地联调时，通常只需要：
  1. 先启动后端：`pnpm dev:backend`
  2. 再启动前端：`pnpm dev:front`
  3. 前端会自动连接到本地后端

### 根目录常用命令

**开发命令：**

```bash
pnpm dev:front          # 启动前端开发服务器（Vite）
pnpm dev:backend        # 启动后端开发服务器（NestJS）
pnpm dev                # 同时启动前后端（如果配置了）
```

**构建命令：**

```bash
pnpm build              # 构建前后端
pnpm build:front        # 构建前端（生成 dist 目录）
pnpm build:backend      # 构建后端（生成 dist 目录）
```

**代码质量命令：**

```bash
pnpm lint:backend       # 检查后端代码风格
pnpm test:backend       # 运行后端单元测试
pnpm test:e2e:backend   # 运行后端端到端测试
```

**Docker 命令：**

```bash
pnpm docker:deps:up     # 启动依赖服务（PostgreSQL、Redis、MinIO）
pnpm docker:backend:up  # 启动后端 Docker 容器
pnpm docker:down        # 停止所有 Docker 容器
```

**数据库命令：**

```bash
pnpm db:push            # 根据 Prisma schema 创建/更新数据库表
pnpm db:migrate         # 运行数据库迁移
pnpm db:seed            # 导入示例数据（如果配置了）
```

### 子项目文档

**前端文档：**

- [admin-front/README.md](./admin-front/README.md) — 前端项目说明和快速开始
- [admin-front/README_ARCHITECTURE.md](./admin-front/README_ARCHITECTURE.md) — 前端架构设计和代码组织
- [admin-front/README_SYSTEM.md](./admin-front/README_SYSTEM.md) — 前端系统功能说明

**后端文档：**

- [admin-backend/README.md](./admin-backend/README.md) — 后端项目说明和快速开始
- [admin-backend/README_ARCHITECTURE.md](./admin-backend/README_ARCHITECTURE.md) — 后端架构设计和代码组织
- [admin-backend/deploy.md](./admin-backend/deploy.md) — 后端部署指南（Docker、服务器部署）

**推荐阅读顺序：**

1. 本文档（总体了解项目）
2. 前端 README（了解前端开发）
3. 后端 README（了解后端开发）
4. 架构文档（深入理解设计）
5. 部署指南（生产环境部署）

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

Enterprise-ready `NestJS + Vue 3 / Vue3` admin system monorepo for RBAC permission management, admin dashboard, file upload management, back-office platform, and internal tools.

### Search Keywords

**Framework & Technology Stack:**
- NestJS / nest.js / Node.js backend framework
- Vue 3 / Vue3 / frontend framework
- Prisma / ORM / database ORM
- PostgreSQL / relational database
- Redis / caching / session management
- MinIO / object storage / file storage

**Features & Capabilities:**
- RBAC / role-based access control / permission management
- Admin system / admin dashboard / admin panel
- Admin template / admin UI / admin starter
- User management / role management / menu management
- Department management / organization structure
- Dictionary management / data dictionary / enum management
- File upload / file management / file system
- Dynamic menu / menu permissions / button permissions
- Data scope / permission directive / permission decorator

**Use Cases & Scenarios:**
- Enterprise admin system / enterprise management platform
- Back-office platform / back-office system
- Permission platform / permission management system
- Operation platform / operations dashboard
- SaaS control panel / SaaS management system
- Internal management tool / internal system
- Business system starter / project template

**Project Type:**
- Monorepo / single repository / full-stack
- Full-stack application / full-stack project
- Open source / GitHub project
- Learning project / reference project / example project
- Production-grade / enterprise-grade

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

- **Complete RBAC Permission System**: Account authentication, department isolation, role-based access, menu permissions, button-level permissions, data scope control—forming a unified permission chain rather than scattered modules
- **Production-Grade Enterprise Features**: User management, role management, menu management, department management, data dictionaries, file uploads, authentication, authorization, audit logging—all included out of the box
- **Truly Implementable Dynamic Menus**: Menu-driven routing, button-driven permissions, unified frontend/backend permission consumption flow—ready for real business systems without demo limitations
- **Enterprise Engineering Practices**: Input validation, exception handling, unified response format, OpenAPI/Scalar documentation, Docker deployment, health checks, and comprehensive error handling
- **Clear Separation of Concerns**: Frontend handles permission consumption, menu rendering, and user experience; backend owns authentication, authorization, role relationships, and access boundaries
- **Starter Kit + Extensible Foundation**: Works as a ready-to-use admin scaffold, permission platform, or SaaS control panel foundation while maintaining ample room for customization
- **Monorepo Single-Repository Model**: Frontend and backend in one repository with unified dependencies, shared commands, and centralized documentation—reducing maintenance overhead and team onboarding friction
- **Complete Local Development Experience**: Docker Compose for one-command dependency setup, sample data, API documentation, and full frontend/backend integration testing ready to go

### Preview

- Online demo: [http://cow.zenoly.cn/login](http://cow.zenoly.cn/login)
- Demo account: `admin`
- Demo password: `123456`
- API docs: [http://cow.zenoly.cn/api-docs#tag/%E8%AE%A4%E8%AF%81](http://cow.zenoly.cn/api-docs#tag/%E8%AE%A4%E8%AF%81)

### What You Can Build With It

- **Enterprise Admin Systems**: Internal management platforms, corporate dashboards, system administration portals
- **Permission & Access Control Platforms**: Role-based access control systems, permission management platforms, authorization frameworks
- **Back-Office & Operations Platforms**: Business operation systems, operational dashboards, management consoles
- **Data & Asset Platforms**: Data platforms, asset management systems, resource management portals
- **SaaS & Multi-Tenant Systems**: SaaS control panels, tenant management systems, subscription platforms
- **Learning & Reference Projects**: Production-grade example for NestJS + Vue 3 + Prisma + PostgreSQL + Redis + MinIO integration

### Best For

- **Enterprise Organizations**: Internal management systems, corporate admin platforms, system administration tools
- **Back-Office Operations**: Operational dashboards, business management systems, operations centers
- **Permission Management**: Permission platforms, access control systems, authorization management
- **Data & Asset Management**: Data platforms, asset management, resource management systems
- **SaaS Platforms**: Multi-tenant systems, subscription management, control panels
- **Teams Learning Full-Stack**: Practical reference for modern full-stack development with enterprise patterns
- **Projects Needing Quick Launch**: Ready-to-use starter kit that doesn't sacrifice production quality for speed

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

### Prerequisites For Local Development

Before running the project locally, make sure these three services are available:

- PostgreSQL
- Redis
- MinIO

This repository assumes the following local ports by default:

- PostgreSQL: `localhost:15432`
- Redis: `localhost:16379`
- MinIO API: `localhost:19000`
- MinIO Console: `localhost:19001`

If you want to start them with one command, run:

```bash
pnpm docker:deps:up
```

### Local Quick Start

1. Clone the repository

```bash
git clone https://github.com/rowan766/nest-front-backend.git
cd nest-front-backend
```

2. Install dependencies

```bash
pnpm install
```

3. Start PostgreSQL, Redis, and MinIO

```bash
pnpm docker:deps:up
```

4. Push the Prisma schema

```bash
pnpm db:push
```

5. Start the backend

```bash
pnpm dev:backend
```

6. Start the frontend

```bash
pnpm dev:front
```

### Recommended Startup Order

For a smoother first-time run, use this order:

1. `pnpm docker:deps:up`
2. `pnpm install`
3. `pnpm db:push`
4. `pnpm dev:backend`
5. `pnpm dev:front`

### First-Time Initialization Notes

`pnpm db:push` creates the database schema only. It does not automatically insert an admin user, roles, menus, dictionaries, or other business data.

So on a completely fresh local database:

- the backend can still start normally
- the frontend can still open normally
- but you may not be able to fully use the system until initial admin and menu data are prepared

To get the full admin experience locally, it is recommended to prepare at least:

- one admin account
- base role data
- base menu data
- user-role and role-menu relation data

### Sample Data Recommendation

If you plan to publish this repository as an open-source project, it is a good idea to make it explicit that the project does not automatically bundle full demo data, and that first-time users may need a minimal initialization dataset.

The minimum recommended dataset usually includes:

- an admin account
- a super admin role
- a dashboard menu
- menus for user, role, menu, department, and dictionary management
- user-role relations
- role-menu relations

Two practical approaches are recommended:

- Option 1: provide an initialization SQL file for manual import
- Option 2: add a seed script later so users can populate base data right after `pnpm db:push`

If the repository does not yet include a built-in seed process, README should state that clearly so users do not assume that schema creation alone is enough for a full login experience

### Import The Built-In Demo SQL

The repository already includes a demo SQL file at the root:

- [admin_system_dump_utf8.sql](./admin_system_dump_utf8.sql)

If your local PostgreSQL container is already running and mapped as `15432:5432`, you can import the demo data with the steps below.

1. Make sure PostgreSQL is running

```bash
docker ps
```

2. Create the `admin_system` database if it does not exist yet

```bash
docker exec -it nestjs-project1-postgres psql -U postgres -c "CREATE DATABASE admin_system;"
```

3. If you want to replace the current local data with the full demo dataset, recreate the database first

```bash
docker exec -it nestjs-project1-postgres psql -U postgres -c "DROP DATABASE IF EXISTS admin_system;"
docker exec -it nestjs-project1-postgres psql -U postgres -c "CREATE DATABASE admin_system;"
```

4. Import the SQL file

Windows PowerShell:

```powershell
Get-Content .\admin_system_dump_utf8.sql | docker exec -i nestjs-project1-postgres psql -U postgres -d admin_system
```

macOS / Linux / Git Bash:

```bash
docker exec -i nestjs-project1-postgres psql -U postgres -d admin_system < admin_system_dump_utf8.sql
```

5. Start the backend and frontend after the import

```bash
pnpm dev:backend
pnpm dev:front
```

After the import, you can use the built-in admin, role, menu, and other base data for a smoother local demo experience.

### Local URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3101`
- API Docs: `http://localhost:3101/api-docs`
- OpenAPI JSON: `http://localhost:3101/api-docs-json`
- MinIO Console: `http://localhost:19001`

### Local Integration Notes

- The frontend dev server proxies `/api` to `http://localhost:3101`
- You do not need to hardcode a backend domain for local frontend/backend integration
- As long as the backend is running locally, the frontend can call it directly
- Local development uses local environment settings and does not affect your production server configuration

### Common Issues

- `pnpm db:push` succeeds but login still fails:
  the database schema exists, but the admin account or base menu data is still missing
- The frontend opens but API requests fail:
  make sure the backend is really running at `http://localhost:3101`
- File upload fails:
  make sure MinIO is started and available on `19000 / 19001`

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
