import * as types from './mutation-types'
import Vue from 'vue'
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
    if (message.type === 'message' || message.data.type === 'tip') {
      if (message.type === 'message') {
        state.socket.unread = true
      }

      Vue.prototype.$notify.info({
        title: '新消息',
        message: message.data.title
      })
    }
  },

  [types.SOCKET_ONREAD] (state) {
    state.socket.unread = false
  }
}
