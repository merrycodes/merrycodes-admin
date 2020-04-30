import request from '@/utils/request'

export function getSetting(data) {
  return request({
    url: '/setting',
    method: 'get',
    params: data
  })
}

export function saveSetting(data) {
  return request({
    url: '/setting/save',
    method: 'post',
    data: data
  })
}
