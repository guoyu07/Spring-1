import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
  isRequesting: false,
  formConfigList: [],
  ajax_loading: false,
  userinfo: {}
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
