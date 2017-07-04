<template>
  <el-dialog
    title="工单筛选器配置"
    v-model="filterConfData.visible">
    
  </el-dialog>
</template>

<script>
  export default {
    props: {
      filterConfData: Object
    }
  }
</script>