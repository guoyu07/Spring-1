import Vue from 'vue'
// import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

import App from './App'
import router from './router'
import store from './store'

import eventHub from './utils/event-hub'
import auth from './auth'
// import './socket'

// import apis from './api.mock'
import axios from 'axios'
// import LazyRender from 'vue-lazy-render'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import 'assets/css/main.less'

// bpmn 相关 css
import 'diagram-js/assets/diagram-js.css'
import 'bpmn-js/assets/bpmn-font/css/bpmn-embedded.css'
import 'bpmn-js-properties-panel/styles/properties.less'

Vue.use(ElementUI)
// Vue.use(LazyRender)

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
  // let date = new Date(val)
  // return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  const date = new Date(val)
  const cv = s => (s > 9 ? '' : '0') + s
  return `${date.getFullYear()}-${cv(date.getMonth() + 1)}-${cv(date.getDate())} ` +
    `${cv(date.getHours())}:${cv(date.getMinutes())}:${cv(date.getSeconds())}`
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
  // new Vue({}).$message.error(err.response.data.errorMessage)
  Vue.prototype.$message.error(err.response.data.errorMessage)
})

Vue.prototype.http = http

const parseData = obj => {
  // qs.stringify(obj)
  // const action = encodeURIComponent(obj.action)
  // const result = `action=${action}&method=${obj.method}&data=`
  // return result + encodeURIComponent(JSON.stringify(obj.data))
  return obj
}

Vue.prototype.parseData = parseData

/**
 * @method getPathResult 取某个路径的值
 * @param {object} result 传入一个需要取某个路径的值的对象
 * @param {string} path 某个路径
 * @param {number} k 若取到的值为数组，k则为数组的索引，若不为数组，k无效
 * @return {arr, object, string, number, null, ''} 直接返回path对应的值
*/
const getPathResult = (result, path, k, kindex) => {
  if (!result) {
    // console.log('找不到result')
    return false
  }
  let _result = result
  const _path = path.split('.')
  // console.log(_path, Array.isArray(_result[_path[0]]), k)
  if (Array.isArray(_result[_path[0]]) && k !== undefined) { // 为数组时
    if (_result[_path[0]].length) {
      _path.reduce((prev, cur, index) => {
        if (Array.isArray(_result[cur]) && kindex !== undefined) {
          _result = _result[cur][kindex]
        } else {
          _result = index ? _result[cur] : _result[cur][k]
        }
      }, null)
    } else {
      return false
    }
  } else {
    for (const i in _path) {
      // console.log(_result[_path[i]])
      if (!_result) {
        // console.log('找不到_result')
        return false
      }
      if (Object.prototype.toString.call(_result[_path[i]])) { // 为对象时
        if (_result[_path[i]] !== undefined) { // 读取不到值时 return false
          // console.log(_result[_path[i]])
          _result = _result[_path[i]]
        } else {
          // console.log(_result[_path[i]])
          console.log(`读不到${_path[i]}的值`)
          return undefined
        }
      } else {
        console.log('getPathResult 出错')
        return undefined
      }
    }
  }
  return _result
}

Vue.prototype.getPathResult = getPathResult

/**
 * @method getLimitQuantity 表单自定义里的个数限制，用于 search_bar
 * @param {object} formItem 表单定义
 * @param {object} postForm 需要提交的表单字段
 * @param {object} messageData 历史数据
 * @param {number} index 索引，用于有 body 的地方
 * @return {object} 根据表单设置的各种类型直接返回限制的个数，min/max/min&max
*/
Vue.prototype.getLimitQuantity = (formItem, postForm, messageData, index) => {
  // console.log(formItem)
  if (formItem.limit && formItem.limit.type) {
    // if (data.value.count.type === 'message_body') {
    //   return getPathResult(applyData, data.value.count.key_path)
    // } else {
    //   return 5 // 默认限制选5台设备
    // }
    let keyData
    let max
    if (formItem.limit.type === 'message_body') {
      keyData = getPathResult(messageData.body[index], formItem.limit.key_path)
    } else if (formItem.limit.type === 'message_header') {
      keyData = getPathResult(messageData.header, formItem.limit.key_path)
    } else if (formItem.limit.type === 'static') {
      keyData = formItem.limit.min
      max = formItem.limit.max
    } else if (formItem.limit.type === 'form_body') {
      keyData = getPathResult(postForm.body[index], formItem.limit.key_path) // postForm.body[this.index] 就是 this.item
    } else if (formItem.limit.type === 'form_header') {
      keyData = getPathResult(postForm.header, formItem.limit.key_path)
    } else {
      keyData = 5
    }
    if (Array.isArray(keyData)) {
      return {min: keyData.length, max: max}
    } else if (typeof keyData === 'number') {
      return {min: keyData, max: max}
    } else if (typeof keyData === 'string') {
      if (typeof +keyData === 'number') {
        return {min: +keyData, max: max}
      }
    }
  }
}

