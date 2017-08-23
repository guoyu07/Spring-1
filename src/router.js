import Vue from 'vue'
import VueRouter from 'vue-router'

import auth from './auth'
import SidebarConf from './sidebar-conf'

import NProgress from 'nprogress'

Vue.use(VueRouter)

const routes = [{
  path: '/login',
  component: require('./components/login')
}, {
  path: '/',
  component: require('./components/home'),
  redirect: { path: '/dashboard' },
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
    path: '/procedure',
    component: require('./components/procedure/index'),
    meta: {
      sidebar: SidebarConf.Process
    },
    children: [{
      path: '/procedure/start/:pkey/:pname',
      component: require('./components/procedure/pages/start')
    }, {
      path: '/procedure/modify/:pid/:tid/:name',
      component: require('./components/procedure/pages/start')
    }, {
      path: '/procedure/:pid/:tid/:name',
      component: require('./components/procedure/pages/step')
    }, {
      path: '/procedure-info/:pid/:name',
      component: require('./components/procedure/pages/stepInfo')
    }]
  }, {
    path: '/guosen',
    component: require('./components/guosen/index'),
    meta: {
      sidebar: SidebarConf.Process
    },
    children: [{
      path: '/guosen/on',
      component: require('./components/guosen/pages/on')
    }, {
      path: '/guosen/:pid/:tid/:name',
      component: require('./components/guosen/pages/step')
    }, {
      path: '/guosen-info/:pid/:name',
      component: require('./components/guosen/pages/stepInfo')
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
    meta: {
      sidebar: SidebarConf.Process
    },
    children: [{
      path: '/system/apply',
      component: require('./components/system/pages/apply')
    }, {
      path: '/system/apply/:id',
      component: require('./components/system/pages/apply')
    }, {
      path: '/system/applylist',
      component: require('./components/system/pages/applylist')
    }]
  }, {
    path: '/auth',
    component: require('./components/auth/index'),
    meta: {
      sidebar: SidebarConf.Accounts
    },
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
    meta: {
      sidebar: SidebarConf.Auth
    },
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
    meta: {
      sidebar: SidebarConf.Process
    },
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
    meta: {
      sidebar: SidebarConf.Process
    },
    children: [{
      path: '',
      component: require('./components/orders/pages/placeholder')
    }, {
      path: '/orders/queues/:id',
      component: resolve => require(['./components/orders/pages/list'], resolve)
    }, {
      path: '/orders/queues/:id/edit',
      component: resolve => require(['./components/orders/pages/edit'], resolve),
      meta: {
        isEdit: true
      }
    }, {
      path: '/orders/queues/custom/new',
      component: resolve => require(['./components/orders/pages/edit'], resolve),
      meta: {
        isEdit: false
      }
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
      path: '/forms/editor',
      component: resolve => require(['./components/forms/pages/editor'], resolve)
    }]
  }, {
    path: '/event-config/details',
    meta: {
      sidebar: SidebarConf.Event
    },
    component: resolve => require(['./components/eventConfig/pages/details'], resolve)
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
  const requiresAuth = to.matched.some(m => m.meta.requiresAuth)
  auth.checkAuth() // 取 this.$store.state.userinfo
  if (requiresAuth && !auth.authenticated) {  // 如果目的路由需要验证、而用户尚未验证时
    // 跳转至登录页
    next('/login')
  } else {
    next()
  }
  NProgress.done()
})

router.afterEach((to, from) => {
  NProgress.start()
  // console.log(to)
  Object.assign(to.meta, to.matched.find(m => m.meta.sidebar).meta)
})

export default router
