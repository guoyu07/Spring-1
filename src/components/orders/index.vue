<template>
  <div class="orders">
    <sidebar></sidebar>
    <router-view class="order-view"></router-view>
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

<style lang="less">
  @import url("./../../assets/css/variables.less");
  .orders {
    position: relative;
  }

  .order-view {
    padding-left: 200px;
  }
</style>