<template>
  <div>
    <h5 class="sub-title" v-if="!activityLogs.length">
      <i class="el-icon-information"></i> 暂时没有人作出变更…
    </h5>
    <template v-if="activityLogs.length">
      <template v-for="ac in activityLogs">
        <p class="title">
          <el-tooltip placement="top">
            <div slot="content">
              <p><b>Email</b>: {{ac.from_user.email}}</p>
              <p><b>ID</b>: {{ac.from_user.userId}}</p>
            </div>
            <a href="javascript:;" class="tooltip-link">{{ac.from_user.code}} <i class="el-icon-fa-user-circle"></i></a>
          </el-tooltip>
          <span>作出变更 -
            <template v-if="isToday(ac.ctime)">
              <timeago :since="ac.ctime" :max-time="86400 * 24" :auto-update="60" :format="formatTime" locale="zh-CN"></timeago>
            </template>
            <template v-if="!isToday(ac.ctime)">
              {{ac.ctime}}
            </template>
          </span>
        </p>
        <el-table class="activity-table" :data="ac.text.body[0] ? [...ac.text.header, ...ac.text.body[0]] : ac.text.header" border>
          <el-table-column
            label="属性名称"
            inline-template
            :context="_self"
            width="150">
            <template>
              <template v-for="headerform in formData.header">
                <template v-for="header in headerform.value">
                  <template v-if="row.key === header.id">
                    {{header.name}}
                  </template>
                </template>
              </template>
              <template v-for="bodylist in formData.body.body_list">
                <template v-for="attrlist in bodylist">
                  <template v-for="attr in attrlist.value">
                    <template v-if="row.key === attr.id">
                      {{attr.name}}
                    </template>
                  </template>
                </template>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="旧值"
            inline-template
            :context="_self">
            <template>
              <template v-for="headerform in formData.header">
                <template v-for="header in headerform.value">
                  <template v-if="row.key === header.id">
                    <el-form>
                      <form-display :item="getObject(row, true)" :form-item="header" :hide-name="true"></form-display>
                    </el-form>
                  </template>
                </template>
              </template>
              <template v-for="bodylist in formData.body.body_list">
                <template v-for="attrlist in bodylist">
                  <template v-for="attr in attrlist.value">
                    <template v-if="row.key === attr.id">
                      <el-form>
                        <form-display :item="getObject(row, true)" :form-item="attr" :hide-name="true"></form-display>
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
              <template v-for="headerform in formData.header">
                <template v-for="header in headerform.value">
                  <template v-if="row.key === header.id">
                    <el-form>
                      <form-display :item="getObject(row)" :form-item="header" :hide-name="true"></form-display>
                    </el-form>
                  </template>
                </template>
              </template>
              <template v-for="bodylist in formData.body.body_list">
                <template v-for="attrlist in bodylist">
                  <template v-for="attr in attrlist.value">
                    <template v-if="row.key === attr.id">
                      <el-form>
                        <form-display :item="getObject(row)" :form-item="attr" :hide-name="true"></form-display>
                      </el-form>
                    </template>
                  </template>
                </template>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </template>
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
        activityLogs: [],
        contentHeight: []
      }
    },

    mounted () {
      this.getActivities()
      // console.log(this.$refs)
    },

    created () {
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
          this.$nextTick(() => {
            const elementList = document.querySelectorAll('.activity')
            for (const i in elementList) {
              this.contentHeight.push(elementList[i].scrollHeight > 100)
            }
          })
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
      },
      isToday (time) {
        const date = new Date(time)
        const today = new Date()
        const num = 24 * 60 * 60 * 1000 // 一天的毫秒数
        const timeDiff = today.getTime() - date.getTime() // 两个时间的毫秒差
        return timeDiff < num
      },
      checkMore (index) {
        this.$set(this.contentHeight, index, false)
        const elementList = document.querySelectorAll('.activity')
        elementList[index].style['max-height'] = elementList[index].scrollHeight + 'px'
      }
    },

    components: {
      formDisplay
    }
  }
</script>
<style scoped lang="less">
.el-form-item {
  display: inline-block;
  margin-bottom: 0;
  line-height: 1;
  .el-form-item__content {
    line-height: 1;
  }
}
.title {
  font-size: 14px;
  margin-top: 15px;
}
</style>
