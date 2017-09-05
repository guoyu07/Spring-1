import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const state = {
  userinfo: {},
  idcrackData: [],
  editingProcesses: [],
  messages: [],
  socket: {
    connected: false,
    unread: false,
    message: null
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  plugins: [createPersistedState()]
})
