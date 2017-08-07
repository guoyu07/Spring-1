import Vue from 'vue'
import VueRouter from 'vue-router'

import auth from './auth'

import NProgress from 'nprogress'

// import Home from './components/Home'
// import LogTime from './components/LogTime'
// import TimeEntries from './components/TimeEntries'
import NotFound from './components/NotFound'

Vue.use(VueRouter)

const routes = [{
  path: '/login',
  component: require('./components/Login')
}, {
  path: '/',
  component: require('./components/Home'),
  redirect: { path: '/home' },
  children: [{
    path: '/',
    component: require('./components/dashboard/index'),
    children: [{
      path: '/home',
      component: require('./components/dashboard/pages/dashboard')
    }]
  }, {
    path: '/procedure',
    component: require('./components/procedure/index'),
    children: [{
      path: '/procedure/start/:pkey/:pname',
      component: require('./components/procedure/pages/start')
    }, {
      path: '/procedure/modify/:pid/:pkey/:pname/:tid/:tkey',
      component: require('./components/procedure/pages/start')
    }, {
      path: '/procedure/:pkey/:tkey/:id/:name',
      component: require('./components/procedure/pages/step')
    }, {
      path: '/procedure-info/:pkey/:tkey/:id/:name',
      component: require('./components/procedure/pages/stepInfo')
    }, {
      path: '/procedure-info/:pkey/:id',
      component: require('./components/procedure/pages/stepInfo')
    }]
  }, {
    path: '/guosen',
    component: require('./components/guosen/index'),
    children: [{
      path: '/guosen/on',
      component: require('./components/guosen/pages/on')
    }, {
      path: '/guosen/:pkey/:tkey/:id/:name',
      component: require('./components/guosen/pages/step')
    }, {
      path: '/guosen-info/:pkey/:tkey/:id/:name',
      component: require('./components/guosen/pages/stepInfo')
    }, {
      path: '/guosen-info/:pkey/:id',
      component: require('./components/guosen/pages/stepInfo')
    }]
  }, {
    path: '/equipment',
    component: require('./components/equipment/index'),
    children: [{
      path: '/equipment/on',
      component: require('./components/equipment/pages/on')
    }, {
      path: '/equipment/on/:device',
      component: require('./components/equipment/pages/ondevice')
    }, {
      path: '/equipment/off',
      component: require('./components/equipment/pages/off')
    }, {
      path: '/equipment/off-review',
      component: require('./components/equipment/pages/offReview')
    }, {
      path: '/equipment/:pkey/:tkey/:id/:name', // 具体步骤操作
      component: require('./components/equipment/pages/step')
    }]
  }, {
    path: '/event-hub',
    component: require('./components/eventHub/index'),
    children: [{
      path: '',
      component: resolve => require(['./components/eventHub/pages/list'], resolve)
    }, {
      path: '/event-hub/event/:tkey',
      component: resolve => require(['./components/eventHub/pages/event'], resolve)
    }, {
      path: '/event-hub/start/:pkey/:pname',
      component: resolve => require(['./components/eventHub/pages/start'], resolve)
    }, {
      path: '/event-hub/modify/:pkey/:pname/:pid/:tid/:tkey',
      component: resolve => require(['./components/eventHub/pages/start'], resolve)
    }]
  }, {
    path: '/system',
    component: require('./components/system/index'),
    children: [{
      path: '/system/apply',
      component: require('./components/system/pages/apply')
    }, {
      path: '/system/apply/:id',
      component: require('./components/system/pages/apply')
    }, {
      path: '/system/applylist',
      component: require('./components/system/pages/applylist')
    }, {
      path: '/system/:step/:id/:name', // 服务器资源申请具体步骤操作
      component: require('./components/system/pages/step')
    }, {
      path: '/system/offlinelist',
      component: require('./components/system/pages/offlinelist')
    }, {
      path: '/system/onlinelist',
      component: require('./components/system/pages/onlinelist')
    }, {
      path: '/system/online/:pkey/:tkey/:id/:name', // 上线流程具体步骤操作
      // component: require('./components/storeManage/pages/step')
      component: require('./components/system/pages/onlinestep')
    }]
  }, {
    path: '/auth',
    component: require('./components/auth/index'),
    children: [{
      path: '/auth/users',
      component: resolve => require(['./components/auth/pages/users'], resolve)
    }, {
      path: '/auth/roles',
      component: resolve => require(['./components/auth/pages/roles'], resolve)
    }]
  }, {
    path: '/process-admin',
    component: require('./components/process/index'),
    children: [{
      path: '/process-admin/basics',
      component: resolve => require(['./components/process/pages/basics'], resolve)
    }, {
      path: '/process-admin/steps',
      component: resolve => require(['./components/process/pages/steps'], resolve)
    }]
  }, { // 流程设计 删
    path: '/custom',
    component: require('./components/custom/index'),
    children: [{
      path: '/custom',
      component: resolve => require(['./components/custom/pages/list'], resolve)
    }, {
      path: '/custom/new',
      component: resolve => require(['./components/custom/pages/bpmn'], resolve)
    }, {
      path: '/custom/bpmn/:pkey',
      component: resolve => require(['./components/custom/pages/bpmn'], resolve)
    }]
  }, {
    path: '/orders',
    component: require('./components/orders/index'),
    children: [{
      path: '',
      component: resolve => require(['./components/orders/pages/list'], resolve)
    }]
  }, {
    path: '/orders2',
    component: require('./components/orders2/index'),
    children: [{
      path: '/orders/queues/:id',
      component: resolve => require(['./components/orders2/pages/list'], resolve)
    }, {
      path: '/orders/queues/:id/edit',
      component: resolve => require(['./components/orders2/pages/edit'], resolve)
    }]
  }, { // 定义表单，提交给数据库存储，删
    path: '/forms',
    component: require('./components/forms/index'),
    children: [{
      path: '',
      component: resolve => require(['./components/forms/pages/list'], resolve)
    }, {
      path: '/forms/editor',
      component: resolve => require(['./components/forms/pages/editor'], resolve)
    }]
  }, {
    path: '/event-config/details',
    component: resolve => require(['./components/eventConfig/pages/details'], resolve)
    // children: [{
    //   path: '/event-config/details',
    //   components: EventConfPages.Details
    // }]
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
