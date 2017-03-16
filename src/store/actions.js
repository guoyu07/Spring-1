import * as types from './mutation-types'

// export const beginRequest = ({ commit }) => {
//   commit(types.BEGIN_REQUEST)
// }

// export const ceaseRequest = ({ commit }) => {
//   commit(types.CEASE_REQUEST)
// }

module.exports = {
  show_loading: ({
    commit
  }) => {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_LOADING)
      resolve()
    })
  },

  hide_loading: ({
    commit
  }) => {
    return new Promise((resolve, reject) => {
      commit(types.HIDE_LOADING)
      resolve()
    })
  }
}
