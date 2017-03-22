<style lang="less">
  @paddingTop: 80px;
  @paddingBottom: 50px;

  .process {
    height: calc(~"100vh - " (@paddingTop + @paddingBottom));
  }
</style>

<template>
  <div class="process">
    <router-view></router-view>
  </div>
</template>
