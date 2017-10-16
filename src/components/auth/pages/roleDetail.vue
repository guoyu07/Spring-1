<template>
	<div class="users wrapper">
   <el-row>
     <el-col :sm="24" :md="24" :lg="24">
      <div class="flex-box1">
    		<h3 class="module-title">{{usersName}}</h3>
        <div class="btn-block">
    	   <el-button type="danger" @click="deleteRole" size="small" v-show="isQualified">删除角色</el-button>
        </div>
      </div>
        <h5 class='second-title'>成员列表</h5>
        <div class="flex-box2">
          <div class="search-box">
        		<el-input
        		placeholder="根据⽤用户名或基本信息搜索"
                        icon="search"
                        v-model="search.key"
                        @change="onSearch"></el-input>
        		<el-select placeholder='所有用户层级' v-model='search.role1' clearable @change='onSearch'>
        			<el-option v-for='user in usersLevel' :key='user.key' :label='user.label' :value='user.key' ></el-option>
        		</el-select>
        		<el-select placeholder='所有用户状态' v-model='search.role2' clearable @change='onSearch'>
        			<el-option v-for='user in usersStatus' :key='user.key' :label='user.label' :value='user.key' ></el-option>
        		</el-select>
         </div>
         <div class="btn-box" v-show="isQualified">
      		<el-button type='primary' @click='deleteSelectedGroup' :disabled='!countSelection.length'>批量删除</el-button>
      		<el-button type='success' @click="correlateUsers()">关联用户</el-button>
         </div>
      </div>
    		<el-table :data="currentPageList" border @selection-change="handleSelectionChange">
    		    <el-table-column type='selection' :selectable='forbiddenChoice'></el-table-column>
    			<el-table-column prop='userId' label="用户名">
    			</el-table-column>
    			<el-table-column label='昵称' prop='nick'></el-table-column>
    			<el-table-column label='邮箱' prop='email'></el-table-column>
    			<el-table-column label='手机' prop='phone'></el-table-column>
    			<el-table-column label='用户层级' prop='level' :formatter='formatLevel' ></el-table-column>
    			<el-table-column label='用户状态'  inline-template>
    				<template>
    				  <span :class="row.status ? 'text-danger' : ''">
                {{ row.status ? '已禁用' : '使用中' }}
              </span>
    				</template>
    			</el-table-column>
    			<el-table-column label='操作' inline-template v-if="isQualified" width="170px">
    				<template>
    					<el-button type='danger'  size="small" @click="deleteRow(row.userId)">删除</el-button>
              <el-button type='primary' :disabled="row.level !== 2" size="small" @click="upgrade(row.userId)">提高等级</el-button>
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
            layout="total, sizes, prev, pager, next"
            :total="totalPage">
          </el-pagination>
        <el-dialog title="加入用户" size="tiny" v-model="joinUserGroup">
          <h5 class="sub-title" style="margin-top: 0"><i class="el-icon-information"></i> 勾选欲加入的用户：</h5>
          <el-select v-model="usersToAdd" multiple filterable remote :remote-method="usersFilter">
            <el-option v-for="user in usersFilterList" :key="user.userId" :label="user.userId" :value='user.userId'>
              <div class="fl" style="width:100%">{{user.nick}} - {{user.userId}}</div>
              <div class="fl" style="color: #8492a6; font-size:13px">{{user.email}}</div>
            </el-option>
          </el-select>
          <span class="dialog-footer" slot="footer">
            <el-button @click="confirmAddUser">确认加入</el-button>
          </span>
        </el-dialog>
      </el-col>
    </el-row>
	</div>

