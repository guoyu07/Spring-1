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
              <!-- <code>
                {{JSON.stringify(row.old_value)}}
              </code> -->
              <template v-for="headerform in formData.header">
                <template v-for="header in headerform.value">
                  <template v-if="row.key === header.id">
                    <el-form>
                      <form-display :item="getObject(row, true)" :form-item="header" :hide-name="false"></form-display>
                    </el-form>
                  </template>
                </template>
              </template>
              <template v-for="bodylist in formData.body.body_list">
                <template v-for="attrlist in bodylist">
                  <template v-for="attr in attrlist.value">
                    <template v-if="row.key === attr.id">
                      <el-form>
                        <form-display :item="getObject(row, true)" :form-item="attr" :hide-name="false"></form-display>
                      </el-form>
                    </template>
                  </template>
                </template>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="新值"
            inline-template
            :context="_self">
            <template>
              <!-- <code>{{JSON.stringify(row.new_value)}}</code> -->
              <template v-for="headerform in formData.header">
                <template v-for="header in headerform.value">
                  <template v-if="row.key === header.id">
                    <el-form>
                      <form-display :item="getObject(row)" :form-item="header" :show-name="false"></form-display>
                    </el-form>
                  </template>
                </template>
              </template>
              <template v-for="bodylist in formData.body.body_list">
                <template v-for="attrlist in bodylist">
                  <template v-for="attr in attrlist.value">
                    <template v-if="row.key === attr.id">
                      <el-form>
                        <form-display :item="getObject(row)" :form-item="attr" :show-name="false"></form-display>
                      </el-form>
                    </template>
                  </template>
                </template>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import formDisplay from '../../../_plugins/_headerFormDisplay.vue'
  export default {
    props: {
      pid: String,
      formData: Object
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
      },
      getObject (row, old) {
        let obj = {}
        if (old) {
          obj[row.key] = row.old_value
        } else {
          obj[row.key] = row.new_value
        }
        return obj
      }
    },

    components: {
      formDisplay
    }
  }
</script>
