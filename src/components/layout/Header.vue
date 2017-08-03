<style lang="less">
  @import url("../../assets/css/variables");

  @headerHeight: 50px;

  .header {
    position: fixed;
    z-index: @floating;
    height: @headerHeight;
    -webkit-box-shadow: 0 1px 2px #b6b6b6;
    box-shadow: 0 1px 2px #b6b6b6;

    .logo {
      // font-size: 16px;
      .logo-img {
        height: 100%;

        img {
          // max-width: 100%;
          height: @headerHeight;
          padding: 9px 0;

          @media screen and (max-width: 450px) {
            padding: 0;
            height: auto;
            width: 72px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }

    .el-menu {
      background-color: @eoThemeColor;
      // padding: 0 10px;
    }

    .el-submenu,
    .el-menu-item {
      font-weight: bold;
    }

    .el-submenu {
      height: @headerHeight;
      line-height: @headerHeight;

      .el-submenu__title {
        height: @headerHeight;
        line-height: @headerHeight;
        color: #fff;

        &:hover {
          background-color: inherit;
        }
      }

      &__icon-arrow {
        color: #fff !important;
        vertical-align: initial;
      }

      & > .el-menu {
        top: @headerHeight;
        background-color: @eoThemeColor;
        border: none;

        i {
          width: 14px;
        }
      }

      .el-menu-item {
        background-color: @eoThemeColor;
        min-width: inherit;
      }
    }

    .el-menu-item {
      height: @headerHeight;
      line-height: @headerHeight;
      color: #fff;
      // border-bottom: none !important;

      @media screen and (max-width: 450px) {
        font-size: 12px;
        padding: 0 10px;
      }

      &:nth-child(2) {
        @media screen and (max-width: 450px) {
          margin-left: 58px;
        }
      }

      &.fr {
        @media screen and (max-width: 450px) {
          padding: 0 6px;
        }
      }

      &:hover {
        background-color: @eoThemeColor;
        // color: #e2f0ff;
        // opacity: .5;
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

    .screenfull {
      display: none;

      i {
        margin-right: 0;
      }
    }

    .menu-img {
      width: 20px;
      vertical-align: middle;
    }

    &:hover {
      .screenfull {
        display: list-item;
      }
    }
  }
  .link-block {
    display: block;
  }
</style>

<template>
  <header class="header fw">
    <el-menu default-active="1" mode="horizontal">
      <el-menu-item index="1" class="logo">
        <router-link to="/">
          <!-- <b>EasyOps</b> 运维管理系统 -->
          <div class="logo-img">
            <img src="../../assets/logo-lg.png" alt="">
          </div>
        </router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <router-link class="link-block" :to="{ path: '/home' }">运维服务目录</router-link>
      </el-menu-item>
      <!-- <el-menu-item index="3">
        <router-link class="link-block" :to="{ path: '/event-hub' }">事件管理</router-link>
      </el-menu-item> -->
      <el-submenu index="4">
        <template slot="title">工单管理</template>
        <!-- <el-menu-item index="4-1">
          <router-link class="link-block" :to="{ path: '/event-hub' }">事件管理</router-link>
        </el-menu-item> -->
        <el-menu-item index="4-2">
          <router-link class="link-block" :to="{ path: '/orders' }">流程管理</router-link>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="5" class="fr">
        <template slot="title">{{userName}}</template>
        <el-menu-item index="5-1">
          <a href=""><i class="el-icon-fa-user"></i> 我的账户</a>
        </el-menu-item>
        <el-menu-item index="5-2">
          <router-link class="link-block" :to="{ path: '/auth/users' }"><i class="el-icon-fa-users"></i> 账户管理</router-link>
        </el-menu-item>
        <el-menu-item index="5-3">
          <router-link class="link-block" :to="{ path: '/process-admin/basics' }"><i class="el-icon-fa-key"></i> 权限管理</router-link>
        </el-menu-item>
        <el-menu-item index="5-3">
          <a class="link-block" @click="logout"><i class="el-icon-fa-sign-out"></i> 退出</a>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="6" class="fr">
        <el-tooltip placement="bottom" content="返回 EasyOps 自动化运维平台">
          <a class="link-block" href="http://192.168.10.27/">
          <!-- <a class="link-block" href="http://preview.easyops.cn/"> -->
            <img src="../../assets/logo.png" alt="" class="menu-img">
          </a>
        </el-tooltip>
      </el-menu-item>
      <el-menu-item index="7" class="fr screenfull" @click="onScreenFull">
        <i class="el-icon-fa-arrows-alt"></i>
      </el-menu-item>
    </el-menu>
  </header>
</template>

<script>
  import Auth from '../../auth'
  import screenfull from 'screenfull'

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
        // this.$router.go(0)
      },

      onScreenFull () {
        if (!screenfull.enabled) {
          this.$message({
            message: '你的浏览器不支持全屏！',
            type: 'warning'
          })
          return false
        }
        screenfull.toggle()
      }
    }
  }
</script>
