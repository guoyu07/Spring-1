<template>
  <div class="notfound">
    <h2 class="nf-title">404</h2>
    <div class="nf-detail">
      <p>你要找的页面不存在 :(</p>
        <p><router-link :to="{ path: '/' }"><i class="el-icon-fa-home fa-square-o icon-lg"></i></router-link></p>
    </div>
  </div>
</template>

<style lang="less" scoped>
  @import url("./../assets/css/variables.less");
  .notfound {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);

    .nf {
      &-title {
        font-size: 18em;
        font-weight: bold;
        font-family: monospace;
        margin: 0;
        color: darken(@primary, 16%);
        text-shadow: -1px 1px 0 #fff !important;
      }

      &-detail {
        font-size: 1.3em;
        color: @primary;
        text-align: center;
        font-family: sans-serif;

        p {
          margin: 12px;
        }

        a {
          color: darken(@primary, 10%);
          display: block;
          width: 32px;
          height: 32px;
          margin: 0 auto;
          border: 1px solid darken(@primary, 10%);
          border-radius: 100%;

          &:hover,
          &:focus {
            color: @primary;
          }

          i {
            vertical-align: middle;
          }
        }
      }
    }
  }
</style>
