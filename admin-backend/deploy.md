# Admin Backend 部署说明

本文档分两部分：

1. Windows 本地开发部署
2. Linux 服务器更新部署

---

## 1. Windows 本地开发部署

### 1.1 适用场景

适用于你现在这台 Windows 电脑，使用 Docker Desktop 运行：

- PostgreSQL
- MinIO
- Redis
- NestJS 后端

### 1.2 前提条件

开始前请确认：

- 已安装并启动 Docker Desktop
- 当前目录是项目根目录 `admin-backend`
- 项目里已经有 `.env` 和 `.env.docker`

当前已验证可用的端口和账号如下：

- PostgreSQL
  - 端口：`15432`
  - 数据库：`admin_system`
  - 用户名：`postgres`
  - 密码：`123456`
- MinIO
  - API：`19000`
  - 控制台：`19001`
  - 用户名：`admin`
  - 密码：`12345678`
- Redis
  - 端口：`16379`
  - 密码：`123456`
- Backend
  - 端口：`3101`

### 1.3 首次启动

在 PowerShell 中执行：

```powershell
Set-Location 'd:\workspace_20260228\nest-front-backend\admin-backend'

docker compose up -d postgres minio redis
docker compose up -d --build backend

docker exec nestjs-project1-backend pnpm prisma db push
docker compose ps
```

### 1.4 访问地址

- Scalar 文档：`http://localhost:3101/api-docs`
- OpenAPI JSON：`http://localhost:3101/api-docs-json`
- MinIO 控制台：`http://localhost:19001`

默认连接信息：

- PostgreSQL
  - Host：`127.0.0.1`
  - Port：`15432`
  - Username：`postgres`
  - Password：`123456`
  - Database：`admin_system`
- Redis
  - Host：`127.0.0.1`
  - Port：`16379`
  - Password：`123456`
- MinIO
  - API：`http://localhost:19000`
  - Console：`http://localhost:19001`
  - Username：`admin`
  - Password：`12345678`

### 1.5 日常启动

如果镜像已经构建过，平时只需要：

```powershell
Set-Location 'd:\workspace_20260228\nest-front-backend\admin-backend'
docker compose up -d
```

### 1.6 日常停止

```powershell
Set-Location 'd:\workspace_20260228\nest-front-backend\admin-backend'
docker compose down
```

### 1.7 修改代码后的常用命令

#### 只改了后端代码

```powershell
Set-Location 'd:\workspace_20260228\nest-front-backend\admin-backend'
docker compose up -d --build backend
```

#### 改了 Prisma 表结构

```powershell
Set-Location 'd:\workspace_20260228\nest-front-backend\admin-backend'
docker compose up -d --build backend
docker exec nestjs-project1-backend pnpm prisma db push
```

#### 只想启动数据库和 MinIO

```powershell
Set-Location 'd:\workspace_20260228\nest-front-backend\admin-backend'
docker compose up -d postgres minio
```

### 1.8 常用排查命令

查看容器状态：

```powershell
docker compose ps
```

查看后端日志：

```powershell
docker logs -f nestjs-project1-backend
```

查看 PostgreSQL 日志：

```powershell
docker logs -f nestjs-project1-postgres
```

查看 MinIO 日志：

```powershell
docker logs -f nestjs-project1-minio
```

进入后端容器：

```powershell
docker exec -it nestjs-project1-backend sh
```

进入 PostgreSQL：

```powershell
docker exec -it nestjs-project1-postgres psql -U postgres -d admin_system
```

查看数据库表：

```powershell
docker exec -it nestjs-project1-postgres psql -U postgres -d admin_system -c "\dt"
```

在容器内重新同步 Prisma：

```powershell
docker exec nestjs-project1-backend pnpm prisma db push
```

### 1.9 本地开发注意事项

- 推荐直接使用 Docker 跑后端，不建议在 Windows 本机直接执行 `pnpm start`
- 原因是当前这台机器上，Prisma 在本机直连 PostgreSQL 时会出现认证异常，但在 Docker 容器内运行正常
- 如果后端容器第一次启动成功，MinIO 的业务桶会自动创建
- 当前项目没有内置默认管理员账号，第一次启动后需要先创建用户再登录获取 JWT
- PostgreSQL 使用了持久化目录 `./data/postgres`
- MinIO 使用了持久化目录 `./data/minio`
- Redis 使用了持久化目录 `./data/redis`

首次初始化建议：

1. 先调用 `POST /user` 创建首个管理员账号
2. 再调用 `POST /auth/login` 获取 `access_token`
3. 在 Scalar 文档页填入 `Authorization` 鉴权信息后再调试带锁接口

---

## 2. Linux 服务器更新部署

### 2.1 适用场景

适用于你远程服务器上的部署方式，配合 `deploy.sh` 使用。

### 2.2 服务器目录

默认服务器目录：

```bash
/home/nestjs-project1
```

后端目录：

```bash
/home/nestjs-project1/backend
```

### 2.3 日常更新流程

#### 只修改了代码

```bash
# 上传修改后的文件到服务器
# 然后执行
/home/nestjs-project1/deploy.sh
```

#### 修改了数据库结构

```bash
# 上传 prisma/schema.prisma 和 prisma/migrations
/home/nestjs-project1/deploy.sh
```

#### 同时修改了代码和数据库

```bash
/home/nestjs-project1/deploy.sh
```

### 2.4 服务器常用命令

只重启 backend：

```bash
docker-compose restart backend
```

重新构建 backend：

```bash
docker-compose up -d --build --no-deps backend
```

查看后端日志：

```bash
docker-compose logs -f backend
```

进入 backend 容器：

```bash
docker exec -it nestjs-project1-backend sh
```

执行 Prisma 同步：

```bash
docker exec -it nestjs-project1-backend sh -c "pnpm prisma db push"
```

执行 Prisma 迁移：

```bash
docker exec -it nestjs-project1-backend sh -c "pnpm prisma migrate deploy"
```

### 2.5 服务器注意事项

- 不要轻易执行 `docker-compose down`
- 优先使用 `docker-compose restart backend` 或 `docker-compose up -d --build --no-deps backend`
- 数据库变更前建议先备份
- `deploy.sh` 当前会用 `http://localhost:${BACKEND_HOST_PORT}/api-docs` 做健康检查

备份命令：

```bash
docker exec nestjs-project1-postgres pg_dump -U postgres -d admin_system > backup_$(date +%Y%m%d).sql
```

---

## 3. 环境变量说明

### 本机开发 `.env`

用于 Windows 本机读取：

```env
DATABASE_URL="postgresql://postgres:123456@localhost:15432/admin_system"
MINIO_ENDPOINT=localhost
REDIS_HOST=localhost
```

### Docker 后端 `.env.docker`

用于 Docker 容器内后端读取：

```env
DATABASE_URL="postgresql://postgres:123456@postgres:5432/admin_system"
MINIO_ENDPOINT=minio
REDIS_HOST=redis
```

---

## 4. 推荐用法

如果你是在自己电脑上开发，推荐使用下面这套：

```powershell
Set-Location 'd:\workspace_20260228\nest-front-backend\admin-backend'
docker compose up -d --build
docker exec nestjs-project1-backend pnpm prisma db push
```

如果你是在服务器上更新代码，推荐使用：

```bash
/home/nestjs-project1/deploy.sh
```
