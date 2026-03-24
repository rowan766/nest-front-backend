import request from '../utils/request'

export const getDepartmentList = () => {
  return request.get('/department')
}

export const getDepartmentDetail = (id) => {
  return request.get(`/department/${id}`)
}

export const createDepartment = (data) => {
  return request.post('/department', data)
}

export const updateDepartment = (id, data) => {
  return request.put(`/department/${id}`, data)
}

export const deleteDepartment = (id) => {
  return request.delete(`/department/${id}`)
}
