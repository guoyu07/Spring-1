import Vue from 'vue'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

import App from './App'
import router from './router'
import store from './store'

import eventHub from './utils/eventHub'
import auth from './auth'
import apis from './api.mock'

import 'assets/css/main.less'

Vue.use(ElementUI)
Vue.use(VueResource)

auth.checkAuth()

const setConfigs = () => {
  Vue.http.headers.common['Authorization'] = auth.getAuthHeader()['Authorization']
}

// Ajax 全局配置
Vue.http.options.root = 'http://localhost:9090' // dev

// api mocking
Vue.http.interceptors.push((req, next) => {
  const body = apis.find(a => a.url === req.url).response
  next(req.respondWith(body, {
    status: 200,
    statusText: 'ok'
  }))
})

// 当收听到 login 事件时
eventHub.$on('login', () => {
  setConfigs()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // template: '<App/>',
  // components: { App },
  router,
  store,
  ...App
})
