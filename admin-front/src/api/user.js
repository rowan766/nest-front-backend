import request from '../utils/request'

// 获取用户列表
export const getUserList = (params) => {
  return request.get('/user', { params })
}

// 创建用户
export const createUser = (data) => {
  return request.post('/user', data)
}

// 更新用户
export const updateUser = (id, data) => {
  return request.put(`/user/${id}`, data)
}

// 删除用户
export const deleteUser = (id) => {
  return request.delete(`/user/${id}`)
}

// 获取用户详情
export const getUserDetail = (id) => {
  return request.get(`/user/${id}`)
}

// 为用户分配角色
export const assignUserRoles = (id, roleIds) => {
  return request.post(`/user/${id}/roles`, { roleIds })
}
