<template>
  <el-table :data="statistics" :default-expand-all="true">
    <el-table-column type="expand">
      <template scope="props">
        <el-select v-model="selectedProcess" size="small" placeholder="选择流程…" class="margin-bottom" value-key="pname" @change="onSelectProcess">
          <el-option
            v-for="process in processList"
            :key="process.name"
            :label="process.pname"
            :value="process">
          </el-option>
        </el-select>
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
      label="用户名"
      prop="userName"></el-table-column>
    <el-table-column
      label="用户 ID"
      prop="userId"></el-table-column>
    <el-table-column
      label="所属群组"
      inline-template
      :context="_self">
      <el-tag
        v-for="group in row.groups"
        :key="group.key"
        type="primary">{{group.name}}</el-tag>
    </el-table-column>
  </el-table>
</template>

<script>
  import emitProcess from './../_mixins/_emitProcess'

  export default {
    mixins: [emitProcess],

    props: {
      statistics: Array,
      processes: Array
    }
  }
</script>