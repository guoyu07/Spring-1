<style lang="less" scoped>
  .tag-container {
    margin-bottom: 12px;

    h3 {
      float: left;
    }
  }
</style>

<template>
  <div class="list">
    <el-row>
      <el-col :md="24" :lg="20">
        <el-card class="box-card">
          <div class="tag-container clear">
            <h3><i class="el-icon-fa-bullhorn icon-lg"></i> {{filter}}告警</h3>
            <el-radio-group v-model="filter" @change="onFilterChange" size="small" class="fr">
              <el-radio-button v-for="(filter, key) in filters" :label="key"></el-radio-button>
            </el-radio-group>
          </div>
          <el-table
            :data="filteredList"
            v-loading.body="loadingFiltered"
            stripe
            border>
            <el-table-column
              v-if="filter !== '待指派'"
              label="工单号"
              prop="pid"></el-table-column>
            <el-table-column
              v-if="filter !== '待指派'"
              label="流程"
              prop="pname"></el-table-column>
            <el-table-column
              v-if="filter !== '待指派'"
              label="任务"
              prop="name"></el-table-column>
            <el-table-column
            <el-table-column
              v-if="filter !== '待指派'"
              prop="variables.author"
              label="创建者"></el-table-column>
            <el-table-column
              v-if="filter === '待处理'"
              prop="assignee"
              label="指派者"></el-table-column>
             <el-table-column
              v-if="filter === '待指派'"
              prop="name"
              label="任务名称">
            </el-table-column>
            <el-table-column
              v-if="filter === '待指派'"
              prop="id"
              label="任务 ID">
            </el-table-column>
            <el-table-column
              v-if="filter === '待指派'"
              prop="assignee"
              label="现被指派者">
            </el-table-column>
            <el-table-column
              label="创建时间">
              <template scope="scope">
                <small>{{scope.row.createTime | convertTime}}</small>
              </template>
            </el-table-column>
            <el-table-column
              label="操作">
              <template scope="scope">
                <el-button type="info" :plain="true" size="small" icon="more" @click="onHandle(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-block clear">
            <el-pagination
              class="fr"
              layout="prev, pager, next"
              :current-page="pagination.current"
              :page-size="pagination.pageSize"
              @current-change="onPageChange"
              :total="pagination.total">
            </el-pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <claim :claim-view-data="claimViewData"></claim>

    <assign :assign-view-data="assignViewData" :role-list="roleList" :user-list="userList"></assign>

    <el-dialog
      :title="handleViewData.task.pname"
      v-model="handleViewData.visible"
      size="large"
      :modal="true">
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form label-position="left" inline class="expanded-form">
            <el-form-item v-if="handleViewData.task.name" label="任务名称：">
              <span>{{handleViewData.task.name}}</span>
            </el-form-item>
            <el-form-item v-if="handleViewData.task.id" label="任务 ID：">
              <span>{{handleViewData.task.id}}</span>
            </el-form-item>
            <el-form-item v-if="handleViewData.task.variables" label="发起者：">
              <span>{{handleViewData.task.variables.author}}</span>
            </el-form-item>
            <el-form-item v-if="handleViewData.task.assignee" label="指派者：">
              <span>{{handleViewData.task.assignee}}</span>
            </el-form-item>
            <el-form-item v-if="handleViewData.task.claimTime" label="认领时间：">
              <small>{{handleViewData.task.claimTime | convertTime}}</small>
            </el-form-item>
            <el-form-item v-if="handleViewData.task.createTime" label="创建时间：">
              <small>{{handleViewData.task.createTime | convertTime}}</small>
            </el-form-item>
            <el-form-item v-if="handleViewData.task.startTime" label="起始时间：">
              <small>{{handleViewData.task.startTime | convertTime}}</small>
            </el-form-item>
            <el-form-item v-if="handleViewData.task.endTime" label="终止时间：">
              <small>{{handleViewData.task.endTime | convertTime}}</small>
            </el-form-item>
            <el-form-item v-if="handleViewData.task.priority" label="优先度：">
              <span>{{handleViewData.task.priority}}</span>
            </el-form-item>
          </el-form>
          <progress-wrap :progress="{
           task: handleViewData.task.taskDefinitionKey,
           pkey: handleViewData.task.pkey,
           taskList: handleViewData.task.task_list
           }"></progress-wrap>
          <h5 class="sub-title" v-if="handleViewData.task.variables && handleViewData.task.variables.message"><i class="el-icon-information"></i> 完整历史步骤（{{ handleViewData.task.variables.message.length }}）</h5>
          <el-collapse v-if="handleViewData.task.history_list">
            <el-collapse-item v-for="(task, key) in handleViewData.task.history_list" :title="(key + 1).toString() + '. ' + task.task_name">
              <el-form label-position="left" label-width="90px" inline class="expanded-form">
                <el-form-item v-if="task.task_key" label="任务 Key：">
                  <code>{{task.task_key}}</code>
                </el-form-item>
                <el-form-item v-if="task.operator" label="操作者：">
                  <span>{{task.operator.name}}</span>
                </el-form-item>
                <el-form-item v-if="task.time" label="时间：">
                  <span>{{task.time}}</span>
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
      <span class="dialog-footer" slot="footer">
        <router-link :to="{ path: `/storemanage/${handleViewData.task.pkey}/${handleViewData.task.taskDefinitionKey}/${handleViewData.task.id}/${handleViewData.task.name}`}" class="el-button el-button--plain el-button--small">处理</router-link>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import getPermittedUserList from './../../../mixins/getPermittedUserList'
  import getPermittedRoleList from './../../../mixins/getPermittedRoleList'
  import assign from './_assign.vue'
  import claim from './_claim.vue'
  import progressWrap from '../../_plugins/_progress'

  export default {
    mixins: [getPermittedUserList, getPermittedRoleList],

    data () {
      return {
        filter: '待认领',
        filters: {
          '待认领': 'runtime/tasks/assignee',
          '待指派': 'runtime/tasks/admin',
          '待处理': 'runtime/tasks/self'
        },
        loadingFiltered: false,
        filteredList: [],
        assignViewData: {
          visible: false,
          task: {}
        },
        claimViewData: {
          visible: false,
          task: {}
        },
        handleViewData: {
          visible: false,
          task: {}
        },
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        }
      }
    },

    computed: {
      isProcessAdmin () {
        return (window.localStorage.isProcessAdmin === 'true')
      }
    },

    created () {
      this.getTaskList()
      this.getPermittedUserList()
      this.getPermittedRoleList()
    },

    methods: {
      onFilterChange () {
        this.pagination.current = 1
        if (this.filter === '待指派' && !this.isProcessAdmin) {
          this.$message.error('你非流程管理员，无法指派！')
          this.filter === '待认领'
          return
        }
        this.getTaskList()
      },

      onPageChange (val) {
        this.pagination.current = val
        this.getFilteredList()
      },

      getTaskList () {
        let postData = {
          action: this.filters[this.filter],
          method: 'GET',
          data: { processDefinitionKey: 'easyops_monitor' }
        }
        this.loadingFiltered = true
        this.http.post('', this.parseData(postData)).then((res) => {
          this.filteredList = res.data.data.data
          this.pagination.total = res.data.data.total
          this.loadingFiltered = false
        })
      },

      onHandle (row) {
        if (this.filter === '待指派') {
          this.assignViewData = { visible: true, task: row }
        }
        if (this.filter === '待认领') {
          Object.assign(this.claimViewData, { visible: true, task: row })
        }
        if (this.filter === '待处理') {
          Object.assign(this.handleViewData, { visible: true, task: row })
          this.$prompt('处理手段', '请输入', {
            confirmButtonText: '完成',
            cancelButtonText: '取消'
          }).then(({ value }) => {
            this.$message({
              type: 'success',
              message: '你的处理手段是：' + value
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            })
          })
        }
      }
    },

    components: {
      assign,
      claim,
      progressWrap
    }
  }
</script>