/**
 * @method setDataType 根据表单定义生成双向绑定的数据
 * @param {object} original 表单定义
 * @param {object} goalData 需要提交的表单
 * @return {object} 根据表单定义的类型生成各种类型初始化的值
*/
Vue.prototype.setDataType = (original, goalData) => {
  if (original.value.type === 'arr' || original.value.type === 'dicts' || original.value.type === 'cascade' || original.value.type === 'search_bar' || original.value.type === 'enums') {
    // console.log(original.name)
    Vue.prototype.$set(goalData, original.id, [])
  } else if (original.value.type === 'str' || original.value.type === 'enum' || original.value.type === 'date' || original.value.type === 'datetime') {
    Vue.prototype.$set(goalData, original.id, '')
  } else if (original.value.type === 'dict' || (original.value.type === 'users' && !original.isAlias)) {
    Vue.prototype.$set(goalData, original.id, null)
  } else if (original.value.type === 'int') {
    Vue.prototype.$set(goalData, original.id, 0)
  } else if (original.value.type === 'users' && original.isAlias) {
    Vue.prototype.$set(goalData, original.id, { group: null, user: null })
  } else if (original.value.type === 'table') {
    Vue.prototype.$set(goalData, original.id, [])
    Vue.prototype.$set(goalData[original.id], 0, {})
    let data = goalData[original.id][0]
    original.value.attr_list.map(item => {
      Vue.prototype.setDataType(item, data)
    })
  }
}

/**
 * @method setNewDataType 根据表单定义生成对应初始化数据，不一定用于双向绑定
 * @param {object} original 表单定义
 * @param {object} goalData 存储数据的对象
 * @return {object} 根据表单定义的类型生成各种类型初始化的值
*/
Vue.prototype.setNewDataType = (original, goalData) => {
  if (original.value.type === 'arr' || original.value.type === 'dicts' || original.value.type === 'cascade' || original.value.type === 'search_bar' || original.value.type === 'enums') {
    goalData[original.id] = []
  } else if (original.value.type === 'date' || original.value.type === 'datetime' || original.value.type === 'str' || original.value.type === 'enum') {
    goalData[original.id] = undefined
  } else if (original.value.type === 'dict' || (original.value.type === 'users' && !original.isAlias)) {
    goalData[original.id] = null
  } else if (original.value.type === 'int') {
    goalData[original.id] = 0
  } else if (original.value.type === 'users' && original.isAlias) {
    goalData[original.id] = { group: null, user: null }
  } else if (original.value.type === 'table') {
    goalData[original.id] = []
    goalData[original.id][0] = {}
    let data = goalData[original.id][0]
    original.value.attr_list.map(item => {
      Vue.prototype.setNewDataType(item, data)
    })
  }
}

/**
 * @method findTaskMsgR 逆向寻找匹配的 task_key
 * @param {object} arrMsg 一般为接口返回的 message
 * @param {string} arrTaskKey 任务名称
 * @return {object} 返回最新的任务的相关信息
*/
var findTaskMsgR = (arrMsg, arrTaskKey) => {
  for (let i = arrMsg.length - 1; i >= 0; i--) {
    if (arrTaskKey.indexOf(arrMsg[i]['task_key']) !== -1) {
      return arrMsg[i]
    }
  }
  return false
}

Vue.prototype.findTaskMsgR = findTaskMsgR

