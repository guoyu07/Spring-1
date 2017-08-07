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
              prop="nick"
              label="昵称"></el-table-column>
            <el-table-column
              prop="userId"
              label="ID"
              width="150"></el-table-column>
            <el-table-column
              prop="email"
              label="邮箱"></el-table-column>
            <el-table-column
              label="所属组别"
              inline-template
              :context="_self">
              <template>
                <el-tag v-for="group in row.groups">{{group.name}}</el-tag>
                <span v-if="!row.groups.length">无</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="180"
              inline-template
              :context="_self">
              <template>
                <el-button :disabled="!isQualified" type="info" :plain="true" size="small" icon="edit" @click="editUserData.visible = true; editUserData.user = row"></el-button>
                <el-button :disabled="!isQualified" :type="row.status ? 'success' : 'danger'" size="small" @click="onToggleUser(row)">{{ row.status ? '启用' : '禁用' }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="新建用户" size="tiny" v-model="addUserData.visible">
      <el-form :rules="userFormRules" ref="addUserData.user" :model="addUserData.user" label-width="72px">
        <el-form-item label="昵称" prop="nick">
          <el-input v-model="addUserData.user.nick"></el-input>
        </el-form-item>
        <el-form-item label="用户 ID" prop="userId">
          <el-input v-model="addUserData.user.userId" placeholder="请填写英文"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="addUserData.user.email"></el-input>
        </el-form-item>
        <el-form-item label="用户层级" prop="level">
          <el-input-number v-model="addUserData.user.level" :min="0" :max="2"></el-input-number>
        </el-form-item>
        <h5 class="sub-title" style="padding-left: 24px; margin-top: 0"><i class="el-icon-information"></i> 用户层级说明：<br>0：超级管理员；1：管理员；2：普通</h5>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="onAddUser(addUserData.user)" icon="check" type="info">确认新建</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑用户" size="tiny" v-model="editUserData.visible">
      <el-form :rules="userFormRules" ref="addUserData.user" :model="addUserData.user" label-width="72px">
        <el-form-item label="昵称" prop="nick">
          <el-input v-model="editUserData.user.nick"></el-input>
        </el-form-item>
        <el-form-item label="用户 ID" prop="userId">
          <el-input v-model="editUserData.user.userId" placeholder="请填写英文"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="editUserData.user.email"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editUserData.user.pwd"></el-input>
        </el-form-item>
        <el-form-item label="用户层级" prop="level">
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
  import getPermittedUserList from './../../../mixins/getPermittedUserList'

  export default {
    mixins: [getPermittedUserList],

    data () {
      return {
        addUserData: {
          visible: false,
          user: {}
        },
        editUserData: {
          visible: false,
          user: {}
        },
        userFormRules: {
          nick: [
            { required: true, message: '用户名必填', trigger: 'blur' }
          ],
          userId: [
            { required: true, message: '用户 ID 必填', trigger: 'blur' }
          ],
          email: [
            { type: 'email', required: true, message: '用户 Email 必填', trigger: 'blur' }
          ]
        }
      }
    },

    computed: {
      isQualified () {
        return (window.localStorage.isAdmin === 'true')
      }
    },

    created () {
      this.getPermittedUserList()
    },

    methods: {
      onAddUser ({ nick, userId, email, level }) {
        if (!/^[a-z][a-z0-9_]+[a-z]$/.test(userId)) {
          this.$message.error('用户 ID 只可包含小写英文、数字和下划线，且开头和结尾只可是小写英文！')
          return
        }
        let postData = {
          action: 'user',
          method: 'POST',
          data: { nick, userId, email, level }
        }
        this.http.post('/user/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.addUserData.visible = false
            this.$alert(`用户 ${nick} 的密码是 ${res.data.data.pwd}。`, '新建成功！', {
              confirmButtonText: '记住了'
            })
            this.getPermittedUserList()
          }
        })
      },

      onEditUser ({ nick, userId, email, pwd, level }) {
        if (!/^[a-z][a-z0-9_]+[a-z]$/.test(userId)) {
          this.$message.error('用户 ID 只可包含小写英文、数字和下划线，且开头和结尾只可是小写英文！')
          return
        }
        let postData = {
          action: 'user',
          method: 'PUT',
          data: { nick, userId, email, pwd, level }
        }
        this.http.post('/user/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.editUserData.visible = false
            this.$message.success('修改成功！')
            this.getPermittedUserList()
          }
        })
      },

      onToggleUser ({ nick, userId, status }) {
        this.$confirm(`确定${status ? '启用' : '禁用'}用户 ${nick}？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postData = {
            action: 'user',
            method: 'DELETE',
            data: { userId }
          }
          this.http.post('/user/', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              this.$message.success(`已${status ? '启用' : '禁用'}用户「${nick}」！`)
              this.getPermittedUserList()
            }
          })
        })
      }
    }
  }
</script>
