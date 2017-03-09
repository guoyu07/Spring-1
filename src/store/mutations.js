import {
  BEGIN_REQUEST,
  CEASE_REQUEST,
  ADD_CONF,
  DEL_CONF
} from './mutation-types'

export default {
  [BEGIN_REQUEST] (state) {
    state.isRequesting = true
  },
  [CEASE_REQUEST] (state) {
    state.isRequesting = false
  },
  // 增
  [ADD_CONF] (state, formConfig) {
    state.formConfigList.push(formConfig)
  },
  // 删
  [DEL_CONF] (state, id) {
    const index = state.formConfigList.findIndex(item => item.id === id)
    state.formConfigList.splice(index, 1)
  }
  // 改 -> 删掉旧的，增加新的
}
