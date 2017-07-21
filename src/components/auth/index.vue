<template>
  <div class="item">
    <!-- <h1>equiment</h1> -->
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        sidebarConf: [{
          title: '用户管理',
          path: '/auth/users',
          icon: 'fa-user'
        }, {
          title: '角色管理',
          path: '/auth/roles',
          icon: 'fa-users'
        }]
      }
    },

    mounted () {
      this.$store.dispatch('reload_sidebar', {
        sidebarConf: this.sidebarConf
      })
      console.log(this.$store.state)
    }
  }
</script>