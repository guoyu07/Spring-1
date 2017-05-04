<style scoped lang="less">
  @import url("../../assets/css/variables");
  .sibebar {
    position: fixed;
    top: 50px;
    left: 0;
    bottom: 36px;
    width: 200px;
    overflow-y: scroll;
    background-color: @eoSideBgColor;
    border-right: 1px solid @eoBorderColor;
    transition: transform .3s ease;
    z-index: @flying;

    @media screen and (max-width: 450px) {
      transform: translateX(-200px);
      box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
    }

    &.shown {
      transform: translateX(0);
    }

    .el-menu {
      background-color: @eoSideBgColor;
      padding-top: 50px;

      @media screen and (max-width: 450px) {
        padding-top: 0;
      }
    }

    .el-submenu,
    .el-menu-item {
      i {
        width: 14px;
        text-align: center;
        color: #0f7fee;
      }
    }

    .el-menu-item {
      height: 36px;
      line-height: 36px;
      padding-left: 32px !important;
      &:hover {
        background-color: transparent;
        color: @eoThemeTextColor;
      }
      &.is-active {
        background-color: #e2f0ff;
      }
    }
  }

  .sidebar-title {
    position: fixed;
    top: 50px;
    width: 199px;
    padding: 17px 25px;
    border-bottom: 1px solid @eoBorderColor;
    font-size: 18px;
    line-height: 25px;
    color: #167be0;
    background-color: @eoSideBgColor;
    z-index: @floating;

    @media screen and (max-width: 450px) {
      display: none;
    }
  }

  .toggle-btn {
    display: none;
    position: fixed;
    bottom: 42px;
    left: 10px;
    font-size: 24px;
    width: 32px;
    height: 32px;
    color: @themeColor;
    border: 1px solid @themeColor;
    border-radius: 4px;
    text-align: center;
    line-height: 1;
    z-index: @flying;
    background-color: #fff;

    i {
      line-height: 32px;
    }

    @media screen and (max-width: 450px) {
      display: block;
    }
  }
</style>
<template>
  <div>
    <aside class="sibebar">
      <el-menu mode="vertical" router="router">
        <div class="sidebar-title">IT 服务中心</div>
        <el-menu-item-group title="仓库管理">
          <!-- @click="$router.go(0)" -->
          <el-menu-item index="/storemanage/instock"><i class="el-icon-fa-sign-in"></i>入库</el-menu-item>
          <el-menu-item index="/storemanage/export_device"><i class="el-icon-fa-sign-out"></i>出库</el-menu-item>
          <el-menu-item index="/storemanage/alter_device"><i class="el-icon-fa-edit"></i>设备变更</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="设备上架">
          <el-menu-item index="/equipment/on"><i class="el-icon-fa-upload"></i>上架流程</el-menu-item>
          <!-- <el-menu-item index="/equipment/off"><i class="el-icon-fa-download"></i>下架流程</el-menu-item> -->
        </el-menu-item-group>
        <!-- <el-menu-item-group title="国信">
          <el-menu-item index="/guosen/on"><i class="el-icon-fa-upload"></i>上架流程</el-menu-item>
          <el-menu-item index="/equipment/off"><i class="el-icon-fa-download"></i>下架流程</el-menu-item>
        </el-menu-item-group> -->
        <el-menu-item-group title="系统上下线">
          <el-menu-item index="/system/apply"><i class="el-icon-fa-envelope-open-o"></i>服务器资源申请</el-menu-item>
          <el-menu-item index="/system/onlinelist"><i class="el-icon-star-on"></i>上线列表</el-menu-item>
          <!-- <el-menu-item index="/system/offlinelist"><i class="el-icon-star-off"></i>下线流程</el-menu-item> -->
        </el-menu-item-group>
        <!-- <el-menu-item-group title="防火墙">
          <el-menu-item index="/firewall/apply"><i class="el-icon-fa-fire"></i>防火墙开通申请</el-menu-item>
          <el-menu-item index="/firewall/approve"><i class="el-icon-fa-gavel"></i>开通审批</el-menu-item>
          <el-menu-item index="/firewall/result"><i class="el-icon-fa-list-alt"></i>审批结果</el-menu-item>
        </el-menu-item-group> -->

        <el-menu-item-group title="工单管理">
          <el-menu-item index="/orders"><i class="el-icon-fa-calendar-o"></i>工单管理</el-menu-item>
        </el-menu-item-group>

        <!-- <el-menu-item-group title="告警事件">
          <el-menu-item index="/alarm"><i class="el-icon-fa-bullhorn"></i>告警事件</el-menu-item>
        </el-menu-item-group> -->

        <el-menu-item-group title="权限自定义">
          <el-menu-item index="/auth/users"><i class="el-icon-fa-user"></i>用户管理</el-menu-item>
          <el-menu-item index="/auth/roles"><i class="el-icon-fa-users"></i>角色管理</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="流程自定义">
          <el-menu-item index="/custom"><i class="el-icon-fa-sitemap"></i>流程设计</el-menu-item>
          <el-menu-item index="/process-admin/basics"><i class="el-icon-fa-circle-o"></i>流程基本管理</el-menu-item>
          <el-menu-item index="/process-admin/steps"><i class="el-icon-fa-circle-o-notch"></i>流程环节管理</el-menu-item>
          <el-menu-item index="/forms"><i class="el-icon-fa-wpforms"></i>表单配置</el-menu-item>
        </el-menu-item-group>
      </el-menu>
    </aside>

    <div class="toggle-btn" @click="onToggleClick"><i class="el-icon-fa-bars"></i></div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        router: true
      }
    },

    methods: {
      onToggleClick () {
        let aside = document.getElementsByTagName('aside')[0]
        if (aside.classList.contains('shown')) {
          aside.classList.remove('shown')
        } else {
          aside.classList.add('shown')
        }
      }
    }
  }
</script>
