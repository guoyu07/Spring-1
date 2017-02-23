import Vue from 'vue'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

import App from './App'
import router from './router'
import store from './store'

import eventHub from './utils/eventHub'
import auth from './auth'
// import apis from './api.mock'
import axios from 'axios'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import 'assets/css/main.less'

Vue.use(ElementUI)
Vue.use(VueResource)

const http = axios.create({
  baseURL: '/api/', // 使用了代理
  // timeout: 1000,
  headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
})

auth.checkAuth()

const setConfigs = () => {
  Vue.http.headers.common['Authorization'] = auth.getAuthHeader()['Authorization']
}

// Ajax 全局配置
// Vue.http.options.root = 'http://192.168.10.28:8002/api' // dev
// Vue.http.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
// Vue.http.options.emulateJSON = true

// // 进度条
// Vue.http.interceptors.unshift((req, next) => {
//   NProgress.start()
//   next(res => {
//     NProgress.done()
//   })
// })
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

Vue.prototype.http = http

Vue.prototype.parseData = (obj) => {
  // qs.stringify(obj)
  const action = encodeURIComponent(obj.action)
  const result = `action=${action}&method=${obj.method}&data=`
  return result + encodeURI(JSON.stringify(obj.data))
}

// api mocking
// Vue.http.interceptors.unshift((req, next) => {
//   const route = apis.find(a => a.url === req.url)
//   if (!route) {
//     next(req.respondWith({ status: 404, statusText: 'Not found :(' }))
//   } else {
//     next(req.respondWith(route.response, {
//       status: 200,
//       statusText: 'ok'
//     }))
//   }
// })

// 当收听到 login 事件时
eventHub.$on('login', () => {
  setConfigs()
  axios.defaults.withCredentials = true
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // http: {
  //   headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  // },
  // template: '<App/>',
  // components: { App },
  router,
  store,
  ...App
})
