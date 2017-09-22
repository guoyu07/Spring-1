<template>
  <div class="order-list">
    <el-card class="box-card" v-if="filteredTasks.list && filteredTasks.list.length">
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
          :key="col.key_path"
          inline-template
          :context="_self"
          :label="col.label">
          <template>
            <span v-if="row.columns.find(c => c.key_path === col.key_path) && Array.isArray(row.columns.find(c => c.key_path === col.key_path).value)">
              {{row.columns.find(c => c.key_path === col.key_path).value.join('、')}}
            </span>
            <span v-else>{{row.columns.find(c => c.key_path === col.key_path) ? row.columns.find(c => c.key_path === col.key_path).value : ''}}</span>
          </template>
        </el-table-column>
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
    <div v-else class="placeholder-card">
      <i class="el-icon-fa-coffee"></i>
      <h3>你的队列为空，可以喝杯咖啡去！</h3>
    </div>
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

    mounted () {
      this.getFilterData(this.orderId)
    },

    methods: {
      getFilterData (id) {
        let postData = {
          action: 'filter',
          method: 'GET',
          data: { id }
        }
        this.http.post('/flow/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.filterData = res.data.data
            this.getFilteredTasks()
            this.$nextTick(() => {
              this.resetMessageState()
            })
          }
        })
      },

      onViewTask (order) {
        Object.assign(this.taskViewData, { visible: true, order })
      },

      onViewProcess (order) {
        Object.assign(this.processViewData, { visible: true, order })
      },

      resetMessageState () {
        switch (this.filterData.name) {
          case '待处理':
            if (this.$store.state.socket.newTask) {
              this.$store.dispatch('socket_onnew')
            }
            break
          case '待认领':
            if (this.$store.state.socket.newAssigned) {
              this.$store.dispatch('socket_onassigned')
            }
            break
          default: break
        }
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
