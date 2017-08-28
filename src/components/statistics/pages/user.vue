<template>
  <div>
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
                v-for="user in userList"
                :key="user.userId"
                :label="user.nick"
                :value="user"></el-option>
            </el-select>
            <el-select
              v-show="userOrRole === 'group'"
              v-model="selectedUserOrGroup"
              value-key="nick">
              <el-option
                v-for="role in roleList"
                :key="role.key"
                :label="role.name"
                :value="role"></el-option>
            </el-select>
          </el-row>

          <el-table :data="statistics">
            <el-table-column type="expand">
              <template scope="props">
                <el-table :data="props.row.list" stripe border>
                  <el-table-column
                    label="环节名称"
                    prop="tname"></el-table-column>
                  <el-table-column
                    label="执行次数"
                    prop="num"></el-table-column>
                  <el-table-column
                    label="平均耗时"
                    prop="avg_duration"></el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <template v-if="userOrRole === 'user'">
              <el-table-column
                label="用户名"
                prop="userName"></el-table-column>
              <el-table-column
                label="用户 ID"
                prop="userId"></el-table-column>
              <el-table-column
                label="所属群组"
                inline-template
                :context="_self">
                <el-tag
                  v-for="group in row.groups"
                  :key="group.key"
                  type="primary">{{group.name}}</el-tag>
              </el-table-column>
            </template>
            <template v-else>
              <el-table-column
                label="群组名"
                prop="groupName"></el-table-column>
              <el-table-column
                label="所含用户"
                inline-template
                :context="_self">
                <el-tag
                  v-for="user in row.users"
                  :key="user.userId"
                  type="primary">{{user.nick}}</el-tag>
              </el-table-column>
              <el-table-column
                label="标签"
                inline-template
                :context="_self">
                <el-tag
                  v-for="tag in row.tags"
                  :key="tag"
                  type="success">{{tag}}</el-tag>
              </el-table-column>
            </template>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import getPermittedUserList from './../../../mixins/getPermittedUserList'
  import getPermittedRoleList from './../../../mixins/getPermittedRoleList'
  import timeQuery from './_plugins/_timeQuery'

  export default {
    mixins: [getPermittedRoleList, getPermittedUserList],

    data () {
      return {
        timeQuery: {
          type: 'before',
          time: 1,
          unit: 'min',
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

      getUserStatistics () {
        let postData = {
          action: 'task/report',
          method: 'GET',
          data: {
            pkey: null,
            userId: this.userOrRole === 'user' ? this.selectedUserOrGroup.userId : '',
            group_key: this.userOrRole === 'group' ? this.selectedUserOrGroup.key : '',
            time_query: this.timeQuery
          }
        }
        if (!this._validateTimequery) return
        this.http.post('/report/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.statistics = this.userOrRole === 'user' ? [{ ...res.data.data, ...{ userName: this.selectedUserOrGroup.nick, userId: this.selectedUserOrGroup.userId, groups: this.selectedUserOrGroup.groups } }] : [{ ...res.data.data, ...{ groupName: this.selectedUserOrGroup.name, users: this.selectedUserOrGroup.users, tags: this.selectedUserOrGroup.tags } }]
          }
        })
      },

      _validateTimequery () {
        if (this.timeQuery.type === 'range' &&
            this.timeQuery.s_date &&
            this.timeQuery.e_date) {
          return true
        } else {
          return false
        }
      }
    },

    components: { timeQuery }
  }
</script>