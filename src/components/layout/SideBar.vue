<template>
  <div class="sibebar">
    <el-menu default-active="/part1" router="router" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" theme="dark">
      <el-menu-item index="/part0">导航一</el-menu-item>
      <el-submenu index="/part1">
        <template slot="title">导航二</template>
        <el-menu-item-group title="分组一">
          <el-menu-item index="/part1/part11"><i class="el-icon-message"></i>选项1</el-menu-item>
          <el-menu-item index="/part1/part12"><i class="el-icon-message"></i>选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="/part1/part14"><i class="el-icon-message"></i>选项3</el-menu-item>
        </el-menu-item-group>
        <!-- <el-submenu index="1-4" style="padding-left: 25px;">
          <template slot="title">选项4</template>
          <el-menu-item index="1-4-1"><i class="el-icon-message"></i>选项1</el-menu-item>
        </el-submenu> -->
      </el-submenu>
      <el-menu-item index="/part2">导航三</el-menu-item>
    </el-menu>
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
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      }
    }
  }
</script>
<style scoped>
  .sibebar {
    position: fixed;
    top: 80px;
    left: 0;
    width: 200px;
    height: 100%;
    overflow-y: auto;
    background-color: #324057;
  }
</style>