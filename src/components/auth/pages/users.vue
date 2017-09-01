<template>
  <div class="users wrapper">
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
              label="用户名"></el-table-column>
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
                <el-tag v-for="group in row.groups" :key="group.name">{{group.name}}</el-tag>
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

    <el-dialog title="新建用户" size="small" v-model="addUserData.visible">
      <el-form :rules="userFormRules" ref="addUserData.user" :model="addUserData.user" label-width="78px">
        <el-form-item label="用户名" prop="nick">
          <el-input v-model="addUserData.user.nick"></el-input>
        </el-form-item>
        <el-form-item label="用户 ID" prop="userId">
          <el-input v-model="addUserData.user.userId" placeholder="请填写英文"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="addUserData.user.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUserData.user.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="addUserData.user.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户层级" prop="level">
          <el-select v-model="addUserData.user.level" placeholder="请选择用户层级">
            <el-option label="超级管理员" value="0"></el-option>
            <el-option label="管理员" value="1"></el-option>
            <el-option label="普通" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="onAddUser(addUserData.user)" icon="check" type="info">确认新建</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑用户" size="tiny" v-model="editUserData.visible">
      <el-form :rules="userFormRules" ref="addUserData.user" :model="addUserData.user" label-width="72px">
        <el-form-item label="用户名" prop="nick">
          <el-input v-model="editUserData.user.nick" placeholder="请填写用户名"></el-input>
        </el-form-item>
        <el-form-item label="用户 ID" prop="userId">
          <el-input v-model="editUserData.user.userId" placeholder="请填写用户 ID"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="editUserData.user.email"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editUserData.user.pwd"></el-input>
        </el-form-item>
        <el-form-item label="用户层级" prop="level">
          <el-select v-model="editUserData.user.level" :disabled="editUserData.user.userId === $store.state.userinfo.userId" placeholder="请选择用户层级">
            <el-option label="超级管理员" value="0"></el-option>
            <el-option label="管理员" value="1"></el-option>
            <el-option label="普通" value="2"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="用户层级" prop="level">
          <el-input-number v-model="editUserData.user.level" :min="0" :max="2"></el-input-number>
        </el-form-item>
        <h5 class="sub-title" style="padding-left: 24px; margin-top: 0"><i class="el-icon-information"></i> 用户层级说明：<br>0：超级管理员；1：管理员；2：普通</h5> -->
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
      var validatePass = (rule, value, callback) => {
        console.log(value)
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.addUserData.user.checkPass !== '') {
            this.$refs['addUserData.user'].validateField('checkPass')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.addUserData.user.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      var validateUserId = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户 ID'))
        } else if (!/^(?!_)(?!.*?_$)[a-zA-Z0-9_]{6,16}$/.test(value)) {
          callback(new Error('请输入6-16位的字母或数字或下划线，且开头和结尾不能是下划线'))
        } else {
          callback()
        }
      }
      return {
        addUserData: {
          visible: false,
          user: {
            nick: '',
            level: '',
            password: '',
            checkPass: '',
            email: ''
          }
        },
        editUserData: {
          visible: false,
          user: {
            nick: '',
            level: '',
            password: '',
            checkPass: ''
          }
        },
        userFormRules: {
          nick: [
            { required: true, message: '用户名必填', trigger: 'blur' }
          ],
          userId: [
            { required: true, validator: validateUserId, trigger: 'blur' }
            // { required: true, message: '用户 ID 必填', trigger: 'blur' }
          ],
          email: [
            { type: 'email', required: true, message: '用户 Email 必填', trigger: 'blur' }
          ],
          password: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
    },

    computed: {
      isQualified () {
        return (this.$store.state.userinfo.admin === true || this.$store.state.userinfo.superadmin === true)
      }
    },

    created () {
      this.getPermittedUserList()
    },

    methods: {
      onAddUser ({ nick, userId, email, level, password }) {
        // if (!/^[a-z][a-z0-9_]+[a-z]$/.test(userId)) {
        //   this.$message.error('用户 ID 只能是字母,数字,下划线,且开头和结尾不能是下划线！')
        //   return
        // }
        let postData = {
          action: 'user',
          method: 'POST',
          data: { nick, userId, email, level, password }
        }
        this.http.post('/user/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.addUserData.visible = false
            // this.$alert(`用户 ${nick} 的密码是 ${res.data.data.pwd}。`, '新建成功！', {
            //   confirmButtonText: '记住了'
            // })
            this.getPermittedUserList()
          }
        })
      },

      onEditUser ({ nick, userId, email, pwd, level }) {
        // if ((?!_)(?!.*?_$)!/^[a-zA-Z0-9_]/.test(userId)) {
        //   this.$message.error('用户 ID 用户名只能是字母,数字,下划线,且开头和结尾不能是下划线！')
        //   return
        // }
        let data = { nick, userId, email, pwd, level }
        if (this.editUserData.user.userId === this.$store.state.userinfo.userId) {
          delete data.level
        }
        let postData = {
          action: 'user',
          method: 'PUT',
          data: data
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
