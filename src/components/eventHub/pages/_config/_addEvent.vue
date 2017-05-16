<template>
  <el-dialog title="创建事件" v-model="addEventData.visible" top="10%" class="fixed-dialog">
    <el-form label-width="100px" class="hybrid-form">
      <el-form-item label="概要">
        <el-input v-model="addEventData.event.summary"></el-input>
      </el-form-item>
      <el-form-item label="通知人" class="hybrid-form__item">
        <el-select v-model="addEventData.event.reporter">
          <el-option
            v-for="user in userList"
            :label="user.code"
            :value="user.userId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类" class="hybrid-form__item">
        <el-select
          v-model="addEventData.event.components"
          multiple
          filterable></el-select>
      </el-form-item>
      <el-form-item label="附件">
        <el-upload
          class="attachment-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          drag
          multiple
          :thumbnail-mode="true"
          :file-list="addEventData.event.attachments"
          :auto-upload="false">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip"><i class="el-icon-information"></i> 文件大小不超过 5MB</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="描述">
        <quill-editor
          v-model="addEventData.event.description"
          :options="editor.options">
        </quill-editor>
      </el-form-item>
      <!-- <el-form-item label="关联工单方式" class="hybrid-form__item">
        <el-select v-model="addEventData.event.linked">
          <el-option key="related" label="相关" value="related"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="关联工单" class="hybrid-form__item">
        <el-select v-model="addEventData.event.issue"></el-select>
      </el-form-item>
      <el-form-item label="被指派处理人" class="hybrid-form__item">
        <el-select v-model="addEventData.event.assignee">
          <el-option
            v-for="user in userList"
            :label="user.code"
            :value="user.userId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核人" class="hybrid-form__item">
        <el-select v-model="addEventData.event.approvers" multiple>
          <el-option
            v-for="user in userList"
            :key="user.code"
            :label="user.code"
            :value="user.userId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优先级" class="hybrid-form__item">
        <el-select v-model="addEventData.event.priority">
          <el-option label="低" value="low"></el-option>
          <el-option label="中" value="medium"></el-option>
          <el-option label="高" value="high"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签" class="hybrid-form__item">
        <el-select
          v-model="addEventData.event.labels"
          multiple
          filterable
          allow-create
          placeholder="请选择或新建标签">
          <el-option label="标签 1" value="label-1"></el-option>
          <el-option label="标签 2" value="label-2"></el-option>
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

  export default {
    mixins: [getAllUserList],

    props: {
      addEventData: Object
    },

    created () {
      this.getAllUserList()
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

    methods: {
      onCreate () {}
    },

    components: {
      quillEditor
    }
  }
</script>