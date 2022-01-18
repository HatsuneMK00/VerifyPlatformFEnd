import axios from 'axios'
// eslint-disable-next-line no-unused-vars
import router from '../../router'
axios.defaults.timeout = 5000 // 超市时间是5秒
axios.defaults.withCredentials = false
// Content-Type 响应头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// 基础url
axios.defaults.baseURL = 'http://219.228.60.69:9091'

/**
 * 封装get方法
 */
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, { params: params })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post方法
 */
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
