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

// bpmn 相关 css
import 'diagram-js/assets/diagram-js.css'
import 'bpmn-js/assets/bpmn-font/css/bpmn-embedded.css'
import 'bpmn-js-properties-panel/styles/properties.less'

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
// let loading = Vue.prototype.$loading({text: '正在加载中...'})
http.interceptors.request.use(rq => {
  NProgress.start()
  // loading
  return rq
}, err => Promise.reject(err))

http.interceptors.response.use(rs => {
  if (rs.status === 401) {
    auth.logout()
  }
  // loading.close()
  NProgress.done()
  NProgress.remove()
  return rs
}, err => {
  if (err.response.status === 401) {
    auth.logout()
    Vue.prototype.$message.error('权限超时，请重新登录！')
  } else {
    Vue.prototype.$message.error(err.response.data.errorMessage)
    NProgress.done()
  }
  Promise.reject(err)
  new Vue({}).$message.error(err.response.data.errorMessage)
})

Vue.prototype.http = http

const parseData = obj => {
  // qs.stringify(obj)
  const action = encodeURIComponent(obj.action)
  const result = `action=${action}&method=${obj.method}&data=`
  return result + encodeURI(JSON.stringify(obj.data))
}

Vue.prototype.parseData = parseData

Vue.prototype.getPathResult = (result, path) => {
  let _result = result
  const _path = path.split('.')
  for (const i in _path) {
    _result = _result[_path[i]]
  }
  return _result
}

Vue.prototype.setDataType = (original, goalData, _this) => {
  if (original.value.type === 'arr' || original.value.type === 'FKs') {
    _this.$set(goalData, original.id, [])
  } else if (original.value.type === 'date' || original.value.type === 'datetime' || original.value.type === 'int') {
    _this.$set(goalData, original.id, undefined)
  } else if (original.value.type === 'dict' || original.value.type === 'dicts') {
    _this.$set(goalData, original.id, null)
  } else {
    _this.$set(goalData, original.id, '')
  }
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
Vue.prototype.getTaskInfo = (arrMsg, taskKeyArr) => {
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

// 收集所有最新 task_key 数据
Vue.prototype.getTask = (arrMsg, taskKeyArr) => {
  let rs = {
    data: []
  }
  rs.data = findTaskMsgR(arrMsg, ['start']).form.object_list // 这里收集 申请 的信息
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

Vue.prototype.requireInterface = (action, method, params, url) => { // 请求接口
  const postHeadvData = {
    action: action,
    method: method,
    data: params
  }
  http.post(url.substring(4), parseData(postHeadvData))
  .then((response) => {
    console.dir(response)
    return response
  })
}

Vue.prototype.isEmptyObj = obj => { // 判断是不是没有属性的空对象 {} => true {xx: 'xxx'} => false
  for (const key in obj) {
    return false
  }
  return true
}

Vue.prototype.filterDateTime = value => {
  const date = new Date(value)
  const cv = s => (s > 9 ? '' : '0') + s
  return `${date.getFullYear()}-${cv(date.getMonth() + 1)}-${cv(date.getDate())} ` +
    `${cv(date.getHours())}:${cv(date.getMinutes())}:${cv(date.getSeconds())}`
}

Vue.prototype.filterDate = value => {
  const date = new Date(value)
  const cv = s => (s > 9 ? '' : '0') + s
  return `${date.getFullYear()}-${cv(date.getMonth() + 1)}-${cv(date.getDate())}`
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
