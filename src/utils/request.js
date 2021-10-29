import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '@/router'
import { Message } from 'element-ui'

const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net',
  transformResponse: [
    function(data) {
      try {
        return JSONbig.parse(data)
      } catch (err) {
        return data
      }
    }
  ]
})
request.interceptors.request.use(
  function(config) {
    const user = JSON.parse(window.localStorage.getItem('user'))

    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  function(response) {
    return response
  },
  function(error) {
    const status = error.response.status
    if (status === 401) {
      localStorage.removeItem('user')
      router.push('/login')
    } else if (status === 403) {
      Message.error('没访问权限')
    } else if (status === 404) {
      Message.error('资源不存在')
    } else if (status >= 500) {
      Message.error('服务端错误')
    }
    return Promise.reject(error)
  }
)
export default request
