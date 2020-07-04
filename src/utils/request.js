import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import { getToken } from '@/utils/auth'

const remove = data => {
  if (data !== null && data !== undefined) {
    Object.keys(data).forEach(key => {
      if (data[key] === null || data[key] === undefined) {
        delete data[key]
      }
    })
  }
  return data
}

// create an axios instance
const request = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 5000, // request timeout
  transformRequest: [
    data => {
      data = remove(data)
      // 序列化参数数组时不设置索引，否则tomcat8.5以上无法接收特殊字符
      return qs.stringify(data, { indices: false })
    }
  ],
  // 序列化params参数
  paramsSerializer: params => {
    params = remove(params)
    // 序列化参数数组时不设置索引，否则tomcat8.5以上无法接收特殊字符
    return qs.stringify(params, { indices: false })
  }
})

// request interceptor
request.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
request.interceptors.response.use(
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      // eslint-disable-next-line no-undef
      ELEMENT.Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      // 50008: Illegal token / Token expired;
      if (res.code === 50008) {
        // to re-login
        // eslint-disable-next-line no-undef
        ELEMENT.MessageBox.confirm('您的账号已经登出，不能查看此页面，请重新登录来查看此页面', '已登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    // eslint-disable-next-line no-undef
    ELEMENT.Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default request
