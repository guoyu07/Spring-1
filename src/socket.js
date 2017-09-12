import Vue from 'vue'
import VueSocket from 'vue-native-websocket'
import store from './store'

const WS_API = `ws://${window.location.host}/activiti_flow/`

export default {
  // socketOpen: false,

  initSocket () {
    if (store.state.connected) return false
    Vue.use(VueSocket, WS_API, { store, format: 'json' })
    store.dispatch('socket_onopen')
  }
}
