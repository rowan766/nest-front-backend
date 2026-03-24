import request from '../utils/request'

// 登录
export const login = (data) => {
  return request.post('/auth/login', data)
}

// 获取用户菜单
export const getUserMenus = () => {
  return request.get('/user/current/menus')
}

// 获取用户菜单
export const getUserProfile = () => {
  return request.get('/user/profile')
}

// 退出登录
export const logout = () => {
  return request.post('/auth/logout')
}
