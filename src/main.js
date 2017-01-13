import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

import App from './App'
import router from './router'
import store from './store'

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // template: '<App/>',
  // components: { App },
  router,
  store,
  ...App
})
