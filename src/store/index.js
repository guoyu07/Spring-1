import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
  userinfo: window.localStorage || {},
  idcrackData: [],
  sidebarConf: [{
    title: '运维服务目录',
    path: '/home',
    icon: 'fa-dashboard'
  }]
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
