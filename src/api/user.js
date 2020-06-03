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

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function getInfo() {
  return request({
    url: '/user/role',
    method: 'get'
  })
}

export function changePassword(data) {
  return request({
    url: '/user/change-pwd',
    method: 'put',
    data: data
  })
}

export function getUserList(data) {
  return request({
    url: '/user',
    method: 'get',
    params: data
  })
}

export function saveUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data: data
  })
}

export function removeUser(data) {
  return request({
    url: '/user/' + data,
    method: 'delete'
  })
}

export function updateEnableUser(data) {
  return request({
    url: '/user/enable',
    method: 'put',
    data: data
  })
}

export function updateUserRole(data) {
  return request({
    url: '/user/role',
    method: 'put',
    data: data
  })
}
