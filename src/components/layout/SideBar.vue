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
    .el-menu {
      background-color: @eoSideBgColor;
      padding-top: 50px;
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
  }
</style>
<template>
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
      <el-menu-item-group title="国信">
        <el-menu-item index="/guosen/on"><i class="el-icon-fa-upload"></i>上架流程</el-menu-item>
        <!-- <el-menu-item index="/equipment/off"><i class="el-icon-fa-download"></i>下架流程</el-menu-item> -->
      </el-menu-item-group>
      <el-menu-item-group title="系统上下线">
        <el-menu-item index="/system/applylist"><i class="el-icon-fa-envelope-open-o"></i>服务器资源申请</el-menu-item>
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

      <el-menu-item-group title="告警事件">
        <el-menu-item index="/alarm"><i class="el-icon-fa-bullhorn"></i>告警事件</el-menu-item>
      </el-menu-item-group>

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
    <!-- <el-menu router="router" class="el-menu-vertical-demo" theme="light">
      <el-submenu index="/storemanage">
        <template slot="title"><i class="el-icon-fa-th"></i> 仓库管理</template>
        <el-menu-item index="/storemanage/instock" @click="$router.go(0)"><i class="el-icon-fa-sign-in"></i>入库</el-menu-item>
        <el-menu-item index="/storemanage/outstock"><i class="el-icon-fa-sign-out"></i>出库</el-menu-item>
        <el-menu-item index="/storemanage/outstock/edit"><i class="el-icon-fa-edit"></i>信息变更</el-menu-item>
      </el-submenu>
      <el-submenu index="/equipment">
        <template slot="title"><i class="el-icon-fa-cubes"></i> 设备上下架</template>
        <el-menu-item index="/equipment/on"><i class="el-icon-fa-upload"></i>上架流程</el-menu-item>
        <el-menu-item index="/equipment/off"><i class="el-icon-fa-download"></i>下架流程</el-menu-item> -->
        <!-- <el-menu-item index="/equipment/check"><i class="el-icon-fa-stethoscope"></i>审核上下架流程</el-menu-item> -->
        <!-- <el-submenu index="1-4">
          <template slot="title">选项4</template>
          <el-menu-item index="1-4-1"><i class="el-icon-message"></i>选项1</el-menu-item>
        </el-submenu> -->
      <!-- </el-submenu>
      <el-submenu index="/system">
        <template slot="title"><i class="el-icon-fa-server"></i> 系统上下线</template>
        <el-menu-item index="/system/applylist"><i class="el-icon-fa-envelope-open-o"></i>服务器资源申请</el-menu-item>
        <el-menu-item index="/system/onlinelist"><i class="el-icon-star-on"></i>上线列表</el-menu-item>
        <el-menu-item index="/system/offlinelist"><i class="el-icon-star-off"></i>下线流程</el-menu-item>
      </el-submenu>
      <el-submenu index="/publish">
        <template slot="title"><i class="el-icon-fa-tags"></i> 应用发布更新</template>
        <el-menu-item index="/publish/application"><i class="el-icon-share"></i>应用发布</el-menu-item>
        <el-menu-item index="/publish/others"><i class="el-icon-more"></i>其他发布</el-menu-item>
      </el-submenu>
      <el-menu-item index="/orders"><i class="el-icon-fa-calendar-o"></i> 工单管理</el-menu-item>
      <el-submenu index="/custom">
        <template slot="title"><i class="el-icon-fa-cogs"></i> 自定义平台</template>
        <el-menu-item-group>
          <template slot="title">权限自定义</template>
          <el-menu-item index="/auth/users"><i class="el-icon-fa-user"></i>用户管理</el-menu-item>
          <el-menu-item index="/auth/roles"><i class="el-icon-fa-users"></i>角色管理</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <template slot="title">流程自定义</template>
          <el-menu-item index="/custom"><i class="el-icon-fa-sitemap"></i>BPMN 配置</el-menu-item>
          <el-menu-item index="/process-admin/basics"><i class="el-icon-fa-circle-o"></i>流程基本管理</el-menu-item>
          <el-menu-item index="/process-admin/steps"><i class="el-icon-fa-circle-o-notch"></i>流程环节管理</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <template slot="title">表单自定义</template>
          <el-menu-item index="/forms"><i class="el-icon-fa-wpforms"></i>表单配置</el-menu-item>
        </el-menu-item-group>
      </el-submenu> -->
      <!-- <el-submenu index="/auth">
        <template slot="title">权限管理</template>
        <el-menu-item index="/auth/users"><i class="el-icon-setting"></i>用户管理</el-menu-item>
        <el-menu-item index="/auth/roles"><i class="el-icon-menu"></i>角色管理</el-menu-item>
      </el-submenu>
      <el-submenu index="/process-admin">
        <template slot="title">流程管理</template>
        <el-menu-item index="/process-admin/basics"><i class="el-icon-fa-circle-o"></i>基本管理</el-menu-item>
        <el-menu-item index="/process-admin/steps"><i class="el-icon-fa-circle-o-notch"></i>环节管理</el-menu-item>
      </el-submenu>
      <el-menu-item index="/orders"><i class="el-icon-date"></i>工单管理</el-menu-item>
      <el-menu-item index="/hours"><i class="el-icon-time"></i>标准工时统计（暂无）</el-menu-item>
      <el-menu-item index="/custom"><i class="el-icon-fa-sitemap"></i>流程自定义</el-menu-item>
      <el-menu-item index="/forms"><i class="el-icon-fa-wpforms"></i>表单自定义</el-menu-item>
      <el-menu-item index="/select-form">选择流程表单（测试）</el-menu-item> -->
    <!-- </el-menu> -->
  </aside>
</template>
<script>
  export default {
    data () {
      return {
        router: true
      }
    }
  }
</script>
