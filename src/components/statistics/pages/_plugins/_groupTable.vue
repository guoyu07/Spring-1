<template>
  <el-table :data="statistics">
    <el-table-column type="expand">
      <template scope="props">
        <el-table :data="props.row.list" stripe border>
          <el-table-column
            label="环节名称"
            prop="tname"></el-table-column>
          <el-table-column
            label="执行次数"
            prop="num"></el-table-column>
          <el-table-column
            label="平均耗时"
            prop="avg_duration"></el-table-column>
        </el-table>
      </template>
    </el-table-column>
    <el-table-column
      label="群组名"
      prop="groupName"></el-table-column>
    <el-table-column
      label="所含用户"
      inline-template
      :context="_self">
      <el-tag
        v-for="user in row.users"
        :key="user.userId"
        type="primary">{{user.nick}}</el-tag>
    </el-table-column>
    <el-table-column
      label="标签"
      inline-template
      :context="_self">
      <el-tag
        v-for="tag in row.tags"
        :key="tag"
        type="success">{{tag}}</el-tag>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    props: {
      statistics: Array
    }
  }
</script>