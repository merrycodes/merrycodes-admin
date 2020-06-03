import request from '@/utils/request'

export function getRoleByUserId(data) {
  return request({
    url: '/role/' + data,
    method: 'get'
  })
}

export function getRoleAll() {
  return request({
    url: '/role/list',
    method: 'get'
  })
}

export function getRoleList(data) {
  return request({
    url: '/role',
    method: 'get',
    params: data
  })
}
