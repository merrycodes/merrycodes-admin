import request from '@/utils/request'

export function fetchList(query) {
  // return request({
  //   url: '/vue-element-admin/article/list',
  //   method: 'get',
  //   params: query
  // })
}
export function saveArticle(data) {
  return request({
    url: '/article/save',
    method: 'post',
    data: data
  })
}

export function getArticle(data) {
  return request({
    url: '/article/' + data,
    method: 'get'
  })
}

export function getArticleList(data) {
  return request({
    url: '/article',
    method: 'get',
    params: data
  })
}
