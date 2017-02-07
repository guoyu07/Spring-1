<template>
  <el-table :data="tableData">
    <el-table-column label="流程步骤">
      <template scope="scope">
        <el-icon name="time"></el-icon>
        <span style="margin-left: 10px">{{ scope.row.name }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template scope="scope">
        <el-button size="small">执行</el-button>
        <el-button size="small">修改</el-button>
        <el-button size="small" type="danger">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
	export default {
		data () {
      return {
        tableData: [{
          name: '流程步骤-1'
        }, {
          name: '流程步骤-2'
        }]
      }
    }
	}
</script>
