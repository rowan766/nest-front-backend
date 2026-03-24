import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import {
  DEFAULT_HOME_PATH,
  getFirstAccessiblePath,
  hasDynamicRoutes,
  NO_MENU_PATH,
  registerDynamicRoutes,
  resetDynamicRoutes,
  ROOT_ROUTE_NAME
} from './menuRuntime'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: ROOT_ROUTE_NAME,
    component: () => import('../layout/index.vue'),
    redirect: DEFAULT_HOME_PATH,
    meta: { requiresAuth: true },
    children: [
      {
        path: NO_MENU_PATH,
        name: 'NoMenu',
        component: () => import('../views/NoMenu.vue'),
        meta: { title: '未分配菜单' }
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
        meta: { title: '个人中心' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const resolveDefaultPath = (menus) => {
  return getFirstAccessiblePath(menus)
}

// 路由守卫
router.beforeEach(async (to) => {
  const userStore = useUserStore()
  const isLoggedIn = userStore.isLoggedIn

  if (!isLoggedIn && hasDynamicRoutes()) {
    resetDynamicRoutes(router)
  }

  if (to.meta.requiresAuth === false) {
    if (to.path === '/login' && isLoggedIn) {
      await userStore.ensureUserContext({ refreshMenus: !hasDynamicRoutes() })

      if (!hasDynamicRoutes()) {
        registerDynamicRoutes(router, userStore.menus)
      }

      return resolveDefaultPath(userStore.menus)
    }

    return true
  }

  if (!isLoggedIn) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  try {
    await userStore.ensureUserContext({ refreshMenus: !hasDynamicRoutes() })

    if (!hasDynamicRoutes()) {
      registerDynamicRoutes(router, userStore.menus)

      if (to.path === '/') {
        return resolveDefaultPath(userStore.menus)
      }

      return { path: to.fullPath, replace: true }
    }

    if (to.path === '/') {
      return resolveDefaultPath(userStore.menus)
    }

    if (!to.matched.length) {
      return resolveDefaultPath(userStore.menus)
    }

    return true
  } catch (error) {
    userStore.logout()
    resetDynamicRoutes(router)
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - 后台管理系统`
  } else {
    document.title = '后台管理系统'
  }
})

export default router
