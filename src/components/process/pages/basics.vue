<style lang="less" scoped>
  @import url("./../../../assets/css/variables.less");
  .search-box {
      display: flex;
      .el-input {
        width: 210px;
        height: 36px;
        margin-right: 10px;
      }
      .el-select {
        width: 140px;
        margin-right: 10px;
      }
    }
  .el-tag+.el-tag {
    margin-left: 6px;
  }
  .el-icon-edit.align {
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    right: 16px;
  }
</style>

<template>
  <div class="processes wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3><i class="el-icon-fa-circle-o icon-lg"></i> 流程基本管理</h3>
          <div class="flex-box">
            <div class="search-box">
              <el-input
                    placeholder="流程名称"
                    icon="search"
                    size="small"
                    v-model="search.pname"
                    @change="onSearch">
              </el-input>
              <el-select v-model="search.category" size="small" @change="onSearch" clearable placeholder="流程分类">
                <el-option
                  v-for="item in categoryList"
                  :key="item.key"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>     
            </div>
            <div class="bth-block" v-show="isQualified">
              <el-button type="primary" size="small" @click="dialogVisible=true">批量操作</el-button>
            </div>
          </div>
          <el-table :data="currentPageList" border @selection-change='handleSelection'>
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="流程名称" prop="pname"></el-table-column>
            <el-table-column label="流程分类" prop="category"></el-table-column>
            <el-table-column inline-template label="管理员">
            <template>
              <div>
              <el-select v-if="row.editingUser" multiple v-model="row.users" filterable remote :remote-method="filterUsers">
                <el-option v-for="user in usersFilterList"
                           :key="user.userId"
                           :label="user.nick"
                           :value="user"
                >
                <div class="fl" style="width:100%">{{user.nick}} - {{user.userId}}</div>
                <div class="fl" style="color: #8492a6; font-size:13px">{{user.email}}</div>
              </el-option>
              </el-select>
              <i v-show="row.editingUser" class="el-icon-check text-success" @click="onEdit(row, true, false)"></i>
              <i v-show="row.editingUser" class="el-icon-close text-error" @click="onCancelEdit(row, true, false)"></i>
              <div>
              <span v-for="user in row.users" v-show="!row.editingUser">{{user.nick}} </span>
              </div>
              </div>               
              <i class="el-icon-edit align text-info fr" v-show="!row.editingUser" @click="showContainer(row, true, false)"></i>
            </template>
            </el-table-column>
            <el-table-column  label="管理组" inline-template>
                <template>
                  <div>
                  <el-select v-if="row.editingGroup" multiple v-model="row.groups" filterable>
                    <el-option v-for="group in permittedRoleList"
                           :key="group.key"
                           :label="group.name"
                           :value="group"
                    ></el-option>
                  </el-select>
                  <i v-show="row.editingGroup" class="el-icon-check text-success" @click="onEdit(row, false, true)"></i>
                  <i v-show="row.editingGroup" class="el-icon-close text-error" @click="onCancelEdit(row, false, true)"></i>
                  <el-tag type="gray" v-for="group in row.groups" @click="controllUsers(row)" v-show="!row.editingGroup">{{group.name}}</el-tag>
                  <i class="el-icon-edit align text-info fr" v-show="!row.editingGroup" @click="showContainer(row, false, true)"></i>
                  </div>
                </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="fr margin-top margin-bottom"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 50, 100]"
            :page-size="+currentPageSize"
            layout="total, sizes, prev, pager, next"
            :total="totalPage">
          </el-pagination>
        </el-card>
      </el-col>
    </el-row>
  <el-dialog :visible.sync="dialogVisible" :model="simplifiedData" title="批量编辑" size="tiny">
      <el-form   label-width="72px">
        <el-form-item label="管理员" prop="simplifiedUsersId">
          <el-select v-model="simplifiedData.simplifiedUsersId" multiple  placeholder="请选择管理员" filterable remote :remote-method="filterUsers">
             <el-option v-for="user in usersFilterList"
                   :key="user.userId"
                   :label="user.nick"
                   :value="user.userId"
             >
             <div class="fl" style="width:100%">{{user.nick}} - {{user.userId}}</div>
            <div class="fl" style="color: #8492a6; font-size:13px">{{user.email}}</div>
           </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管理组" prop="simplifiedGroupsKey">
          <el-select v-model="simplifiedData.simplifiedGroupsKey" multiple placeholder="请选择管理组" filterable>
            <el-option v-for="group in permittedRoleList"
               :key="group.key"
               :label="group.name"
               :value="group.key"
        ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
     <span class="dialog-footer" slot="footer">
      <el-button type="success" @click="onIncreased">确定增加</el-button>
     </span>
  </el-dialog>
  </div>
</template>

