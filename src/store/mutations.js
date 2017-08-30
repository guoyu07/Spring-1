import * as types from './mutation-types'

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

  [types.EDITING_FIELDS] (state, data) {
    state.editingFields = data.editingFields
  }
}
