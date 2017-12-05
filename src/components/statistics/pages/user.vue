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

          <line-chart
            v-show="this.userOrRole === 'user'"
            :time-query="timeQuery"
            :selected-user="selectedUserOrGroup"></line-chart>

          <el-row type="flex" justify="end" style="margin: 12px 0;">
            <el-button icon="fa-upload" type="primary" size="small">导出个人统计</el-button>
          </el-row>

          <user-table
            v-if="userOrRole === 'user'"
            :statistics="statistics"></user-table>
          <group-table
            v-else
            :statistics="statistics"></group-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import getPermittedUserList from './../../../mixins/getPermittedUserList'
  import getPermittedRoleList from './../../../mixins/getPermittedRoleList'
  import getProcessList from './../../../mixins/getProcessList'
  import timeQueryMixin from './../../../mixins/timeQuery'
  import timeQuery from './_plugins/_timeQuery'
  import lineChart from './_plugins/_lineChart'
  import userTable from './_plugins/_userTable'
  import groupTable from './_plugins/_groupTable'
  // import _ from './../../../utils/_'

  export default {
    mixins: [getPermittedRoleList, getPermittedUserList, getProcessList, timeQueryMixin],

    data () {
      return {
        timeQuery: {
          type: '',
          time: 0,
          unit: '',
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
      this.selectedUserOrGroup = this.$store.state.userinfo
      // this.$nextTick(() => {
        // this.initializeSelectedUser()
      // })
    },

    methods: {
      onSelectType (command) {
        this.userOrRole = command
        this.selectedUserOrGroup = {}
        this.statistics = []
      },

      onTimeQueryChange (args) {
        this.timeQuery = args.val
        this.getListByTimeQuery(this.getUserStatistics)
      },

      getUserStatistics (pkey = null) {
        let params = {
          userId: this.userOrRole === 'user' ? this.selectedUserOrGroup.userId : '',
          group_key: this.userOrRole === 'group' ? this.selectedUserOrGroup.key : '',
          time_query: this.timeQuery
        }
        let postData = {
          action: 'process/task/report',
          method: 'GET',
          data: params
        }
        if (!params.userId && !params.group_key) return
        this.http.post('/report/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.statistics = this.userOrRole === 'user'
              ? [{ ...res.data.data, ...{ userName: this.selectedUserOrGroup.nick, userId: this.selectedUserOrGroup.userId, groups: this.selectedUserOrGroup.groups } }]
              : [{ ...res.data.data, ...{ groupName: this.selectedUserOrGroup.name, users: this.selectedUserOrGroup.users, tags: this.selectedUserOrGroup.tags } }]
          }
        })
      }
    },

    components: { timeQuery, lineChart, userTable, groupTable }
  }
</script>

<style>
.el-tag + .el-tag {
  margin-left: 6px;
}
</style>