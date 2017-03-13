<template>
  <div class="roles">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3><i class="el-icon-menu"></i> 角色管理</h3>
          <el-button icon="plus" @click="addedRoleData.visible = true" style="margin-bottom: 12px">新建角色</el-button>
          <el-table
            :data="roleList"
            border>
            <el-table-column
              type="expand">
              <template scope="scope">
                <div class="btn-area clear">
                  <h5 class="sub-title fl" style="margin-top: 0;" v-if="scope.row.users.length"><i class="el-icon-fa-users"></i> 属于{{scope.row.role}}角色的用户 ({{scope.row.users.length}})：</h5>
                  <h5 class="sub-title fl" style="margin-top: 0;" v-if="!scope.row.users.length"><i class="el-icon-warning"></i> 暂无属于{{scope.row.name}}角色的用户！</h5>
                  <el-button v-if="isCheckable" class="fr cancel-btn" type="text" size="small" @click="isCheckable = false">取消</el-button>
                  <el-tooltip content="移除用户" placement="right" class="fr" v-if="scope.row.users.length">
                    <el-button
                      icon="minus"
                      type="danger"
                      size="small"
                      :class="{ empty: !isCheckable }"
                      @click="onDeleteUser(scope.row.key)">{{ isCheckable ? '移除所选' : '' }}</el-button>
                  </el-tooltip>
                  <el-tooltip content="加入用户" placement="left" class="fr">
                    <el-button
                      icon="plus"
                      type="success"
                      size="small"
                      @click="onAddUser(scope.row.key, scope.row.users)">
                    </el-button>
                  </el-tooltip>
                </div>
                <el-checkbox-group v-model="usersToDelete" :class="{ uncheckable: !isCheckable }">
                  <el-checkbox v-for="user in scope.row.users" :label="user.userId" :disabled="user.existing">{{user.code}}</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="角色名称"></el-table-column>
            <el-table-column
              label="操作"
              width="240">
              <template scope="scope">
                <el-button type="info" :plain="true" size="small" icon="edit" @click="editRoleData.visible = true; editRoleData.role = scope.row"></el-button>
                <el-button type="danger" size="small" icon="delete" @click="onDeleteRole(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-collapse accordion>
            <el-collapse-item v-for="role in roleList" :title="role.name">
              <el-row>
                <el-col :span="20" :offset="2">
                  <div class="btn-area clear">
                    <h5 class="sub-title fl" style="margin-top: 0;" v-if="role.users.length"><i class="el-icon-fa-users"></i> 属于{{role.role}}角色的用户 ({{role.users.length}})：</h5>
                    <h5 class="sub-title fl" style="margin-top: 0;" v-if="!role.users.length"><i class="el-icon-warning"></i> 暂无属于{{role.name}}角色的用户！</h5>
                    <el-button v-if="isCheckable" class="fr cancel-btn" type="text" size="small" @click="isCheckable = false">取消</el-button>
                    <el-tooltip content="移除用户" placement="right" class="fr" v-if="role.users.length">
                      <el-button
                        icon="minus"
                        type="danger"
                        size="small"
                        :class="{ empty: !isCheckable }"
                        @click="onDeleteUser(role.key)">{{ isCheckable ? '移除所选' : '' }}</el-button>
                    </el-tooltip>
                    <el-tooltip content="加入用户" placement="left" class="fr">
                      <el-button
                        icon="plus"
                        type="success"
                        size="small"
                        @click="onAddUser(role.key, role.users)">
                      </el-button>
                    </el-tooltip>
                  </div>
                  <el-checkbox-group v-model="usersToDelete" :class="{ uncheckable: !isCheckable }">
                    <el-checkbox v-for="user in role.users" :label="user.userId" :disabled="user.existing">{{user.code}}</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse> -->
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="加入用户" size="tiny" v-model="userViewData.visible">
      <h5 class="sub-title" style="margin-top: 0"><i class="el-icon-information"></i> 勾选欲加入的用户：</h5>
      <el-checkbox-group v-model="usersToAdd">
        <el-checkbox v-for="user in userList" :label="user.userId">{{user.code}}</el-checkbox>
      </el-checkbox-group>
      <span class="dialog-footer" slot="footer">
        <el-button @click="onAddUser" size="small" icon="check" type="success">确认加入</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑角色" size="tiny" v-model="editRoleData.visible">
      <el-form label-width="72px" class="advance-search-form">
        <el-form-item label="角色 Key">
          <el-input v-model="editRoleData.role.key" placeholder="请填写英文"></el-input>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="editRoleData.role.name" placeholder="请填写中文"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="onEditRole(editRoleData.role)" icon="check" type="info">确认</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新建角色" size="tiny" v-model="addedRoleData.visible">
      <el-form label-width="72px" class="advance-search-form">
        <el-form-item label="角色 Key">
          <el-input v-model="addedRoleData.role.key" placeholder="请填写英文"></el-input>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="addedRoleData.role.name" placeholder="请填写中文"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="onAddRole(addedRoleData.role)" icon="check" type="info">确认新建</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        roleList: [],
        userList: [],
        roleLoading: false,
        usersToAdd: [],
        usersToDelete: [],
        isCheckable: false,
        userViewData: {
          visible: false,
          roleId: ''
        },
        addedRoleData: {
          visible: false,
          role: {
            name: '',
            key: ''
          }
        },
        editRoleData: {
          visible: false,
          role: {}
        }
      }
    },

    created () {
      this.getRoleList()
      this.getUserList()
    },

    methods: {
      getRoleList () {
        let postData = {
          action: 'permission/role',
          method: 'GET',
          data: {}
        }
        this.roleLoading = true
        this.http.post('', this.parseData(postData)).then((res) => {
          console.log(res)
          this.roleList = res.data.data
          this.roleLoading = false
        })
      },

      getUserList () {
        let postData = {
          action: 'permission/users',
          method: 'GET',
          data: {}
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          this.userList = res.data.data
          console.log(this.userList)
        })
      },

      onAddRole ({ name, key }) {
        let postData = {
          action: 'permission/role',
          method: 'POST',
          data: { name, key }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          this.addedRoleData.visible = false
          this.$message.success(`成功新建角色 ${name}！`)
          this.getRoleList()
        })
      },

      onEditRole () {
        let postData = {
          action: 'permission/role',
          method: 'PUT',
          data: {
            key: this.editRoleData.role.key,
            name: this.editRoleData.role.name
          }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.$message.success('修改成功！')
            this.editRoleData.visible = false
            this.getRoleList()
          }
        })
      },

      onDeleteRole ({ name, key }) {
        this.$confirm(`此操作将移除角色「${name}」，是否继续？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postData = {
            action: 'permission/role',
            method: 'DELETE',
            data: { key }
          }
          this.http.post('', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              this.$message.success(`已移除角色「${name}」！`)
              this.getRoleList()
            }
          })
        })
      },

      onAddUser (key, users = []) {
        if (!this.userViewData.visible) {
          this.userViewData.visible = true
          this.userViewData.roleKey = key
          console.log(users)
          for (let user of this.userList) {
            if (users.includes(user)) {
              user.exsting = true
            } else {
              user.exsting = false
            }
          }
          console.log(this.userList)
          return
        }
        let postData = {
          action: 'permission/role/users',
          method: 'POST',
          data: {
            users: this.usersToAdd,
            key: this.userViewData.roleKey
          }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          console.log(res)
          this.userViewData.visible = false
          this.$message.success('成功添加用户！')
          this.getRoleList()
        })
      },

      onDeleteUser (key) {
        if (!this.isCheckable) {
          this.isCheckable = true
          return
        }
        if (!this.usersToDelete.length) {
          this.$message.warning('请选择用户！')
          return
        }
        console.log(this.usersToDelete)
        this.$confirm('此操作将移除该角色下的所选用户，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postData = {
            action: 'permission/role/users',
            method: 'DELETE',
            data: {
              users: this.usersToDelete,
              key
            }
          }
          this.http.post('', this.parseData(postData)).then((res) => {
            this.$message.success('移除成功！')
            this.getRoleList()
          })
        }).catch(() => {
          this.usersToDelete = []
        })
      }
    }
  }
</script>

<style lang="less">
  .btn-area {
    margin-top: 12px;

    .el-tooltip.fr:first-of-type {
      margin-left: 6px;
    }

    .cancel-btn {
      margin-left: 6px;

      span {
        border-bottom: 1px solid;
      }
    }
  }

  .uncheckable {
    .el-checkbox__input {
      display: none;
    }
  }

  .el-table__expanded-cell {
    .el-button.empty {
      span {
        margin-left: 0;
      }
    }
  }
</style>