<template>
  <div>
    <el-card class="box-card">
      <h3><i class="el-icon-fa-calendar-o icon-lg"></i> {{filterData.name}}工单</h3>
      <el-button icon="edit" style="margin-bottom: 12px" v-show="filterData.can_edit">
        <router-link :to="{ path: `/orders/queues/${orderId}/edit` }">编辑列表</router-link>
      </el-button>
      <el-table
        :data="filteredTasks.list"
        v-loading="loading"
        border>
        <el-table-column
          v-for="col in filterData.show"
          :prop="col.key_path"
          :label="col.label"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import getFilteredTasks from './../../../mixins/getFilteredTasks'

  export default {
    mixins: [ getFilteredTasks ],

    watch: {
      '$route.params.id' (id) {
        this.getFilterData(id)
      }
    },

    mounted () {
      this.getFilterData(this.orderId)
    }
  }
</script>

<style lang="less" scoped>
  .el-button a {
    color: inherit;

    &:hover {
      text-decoration: none;
    }
  }
</style>
