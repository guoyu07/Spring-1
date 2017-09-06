<template>
	<div>
		<h3>{{usersName}}</h3>
		<h5>成员列表</h5><el-button type="danger">删除用户</el-button>
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
		<el-button type='primary' @click='onSearch' :disabled='!countSelection.length'>批量操作</el-button>
		<el-button type='success' @click='onSearch'>关联用户</el-button>
		<el-table :data="renderUsersList" border @selection-change="handleSelectionChange">
		    <el-table-column type='selection'></el-table-column>
			<el-table-column prop='userId' label="用户名">
			</el-table-column>
			<el-table-column label='昵称' prop='nick'></el-table-column>
			<el-table-column label='邮箱' prop='email'></el-table-column>
			<el-table-column label='手机' prop='phone'></el-table-column>
			<el-table-column label='用户层级' prop='level' :formatter='formatLevel'></el-table-column>
			<el-table-column label='用户状态'  inline-template>
				<template>
				  <span :class="row.status ? 'text-danger' : ''">
                    {{ row.status ? '已禁用' : '使用中' }}
                  </span>
				</template>
			</el-table-column>
			<el-table-column label='操作' inline-template>
				<template>
					<el-button type='danger'>删除</el-button>
				</template>
			</el-table-column>
	    </el-table>
	</div>
</template>
<script>
	export default {
	  data () {
	    return {
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
	      usersStatus: [ {key: 0, label: '使用中'}, {key: 1, label: '已禁用'} ]
	    }
	  },
	  created () {
	    this.getUsersList()
	  },
	  watch: {},
	  methods: {
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
          console.log(res.data)
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
<style></style>