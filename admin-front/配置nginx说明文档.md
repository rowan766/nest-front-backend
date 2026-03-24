# 📘 Nginx 多项目部署配置文档

## 一、端口规划示例

```
管理后台前端    → 80 端口
用户端前端      → 8081 端口
移动端前端      → 8082 端口
商家端前端      → 8083 端口

后端 API 1     → 3001 端口
后端 API 2     → 3002 端口
后端 API 3     → 3003 端口

MinIO         → 9000/9001 端口
PostgreSQL    → 5432 端口（内部）
Redis         → 6379 端口（内部）
```

## 二、新增前端项目标准流程

### 步骤 1：本地构建前端

bash

```bash
# 进入前端项目目录
cd /path/to/your-frontend

# 配置生产环境变量
# 创建 .env.production
VITE_API_BASE_URL=http://8.130.84.165:3002

# 构建
pnpm run build
```

---

### 步骤 2：服务器创建项目目录

bash

```bash
# SSH 连接服务器
ssh root@8.130.84.165

# 创建项目目录（替换为你的项目名）
mkdir -p /home/项目名-frontend

# 示例
mkdir -p /home/user-frontend
```

### 步骤 3：上传构建文件

**用 XFTP：**

* 本地：`项目目录/dist/` 下的所有文件
* 服务器：`/home/项目名-frontend/`

**验证上传：**

bash

```bash
ls -la /home/项目名-frontend/
# 应该看到 index.html 和 assets/ 等文件
```

### 步骤 4：创建 Nginx 配置文件

bash

```bash
vi /etc/nginx/conf.d/项目名-frontend.conf
```

**配置模板：**

nginx

```nginx
server {
    listen 8081;              # ← 改成新端口
    server_name _;

    root /home/项目名-frontend;  # ← 改成项目目录
    index index.html;

    # Vue Router history 模式支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存（可选）
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩（可选）
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;
}
```

**完整示例（用户端前端）：**

nginx

```nginx
server {
    listen 8081;
    server_name _;

    root /home/user-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

---

### 步骤 5：测试并重启 Nginx

bash

```bash
# 测试配置文件语法
nginx -t

# 如果显示 successful，重启 Nginx
systemctl restart nginx

# 查看 Nginx 状态
systemctl status nginx
```

---

### 步骤 6：开放端口

**阿里云安全组：**

1. 登录阿里云控制台
2. ECS 实例 → 安全组 → 配置规则
3. 添加入方向规则：
   - 端口：`8081`（你的新端口）
   - 协议：`TCP`
   - 授权对象：`0.0.0.0/0`

---

### 步骤 7：访问测试

```
http://8.130.84.165:8081/
```

---

## 三、配置文件位置总结

```
/etc/nginx/
├── nginx.conf                              # 主配置文件
└── conf.d/
    ├── admin-frontend.conf                 # 管理后台（80端口）
    ├── user-frontend.conf                  # 用户端（8081端口）
    ├── mobile-frontend.conf                # 移动端（8082端口）
    └── merchant-frontend.conf              # 商家端（8083端口）

/home/
├── admin-frontend/                         # 管理后台前端文件
├── user-frontend/                          # 用户端前端文件
├── mobile-frontend/                        # 移动端前端文件
└── merchant-frontend/                      # 商家端前端文件
```

---

## 四、常用 Nginx 命令

bash

```bash
# 测试配置文件
nginx -t

# 重启 Nginx
systemctl restart nginx

# 重新加载配置（不中断服务）
systemctl reload nginx

# 查看状态
systemctl status nginx

# 查看错误日志
tail -f /var/log/nginx/error.log

# 查看访问日志
tail -f /var/log/nginx/access.log
```

---

## 五、项目更新流程

### 更新前端代码

bash

```bash
# 1. 本地重新构建
pnpm run build

# 2. 用 XFTP 上传覆盖
#    上传到对应的 /home/项目名-frontend/

# 3. 清除浏览器缓存
#    浏览器按 Ctrl + F5 强制刷新

# 不需要重启 Nginx
```

---

## 六、高级配置（可选）

### 1. 添加 API 代理（解决跨域）

nginx

```nginx
server {
    listen 8081;
    server_name _;
  
    root /home/user-frontend;
    index index.html;
  
    location / {
        try_files $uri $uri/ /index.html;
    }
  
    # 代理后端 API
    location /api/ {
        proxy_pass http://localhost:3002/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**前端配置改为相对路径：**

properties

```properties
# .env.production
VITE_API_BASE_URL=/api
```

---

### 2. 配置 HTTPS（如果有域名和证书）

nginx

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
  
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
  
    root /home/user-frontend;
    index index.html;
  
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# HTTP 自动跳转 HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 七、故障排查

### 问题 1：访问 404

**检查：**

bash

```bash
# 文件是否存在
ls -la /home/项目名-frontend/index.html

# Nginx 配置是否正确
nginx -t

# 查看错误日志
tail -f /var/log/nginx/error.log
```

---

### 问题 2：端口访问不了

**检查：**

bash

```bash
# 端口是否监听
netstat -tulnp | grep 8081

# 阿里云安全组是否开放端口

# 重启 Nginx
systemctl restart nginx
```

---

### 问题 3：页面刷新 404

**原因：** Vue Router history 模式

**解决：** 确保配置中有：

nginx

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## 八、快速参考

### 新增项目最小配置

nginx

```nginx
server {
    listen 新端口;
    server_name _;
    root /home/项目目录;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 完整配置模板

nginx

```nginx
server {
    listen 8081;
    server_name _;

    root /home/user-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

---

## 九、检查清单

新增项目部署前检查：

* [ ]  本地构建成功（`pnpm run build`）
* [ ]  `.env.production` 配置正确
* [ ]  服务器创建项目目录
* [ ]  XFTP 上传 `dist/` 所有文件
* [ ]  创建 Nginx 配置文件
* [ ]  端口号不重复
* [ ]  目录路径正确
* [ ]  `nginx -t` 测试通过
* [ ]  重启 Nginx
* [ ]  阿里云安全组开放端口
* [ ]  浏览器访问测试
* [ ]  API 调用正常
