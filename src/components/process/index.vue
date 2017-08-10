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

<style lang="less">
  .cancel-btn {
    margin-left: 6px;
  }

  .el-button.empty {
    span {
      margin-left: 0;
    }
  }
</style>