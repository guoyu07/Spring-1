<template>
  <div class="roles wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card>
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
                size="small"
                icon="search"
                v-model="search.key"
                @change="onSearch()"
                >
              </el-input>
            </div>
            <div class="btn-block" v-show="isQualified">
              <!-- <el-button v-if="$store.state.userinfo.level === 0" :disabled="!roleSelection.length" icon="edit" type="primary" @click="editRoleData.visible = true">批量编辑</el-button> -->
              <el-button :disabled="!isQualified" icon="plus" size="small" type="success" @click="addedRoleData.visible = true">添加角色</el-button>
            </div>
          </div>
          <el-table
            :data="currentPageList"
            border
            @selection-change="handleSelectionChange"
            >
            <!-- <el-table-column type="selection" width="50"></el-table-column> -->
            <el-table-column prop="name" label="角色名"width="100"></el-table-column>
            <el-table-column inline-template label="管理员">
            <template>
              <el-tag v-for="user in row.users" v-if="user.level<=1">{{user.nick}}</el-tag>
            </template>
            </el-table-column>
            <el-table-column  label="所属用户" inline-template>
                <template>
                  <el-tag type="gray" v-for="user in row.users">{{user.nick}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
              v-show="isQualified"
              label="操作"
              width="80"
              inline-template>
              <template>
                <el-button size="small">
                  <router-link :to="{ path: 'role-detail', query: { key: row.key } }">查看</router-link>
                </el-button>
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
    <el-dialog title="新建角色" size="tiny" v-model="addedRoleData.visible">
      <el-form :rules="roleFormRules" label-width="100px" :model="addedRoleData.role" ref="addedRoleData.role">
        <el-form-item label="角色名称" prop="nick" >
          <el-input v-model="addedRoleData.role.nick" placeholder="请填写角色名称" ></el-input>
          <el-input style="display:none"></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button :disabled="!isQualified" @click="onAddRole()" icon="check" type="info" :loading="addedRoleData.loading">确认新建</el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog title="批量编辑" size="tiny" v-model="editRoleData.visible">
      <el-form label-width="100px">
        <el-form-item label="管理员" prop="managers">
          <el-select v-model="editRoleData.role.managers" multiple>
            <el-option v-for="user in managerList" :key="user.userId" :label="user.userId" :value='user.userId'>
              <div class="fl " style="width:100%">{{user.userId}}</div>
              <div class="fl" style="color: #8492a6; font-size:13px">{{user.email}}</div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属用户" prop="users">
          <el-select v-model="editRoleData.role.users" multiple>
            <el-option v-for="user in userList" :key="user.userId" :label="user.userId" :value='user.userId'>
              <div class="fl " style="width:100%">{{user.userId}}</div>
              <div class="fl" style="color: #8492a6; font-size:13px">{{user.email}}</div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span class="dialog-footer" slot="footer">
        <el-button @click="onEditRole(editRoleData.role)" icon="check" type="info" :loading="editRoleData.loading">确认</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
  // import getAllUserList from './../../../mixins/getAllUserList'
  export default {
    // mixins: [getAllUserList],
    data () {
      return {
        roleFormRules: {
          nick: [
            { required: true, message: '角色名称必填', trigger: 'change' }
          ]
        },
        search: {
          key: ''
        },
        roleList: [],
        managerList: [],
        totalPage: 0,
        currentPageList: [],
        roleSelection: [],
        currentPage: 1,
        currentPageSize: 20,
        roleSearchList: [],
        usersToAdd: [],
        usersToDelete: [],
        isCheckable: false,
        addedRoleData: {
          visible: false,
          loading: false,
          role: {
            nick: ''
          }
        }
        // editRoleData: {
        //   visible: false,
        //   loading: false,
        //   role: {
        //     managers: [],
        //     users: []
        //   }
        // },
      }
    },
    watch: {
      'roleList': 'renderList'
      // 'userList': 'renderManagerList'
    },
    computed: {
      isQualified () {
        return (this.$store.state.userinfo.admin === true || this.$store.state.userinfo.superadmin === true)
      }
    },

    created () {
      this.getAllRoleList()
      // this.getAllUserList()
    },

    methods: {
      // renderManagerList (newVal, oldVal) {
      //   this.managerList = newVal.filter(user => { return user.level > 1 })
      // },
      getAllRoleList () {
        let postData = {
          action: 'groups/all',
          method: 'GET',
          data: {
            include_user: 'true'
          }
        }
        this.http.post('/base/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.roleList = res.data.data.list
            console.log(this.roleList)
          }
        })
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
        let array = (this.search.key) ? this.roleSearchList : this.roleList
        console.log(offset + this.currentPageSize)
        console.log(array)
        this.currentPageList = (offset + this.currentPageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + this.currentPageSize)
      },
      handleSizeChange (val) {
        this.currentPageSize = val
        this.handleCurrentChange(1)
      },
      onSearch () {
        this.roleSearchList = this.roleList.filter(role => {
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
      onAddRole () {
        // if (!/^[a-z][a-z0-9_]+[a-z]$/.test(key)) {
        //   this.$message.error('角色 Key 只可包含小写英文、数字和下划线，且开头和结尾只可是小写英文！')
        //   return
        // }
        console.log(this.addedRoleData.role.nick)
        this.$refs['addedRoleData.role'].validate((valid) => {
          if (valid) {
            let postData = {
              action: 'group', // permission/role
              method: 'POST',
              data: { name: this.addedRoleData.role.nick, tags: [] }
            }
            this.addedRoleData.loading = true
            this.http.post('/user/', this.parseData(postData)).then((res) => {
              if (res.status === 200) {
                this.addedRoleData.loading = false
                this.addedRoleData.visible = false
                this.$message.success(`成功新建角色 ${this.addedRoleData.role.nick}！`)
                this.getAllRoleList()
              }
            })
          } else {
            return false
          }
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
