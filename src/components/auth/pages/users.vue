<template>
  <div class="users">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3><i class="el-icon-setting"></i> 用户管理</h3>
          <el-alert
            v-if="!isQualified"
            title="没有权限 :("
            type="error"
            description="你的帐号并非管理员，无法配置用户。"
            show-icon
            style="margin-bottom: 12px;">
          </el-alert>
          <el-button :disabled="!isQualified" icon="plus" @click="addUserData.visible = true" style="margin-bottom: 12px">新建用户</el-button>
          <el-table
            :data="userList"
            border>
            <el-table-column
              prop="code"
              label="名称"></el-table-column>
            <el-table-column
              prop="userId"
              label="ID"
              width="120"></el-table-column>
            <el-table-column
              prop="email"
              label="邮箱"></el-table-column>
            <el-table-column
              label="操作"
              width="200">
              <template scope="scope">
                <el-button :disabled="!isQualified" type="info" :plain="true" size="small" icon="edit" @click="editUserData.visible = true; editUserData.user = scope.row"></el-button>
                <el-button :disabled="!isQualified" type="danger" size="small" icon="delete" @click="onDeleteUser(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="新建用户" size="tiny" v-model="addUserData.visible">
      <el-form label-width="72px" class="advance-search-form">
        <el-form-item label="用户名">
          <el-input v-model="addUserData.user.code"></el-input>
        </el-form-item>
        <el-form-item label="用户 ID">
          <el-input v-model="addUserData.user.userId" placeholder="请填写英文"></el-input>
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="addUserData.user.email"></el-input>
        </el-form-item>
        <el-form-item label="用户层级">
          <el-input-number v-model="addUserData.user.level" :min="0" :max="2"></el-input-number>
        </el-form-item>
        <h5 class="sub-title" style="padding-left: 24px; margin-top: 0"><i class="el-icon-information"></i> 用户层级说明：<br>0：超级管理员；1：管理员；2：普通</h5>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="onAddUser(addUserData.user)" icon="check" type="info">确认新建</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑用户" size="tiny" v-model="editUserData.visible">
      <el-form label-width="72px" class="advance-search-form">
        <el-form-item label="用户名">
          <el-input v-model="editUserData.user.code"></el-input>
        </el-form-item>
        <el-form-item label="用户 ID">
          <el-input v-model="editUserData.user.userId" placeholder="请填写英文"></el-input>
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="editUserData.user.email"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editUserData.user.pwd"></el-input>
        </el-form-item>
        <el-form-item label="用户层级">
          <el-input-number v-model="editUserData.user.level" :min="0" :max="2"></el-input-number>
        </el-form-item>
        <h5 class="sub-title" style="padding-left: 24px; margin-top: 0"><i class="el-icon-information"></i> 用户层级说明：<br>0：超级管理员；1：管理员；2：普通</h5>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="onEditUser(editUserData.user)" icon="check" type="info">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import getUserList from './../../../mixins/getUserList'

  export default {
    mixins: [getUserList],

    data () {
      return {
        addUserData: {
          visible: false,
          user: {}
        },
        editUserData: {
          visible: false,
          user: {}
        }
      }
    },

    computed: {
      isQualified () {
        return (window.localStorage.isAdmin === 'true')
      }
    },

    created () {
      this.getUserList()
    },

    methods: {
      onAddUser ({ code, userId, email, level }) {
        if (!/^[a-z][a-z0-9_]+[a-z]$/.test(userId)) {
          this.$message.error('用户 ID 只可包含小写英文、数字和下划线，且开头和结尾只可是小写英文！')
          return
        }
        let postData = {
          action: 'permission/users',
          method: 'POST',
          data: { code, userId, email, level }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.addUserData.visible = false
            this.$message.success(`成功新建用户 ${code}！`)
            this.getUserList()
          }
        })
      },

      onEditUser ({ code, userId, email, pwd, level }) {
        if (!/^[a-z][a-z0-9_]+[a-z]$/.test(userId)) {
          this.$message.error('用户 ID 只可包含小写英文、数字和下划线，且开头和结尾只可是小写英文！')
          return
        }
        let postData = {
          action: 'permission/users',
          method: 'PUT',
          data: { code, userId, email, pwd, level }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.editUserData.visible = false
            this.$message.success('修改成功！')
            this.getUserList()
          }
        })
      },

      onDeleteUser ({ code, userId }) {
        this.$confirm(`此操作将移除用户「${code}」，是否继续？`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          let postData = {
            action: 'permission/users',
            method: 'DELETE',
            data: { userId }
          }
          this.http.post('', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              this.$message.success(`已移除用户「${code}」！`)
              this.getUserList()
            }
          })
        })
      }
    }
  }
</script>