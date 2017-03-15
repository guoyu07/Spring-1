import * as types from './mutation-types'

export const beginRequest = ({ commit }) => {
  commit(types.BEGIN_REQUEST)
}

export const ceaseRequest = ({ commit }) => {
  commit(types.CEASE_REQUEST)
}

export const showLoading = ({ commit }) => {
  return new Promise((resolve, reject) => {
    commit(types.SHOW_LOADING)
    resolve()
  })
}

export const hideLoading = ({ commit }) => {
  return new Promise((resolve, reject) => {
    commit(types.HIDE_LOADING)
    resolve()
  })
}
