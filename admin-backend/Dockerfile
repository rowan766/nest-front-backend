# 使用 Node.js 18 作为基础镜像
FROM node:18-alpine

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制依赖文件（利用 Docker 缓存）
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制 prisma 目录
COPY prisma ./prisma

# 生成 Prisma Client（必须在 COPY 代码之前）
RUN pnpm prisma generate

# 复制所有代码
COPY . .

# 构建项目
RUN pnpm run build

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["pnpm", "run", "start:prod"]