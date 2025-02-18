import { message } from 'ant-design-vue'
import axios from 'axios'

const api = 'http://localhost:8080/api'
const request = axios.create({
  baseURL: api,
})

request.interceptors.request.use(config => {
  /* 添加token */
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response.data
    }
    return Promise.reject(response.data)
  },
  error => {
    // 获取错误响应数据
    if (error.response) {
      /* 全局错误提示 */
      message.error(error.response.data.message)
      return Promise.reject(error.response.data)
    }
    return Promise.reject(error)
  }
)

export default request