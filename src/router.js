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
  redirect: { path: '/home' },
  children: [{
    path: '/home',
    component: require('./components/layout/Dashboard')
  }, {
    path: '/storemanage',
    component: require('./components/storemanage/index'),
    children: [{
      path: '/storemanage/instock',
      component: require('./components/storemanage/pages/instock.vue')
    }, {
      path: '/storemanage/instock/:id',
      component: require('./components/storemanage/pages/instock.vue')
    }, {
      path: '/storemanage/instock/edit/:taskid',
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
      path: '/equipment/on/:device',
      component: require('./components/equipment/pages/ondevice.vue')
    }, {
      path: '/equipment/off',
      component: require('./components/equipment/pages/off.vue')
    }, {
      path: '/equipment/off-review',
      component: require('./components/equipment/pages/offReview.vue')
    }, {
      path: '/equipment/:pkey/:tkey/:id/:name', // 具体步骤操作
      component: require('./components/equipment/pages/step.vue')
    }]
  }, {
    path: '/firewall',
    component: require('./components/firewall/index'),
    children: [{
      path: '/firewall/apply',
      component: require('./components/firewall/pages/apply.vue')
    }, {
      path: '/firewall/approve',
      component: require('./components/firewall/pages/approve.vue')
    }, {
      path: '/firewall/result',
      component: require('./components/firewall/pages/result.vue')
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
      path: '/system/:step/:id/:name', // 服务器资源申请具体步骤操作
      component: require('./components/system/pages/step.vue')
    }, {
      path: '/system/offlinelist',
      component: require('./components/system/pages/offlinelist.vue')
    }, {
      path: '/system/onlinelist',
      component: require('./components/system/pages/onlinelist.vue')
    }, {
      path: '/system/online/:step/:id/:name', // 上线流程具体步骤操作
      component: require('./components/system/pages/onlinestep.vue')
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
    path: '/process-admin',
    component: require('./components/process/index'),
    children: [{
      path: '/process-admin/basics',
      component: require('./components/process/pages/basics.vue')
    }, {
      path: '/process-admin/steps',
      component: require('./components/process/pages/steps.vue')
    }]
  }, { // 流程设计 删
    path: '/custom',
    component: require('./components/custom/index'),
    children: [{
      path: '/custom',
      component: require('./components/custom/pages/list.vue')
    }, {
      path: '/custom/new',
      component: require('./components/custom/pages/bpmn.vue')
    }, {
      path: '/custom/bpmn/:pkey',
      component: require('./components/custom/pages/bpmn.vue')
    }]
  }, {
    path: '/orders',
    component: require('./components/orders/orders')
  }, { // 定义表单，提交给数据库存储，删
    path: '/forms',
    component: require('./components/forms/Index'),
    children: [{
      path: '',
      component: require('./components/forms/pages/list.vue')
    }, {
      path: '/forms/editor',
      component: require('./components/forms/pages/editor.vue')
    }]
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
