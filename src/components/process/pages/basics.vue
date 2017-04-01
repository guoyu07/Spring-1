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
  <div class="processes">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3><i class="el-icon-fa-circle-o icon-lg"></i> 流程基本管理</h3>
          <el-alert
            title="在此处为流程指派管理员用户／用户组、启动候选人／候选组。"
            type="info"
            show-icon
            style="margin-bottom: 12px"></el-alert>
          <el-table
            :data="permittedProcessList"
            border
            v-loading.body="permittedProcessLoading"
            @expand="adminData.isCheckable = false">
            <el-table-column type="expand">
              <template scope="scope">
                <h5 class="sub-title"><i class="el-icon-fa-flag-o"></i> 特权类型：</h5>
                <el-collapse accordion @change="onAccordionChange">
                  <el-collapse-item title="特权用户">
                    <el-row>
                      <el-col :span="20" :offset="2">
                        <div class="btn-area clear">
                          <h5 class="sub-title fl"><i class="el-icon-fa-user"></i> 管理员用户（{{scope.row.admin_users.length || '0'}}）</h5>
                          <el-button v-if="adminData.isCheckable" class="fr cancel-btn" type="text" size="small" @click="adminData.isCheckable = false">取消</el-button>
                          <el-tooltip content="移除管理员用户" placement="top" class="fr" v-if="scope.row.admin_users.length">
                            <el-button
                              icon="minus"
                              type="danger"
                              size="small"
                              :class="{ empty: !adminData.isCheckable }"
                              @click="onRemove(scope.row.pkey, { adminType: 'user', operationType: 'admin' })">{{adminData.isCheckable ? '移除所选' : ''}}</el-button>
                          </el-tooltip>
                          <el-tooltip content="加入管理员用户" placement="top" class="fr">
                            <el-button
                              icon="plus"
                              type="success"
                              size="small"
                              @click="Object.assign(adminData, { visible: true, pkey: scope.row.pkey, alreadyThere: scope.row.admin_users, type: 'user' })">
                            </el-button>
                          </el-tooltip>
                        </div>
                        <el-checkbox-group v-model="adminData.toRemove" :class="{ uncheckable: !adminData.isCheckable }">
                          <el-checkbox v-for="user in scope.row.admin_users" :label="user.userId">{{user.code}}</el-checkbox>
                        </el-checkbox-group>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="20" :offset="2">
                        <div class="btn-area clear">
                          <h5 class="sub-title fl"><i class="el-icon-fa-user"></i> 启动候选人用户（{{scope.row.start_users.length || '0'}}）</h5>
                          <el-button v-if="initiatorData.isCheckable" class="fr cancel-btn" type="text" size="small" @click="initiatorData.isCheckable = false">取消</el-button>
                          <el-tooltip content="移除启动候选人用户" placement="top" class="fr" v-if="scope.row.start_users.length">
                            <el-button
                              icon="minus"
                              type="danger"
                              size="small"
                              :class="{ empty: !initiatorData.isCheckable }"
                              @click="onRemove(scope.row.pkey, { initiatorType: 'user', operationType: 'initiator' })">{{initiatorData.isCheckable ? '移除所选' : ''}}</el-button>
                          </el-tooltip>
                          <el-tooltip content="加入启动候选人用户" placement="top" class="fr">
                            <el-button
                              icon="plus"
                              type="success"
                              size="small"
                              @click="Object.assign(initiatorData, { visible: true, pkey: scope.row.pkey, alreadyThere: scope.row.start_users, type: 'user' })">
                            </el-button>
                          </el-tooltip>
                        </div>
                        <el-checkbox-group v-model="initiatorData.toRemove" :class="{ uncheckable: !initiatorData.isCheckable }">
                          <el-checkbox v-for="user in scope.row.start_users" :label="user.userId">{{user.code}}</el-checkbox>
                        </el-checkbox-group>
                      </el-col>
                    </el-row>
                  </el-collapse-item>

                  <el-collapse-item title="特权用户组（角色）">
                    <el-row>
                      <el-col :span="20" :offset="2">
                        <div class="btn-area clear">
                          <h5 class="sub-title fl"><i class="el-icon-fa-users"></i> 管理员用户组（角色）（{{scope.row.admin_groups.length || '0'}}）</h5>
                          <el-button v-if="adminData.isCheckable" class="fr cancel-btn" type="text" size="small" @click="adminData.isCheckable = false">取消</el-button>
                          <el-tooltip content="移除管理员用户组（角色）" placement="top" class="fr" v-if="scope.row.admin_groups.length">
                            <el-button
                              icon="minus"
                              type="danger"
                              size="small"
                              :class="{ empty: !adminData.isCheckable }"
                              @click="onRemove(scope.row.pkey, { adminType: 'group', operationType: 'admin' })">{{adminData.isCheckable ? '移除所选' : ''}}</el-button>
                          </el-tooltip>
                          <el-tooltip content="加入管理员用户组（角色）" placement="top" class="fr">
                            <el-button
                              icon="plus"
                              type="success"
                              size="small"
                              @click="Object.assign(adminData, { visible: true, pkey: scope.row.pkey, alreadyThere: scope.row.admin_groups, type: 'group' })">
                            </el-button>
                          </el-tooltip>
                        </div>
                        <el-checkbox-group v-model="adminData.toRemove" :class="{ uncheckable: !adminData.isCheckable }">
                          <el-checkbox v-for="group in scope.row.admin_groups" :label="group.key">{{group.name}}</el-checkbox>
                        </el-checkbox-group>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="20" :offset="2">
                        <div class="btn-area clear">
                          <h5 class="sub-title fl"><i class="el-icon-fa-users"></i> 启动候选组（角色）（{{scope.row.start_groups.length || '0'}}）</h5>
                          <el-button v-if="initiatorData.isCheckable" class="fr cancel-btn" type="text" size="small" @click="initiatorData.isCheckable = false">取消</el-button>
                          <el-tooltip content="移除启动候选组（角色）" placement="top" class="fr" v-if="scope.row.start_groups.length">
                            <el-button
                              icon="minus"
                              type="danger"
                              size="small"
                              :class="{ empty: !initiatorData.isCheckable }"
                              @click="onRemove(scope.row.pkey, { initiatorType: 'group', operationType: 'initiator' })">{{initiatorData.isCheckable ? '移除所选' : ''}}</el-button>
                          </el-tooltip>
                          <el-tooltip content="加入启动候选组（角色）" placement="top" class="fr">
                            <el-button
                              icon="plus"
                              type="success"
                              size="small"
                              @click="Object.assign(initiatorData, { visible: true, pkey: scope.row.pkey, alreadyThere: scope.row.start_groups, type: 'group' })">
                            </el-button>
                          </el-tooltip>
                        </div>
                        <el-checkbox-group v-model="initiatorData.toRemove" :class="{ uncheckable: !initiatorData.isCheckable }">
                          <el-checkbox v-for="group in scope.row.start_groups" :label="group.key">{{group.name}}</el-checkbox>
                        </el-checkbox-group>
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

    <el-dialog :title="adminData.type === 'user' ? '加入管理员用户' : '加入管理员用户组（角色）'" size="tiny" v-model="adminData.visible">
      <h5 class="sub-title"><i class="el-icon-information"></i> 勾选欲加入为管理员的{{adminData.type === 'user' ? '用户' : '用户组（角色）'}}：</h5>
      <el-checkbox-group v-model="adminData.toAdd">
        <el-checkbox v-if="adminData.type === 'user'" v-for="user in userList" :label="user.userId">{{user.code}}</el-checkbox>
        <el-checkbox v-if="adminData.type === 'group'" v-for="role in roleList" :label="role.key">{{role.name}}</el-checkbox>
      </el-checkbox-group>
      <span class="dialog-footer" slot="footer">
        <el-button @click="onAdd(adminData.pkey, { adminType: adminData.type, operationType: 'admin' })" size="small" icon="check" type="success" :loading="adminData.loading">确认加入</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="initiatorData.type === 'user' ? '加入启动候选人用户' : '加入启动候选组（角色）'" size="tiny" v-model="initiatorData.visible">
      <h5 class="sub-title"><i class="el-icon-information"></i> 勾选欲加入为{{initiatorData.type === 'user' ? '启动候选人的用户' : '启动候选组的角色'}}：</h5>
      <el-checkbox-group v-model="initiatorData.toAdd">
        <el-checkbox v-if="initiatorData.type === 'user'" v-for="user in userList" :label="user.userId">{{user.code}}</el-checkbox>
        <el-checkbox v-if="initiatorData.type === 'group'" v-for="role in roleList" :label="role.key">{{role.name}}</el-checkbox>
      </el-checkbox-group>
      <span class="dialog-footer" slot="footer">
        <el-button @click="onAdd(initiatorData.pkey, { initiatorType: initiatorData.type, operationType: 'initiator' })" size="small" icon="check" type="success" :loading="initiatorData.loading">确认加入</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import getRoleList from './../../../mixins/getRoleList'
  import getUserList from './../../../mixins/getUserList'
  import getPermittedProcessList from './../../../mixins/getPermittedProcessList'

  export default {
    mixins: [getRoleList, getUserList, getPermittedProcessList],

    data () {
      return {
        adminData: {
          loading: false,
          visible: false,
          isCheckable: false,
          action: 'permission/process/admin/role/users',
          type: '', // 是操作用户还是用户组
          pkey: '', // 要增删管理员的流程
          toAdd: [],  // 待加入的管理员
          toRemove: []  // 待移除的管理员
        },
        initiatorData: {
          loading: false,
          visible: false,
          isCheckable: false,
          action: 'permission/process/start/role/users',
          type: '',
          pkey: '',
          toAdd: [],
          toRemove: []
        }
      }
    },

    created () {
      this.getPermittedProcessList()
      this.getUserList()
      this.getRoleList()
    },

    methods: {
      onAccordionChange () {
        // 伸缩手风琴时，取消勾选状态，并清空待加入和待移除队列
        Object.assign(this.adminData, { isCheckable: false, toAdd: [], toRemove: [] })
        Object.assign(this.initiatorData, { isCheckable: false, toAdd: [], toRemove: [] })
      },

      onAdd (pkey, { adminType = '', initiatorType = '', operationType = '' }) {
        const _operationRelations = {
          'admin': this.adminData,
          'initiator': this.initiatorData
        }

        _operationRelations[operationType].loading = true
        let data
        let { toAdd } = _operationRelations[operationType]
        adminType === 'user' || initiatorType === 'user' ? data = { pkey, users: toAdd } : data = { pkey, groups: toAdd }
        let postData = {
          action: _operationRelations[operationType].action,
          method: 'POST',
          data
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.$message.success('加入成功！')
            // Object.assign(_operationRelations[operationType], { visible: false, loading: false })
            _operationRelations[operationType].loading = false
            _operationRelations[operationType].visible = false
            this.getPermittedProcessList()
          }
        })
      },

      onRemove (pkey, { adminType = '', initiatorType = '', operationType = '' }) {
        const _operationRelations = {
          'admin': this.adminData,
          'initiator': this.initiatorData
        }
  
        // 设定 adminData || initiatorData 的 type 属性
        _operationRelations[operationType].type = adminType || initiatorType
        if (!_operationRelations[operationType].isCheckable) {
          _operationRelations[operationType].isCheckable = true
          return
        }

        let operateeTypeCode
        _operationRelations[operationType].type === 'user' ? operateeTypeCode = '用户' : operateeTypeCode = '用户组（角色）'  // 暂时写死此条件，虽不严谨

        if (!_operationRelations[operationType].toRemove.length) {
          this.$message.warning(`请选择${operateeTypeCode}！`)
          return
        }
        this.$confirm(`此操作将移除该流程下作为的所选${operateeTypeCode}，是否继续？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data
          let { toRemove } = _operationRelations[operationType]
          adminType === 'user' || initiatorType === 'user' ? data = { pkey, users: toRemove } : data = { pkey, groups: toRemove }
          console.log(data)
          let postData = {
            action: _operationRelations[operationType].action,
            method: 'DELETE',
            data
          }
          this.http.post('', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              this.$message.success('移除成功！')
              Object.assign(_operationRelations[operationType], { visible: false, isCheckable: false })
              this.getPermittedProcessList()
            }
          })
        })
      }
    }
  }
</script>