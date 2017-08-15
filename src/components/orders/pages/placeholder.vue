<template>
  <div>
    <el-card class="placeholder-card">
      <i class="el-icon-fa-smile-o"></i>
      <h3>按照筛选器查看相应工单列表</h3>
    </el-card>
  </div>
</template>

<style lang="less">
  @import url("./../../../assets/css/variables.less");

  .placeholder-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: @textColor;

    i {
      display: block;
      text-align: center;
      transform: rotate(-90deg);
      color: @info;

      &::before {
        font-size: 54px;
      }
    }

    h3 {
      font-size: 18px;
      margin-top: 12px;
    }
  }
</style>