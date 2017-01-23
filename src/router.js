import Vue from 'vue'
import VueRouter from 'vue-router'

import auth from './auth'

// import Home from './components/Home'
// import LogTime from './components/LogTime.vue'
// import TimeEntries from './components/TimeEntries.vue'
import NotFound from './components/NotFound.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/login',
  component: require('./components/Login')
}, {
  path: '/',
  component: require('./components/Home'),
  children: [
    {
      path: '/part0',
      component: require('./components/part0/Index')
    }, {
      path: '/part1',
      component: require('./components/part1/Index'),
      children: [
        {
          path: '/part1/part11',
          component: require('./components/part1/pages/Part11.vue')
        }, {
          path: '/part1/part12',
          component: require('./components/part1/pages/Part12.vue')
        }, {
          path: '/part1/part13',
          component: require('./components/part1/pages/Part13.vue')
        }
      ]
    }, {
      path: '/part2',
      component: require('./components/part2/Index')
    }
  ],
  meta: {
    requiresAuth: true
  }
}, {
  path: '*',
  component: NotFound
}]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.requiresAuth) &&
      !auth.authenticated) {  // 如果目的路由需要验证、而用户尚未验证时
    // 跳转至登录页
    next('/login')
  } else {
    next()
  }
})

export default router
