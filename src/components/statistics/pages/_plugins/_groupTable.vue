<template>
  <el-table :data="statistics" :default-expand-all="true">
    <el-table-column type="expand">
      <template scope="props">
        <!-- <el-select v-model="selectedProcess" size="small" placeholder="选择流程…" class="margin-bottom" value-key="pname" @change="onSelectProcess">
          <el-option
            v-for="process in processList"
            :key="process.name"
            :label="process.pname"
            :value="process">
          </el-option>
        </el-select> -->
        <el-table :data="props.row.list" stripe border>
          <el-table-column
            label="环节名称"
            prop="tname"></el-table-column>
          <el-table-column
            label="执行次数"
            prop="num"></el-table-column>
          <el-table-column
            label="平均耗时"
            inline-template
            :context="_self">
            <span>{{ _translateTime(row.avg_duration) }}</span>
          </el-table-column>
          <el-table-column
            label="标准工时"
            inline-template
            :context="_self">
            <span>{{ _translateTime(row.s_avg_duration) }}</span>
          </el-table-column>
          <el-table-column
            label="总耗时"
            inline-template
            :context="_self">
            <span>{{ _translateTime(row.total_duration) }}</span>
          </el-table-column>
          <el-table-column
            label="合计标准工时"
            inline-template
            :context="_self">
            <span>{{ _translateTime(row.s_total_duration) }}</span>
          </el-table-column>
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
  import emitProcess from './../_mixins/_emitProcess'
  import translateTime from './../../../../mixins/translateTime'

  export default {
    mixins: [emitProcess, translateTime],

    props: {
      statistics: Array,
      processes: Array
    }
  }
</script>