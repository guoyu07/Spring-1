import axios from 'axios'
import NProgress from 'nprogress'

const http = axios.create()

http.defaults.baseURL = 'http://192.168.10.28:8002/api'
// http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// interceptors
http.interceptors.request.use(rq => {
  NProgress.start()
  return rq
}, err => Promise.reject(err))

http.interceptors.response.use(rs => {
  NProgress.done()
  NProgress.remove()
  return rs
}, err => Promise.reject(err))

export default http
