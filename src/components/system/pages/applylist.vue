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
      <el-table-column type="expand">
        <template scope="props">
          <div class="item-block" v-for="item in props.row.data">
            <p>主机: {{ item.host }}</p>
            <p>环境: {{ item.envirnment }}</p>
            <p>数量: {{ item.number }}</p>
            <p>OS: {{ item.operationSystem }}</p>
            <p>资源分数: {{ item.score }}</p>
          </div>
        </template>
      </el-table-column>
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
.item-block {
  display: inline-block;
  margin-right: 30px;
  padding-right: 20px;
  border-right: 1px dashed #e0e6ed;
  color: #5e6d82;

  &:last-child {
    border-right: none;
  }
}
</style>
