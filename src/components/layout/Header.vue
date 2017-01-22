<template>
  <el-menu theme="dark" default-active="1" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item>春秋航空运维管理系统</el-menu-item>
    <el-menu-item class="fr">
      <router-link to="/login">退出</router-link>
    </el-menu-item>
  </el-menu>
</template>