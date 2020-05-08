import request from '@/utils/request'

/**
 * axios transformRequest 全局当次移除
 * https://segmentfault.com/q/1010000020054684
 */
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: data,
    transformRequest: data => {
      return JSON.stringify(data)
    },
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getInfo() {
  return request({
    url: '/user/role',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
