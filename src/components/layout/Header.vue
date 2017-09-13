<style lang="less">
  @import url("../../assets/css/variables");

  .header {
    position: fixed;
    z-index: @flying;
    height: @headerHeight;
    background-color: @eoThemeColor;
    -webkit-box-shadow: 0 1px 2px #b6b6b6;
    box-shadow: 0 1px 2px #b6b6b6;

    .right {
      padding-right: 8px;
      .mine {
        width: 100px;
        .el-submenu__title {
          text-align: center;
        }
      }
    }

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

        &.badged {
          position: relative;

          &::after {
            content: '';
            width: 8px;
            height: 8px;
            border-radius: 50%;
            border: 1px solid #fff;
            background-color: @danger;
            position: absolute;
            right: -8px;
            top: 0;
          }
        }
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

  .message {

    &__list {
      padding: 0;
      margin: 0;
    }

    &__item {
      padding: 10px 18px;

      &:not(:last-of-type) {
        border-bottom: 1px @borderColor solid;
      }

      &:hover {
        background-color: @bgLighter;
        cursor: pointer;
      }

      &__title {
        font-size: 14px;
        color: @textColor;
        margin-bottom: 8px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      &__time {
        color: lighten(@textColor, 20%);
      }

      &__link {
        &:hover {
          text-decoration: none;
        }
      }

      &__more {
        color: @info;
        font-size: 13px;
      }
    }
  }
</style>

<template>
  <header class="header fw flex-box">
    <el-menu default-active="1" mode="horizontal">
      <el-menu-item index="1" class="logo">
        <router-link to="/menu">
          <!-- <b>EasyOps</b> 运维管理系统 -->
          <div class="logo-img">
            <img src="../../assets/logo-lg.png" alt="">
          </div>
        </router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <router-link class="link-block" :to="{ path: '/menu' }">运维服务目录</router-link>
      </el-menu-item>
      <!-- <el-menu-item v-if="$store.state.userinfo.org !== 'guoxin'" index="3">
        <router-link class="link-block" :to="{ path: '/event-hub' }">事件管理</router-link>
      </el-menu-item> -->
      <el-submenu index="4">
        <template slot="title">流程中心</template>
        <el-menu-item index="4-1">
          <router-link class="link-block" :to="{ path: '/orders/queues/filter_type_handle' }">流程中心</router-link>
        </el-menu-item>
        <el-menu-item index="4-2">
          <router-link class="link-block" :to="{ path: '/auth/basics' }">流程管理</router-link>
        </el-menu-item>
      </el-submenu>
      <!-- <el-menu-item index="3">
        <router-link class="link-block" :to="{ path: '/statistics' }">统计中心</router-link>
      </el-menu-item> -->
    </el-menu>
    <el-menu class="right" mode="horizontal">
      <el-menu-item index="8" class="screenfull" @click="onScreenFull">
        <i class="el-icon-fa-arrows-alt"></i>
      </el-menu-item>
      <el-menu-item index="7">
        <el-tooltip placement="bottom" content="返回 EasyOps 自动化运维平台">
          <a class="link-block" :href="$store.state.userinfo._easyops_url">
            <img src="../../assets/logo.png" alt="" class="menu-img">
          </a>
        </el-tooltip>
      </el-menu-item>
      <el-menu-item index="6" v-popover:message>
        <el-popover
          ref="message"
          placement="bottom"
          width="250"
          trigger="click"
          @show="getUnreadMessages">
          <ul class="message__list">
            <li class="message__item" v-for="message in messageList">
              <router-link class="message__item__link" :to="{ path: message.url }">
                <div class="message__item__title">{{message.title}}</div>
                <div class="message__item__time">{{message.ctime}}</div>
              </router-link>
            </li>
            <li class="message__item" v-show="!messageList.length">没有新未读消息</li>
            <li class="message__item">
              <router-link :to="{ path: '/messages' }" class="message__item__more">查看更多</router-link>
            </li>
          </ul>
        </el-popover>
        <i  :class="{ 'el-icon-fa-bell': true, badged: $store.state.socket.unread }"></i>
      </el-menu-item>
      <el-submenu class="mine" index="5">
        <template slot="title">{{userName}}</template>
        <el-menu-item index="5-1">
          <router-link class="link-block" :to="{ path: '/account' }"><i class="el-icon-fa-user"></i> 我的账户</router-link>
        </el-menu-item>
        <el-menu-item index="5-2">
          <router-link class="link-block" :to="{ path: '/auth/users' }"><i class="el-icon-fa-users"></i> 用户与权限</router-link>
        </el-menu-item>
        <el-menu-item index="5-3">
          <a class="link-block" @click="logout"><i class="el-icon-fa-sign-out"></i> 退出</a>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </header>
</template>

<script>
  import Auth from '../../auth'
  import screenfull from 'screenfull'

  export default {
    data () {
      return {
        userName: '',
        messageList: []
      }
    },

    created () {
      this.userName = this.$store.state.userinfo.nick
    },

    methods: {
      logout () {
        Auth.logout()
        // this.$router.go(0)
      },

      getUnreadMessages () {
        let postData = {
          action: 'message',
          method: 'GET',
          data: {
            read: false,
            page: 1,
            page_size: 5  // 获取头五条未读消息
          }
        }
        this.http.post('/base/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.messageList = res.data.data.list
            // this.$store.dispatch('socket_onread')
          }
        })
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
