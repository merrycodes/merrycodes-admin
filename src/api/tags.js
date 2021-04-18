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
    url: '/tags',
    method: 'post',
    data: data
  })
}

export function tagsList() {
  return request({
    url: '/tags/list',
    method: 'get'
  })
}

export function tagsListByStatus() {
  return request({
    url: '/tags/statusList',
    method: 'get'
  })
}
