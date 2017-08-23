<template>
  <div class="process">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

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