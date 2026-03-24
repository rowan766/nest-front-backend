
  import request from '../utils/request'

  // 获取菜单列表（树形结构）
  export const getMenuList = (params) => {
    return request.get('/menu', { params })
  }

  // 创建菜单
  export const createMenu = (data) => {
    return request.post('/menu', data)
  }

  // 更新菜单
  export const updateMenu = (id, data) => {
    return request.put(`/menu/${id}`, data)
  }

  // 删除菜单
  export const deleteMenu = (id) => {
    return request.delete(`/menu/${id}`)
  }

  // 获取菜单详情
  export const getMenuDetail = (id) => {
    return request.get(`/menu/${id}`)
  }

  // 更新菜单状态
  export const updateMenuStatus = (id, status) => {
    return request.patch(`/menu/${id}`, { status })
  }

  // 获取菜单树（用于下拉选择）
  export const getMenuTree = () => {
    return request.get('/menu')
  }
