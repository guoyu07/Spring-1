<style lang="less">
  .option-btn {
    margin: 20px 0 6px;
  }
</style>

<template>
  <div class="list-content">
    <el-row class="option-btn">
      <el-button icon="plus" @click="newTaskBtn">新建</el-button>
    </el-row>
    <el-table :data="tableData">
      <el-table-column label="流程步骤">
        <template scope="scope">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small" icon="edit" @click="modifyBtn(scope.$index)">修改</el-button>
          <el-button size="small" icon="delete" type="danger" @click="delBtn(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [ { name: '流程步骤-1' }, { name: '流程步骤-2' } ]
    }
  },
  activated () {
    console.log('拉取数据')
  },
  methods: {
    newTaskBtn () {
      this.$router.push('/part1/editor')
    },
    modifyBtn (index) {
      // console.log(index)
      this.$router.push('/part1/editor')
    },
    delBtn (index) {
      this.tableData.splice(index, 1)
    }
  }
}
</script>
