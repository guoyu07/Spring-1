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
          <el-button type="info" size="small" :plain="true" @click="assignViewData.visible = true; assignViewData.task = scope.row">详情</el-button>
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
      :title="assignViewData.task.name"
      v-model="assignViewData.visible"
      @close="isAssignable = false"
      :modal="true">
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form label-position="left" inline class="expanded-form">
            <el-form-item v-if="assignViewData.task.pname" label="所属流程：">
              <span>{{assignViewData.task.pname}}</span>
            </el-form-item>
            <el-form-item v-if="assignViewData.task.name" label="任务名称：">
              <span>{{assignViewData.task.name}}</span>
            </el-form-item>
            <el-form-item v-if="assignViewData.task.id" label="任务 ID：">
              <span>{{assignViewData.task.id}}</span>
            </el-form-item>
            <el-form-item v-if="assignViewData.task.createTime" label="创建时间：">
              <span>{{assignViewData.task.createTime | convertTime}}</span>
            </el-form-item>
          </el-form>
          <h5 class="sub-title" v-if="assignViewData.task.variables && assignViewData.task.variables.message"><i class="el-icon-information"></i> 历史步骤（{{assignViewData.task.variables.message.length}}）</h5>
          <el-collapse v-if="assignViewData.task.variables">
            <el-collapse-item v-for="(task, key) in assignViewData.task.variables.message" :title="(key + 1).toString() + '. ' + task.task_name">
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
            <h5 class="sub-title"><i class="el-icon-circle-check"></i> 请勾选欲指派的用户或候选组：</h5>
            <el-form label-width="60px" label-position="left">
              <el-form-item label="用户">
                <el-radio-group v-model="newAssignee">
                  <el-radio v-for="user in userList" :label="user.userId" :disabled="assignViewData.task.assignee === user.userId">{{user.code}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="候选组">
                <el-checkbox-group v-model="newAssigneeGroup">
                  <el-checkbox v-for="role in roleList" :label="role.key" :checked="assignViewData.task.candidate_groups.includes(role.key)">{{role.name}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-button v-if="!isAssignable" type="info" @click="isAssignable = true" icon="more">指派</el-button>
        <el-button v-if="isAssignable" type="success" @click="onAssign(assignViewData.task.id, newAssignee, newAssigneeGroup)" icon="check" :disabled="!newAssignee && !newAssigneeGroup.length" :loading="assignViewData.loading">确认指派</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import getPermittedUserList from './../../mixins/getPermittedUserList'
  import getPermittedRoleList from './../../mixins/getPermittedRoleList'
  import onAssign from './../../mixins/onAssign'

  export default {
    mixins: [getPermittedUserList, getPermittedRoleList, onAssign],

    data () {
      return {
        processLoading: false,
        processList: [],
        processTagList: [],
        selectedProcess: '',
        taskList: [],
        assignViewData: {
          visible: false,
          loading: false,
          task: {}
        },
        pagination: {
          page: 1,
          pageSize: 10,
          total: 0
        }
      }
    },

    created () {
      this.getProcessList()
      this.getTaskList()
      this.getPermittedUserList()
      this.getPermittedRoleList()
    },

    methods: {
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

      filterProcess (value, row) {
        console.log(this.selectedProcess)
        this.getTaskList()
      }
    }
  }
</script>
