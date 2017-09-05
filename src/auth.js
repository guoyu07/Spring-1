import router from './router'
import store from './store'
import eventHub from './utils/event-hub'
// URL 及端点常量
// const API_URL = 'http://localhost:3001/'
// const LOGIN_URL = API_URL + 'sessions/create/'

export default {
  // 验证状态
  authenticated: false,

  // 往登录 URL 发起请求并保存返回的 token
  login (context, creds, redirect) {
    console.log(creds)
    context.http.post('/base/', creds).then(response => {
      // window.localStorage.setItem('userName', response.data.data.nick)
      // window.localStorage.setItem('userId', response.data.data.userId)
      // window.localStorage.setItem('isAdmin', response.data.data.admin)
      // window.localStorage.setItem('isSuperAdmin', response.data.data.superadmin)
      // window.localStorage.setItem('isProcessAdmin', response.data.data.processadmin)
      // window.localStorage.setItem('groups', JSON.stringify(response.data.data.groups))
      store.dispatch('update_userinfo', {
        userinfo: response.data.data
      })
      console.log(store.state.userinfo)
      this.authenticated = true
      // 跳转至指定目的
      if (redirect) {
        router.replace(redirect)
      }
      // 发射 login 事件
      eventHub.$emit('login')
      this.socket()
    }, response => {
      return false
    })
  },

  logout () {
    // window.localStorage.removeItem('userName')
    store.dispatch('remove_userinfo').then(() => {
      router.replace('/login')
    })
    // router.replace('/login')
    this.authenticated = false
      // 发射 login 事件
    eventHub.$emit('logout')
  },

  checkAuth () {
    // const jwt = window.localStorage.getItem('userName')
    const jwt = store.state.userinfo.nick
    if (jwt) {
      this.authenticated = true
    } else {
      this.authenticated = false
    }
  },

  // 供需要验证头部的请求使用
  getAuthHeader () {
    return {
      'Authorization': 'Bearer' + store.state.userinfo.nick
    }
  }
}
