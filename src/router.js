import Vue from 'vue'
import VueRouter from 'vue-router'

import auth from './auth'

import NProgress from 'nprogress'

// import Home from './components/Home'
// import LogTime from './components/LogTime'
// import TimeEntries from './components/TimeEntries'
import NotFound from './components/NotFound'

// 懒加载的页面

const AuthPages = {
  User: resolve => require(['./components/auth/pages/users'], resolve),
  Role: resolve => require(['./components/auth/pages/roles'], resolve)
}

const ProcessPages = {
  Basics: resolve => require(['./components/process/pages/basics'], resolve),
  Steps: resolve => require(['./components/process/pages/steps'], resolve)
}

const CustomPages = {
  List: resolve => require(['./components/custom/pages/list'], resolve),
  Bpmn: resolve => require(['./components/custom/pages/bpmn'], resolve)
}

const OrderPages = {
  Orders: resolve => require(['./components/orders/orders'], resolve)
}

const FormPages = {
  List: resolve => require(['./components/forms/pages/list'], resolve),
  Editor: resolve => require(['./components/forms/pages/editor'], resolve)
}

const EventPages = {
  EventConf: resolve => require(['./components/eventConfig/index'], resolve)
}

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
    path: '/test',
    component: require('./components/test/index'),
    children: [{
      path: '/test/start',
      component: require('./components/test/pages/start')
    }, {
      path: '/test/:pkey/:tkey/:id/:name',
      component: require('./components/test/pages/step')
    }, {
      path: '/test-info/:pkey/:tkey/:id/:name',
      component: require('./components/test/pages/stepInfo')
    }, {
      path: '/test-info/:pkey/:id',
      component: require('./components/test/pages/stepInfo')
    }]
  }, {
    path: '/store-manage',
    component: require('./components/storemanage/index'),
    children: [{
      path: '/store-manage/instock',
      component: require('./components/storemanage/pages/instock')
    }, {
      path: '/store-manage/instock/:id',
      component: require('./components/storemanage/pages/instock')
    }, {
      path: '/store-manage/instock/edit/:taskid',
      component: require('./components/storemanage/pages/instock')
    }, {
      path: '/store-manage/outstock',
      component: require('./components/storemanage/pages/outstock')
    }, {
      path: '/store-manage/:pkey',
      component: require('./components/storemanage/pages/outstock')
    }, {
      path: '/store-manage/:pkey/:tkey/:id/:name',
      component: require('./components/storemanage/pages/step')
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
    path: '/deploy-app',
    component: require('./components/deployapp/index'),
    children: [{
      path: '/deploy-app/apps',
      component: require('./components/deployapp/pages/apps')
    }, {
      path: '/deploy-app/others',
      component: require('./components/deployapp/pages/others')
    }, {
      path: '/deploy-app/:pkey/:tkey/:id/:name',
      component: require('./components/deployapp/pages/step')
    }]
  }, {
    path: '/event-hub',
    component: require('./components/eventHub/index'),
    children: [{
      path: '',
      component: require('./components/eventHub/pages/list')
    }, {
      path: '/event-hub/event/:tkey',
      component: require('./components/eventHub/pages/event')
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
      component: AuthPages.User
    }, {
      path: '/auth/roles',
      component: AuthPages.Role
    }]
  }, {
    path: '/process-admin',
    component: require('./components/process/index'),
    children: [{
      path: '/process-admin/basics',
      component: ProcessPages.Basics
    }, {
      path: '/process-admin/steps',
      component: ProcessPages.Steps
    }]
  }, { // 流程设计 删
    path: '/custom',
    component: require('./components/custom/index'),
    children: [{
      path: '/custom',
      component: CustomPages.List
    }, {
      path: '/custom/new',
      component: CustomPages.Bpmn
    }, {
      path: '/custom/bpmn/:pkey',
      component: CustomPages.Bpmn
    }]
  }, {
    path: '/orders',
    component: OrderPages.Orders
  }, { // 定义表单，提交给数据库存储，删
    path: '/forms',
    component: require('./components/forms/index'),
    children: [{
      path: '',
      component: FormPages.List
    }, {
      path: '/forms/editor',
      component: FormPages.Editor
    }]
  }, {
    path: '/event-config',
    component: EventPages.EventConf
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
