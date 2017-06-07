<style lang="less" scoped>
  @import url("./../../../assets/css/variables.less");
  .sub-title {
    margin-top: 0;

    i {
      width: 14px;
    }
  }

  .el-collapse-item__wrap {
    div {
      .el-row:not(:last-of-type) {
        .el-checkbox-group {
          border-bottom: 1px dashed @borderColor;
        }
      }
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
            title="在此处为流程指派各环节的候选人、候选组及受指派人。"
            type="info"
            show-icon
            style="margin-bottom: 12px"></el-alert>
          <el-table
            :data="permittedProcessList"
            border
            v-loading.body="permittedProcessLoading">
            <el-table-column type="expand">
              <template scope="scope">
                <h5 class="sub-title"><i class="el-icon-fa-flag-o"></i> 流程环节：</h5>
                <el-collapse accordion @change="onAccordionChange">
                  <el-collapse-item v-for="task in scope.row.tasks" :title="task.tname">
                    <el-row>
                      <el-col :span="20" :offset="2">
                        <div class="btn-area clear">
                          <h5 class="sub-title fl"><i class="el-icon-fa-user"></i> 候选人（{{task.candidate_users.length || '0'}}）</h5>
                          <el-button v-if="candidateData.isUserCheckable" class="fr cancel-btn" type="text" size="small" @click="candidateData.isUserCheckable = false">取消</el-button>
                          <el-tooltip content="移除候选人" placement="top" class="fr" v-if="task.candidate_users.length">
                            <el-button
                              icon="minus"
                              type="danger"
                              size="small"
                              :class="{ empty: !candidateData.isUserCheckable }"
                              @click="onRemoveCandidate(scope.row.pkey, task.tkey, 'user')">{{candidateData.isUserCheckable ? '移除所选' : ''}}</el-button>
                          </el-tooltip>
                          <el-tooltip content="加入候选人" placement="top" class="fr">
                            <el-button
                              icon="plus"
                              type="success"
                              size="small"
                              @click="Object.assign(candidateData, { visible: true, pkey: scope.row.pkey, tkey: task.tkey, type: 'user' }); currentTask = task">
                            </el-button>
                          </el-tooltip>
                        </div>
                        <el-checkbox-group v-model="candidateData.toRemove" :class="{ uncheckable: !candidateData.isUserCheckable }">
                          <el-checkbox v-for="user in task.candidate_users" :label="user.userId">{{user.code}}</el-checkbox>
                        </el-checkbox-group>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="20" :offset="2">
                        <div class="btn-area clear">
                          <h5 class="sub-title fl"><i class="el-icon-fa-users"></i> 候选组（{{task.candidate_groups.length || '0'}}）</h5>
                          <el-button v-if="candidateData.isGroupCheckable" class="fr cancel-btn" type="text" size="small" @click="candidateData.isGroupCheckable = false">取消</el-button>
                          <el-tooltip content="移除候选组" placement="top" class="fr" v-if="task.candidate_groups.length">
                            <el-button
                              icon="minus"
                              type="danger"
                              size="small"
                              :class="{ empty: !candidateData.isGroupCheckable }"
                              @click="onRemoveCandidate(scope.row.pkey, task.tkey, 'group')">{{candidateData.isGroupCheckable ? '移除所选' : ''}}</el-button>
                          </el-tooltip>
                          <el-tooltip content="加入候选组" placement="top" class="fr">
                            <el-button
                              icon="plus"
                              type="success"
                              size="small"
                              @click="Object.assign(candidateData, { visible: true, pkey: scope.row.pkey, tkey: task.tkey, type: 'group' }); currentTask = task">
                            </el-button>
                          </el-tooltip>
                        </div>
                        <el-checkbox-group v-model="candidateData.toRemove" :class="{ uncheckable: !candidateData.isGroupCheckable }">
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
                              :icon="task.assignee ? 'edit' : 'plus'"
                              type="success"
                              :plain="task.assignee ? true : false"
                              size="small"
                              @click="Object.assign(assigneeData, { visible: true, pkey: scope.row.pkey, tkey: task.tkey }); currentTask = task">
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

    <el-dialog :title="candidateData.type === 'user' ? '加入候选人' : '加入候选组（角色）'" v-model="candidateData.visible" @close="candidateData.toAdd = []">
      <h5 class="sub-title"><i class="el-icon-information"></i> 勾选欲加入为{{candidateData.type === 'user' ? '候选人' : '候选组'}}的{{candidateData.type === 'user' ? '用户' : '角色'}}：</h5>
      <el-select v-model="candidateData.toAdd" filterable multiple placeholder="可搜索" class="fw">
        <template v-if="candidateData.type === 'user'">
          <el-option
            v-for="user in userList"
            :key="user.userId"
            :label="`${user.code} - ${user.email}`"
            :value="user.userId"
            :disabled="currentTask.candidate_users.some(u => u.userId === user.userId)"></el-option>
        </template>
        <template v-if="candidateData.type === 'group'">
          <el-option
            v-for="role in roleList"
            :key="role.key"
            :label="role.name"
            :value="role.key"
            :disabled="currentTask.candidate_groups.some(r => r.key === role.key)"></el-option>
        </template>
      </el-select>
      <!-- <el-checkbox-group v-model="candidateData.toAdd">
        <el-checkbox v-if="candidateData.type === 'user'" v-for="user in userList" :label="user.userId">{{user.code}}</el-checkbox>
        <el-checkbox v-if="candidateData.type === 'group'" v-for="role in roleList" :label="role.key">{{role.name}}</el-checkbox>
      </el-checkbox-group> -->
      <span class="dialog-footer" slot="footer">
        <el-button @click="onAddCandidate(candidateData)" size="small" icon="check" type="success" :loading="candidateData.loading">确认加入</el-button>
      </span>
    </el-dialog>

    <el-dialog title="指定受指派人" v-model="assigneeData.visible">
      <h5 class="sub-title"><i class="el-icon-information"></i> 选中欲指定为受指派人的用户：</h5>
      <el-select v-model="assigneeData.assignee" filterable placeholder="可搜索" :disabled="assigneeData.initiator" class="fw">
        <el-option
          v-for="user in userList"
          :key="user.userId"
          :label="`${user.code} - ${user.email}`"
          :value="user.userId"
          :disabled="currentTask && currentTask.assignee && currentTask.assignee.userId === user.userId"></el-option>
      </el-select>
      <!-- <el-radio-group v-model="assigneeData.assignee">
        <el-radio v-for="user in userList" :label="user.userId" :disabled="assigneeData.initiator">{{user.code}}</el-radio>
      </el-radio-group> -->
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
  import getPermittedRoleList from './../../../mixins/getPermittedRoleList'
  import getPermittedUserList from './../../../mixins/getPermittedUserList'
  import getPermittedProcessList from './../../../mixins/getPermittedProcessList'

  export default {
    mixins: [getPermittedRoleList, getPermittedUserList, getPermittedProcessList],

    data () {
      return {
        currentTask: null,
        candidateData: {
          visible: false,
          loading: false,
          isUserCheckable: false,
          isGroupCheckable: false,
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
      this.getPermittedProcessList()
      this.getPermittedUserList()
      this.getPermittedRoleList()
    },

    methods: {
      onAccordionChange () {
        Object.assign(this.candidateData, { isUserCheckable: false, isGroupCheckable: false, toAdd: [], toRemove: [] })
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
            Object.assign(this.candidateData, { loading: false, visible: false, toAdd: [] })
            this.$message.success('加入成功！')
            this.getPermittedProcessList()
          }
        })
      },

      onRemoveCandidate (pkey, tkey, type) {
        let isCheckableKey = `is${type.charAt(0).toUpperCase() + type.slice(1)}Checkable`
        if (!this.candidateData[isCheckableKey]) {
          this.candidateData[isCheckableKey] = true
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
              Object.assign(this.candidateData, { toRemove: [], isUserCheckable: false, isGroupCheckable: false })
              this.$message.success('移除成功！')
              this.getPermittedProcessList()
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
            Object.assign(this.assigneeData, { visible: false, loading: false, assignee: '' })
            this.$message.success('操作成功！')
            this.getPermittedProcessList()
          }
        })
      },

      prepareRemoveAssignee (pkey, tkey, assignee) {
        this.$confirm(`此操作将移除已有的受指派人：${assignee}，是否继续？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Object.assign(this.assigneeData, { assignee: -1, pkey, tkey })
          this.onChangeAssignee(this.assigneeData)
        })
      }
    }
  }
</script>