<style lang="less" scoped>
  .mgb12 {
    margin-bottom: 12px;
  }
</style>

<template>
  <div>
    <!-- <h3><i class="el-icon-setting"></i> 待指派任务</h3> -->
    <el-alert
      title="你的帐号贵为「流程管理员」，可在此指派任务 :)"
      type="success"
      show-icon
      class="mgb12">
    </el-alert>
    <el-select v-model="selectedProcess" placeholder="请选择流程…" @change="getTaskList" class="mgb12">
      <el-option
        v-for="process in processList"
        :label="process.pname"
        :value="process.pkey">
      </el-option>
    </el-select>
    <small class="process-desc"><i class="el-icon-information"></i> 此处仅为你可管理的流程</small>
    <el-table
      :data="taskList"
      v-loading.body="processLoading"
      border>
      <!-- <el-table-column
        prop="pname"
        label="流程"
        width="100"
        :filters="processTagList"
        :filter-method="filterProcess">
        <template scope="scope">
          {{scope.row.pname}}
        </template>
      </el-table-column> -->
      <el-table-column
        prop="name"
        label="任务名称">
      </el-table-column>
      <el-table-column
        prop="id"
        label="任务 ID">
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template scope="scope">
          <small>{{scope.row.createTime | convertTime}}</small>
        </template>
      </el-table-column>
      <el-table-column
        prop="assignee"
        label="现被指派者">
      </el-table-column>
      <el-table-column
        label="操作">
        <template scope="scope">
          <el-button type="info" size="small" :plain="true" @click="taskViewData.visible = true; taskViewData.task = scope.row">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-block clear">
      <el-pagination
        class="fr"
        layout="prev, pager, next"
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
        @current-change="onPageChange"
        :total="pagination.total">
      </el-pagination>
    </div>

    <el-dialog
      :title="taskViewData.task.name"
      v-model="taskViewData.visible"
      @close="isAssignable = false"
      :modal="true">
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form label-position="left" inline class="expanded-form">
            <el-form-item v-if="taskViewData.task.pname" label="所属流程：">
              <span>{{taskViewData.task.pname}}</span>
            </el-form-item>
            <el-form-item v-if="taskViewData.task.name" label="任务名称：">
              <span>{{taskViewData.task.name}}</span>
            </el-form-item>
            <el-form-item v-if="taskViewData.task.id" label="任务 ID：">
              <span>{{taskViewData.task.id}}</span>
            </el-form-item>
            <el-form-item v-if="taskViewData.task.createTime" label="创建时间：">
              <span>{{taskViewData.task.createTime | convertTime}}</span>
            </el-form-item>
          </el-form>
          <h5 class="sub-title" v-if="taskViewData.task.variables && taskViewData.task.variables.message"><i class="el-icon-information"></i> 历史步骤（{{taskViewData.task.variables.message.length}}）</h5>
          <el-collapse v-if="taskViewData.task.variables">
            <el-collapse-item v-for="(task, key) in taskViewData.task.variables.message" :title="(key + 1).toString() + '. ' + task.task_name">
              此处数据未统一标准，暂不编写 :(
              <!-- <el-form label-position="left" inline>
                <el-form-item v-if="task.form.applyType" label="申请类型：">
                  <span>{{task.form.applyType}}</span>
                </el-form-item>
                <el-form-item v-if="task.form.applicationName" label="应用名称：">
                  <span>{{task.form.applicationName}}</span>
                </el-form-item>
                <el-form-item v-if="task.form.applicationName" label="业务系统：">
                  <span>{{task.form.business}}</span>
                </el-form-item>
                <el-form-item v-if="task.time" label="发起时间：">
                  <span>{{task.time}}</span>
                </el-form-item>
              </el-form> -->
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
      <span class="dialog-footer" slot="footer">
        <el-row v-if="isAssignable" style="text-align: left">
          <el-col :span="20" :offset="2">
            <h5 class="sub-title"><i class="el-icon-circle-check"></i> 请勾选欲指派的用户：</h5>
            <el-radio-group v-model="newAssignee">
              <el-radio v-for="user in userList" :label="user.userId" :disabled="taskViewData.task.assignee === user.userId">{{user.code}}</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-button v-if="!isAssignable" type="info" @click="isAssignable = true" icon="more">指派</el-button>
        <el-button v-if="isAssignable" type="success" @click="onAssign(taskViewData.task.id, newAssignee)" icon="check" :disabled="!newAssignee" :loading="taskViewData.loading">确认指派</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        processLoading: false,
        processList: [],
        processTagList: [],
        selectedProcess: '',
        taskList: [],
        taskViewData: {
          visible: false,
          loading: false,
          task: {}
        },
        pagination: {
          page: 1,
          pageSize: 10,
          total: 0
        },
        newAssignee: '',
        isAssignable: false
      }
    },

    created () {
      this.getProcessList()
      this.getTaskList()
      this.getUserList()
    },

    methods: {
      getUserList () {
        let postData = {
          action: 'permission/users',
          method: 'GET',
          data: {}
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.userList = res.data.data
            console.log(this.userList)
          }
        })
      },

      getProcessList () {
        this.processLoading = true
        let postData = {
          action: 'permission/process',
          method: 'GET',
          data: {}
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.processList = res.data.data
            this.processList.map(item => {
              this.processTagList.push({text: item.pname, value: item.pkey})
            })
            this.processLoading = false
          }
        })
      },

      getTaskList () {
        let data = {}
        if (this.selectedProcess) {
          data = {
            includeProcessVariables: 'true',
            processDefinitionKey: this.selectedProcess,
            page: this.pagination.page,
            pageSize: this.pagination.pageSize
          }
        } else {
          data = { includeProcessVariables: 'true' }
        }
        let postData = {
          action: 'runtime/tasks/admin',
          method: 'GET',
          data
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.taskList = res.data.data.data
            this.pagination.total = res.data.data.total
          }
        })
      },

      onPageChange (val) {
        this.pagination.page = val
        this.getTaskList()
      },

      onAssign (tid, assignee) {
        let postData = {
          action: 'runtime/task/assignee',
          method: 'POST',
          data: { tid, assignee }
        }
        this.taskViewData.loading = true
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.taskViewData.loading = true
            this.taskViewData.visible = false
            this.$message.success('指派成功！')
            this.isAssignable = false
            this.getTaskList()
          }
        })
      },

      filterProcess (value, row) {
        console.log(this.selectedProcess)
        this.getTaskList()
      }
    }
  }
</script>
