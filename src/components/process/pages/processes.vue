<template>
  <div class="processes">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3><i class="el-icon-setting"></i> 指派流程管理员（未完成）</h3>
          <el-table
            :data="processList"
            border
            @expand="isCheckable = false">
            <el-table-column type="expand">
              <template scope="scope">
                <el-collapse accordion>
                  <el-collapse-item title="管理员用户">
                    <el-row>
                      <el-col :span="20" :offset="2">
                        <div class="btn-area clear">
                          <h5 class="sub-title fl" style="margin-top: 0" v-if="scope.row.admin_users.length"><i class="el-icon-fa-users"></i> 此流程的管理员用户（{{scope.row.admin_users.length}}）：</h5>
                          <h5 class="sub-title fl" style="margin-top: 0;" v-if="!scope.row.admin_users.length"><i class="el-icon-warning"></i> 此流程暂无管理员用户！</h5>
                          <el-button v-if="adminUsers.isCheckable" class="fr cancel-btn" type="text" size="small" @click="adminUsers.isCheckable = false">取消</el-button>
                          <el-tooltip content="移除管理员用户" placement="right" class="fr" v-if="scope.row.admin_users.length">
                            <el-button
                              icon="minus"
                              type="danger"
                              size="small"
                              :class="{ empty: !adminUsers.isCheckable }"
                              @click="onRemoveAdminUsers(scope.row.pkey)">{{adminUsers.isCheckable ? '移除所选' : ''}}</el-button>
                          </el-tooltip>
                          <el-tooltip content="加入管理员用户" placement="left" class="fr">
                            <el-button
                              icon="plus"
                              type="success"
                              size="small"
                              @click="onAddAdminUsers(scope.row.pkey, scope.row.admin_users)">
                            </el-button>
                          </el-tooltip>
                        </div>
                        <el-checkbox-group v-model="adminUsers.toRemove">
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
                          <el-button v-if="adminGroups.isCheckable" class="fr cancel-btn" type="text" size="small" @click="adminGroups.isCheckable = false">取消</el-button>
                          <el-tooltip content="移除管理员用户" placement="right" class="fr" v-if="scope.row.admin_groups.length">
                            <el-button
                              icon="minus"
                              type="danger"
                              size="small"
                              :class="{ empty: !adminGroups.isCheckable }"
                              @click="onRemoveAdminGroups(scope.row.pkey, scope.row.admin_groups)">{{adminGroups.isCheckable ? '移除所选' : ''}}</el-button>
                          </el-tooltip>
                          <el-tooltip content="加入管理员用户" placement="left" class="fr">
                            <el-button
                              icon="plus"
                              type="success"
                              size="small"
                              @click="onAddAdminGroups(scope.row.pkey)">
                            </el-button>
                          </el-tooltip>
                        </div>
                        <el-checkbox-group v-model="adminGroups.toRemove">
                          <el-checkbox v-for="user in scope.row.admin_groups"></el-checkbox>
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

    <el-dialog title="加入管理员用户" size="tiny" v-model="adminUsers.visible">
      <h5 class="sub-title" style="margin-top: 0"><i class="el-icon-information"></i> 勾选欲加入为管理员的用户：</h5>
      <el-checkbox-group v-model="adminUsers.toAdd">
        <el-checkbox v-for="user in userList" :label="user.userId">{{user.code}}</el-checkbox>
      </el-checkbox-group>
      <span class="dialog-footer" slot="footer">
        <el-button @click="onAddAdminUsers(adminUsers.pkey, adminUsers.toAdd)" size="small" icon="check" type="success" :loading="adminUsers.loading">确认加入</el-button>
      </span>
    </el-dialog>

    <el-dialog title="加入管理员用户组（角色）" size="tiny" v-model="adminGroups.visible">
      <h5 class="sub-title" style="margin-top: 0"><i class="el-icon-information"></i> 勾选欲加入为管理员的用户组（角色）：</h5>
      <el-checkbox-group v-model="adminGroups.toAdd">
        <el-checkbox v-for="user in userList" :label="user.userId">{{user.code}}</el-checkbox>
      </el-checkbox-group>
      <span class="dialog-footer" slot="footer">
        <el-button @click="onAddAdminGroups(adminGroups.pkey, adminGroups.toAdd)" size="small" icon="check" type="success" :loading="adminGroups.loading">确认加入</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  // 我真的是 做到烦了
  export default {
    data () {
      return {
        processList: [],
        userList: [],
        adminGroups: {
          toAdd: [],
          toRemove: [],
          pkey: '',
          loading: false,
          isCheckable: false,
          visible: false
        },
        adminUsers: {
          toAdd: [],
          toRemove: [],
          pkey: '',
          loading: false,
          isCheckable: false,
          visible: false
        }
      }
    },

    created () {
      this.getProcessList()
      this.getUserList()
    },

    methods: {
      getProcessList () {
        let postData = {
          action: 'permission/process',
          method: 'GET',
          data: {}
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.processList = res.data.data
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
            console.log(this.userList)
          }
        })
      },

      onAddAdminUsers (pkey, users = []) {
        if (!users.length) {
          this.adminUsers.visible = true
          this.adminUsers.pkey = pkey
          return
        }
        this.adminUsers.loading = true
        let postData = {
          action: 'permission/process/admin/role/users',
          method: 'POST',
          data: { users, pkey }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.adminUsers.loading = false
            this.adminUsers.visible = false
            this.$message.success('加入成功！')
            this.getProcessList()
          }
        })
      },

      onRemoveAdminUsers () {},

      onAddAdminGroups () {},

      onRemoveAdminGroups () {}
    }
  }
</script>