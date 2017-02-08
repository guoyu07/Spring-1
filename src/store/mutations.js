import * as types from './mutation-types'

export default {
  [types.BEGIN_REQUEST] (state) {
    state.isRequesting = true
  },

  [types.CEASE_REQUEST] (state) {
    state.isRequesting = false
  }
}
