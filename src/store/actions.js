import * as types from './mutation-types'
import { logout } from './../auth'

export default {
  handleLogin ({ commit }, token) {
    commit(types.LOGIN_USER, token)
  },

  handleLogout ({ commit }) {
    logout()
    commit(types.LOGOUT_USER)
  }
}