# 使用 monorepo 根目录作为构建上下文
FROM node:22-alpine

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制 workspace 依赖文件（利用 Docker 缓存）
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY admin-backend/package.json ./admin-backend/package.json

# 仅安装后端所需依赖
RUN pnpm install --filter admin-backend... --frozen-lockfile

# 复制后端代码
COPY admin-backend ./admin-backend

# 生成 Prisma Client 并构建后端
RUN pnpm --dir admin-backend exec prisma generate
RUN pnpm --dir admin-backend exec node node_modules/@prisma/client/scripts/postinstall.js
RUN pnpm --dir admin-backend build

WORKDIR /app/admin-backend

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["pnpm", "start:prod"]
