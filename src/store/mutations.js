import * as types from './mutation-types'
import Vue from 'vue'
import EventHub from './../utils/event-hub'
import { Notification } from 'element-ui'

Vue.prototype.$notify = Notification

export default {

  [types.UPDATE_USERINFO] (state, userDb) {
    state.userinfo = userDb.userinfo || {}
    // store.set('userinfo', state.userinfo)
  },

  [types.REMOVE_USERINFO] (state) {
    // store.remove('userinfo')
    state.userinfo = {}
  },

  [types.IDCRACK_DATA] (state, data) {
    state.idcrackData = data.idcrackData
  },

  [types.STORE_PROCESSES] (state, data) {
    state.editingProcesses = data.editingFields
  },

  [types.SOCKET_ONOPEN] (state) {
    state.socket.connected = true
  },

  [types.SOCKET_ONCLOSE] (state) {
    state.socket.connected = false
  },

  [types.SOCKET_ONMESSAGE] (state, message) {
    state.socket.message = message
    switch (message.type) {
      case 'message':
        state.socket.unread = true
        EventHub.$emit('on-receive-message')
        Vue.prototype.$notify.info({
          title: '新消息',
          message: message.data.title
        })
        break
      case 'new_task':
        state.socket.newTask = true
        Vue.prototype.$notify.warning({
          title: '待处理',
          // message: Vue.$createElement('div', [
          //   Vue.$createElement('p', `你被指派了一项新任务：${message.data.task.pinstance.pd.pname} - ${message.data.task.ptask.tname}`),
          //   Vue.$createElement('el-button', {}, '前往')
          // ]),
          message: `你有一项新的待处理任务：${message.data.task.pinstance.pd.pname}—${message.data.task.ptask.tname}`,
          duration: 8000
        })
        break
      case 'allot_task':
        state.socket.newAssigned = true
        Vue.prototype.$notify.warning({
          title: '待认领',
          message: `你有一项新的待认领任务：${message.data.task.pinstance.pd.pname}—${message.data.task.ptask.tname}`,
          duration: 8000
        })
        break
      default: break
    }
  },

  [types.SOCKET_ONREAD] (state) {
    state.socket.unread = false
  },

  [types.SOCKET_ONNEW] (state) {
    state.socket.newTask = false
  },

  [types.SOCKET_ONASSIGNED] (state) {
    state.socket.newAssigned = false
  },

  [types.UPDATE_APICACHE] (state, data) {
    state.apiCache[data.key] = data.value
  },

  [types.REMOVE_APICACHE] (state) {
    state.apiCache = {}
  }
}
