<template>
  <div>
    <h5 class="sub-title" v-if="!activityLogs.length">
      <i class="el-icon-information"></i> 暂时没有人作出变更…
    </h5>
    <el-collapse v-if="activityLogs.length">
      <el-collapse-item v-for="ac in activityLogs">
        <template slot="title">
          <el-tooltip placement="top">
            <div slot="content">
              <p><b>Email</b>: {{ac.from_user.email}}</p>
              <p><b>ID</b>: {{ac.from_user.userId}}</p>
            </div>
            <a href="javascript:;" class="tooltip-link">{{ac.from_user.code}} <i class="el-icon-fa-user-circle"></i></a>
          </el-tooltip>
          <span>作出变更 - <timeago :since="ac.ctime" :max-time="86400 * 24" :auto-update="60" :format="formatTime" locale="zh-CN"></timeago></span>
        </template>
        <el-table class="activity-table" :data="ac.text.body[0] ? [...ac.text.header, ...ac.text.body[0]] : ac.text.header" border>
          <el-table-column
            prop="key"
            label="键名"
            width="150"></el-table-column>
          <el-table-column
            label="旧值"
            inline-template
            :context="_self">
            <template>
              <code>
                {{JSON.stringify(row.old_value)}}
              </code>
            </template>
          </el-table-column>
          <el-table-column
            label="新值"
            inline-template
            :context="_self">
            <template>
              <code>{{JSON.stringify(row.new_value)}}</code>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  export default {
    props: {
      pid: String
    },

    data () {
      return {
        activityLogs: []
      }
    },

    mounted () {
      this.getActivities()
    },

    methods: {
      getActivities () {
        let postData = {
          action: 'get/modify/form/logs',
          method: 'POST',
          data: { pid: this.pid }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          this.activityLogs = res.data.data.list
        })
      }
    }
  }
</script>