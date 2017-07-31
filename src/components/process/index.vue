<template>
  <div class="process">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
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
