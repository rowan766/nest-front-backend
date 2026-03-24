import { computed } from 'vue'
import { useUserStore } from '../stores/user'

const collectPermissionCodes = (menus = [], codes = new Set()) => {
  menus.forEach((menu) => {
    if (menu.type === 'button' && menu.status === 1 && menu.permission) {
      codes.add(menu.permission)
    }

    if (menu.children?.length) {
      collectPermissionCodes(menu.children, codes)
    }
  })

  return codes
}

export const buildPermissionCodeSet = (menus = []) => {
  return collectPermissionCodes(menus, new Set())
}

export const usePermission = () => {
  const userStore = useUserStore()

  const permissionCodes = computed(() => {
    return Array.from(buildPermissionCodeSet(userStore.menus || []))
  })

  const hasPermission = (permission) => {
    if (!permission) return true
    return permissionCodes.value.includes(permission)
  }

  const hasAnyPermission = (permissions = []) => {
    return permissions.some((permission) => hasPermission(permission))
  }

  return {
    permissionCodes,
    hasPermission,
    hasAnyPermission
  }
}