/**
 * @method getTaskInfo 收集所有最新 task_key 数据（历史信息）
 * @param {object} arrMsg 一般为接口返回的 message
 * @param {arr} taskKeyArr 除了start的所有任务名称
 * @return {arr} 返回所有任务的相关信息,即历史信息
*/
Vue.prototype.getTaskInfo = (arrMsg, taskKeyArr) => {
  let rs = findTaskMsgR(arrMsg, ['start']).form // 这里收集 申请 的信息
  // console.log(taskKeyArr)
  taskKeyArr
    .filter(t => findTaskMsgR(arrMsg, [t]))
    .map(t => findTaskMsgR(arrMsg, [t]).form.header)
    .map(tsk => {
      if (Object.prototype.toString.call(tsk) === '[object Object]') {
        Object.assign(rs.header, tsk)
      }
    })
  taskKeyArr
    .filter(t => findTaskMsgR(arrMsg, [t]))
    .map(t => findTaskMsgR(arrMsg, [t]).form.body)
    .map(tsk => {
      // console.log(tsk)
      if (Array.isArray(tsk)) {
        !rs.body.length && tsk.forEach(t => rs.body.push({}))
        tsk.map((host, index) => Object.assign(rs.body[index], host))
        // console.log(rs.body)
      }
    })
  // console.log(rs)
  return rs
}

