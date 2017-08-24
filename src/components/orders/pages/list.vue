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
        width="100%"
        stripe
        border>
        <el-table-column
          v-for="col in filterData.show"
          :prop="col.key_path"
          :label="col.label"></el-table-column>
        <el-table-column
          width="80"
          inline-template
          :context="_self"
          label="操作">
          <template>
            <el-button v-if="filterData.name === '已完成'" size="small" @click="onViewProcess(row)">详情</el-button>
            <el-button v-else size="small" @click="onViewTask(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="margin-top margin-bottom fr"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="currentSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="filteredTasks.total"></el-pagination>
    </el-card>
    <task-dialog v-if="taskViewData.visible" :task-view-data="taskViewData" :filter-name="filterData.name"></task-dialog>
    <process-dialog v-if="processViewData.visible" :process-view-data="processViewData"></process-dialog>
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
        this.currentPage = 1
      }
    },

    mounted () {
      this.getFilterData(this.orderId)
    },

    methods: {
      onViewTask (order) {
        Object.assign(this.taskViewData, { visible: true, order })
      },

      onViewProcess (order) {
        Object.assign(this.processViewData, { visible: true, order })
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
