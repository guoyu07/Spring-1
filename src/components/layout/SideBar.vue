<style scoped lang="less">
  @import url("../../assets/css/variables");
  .sibebar {
    position: fixed;
    top: 50px;
    left: 0;
    bottom: 36px;
    width: 200px;
    overflow-y: scroll;
    background-color: @eoSideBgColor;
    border-right: 1px solid @eoBorderColor;
    transition: transform .3s ease;
    z-index: @flying;

    @media screen and (max-width: 450px) {
      transform: translateX(-200px);
      box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
    }

    &.shown {
      transform: translateX(0);
    }

    .el-menu {
      background-color: @eoSideBgColor;
      padding-top: 60px;

      @media screen and (max-width: 450px) {
        padding-top: 0;
      }
    }

    .el-submenu,
    .el-menu-item {
      i {
        width: 14px;
        text-align: center;
        color: #0f7fee;
      }
    }

    .el-menu-item {
      height: 36px;
      line-height: 36px;
      padding-left: 32px !important;
      &:hover {
        background-color: transparent;
        color: @eoThemeTextColor;
      }
      &.is-active {
        background-color: #e2f0ff;
      }
    }
  }

  .sidebar-title {
      position: fixed;
      top: 50px;
      width: 199px;
      padding: 17px 25px;
      border-bottom: 1px solid @eoBorderColor;
      font-size: 18px;
      line-height: 25px;
      color: #167be0;
      background-color: @eoSideBgColor;
      z-index: @floating;

      @media screen and (max-width: 450px) {
        display: none;
      }
    }
</style>
<template>
  <div>
    <aside class="sibebar">
      <div class="sidebar-title">{{this.$store.state.sidebarConf.title}}</div>
      <el-menu mode="vertical" router="router" :default-active="$route.path">
        <el-menu-item v-for="item in this.$store.state.sidebarConf.routes" :key="item.path" :index="item.path" v-if="item.path"><i :class="`el-icon-${item.icon}`"></i>{{item.name}}</el-menu-item>
      </el-menu>
    </aside>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        router: true
      }
    }
  }
</script>
