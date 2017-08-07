<template>
  <div>
    <h5 class="sub-title" v-if="!activityLogs.length">
      <i class="el-icon-information"></i> 暂时没有人作出变更…
    </h5>
    <!-- <el-collapse v-if="activityLogs.length">
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
      </el-collapse-item>
    </el-collapse> -->
    <template v-if="activityLogs.length">
      <div class="media" v-for="(log, logIndex) in activityLogs">
        <div class="media-left">
          <a class="media-object" href="#">
            {{log.from_user.userId[0]}}
          </a>
        </div>
        <div class="media-body">
          <!-- <h4 class="media-heading">{{log.from_user.userId}}</h4> -->
          <div class="media-body__content">
            <div class="activity">
              <div v-for="text in (log.text.body[0] ? [...log.text.header, ...log.text.body[0]] : log.text.header)">
                <span class="name">{{log.from_user.userId}}</span> 把
                <template>
                  <template v-for="headerform in formData.header">
                    <template v-for="header in headerform.value">
                      <template v-if="text.key === header.id">
                        {{header.name}} 更新为
                        <el-form>
                          <form-display :item="getObject(text)" :form-item="header" :hide-name="true"></form-display>
                        </el-form>
                      </template>
                    </template>
                  </template>
                  <template v-for="bodylist in formData.body.body_list">
                    <template v-for="attrlist in bodylist.attr_list">
                      <template v-for="attr in attrlist.value">
                        <template v-if="text.key === attr.id">
                          {{attr.name}} 更新为
                          <el-form>
                            <form-display :item="getObject(text)" :form-item="attr" :hide-name="true"></form-display>
                          </el-form>
                        </template>
                      </template>
                    </template>
                  </template>
                </template>
              </div>
              <el-button type="text" icon="arrow-up" v-if="contentHeight.length && contentHeight[logIndex] > 100" @click="onRetract(logIndex)">收起</el-button>
            </div>
            <el-button type="text" icon="arrow-down" v-if="isAbove.length && isAbove[logIndex]" @click="checkMore(logIndex)" class="checkMore">全部</el-button>
            <!-- <a v-if="isAbove.length && isAbove[logIndex]" class="more" href="###" @click="checkMore(logIndex)">查看全部...</a> -->
          </div>
          <p class="time">
            <i class="el-icon-fa-clock-o text-info"></i>
            <!-- <i class="el-icon-date"></i> -->
            <template v-if="isToday(log.ctime)">
              <timeago :since="log.ctime" :max-time="86400 * 24" :auto-update="60" :format="formatTime" locale="zh-CN"></timeago>
            </template>
            <template v-if="!isToday(log.ctime)">
              {{log.ctime}}
            </template>
          </p>
        </div>
      </div>
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
        isAbove: [],
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
              this.isAbove.push(elementList[i].scrollHeight > 100)
              this.contentHeight.push(elementList[i].scrollHeight)
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
        this.$set(this.isAbove, index, false)
        const elementList = document.querySelectorAll('.activity')
        elementList[index].style['max-height'] = elementList[index].scrollHeight + 'px'
      },
      onRetract (index) {
        this.$set(this.isAbove, index, true)
        const elementList = document.querySelectorAll('.activity')
        elementList[index].style['max-height'] = '100px'
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
.media {
  display: flex;
  margin-bottom: 8px;
  border-bottom: 1px dashed #ccc;
  .media-left {
    display: block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #ccc;
    margin-right: 8px;
    .media-object {
      display: block;
      width: 100%;
      line-height: 42px;
      text-align: center;
      font-size: 30px;
      color: #fff;
    }
  }
  .media-body {
    font-size: 14px;
    width: calc(~"100% - 58px");
    .activity {
      max-height: 100px;
      overflow: hidden;
    }
    .more {
      display: block;
      width: 100%;
      // text-align: center;
      padding: 5px 0;
      color: #888;
      &:hover {
        background-color: #eef1f6;
        text-decoration: none;
      }
    }
    .name {
      color: #06c;
      margin-right: 5px;
    }
    form {
      display: inline-block;
    }
    .time {
      font-size: 12px;
      color: #888;
      margin-top: 5px;
      i {
        margin-right: 5px;
      }
    }
  }
}
.checkMore {
  display: block;
  width: 100%;
  text-align: left;
  position: relative;
  &:before {
    content: '';
    position: absolute;
    top: -40px;
    left: 0;
    display: block;
    width: 100%;
    height: 50px;
    background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1) 70%);
  }
}
</style>
