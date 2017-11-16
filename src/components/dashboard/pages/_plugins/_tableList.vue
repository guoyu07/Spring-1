<template>
  <div>
    <header>
      <h5 class="fl"><i class="el-icon-fa-calendar-o icon-lg"></i> {{orderType}}工单</h5>
      <router-link :to="`orders/queues/${table.filterData.filters}`" class="fr text-info">更多</router-link>
    </header>
    <el-table
      :data="table.list"
      class="dashboard-table"
      style="width: 100%"
      v-loading="table.loading">
      <el-table-column
        label="流程单号"
        prop="pinstance.pnum"></el-table-column>
      <el-table-column
        label="流程名称"
        prop="pinstance.pd.pname"></el-table-column>
      <el-table-column
        label="流程分类"
        prop="pinstance.pd.category"></el-table-column>
      <el-table-column
        label="任务认领时间"
        prop="assign_time"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    props: {
      table: Object
    },

    computed: {
      orderType () {
        return this.table.filterData.filters.indexOf('handle') > -1
          ? '待处理'
          : '待认领'
      }
    }
  }
</script>
