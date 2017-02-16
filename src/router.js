import Vue from 'vue'
import VueRouter from 'vue-router'

import auth from './auth'

import NProgress from 'nprogress'

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
  children: [{
    path: '/storemanage',
    component: require('./components/storemanage/index'),
    children: [{
      path: '/storemanage/instock',
      component: require('./components/storemanage/pages/instock.vue')
    }, {
      path: '/storemanage/outstock',
      component: require('./components/storemanage/pages/outstock.vue')
    }]
  }, {
    path: '/equipment',
    component: require('./components/equipment/index'),
    children: [{
      path: '/equipment/on',
      component: require('./components/equipment/pages/on.vue')
    }, {
      path: '/equipment/off',
      component: require('./components/equipment/pages/off.vue')
    }, {
      path: '/equipment/check',
      component: require('./components/equipment/pages/check.vue')
    }]
  }, {
    path: '/system',
    component: require('./components/system/index'),
    children: [{
      path: '/system/apply',
      component: require('./components/system/pages/apply.vue')
    }, {
      path: '/system/applylist',
      component: require('./components/system/pages/applylist.vue')
    }, {
      path: '/system/offline',
      component: require('./components/system/pages/offline.vue')
    }]
  }, {
    path: '/part1',
    component: require('./components/part1/Index'),
    children: [{
      path: '',
      component: require('./components/part1/pages/list.vue')
    }, {
      path: '/part1/editor',
      component: require('./components/part1/pages/editor.vue')
    }, {
      path: '/part1/part13',
      component: require('./components/part1/pages/Part13.vue')
    }]
  }, {
    path: '/part2',
    component: require('./components/part2/Index')
  }],
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
  const requiresAuth = to.matched.some(m => m.meta.requiresAuth)
  auth.checkAuth() // 取 localStorage
  if (requiresAuth && !auth.authenticated) {  // 如果目的路由需要验证、而用户尚未验证时
    // 跳转至登录页
    next('/login')
  } else {
    next()
  }
  NProgress.done()
})

router.afterEach(() => {
  NProgress.start()
})

export default router
