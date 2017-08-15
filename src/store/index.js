import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const state = {
  userinfo: window.localStorage || {},
  idcrackData: [],
  sidebarConf: {
    title: '帐号管理',
    routes: [{
      name: '运维服务目录',
      path: '/home',
      icon: 'fa-dashboard'
    }]
  },
  plugins: [createPersistedState()]
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
