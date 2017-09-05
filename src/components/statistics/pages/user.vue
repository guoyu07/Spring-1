<template>
  <div class="wrapper">
    <el-row>
      <el-col :md="24" :lg="20">
        <el-card class="box-card" v-loading.body="loading">
          <time-query :time-query="timeQuery" @change-timequery="onTimeQueryChange"></time-query>
          <h3><i class="el-icon-fa-users icon-lg"></i> 用户统计</h3>
          <el-row class="margin-bottom">
            <el-dropdown @command="onSelectType">
              <el-button :plain="true">{{userOrRole === 'user' ? '用户' : '群组'}}<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="user">用户</el-dropdown-item>
                <el-dropdown-item command="group">群组</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-select
              v-show="userOrRole === 'user'"
              v-model="selectedUserOrGroup"
              value-key="nick">
              <el-option
                v-for="user in permittedUserList"
                :key="user.userId"
                :label="user.nick"
                :value="user"></el-option>
            </el-select>
            <el-select
              v-show="userOrRole === 'group'"
              v-model="selectedUserOrGroup"
              value-key="nick">
              <el-option
                v-for="role in permittedRoleList"
                :key="role.key"
                :label="role.name"
                :value="role"></el-option>
            </el-select>
          </el-row>

          <user-table
            v-if="userOrRole === 'user'"
            :statistics="statistics"
            :processes="processList"
            @on-select-process="onSelectProcess"></user-table>
          <group-table
            v-else
            :statistics="statistics"
            :processes="processList"
            @on-select-process="onSelectProcess"></group-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import getPermittedUserList from './../../../mixins/getPermittedUserList'
  import getPermittedRoleList from './../../../mixins/getPermittedRoleList'
  import getProcessList from './../../../mixins/getProcessList'
  import timeQuery from './_plugins/_timeQuery'
  import userTable from './_plugins/_userTable'
  import groupTable from './_plugins/_groupTable'

  export default {
    mixins: [getPermittedRoleList, getPermittedUserList, getProcessList],

    data () {
      return {
        timeQuery: {
          type: 'before',
          time: 1,
          unit: 'h',
          s_date: '',
          e_date: ''
        },
        userOrRole: 'user',
        selectedUserOrGroup: {},
        statistics: []
      }
    },

    watch: {
      selectedUserOrGroup () {
        this.getUserStatistics()
      }
    },

    mounted () {
      this.getPermittedRoleList()
      this.getPermittedUserList()
      this.getProcessList()
    },

    methods: {
      onSelectType (command) {
        this.userOrRole = command
      },

      onTimeQueryChange (args) {
        this.timeQuery = args.val
        if (this._validateTimequery()) {
          this.getUserStatistics()
        }
      },

      getUserStatistics (pkey = null) {
        let params = {
          pkey: pkey,
          userId: this.userOrRole === 'user' ? this.selectedUserOrGroup.userId : '',
          group_key: this.userOrRole === 'group' ? this.selectedUserOrGroup.key : '',
          time_query: this.timeQuery
        }
        let postData = {
          action: 'task/report',
          method: 'GET',
          data: params
        }
        if (!this._validateTimequery || !params.userId && !params.group_key) return
        this.http.post('/report/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.statistics = this.userOrRole === 'user' ? [{ ...res.data.data, ...{ userName: this.selectedUserOrGroup.nick, userId: this.selectedUserOrGroup.userId, groups: this.selectedUserOrGroup.groups } }] : [{ ...res.data.data, ...{ groupName: this.selectedUserOrGroup.name, users: this.selectedUserOrGroup.users, tags: this.selectedUserOrGroup.tags } }]
          }
        })
      },

      onSelectProcess (args) {
        this.getUserStatistics(args.val.pkey)
      },

      _validateTimequery () {
        switch (this.timeQuery.type) {
          case 'range':
            if (this.timeQuery.s_date && this.timeQuery.e_date) return true
            break
          case 'before':
          case 'after':
            if (this.timeQuery.time) return true
            break
          default:
            return false
        }
      }
    },

    components: { timeQuery, userTable, groupTable }
  }
</script>