/**
 * @method filterObj 过滤无效的搜索字段
 * @param {object} obj 搜索值的对象集合
 * @param {boolean} like 是否模糊搜索
 * @return {arr} 返回搜索字段信息
*/
Vue.prototype.filterObj = (obj, like) => { // 过滤搜索字段
  let data = {}
  for (const key in obj) {
    if (obj[key].value) { // 首先要有值
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

/**
 * @method showFormItem 根据表单定义是否显示该表单
 * @param {object} taskform 表单定义
 * @param {object} postForm 提交的表单
 * @param {object} messageData 历史信息
 * @param {string, boolean} historyTask 历史任务
 * @param {string, boolean} currentTask 当前任务
 * @param {number} index 索引，有 body 时需要索引
 * @return {boolean} 是否显示该表单
*/
Vue.prototype.showFormItem = (taskform, postForm, messageData, historyTask, currentTask, index) => {
  if (!(taskform.show && taskform.show.type)) {
    return true
  } else {
    let compareVariable
    if (taskform.show.type === 'form_header') {
      if (historyTask && (historyTask !== currentTask)) {
        compareVariable = messageData.header
      } else {
        compareVariable = postForm.header
      }
    } else if (taskform.show.type === 'form_body') {
      if (historyTask && (historyTask !== currentTask)) {
        compareVariable = messageData.body[index]
      } else {
        compareVariable = postForm.body[index]
      }
    } else if (taskform.show.type === 'message_header') {
      compareVariable = messageData.header
    } else if (taskform.show.type === 'message_body') {
      compareVariable = messageData.body[index]
    }
    const keyPath = taskform.show.key_path.split('.')
    const _keyPath = keyPath[0]
    if (taskform.show.op === 'eq') {
      // console.log(compareVariable, _keyPath, Vue.prototype.getPathResult(compareVariable, _keyPath))
      if (Vue.prototype.getPathResult(compareVariable, _keyPath) && Vue.prototype.getPathResult(compareVariable, taskform.show.key_path) === taskform.show.value) {
        return true
      }
    } else if (taskform.show.op === 'neq') {
      if (Vue.prototype.getPathResult(compareVariable, _keyPath) && Vue.prototype.getPathResult(compareVariable, taskform.show.key_path) !== taskform.show.value) {
        return true
      }
    } else if (taskform.show.op === 'reg') {
      if (Vue.prototype.getPathResult(compareVariable, _keyPath) && Vue.prototype.getPathResult(compareVariable, taskform.show.key_path).includes(taskform.show.value)) {
        return true
      }
    }
  }
}

/**
 * @method showFormItem 根据表单定义是否显示该 body
 * @param {object} taskFormData 表单定义
 * @param {object} postForm 提交的表单
 * @param {object} messageData 历史信息
 * @param {number} index body 的索引
 * @param {string, boolean} historyTask 历史任务
 * @param {string, boolean} currentTask 当前任务
 * @return {boolean} 是否显示该 body
*/
Vue.prototype.showBodyList = (taskFormData, postForm, messageData, index, historyTask, currentTask) => {
  if (taskFormData.show && taskFormData.show.type) {
    let compareVariable
    if (taskFormData.show.type === 'form_header') {
      // compareVariable = postForm.header
      if (historyTask && (historyTask !== currentTask)) {
        compareVariable = messageData.header
      } else {
        compareVariable = postForm.header
      }
    } else if (taskFormData.show.type === 'message_header') {
      compareVariable = messageData.header
    } else if (taskFormData.show.type === 'message_body') {
      compareVariable = messageData.body[index]
    }
    if (taskFormData.show.op === 'eq') {
      if (Vue.prototype.getPathResult(compareVariable, taskFormData.show.key_path.split('.')[0]) && Vue.prototype.getPathResult(compareVariable, taskFormData.show.key_path) === taskFormData.show.value) {
        return true
      }
    } else if (taskFormData.show.op === 'neq') {
      if (Vue.prototype.getPathResult(compareVariable, taskFormData.show.key_path.split('.')[0]) && Vue.prototype.getPathResult(compareVariable, taskFormData.show.key_path) !== taskFormData.show.value) {
        return true
      }
    } else if (taskFormData.show.op === 'reg') {
      if (Vue.prototype.getPathResult(compareVariable, taskFormData.show.key_path.split('.')[0]) && Vue.prototype.getPathResult(compareVariable, taskFormData.show.key_path).includes(taskFormData.show.value)) {
        return true
      }
    }
  } else {
    return true
  }
}

/**
 * @method bodyLabel 根据表单定义显示该 body 的标签名称
 * @param {object} taskForm 表单定义
 * @param {object} postForm 提交的表单
 * @param {object} messageData 历史信息
 * @param {arr} labelArr 各个 body 的标签名称
 * @return {arr} 返回 labelArr 若表单无定义 body 名称，则直接显示 ‘body’ + 索引 + 1
*/
Vue.prototype.bodyLabel = (taskForm, postForm, messageData, labelArr) => {
  // console.log(taskForm)
  if (taskForm.body.body_list.length !== 0) {
    if (taskForm.body.body_list.length === 1) {
      messageData && messageData.body.map((body, index) => {
        if (taskForm.body.body_list[0].name && Vue.prototype.showBodyList(taskForm.body.body_list[0], postForm, messageData, index)) {
          labelArr[index] = taskForm.body.body_list[0].name + (index + 1)
        } else {
          labelArr[index] = 'body' + (index + 1)
        }
      })
    } else {
      messageData && messageData.body.map((body, index) => {
        taskForm.body.body_list.map(bodyList => {
          let compareVariable
          if (bodyList.show.type === 'form_header') {
            compareVariable = postForm.header
          } else if (bodyList.show.type === 'message_header') {
            compareVariable = messageData.header
          } else if (bodyList.show.type === 'message_body') {
            compareVariable = body
          } else {
            Vue.prototype.$message.warning(`${bodyList.name}显示条件的比较变量设置有误`)
            return false
          }
          if (bodyList.show.op === 'eq') {
            if (Vue.prototype.getPathResult(compareVariable, bodyList.show.key_path.split('.')[0]) && Vue.prototype.getPathResult(compareVariable, bodyList.show.key_path) === bodyList.show.value) {
              if (messageData.body.length === 1) {
                labelArr[index] = bodyList.name
              } else {
                labelArr[index] = bodyList.name + (index + 1)
              }
            }
          } else if (bodyList.show.op === 'neq') {
            if (Vue.prototype.getPathResult(compareVariable, bodyList.show.key_path.split('.')[0]) && Vue.prototype.getPathResult(compareVariable, bodyList.show.key_path) !== bodyList.show.value) {
              if (messageData.body.length === 1) {
                labelArr[index] = bodyList.name
              } else {
                labelArr[index] = bodyList.name + (index + 1)
              }
            }
          }
        })
      })
    }
  } else {
    messageData && messageData.body.map((body, index) => {
      labelArr[index] = 'body' + (index + 1)
    })
  }
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
