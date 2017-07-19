<style lang="less">
  .initial-value {
    position: absolute;
    left: 11px;
    top: 0;
  }

  .hybrid-form {
    .el-input__inner {
      font-family: sans-serif;
    }
  }

  .material-icons {
    display: none;
  }
</style>

<template>
  <el-dialog :title="title" v-model="visible" top="10%" class="fixed-dialog">
    <el-form label-width="100px" class="hybrid-form">
      <el-form-item label="概要">
        <el-input v-model="eventData.summary"></el-input>
      </el-form-item>
      <el-form-item label="通知人" class="hybrid-form__item">
        <el-select v-model="eventData.reporter" :placeholder="isEditing ? '' : '请选择'">
          <el-option
            v-for="user in userList"
            :label="user.code"
            :value="user"></el-option>
        </el-select>
        <span class="initial-value" v-if="eventData.reporter">{{eventData.reporter.code}}</span>
      </el-form-item>
      <el-form-item label="分类" class="hybrid-form__item">
        <el-select
          v-model="eventData.components"
          multiple
          filterable>
          <el-option label="easyops告警" value="easyops告警"></el-option>
          <el-option label="其他" value="其他"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="附件">
        <!-- <el-upload
          class="attachment-uploader"
          action="/api/upload_file/"
          :file-list="eventData.attachments"
          list-type="picture"
          :with-credentials="true"
          :before-upload="onBeforeUpload"
          :on-success="onUpload"
          multiple>
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip"><i class="el-icon-information"></i> 文件大小不超过 5MB</div>
        </el-upload> -->
        <dropzone id="myVueDropzone" url="/api/upload_file/" v-on:vdropzone-success="showSuccess" :language="{ dictDefaultMessage: '将文件拖到此处，或点击上传' }">
            <!-- Optional parameters if any! -->
            <!-- <i class="el-icon-upload2 upload-icon"></i> -->
            <input type="hidden" name="token" value="xxx">
        </dropzone>
      </el-form-item>
      <el-form-item label="描述">
        <quill-editor
          v-model="eventData.description"
          :options="editor.options">
        </quill-editor>
      </el-form-item>
      <!-- <el-form-item label="关联工单方式" class="hybrid-form__item">
        <el-select v-model="eventData.linked">
          <el-option key="related" label="相关" value="related"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="关联工单" class="hybrid-form__item">
        <el-select v-model="eventData.issue"></el-select>
      </el-form-item>
      <el-form-item label="被指派处理人" class="hybrid-form__item">
        <el-select v-model="eventData.assignee" :placeholder="isEditing ? '' : '请选择'">
          <el-option
            v-for="user in userList"
            :label="user.code"
            :value="user"></el-option>
        </el-select>
        <span class="initial-value" v-if="eventData.assignee">{{eventData.assignee.code}}</span>
      </el-form-item>
      <el-form-item label="审核人" class="hybrid-form__item">
        <el-select v-model="eventData.approver" :placeholder="isEditing ? '' : '请选择'">
          <el-option
            v-for="user in userList"
            :label="user.code"
            :value="user"></el-option>
        </el-select>
        <span class="initial-value" v-if="eventData.approver">{{eventData.approver.code}}</span>
      </el-form-item>
      <el-form-item label="优先级" class="hybrid-form__item">
        <el-select v-model="eventData.priority">
          <el-option label="低" value="低"></el-option>
          <el-option label="正常" value="正常"></el-option>
          <el-option label="高" value="高"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签" class="hybrid-form__item">
        <el-select
          v-model="eventData.labels"
          multiple
          filterable
          allow-create
          placeholder="请选择或新建标签">
          <el-option label="标签1" value="标签1"></el-option>
          <el-option label="标签2" value="标签2"></el-option>
          <el-option label="标签3" value="标签3"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span class="dialog-footer" slot="footer">
      <el-button type="success" @click="onCreate" icon="check">创建</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { quillEditor } from 'vue-quill-editor'
  import getAllUserList from './../../../../mixins/getAllUserList.js'
  import Dropzone from 'vue2-dropzone'

  export default {
    mixins: [getAllUserList],

    props: {
      eventData: Object,
      isEditing: Boolean,
      pid: String
    },

    data () {
      return {
        editor: {
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

    computed: {
      title () {
        return this.isEditing ? '编辑事件' : '创建事件'
      }
    },

    created () {
      this.getAllUserList()
    },

    mounted () {
      console.log('mounted')
      console.log(this.eventData)
      // if (this.isEditing) this.initializeEventData()
    },

    methods: {
      initializeEventData () {
        let buffer = {
          reporter: this.eventData.reporter || {},
          components: this.eventData.components || [],
          attachments: this.eventData.attachments || [],
          description: this.eventData.description || '',
          issue: this.eventData.issue || '',
          assignee: this.eventData.assignee || {},
          approver: this.eventData.approver || {},
          priority: this.eventData.priority || '',
          labels: this.eventData.labels || []
        }
        console.log(buffer)
        Object.assign(this.eventData, buffer)
        console.log(this.eventData)
      },

      showSuccess (file, res) {
        if (!this.eventData.attachments) {
          this.$set(this.eventData, 'attachments', JSON.parse(res).data)
        } else {
          this.eventData.attachments.push(JSON.parse(res).data[0])
        }
        console.log(this.eventData.attachments)
      },

      // onBeforeUpload (file) {
      //   console.log(this.eventData)
      //   if (!this.eventData.attachments) {
      //     console.log('nah')
      //     this.$set(this.eventData, 'attachments', [])
      //   }
      // },

      // onUpload (res, file, fileList) {
      //   console.log(fileList)
      //   console.log(this.eventData.attachments)
      //   console.log(res.data[0])
      //   this.eventData.attachments.push(res.data[0])
      //   console.log(this.eventData.attachments)
      // },

      onCreate () {
        // for (let field in this.eventData) {
        //   if ((field === 'components' ||
        //       field === 'description' ||
        //       field === 'issue' ||
        //       field === 'priority' ||
        //       field === 'labels') && !this.eventData[field].length) {
        //     delete this.eventData[field]
        //   }
        //   if ((field === 'reporter' ||
        //       field === 'approver' ||
        //       field === 'assignee') && this.eventData[field] === {}) {
        //     delete this.eventData[field]
        //   }
        // }
        console.log(this.eventData)
        // delete this.eventData.visible
        let postData = {}
        if (this.isEditing) {
          postData = {
            action: 'modify/form/data',
            method: 'POST',
            data: {
              pid: this.pid,
              pkey: 'incident',
              tkey: 'start',
              form: {
                header: this.eventData,
                body: []
              }
            }
          }
        } else {
          postData = {
            action: 'runtime/process/instances',
            method: 'POST',
            data: {
              pkey: 'incident',
              form: {
                header: this.eventData,
                body: []
              }
            }
          }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.$message.success('创建事件成功！')
            if (this.isEditing) {
              this.$router.go(0)
            } else {
              this.$router.push(`/event-hub/event/${res.data.data.data[0].id}`)
            }
          }
        })
      }
    },

    components: {
      quillEditor,
      Dropzone
    }
  }
</script>