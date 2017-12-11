<template>
  <el-form label-width="80px">
    <el-form-item
      label="类型">{{ key }}</el-form-item>
    <el-form-item
      label="按钮名称">
      <el-input size="small" v-model="button.name"></el-input>
    </el-form-item>
    <el-form-item
      label="Action">
      <el-input size="small" v-model="button.action"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    props: {
      button: Object,
      name: String
    }
  }
</script>
