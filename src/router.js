import Vue from 'vue'
import VueRouter from 'vue-router'

import auth from './auth'
import socket from './socket'
import SidebarConf from './sidebar-conf'

import store from './store'

import NProgress from 'nprogress'

Vue.use(VueRouter)
const routes = [{
  path: '/login',
  component: require('./components/login')
}, {
  path: '/',
  component: require('./components/home'),
  redirect: { path: '/menu' },
  meta: {
    requiresAuth: true
  },
  children: [{
    path: '/menu',
    component: require('./components/dashboard/pages/menu'),
    meta: {
      sidebar: SidebarConf.Process
    }
  }, {
    path: '/dashboard',
    component: require('./components/dashboard/pages/dashboard'),
    meta: {
      sidebar: SidebarConf.Homepage
    }
  }, {
    path: '/messages',
    component: require('./components/messages/index'),
    meta: {
      sidebar: SidebarConf.Process
    },
    children: [{
      path: '',
      component: resolve => require(['./components/messages/pages/list'], resolve)
    }]
  }, {
    path: '/procedure',
    component: require('./components/procedure/index'),
    meta: {
      sidebar: SidebarConf.Process
    },
    children: [{
      path: 'start/:pkey/:pname',
      component: resolve => require(['./components/procedure/pages/start'], resolve)
    }, {
      path: 'modify/:pid/:tid/:name',
      component: resolve => require(['./components/procedure/pages/start'], resolve)
    }, {
      path: ':pid/:tid/:name',
      component: resolve => require(['./components/procedure/pages/step'], resolve)
    }, {
      path: '/procedure-info/:pid/:name',
      component: resolve => require(['./components/procedure/pages/stepInfo'], resolve)
    }]
  }, {
    path: '/guosen',
    component: require('./components/guosen/index'),
    meta: {
      sidebar: SidebarConf.Process
    },
    children: [{
      path: ':pid/:tid/:name',
      component: resolve => require(['./components/guosen/pages/step'], resolve)
    }, {
      path: '/guosen-info/:pid/:name',
      component: resolve => require(['./components/guosen/pages/stepInfo'], resolve)
    }]
  }, {
    path: '/event-hub',
    component: require('./components/eventHub/index'),
    meta: {
      sidebar: SidebarConf.Event
    },
    children: [{
      path: '',
      component: resolve => require(['./components/eventHub/pages/list'], resolve)
    }, {
      path: 'event/:tkey',
      component: resolve => require(['./components/eventHub/pages/event'], resolve)
    }, {
      path: 'start/:pkey/:pname',
      component: resolve => require(['./components/eventHub/pages/start'], resolve)
    }, {
      path: 'modify/:pkey/:pname/:pid/:tid/:tkey',
      component: resolve => require(['./components/eventHub/pages/start'], resolve)
    }]
  }, {
    path: '/system',
    component: require('./components/system/index'),
    meta: {
      sidebar: SidebarConf.Process
    },
    children: [{
      path: 'apply',
      component: require('./components/system/pages/apply')
    }, {
      path: 'apply/:id',
      component: require('./components/system/pages/apply')
    }, {
      path: 'onlinelist',
      component: require('./components/system/pages/onlinelist')
    }]
  }, {
    path: '/account',
    component: require('./components/account/index'),
    redirect: { path: '/account/basics' },
    meta: {
      sidebar: SidebarConf.Personal
    },
    children: [{
      path: 'password',
      component: require('./components/account/pages/password')
    }, {
      path: 'basics',
      component: require('./components/account/pages/basics')
    }]
  }, {
    path: '/auth',
    component: require('./components/auth/index'),
    meta: {
      sidebar: SidebarConf.Accounts
    },
    children: [{
      path: 'users',
      component: resolve => require(['./components/auth/pages/users'], resolve)
    }, {
      path: 'user-detail',
      component: resolve => require(['./components/auth/pages/userDetail'], resolve)
    }, {
      path: 'roles',
      component: resolve => require(['./components/auth/pages/roles'], resolve)
    }, {
      path: 'role-detail',
      component: resolve => require(['./components/auth/pages/roleDetail'], resolve)
    }, {
      path: 'basics',
      component: resolve => require(['./components/process/pages/basics'], resolve)
    }, {
      path: 'steps',
      component: resolve => require(['./components/process/pages/steps'], resolve)
    }]
  }, { // 流程设计 删
    path: '/custom',
    component: require('./components/custom/index'),
    meta: {
      sidebar: SidebarConf.Process
    },
    children: [{
      path: '',
      component: resolve => require(['./components/custom/pages/list'], resolve)
    }, {
      path: 'new',
      component: resolve => require(['./components/custom/pages/bpmn'], resolve)
    }, {
      path: 'bpmn/:pkey',
      component: resolve => require(['./components/custom/pages/bpmn'], resolve)
    }]
  }, {
    path: '/orders',
    component: require('./components/orders/index'),
    meta: {
      sidebar: SidebarConf.Process
    },
    // redirect: { path: '/orders/queues/filter_type_handle' },
    children: [{
      path: '',
      component: require('./components/orders/pages/placeholder')
    }, {
      path: 'queues/:id',
      component: resolve => require(['./components/orders/pages/list'], resolve)
    }, {
      path: 'queues/:id/edit',
      component: resolve => require(['./components/orders/pages/edit'], resolve),
      meta: {
        isEdit: true
      }
    }, {
      path: 'queues/custom/new',
      component: resolve => require(['./components/orders/pages/edit'], resolve),
      meta: {
        isEdit: false
      }
    }]
  }, {
    path: '/orders-export',
    component: require('./components/ordersExport/index'),
    meta: {
      sidebar: SidebarConf.Process
    },
    children: [{
      path: '/orders-export/print/:pkey',
      component: resolve => require(['./components/ordersExport/pages/print'], resolve)
    }]
  }, { // 定义表单，提交给数据库存储，删
    path: '/forms',
    component: require('./components/forms/index'),
    meta: {
      sidebar: SidebarConf.Process
    },
    children: [{
      path: '',
      component: resolve => require(['./components/forms/pages/list'], resolve)
    }, {
      path: 'editor',
      component: resolve => require(['./components/forms/pages/editor'], resolve)
    }]
  }, {
    path: '/event-config/details',
    meta: {
      sidebar: SidebarConf.Event
    },
    component: resolve => require(['./components/eventConfig/pages/details'], resolve)
  }, {
    path: '/statistics',
    component: require('./components/statistics/index'),
    meta: {
      sidebar: SidebarConf.Statistics
    },
    redirect: { path: '/statistics/process' },
    children: [{
      path: 'process',
      component: resolve => require(['./components/statistics/pages/process'], resolve)
    }, {
      path: 'user',
      component: resolve => require(['./components/statistics/pages/user'], resolve)
    }, {
      path: 'config',
      component: resolve => require(['./components/statistics/pages/config'], resolve)
    }]
  }]
}, {
  path: '*',
  component: resolve => require(['./components/NotFound'], resolve)
}]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  store.state.apiCache = {} // 每次跳转路由，清空原页面的 api 数据
  const requiresAuth = to.matched.some(m => m.meta.requiresAuth)
  auth.checkAuth() // 取 this.$store.state.userinfo
  if (requiresAuth) {  // 如果目的路由需要验证、而用户尚未验证时
    // 跳转至登录页
    if (!auth.authenticated) {
      next({path: '/login',
        query: { redirect: to.fullname }
      })
      console.log(requiresAuth)
    } else {
      next()
      socket.initSocket()
    }
  } else {
    next()
  }
  NProgress.done()
})

router.afterEach((to, from) => {
  NProgress.start()
  let sidebarMeta = to.matched.find(m => m.meta.sidebar).meta
  Object.assign(to.meta, sidebarMeta)
})

export default router
