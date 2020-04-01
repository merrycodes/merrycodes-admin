import request from '@/utils/request'
import qs from 'qs'

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
    data: qs.stringify(data)
  })
}
// export function fetchArticle(id) {
//   return request({
//     url: '/vue-element-admin/article/detail',
//     method: 'get',
//     params: { id }
//   })
// }

// export function fetchPv(pv) {
//   return request({
//     url: '/vue-element-admin/article/pv',
//     method: 'get',
//     params: { pv }
//   })
// }

// export function createArticle(data) {
//   return request({
//     url: '/vue-element-admin/article/create',
//     method: 'post',
//     data
//   })
// }

// export function updateArticle(data) {
//   return request({
//     url: '/vue-element-admin/article/update',
//     method: 'post',
//     data
//   })
// }
