<template>
  <div class="notfound">
    <div class="nf">
      <h1 class="nf-title">404</h1>
      <div class="nf-detail">
        <p>你要找的页面不存在！</p>
        <p>你可以尝试 <router-link :to="{ path: '/' }">回到主页</router-link> 重新导航。</p>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  @import url("./../assets/css/variables.less");
  .notfound {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Tahoma;

    .nf {
      width: 100%;
      position: relative;
      text-align: center;
      color: @themeColor;

      &-title {
        margin: 0;
        font-size: 18rem;
        font-weight: bold;
      }

      &-detail {
        font-size: 1.3rem;
        position: absolute;
        top: 45%;
        left: 0;
        margin-top: -52px;
        background-color: #fff;
        box-shadow: 0 0 6px #fff;
        width: 100%;

        p {
          margin: 8px;
        }

        a {
          color: darken(@themeColor, 10%);

          &:hover,
          &:focus {
            color: @themeColor;
          }
        }
      }
    }
  }
</style>
