<template>
  <div class="roles">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3><i class="el-icon-menu"></i> 角色管理</h3>
          <el-collapse accordion>
            <el-collapse-item v-for="role in roleList" :title="role.role">
              <el-row>
                <el-col :span="20" :offset="2">
                  <div class="btn-area clear">
                    <h5 class="sub-title fl" style="margin-top: 0;" v-if="role.user.length"><i class="el-icon-fa-users"></i> 属于{{role.role}}角色的用户 ({{role.user.length}})：</h5>
                    <h5 class="sub-title fl" style="margin-top: 0;" v-if="!role.user.length"><i class="el-icon-warning"></i> 暂无属于{{role.role}}角色的用户！</h5>
                    <el-button v-if="isCheckable" class="fr cancel-btn" type="text" size="small" @click="isCheckable = false">取消</el-button>
                    <el-tooltip content="移除用户" placement="right" class="fr" v-if="role.user.length">
                      <el-button
                        icon="minus"
                        type="danger"
                        size="small"
                        :class="{ empty: !isCheckable }"
                        @click="onDelete(role.id)">{{ isCheckable ? '移除所选' : '' }}</el-button>
                    </el-tooltip>
                    <el-tooltip content="加入用户" placement="left" class="fr">
                      <el-button
                        icon="plus"
                        type="success"
                        size="small"
                        @click="onAdd(role.id, role.user)">
                      </el-button>
                    </el-tooltip>
                  </div>
                  <el-checkbox-group v-model="usersToDelete" :class="{ uncheckable: !isCheckable }">
                    <el-checkbox v-for="user in role.user" :label="user">{{user}}</el-checkbox>
                  </el-checkbox-group>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="加入用户" size="tiny" v-model="userViewData.visible">
      <h5 class="sub-title" style="margin-top: 0"><i class="el-icon-information"></i> 勾选欲加入的用户：</h5>
      <el-checkbox-group v-model="usersToAdd">
        <el-checkbox v-for="user in userList" :label="user.user" :disabled="user.exsting">{{user.user}}</el-checkbox>
      </el-checkbox-group>
      <span class="dialog-footer" slot="footer">
        <el-button @click="onAdd" size="small" icon="check" type="success">确认加入</el-button>
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
          this.roleList = res.data.data.list
          this.roleLoading = false
        })
      },

      getUserList () {},

      onAdd (id, users = []) {
        if (!this.userViewData.visible) {
          this.userViewData.visible = true
          this.userViewData.roleId = id
          let userList = ['easyops', 'foo', 'bar', 'baz']
          this.userList = []
          for (let user of userList) {
            if (users.includes(user)) {
              this.userList.push({ user, exsting: true })
            } else {
              this.userList.push({ user, exsting: false })
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
            id: this.userViewData.roleId
          }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          this.$message.success('加入成功！')
          this.userViewData.visible = false
          this.getRoleList()
        })
      },

      onDelete (id) {
        if (!this.isCheckable) {
          this.isCheckable = true
          return
        }
        if (!this.usersToDelete.length) {
          this.$message.warning('请选择用户！')
          return
        }
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
              id
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

  .el-collapse-item__content {
    .el-button.empty {
      span {
        margin-left: 0;
      }
    }
  }
</style>