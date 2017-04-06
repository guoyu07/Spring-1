<style lang="less">
  @import url("../../assets/css/variables");
  .header {
    position: fixed;
    z-index: @flying;
    height: 50px;
    -webkit-box-shadow: 0 1px 2px #b6b6b6;
    box-shadow: 0 1px 2px #b6b6b6;

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

    .el-menu {
      background-color: @eoThemeColor;
    }

    .el-menu-item {
      height: 50px;
      line-height: 50px;
      color: #fff;

      &:hover {
        background-color: @eoThemeColor;
        color: #e2f0ff;
        opacity: .5;
      }

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
    <el-menu default-active="1" mode="horizontal">
      <el-menu-item index="1" class="logo">
        <router-link to="/">
          <b>春秋航空</b>运维管理系统
        </router-link>
      </el-menu-item>
      <el-menu-item index="3" class="fr">
        <a @click="logout">退出</a>
      </el-menu-item>
      <el-menu-item index="2" class="fr disabled"><!--<i class="el-icon-fa-user-circle"></i>--><b>
        {{userName}}</b></el-menu-item>
    </el-menu>
  </header>
</template>

<script>
  import Auth from '../../auth'
  export default {
    data () {
      return {
        userName: ''
      }
    },

    created () {
      this.userName = window.localStorage.userName
    },

    methods: {
      logout () {
        Auth.logout()
      }
    }
  }
</script>
