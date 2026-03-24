# Admin Backend

后台管理系统后端，基于 `NestJS + Prisma + PostgreSQL + Redis + MinIO`。

如果要给同事介绍，这个后端可以理解成一句话：

> 一个围绕“认证、组织、角色、菜单、数据字典、文件上传”搭起来的后台基础平台，并且已经为前端动态菜单、按钮权限、数据权限预留好了统一模型。

## 项目定位

这个项目既不是单纯的用户中心，也不是只提供几个 CRUD 接口的脚手架，而是一个可承接业务系统的后台平台层。

它当前主要解决这些事情：

- 用户登录与 JWT 鉴权
- 用户、角色、部门管理
- 菜单与按钮权限管理
- 数据字典管理
- 文件上传与对象存储
- 动态菜单所需的菜单树输出
- 角色数据权限模型

也就是说，业务系统后续可以建立在这套基础能力之上，而不需要从零再做“用户、权限、菜单、字典、上传”。

## 技术栈

- NestJS 11
- Prisma 6
- PostgreSQL 15
- Redis 7
- MinIO
- Scalar / OpenAPI
- Docker Compose
- pnpm

## 目录结构

```text
src/
  modules/                  业务模块
    auth/                   登录认证
    user/                   用户管理
    department/             部门管理
    role/                   角色管理
    menu/                   菜单与按钮管理
    dict/                   数据字典
    upload/                 文件上传
    system/                 系统调试接口
  common/                   公共能力
    bootstrap/              应用启动封装
    filters/                全局异常处理
    interceptors/           全局响应封装
    swagger/                接口文档装饰器与响应模型
    utils/                  通用工具
  infrastructure/           基础设施能力
    prisma/                 数据库访问
    redis/                  Redis 访问
  main.ts
  app.module.ts
prisma/
docker-compose.yml
deploy.md
deploy.sh
```

## 模块说明

### `modules/auth`

认证模块，负责：

- 用户登录
- JWT 签发
- 当前登录态解析
- `JwtAuthGuard` 守卫
- `CurrentUser` 装饰器

它是整套后台权限体系的入口。

### `modules/user`

用户模块，负责：

- 创建、查询、更新、删除用户
- 查询当前登录用户信息
- 修改密码
- 给用户分配角色
- 获取当前用户菜单树

这个模块既是“用户管理”的业务入口，也是“动态菜单”和“按钮权限”的用户侧出口。

### `modules/department`

部门模块，负责：

- 部门树维护
- 部门上下级关系
- 部门负责人

它是组织架构模型的基础，也为后续数据权限按部门过滤打基础。

### `modules/role`

角色模块，负责：

- 角色增删改查
- 为角色分配菜单
- 设置角色数据权限范围
- 管理角色与部门的自定义数据权限关系

这个模块是“权限平台”的核心。

### `modules/menu`

菜单模块，负责：

- 管理页面菜单
- 管理按钮权限
- 输出树形菜单结构

这里的 `Menu` 表同时承载：

- `type = menu` 页面菜单
- `type = button` 按钮权限

所以前端动态菜单和按钮权限，其实都来源于这里。

### `modules/dict`

数据字典模块，负责：

- 字典类型维护
- 字典数据维护

适合承接：

- 状态枚举
- 类型枚举
- 选项项配置

### `modules/upload`

文件上传模块，负责：

- 文件上传
- 存储到 MinIO
- 记录文件元数据

适合承接头像、附件、业务文件等场景。

### `modules/system`

系统调试模块，用于开发期快速校验服务状态或提供调试接口，不属于核心业务能力。

## 公共能力说明

这一部分是后端最值得给同事讲清楚的内容，因为它决定了“为什么业务模块可以写得比较干净”。

### `common/bootstrap/app-bootstrap.util.ts`

应用启动工具，负责把启动阶段的通用逻辑集中起来，例如：

- 全局过滤器
- 全局拦截器
- ValidationPipe
- 文档挂载
- 启动配置

这样 `main.ts` 不会堆很多启动细节，项目启动行为也更统一。

### `common/filters/http-exception.filter.ts`

全局异常过滤器，作用是把 Nest 抛出的异常统一整理成前端更容易消费的响应格式。

它解决的是：

- 不同异常结构不一致
- 前端不好统一处理
- 日志和接口返回不够清晰

### `common/interceptors/transform.interceptor.ts`

全局响应拦截器，作用是统一接口成功响应结构。

它让不同 controller 返回的数据，在前端看来尽量保持同一种外层格式，方便接口消费和错误处理。

### `common/swagger/decorators/*`

Swagger / Scalar 装饰器封装，作用是：

