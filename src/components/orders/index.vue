<template>
  <div class="orders">
    <sidebar></sidebar>
    <router-view class="order-view"></router-view>
  </div>
</template>

<script>
  import sidebar from './pages/sidebar.vue'

  export default {
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
    padding: 20px;
    padding-left: 220px;
  }
</style>
