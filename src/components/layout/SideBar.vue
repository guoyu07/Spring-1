<style scoped lang="less">
  .sibebar {
    position: fixed;
    top: 60px;
    left: 0;
    bottom: 36px;
    width: 200px;
    overflow-y: scroll;
    background-color: #eff2f7;
  }
</style>

<template>
  <aside class="sibebar">
    <el-menu default-active="/part1" router="router" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" theme="light">

      <el-submenu index="/storemanage">
        <template slot="title">仓库管理</template>
        <el-menu-item index="/storemanage/instock"><i class="el-icon-fa-sign-in"></i>入库</el-menu-item>
        <el-menu-item index="/storemanage/outstock"><i class="el-icon-fa-sign-out"></i>出库</el-menu-item>
      </el-submenu>

      <el-submenu index="/equipment">
        <template slot="title">设备上下架</template>
        <el-menu-item index="/equipment/on"><i class="el-icon-fa-upload"></i>上架流程</el-menu-item>
        <el-menu-item index="/equipment/off"><i class="el-icon-fa-download"></i>下架流程</el-menu-item>
        <!-- <el-submenu index="1-4">
          <template slot="title">选项4</template>
          <el-menu-item index="1-4-1"><i class="el-icon-message"></i>选项1</el-menu-item>
        </el-submenu> -->
      </el-submenu>

      <el-submenu index="/system">
        <template slot="title">系统上下线</template>
        <el-menu-item index="/system/online"><i class="el-icon-star-on"></i>上线流程</el-menu-item>
        <el-menu-item index="/system/offline"><i class="el-icon-star-off"></i>下线流程</el-menu-item>
      </el-submenu>

      <el-submenu index="/publish">
        <template slot="title">应用发布更新</template>
        <el-menu-item index="/publish/application"><i class="el-icon-share"></i>应用发布</el-menu-item>
        <el-menu-item index="/publish/others"><i class="el-icon-more"></i>其他发布</el-menu-item>
      </el-submenu>

      <el-submenu index="/authority">
        <template slot="title">权限管理</template>
        <el-menu-item index="/authority/user"><i class="el-icon-setting"></i>用户管理</el-menu-item>
        <el-menu-item index="/authority/role"><i class="el-icon-menu"></i>角色管理</el-menu-item>
      </el-submenu>

      <el-submenu index="/others">
        <template slot="title">其他</template>
        <el-menu-item index="/others/worklist"><i class="el-icon-date"></i>工单管理</el-menu-item>
        <el-menu-item index="/others/manhour"><i class="el-icon-time"></i>标准工时统计</el-menu-item>
      </el-submenu>
      <el-menu-item index="/part1">创建流程表单（测试）</el-menu-item>
      <el-menu-item index="/part1/part13"><i class="el-icon-menu"></i>自订表单（客户端测试）</el-menu-item>

    </el-menu>
  </aside>
</template>

<script>
  export default {
    data () {
      return {
        router: true
      }
    },
    methods: {
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      }
    }
  }
</script>
