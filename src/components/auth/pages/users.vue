<template>
  <div class="users wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3 class="module-title"><i class="el-icon-fa-user"></i> 用户管理</h3>
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
                placeholder="根据用户名/基本信息搜索"
                icon="search"
                size="small"
                v-model="search.key"
                @change="onSearch">
              </el-input>
              <el-select v-model="search.role" size="small" @change="onSearch" clearable placeholder="角色" filterable>
                <el-option
                  v-for="role in roleList.list"
                  :key="role.key"
                  :label="role.name"
                  :value="role.key">
                </el-option>
              </el-select>
              <el-select v-model="search.level" size="small" @change="onSearch" clearable placeholder="用户层级">
                <el-option label="超级管理员" value="0"></el-option>
                <el-option label="管理员" value="1"></el-option>
                <el-option label="普通用户" value="2"></el-option>
              </el-select>
              <el-select v-model="search.status" size="small" @change="onSearch" clearable placeholder="用户状态">
                <el-option label="使用中" value="0"></el-option>
                <el-option label="已禁用" value="1"></el-option>
              </el-select>
            </div>
            <!-- 仅超级管理理员/管理理员可批量编辑 及 添加用户 -->
            <div class="btn-block" v-if="$store.state.userinfo.level <= 1">
              <el-button :disabled="!userSelection.length" icon="edit" size="small" @click="editUserData.visible = true">批量编辑</el-button>
              <el-button :disabled="!isQualified" icon="plus" size="small" type="success" @click="addUserData.visible = true">添加用户</el-button>
            </div>
          </div>
          <el-table
            :data="currentPageList"
            border
            @selection-change="handleSelectionChange">
            <!-- 仅超级管理理员/管理理员可选择 -->
            <el-table-column
              v-if="$store.state.userinfo.level <= 1"
              type="selection"
              width="50">
            </el-table-column>
            <el-table-column
              label="用户 ID"
              width="100" inline-template>
              <template>
              <span v-if="$store.state.userinfo.level <= 1">
                <router-link :to="{ path: 'user-detail', query: { userId: row.userId } }" class="link-block">{{row.userId}}</router-link>
              </span>
              <span v-else>{{row.userId}}</span>
            </template>
            </el-table-column>
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
                <el-tag type="gray" v-for="group in row.groups" :key="group.name">{{group.name}}</el-tag>
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
                  <el-tag :type="row.status ? 'danger' : 'success'">
                    {{ row.status ? '已禁用' : '使用中' }}
                  </el-tag>
                </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="fr margin-top margin-bottom"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 50, 100]"
            :page-size="currentPageSize"
            layout="total, sizes, prev, pager, next"
            :total="totalPage">
          </el-pagination>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="添加用户" size="small" v-model="addUserData.visible">
      <el-form :rules="userFormRules" ref="addUserData.user" :model="addUserData.user" label-width="78px">
        <el-form-item label="昵称" prop="nick">
          <el-input v-model="addUserData.user.nick"></el-input>
        </el-form-item>
        <el-form-item label="用户 ID" prop="userId">
          <el-input v-model="addUserData.user.userId" placeholder="请填写英文"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="addUserData.user.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="addUserData.user.phone"></el-input>
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
        <el-form-item label="所属角色" prop="groups">
          <el-select v-model="addUserData.user.groups" multiple placeholder="请选择用户所属角色">
            <el-option
              v-for="role in permittedRoleList"
              :key="role.key"
              :label="role.name"
              :value="role.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="onAddUser(addUserData.user)" icon="check" type="info">确认添加</el-button>
      </span>
    </el-dialog>

    <el-dialog title="批量编辑" size="tiny" v-model="editUserData.visible">
      <el-form :rules="userFormRules" ref="editUserData.user" :model="editUserData.user" label-width="72px">
        <el-form-item label="用户层级" prop="level">
          <el-select v-model="editUserData.user.level" @change="userlevel" placeholder="请选择用户层级">
            <el-option label="超级管理员" value="0"></el-option>
            <el-option label="管理员" value="1"></el-option>
            <el-option label="普通" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属角色" prop="groups">
          <el-select v-model="editUserData.user.group_keys" multiple placeholder="请选择用户所属角色">
            <el-option
              v-for="role in permittedRoleList"
              :key="role.key"
              :label="role.name"
              :value="role.key">
            </el-option>
          </el-select>
        </el-form-item>
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
  // import getAllUserList from './../../../mixins/getAllUserList'
  import getAllRoleList from './../../../mixins/getAllRoleList'

  export default {
    mixins: [getPermittedUserList, getPermittedRoleList, getAllRoleList],

    data () {
      var validatePass = (rule, value, callback) => {
        const reg = /^[a-zA-Z0-9_!@#$%^&*]{6,16}$/
        if (value === '') {
          callback(new Error('请输入密码'))
        } else if (!reg.test(value)) {
          callback(new Error('请输入6至16位符合规则的密码'))
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
        } else if (!/^(?!_)(?!.*?_$)[a-zA-Z0-9_]{4,16}$/.test(value)) {
          callback(new Error('请输入4-16位的字母或数字或下划线，且开头和结尾不能是下划线'))
        } else {
          callback()
        }
      }
      return {
        search: {
          key: '',
          role: '',
          level: '',
          status: ''
        },
        userList: [],
        userSelection: [],
        userSearchList: [],
        currentPageList: [],
        currentPage: 1,
        currentPageSize: 20,
        totalPage: 0,
        addUserData: {
          visible: false,
          user: {
            nick: '',
            phone: '',
            level: '',
            password: '',
            checkPass: '',
            email: '',
            groups: []
          }
        },
        editUserData: {
          visible: false,
          user: {
            level: '',
            group_keys: []
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
      this.getAllRoleList()
      this.getAllUserList()
    },

    watch: {
      'userList': 'renderList'
    },

    methods: {
      userlevel (val) {
        console.log(val)
        // this.editUserData.user.level = val ? (val + '') : ''
      },
      getAllUserList () {
        let postData = {
          action: 'users/all',
          method: 'GET',
          data: { include_group: true }
        }
        this.http.post('/base/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.userList = res.data.data.list
          }
        })
      },
      renderList (newVal, oldVal) {
        this.totalPage = newVal.length
        this.handleCurrentChange()
      },
      formatLevel (row, col) {
        switch (row.level) {
          case 0: return '超级管理员'
          case 1: return '管理员'
          case 2: return '普通用户'
          default:
        }
      },
      handleSelectionChange (val) {
        this.userSelection = val
      },
      handleCurrentChange (val = 1) {
        this.currentPage = val
        const offset = (this.currentPage - 1) * this.currentPageSize
        let array = (this.search.key || this.search.role || this.search.level || this.search.status) ? this.userSearchList : this.userList
        this.currentPageList = (offset + this.currentPageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + this.currentPageSize)
      },
      handleSizeChange (val) {
        this.currentPageSize = val
        this.handleCurrentChange()
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
        }).filter(user => {
          for (const id in user) {
            if (id === 'level') {
              if (user[id] === +this.search.level || this.search.level === '') {
                return true
              }
            }
          }
        }).filter(user => {
          for (const id in user) {
            if (id === 'status') {
              if (user[id] === +this.search.status || this.search.status === '') {
                return true
              }
            }
          }
        })
        this.totalPage = this.userSearchList.length
        this.handleCurrentChange()
      },
      onAddUser ({ nick, phone, userId, email, level, password, groups }) {
        let postData = {
          action: 'user',
          method: 'POST',
          data: { nick, phone, userId, email, level, password, groups }
        }
        this.http.post('/user/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.addUserData.visible = false
            this.getAllUserList()
          }
        })
      },

      onEditUser (user) {
        let userIds = []
        this.userSelection.map(user => {
          userIds.push(user.userId)
        })
        if (user.level) {
          user.level = +user.level
        } else {
          delete user.level
        }
        let postData = {
          action: 'batch/update/user',
          method: 'post',
          data: { users: userIds, ...user }
        }
        this.http.post('/user/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.editUserData.visible = false
            this.$message.success('批量修改成功！')
            this.getAllUserList()
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .link-block {
    &:link {
    text-decoration: none;
    color: #1d90e6;
    }
    color: #1d90e6;
  }
  .el-tag+.el-tag {
    margin-left: 10px;
  }
  .flex-box {
    margin-bottom: 12px;
    .search-block {
      display: flex;
      .el-input {
        width: 210px;
        height: 36px;
        margin-right: 10px;
      }
      .el-select {
        width: 120px;
        margin-right: 10px;
      }
    }
  }
  .text-danger {
    color: #FF4949;
  }
  .el-select {
    display: block;
  }
</style>
