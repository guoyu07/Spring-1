<style lang="less">
  @import url("../../assets/css/variables");

  .footer {
    background-color: #fff;
    width: 100%;
    height: @footerHeight;
    padding: 4px;
    text-align: center;
    position: fixed;
    left: 0;
    bottom: 0;
    font-size: 12px;
    border-top: 1px solid #e3e3e3;
    z-index: @flying;

    .copy {
      line-height: 2.4;
      a {
        color: inherit;
      }
    }
  }
</style>

<template>
  <footer class="footer">
    <el-row>
      <el-col :span="24">
        <section class="copy">
          <a target="_blank" href="https://www.easyops.cn/">&copy; 2017 EasyOps.</a>
        </section>
      </el-col>
    </el-row>
  </footer>
</template>