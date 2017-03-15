<template>
  <div class="processes">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3><i class="el-icon-setting"></i> 指派流程管理员</h3>
          <el-table
            :data="processList"
            border
            v-loading.body="processLoading"
            @expand="adminData.isCheckable = false">
            <el-table-column type="expand">
              <template scope="scope">
                <el-collapse accordion @change="onAccordionChange">
                  <el-collapse-item title="管理员用户">
                    <el-row>
                      <el-col :span="20" :offset="2">
                        <div class="btn-area clear">
                          <h5 class="sub-title fl" style="margin-top: 0" v-if="scope.row.admin_users.length"><i class="el-icon-fa-users"></i> 此流程的管理员用户（{{scope.row.admin_users.length}}）：</h5>
                          <h5 class="sub-title fl" style="margin-top: 0;" v-if="!scope.row.admin_users.length"><i class="el-icon-warning"></i> 此流程暂无管理员用户！</h5>
                          <el-button v-if="adminData.isCheckable" class="fr cancel-btn" type="text" size="small" @click="adminData.isCheckable = false">取消</el-button>
                          <el-tooltip content="移除管理员用户" placement="right" class="fr" v-if="scope.row.admin_users.length">
                            <el-button
                              icon="minus"
                              type="danger"
                              size="small"
                              :class="{ empty: !adminData.isCheckable }"
                              @click="onRemoveAdmins(scope.row.pkey, 'user')">{{adminData.isCheckable ? '移除所选' : ''}}</el-button>
                          </el-tooltip>
                          <el-tooltip content="加入管理员用户" placement="left" class="fr">
                            <el-button
                              icon="plus"
                              type="success"
                              size="small"
                              @click="adminData.visible = true, adminData.pkey = scope.row.pkey, adminData.type = 'user'">
                            </el-button>
                          </el-tooltip>
                        </div>
                        <el-checkbox-group v-model="adminData.toRemove" :class="{ uncheckable: !adminData.isCheckable }">
                          <el-checkbox v-for="user in scope.row.admin_users" :label="user.userId">{{user.code}}</el-checkbox>
                        </el-checkbox-group>
                      </el-col>
                    </el-row>
                  </el-collapse-item>
                  <el-collapse-item title="管理员用户组（角色）">
                    <el-row>
                      <el-col :span="20" :offset="2">
                        <div class="btn-area clear">
                          <h5 class="sub-title fl" style="margin-top: 0" v-if="scope.row.admin_groups.length"><i class="el-icon-fa-users"></i> 此流程的管理员用户组（角色）（{{scope.row.admin_groups.length}}）：</h5>
                          <h5 class="sub-title fl" style="margin-top: 0;" v-if="!scope.row.admin_groups.length"><i class="el-icon-warning"></i> 此流程暂无管理员用户组（角色）！</h5>
                          <el-button v-if="adminData.isCheckable" class="fr cancel-btn" type="text" size="small" @click="adminData.isCheckable = false">取消</el-button>
                          <el-tooltip content="移除管理员用户" placement="right" class="fr" v-if="scope.row.admin_groups.length">
                            <el-button
                              icon="minus"
                              type="danger"
                              size="small"
                              :class="{ empty: !adminData.isCheckable }"
                              @click="onRemoveAdmins(scope.row.pkey, 'group')">{{adminData.isCheckable ? '移除所选' : ''}}</el-button>
                          </el-tooltip>
                          <el-tooltip content="加入管理员用户" placement="left" class="fr">
                            <el-button
                              icon="plus"
                              type="success"
                              size="small"
                              @click="adminData.visible = true, adminData.pkey = scope.row.pkey, adminData.type = 'group'">
                            </el-button>
                          </el-tooltip>
                        </div>
                        <el-checkbox-group v-model="adminData.toRemove" :class="{ uncheckable: !adminData.isCheckable }">
                          <el-checkbox v-for="group in scope.row.admin_groups" :label="group.key">{{group.name}}</el-checkbox>
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
      <h5 class="sub-title" style="margin-top: 0"><i class="el-icon-information"></i> 勾选欲加入为管理员的{{adminData.type === 'user' ? '用户' : '用户组（角色）'}}：</h5>
      <el-checkbox-group v-model="adminData.toAdd">
        <el-checkbox v-if="adminData.type === 'user'" v-for="user in userList" :label="user.userId">{{user.code}}</el-checkbox>
        <el-checkbox v-if="adminData.type === 'group'" v-for="role in roleList" :label="role.key">{{role.name}}</el-checkbox>
      </el-checkbox-group>
      <span class="dialog-footer" slot="footer">
        <el-button @click="onAddAdmins(adminData)" size="small" icon="check" type="success" :loading="adminData.loading">确认加入</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  // This project
  // has been really annoying
  // as fuck
  export default {
    data () {
      return {
        processLoading: false,
        processList: [],
        userList: [],
        roleList: [],
        adminData: {
          loading: false,
          visible: false,
          isCheckable: false,
          type: '', // 是操作用户还是用户组
          pkey: '', // 要增删管理员的流程
          toAdd: [],  // 待加入的管理员
          toRemove: []  // 待移除的管理员
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
        // 伸缩手风琴时，取消勾选状态，并清空待加入和待移除队列
        this.adminData = Object.assign({}, this.adminData, { isCheckable: false, toAdd: [], toRemove: [] })
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
            console.log(this.roleList)
          }
        })
      },

      onAddAdmins ({ type, pkey, toAdd }) { // 根据 adminData 中赋予的 type 来增加用户或用户组
        this.adminData.loading = true
        let data
        type === 'user' ? data = { pkey, users: toAdd } : data = { pkey, groups: toAdd }
        let postData = {
          action: 'permission/process/admin/role/users',
          method: 'POST',
          data
        }
        console.log(postData)
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.adminData.loading = false
            this.adminData.visible = false
            this.$message.success('加入成功！')
            this.getProcessList()
          }
        })
      },

      onRemoveAdmins (pkey, type) { // 根据传入的 type 参数来移除用户或用户组
        // TODO: 此处应否把 pkey 参数赋予 adminData.pkey？
        if (!this.adminData.isCheckable) {
          this.adminData.isCheckable = true
          return
        }

        let typeCode
        type === 'user' ? typeCode = '用户' : typeCode = '用户组（角色）'  // 暂时写死此条件，虽不严谨

        if (!this.adminData.toRemove.length) {
          this.$message.warning(`请选择${typeCode}！`)
          return
        }
        this.$confirm(`此操作将移除该流程下的所选${typeCode}，是否继续？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data
          let { toRemove } = this.adminData
          type === 'user' ? data = { pkey, users: toRemove } : data = { pkey, groups: toRemove }
          let postData = {
            action: 'permission/process/admin/role/users',
            method: 'DELETE',
            data
          }
          this.http.post('', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              this.$message.success('移除成功！')
              this.adminData = Object.assign({}, this.adminData, { visible: false, isCheckable: false })
              this.getProcessList()
            }
          })
        })
      },

      onAddAdminGroups () {},

      onRemoveAdminGroups () {}
    }
  }
</script>