<script>
  import getPermittedRoleList from './../../../mixins/getPermittedRoleList'
  import getPermittedUserList from './../../../mixins/getPermittedUserList'
  import getPermittedProcessList from './../../../mixins/getPermittedProcessList'

  export default {
    mixins: [getPermittedRoleList, getPermittedUserList, getPermittedProcessList],

    data () {
      return {
        dialogVisible: false,
        totalPage: 0,
        currentPage: 1,
        currentPageSize: 10,
        currentPageList: [],
        processSearchList: '',
        processList: '',
        search: { pname: '', category: '' },
        categoryList: [],
        simplifiedData: {
          simplifiedUsersId: [],
          simplifiedProcess: [],
          simplifiedGroupsKey: []
        },
        usersFilterList: []
      }
    },
    watch: {
      'permittedProcessList': 'renderList'
    },
    created () {
      this.getCategoryList(false, false)
      this.getPermittedProcessList()
      this.getPermittedUserList()
      this.getPermittedRoleList()
    },
    computed: {
      isQualified () {
        return (this.$store.state.userinfo.superadmin === true)
      }
    },
    methods: {
      filterUsers (query) {
        if (query !== '') {
          this.usersFilterList = this.permittedUserList.filter(item => {
            return item.userId.includes(query) || item.nick.includes(query)
          })
        } else {
          this.usersFilterList = this.permittedUserList
        }
      },
      onIncreased () {
        let postData = {
          action: 'process/admin',
          method: 'post',
          data: {
            pkey_list: this.simplifiedData.simplifiedProcess,
            users: this.simplifiedData.simplifiedUsersId,
            groups: this.simplifiedData.simplifiedGroupsKey
          }
        }
        this.http.post('/activiti/', this.parseData(postData)).then((res) => {
          console.log(res)
          this.dialogVisible = false
          this.getPermittedProcessList()
          this.simplifiedData.simplifiedGroupsKey = []
          this.simplifiedData.simplifiedProcess = []
          this.simplifiedData.simplifiedUsersId = []
        })
      },
      handleSelection (val) {
        console.log(val)
        this.simplifiedData.simplifiedProcess = val.map(_ => _.pkey)
      },
      onCancelEdit (row, users, groups) {
        if (users) {
          row.users = row.tempUsers
          row.editingUser = false
        }
        if (groups) {
          row.groups = row.tempGroups
          row.editingGroup = false
        }
      },
      onEdit (row, users, groups) {
        let usersId, tempUsersId, tempGroupsKey, groupsKey
        console.log(row)
        if (users) {
          usersId = row.users.map(_ => {
            return _.userId
          })
          tempUsersId = row.tempUsers.map(_ => {
            return _.userId
          })
        } else if (groups) {
          groupsKey = row.groups.map(_ => {
            return _.key
          })
          tempGroupsKey = row.tempGroups.map(_ => {
            return _.key
          })
        }
        let postData = {
          action: 'process/admin',
          method: 'delete',
          data: {
            pkey: row.pkey,
            users: users ? tempUsersId : '',
            groups: groups ? tempGroupsKey : ''
          }
        }
        this.http.post('/activiti/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            let postData = {
              action: 'process/admin',
              method: 'POST',
              data: {
                pkey: row.pkey,
                users: users ? usersId : '',
                groups: groups ? groupsKey : ''
              }
            }
            this.http.post('/activiti/', this.parseData(postData)).then((res) => {
              if (res.status === 200) {
                console.log(res.data.data)
                row.editingUser = false
                row.editingGroup = false
              }
            })
          }
        })
      },
      // 展开选择框
      showContainer (row, users, groups) {
        if (users) {
          // 先赋予选项
          this.usersFilterList = this.permittedUserList
          row.editingUser = true
          let usersList = row.users.map(user => {
            user = this.permittedUserList.find(_ => {
              return _.userId === user.userId
            })
            return user
          })
          Object.assign(row.users, usersList)
          row.tempUsers = usersList
          console.log(row)
        }
        if (groups) {
          row.editingGroup = true
          let groupList = row.groups.map(group => {
            group = this.permittedRoleList.find(_ => {
              return _.key === group.key
            })
            return group
          })
          Object.assign(row.groups, groupList)
          row.tempGroups = groupList
          console.log(row)
        }
      },
      onSearch () {
        this.processSearchList = this.permittedProcessList.filter(processe => {
          for (const id in processe) {
            if (['pname'].includes(id)) {
              console.log(processe[id])
              console.log(this.search.pname)
              if (processe[id].includes(this.search.pname)) {
                return true
              }
            }
          }
        })
        .filter(val => {
          for (let id in val) {
            if (id === 'category') {
              if (val[id] === this.search.category || this.search.category === '') {
                return true
              }
            }
          }
        })
        this.totalPage = this.processSearchList.length
        this.handleCurrentChange(1)
      },
      renderList (newVal, oldVal) {
        this.totalPage = newVal.length
        this.handleCurrentChange(1)
      },
      handleCurrentChange (val) {
        this.currentPage = val
        const offset = (this.currentPage - 1) * this.currentPageSize
        let array = (this.search.pname || this.search.category) ? this.processSearchList : this.permittedProcessList
        console.log(offset + this.currentPageSize)
        console.log(array)
        this.currentPageList = (offset + this.currentPageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + this.currentPageSize)
      },
      handleSizeChange (val) {
        this.currentPageSize = val
        this.handleCurrentChange(1)
      },
      getCategoryList (includePds, pdDetail) {
        let postData = {
          action: 'process/category',
          method: 'GET',
          data: {
            include_pds: includePds,
            pd_detail: pdDetail
          }
        }
        this.http.post('/activiti/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            console.log(res.data.data)
            this.categoryList = res.data.data.list
          }
        })
      }
    }
  }
</script>
