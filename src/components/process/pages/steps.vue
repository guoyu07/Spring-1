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
          <h3><i class="el-icon-fa-circle-o icon-lg"></i> 环节权限管理</h3>
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
          </div>
          <el-table :data="currentPageList" border>
            <el-table-column type="expand">
              <template scope="props">
                <el-table :data="props.row.task_list">
                  <el-table-column label="环节名称" prop="tname"></el-table-column>
                  <el-table-column label="候选人" inline-template>
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
                      <i v-show="row.editingUser" class="el-icon-check text-success" @click="onEdit(row, true, false, false)"></i>
                      <i v-show="row.editingUser" class="el-icon-close text-error" @click="onCancelEdit(row, true, false, false)"></i>
                      <span v-for="user in row.users" v-show="!row.editingUser">{{user.nick}} </span>
                      <i class="el-icon-edit align text-info fr" v-if="!row.editingUser" @click="showContainer(row, true, false, false)"></i>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="候选组" inline-template>
                  <template>
                    <div>
                    <el-select v-if="row.editingGroup" multiple v-model="row.groups" filterable >
                      <el-option v-for="group in permittedRoleList"
                             :key="group.key"
                             :label="group.name"
                             :value="group"
                      ></el-option>
                    </el-select>
                    <i v-show="row.editingGroup" class="el-icon-check text-success" @click="onEdit(row, false, true, false)"></i>
                    <i v-show="row.editingGroup" class="el-icon-close text-error" @click="onCancelEdit(row, false, true, false)"></i>
                    <el-tag type="gray" v-for="group in row.groups"  v-show="!row.editingGroup">{{group.name}}</el-tag>
                    <i class="el-icon-edit align text-info fr" v-show="!row.editingGroup" @click="showContainer(row, false, true, false)"></i>
                    </div>
                  </template>
                  </el-table-column>
                  <el-table-column label="受指派人" inline-template>
                    <template>
                      <div>
                      <el-select v-if="row.editingAssign"  v-model="row.assign" clearable filterable remote :remote-method="filterUsers">
                        <el-option
                          key="author"
                          label="申请人"
                          value="申请人"></el-option>
                        <el-option v-for="user in usersFilterList"
                                   :key="user.userId"
                                   :label="user.nick"
                                   :value="user"
                        >
                         <div class="fl" style="width:100%">{{user.nick}} - {{user.userId}}</div>
                         <div class="fl" style="color: #8492a6; font-size:13px">{{user.email}}</div>
                       </el-option>
                      </el-select>
                      <el-button
                        v-show="row.editingAssign"
                        size="mini"
                        style="margin-bottom: 4px"
                        @click="row.assign = '申请人'">设为申请人</el-button>
                      <i v-show="row.editingAssign" class="el-icon-check text-success" @click="onEdit(row, false, false, true)"></i>
                      <i v-show="row.editingAssign" class="el-icon-close text-error" @click="onCancelEdit(row, false, false, true)"></i>
                      <span  v-if="!row.editingAssign" >{{row.assign === '申请人' ? '申请人' : row.hasOwnProperty('assign') ? row.assign.nick : ''}}</span>
                      <i class="el-icon-edit align text-info fr" v-if="!row.editingAssign && row.hasOwnProperty('assign')" @click="showContainer(row, false, false, true)"></i>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="可管理的流程" prop="pname"></el-table-column>
            <el-table-column label="流程分类" prop="category"></el-table-column>
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
      onCancelEdit (row, users, groups, assign) {
        if (users) {
          row.users = row.tempUsers
          row.editingUser = false
        }
        if (groups) {
          row.groups = row.tempGroups
          row.editingGroup = false
        }
        if (assign) {
          row.assign = row.tempAssign
          row.editingAssign = false
        }
      },
      onEdit (row, users, groups, assign) {
        let usersId, tempUsersId, tempGroupsKey, groupsKey, tempAssignId, assignId
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
        } else if (assign) {
          if (row.assign) {
            // console.log(row)
            row.assign === '申请人' ? assignId = row.assign : assignId = row.assign.userId
            // assignId = row.assign.userId
          }
          if (row.tempAssign) {
            row.assign === '申请人' ? tempAssignId = '申请人' : tempAssignId = row.tempAssign.userId
          }
        }
        let postData = {
          action: 'process/task',
          method: 'delete',
          data: {
            pkey: row.pkey,
            tkey: row.tkey,
            users: users ? tempUsersId : '',
            groups: groups ? tempGroupsKey : '',
            assign: assign ? tempAssignId : ''
          }
        }
        this.http.post('/activiti/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            let postData = {
              action: 'process/task',
              method: 'POST',
              data: {
                pkey: row.pkey,
                tkey: row.tkey,
                users: users ? usersId : '',
                groups: groups ? groupsKey : '',
                assign: assign ? assignId : ''
              }
            }
            this.http.post('/activiti/', this.parseData(postData)).then((res) => {
              if (res.status === 200) {
                console.log(res.data.data)
                row.editingUser = false
                row.editingGroup = false
                row.editingAssign = false
              }
            })
          }
        })
      },
      // 展开选择框
      showContainer (row, users, groups, assign) {
        if (users) {
          console.log(row)
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
        if (assign) {
          // 先赋予选项
          this.usersFilterList = this.permittedUserList
          row.editingAssign = true
          if (row.assign) {
            let assign = this.permittedUserList.find(_ => {
              return _.userId === row.assign.userId
            })
            console.log(Array.isArray(assign))
            Object.assign(row.assign, assign)
            row.tempAssign = assign
          }
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
