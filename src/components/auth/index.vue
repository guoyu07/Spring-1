<template>
  <div class="item">
    <!-- <h1>equiment</h1> -->
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