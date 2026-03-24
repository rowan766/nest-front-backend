# 后台管理系统

这是一个基于 Vue 3 + Element Plus 的现代化后台管理系统。

## 项目结构

```
admin-front/
├── src/
│   ├── api/              # API 接口封装
│   │   ├── auth.js       # 认证相关接口
│   │   └── user.js       # 用户管理接口
│   ├── components/       # 公共组件
│   ├── layout/           # 布局组件
│   │   └── index.vue     # 主布局（侧边栏+头部+内容区）
│   ├── router/           # 路由配置
│   │   └── index.js      # 路由定义和守卫
│   ├── stores/           # 状态管理
│   │   └── user.js       # 用户状态管理
│   ├── utils/            # 工具函数
│   │   └── request.js    # HTTP 请求封装
│   ├── views/            # 页面组件
│   │   ├── Login.vue     # 登录页
│   │   ├── Dashboard.vue # 首页仪表盘
│   │   └── system/       # 系统管理模块
│   │       ├── User.vue  # 用户管理
│   │       ├── Role.vue  # 角色管理
│   │       └── Menu.vue  # 菜单管理
│   ├── App.vue           # 根组件
│   ├── main.js           # 应用入口
│   └── style.css         # 全局样式
└── package.json
```

## 功能特性

### 1. 用户认证
- 登录页面（渐变背景设计）
- Token 认证机制
- 路由守卫（自动拦截未登录访问）
- 自动跳转到登录前页面

### 2. 主布局
- 可折叠侧边栏
- 顶部用户信息栏
- 下拉菜单（个人中心、退出登录）
- 响应式设计

### 3. 首页仪表盘
- 数据统计卡片（用户、文章、评论、访问量）
- 快捷操作按钮
- 系统信息展示
- 动态运行时间
- 最新动态时间线

### 4. 系统管理

#### 用户管理
- 用户列表展示
- 搜索和筛选
- 新增/编辑/删除用户
- 用户状态管理
- 分页功能

#### 角色管理
- 角色列表展示
- 角色新增/编辑/删除
- 权限配置（树形结构）
- 角色状态管理

#### 菜单管理
- 树形菜单展示
- 菜单新增/编辑/删除
- 菜单层级管理
- 菜单排序

## 技术栈

- Vue 3.5.22 - 渐进式 JavaScript 框架
- Element Plus 2.11.7 - UI 组件库
- Vue Router 4.6.3 - 路由管理
- Vite 7.1.7 - 构建工具

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm run dev
```

### 生产环境构建
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## API 配置

后端接口地址配置在 `src/utils/request.js` 中：

```javascript
const BASE_URL = 'http://8.130.84.165:3001'
```

### 登录接口

**接口地址：** `POST /auth/login`

**请求参数：**
```json
{
  "username": "用户名",
  "password": "密码"
}
```

**响应数据：**
```json
{
  "token": "JWT Token",
  "userInfo": {
    "id": 1,
    "username": "admin"
  }
}
```

## 路由说明

### 公开路由
- `/login` - 登录页

### 需要认证的路由
- `/dashboard` - 首页仪表盘
- `/system/user` - 用户管理
- `/system/role` - 角色管理
- `/system/menu` - 菜单管理

## 状态管理

使用 Composition API 实现简单的状态管理：

```javascript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 登录
await userStore.login({ username, password })

// 获取用户信息
await userStore.getUserInfo()

// 退出登录
userStore.logout()

// 检查登录状态
const isLoggedIn = userStore.isLoggedIn.value
```

## 路由守卫

系统实现了全局路由守卫：

1. 检查路由是否需要认证（`meta.requiresAuth`）
2. 未登录用户自动跳转到登录页
3. 已登录用户访问登录页自动跳转到首页
4. 自动设置页面标题

## 开发建议

### 添加新页面

1. 在 `src/views/` 下创建页面组件
2. 在 `src/router/index.js` 中添加路由配置
3. 在 `src/layout/index.vue` 中添加菜单项

### 添加新的 API 接口

1. 在 `src/api/` 下创建对应的模块文件
2. 使用 `request` 工具发起请求
3. 在组件中导入并使用

### 自定义样式

- 全局样式：修改 `src/style.css`
- 组件样式：使用 `scoped` 样式
- Element Plus 主题：在 `main.js` 中配置

## 注意事项

1. Token 存储在 localStorage 中
2. 所有 API 请求自动携带 Authorization 头
3. 请求失败会自动显示错误提示
4. 表单验证使用 Element Plus 内置规则

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## License

MIT
