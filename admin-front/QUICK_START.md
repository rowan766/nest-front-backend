# 快速启动指南

## 系统概览

已完成的后台管理系统包含以下功能模块：

### ✅ 已实现的功能

1. **登录系统**
   - 美观的登录界面（渐变背景）
   - 表单验证
   - Token 认证
   - 自动登录状态保持

2. **主布局**
   - 侧边栏导航（可折叠）
   - 顶部用户信息栏
   - 响应式设计

3. **首页仪表盘**
   - 数据统计卡片
   - 快捷操作
   - 系统信息
   - 最新动态时间线

4. **系统管理**
   - 用户管理（CRUD + 搜索 + 分页）
   - 角色管理（CRUD + 权限配置）
   - 菜单管理（树形展示 + CRUD）

## 启动步骤

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 访问系统

浏览器自动打开 `http://localhost:5173`（或控制台显示的端口）

### 4. 登录系统

**后端登录接口：** `http://8.130.84.165:3001/auth/login`

**测试账号（请根据实际后端配置）：**
```
用户名：admin
密码：（请咨询后端）
```

## 项目文件结构

```
admin-front/
├── src/
│   ├── api/                    # API 接口层
│   │   ├── auth.js            # 登录、用户信息接口
│   │   └── user.js            # 用户管理接口
│   │
│   ├── layout/                # 布局组件
│   │   └── index.vue          # 主布局（侧边栏+顶栏+内容区）
│   │
│   ├── router/                # 路由配置
│   │   └── index.js           # 路由定义 + 路由守卫
│   │
│   ├── stores/                # 状态管理
│   │   └── user.js            # 用户状态（登录、退出、用户信息）
│   │
│   ├── utils/                 # 工具函数
│   │   └── request.js         # HTTP 请求封装（自动携带 Token）
│   │
│   ├── views/                 # 页面组件
│   │   ├── Login.vue         # 登录页
│   │   ├── Dashboard.vue     # 首页仪表盘
│   │   └── system/           # 系统管理模块
│   │       ├── User.vue      # 用户管理
│   │       ├── Role.vue      # 角色管理
│   │       └── Menu.vue      # 菜单管理
│   │
│   ├── App.vue               # 根组件
│   ├── main.js               # 入口文件
│   └── style.css             # 全局样式
│
├── package.json
├── vite.config.js
├── README_SYSTEM.md          # 完整系统文档
└── QUICK_START.md            # 本文件
```

## 核心功能说明

### 1. 认证流程

```javascript
// 登录
const userStore = useUserStore()
await userStore.login({ username: 'admin', password: 'password' })

// Token 自动存储在 localStorage
// 后续所有请求自动携带 Authorization 头

// 退出登录
userStore.logout()
```

### 2. API 请求

所有 API 请求都通过 `src/utils/request.js` 统一处理：

```javascript
import request from '@/utils/request'

// GET 请求
const data = await request.get('/users', { page: 1, pageSize: 10 })

// POST 请求
const result = await request.post('/users', { username: 'test' })

// PUT 请求
await request.put('/users/1', { username: 'updated' })

// DELETE 请求
await request.delete('/users/1')
```

### 3. 路由守卫

系统自动拦截未登录用户：

- 访问需要认证的页面 → 自动跳转到登录页
- 登录成功 → 自动跳转回原页面
- 已登录访问登录页 → 自动跳转到首页

## 常见问题

### Q1: 登录失败？

**可能原因：**
1. 后端服务未启动
2. 用户名或密码错误
3. 网络连接问题
4. CORS 跨域问题

**解决方法：**
- 检查后端服务是否运行在 `http://8.130.84.165:3001`
- 查看浏览器控制台的错误信息
- 确认用户名和密码正确

### Q2: 页面显示异常？

**解决方法：**
1. 清除浏览器缓存
2. 重启开发服务器
3. 检查浏览器控制台是否有错误

### Q3: 如何修改后端接口地址？

编辑 `src/utils/request.js` 文件：

```javascript
const BASE_URL = 'http://your-backend-url:port'
```

### Q4: 如何添加新菜单？

1. 在 `src/views/` 创建新页面组件
2. 在 `src/router/index.js` 添加路由
3. 在 `src/layout/index.vue` 添加菜单项

## 开发建议

### 代码规范
- 使用 ES6+ 语法
- 组件使用 Composition API
- 使用 `<script setup>` 语法糖

### 样式规范
- 优先使用 Element Plus 组件样式
- 自定义样式使用 `scoped`
- 全局样式写在 `style.css`

### API 规范
- 接口统一使用 `src/api/` 目录管理
- 按业务模块划分文件
- 使用统一的 `request` 工具

## 下一步

1. 根据实际后端接口调整 API 调用
2. 完善错误处理和提示
3. 添加更多业务功能
4. 优化用户体验
5. 添加单元测试

## 技术支持

- Element Plus 文档：https://element-plus.org/
- Vue 3 文档：https://cn.vuejs.org/
- Vue Router 文档：https://router.vuejs.org/zh/

---

**祝开发顺利！** 🚀
