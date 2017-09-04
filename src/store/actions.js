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
  },

  socket_onopen: ({ commit }) => {
    return new Promise((resolve, reject) => {
      console.log('socket open')
      commit(types.SOCKET_ONOPEN)
      resolve()
    })
  },

  socket_onclose: ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit(types.SOCKET_ONCLOSE)
      resolve()
    })
  },

  socket_onmessage: ({ commit }, message) => {
    return new Promise((resolve, reject) => {
      commit(types.SOCKET_ONMESSAGE, message)
      resolve()
    })
  },

  socket_onread: ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit(types.SOCKET_ONREAD)
      resolve()
    })
  }
}
