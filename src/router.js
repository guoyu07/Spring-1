import Vue from 'vue'
import VueRouter from 'vue-router'

// import Home from './components/Home'
// import LogTime from './components/LogTime.vue'
// import TimeEntries from './components/TimeEntries.vue'
import NotFound from './components/NotFound.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/login',
  component: require('./components/login')
}, {
  path: '/',
  component: require('./components/home'),
  children: [
    {
      path: '/part0',
      component: require('./components/part0/index')
    }, {
      path: '/part1',
      component: require('./components/part1/index'),
      children: [
        {
          path: '/part1/part11',
          component: require('./components/part1/pages/part11.vue')
        }, {
          path: '/part1/part12',
          component: require('./components/part1/pages/part12.vue')
        }, {
          path: '/part1/part13',
          component: require('./components/part1/pages/part13.vue')
        }
      ]
    }, {
      path: '/part2',
      component: require('./components/part2/index')
    }
  ]
}, {
  path: '*',
  component: NotFound
}]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  console.log(from)
  console.log(next)
  next()
})

export default router
