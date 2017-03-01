<style lang="less" scoped>
  .conf-contain {
    .el-input {
      width: 180px;
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
      <el-input v-model="confArr[index]" size="mini" placeholder="输入选项label" />
      <el-button size="mini" icon="delete" type="primary" @click="opDelBtn(index)" />
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
      opDelBtn (index) {
        this.confArr.splice(index, 1)
      },
      opAddBtn () {
        this.confArr.push('')
      }
    }
  }
</script>