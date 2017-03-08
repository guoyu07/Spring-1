<style lang="less">
  .btn-area {
    margin-top: 12px;

    .el-tooltip.fr:first-of-type {
      margin-left: 6px;
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

<template>
  <div class="roles">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3><i class="el-icon-menu"></i> 角色管理</h3>
          <el-table
            :data="roleList"
            border
            v-loading.body="roleLoading">
            <el-table-column type="expand">
              <template scope="props">
                <div class="btn-area clear">
                  <h5 class="sub-title fl" style="margin-top: 0;"><i class="el-icon-fa-users"></i> 属于{{props.row.role}}角色的用户 ({{props.row.user.length}})：</h5>
                  <el-tooltip content="移除用户" placement="right" class="fr" v-if="props.row.user.length">
                    <el-button
                      icon="minus"
                      type="danger"
                      size="small"
                      :class="{ empty: !isCheckable }"
                      @click="onDelete(props.row.id)">{{ isCheckable ? '移除所选' : '' }}</el-button>
                  </el-tooltip>
                  <el-tooltip content="加入用户" placement="left" class="fr">
                    <el-button
                      icon="plus"
                      type="success"
                      size="small"
                      @click="onAdd(props.row.id)">
                    </el-button>
                  </el-tooltip>
                </div>
                <el-checkbox-group v-model="usersToDelete" @change="onCheckUsers" :class="{ uncheckable: !isCheckable }">
                  <el-checkbox v-for="user in props.row.user" :label="user">{{user}}</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
            <el-table-column
              prop="role"
              label="角色"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="加入用户" v-model="userViewData.visible">
      <el-checkbox-group v-model="usersToAdd">
        <el-checkbox v-for="user in userList" :label="user">{{user}}</el-checkbox>
      </el-checkbox-group>
      <span class="dialog-footer" slot="footer">
        <el-button @click="onAdd" icon="check" type="success">确认加入</el-button>
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
          visible: false
        }
      }
    },

    created () {
      this.getRoleList()
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

      onCheckUsers () {
        console.log(this.usersToDelete)
      },

      onAdd (id) {
        if (!this.userViewData.visible) {
          this.userViewData.visible = true
          this.userViewData.roleId = id
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
        })
      }
    }
  }
</script>