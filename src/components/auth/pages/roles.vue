<template>
  <div class="roles wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <div>
          <h3 class="module-title"><i class="el-icon-fa-users"></i> 角色管理</h3>
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
                placeholder="根据角色名或其他信息搜索"
                icon="search"
                v-model="search.key"
                @change="onSearch()"
                >
              </el-input>
            </div>
            <div class="btn-block">
              <el-button  icon="edit" type="primary" :disabled="!this.roleSelection.length" @click="editRoleData.visible = true">批量编辑</el-button>
              <el-button :disabled="!isQualified" icon="plus" type="success" @click="addedRoleData.visible = true">添加角色</el-button>
            </div>
          </div>
          <el-table
            :data="currentPageList"
            border
            @selection-change="handleSelectionChange"
            >
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="name" label="角色名"width="100"></el-table-column>
            <el-table-column inline-template label="管理员">
            <template>
              <el-tag v-for="user in row.users" v-if="user.level<=1">{{user.nick}}</el-tag>
            </template>
            </el-table-column>
            <el-table-column  label="所属用户" inline-template>
                <template>
                  <el-tag v-for="user in row.users">{{user.nick}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="80"
              inline-template>
              <template>
                <el-button type="primary" size="small" @click="toDetail(row.key)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="fr margin-top"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[3,10, 20, 30, 50, 100]"
            :page-size="currentPageSize"
            layout="sizes, prev, pager, next"
            :total="totalPage">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="加入用户" size="tiny" v-model="userViewData.visible">
      <h5 class="sub-title" style="margin-top: 0"><i class="el-icon-information"></i> 勾选欲加入的用户：</h5>
      <el-checkbox-group v-model="usersToAdd">
        <el-checkbox v-for="user in permittedUserList" :key="user.userId" :label="user.userId">{{user.nick}}</el-checkbox>
      </el-checkbox-group>
      <span class="dialog-footer" slot="footer">
        <el-button :disabled="!isQualified" @click="onAddUser" size="small" icon="check" type="success" :loading="userViewData.loading">确认加入</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑角色" size="tiny" v-model="editRoleData.visible">
      <el-form :rules="roleFormRules" label-width="100px">
        <el-form-item label="角色标签" prop="roleTags">
          <!-- <el-input v-model="editRoleData.role.tags[0]" placeholder="请填写角色标签"></el-input> -->
          <el-select v-model="editRoleData.role.tags" multiple allow-create placeholder="请填写角色标签"></el-select>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleData.role.name" placeholder="请填写角色名称"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button :disabled="!isQualified" @click="onEditRole(editRoleData.role)" icon="check" type="info" :loading="editRoleData.loading">确认</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新建角色" size="tiny" v-model="addedRoleData.visible">
      <el-form :rules="roleFormRules" label-width="100px">
        <el-form-item label="角色标签" prop="roleTags">
          <el-select
            v-model="addedRoleData.role.tags"
            multiple
            filterable
            allow-create
            placeholder="请填写角色标签">
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addedRoleData.role.name" placeholder="请填写角色名称"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button :disabled="!isQualified" @click="onAddRole(addedRoleData.role)" icon="check" type="info" :loading="addedRoleData.loading">确认新建</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import getPermittedRoleList from './../../../mixins/getPermittedRoleList'
  import getPermittedUserList from './../../../mixins/getPermittedUserList'

  export default {
    mixins: [getPermittedRoleList, getPermittedUserList],

    data () {
      return {
        search: {
          key: ''
        },
        totalPage: '',
        currentPageList: [],
        roleSelection: [],
        currentPage: 1,
        currentPageSize: 3,
        roleSearchList: [],
        usersToAdd: [],
        usersToDelete: [],
        isCheckable: false,
        userViewData: {
          visible: false,
          loading: false,
          roleId: ''
        },
        addedRoleData: {
          visible: false,
          loading: false,
          role: {
            name: '',
            tags: []
          }
        },
        editRoleData: {
          visible: false,
          loading: false,
          role: {
            name: '',
            tags: []
          }
        },
        roleFormRules: {
          roleTags: [
            { type: 'array', required: true, message: '角色标签必填', trigger: 'blur' }
          ],
          roleName: [
            { required: true, message: '角色名称必填', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      'permittedRoleList': 'renderList'
    },
    computed: {
      isQualified () {
        return (this.$store.state.userinfo.admin === true || this.$store.state.userinfo.superadmin === true)
      }
    },

    created () {
      this.getPermittedRoleList()
      this.getPermittedUserList()
    },

    methods: {
      toDetail (key) {
        this.$router.push({ path: 'role-detail', query: { key: key } })
      },
      handleSelectionChange (val) {
        console.log(val)
        this.roleSelection = val
      },
      renderList (newVal, oldVal) {
        this.totalPage = newVal.length
        this.handleCurrentChange(1)
      },
      handleCurrentChange (val) {
        this.currentPage = val
        const offset = (this.currentPage - 1) * this.currentPageSize
        let array = (this.search.key) ? this.roleSearchList : this.permittedRoleList
        console.log(offset + this.currentPageSize)
        console.log(array)
        this.currentPageList = (offset + this.currentPageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + this.currentPageSize)
      },
      handleSizeChange (val) {
        this.currentPageSize = val
        this.handleCurrentChange(1)
      },
      onSearch () {
        this.roleSearchList = this.permittedRoleList.filter(role => {
          for (const id in role) {
            if (['name'].includes(id)) {
              console.log(role[id])
              console.log(this.search.key)
              if (role[id].includes(this.search.key)) {
                return true
              }
            }
          }
        })
        this.totalPage = this.roleSearchList.length
        this.handleCurrentChange(1)
      },
      onAddRole ({ name, tags }) {
        // if (!/^[a-z][a-z0-9_]+[a-z]$/.test(key)) {
        //   this.$message.error('角色 Key 只可包含小写英文、数字和下划线，且开头和结尾只可是小写英文！')
        //   return
        // }
        let postData = {
          action: 'group', // permission/role
          method: 'POST',
          data: { name, tags }
        }
        this.addedRoleData.loading = true
        this.http.post('/user/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.addedRoleData.loading = false
            this.addedRoleData.visible = false
            this.$message.success(`成功新建角色 ${name}！`)
            this.getPermittedRoleList()
          }
        })
      },

      onEditRole ({ tags, name, key }) {
        // if (!/^[a-z][a-z0-9_]+[a-z]$/.test(key)) {
        //   this.$message.error('角色 Key 只可包含小写英文、数字和下划线，且开头和结尾只可是小写英文！')
        //   return
        // }
        let postData = {
          action: 'group',
          method: 'PUT',
          data: { tags, name, key }
        }
        this.editRoleData.loading = true
        this.http.post('/user/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.$message.success('修改成功！')
            this.editRoleData.loading = false
            this.editRoleData.visible = false
            this.getPermittedRoleList()
          }
        })
      },

      onDeleteRole ({ name, key }) {
        this.$confirm(`此操作将移除角色「${name}」，是否继续？`, '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          let postData = {
            action: 'group',
            method: 'DELETE',
            data: { key }
          }
          this.http.post('/user/', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              this.$message.success(`已移除角色「${name}」！`)
              this.getPermittedRoleList()
            }
          })
        })
      },

      onAddUser (key, users = []) {
        if (!this.userViewData.visible) {
          this.userViewData.visible = true
          this.userViewData.roleKey = key
          console.log(users)
          for (let user of this.permittedUserList) {
            if (users.includes(user)) {
              user.exsting = true
            } else {
              user.exsting = false
            }
          }
          console.log(this.permittedUserList)
          return
        }
        let postData = {
          action: 'group/user',
          method: 'POST',
          data: {
            userId_list: this.usersToAdd,
            key: this.userViewData.roleKey
          }
        }
        this.userViewData.loading = true
        this.http.post('/user/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.userViewData.loading = false
            this.userViewData.visible = false
            this.$message.success('成功添加用户！')
            this.getPermittedRoleList()
          }
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
            action: 'group/user',
            method: 'DELETE',
            data: {
              userId_list: this.usersToDelete,
              key
            }
          }
          this.http.post('/user/', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              this.$message.success('移除成功！')
              this.isCheckable = false
              this.getPermittedRoleList()
            }
          })
        }).catch(() => {
          this.usersToDelete = []
        })
      }
    }
  }
</script>

<style lang="less">
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
  .btn-area {
    margin-top: 12px;

    .cancel-btn {
      margin-left: 6px;

      span {
        border-bottom: 1px solid;
      }
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
