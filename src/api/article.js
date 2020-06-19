import request from '@/utils/request'

export function saveArticle(data) {
  return request({
    url: '/article',
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

export function imgUpload(data) {
  return request({
    url: '/article/upload',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function imgDelete(data) {
  return request({
    url: '/article/' + data,
    method: 'delete'
  })
}
