<style lang="less">
  #content {
    /*width: 100%;*/
    height: 100%;
    padding-top: 80px;
    padding-left: 220px;
    padding-right: 20px;
    padding-bottom: 50px;
    /*overflow: auto;*/

    @media screen and (max-width: 450px) {
      padding-left: 10px;
      padding-right: 10px;
    }
  }

  .el-menu-item-group__title {
    font-size: 12px;
  }
</style>

<template>
  <div class="home">
    <header-warp></header-warp>
    <side-warp></side-warp>
    <div id="content">
      <router-view></router-view>
    </div>
    <footer-warp></footer-warp>
  </div>
</template>

<script>
  import HeaderWarp from './layout/Header'
  import SideWarp from './layout/SideBar'
  import FooterWarp from './layout/Footer'

  export default {
    data () {
      return {
      }
    },
    methods: {
    },
    components: {
      HeaderWarp,
      SideWarp,
      FooterWarp
    }
  }
</script>
