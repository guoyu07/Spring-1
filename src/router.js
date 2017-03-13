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
      path: '/storemanage/instock/:id',
      component: require('./components/storemanage/pages/instock.vue')
    }, {
      path: '/storemanage/outstock',
      component: require('./components/storemanage/pages/outstock.vue')
    }, {
      path: '/storemanage/outstock/:edit',
      component: require('./components/storemanage/pages/outstock.vue')
    }, {
      path: '/storemanage/:objectid/:pkey/:step/:id/:name',
      component: require('./components/storemanage/pages/step.vue')
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
      path: '/equipment/off-review',
      component: require('./components/equipment/pages/offReview.vue')
    }, {
      path: '/equipment/:objectid/:step/:id/:name', // 具体步骤操作
      component: require('./components/equipment/pages/step.vue')
    }]
  }, {
    path: '/system',
    component: require('./components/system/index'),
    children: [{
      path: '/system/apply',
      component: require('./components/system/pages/apply.vue')
    }, {
      path: '/system/apply/:id',
      component: require('./components/system/pages/apply.vue')
    }, {
      path: '/system/applylist',
      component: require('./components/system/pages/applylist.vue')
    }, {
      path: '/system/:step/:id/:name', // 具体步骤操作
      component: require('./components/system/pages/step.vue')
    }, {
      path: '/system/offlinelist',
      component: require('./components/system/pages/offlinelist.vue')
    }, {
      path: '/system/onlinelist',
      component: require('./components/system/pages/onlinelist.vue')
    }]
  }, {
    path: '/auth',
    component: require('./components/auth/index'),
    children: [{
      path: '/auth/users',
      component: require('./components/auth/pages/users.vue')
    }, {
      path: '/auth/roles',
      component: require('./components/auth/pages/roles.vue')
    }]
  }, {
    path: '/orders',
    component: require('./components/others/orders')
  }, { // 定义表单，提交给数据库存储，删
    path: '/part1',
    component: require('./components/part1/Index'),
    children: [{
      path: '',
      component: require('./components/part1/pages/list.vue')
    }, {
      path: '/part1/editor',
      component: require('./components/part1/pages/editor.vue')
    }]
  }, { // 获取数据，渲染成表单，删
    path: '/select-form',
    component: require('./components/part1/pages/selectForm.vue')
  }],
  meta: {
    requiresAuth: true
  }
}, { // 流程设计 删
  path: '/part2',
  component: require('./components/part2/Index')
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
