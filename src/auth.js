import router from './router'
import eventHub from './utils/eventHub'

// URL 及端点常量
// const API_URL = 'http://localhost:3001/'
// const LOGIN_URL = API_URL + 'sessions/create/'

export default {
  // 验证状态
  authenticated: false,

  // 往登录 URL 发起请求并保存返回的 token
  login (context, creds, redirect) {
    // 这里应该发起请求
    // 暂时去掉
    // context.$http.post(LOGIN_URL, creds, (data) => {
    // window.localStorage.setItem('id_token', data.id_token)
    window.localStorage.setItem('id_token', creds.username)

    this.authenticated = true

    // 跳转至指定目的
    if (redirect) {
      router.replace(redirect)
    }

    // 发射 login 事件
    eventHub.$emit('login')
    // }).error((err) => {
    //   context.error = err
    // })
  },

  logout () {
    window.localStorage.removeItem('id_token')
    // router.replace('/login')
    this.authenticated = false
  },

  checkAuth () {
    const jwt = window.localStorage.getItem('id_token')
    if (jwt) {
      this.authenticated = true
    } else {
      this.authenticated = false
    }
  },

  // 供需要验证头部的请求使用
  getAuthHeader () {
    return {
      'Authorization': 'Bearer' + window.localStorage.getItem('id_token')
    }
  }
}
