// import {
//   BEGIN_REQUEST,
//   CEASE_REQUEST,
//   ADD_CONF,
//   DEL_CONF,
//   SHOW_LOADING,
//   HIDE_LOADING,
//   UPDATE_USERINFO,
//   REMOVE_USERINFO
// } from './mutation-types'
import * as types from './mutation-types'

// import {
//   store
// } from './index'

export default {
  [types.SHOW_LOADING] (state) {
    state.ajax_loading = true
  },

  [types.HIDE_LOADING] (state) {
    state.ajax_loading = false
  },

  [types.UPDATE_USERINFO] (state, userDb) {
    state.userinfo = userDb.userinfo || {}
    // store.set('userinfo', state.userinfo)
  },

  [types.REMOVE_USERINFO] (state) {
    // store.remove('userinfo')
    state.userinfo = {}
  },

  [types.BEGIN_REQUEST] (state) {
    state.isRequesting = true
  },
  [types.CEASE_REQUEST] (state) {
    state.isRequesting = false
  },
  // 增
  [types.ADD_CONF] (state, formConfig) {
    state.formConfigList.push(formConfig)
  },
  // 删
  [types.DEL_CONF] (state, id) {
    const index = state.formConfigList.findIndex(item => item.id === id)
    state.formConfigList.splice(index, 1)
  }
  // 改 -> 删掉旧的，增加新的
}