- 统一成功响应文档
- 统一数组响应文档
- 统一 message 响应文档

这样 controller 上的文档注解会更简洁，也更统一。

### `common/utils/data-scope.util.ts`

数据权限工具，作用是根据当前用户、角色和数据权限范围，生成查询层需要的过滤条件。

它的定位不是页面权限，而是：

- 全部数据
- 本部门及以下
- 本部门
- 仅本人
- 自定义部门

这部分现在已经有工具封装，但还需要继续接入具体业务查询，才能真正形成“数据权限生效”。

## 基础设施层说明

### `infrastructure/prisma`

数据库访问基础设施，负责：

- PrismaClient 生命周期管理
- 在 Nest 中统一注入数据库能力

所有业务模块都通过它访问 PostgreSQL。

### `infrastructure/redis`

Redis 基础设施，负责：

- Redis 连接管理
- 缓存/会话类能力的注入入口

目前 Redis 已接好基础能力，后续可以继续承接验证码、缓存、限流等场景。

## 典型权限链路

### 1. 登录认证链路

流程是：

1. 用户调用登录接口
2. 后端校验用户名密码
3. 签发 JWT
4. 前端后续请求带上 Bearer Token
5. `JwtAuthGuard` 保护业务接口

### 2. 菜单权限链路

流程是：

1. 角色分配菜单和按钮
2. 用户绑定角色
3. 用户登录后调用 `GET /user/current/menus`
4. 后端根据用户角色汇总角色菜单
5. 前端据此生成动态菜单和动态路由

### 3. 按钮权限链路

按钮权限和菜单放在同一张表里，只是 `type = button`。

流程是：

1. 在菜单管理里配置按钮权限
2. 给角色勾选按钮
3. 用户菜单树里会带回这些按钮权限
4. 前端通过 `v-permission` 控制按钮显隐

### 4. 数据权限链路

当前角色模型已经支持：

- 全部数据
- 本部门及以下
- 本部门
- 仅本人
- 自定义

其中“自定义”是通过角色与部门关联表保存。  
这套模型已经具备，但还需要继续在各业务查询里接入，数据权限才会真正落地。

## 当前业务能力概览

### 用户管理

- 用户列表
- 用户详情
- 创建用户
- 编辑用户
- 删除用户
- 分配角色
- 修改密码

### 部门管理

- 部门树
- 新增部门
- 编辑部门
- 删除部门

### 角色管理

- 角色列表
- 创建/编辑/删除角色
- 分配菜单权限
- 设置数据权限范围

### 菜单管理

- 页面菜单管理
- 按钮权限管理
- 输出树形结构供前端动态路由使用

### 数据字典

- 字典类型管理
- 字典数据管理

### 文件上传

- 上传文件
- 存储到 MinIO
- 记录文件元信息

## 本地开发

### 推荐方式：Docker

```powershell
Set-Location 'd:\workspace_20260228\nest-front-backend\admin-backend'

docker compose up -d postgres minio redis
docker compose up -d --build backend
docker exec nestjs-project1-backend pnpm prisma db push
```

启动后常用访问地址：

- API 文档：`http://localhost:3101/api-docs`
- OpenAPI JSON：`http://localhost:3101/api-docs-json`
- MinIO 控制台：`http://localhost:19001`

### 本机直跑

```bash
pnpm install
pnpm start:dev
```

## 环境变量

项目当前区分两套环境：

- `.env`
  - 宿主机本地访问 Docker 服务
- `.env.docker`
  - 容器内访问 `postgres / redis / minio`

### 常见本地端口

- Backend：`3101`
- PostgreSQL：`15432`
- Redis：`16379`
- MinIO API：`19000`
- MinIO Console：`19001`

## 常用命令

安装依赖：

```bash
pnpm install
```

开发模式：

```bash
pnpm start:dev
```

构建：

```bash
pnpm build
```

运行测试：

```bash
pnpm test -- --runInBand
```

同步 Prisma 表结构：

```powershell
docker exec nestjs-project1-backend pnpm prisma db push
```

生成 Prisma Client：

```powershell
docker exec nestjs-project1-backend pnpm prisma generate
```

查看日志：

```powershell
docker logs -f nestjs-project1-backend
```

## 总结

> 这个后端不是单纯的接口集合，而是一套后台平台基础设施。`auth` 负责登录鉴权，`user / department / role / menu` 一起组成权限模型，`dict` 解决枚举配置，`upload` 解决文件存储。公共层把启动、异常、响应、文档都做了统一封装，所以业务模块里可以更专注写业务逻辑。前端的动态菜单、按钮权限，其实都是依赖这里的菜单和角色关系表输出出来的。
