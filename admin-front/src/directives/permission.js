import { useUserStore } from '../stores/user'
import { buildPermissionCodeSet } from '../composables/usePermission'

const normalizePermissions = (value) => {
  if (!value) return []
  return Array.isArray(value) ? value.filter(Boolean) : [value].filter(Boolean)
}

const updatePermissionVisibility = (el, binding, pinia) => {
  const permissions = normalizePermissions(binding.value)

  if (!permissions.length) {
    el.style.display = el.dataset.permissionDisplay || ''
    return
  }

  if (el.dataset.permissionDisplay === undefined) {
    el.dataset.permissionDisplay = el.style.display || ''
  }

  const userStore = useUserStore(pinia)
  const permissionCodes = buildPermissionCodeSet(userStore.menus || [])
  const hasPermission = permissions.some((permission) => permissionCodes.has(permission))

  el.style.display = hasPermission ? el.dataset.permissionDisplay : 'none'
}

export const createPermissionDirective = (pinia) => ({
  mounted(el, binding) {
    updatePermissionVisibility(el, binding, pinia)
  },
  updated(el, binding) {
    updatePermissionVisibility(el, binding, pinia)
  }
})
