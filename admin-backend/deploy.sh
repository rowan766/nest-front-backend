#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🚀 开始部署 NestJS 项目${NC}"
echo -e "${GREEN}========================================${NC}"

PROJECT_DIR="/home/nestjs-project1"
BACKEND_DIR="$PROJECT_DIR/backend"

cd $BACKEND_DIR || exit 1

if [ -f .env ]; then
    set -a
    . ./.env
    set +a
fi

BACKEND_HOST_PORT="${BACKEND_HOST_PORT:-3101}"
SERVER_HOST="${SERVER_HOST:-8.130.84.165}"

# 检测代码变化
echo -e "${YELLOW}📊 检测文件变化...${NC}"

CURRENT_SRC_MD5=$(find src -type f -exec md5sum {} \; 2>/dev/null | sort | md5sum | awk '{print $1}')
CURRENT_PACKAGE_MD5=$(md5sum package.json 2>/dev/null | awk '{print $1}')
CURRENT_PRISMA_MD5=$(find prisma -type f -exec md5sum {} \; 2>/dev/null | sort | md5sum | awk '{print $1}')

LAST_SRC_MD5=$(cat $PROJECT_DIR/.last_deploy_src_md5 2>/dev/null || echo "")
LAST_PACKAGE_MD5=$(cat $PROJECT_DIR/.last_deploy_package_md5 2>/dev/null || echo "")
LAST_PRISMA_MD5=$(cat $PROJECT_DIR/.last_deploy_prisma_md5 2>/dev/null || echo "")

SRC_CHANGED=false
PACKAGE_CHANGED=false
PRISMA_CHANGED=false

if [ "$CURRENT_SRC_MD5" != "$LAST_SRC_MD5" ]; then
    SRC_CHANGED=true
    echo -e "${BLUE}  ✓ 检测到源代码变化${NC}"
fi

if [ "$CURRENT_PACKAGE_MD5" != "$LAST_PACKAGE_MD5" ]; then
    PACKAGE_CHANGED=true
    echo -e "${BLUE}  ✓ 检测到依赖文件变化${NC}"
fi

if [ "$CURRENT_PRISMA_MD5" != "$LAST_PRISMA_MD5" ]; then
    PRISMA_CHANGED=true
    echo -e "${BLUE}  ✓ 检测到数据库结构变化${NC}"
fi

if [ "$SRC_CHANGED" = false ] && [ "$PACKAGE_CHANGED" = false ] && [ "$PRISMA_CHANGED" = false ]; then
    echo -e "${GREEN}✅ 没有检测到代码变化，跳过部署${NC}"
    exit 0
fi

# 备份
echo -e "${YELLOW}💾 备份当前版本...${NC}"
BACKUP_DIR="$PROJECT_DIR/backups/backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR
cp -r $BACKEND_DIR/dist $BACKUP_DIR/ 2>/dev/null || true

# ==================== 关键改动：只重启 backend ====================
echo -e "${YELLOW}🔨 重新构建 backend 镜像（不影响数据库）...${NC}"
cd $PROJECT_DIR

# 只重新构建和启动 backend，不停止数据库
docker-compose up -d --build --no-deps backend

# 等待启动
echo -e "${YELLOW}⏳ 等待 backend 容器启动...${NC}"
sleep 20

# 处理数据库变化
if [ "$PRISMA_CHANGED" = true ]; then
    echo -e "${YELLOW}📊 执行数据库迁移...${NC}"
    docker exec nestjs-project1-backend sh -c "pnpm prisma migrate deploy" 2>&1 || \
    docker exec nestjs-project1-backend sh -c "pnpm prisma db push" 2>&1
    
    docker exec nestjs-project1-backend sh -c "pnpm prisma generate" 2>&1
fi

# 健康检查
echo -e "${YELLOW}🏥 执行健康检查...${NC}"
sleep 5

MAX_RETRY=10
RETRY=0
HEALTH_CHECK=""

while [ $RETRY -lt $MAX_RETRY ]; do
    HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${BACKEND_HOST_PORT}/api-docs")
    
    if [ "$HEALTH_CHECK" = "200" ] || [ "$HEALTH_CHECK" = "302" ]; then
        echo -e "${GREEN}✅ 健康检查通过 (HTTP $HEALTH_CHECK)${NC}"
        
        # 保存 MD5
        echo "$CURRENT_SRC_MD5" > $PROJECT_DIR/.last_deploy_src_md5
        echo "$CURRENT_PACKAGE_MD5" > $PROJECT_DIR/.last_deploy_package_md5
        echo "$CURRENT_PRISMA_MD5" > $PROJECT_DIR/.last_deploy_prisma_md5
        
        break
    fi
    
    RETRY=$((RETRY+1))
    echo -e "${YELLOW}  等待服务启动... ($RETRY/$MAX_RETRY)${NC}"
    sleep 3
done

if [ "$HEALTH_CHECK" != "200" ] && [ "$HEALTH_CHECK" != "302" ]; then
    echo -e "${RED}❌ 健康检查失败 (HTTP $HEALTH_CHECK)${NC}"
    echo -e "${YELLOW}查看日志: docker-compose logs -f backend${NC}"
    exit 1
fi

# 清理旧备份
echo -e "${YELLOW}🧹 清理旧备份...${NC}"
cd $PROJECT_DIR/backups
ls -t | tail -n +6 | xargs -r rm -rf

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ 部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"

if [ "$SRC_CHANGED" = true ]; then
    echo -e "${BLUE}  • 源代码已更新${NC}"
fi

if [ "$PACKAGE_CHANGED" = true ]; then
    echo -e "${BLUE}  • 依赖已更新${NC}"
fi

if [ "$PRISMA_CHANGED" = true ]; then
    echo -e "${BLUE}  • 数据库结构已更新${NC}"
fi

echo -e ""
echo -e "${YELLOW}访问地址:${NC} http://${SERVER_HOST}:${BACKEND_HOST_PORT}/api-docs"
echo -e "${YELLOW}查看日志:${NC} docker-compose logs -f backend"
