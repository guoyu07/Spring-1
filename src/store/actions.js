import * as types from './mutation-types'

export const beginRequest = ({ commit }) => {
  commit(types.BEGIN_REQUEST)
}

export const ceaseRequest = ({ commit }) => {
  commit(types.CEASE_REQUEST)
}