</template>
<script>
import getAllUserList from './../../../mixins/getAllUserList'
export default {
  mixins: [getAllUserList],
  data () {
    return {
      usersToAdd: [],
      userListToAdd: [],
      usersFilterList: [],
      joinUserGroup: false,
      selectedUserList: [],
      search: {
        key: '',
        role1: '',
        role2: ''
      },
      usersName: '',
      countSelection: [],
      usersList: [],
      renderUsersList: [],
      usersLevel: [ {key: 0, label: '超级管理员'}, {key: 1, label: '管理员'}, {key: 2, label: '普通用户'} ],
      usersStatus: [ {key: 0, label: '使用中'}, {key: 1, label: '已禁用'} ],
      currentPage: 1,
      currentPageSize: 10,
      currentPageList: [],
      totalPage: 0
    }
  },
  created () {
    this.getUsersList()
    this.getAllUserList()
    // this.insideGroup()
  },
  watch: {
    'userList': 'getArr',
    'renderUsersList': 'renderList'
  },
  computed: {
    isQualified () {
      let arr = this.$store.state.userinfo.groups.map((val) => {
        return val.key
      })
      let key = +this.$route.query.key
      let level = this.$store.state.userinfo.level
      if (level > 1) {
        return false
      }
      return arr.includes(key) || this.$store.state.userinfo.level === 0
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.currentPage = val
      const offset = (this.currentPage - 1) * this.currentPageSize
      let array = (this.search.key) ? this.renderUsersList : this.renderUsersList
      this.currentPageList = (offset + this.currentPageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + this.currentPageSize)
    },
    handleSizeChange (val) {
      this.currentPageSize = val
      this.handleCurrentChange(1)
    },
    renderList (newVal, oldVal) {
      this.totalPage = newVal.length
      this.handleCurrentChange(1)
    },
    // insideGroup () {
    //   console.log(this.$store.state.userinfo.groups)
    //   let arr = this.$store.state.userinfo.groups.map((val) => {
    //     return val.key
    //   })
    //   let key = this.$route.query.key
    //   if (arr.includes(key)) {
    //     this.isQualified = true
    //   }
    //   console.log(this.isQualified)
    // },
    correlateUsers () {
      this.joinUserGroup = true
      this.usersFilter('')
    },
    usersFilter (query) {
      if (query !== '') {
        this.usersFilterList = this.userListToAdd.filter(item => {
          return item.userId.includes(query) || item.nick.includes(query)
        })
      } else {
        this.usersFilterList = this.userListToAdd
      }
    },
    upgrade (val) {
      this.$confirm('确认提高等级？', '提示', {
        confirmButtonText: '确定',
        cancelButonText: '取消',
        type: 'warning'
      }).then(() => {
        let postData = {
          action: 'group/user/admin',
          method: 'post',
          data: {
            key: this.$route.query.key,
            userId: val
          }
        }
        this.http.post('/user/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '提高成功'
            })
            this.getUsersList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提高'
        })
      })
    },
    getArr () {
      let arr1 = this.usersList.map((val) => {
        return val.userId
      })
      this.userListToAdd = this.userList.filter(val => {
        return !arr1.includes(val.userId)
      })
    },
    confirmAddUser () {
      console.log(this.usersToAdd)
      let postData = {
        action: 'group/user',
        method: 'post',
        data: {
          key: this.$route.query.key,
          userId_list: this.usersToAdd
        }
      }
      this.http.post('/user/', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          this.usersToAdd = []
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.joinUserGroup = false
          this.getUsersList()
        }
      })
    },
    forbiddenChoice (row, index) {
      if (row.level !== 0 && row.userId !== this.$store.state.userinfo.userId) {
        return true
      }
    },
    deleteRow (val) {
      this.$confirm('确认删除选定用户？', '提示', {
        confirmButtonText: '确定',
        cancelButonText: '取消',
        type: 'warning'
      }).then(() => {
        let postData = {
          action: 'group/user',
          method: 'delete',
          data: {
            key: this.$route.query.key,
            userId_list: [val]
          }
        }
        console.log(postData)
        this.http.post('/user/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getUsersList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteSelectedGroup () {
      this.$confirm('确认删除选定用户？', '提示', {
        confirmButtonText: '确定',
        cancelButonText: '取消',
        type: 'warning'
      }).then(() => {
        this.selectedUserList = this.countSelection.map((val) => {
          return val.userId
        })
        let postData = {
          action: 'group/user',
          method: 'delete',
          data: {
            key: this.$route.query.key,
            userId_list: this.selectedUserList
          }
        }
        console.log(postData)
        this.http.post('/user/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getUsersList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteRole () {
      this.$confirm('确认删除角色？', '提示', {
        confirmButtonText: '确定',
        cancelButonText: '取消',
        type: 'warning'
      }).then(() => {
        let postData = {
          action: 'group',
          method: 'delete',
          data: {
            key: this.$route.query.key
          }
        }
        this.http.post('/user/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.$router.go(-1)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSelectionChange (val) {
      this.countSelection = val
    },
    formatLevel (row, col) {
      switch (row.level) {
        case 0: return '超级管理员'
        case 1: return '管理员'
        case 2: return '普通用户'
        default:
      }
    },
    getUsersList () {
      let postData = {
        action: 'group',
        method: 'get',
        data: { key: this.$route.query.key }
      }
      this.http.post('/user/', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          this.usersName = res.data.data.name
          this.usersList = res.data.data.users
          this.renderUsersList = this.usersList
        }
      })
    },
    onSearch () {
      this.renderUsersList = this.usersList.filter((val) => {
        for (let id in val) {
          if (['email', 'nick', 'phone', 'userId'].includes(id)) {
            console.log(val[id])
            console.log(this.search.key)
            if (val[id].includes(this.search.key)) {
              return true
            }
          }
        }
      })
      .filter(val => {
        for (let id in val) {
          if (id === 'level') {
            if (val[id] === this.search.role1 || this.search.role1 === '') {
              return true
            }
          }
        }
      })
      .filter(val => {
        for (let id in val) {
          if (id === 'status') {
            if (val[id] === this.search.role2 || this.search.role2 === '') {
              return true
            }
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .flex-box1 {
     display: flex;
  justify-content: space-between;
    padding-bottom: 8px;
    .module-title {
      margin-bottom: 0;
    }
    align-items: center;
    border-bottom: 2px solid #ccc;
  }
  .second-title {
    margin-top:10px;
  }
  .flex-box2 {
     display: flex;
  justify-content: space-between;
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
    margin-bottom:10px;
  }

</style>
