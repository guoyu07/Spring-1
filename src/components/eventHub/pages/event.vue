<style lang="less">
  @import url("./../../../assets/css/variables.less");
  .detail-block {
    margin: 6px 0 24px;

    &__heading {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAADCAYAAABS3WWCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NEQ5RDgxQzc2RjQ5MTFFMjhEMUNENzFGRUMwRjhBRTciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEQ5RDgxQzg2RjQ5MTFFMjhEMUNENzFGRUMwRjhBRTciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0RDlEODFDNTZGNDkxMUUyOEQxQ0Q3MUZFQzBGOEFFNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0RDlEODFDNjZGNDkxMUUyOEQxQ0Q3MUZFQzBGOEFFNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvXFWFAAAAAYSURBVHjaYvj//z8D0/Pnz/8zgFgAAQYAS5UJscReGMIAAAAASUVORK5CYII=) repeat-x scroll 0 10px;

      h4 {
        font-size: 16px;
        padding: 0 4px;
        display: inline-block;
        background-color: #fff;
      }
    }

    .el-tag + .el-tag {
      margin-left: 4px;
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

  .attachment-uploader {
    .el-upload-list {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
    }

    .el-upload-list__item {
      width: 48%;
      margin-right: 1%;
    }
  }

  .activity-list {
    padding-left: 0;
    font-size: 14px;

    li {
      padding: 10px 12px;
      border-bottom: 1px solid @borderColor;

      &:hover {
        background-color: @bgLighter;
      }
    }
  }
</style>

<template>
  <div class="event">
    <h3>{{event.name}}</h3>
    <el-row :gutter="24">
      <el-col :span="16" :xs="24">
        <div class="detail-block">
          <div class="detail-block__heading">
            <h4>事件详情</h4>
          </div>
          <div class="detail-block__content">
            <el-form label-position="right" label-width="100px" :inline="true" class="form-display-info">
              <el-form-item label="类型">
                <span>{{event.type}}</span>
              </el-form-item>
              <el-form-item label="状态">
                <template>
                  <el-tag v-if="event.status ==='OPEN'" type="success">OPEN</el-tag>
                  <el-tag v-if="event.status ==='PENDING'" type="warning">PENDING</el-tag>
                  <el-tag v-if="event.status ==='CLOSED'" type="error">CLOSED</el-tag>
                </template>
              </el-form-item>
              <el-form-item label="优先度">
                <template>
                  <span v-if="event.priority === 'high'"><i class="el-icon-fa-long-arrow-up text-error"></i> 高</span>
                  <span v-if="event.priority === 'medium'"><i class="el-icon-fa-long-arrow-up text-warning"></i> 中</span>
                  <span v-if="event.priority === 'low'"><i class="el-icon-fa-long-arrow-down text-success"></i> 低</span>
                </template>
              </el-form-item>
              <el-form-item label="分类">
                <span v-for="comp in event.components">{{comp}}</span>
              </el-form-item>
              <el-form-item label="标签">
                <el-tag type="gray" v-for="label in event.labels">{{label}}</el-tag>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div class="detail-block">
          <div class="detail-block__heading">
            <h4>附件</h4>
          </div>
          <div class="detail-block__content">
            <el-upload
              class="attachment-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :file-list="event.attachments"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip"><i class="el-icon-information"></i> 文件大小不超过 5MB</div>
            </el-upload>
          </div>
        </div>

        <div class="detail-block">
          <div class="detail-block__heading">
            <h4>活动</h4>
          </div>
          <div class="detail-block__content">
            <el-tabs v-model="activeTab" type="card">
              <el-tab-pane label="全部" name="first">
                <ul class="activity-list">
                  <li>
                    <el-tooltip content="用户详情" placement="top">
                      <a href="">Samuel Qin[Admin]</a>
                    </el-tooltip> 创建了事件（昨天）
                  </li>
                  <li>
                    <el-tooltip content="用户详情" placement="top">
                      <a href="">Weimi</a>
                    </el-tooltip> 作出变更（昨天）
                    <p><b>优先度</b>：<i>高</i><i class="el-icon-fa-long-arrow-right"></i><i>低</i></p>
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="评论" name="second"></el-tab-pane>
              <el-tab-pane label="日志" name="third"></el-tab-pane>
              <el-tab-pane label="历史" name="fourth"></el-tab-pane>
              <el-tab-pane label="活动" name="fifth"></el-tab-pane>
            </el-tabs>
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
              <el-button type="info" size="small" :disabled="!editor.content">发布评论</el-button>
            </el-row>
          </div>
        </div>
      </el-col>

      <el-col :span="8" :xs="24">
        <div class="detail-block">
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
              <el-form-item label="被指派者"><span>{{event.assignee}}</span></el-form-item>
              <el-form-item label="发起者"><span>{{event.reporter}}</span></el-form-item>
              <el-form-item label="受邀参与者"><span v-for="person in event.requestParticipants">{{person}} </span></el-form-item>
              <el-form-item label="追踪者"><span v-for="person in event.watchers">{{person}} </span></el-form-item>
            </el-form>
          </div>
        </div>

        <div class="detail-block">
          <div class="detail-block__heading">
            <h4>日期</h4>
          </div>
          <div class="detail-block__content">
            <el-form label-position="right" label-width="120px" class="form-display-info people-form">
              <el-form-item label="创建"><span>{{event.created}}</span></el-form-item>
              <el-form-item label="发起者"><span>{{event.updated}}</span></el-form-item>
              <el-form-item label="完成"><span>{{event.resolved}}</span></el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { quillEditor } from 'vue-quill-editor'

  export default {
    data () {
      return {
        activeTab: 'first',
        event: {
          name: '事件名',
          type: '事故',
          status: 'OPEN',
          priority: 'high',
          components: ['分类 1', '分类 2'],
          labels: ['标签 1', '标签 2'],
          attachments: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
          assignee: 'Jason Lam',
          reporter: 'Samuel Qin',
          requestParticipants: [],
          watchers: ['Jason Lam', 'Samuel Qin', 'Weimi'],
          created: '2017-05-08',
          updated: '2017-05-08',
          resolved: '2017-05-09'
        },
        editor: {
          content: '<p>Comment here...</p>',
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
            theme: 'snow'
          }
        }
      }
    },

    components: {
      quillEditor
    }
  }
</script>