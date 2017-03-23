<style lang="less" scoped>
  .conf-contain {
    .el-input {
      width: 100px;
      display: inline-block;
    }
    .el-row {
      margin-top: 4px;
    }
  }  
</style>

<template>
  <div class="conf-contain">
    <el-row v-for="(op, index) of confArr">
      <label>选项 :</label>
      <el-input v-model="confArr[index]" size="mini" placeholder="输入 label" />
      <el-button size="mini" icon="delete" type="primary" @click="opDelBtn(op)" />
    </el-row>
    <el-row>
      <el-button size="mini" icon="plus" type="primary" @click="opAddBtn" />
    </el-row>
  </div>
</template>

<script>
  export default {
    props: {
      confArr: Array
    },
    methods: {
      opDelBtn (op) {
        this.confArr.splice(this.confArr.indexOf(op), 1)
      },
      opAddBtn () {
        this.confArr.push('')
      }
    }
  }
</script>
