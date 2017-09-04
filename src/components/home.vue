<style lang="less">
  #content {
    /*width: 100%;*/
    height: 100%;
    padding-top: 50px;
    padding-left: 200px;
    padding-right: 0;
    padding-bottom: 30px;
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
  import SideWarp from './layout/SideBar2'
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
