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
        <el-table-column
          inline-template
          width="80"
          fixed="right"
          :context="_self"
          label="操作">
          <template>
            <el-button size="small" @click="onView(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <task-dialog v-if="taskViewData.visible" :task-view-data="taskViewData" :filter-name="filterData.name"></task-dialog>
    <process-dialog v-if="processViewData.visible" :process-view-data="processViewData" :filter-name="filterData.name"></process-dialog>
  </div>
</template>

<script>
  import taskDialog from './_plugins/_taskDialog'
  import processDialog from './_plugins/_processDialog'

  import getFilteredTasks from './../../../mixins/getFilteredTasks'

  export default {
    mixins: [ getFilteredTasks ],

    data () {
      return {
        taskViewData: {
          visible: false,
          order: {}
        },
        processViewData: {
          visible: false,
          order: {}
        }
      }
    },

    watch: {
      '$route.params.id' (id) {
        this.getFilterData(id)
      }
    },

    mounted () {
      this.getFilterData(this.orderId)
    },

    methods: {
      onView (order) {
        this.filterData.name === '已完成' ? Object.assign(this.processViewData, { visible: true, order }) : Object.assign(this.taskViewData, { visible: true, order })
      }
    },

    components: {
      taskDialog,
      processDialog
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
