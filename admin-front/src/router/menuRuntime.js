export const ROOT_ROUTE_NAME = 'Root'
export const DEFAULT_HOME_PATH = '/dashboard'
export const NO_MENU_PATH = '/no-menu'

const viewModules = import.meta.glob('../views/**/*.vue')
const fallbackView = viewModules['../views/system/RouteMissing.vue']
const dynamicRouteNames = new Set()
let dynamicRoutesReady = false

const normalizeRoutePath = (path) => {
  if (!path) return ''

  const trimmedPath = String(path).trim()

  if (!trimmedPath) return ''
  if (trimmedPath === '/') return DEFAULT_HOME_PATH

  return trimmedPath.startsWith('/') ? trimmedPath : `/${trimmedPath}`
}

const normalizeComponentPath = (componentPath) => {
  if (!componentPath) return ''

  return String(componentPath)
    .trim()
    .replace(/^\/+/, '')
    .replace(/\.vue$/i, '')
}

export const normalizeMenuTree = (menus = []) => {
  return menus.map((menu) => ({
    ...menu,
    routePath: normalizeRoutePath(menu.path),
    children: normalizeMenuTree(menu.children || [])
  }))
}

export const getMenuItemIndex = (menu) => {
  return menu.routePath || menu.path || `menu-${menu.id}`
}

export const getRenderableMenus = (menus = []) => {
  return menus
    .filter((menu) => menu.type === 'menu' && menu.status === 1)
    .map((menu) => ({
      ...menu,
      children: getRenderableMenus(menu.children || [])
    }))
    .filter((menu) => {
      const hasChildren = menu.children.length > 0
      const canRenderAsMenu = menu.visible === 1 && (menu.routePath || hasChildren)

      return canRenderAsMenu || hasChildren
    })
}

export const findOpenMenuIndexes = (menus = [], currentPath, parentIndexes = []) => {
  for (const menu of menus) {
    const currentIndex = getMenuItemIndex(menu)
    const nextParents = [...parentIndexes, currentIndex]
    const children = getRenderableMenus(menu.children || [])

    if (menu.routePath === currentPath) {
      return parentIndexes
    }

    if (children.length > 0) {
      const childResult = findOpenMenuIndexes(children, currentPath, nextParents)

      if (childResult.length > 0 || children.some((child) => child.routePath === currentPath)) {
        return childResult.length > 0 ? childResult : nextParents
      }
    }
  }

  return []
}

export const getFirstAccessiblePath = (menus = []) => {
  for (const menu of getRenderableMenus(menus)) {
    if (menu.routePath && menu.component && menu.visible === 1) {
      return menu.routePath
    }

    if (menu.children?.length) {
      const childPath = getFirstAccessiblePath(menu.children)

      if (childPath) {
        return childPath
      }
    }
  }

  return NO_MENU_PATH
}

const resolveMenuComponent = (componentPath) => {
  const normalizedPath = normalizeComponentPath(componentPath)

  if (!normalizedPath) {
    return fallbackView
  }

  const candidatePaths = normalizedPath.startsWith('views/')
    ? [`../${normalizedPath}.vue`]
    : [`../views/${normalizedPath}.vue`, `../${normalizedPath}.vue`]

  for (const candidatePath of candidatePaths) {
    if (viewModules[candidatePath]) {
      return viewModules[candidatePath]
    }
  }

  console.warn(`[menuRuntime] Missing view component for "${componentPath}"`)
  return fallbackView
}

const buildDynamicRoutes = (menus = []) => {
  const routes = []

  const walk = (menuList) => {
    menuList.forEach((menu) => {
      if (menu.type !== 'menu' || menu.status !== 1) {
        return
      }

      if (menu.component && menu.routePath) {
        routes.push({
          path: menu.routePath,
          name: menu.name || `DynamicMenu${menu.id}`,
          component: resolveMenuComponent(menu.component),
          meta: {
            title: menu.title,
            icon: menu.icon,
            permission: menu.permission,
            menuId: menu.id,
            visible: menu.visible,
            componentPath: menu.component,
            dynamic: true
          }
        })
      }

      if (menu.children?.length) {
        walk(menu.children)
      }
    })
  }

  walk(menus)

  return routes
}

export const hasDynamicRoutes = () => dynamicRoutesReady

export const registerDynamicRoutes = (router, menus = []) => {
  const routes = buildDynamicRoutes(menus)

  routes.forEach((route) => {
    if (!router.hasRoute(route.name)) {
      router.addRoute(ROOT_ROUTE_NAME, route)
      dynamicRouteNames.add(route.name)
    }
  })

  dynamicRoutesReady = true

  return routes
}

export const resetDynamicRoutes = (router) => {
  dynamicRouteNames.forEach((routeName) => {
    if (router.hasRoute(routeName)) {
      router.removeRoute(routeName)
    }
  })

  dynamicRouteNames.clear()
  dynamicRoutesReady = false
}
