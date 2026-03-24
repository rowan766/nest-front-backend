  import request from '../utils/request'

  // 获取角色列表
  export const getRoleList = (params) => {
    return request.get('/role', { params })
  }

  // 创建角色
  export const createRole = (data) => {
    return request.post('/role', data)
  }

  // 更新角色
  export const updateRole = (id, data) => {
    return request.patch(`/role/${id}`, data)
  }

  // 删除角色
  export const deleteRole = (id) => {
    return request.delete(`/role/${id}`)
  }

  // 获取角色详情
  export const getRoleDetail = (id) => {
    return request.get(`/role/${id}`)
  }

  // 更新角色状态
  export const updateRoleStatus = (id, status) => {
    return request.patch(`/role/${id}`, { status })
  }

  // 为角色分配菜单
  export const setRoleMenu = (id, menuIds) => {
    return request.post(`/role/${id}/menus`, { menuIds })
  }

  // 设置角色的数据权限范围
  export const setRoleDataScope = (id, dataScope, departmentIds) => {
    return request.post(`/role/${id}/data-scope`, { dataScope, departmentIds })
  }
