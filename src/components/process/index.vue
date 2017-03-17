<style lang="less" scoped>
  @import url("./../../assets/css/variables.less");
  .sub-title {
    margin-top: 0;

    i {
      width: 14px;
    }
  }

  .el-collapse-item__wrap {
    div {
      .el-row:not(:last-of-type) {
        .el-checkbox-group {
          border-bottom: 1px dashed @borderColor;
        }
      }
    }
  }
</style>

<template>
  <div class="process">
    <router-view></router-view>
  </div>
</template>
