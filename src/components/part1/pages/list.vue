<template>
  <div class="list-content">
    <el-button @click="newTaskBtn">新建</el-button>
    <el-table :data="tableData">
      <el-table-column label="流程步骤">
        <template scope="scope">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small" @click="modifyBtn(scope.$index)">修改</el-button>
          <el-button size="small" type="danger" @click="delBtn(scope.$index)">删除</el-button>
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
