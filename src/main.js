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

// custom filters
// this one converts TZ format to locale format
// Vue.filter('convertTime', val => (new Date(val)).toLocaleString())
Vue.filter('convertTime', (val) => {
  let date = new Date(val)
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
})

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
  if (rs.status === 401) {
    auth.logout()
  }
  NProgress.done()
  NProgress.remove()
  return rs
}, err => {
  Promise.reject(err)
  console.log(err.response)
  new Vue({}).$message.error(err.response.data.errorMessage)
})

Vue.prototype.http = http

Vue.prototype.parseData = obj => {
  // qs.stringify(obj)
  const action = encodeURIComponent(obj.action)
  const result = `action=${action}&method=${obj.method}&data=`
  return result + encodeURI(JSON.stringify(obj.data))
}

// 逆向寻找匹配的 task_key
var findTaskMsgR = (arrMsg, arrTaskKey) => {
  for (let i = arrMsg.length - 1; i >= 0; i--) {
    if (arrTaskKey.indexOf(arrMsg[i]['task_key']) !== -1) {
      return arrMsg[i]
    }
  }
  return false
}

Vue.prototype.findTaskMsgR = findTaskMsgR

// 收集所有最新 task_key 数据
Vue.prototype.getTaskInfo = (arrMsg) => {
  const taskKeyArr = ['restart', 'approve', 'assignIP', 'createVM', 'judge', 'monitor']
  const rs = findTaskMsgR(arrMsg, ['start']).form // 这里收集 申请 的信息
  taskKeyArr
    .filter(t => findTaskMsgR(arrMsg, [t]))
    .map(t => findTaskMsgR(arrMsg, [t]).form.data)
    .map(tsk => {
      if (Array.isArray(tsk)) {
        !rs.data.length && tsk.forEach(t => rs.data.push({}))
        tsk.map((host, index) => Object.assign(rs.data[index], host))
      }
    })
  return rs
}

Vue.prototype.filterObj = (obj, like) => { // 过滤搜索字段
  let data = {}
  for (const key in obj) {
    if (obj[key]) { // 首先要有值
      if (Array.isArray(obj[key])) { // 这是数组的处理方法
        if (obj[key].length === 2) { // 两个空都填了才加进来
          data[key + '.' + obj[key][0]] = obj[key][1]
        }
      } else { // 除了数组以外的其他值
        data[key] = obj[key]
      }
    }
  }
  if (like) { // 模糊查询
    let likedata = {}
    for (const key in data) {
      likedata[key] = {}
      likedata[key]['$regex'] = data[key]
    }
    data = likedata
  }
  return data
}

Vue.prototype.isEmptyObj = obj => { // 判断是不是没有属性的空对象 {} => true {xx: 'xxx'} => false
  for (const key in obj) {
    return false
  }
  return true
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
