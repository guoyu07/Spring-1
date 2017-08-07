<template>
  <div class="orders">
    <sidebar></sidebar>
    <router-view></router-view>
  </div>
</template>

<script>
  import sidebar from './pages/sidebar.vue'
  import sidebarConf from './sidebar-conf'

  export default {
    mounted () {
      this.$store.dispatch('reload_sidebar', {
        sidebarConf
      })
    },

    components: {
      sidebar
    }
  }
</script>

<style>
  .orders {
    position: relative;
  }
</style>