<template>
  <div class="orders">
    <router-view></router-view>
  </div>
</template>

<script>
  import sidebarConf from './sidebar-conf'

  export default {
    mounted () {
      this.$store.dispatch('reload_sidebar', {
        sidebarConf
      })
    }
  }
</script>
