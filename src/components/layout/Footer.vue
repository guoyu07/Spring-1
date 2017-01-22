<style lang="less">
  @footerH: 36px;
  #footer {
    background-color: #fff;
    width: 100%;
    height: @footerH;
    padding: 4px;
    text-align: center;
    position: fixed;
    left: 0;
    bottom: 0;
    font-size: 12px;
    border-top: 1px solid #e3e3e3;

    .copy {
      line-height: 2.4;
      a {
        color: inherit;
      }
    }
  }
</style>

<template>
  <div id="footer">
    <el-row>
      <el-col :span="24">
        <div class="copy">
          EasyOps &copy; ICP xxxx  &#9990; <a href="tel:xxx">0755-xxxxxxxx</a>
        </div>
      </el-col>
    </el-row>
  </div>
</template>