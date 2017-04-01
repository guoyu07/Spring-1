<style lang="less">
  @import url("../../assets/css/variables");
  .header {
    position: fixed;
    z-index: @flying;

    .logo {
      font-size: 16px;
    }

    .disabled {
      &:hover {
        border-bottom: none;
        cursor: text;
      }

      &:focus,
      &:active,
      &.is-active {
        border-bottom: none;
        color: #bfcbd9;
      }
    }

    .el-menu-item {
      i {
        margin-right: 4px;
      }

      a {
        &:hover,
        &.is-active {
          text-decoration: none;
        }
      }
    }
  }
</style>

<template>
  <header class="header fw">
    <el-menu theme="dark" default-active="1" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1" class="logo">
        <router-link to="/">
          <b>春秋航空</b>运维管理系统
        </router-link>
      </el-menu-item>
      <el-menu-item index="3" class="fr">
        <a @click="logout">退出</a>
      </el-menu-item>
      <el-menu-item index="2" class="fr disabled"><!--<i class="el-icon-fa-user-circle"></i>--><b>
        {{userinfo.userName}}</b></el-menu-item>
    </el-menu>
  </header>
</template>

<script>
  import Auth from '../../auth'
  export default {
    data () {
      return {
        userinfo: {}
      }
    },
    created () {
      this.userinfo = window.localStorage
    },
    methods: {
      logout () {
        Auth.logout()
      }
    }
  }
</script>
