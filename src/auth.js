import router from './router'
import store from './store'
import eventHub from './utils/eventHub'

// URL 及端点常量
// const API_URL = 'http://localhost:3001/'
// const LOGIN_URL = API_URL + 'sessions/create/'

export default {
  // 验证状态
  authenticated: false,

  // 往登录 URL 发起请求并保存返回的 token
  login (context, creds, redirect) {
    console.log(creds)
    context.http.post('', creds).then(response => {
      window.localStorage.setItem('userName', response.data.data.userId)
      window.localStorage.setItem('isAdmin', response.data.data.admin)
      window.localStorage.setItem('isSuperAdmin', response.data.data.superadmin)
      window.localStorage.setItem('isProcessAdmin', response.data.data.processadmin)
      store.dispatch('update_userinfo', {
        userinfo: response.data.data
      })
      this.authenticated = true
      // 跳转至指定目的
      if (redirect) {
        router.replace(redirect)
      }
      // 发射 login 事件
      eventHub.$emit('login')
    }, response => {
      return false
    })
  },

  logout () {
    window.localStorage.removeItem('userName')
    store.dispatch('remove_userinfo').then(() => {
      router.push('/login')
    })
    router.replace('/login')
    this.authenticated = false
  },

  checkAuth () {
    const jwt = window.localStorage.getItem('userName')
    if (jwt) {
      this.authenticated = true
    } else {
      this.authenticated = false
    }
  },

  // 供需要验证头部的请求使用
  getAuthHeader () {
    return {
      'Authorization': 'Bearer' + window.localStorage.getItem('userName')
    }
  }
}
