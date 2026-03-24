# `cow.zenoly.cn` 部署说明

这套说明适用于当前 monorepo：

- 前端：`admin-front`
- 后端：`admin-backend`
- 域名：`cow.zenoly.cn`
- 现有宿主机服务：
  - `nestjs-project1-minio`
  - `nestjs-project1-redis`

## 推荐目录

代码目录和数据目录分开，不要把数据库 / MinIO 数据放进 Git 仓库目录。

```text
/srv/nest-front-backend              # Git 仓库
/srv/zenoly-data/cow/postgres        # 当前项目 PostgreSQL 数据
/srv/zenoly-data/shared/minio        # 现有 MinIO 数据
/srv/zenoly-data/shared/redis        # 现有 Redis 数据
```

如果你后面迁移 MinIO / Redis，也建议继续放在 `/srv/zenoly-data/...` 这种独立目录，而不是 `/srv/nest-front-backend/admin-backend/data`。

## 前端

前端已经改成默认走同域名反代：

```env
VITE_API_BASE_URL=/api
```

部署前端：

```bash
cd /srv/nest-front-backend
pnpm install
pnpm build:front
```

构建产物目录：

```text
/srv/nest-front-backend/admin-front/dist
```

## 后端

后端 Docker 构建已经改成适配 monorepo，服务器上可以直接用：

```bash
cd /srv/nest-front-backend/admin-backend
cp .env.server.example .env.server
docker compose -f docker-compose.server.yml --env-file .env.server up -d --build
docker exec nestjs-project1-backend pnpm prisma migrate deploy || docker exec nestjs-project1-backend pnpm prisma db push
```

关键点：

- `PostgreSQL` 由 `docker-compose.server.yml` 启动
- `MinIO` 和 `Redis` 继续复用宿主机上已有的容器
- 后端通过 `host.docker.internal` 访问宿主机暴露的 `9000` 和 `6379`
- 后端端口默认只绑定 `127.0.0.1:3101`，由 Nginx 对外转发

## Nginx

把 [admin-front/admin-frontend.conf](./admin-front/admin-frontend.conf) 放到服务器 Nginx 配置目录，例如：

```bash
sudo cp /srv/nest-front-backend/admin-front/admin-frontend.conf /etc/nginx/conf.d/cow.zenoly.cn.conf
sudo nginx -t
sudo systemctl reload nginx
```

这个配置会提供：

- `https://cow.zenoly.cn/` 前端
- `https://cow.zenoly.cn/api/*` 后端接口
- `https://cow.zenoly.cn/api-docs` Swagger

## HTTPS

证书签发完成后再给 Nginx 打开 HTTPS，例如使用 `certbot`：

```bash
sudo certbot --nginx -d cow.zenoly.cn
```

## 宿主机数据目录建议

对于数据库和对象存储，推荐原则是：

- 放在宿主机固定数据目录
- 跟 Git 代码目录分离
- 备份时只备份数据目录，不碰代码目录

简单说就是：

- 代码放 `/srv/nest-front-backend`
- 数据放 `/srv/zenoly-data/...`

这比把 `postgres` 和 `minio` 数据直接放到项目目录里更稳，也更方便迁移和备份。
