import * as types from './mutation-types'

// export const beginRequest = ({ commit }) => {
//   commit(types.BEGIN_REQUEST)
// }

// export const ceaseRequest = ({ commit }) => {
//   commit(types.CEASE_REQUEST)
// }

module.exports = {
  update_userinfo: ({
    commit
  }, {
    userinfo
  }) => {
    return new Promise((resolve, reject) => {
      commit(types.UPDATE_USERINFO, {
        userinfo
      })
      resolve()
    })
  },

  remove_userinfo: ({
    commit
  }) => {
    return new Promise((resolve, reject) => {
      commit(types.REMOVE_USERINFO)
      resolve()
    })
  },

  idcrack_data: ({
    commit
  }, {
    idcrackData
  }) => {
    return new Promise((resolve, reject) => {
      commit(types.IDCRACK_DATA, {
        idcrackData
      })
      resolve()
    })
  },

  store_processes: ({
    commit
  }, {
    editingFields
  }) => {
    return new Promise((resolve, reject) => {
      commit(types.STORE_PROCESSES, {
        editingFields
      })
      resolve()
    })
  }
}
