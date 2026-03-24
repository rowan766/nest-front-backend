import axios from 'axios'
import { ElMessage } from 'element-plus'

// 开发环境使用代理，生产环境使用完整URL
const BASE_URL = import.meta.env.DEV ? '/api' : 'http://8.130.84.165:3001'

// 创建 axios 实例
const request = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 直接返回 data
    return response.data
  },
  error => {
    // 统一错误处理
    const message = error.response?.data?.message || error.message || '请求失败'
    ElMessage.error(message)
    console.error('Response error:', error)
    return Promise.reject(error)
  }
)

export default request
