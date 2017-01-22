import * as types from './mutation-types'

export default {
  handleLogin ({ commit }, token) {
    commit(types.LOGIN, token)
  }
}
