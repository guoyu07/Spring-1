import router from './router'

// URL and endpoint constants
// const API_URL = 'http://localhost:3001/'
// const LOGIN_URL = API_URL + 'sessions/create/'

export default {
  // authentication status
  authenticated: false,

  // send a request to the login URL and save the returned JWT
  login (context, creds, redirect) {
    // context.$http.post(LOGIN_URL, creds, (data) => {
    // window.localStorage.setItem('id_token', data.id_token)
    window.localStorage.setItem('id_token', creds.username)

    this.authenticated = true

    // redirect to a specified route
    if (redirect) {
      router.replace(redirect)
    }
    // }).error((err) => {
    //   context.error = err
    // })
  },

  logout () {
    window.localStorage.removeItem('id_token')
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

  // the object to be passed as a header for authenticated requests
  getAuthHeader () {
    return {
      'Authorization': 'Bearer' + window.localStorage.getItem('id_token')
    }
  }
}
