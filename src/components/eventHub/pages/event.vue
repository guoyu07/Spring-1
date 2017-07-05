<style lang="less">
  @import url("./../../../assets/css/variables.less");
  .btn-row {
    margin: 18px 0 10px;
  }

  .ticket-num {
    font-size: 13px;
    font-weight: normal;
  }

  .el-button {
    a {
      color: inherit;

      &:hover {
        text-decoration: none;
      }
    }
  }

  .detail-block {
    margin: 6px 0 24px;

    &__heading {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAADCAYAAABS3WWCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NEQ5RDgxQzc2RjQ5MTFFMjhEMUNENzFGRUMwRjhBRTciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEQ5RDgxQzg2RjQ5MTFFMjhEMUNENzFGRUMwRjhBRTciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0RDlEODFDNTZGNDkxMUUyOEQxQ0Q3MUZFQzBGOEFFNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0RDlEODFDNjZGNDkxMUUyOEQxQ0Q3MUZFQzBGOEFFNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvXFWFAAAAAYSURBVHjaYvj//z8D0/Pnz/8zgFgAAQYAS5UJscReGMIAAAAASUVORK5CYII=) repeat-x scroll 0 10px;

      h4 {
        font-size: 16px;
        padding: 0 10px 0 6px;
        display: inline-block;
        background-color: #fff;
      }
    }

    .el-tag + .el-tag {
      margin-left: 4px;
    }

    blockquote {
      padding: 28px 25px;
      margin: 0;
      border-left: 5px solid @eoThemeColor;
      background-color: @eoSideBgColor;
      position: relative;
      word-wrap: break-word;

      &::before,
      &::after {
        color: @eoThemeColor;
        font-size: 40px;
        position: absolute;
      }

      &::before {
        top: 0;
        left: 10px;
        content: '\201C';
      }

      &::after {
        bottom: 0;
        right: 10px;
        content: '\201D';
      }
    }
  }

  .sla-form {
    .el-form-item__content {
      font-size: 20px;
      padding-left: 20px;
    }

    &__icon {
      position: absolute;
      left: -36px;
    }
  }

  .people-form,
  .dates-form {
    background-color: #fff !important;

    .el-form-item {
      width: 100% !important;
    }
  }

  // .attachment-uploader {
  //   .el-upload-list {
  //     display: flex;
  //     justify-content: flex-start;
  //     flex-wrap: wrap;
  //   }

  //   .el-upload-list__item {
  //     width: 48%;
  //     margin-right: 1%;
  //   }
  // }

  .activity-list {
    padding-left: 0;
    font-size: 14px;

    li {
      padding: 10px 12px;
      border-bottom: 1px solid @borderColor;

      &:hover {
        background-color: @eoSideBgColor;
        border-left: 4px solid @eoThemeColor;
        padding-left: 8px;
      }
    }
  }

  .activity-table {
    margin-top: 4px;

    td, th {
      height: 24px;
      font-size: 13px;
    }
  }

  .comment-detail {
    padding: 6px 8px;
    background-color: #f9fafc;
    margin-top: 4px;

    p {
      margin: 0;
    }
  }

  .tooltip-link {
    color: @primary;
  }

  .gallery {
    display: flex;
    justify-content: flex-start;

    &__picture {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      width: 150px;
      margin-right: 12px;
    }

    &__thumb {
      width: 150px;
      height: 120px;
      position: relative;
      background: #f6f6f6;
      border-radius: 8px;
      border: 2px solid #e5e5e5;
      overflow: hidden;
    }

    &__desc {
      width: 100%;
      height: 100%;
      padding: 18px 0;
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      font-size: 13px;
      z-index: @flying;
      position: relative;
      align-items: center;
      text-align: center;
      background-color: rgba(33,150,243,.8);
      color: #fff;
      font-weight: bold;
      transition: opacity .3s ease;
      opacity: 0;

      &:hover {
        opacity: 1;
      }

      span {
        max-width: 130px;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      a {
        color: inherit;
        padding: 4px 6px;

        &:hover {
          border: 1px solid;
          border-radius: 4px;
          padding-top: 3px;
        }
      }
    }

    img {
      height: 100px;
      display: block;
      margin: 0 auto;
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>

<template>
  <div class="event">
    <h3><code class="ticket-num">{{eventData.workFlowNo}}</code><br>{{eventData.variables.message[0].form.header.summary}}</h3>
    <el-row :gutter="24" type="flex" justify="end" class="btn-row">
      <el-col :span="16" :xs="24">
        <!-- <el-button size="small" icon="edit" class="fr" @click="onShowEditConf">编辑</el-button> -->
        <router-link :to="{ path: `/procedure/modify/${eventData.pid}/${eventData.pkey}/${event.name}/${eventData.id}/start` }" class="el-button el-button--plain el-button--small fr"><i class="el-icon-edit"></i> 编辑</router-link>
      </el-col>
      <el-col :span="8" :xs="24">
        <el-button-group>
          <el-button size="small" v-for="operation in operationArray">
            <router-link :to="{ path: `/procedure/incident/${eventData.taskDefinitionKey}/${eventData.id}/${eventData.name}` }">{{operation}}</router-link>
          </el-button>
        </el-button-group>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :span="16" :xs="24">
        <div class="detail-block">
          <div class="detail-block__heading">
            <h4>事件详情</h4>
          </div>
          <div class="detail-block__content">
            <el-form label-position="right" label-width="100px" :inline="true" class="form-display-info">
              <el-form-item label="类型">
                <span>事件</span>
              </el-form-item>
              <el-form-item label="状态">
                <template>
                  <el-tag v-if="eventData.name ==='待处理'" type="success">待处理</el-tag>
                  <el-tag v-if="eventData.name ==='处理中'" type="warning">处理中</el-tag>
                  <el-tag v-if="eventData.name ==='延缓中'" type="warning">延缓中</el-tag>
                  <el-tag v-if="eventData.name ==='已完成'" type="primary">已完成</el-tag>
                  <el-tag v-if="eventData.name ==='已取消'" type="danger">已取消</el-tag>
                  <el-tag v-if="eventData.name ==='已关闭'" type="gray">已关闭</el-tag>
                </template>
              </el-form-item>
              <el-form-item label="优先度" v-if="eventData.variables.message[0].form.header.priority">
                <template>
                  <span v-if="eventData.variables.message[0].form.header.priority === '高'"><i class="el-icon-fa-long-arrow-up text-error"></i> 高</span>
                  <span v-if="eventData.variables.message[0].form.header.priority === '正常'"><i class="el-icon-fa-minus text-success"></i> 正常</span>
                  <span v-if="eventData.variables.message[0].form.header.priority === '低'"><i class="el-icon-fa-long-arrow-down text-warning"></i> 低</span>
                </template>
              </el-form-item>
              <el-form-item label="分类" v-if="eventData.variables.message[0].form.header.components">
                <el-tag>{{eventData.variables.message[0].form.header.components}}</el-tag>
              </el-form-item>
              <el-form-item label="标签" v-if="eventData.variables.message[0].form.header.labels">
                <el-tag type="primary" v-for="label in eventData.variables.message[0].form.header.labels">{{label}}</el-tag>
              </el-form-item>
              <el-form-item label="关联工单" v-if="eventData.variables.message[0].form.header.issue">
                <span>{{eventData.variables.message[0].form.header.issue.code}}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div class="detail-block">
          <div class="detail-block__heading">
            <h4>事件详情</h4>
          </div>
          <div class="detail-block__content" v-if="eventData.variables.message[0].form.header.description">
            <blockquote v-html="eventData.variables.message[0].form.header.description"></blockquote>
          </div>
        </div>

        <div class="detail-block">
          <div class="detail-block__heading">
            <h4>活动</h4>
          </div>
          <div class="detail-block__content">
            <el-tabs v-model="activeTab" type="border-card">
              <el-tab-pane label="评论" name="first">
                <h5 class="sub-title" v-if="!comments.length">
                  <i class="el-icon-information"></i> 暂时没有人添加评论…
                </h5>
                <ul class="activity-list">
                  <li v-for="comment in comments">
                    <el-tooltip placement="top">
                      <div slot="content">
                        <p><b>Email</b>: {{comment.from_user.email || '无'}}</p>
                        <p><b>ID</b>: {{comment.from_user.userId}}</p>
                      </div>
                      <a href="#" class="tooltip-link">{{comment.from_user.code}} <i class="el-icon-fa-user-circle"></i></a>
                    </el-tooltip>
                    <span>添加了评论 - <timeago :since="comment.ctime" :max-time="86400 * 24" :auto-update="60" :format="formatTime" locale="zh-CN"></timeago></span>
                    <div class="comment-detail" v-html="comment.text"></div>
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="历史" name="second">
                <h5 class="sub-title"><i class="el-icon-information"></i> 完整历史步骤</h5>
                <el-collapse>
                  <el-collapse-item v-for="(task, key) in eventData.history_list" :title="(key + 1).toString() + '. ' + task.task_name">
                    <el-form label-position="left" label-width="90px" inline class="expanded-form">
                      <el-form-item v-if="task.task_key" label="任务 Key：">
                        <code>{{task.task_key}}</code>
                      </el-form-item>
                      <el-form-item v-if="task.operator" label="操作者：">
                        <span>{{task.operator.name}}</span>
                      </el-form-item>
                      <el-form-item v-if="task.time" label="处理时间：">
                        <span>{{task.time}}</span>
                      </el-form-item>
                    </el-form>
                  </el-collapse-item>
                </el-collapse>
              </el-tab-pane>
              <el-tab-pane label="活动" name="third">
                <ul class="activity-list">
                  <li>
                    <el-tooltip placement="top">
                      <div slot="content">
                        <p><b>Email</b>: xxx@xxx.com</p>
                        <p><b>ID</b>: xxx</p>
                      </div>
                      <a href="#" class="tooltip-link">Samuel Qin <i class="el-icon-fa-user-circle"></i></a>
                    </el-tooltip> 创建了事件（昨天）
                  </li>
                  <li>
                    <el-tooltip placement="top">
                      <div slot="content">
                        <p><b>Email</b>: xxx@xxx.com</p>
                        <p><b>ID</b>: xxx</p>
                      </div>
                      <a href="#" class="tooltip-link">Weimi <i class="el-icon-fa-user-circle"></i></a>
                    </el-tooltip> 作出变更（昨天）
                    <el-table class="activity-table" :data="changeData">
                      <el-table-column
                        prop="field"
                        label="字段"></el-table-column>
                      <el-table-column
                        prop="oldValue"
                        label="旧值"></el-table-column>
                      <el-table-column
                        prop="newValue"
                        label="新值"></el-table-column>
                    </el-table>
                    <!-- <p><b>优先度</b>：<i>高</i><i class="el-icon-fa-long-arrow-right"></i><i>低</i></p> -->
                  </li>
                </ul>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>

        <div class="detail-block">
          <div class="detail-block__heading">
            <h4>附件</h4>
          </div>
          <div class="detail-block__content" v-if="eventData.variables.message[0].form.header.attachments">
            <!-- <el-upload
              class="attachment-uploader"
              action="/api/upload_file/"
              :file-list="eventData.variables.message[0].form.header.attachments"
              list-type="picture"
              :with-credentials="true"
              :on-success="onUpload"
              multiple>
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip"><i class="el-icon-information"></i> 文件大小不超过 5MB</div>
            </el-upload> -->
            <div class="gallery">
              <div class="gallery__picture" v-for="pic in eventData.variables.message[0].form.header.attachments">
                <div class="gallery__thumb">
                  <img :src="'/api/download_file/' + pic.file_name" :alt="pic.desc">
                  <div class="gallery__desc">
                    <span>{{pic.desc}}</span>
                    <a :href="'/api/download_file/' + pic.file_name"><i class="el-icon-fa-download"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-block">
          <div class="detail-block__heading">
            <h4>评论</h4>
          </div>
          <div class="detail-block__content">
            <quill-editor v-model="editor.content"
                          :options="editor.options">
            </quill-editor>
            <el-row type="flex" justify="end" style="margin-top: 12px">
              <el-button type="info" size="small" :disabled="!editor.content" @click="onPostComment">发布评论</el-button>
            </el-row>
          </div>
        </div>
      </el-col>

      <el-col :span="8" :xs="24">
        <div class="detail-block" v-if="false">
          <div class="detail-block__heading">
            <h4>SLAs</h4>
          </div>
          <div class="detail-block__content">
            <el-form label-width="150px" label-position="right" class="sla-form">
              <el-form-item label="首次响应耗时">
                <span class="text-success">1:54 <i class="el-icon-check"></i></span>
              </el-form-item>
              <el-form-item label="完成耗时">
                <span class="text-success">3:54 <i class="el-icon-check"></i></span>
              </el-form-item>
              <el-form-item label="完成后关单耗时">
                <span class="text-success">23:56 <i class="el-icon-check"></i></span>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div class="detail-block">
          <div class="detail-block__heading">
            <h4>人事</h4>
          </div>
          <div class="detail-block__content">
            <el-form label-position="right" label-width="120px" class="form-display-info people-form">
              <el-form-item label="当前处理人">
                <el-tooltip placement="top" v-if="eventData.variables.message[0].form.header.assignee">
                  <div slot="content">
                    <p><b>Email</b>: {{eventData.variables.message[0].form.header.assignee.email}}</p>
                    <p><b>ID</b>: {{eventData.variables.message[0].form.header.assignee.userId}}</p>
                  </div>
                  <a href="#" class="tooltip-link">{{eventData.variables.message[0].form.header.assignee.code}} <i class="el-icon-fa-user-circle"></i></a>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="通知人">
                <el-tooltip placement="top" v-if="eventData.variables.message[0].form.header.reporter">
                  <div slot="content">
                    <p><b>Email</b>: {{eventData.variables.message[0].form.header.reporter.email || '无'}}</p>
                    <p><b>ID</b>: {{eventData.variables.message[0].form.header.reporter.userId}}</p>
                  </div>
                  <a href="#" class="tooltip-link">{{eventData.variables.message[0].form.header.reporter.code}} <i class="el-icon-fa-user-circle"></i></a>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="受邀参与者"><span v-for="person in eventData.variables.message[0].form.header.requestParticipants">{{person}} </span></el-form-item>
              <el-form-item label="追踪者"><span v-for="person in eventData.variables.message[0].form.header.watchers">{{person}} </span></el-form-item>
            </el-form>
          </div>
        </div>

        <div class="detail-block">
          <div class="detail-block__heading">
            <h4>日期</h4>
          </div>
          <div class="detail-block__content">
            <el-form label-position="right" label-width="120px" class="form-display-info people-form">
              <el-form-item label="创建时间"><span>{{eventData.variables.message[0].time}}</span></el-form-item>
              <el-form-item label="更新时间"><span>{{eventData.createTime | convertTime}}</span></el-form-item>
              <el-form-item label="完成时间" v-if="eventData.task_list.some(t => t.tkey === 'closed')"><span>{{eventData.createTime | convertTime}}</span></el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
    <event-conf :event-data="eventData.variables.message[0].form.header" :pid="eventData.pid" :visible="eventConfVisible" :is-editing="true"></event-conf>
  </div>
</template>

<script>
  import { quillEditor } from 'vue-quill-editor'
  import eventConf from './_config/_eventConf.vue'
  import Vue from 'vue'
  import VueTimeago from 'vue-timeago'

  Vue.use(VueTimeago, {
    locale: 'zh-CN',
    locales: {
      'zh-CN': require('vue-timeago/locales/zh-CN.json')
    }
  })

  export default {
    data () {
      return {
        activeTab: 'first',
        eventData: {},
        eventConfVisible: false,
        event: {
          name: '事件名',
          type: '事故',
          status: 'open',
          priority: 'high',
          components: ['分类 1', '分类 2'],
          labels: ['标签 1', '标签 2'],
          attachments: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
          assignee: 'Jason Lam',
          reporter: 'Samuel Qin',
          requestParticipants: [],
          watchers: ['Jason Lam', 'Samuel Qin', 'Weimi'],
          created: '2017-05-08 10:30:03',
          updated: '2017-05-08 10:38:03',
          resolved: '2017-05-09 11:50:09'
        },
        operationArray: [],
        comments: [],
        changeData: [{
          field: '优先度',
          oldValue: '高',
          newValue: '低'
        }, {
          field: '追踪者',
          oldValue: 'Jason Lam',
          newValue: ''
        }],
        editor: {
          content: '',
          options: {
            modules: {
              toolbar: [
                [{ 'font': [] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image']]
            },
            placeholder: '在此撰写评论…',
            theme: 'snow'
          }
        }
      }
    },

    computed: {
      taskId () {
        return this.$route.params.tkey
      }
    },

    created () {
      this.getEventData()
    },

    methods: {
      getEventData () {
        let postData = {
          action: 'runtime/task',
          method: 'GET',
          data: { taskId: this.taskId }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.eventData = res.data.data
            // Object.assign(this.eventData, res.data.data)
            // this.eventData.variables.message[0].form.header.description = window.atob(this.eventData.variables.message[0].form.header.description)
            this.getOperations()
            this.getComments()
          }
        })
      },

      getOperations () {
        let postData = {
          action: 'activiti/task/form/group',
          method: 'GET',
          data: {
            pkey: this.eventData.pkey,
            tkey: this.eventData.taskDefinitionKey,
            version: this.eventData.version
          }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.operationArray = res.data.data.form.header[0].value[0].value.regex
          }
        })
      },

      getComments () {
        let postData = {
          action: 'get/comments',
          method: 'POST',
          data: { pid: this.eventData.pid }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.comments = res.data.data.list
          }
        })
      },

      onUpload (res, file, fileList) {
        console.log(res)
        console.log(file)
        console.log(fileList)
      },

      onShowEditConf () {
        this.eventConfVisible = true
      },

      onPostComment () {
        let postData = {
          action: 'add/comment',
          method: 'POST',
          data: {
            pid: this.eventData.pid,
            text: this.editor.content
          }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.$message.success('评论成功！')
            this.editor.content = ''
            this.getComments()
            this.activeTab = 'second'
          }
        })
      }
    },

    components: {
      quillEditor,
      eventConf
    }
  }
</script>
