<style lang="less" scoped>
  .sub-title {
    margin-top: 0;

    i {
      width: 14px;
    }
  }
</style>

<template>
  <div class="steps">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3><i class="el-icon-fa-circle-o-notch icon-lg"></i> 流程环节管理</h3>
          <el-alert
            title="在此处为流程指派各环节的候选人、候选组及指派人。"
            type="info"
            show-icon
            style="margin-bottom: 12px"></el-alert>
          <el-table
            :data="processList"
            border
            v-loading.body="processLoading">
            <el-table-column type="expand">
              <template scope="scope">
                <h5 class="sub-title"><i class="el-icon-fa-flag-o"></i> 流程环节：</h5>
                <el-collapse accordion @change="onAccordionChange">
                  <el-collapse-item v-for="task in scope.row.tasks" :title="task.tname">
                    <el-row>
                      <el-col :span="20" :offset="2">
                        <div class="btn-area clear">
                          <h5 class="sub-title fl"><i class="el-icon-fa-user"></i> 候选人（{{task.candidate_users.length || '0'}}）</h5>
                          <el-button v-if="candidateData.isCheckable" class="fr cancel-btn" type="text" size="small" @click="candidateData.isCheckable = false">取消</el-button>
                          <el-tooltip content="移除候选人" placement="top" class="fr" v-if="task.candidate_users.length">
                            <el-button
                              icon="minus"
                              type="danger"
                              size="small"
                              :class="{ empty: !candidateData.isCheckable }"
                              @click="onRemoveCandidate(scope.row.pkey, task.tkey, 'user')">{{candidateData.isCheckable ? '移除所选' : ''}}</el-button>
                          </el-tooltip>
                          <el-tooltip content="加入候选人" placement="top" class="fr">
                            <el-button
                              icon="plus"
                              type="success"
                              size="small"
                              @click="candidateData = Object.assign({}, candidateData, { visible: true, pkey: scope.row.pkey, tkey: task.tkey, type: 'user' })">
                            </el-button>
                          </el-tooltip>
                        </div>
                        <el-checkbox-group v-model="candidateData.toRemove" :class="{ uncheckable: !candidateData.isCheckable }">
                          <el-checkbox v-for="user in task.candidate_users" :label="user.userId">{{user.code}}</el-checkbox>
                        </el-checkbox-group>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="20" :offset="2">
                        <div class="btn-area clear">
                          <h5 class="sub-title fl"><i class="el-icon-fa-users"></i> 候选组（{{task.candidate_groups.length || '0'}}）</h5>
                          <el-button v-if="candidateData.isCheckable" class="fr cancel-btn" type="text" size="small" @click="candidateData.isCheckable = false">取消</el-button>
                          <el-tooltip content="移除候选组" placement="top" class="fr" v-if="task.candidate_groups.length">
                            <el-button
                              icon="minus"
                              type="danger"
                              size="small"
                              :class="{ empty: !candidateData.isCheckable }"
                              @click="onRemoveCandidate(scope.row.pkey, task.tkey, 'group')">{{candidateData.isCheckable ? '移除所选' : ''}}</el-button>
                          </el-tooltip>
                          <el-tooltip content="加入候选组" placement="top" class="fr">
                            <el-button
                              icon="plus"
                              type="success"
                              size="small"
                              @click="candidateData = Object.assign({}, candidateData, { visible: true, pkey: scope.row.pkey, tkey: task.tkey, type: 'group' })">
                            </el-button>
                          </el-tooltip>
                        </div>
                        <el-checkbox-group v-model="candidateData.toRemove" :class="{ uncheckable: !candidateData.isCheckable }">
                          <el-checkbox v-for="group in task.candidate_groups" :label="group.key">{{group.name}}</el-checkbox>
                        </el-checkbox-group>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="20" :offset="2">
                        <div class="btn-area clear">
                          <h5 class="sub-title fl"><i class="el-icon-fa-user-secret"></i> 受指派人：<span style="color: #1f2d3d; font-size: 14px; font-weight: normal;">{{task.assignee ? task.assignee.code : '无'}}</span></h5>
                          <el-tooltip content="移除受指派人" placement="top" class="fr" v-if="task.assignee !== null">
                            <el-button
                              icon="minus"
                              type="danger"
                              size="small"
                              class="empty"
                              @click="prepareRemoveAssignee(scope.row.pkey, task.tkey, task.assignee.code)">
                            </el-button>
                          </el-tooltip>
                          <el-tooltip content="指定受指派人" placement="top" class="fr">
                            <el-button
                              icon="plus"
                              type="success"
                              size="small"
                              @click="assigneeData = Object.assign({}, assigneeData, { visible: true, pkey: scope.row.pkey, tkey: task.tkey })">
                            </el-button>
                          </el-tooltip>
                        </div>
                      </el-col>
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
              </template>
            </el-table-column>
            <el-table-column
              prop="pname"
              label="可管理的流程"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog :title="candidateData.type === 'user' ? '加入候选人' : '加入候选组（角色）'" size="tiny" v-model="candidateData.visible">
      <h5 class="sub-title"><i class="el-icon-information"></i> 勾选欲加入为{{candidateData.type === 'user' ? '候选人' : '候选组'}}的{{candidateData.type === 'user' ? '用户' : '角色'}}：</h5>
      <el-checkbox-group v-model="candidateData.toAdd">
        <el-checkbox v-if="candidateData.type === 'user'" v-for="user in userList" :label="user.userId">{{user.code}}</el-checkbox>
        <el-checkbox v-if="candidateData.type === 'group'" v-for="role in roleList" :label="role.key">{{role.name}}</el-checkbox>
      </el-checkbox-group>
      <span class="dialog-footer" slot="footer">
        <el-button @click="onAddCandidate(candidateData)" size="small" icon="check" type="success" :loading="candidateData.loading">确认加入</el-button>
      </span>
    </el-dialog>

    <el-dialog title="指定受指派人" size="tiny" v-model="assigneeData.visible">
      <h5 class="sub-title"><i class="el-icon-information"></i> 选中欲指定为受指派人的用户：</h5>
      <el-radio-group v-model="assigneeData.assignee">
        <el-radio v-for="user in userList" :label="user.userId" :disabled="assigneeData.initiator">{{user.code}}</el-radio>
      </el-radio-group>
      <b class="sub-title" style="display: block; margin: 12px 0 6px;">或：</b>
      <el-checkbox-group v-model="assigneeData.initiator">
        <el-checkbox label="申请人">指派给申请人</el-checkbox>
      </el-checkbox-group>
      <span class="dialog-footer" slot="footer">
        <el-button @click="onChangeAssignee(assigneeData)" size="small" icon="check" type="success" :loading="assigneeData.loading">确定</el-button>
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
        userList: [],
        roleList: [],
        candidateData: {
          visible: false,
          loading: false,
          isCheckable: false,
          type: '', // user || group
          pkey: '',
          tkey: '',
          toAdd: [],
          toRemove: []
        },
        assigneeData: {
          visible: false,
          loading: false,
          isCheckable: false,
          pkey: '',
          tkey: '',
          assignee: '',
          initiator: false,
          action: ''
        }
      }
    },

    created () {
      this.getProcessList()
      this.getUserList()
      this.getRoleList()
    },

    methods: {
      onAccordionChange () {
        this.candidateData = Object.assign({}, this.candidateData, { isCheckable: false, toAdd: [], toRemove: [] })
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
            this.processLoading = false
          }
        })
      },

      getUserList () {
        let postData = {
          action: 'permission/users',
          method: 'GET',
          data: {}
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.userList = res.data.data
          }
        })
      },

      getRoleList () {
        let postData = {
          action: 'permission/role',
          method: 'GET',
          data: {}
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.roleList = res.data.data
          }
        })
      },

      onAddCandidate ({ pkey, tkey, type = '' }) {
        let data
        let { toAdd } = this.candidateData
        type === 'user' ? data = { pkey, tkey, users: toAdd } : data = { pkey, tkey, groups: toAdd }
        let postData = {
          action: 'permission/process/task/role/users',
          method: 'POST',
          data
        }
        this.candidateData.loading = true
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.candidateData = Object.assign({}, this.candidateData, { loading: false, visible: false, toAdd: [] })
            this.$message.success('加入成功！')
            this.getProcessList()
          }
        })
      },

      onRemoveCandidate (pkey, tkey, type) {
        if (!this.candidateData.isCheckable) {
          this.candidateData.isCheckable = true
          return
        }

        let typeCode
        type === 'user' ? typeCode = '候选人' : typeCode = '候选组'

        if (!this.candidateData.toRemove.length) {
          this.$message.warning(`请选择${typeCode}！`)
          return
        }

        this.$confirm(`此操作将移除所选的${typeCode}，是否继续？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data
          let { toRemove } = this.candidateData
          type === 'user' ? data = { pkey, tkey, users: toRemove } : data = { pkey, tkey, groups: toRemove }
          let postData = {
            action: 'permission/process/task/role/users',
            method: 'DELETE',
            data
          }
          this.http.post('', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              this.candidateData = Object.assign({}, this.candidateData, { toRemove: [], isCheckable: false })
              this.$message.success('移除成功！')
              this.getProcessList()
            }
          })
        })
      },

      onChangeAssignee ({ pkey, tkey, assignee, initiator }) {
        if (initiator) assignee = '申请人'
        let postData = {
          action: 'permission/process/task/role/users',
          method: 'POST',
          data: { pkey, tkey, assign: assignee }
        }
        this.assigneeData.loading = true
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.assigneeData = Object.assign({}, this.assigneeData, { visible: false, loading: false, assignee: '' })
            this.$message.success('操作成功！')
            this.getProcessList()
          }
        })
      },

      prepareRemoveAssignee (pkey, tkey, assignee) {
        this.$confirm(`此操作将移除已有的受指派人：${assignee}，是否继续？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.assigneeData = Object.assign({}, this.assigneeData, { assignee: -1, pkey, tkey })
          this.onChangeAssignee(this.assigneeData)
        })
      }
    }
  }
</script>