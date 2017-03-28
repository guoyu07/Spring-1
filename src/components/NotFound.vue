<template>
  <div class="notfound">
    <h2 class="nf-title">404</h2>
    <div class="nf-detail">
      <p>你要找的页面不存在 :(</p>
        <p>你可以尝试 <router-link :to="{ path: '/' }">回到主页</router-link> 重新导航。</p>
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
      }

      &-detail {
        font-size: 1.3em;
        color: @primary;
        text-align: center;
        font-family: sans-serif;

        p {
          margin: 8px;
        }

        a {
          color: darken(@primary, 10%);
          text-decoration: underline;

          &:hover,
          &:focus {
            color: @primary;
          }
        }
      }
    }
  }
</style>
