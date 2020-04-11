import request from '@/utils/request'

export function getTagsList(data) {
  return request({
    url: '/tags',
    method: 'get',
    params: data
  })
}

export function saveTags(data) {
  return request({
    url: '/tags/save',
    method: 'post',
    data: data
  })
}

