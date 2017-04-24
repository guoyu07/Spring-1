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
              v-if="filter !== '待指派'"
              label="流程"
              prop="pname"></el-table-column>
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
                <el-button type="info" :plain="true" size="small" icon="more" @click="onHandle(scope.row)">处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <claim :claim-view-data="claimViewData"></claim>

    <assign :assign-view-data="assignViewData" :role-list="roleList" :user-list="userList"></assign>
  </div>
</template>

<script>
  import getUserList from './../../../mixins/getUserList'
  import getRoleList from './../../../mixins/getRoleList'
  import assign from './_assign.vue'
  import claim from './_claim.vue'

  export default {
    mixins: [getUserList, getRoleList],

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
      this.getUserList()
      this.getRoleList()
    },

    methods: {
      onFilterChange () {
        if (this.filter === '待指派' && !this.isProcessAdmin) {
          this.$message.error('你非流程管理员，无法指派！')
          this.filter === '待认领'
          return
        }
        this.getTaskList()
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
      claim
    }
  }
</script>