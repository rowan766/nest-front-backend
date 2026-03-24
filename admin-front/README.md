# Admin Front

基于 `Vue 3 + Vite + Element Plus + Pinia + Vue Router` 的后台管理系统前端。

这个项目支持：

- 登录鉴权
- 动态菜单与动态路由
- 按钮级权限控制
- 系统管理模块
- 业务页面模块扩展

如果你想看更偏“给同事讲架构”的版本，请看：

- [README_ARCHITECTURE.md](./README_ARCHITECTURE.md)

## 技术栈

- Vue 3
- Vite
- Element Plus
- Pinia
- Vue Router 4
- Axios

## 目录结构

```text
src/
  api/                    接口封装
  composables/            组合式函数
  directives/             全局指令
  layout/                 后台布局
  router/                 路由与动态菜单运行时
  stores/                 Pinia 状态管理
  utils/                  请求封装等工具
  views/
    system/               系统管理页面
    assetManagement/      业务页面
```

## 功能概览

当前已包含：

- 登录页
- 首页
- 个人中心
- 未分配菜单提示页
- 用户管理
- 部门管理
- 角色管理
- 菜单管理
- 数据字典
- 资产管理业务占位页

权限模型说明：

- 菜单权限决定页面和左侧菜单显示
- 按钮权限通过 `v-permission` 控制按钮显隐

## 环境要求

- Node.js 18+
- pnpm 8+
- 可访问的后端服务，默认代理到 `http://localhost:3101`

## 安装依赖

```bash
pnpm install
```

## 本地开发

启动开发环境：

```bash
pnpm dev
```

默认访问地址：

- 前端：`http://localhost:5173`

开发代理配置在 [vite.config.js](./vite.config.js) 中，默认会把 `/api` 代理到本地后端：

```js
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:3101',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

## 构建

```bash
pnpm build
```

如需本地预览构建结果：

```bash
pnpm preview
```

## 和后端联调前建议确认

1. 后端已经启动，默认端口为 `3101`
2. 已初始化管理员账号和基础菜单数据
3. 当前登录用户已经分配菜单权限
4. 如果要测试按钮权限，角色里要勾选对应的按钮项

## 常见开发说明

### 新增一个业务页面

通常需要做三件事：

1. 在 `src/views/` 下创建页面组件
2. 在菜单管理中配置页面菜单：
   - `path`
   - `component`
3. 给角色分配页面菜单和按钮权限

### 按钮权限写法

项目已经支持 `v-permission`：

```vue
<el-button v-permission="'asset:bridge:create'">新增桥梁</el-button>
```

也支持数组，表示满足任意一个权限即显示：

```vue
<el-button v-permission="['asset:bridge:create', 'asset:bridge:update']">
  操作
</el-button>
```

## 脚本

- `pnpm dev` 启动开发环境
- `pnpm build` 构建项目
- `pnpm preview` 预览构建结果

## 备注

这个 `README.md` 主要面向 GitHub 项目首页和新同事快速上手。  
如果你需要了解模块职责、权限链路、动态菜单运行机制，请看 [README_ARCHITECTURE.md](./README_ARCHITECTURE.md)。
