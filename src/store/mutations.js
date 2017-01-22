import * as types from './mutation-types'

export default {
  [types.LOGIN] (state, token) {
    state.token = token
  }
}
