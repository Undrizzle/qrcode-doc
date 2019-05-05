import request from '@/utils/request'

export function getDocs(token) {
  return request({
    url: 'http://127.0.0.1:3000/documents/get',
    method: 'get',
    params: { token }
  })
}

export function delDocs(data) {
  return request({
    url: 'http://127.0.0.1:3000/documents/del',
    method: 'post',
    data
  })
}