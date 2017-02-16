<template>
  <div id="item1-side" class="wrapper">
    <h3>系统上线列表</h3>
    <el-table
      :data="applylist"
      border
      style="width: 100%; min-width: 460px">
     <!--  <el-table-column
        type="selection"
        width="55">
      </el-table-column> -->
      <el-table-column
        prop="applicationName"
        label="应用名"></el-table-column>
      <el-table-column
        prop="applyType"
        label="申请类型"></el-table-column>
      <el-table-column
        prop="project"
        label="项目组"></el-table-column>
      <el-table-column
        prop="envirnment"
        label="使用环境"></el-table-column>
      <el-table-column
        prop="number"
        label="数量"></el-table-column>
      <el-table-column
        prop="operationSystem"
        label="OS"></el-table-column>
      <el-table-column
        prop="host"
        label="主机"></el-table-column>
      <!-- <el-table-column
        prop="project"
        label="CPU核数"></el-table-column>
      <el-table-column
        prop="project"
        label="内存(G)"></el-table-column>
      <el-table-column
        prop="project"
        label="硬盘(G)"></el-table-column> -->
      <el-table-column
        prop="score"
        label="资产分数"></el-table-column>
      <el-table-column
        inline-template
        :context="_self"
        label="操作">
        <div class="btn-block">
          <el-button type="text" href="###" @click="onDeploy(row)">详情</el-button>
          <el-button type="text" href="###" @click="onDeploy(row)">资源分配</el-button>
          <el-button type="text" href="###" @click="onDeploy(row)">审批</el-button>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        applylist: []
      }
    },
    created () {
      this.onloadlist()
    },
    methods: {
      onloadlist () {
        this.$http.get('/applylist').then((res) => {
          this.applylist = res.body
        })
      },
      removeItem (item) {
        var index = this.applyForm.data.indexOf(item)
        if (index !== -1) {
          this.applyForm.data.splice(index, 1)
        }
      }
    }
  }
</script>
<style lang="less" scoped>
.btn-block {
  .el-button {
    margin-right: 10px;
    margin-left: 0;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
