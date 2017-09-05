<template>
  <div class="users wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="24">
        <div class="flex-box">
          <h3 class="module-title">{{ userDetail.nick }}</h3>
          <div class="btn-block">
            <el-button :type="userDetail.status ? 'success' : 'danger'" size="small" @click="onToggleUser(userDetail)">{{ userDetail.status ? '启用' : '禁用' }}</el-button>
          </div>
        </div>
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基本信息" name="userInfo">基本信息</el-tab-pane>
          <el-tab-pane label="修改密码" name="setPassword">修改密码</el-tab-pane>
          <el-tab-pane label="修改角色" name="setRole">修改角色</el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import getPermittedUserList from './../../../mixins/getPermittedUserList'
  import getPermittedRoleList from './../../../mixins/getPermittedRoleList'
  import getAllUserList from './../../../mixins/getAllUserList'
  import getAllRoleList from './../../../mixins/getAllRoleList'

  export default {
    mixins: [getPermittedUserList, getPermittedRoleList, getAllRoleList, getAllUserList],

    data () {
      return {
        userDetail: {},
        activeTab: 'userInfo'
      }
    },

    computed: {
    },

    created () {
      this.getPermittedUserList()
      this.getPermittedRoleList()
      this.getAllRoleList()
      this.getAllUserList()
      this.renderUserDetail()
    },

    methods: {
      renderUserDetail () {
        let postData = {
          action: 'user/info',
          method: 'get',
          data: { userId: this.$route.query.userId }
        }
        this.http.post('/user/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.userDetail = res.data.data
          }
        })
      },
      onToggleUser ({ nick, userId, status }) {
        this.$confirm(`确定${status ? '启用' : '禁用'}用户 ${nick} 吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postData = {
            action: 'user',
            method: 'DELETE',
            data: { userId }
          }
          this.http.post('/user/', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              this.$message.success(`已${status ? '启用' : '禁用'}用户「${nick}」！`)
              this.getPermittedUserList()
            }
          })
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .flex-box {
    padding-bottom: 8px;
    .module-title {
      margin-bottom: 0;
    }
    align-items: center;
    border-bottom: 2px solid #ccc;
  }
</style>
