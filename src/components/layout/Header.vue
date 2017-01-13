<template>
  <header class="header">
    <div class="container">
      <h1>
        <a href="/">春秋航空运维管理系统</a>
      </h1>
      <p class="user">
        {{ userName }}
        <router-link to="/login">退出</router-link>
      </p>
    </div>
  </header>
</template>
<style lang="less" scoped>
  .header {
    height: 80px;
    background-color: #20a0ff;
    color: #fff;
    top: 0;
    left: 0;
    width: 100%;
    line-height: 80px;
    z-index: 100;
    position: fixed;
    z-index: 100;

    .container {
      height: 100%;
      box-sizing: border-box;
      // width: 1140px;
      padding: 0 15px;
      // margin: 0 auto;
    }

    h1 {
      margin: 0;
      float: left;
      font-size: 28px;
      font-weight: 400;
      a {
        color: #fff;
        text-decoration: none;
        display: block;
      }
    }

    .user {
      float: right;
      margin: 0;
      a {
        text-decoration: none;
        color: #fff;
        display: block;
        line-height: 80px;
        padding: 0 10px;
      }
    }
  }
</style>