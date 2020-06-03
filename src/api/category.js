import request from '@/utils/request'

export function getcategoryList(data) {
  return request({
    url: '/category',
    method: 'get',
    params: data
  })
}

export function savecategory(data) {
  return request({
    url: '/category',
    method: 'post',
    data: data
  })
}

export function categoryList() {
  return request({
    url: '/category/list',
    method: 'get'
  })
}

export function categoryListByStaus() {
  return request({
    url: '/category/stausList',
    method: 'get'
  })
}
