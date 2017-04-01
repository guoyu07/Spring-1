import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

// class Store {
//   constructor () {
//     this.store = window.localStorage
//     this.prefix = 'spring_admin_'
//   }
//   set (key, value, fn) {
//     try {
//       value = JSON.stringify(value)
//     } catch (e) {
//       // value = value
//     }

//     this.store.setItem(this.prefix + key, value)

//     fn && fn()
//   }
//   get (key, fn) {
//     if (!key) {
//       throw new Error('没有找到key。')
//       // return false
//     }
//     if (typeof key === 'object') {
//       throw new Error('key不能是一个对象。')
//       // return false
//     }
//     var value = this.store.getItem(this.prefix + key)
//     if (value !== null) {
//       try {
//         value = JSON.parse(value)
//       } catch (e) {
//         // value = value
//       }
//     }

//     return value
//   }
//   remove (key) {
//     this.store.removeItem(this.prefix + key)
//   }
// }
// const store = new Store()

const state = {
  userinfo: window.localStorage || {}
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
