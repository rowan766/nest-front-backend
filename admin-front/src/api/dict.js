  import request from '../utils/request'

  // ==================== 字典类型 ====================

  // 获取字典类型列表
  export const getDictTypeList = (params) => {
    return request.get('/dict-type', { params })
  }

  // 创建字典类型
  export const createDictType = (data) => {
    return request.post('/dict-type', data)
  }

  // 更新字典类型
  export const updateDictType = (id, data) => {
    return request.put(`/dict-type/${id}`, data)
  }

  // 删除字典类型
  export const deleteDictType = (id) => {
    return request.delete(`/dict-type/${id}`)
  }

  // 获取字典类型详情
  export const getDictTypeDetail = (id) => {
    return request.get(`/dict-type/${id}`)
  }

  // 更新字典类型状态
  export const updateDictTypeStatus = (id, status) => {
    return request.patch(`/dict-type/${id}`, { status })
  }

  // ==================== 字典数据 ====================

  // 获取字典数据列表（根据类型ID）
  export const getDictDataList = (dictTypeId, params) => {
    return request.get('/dict-data', { params: { dictTypeId, ...params } })
  }

  // 创建字典数据
  export const createDictData = (data) => {
    return request.post('/dict-data', data)
  }

  // 更新字典数据
  export const updateDictData = (id, data) => {
    return request.put(`/dict-data/${id}`, data)
  }

  // 删除字典数据
  export const deleteDictData = (id) => {
    return request.delete(`/dict-data/${id}`)
  }

  // 获取字典数据详情
  export const getDictDataDetail = (id) => {
    return request.get(`/dict-data/${id}`)
  }

  // 更新字典数据状态
  export const updateDictDataStatus = (id, status) => {
    return request.patch(`/dict-data/${id}`, { status })
  }

  // 根据字典编码获取字典数据（前端使用）
  export const getDictByCode = (code) => {
    return request.get(`/dict-data/type/${code}`)
  }
