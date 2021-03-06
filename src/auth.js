import router from './router'
import store from './store'
import eventHub from './utils/event-hub'
import socket from './socket'
import Vue from 'vue'
// URL 及端点常量
// const API_URL = 'http://localhost:3001/'
// const LOGIN_URL = API_URL + 'sessions/create/'

export default {
  // 验证状态
  authenticated: false,

  // 往登录 URL 发起请求并保存返回的 token
  login (context, creds, redirect) {
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
      this.authenticated = true
      // 跳转至指定目的
      if (redirect) {
        router.replace(redirect)
      }
      socket.initSocket()
      // 发射 login 事件
      eventHub.$emit('login')
    }, response => {
      return false
    })
  },

  logout (context, data) {
    // window.localStorage.removeItem('userName')
    store.dispatch('remove_userinfo').then(() => {
      router.replace('/login')
      store.dispatch('socket_onclose')
      delete Vue.prototype.$socket
    })
    context.http.post('/base/', data).then(res => {
      console.log('ture logout')
    })
    // router.replace('/login')
    this.authenticated = false
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
