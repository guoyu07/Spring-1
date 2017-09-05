<template>
  <div class="users wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="24">
        <div>
          <h3 class="modul-title"><i class="el-icon-fa-user"></i> 用户管理</h3>
          <el-alert
            v-if="!isQualified"
            title="没有权限 :("
            type="error"
            description="你的帐号并非管理员，无法配置用户。"
            show-icon
            style="margin-bottom: 12px;">
          </el-alert>
          <div class="flex-box">
            <div class="search-block">
              <el-input
                placeholder="根据⽤用户名或基本信息搜索"
                icon="search"
                v-model="search.key"
                @change="onSearch">
              </el-input>
              <!-- multiple -->
              <el-select v-model="search.role" @change="onSearch" clearable placeholder="请选择角色">
                <el-option
                  v-for="role in roleList"
                  :key="role.key"
                  :label="role.name"
                  :value="role.key">
                </el-option>
              </el-select>
            </div>
            <div class="btn-block">
              <el-button :disabled="!userSelection.length" icon="edit" type="primary" @click="editUserData.visible = true">批量编辑</el-button>
              <el-button :disabled="!isQualified" icon="plus" type="success" @click="addUserData.visible = true">添加用户</el-button>
            </div>
          </div>
          <el-table
            :data="userSearchList"
            border
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="50">
            </el-table-column>
            <el-table-column
              prop="userId"
              label="用户名"
              width="100"></el-table-column>
            <el-table-column
              prop="nick"
              label="昵称"
              width="100"></el-table-column>
            <el-table-column
              prop="email"
              label="邮箱"></el-table-column>
            <el-table-column
              prop="phone"
              label="手机"></el-table-column>
            <el-table-column
              label="所属角色"
              inline-template
              :context="_self">
              <template>
                <el-tag v-for="group in row.groups" :key="group.name">{{group.name}}</el-tag>
                <span v-if="!row.groups.length">无</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="level"
              label="用户层级"
              width="120"
              :formatter="formatLevel"></el-table-column>
            <el-table-column
              inline-template
              :context="_self"
              label="用户状态"
              width="100">
                <template>
                  <span :class="row.status ? 'text-danger' : ''">
                    {{ row.status ? '已禁用' : '使用中' }}
                  </span>
                </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="80"
              inline-template
              :context="_self">
              <template>
                <!-- <el-button :disabled="!isQualified" type="info" :plain="true" size="small" icon="edit" @click="editUserData.visible = true; editUserData.user = row"></el-button>
                <el-button :disabled="!isQualified" :type="row.status ? 'success' : 'danger'" size="small" @click="onToggleUser(row)">{{ row.status ? '启用' : '禁用' }}</el-button> -->
                <el-button type="primary" size="small">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="fr margin-top"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 50, 100]"
            :page-size="currentPageSize"
            layout="sizes, prev, pager, next"
            :total="userSearchList.length">
          </el-pagination>
        </div>
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
  import getPermittedRoleList from './../../../mixins/getPermittedRoleList'

  export default {
    mixins: [getPermittedUserList, getPermittedRoleList],

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
        search: {
          key: '',
          role: ''
        },
        userSelection: [],
        userSearchList: [],
        currentPage: 1,
        currentPageSize: 20,
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
      this.getPermittedRoleList()
    },

    watch: {
      'userList': 'renderList'
    },

    methods: {
      renderList (newVal, oldVal) {
        this.userSearchList = newVal
      },
      formatLevel (row, col) {
        // console.log(row.level, col)
        switch (row.level) {
          case 0: return '超级管理员'
          case 1: return '管理员'
          case 2: return '普通用户'
          default:
        }
      },
      handleSelectionChange (val) {
        console.log(val)
        this.userSelection = val
      },
      handleCurrentChange (val) {
        this.currentPage = val
        const offset = (this.currentPage - 1) * this.currentPageSize
        const array = this.userList
        this.userSearchList = (offset + this.currentPageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + this.currentPageSize)
      },
      handleSizeChange (val) {
        console.log(val)
      },
      onSearch () {
        this.userSearchList = this.userList.filter(user => {
          for (const id in user) {
            if (['email', 'nick', 'userId', 'phone'].includes(id)) {
              if (user[id].includes(this.search.key)) {
                return true
              }
            }
          }
        }).filter(user => {
          for (const id in user) {
            if (id === 'groups') {
              if (user[id].some(group => { return group.key === this.search.role }) || this.search.role === '') {
                return true
              }
            }
          }
        })
      },
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
<style lang="less" scoped>
  .el-tag+.el-tag {
    margin-left: 10px;
  }
  .flex-box {
    margin-bottom: 12px;
    .search-block {
      display: flex;
      .el-input {
        height: 36px;
        margin-right: 12px;
      }
    }
  }
  .text-danger {
    color: #FF4949;
  }
</style>
