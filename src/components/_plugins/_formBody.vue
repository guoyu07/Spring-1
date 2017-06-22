<template>
  <el-form-item
    v-if="formItem.value.type !== 'table' && formItem.value.type !== 'search_bar'"
    :prop="prop(formItem)"
    :label="formItem.name"
    :rules="rules(formItem)"
    :class="formItem.isAlias || ['file', 'files'].includes(formItem.value.type) ? 'blockElement' : ''">
    <!-- <el-input
      v-if="formItem.value.type === 'str'"
      v-model="item[formItem.id]">
    </el-input> -->
    <span v-if="formItem.value.type === 'str'">
      <!-- 普通表单填写 不管需不需要提交 都是这样 -->
      <el-input
        v-if="!formItem.readonly"
        :type="formItem.isAlias ? 'textarea' : 'text'"
        :autosize="{ minRows: 5}"
        v-model="item[formItem.id]">
      </el-input>
      <!-- 读取默认值并提交 -->
      <el-input
        v-if="formItem.readonly && formItem.need_submit"
        v-model="item[formItem.id]"
        disabled>
      </el-input>
      <!-- 读取默认值不提交 -->
      <span v-if="formItem.readonly && !formItem.need_submit">
        <span v-if="formItem.default.type === 'static'">
          {{formItem.default.value}}
        </span>
        <span v-else-if="formItem.default.type === 'form_header'">
          {{ getPathResult(whole.header, formItem.default.key_path) ? getPathResult(whole.header, formItem.default.key_path) : '' }}
        </span>
        <span v-else-if="formItem.default.type === 'message_header'">
          {{ getPathResult(message.header, formItem.default.key_path) ? getPathResult(message.header, formItem.default.key_path) : '' }}
        </span>
        <span v-else-if="formItem.default.type === 'form_body'">
          {{ getPathResult(whole.body, formItem.default.key_path, index) ? getPathResult(whole.body, formItem.default.key_path, index) : '' }}
        </span>
        <span v-else-if="formItem.default.type === 'message_body'">
          {{ getPathResult(message.body, formItem.default.key_path, index) ? getPathResult(message.body, formItem.default.key_path, index) : '' }}
        </span>
      </span>
    </span>
    <el-input-number
      v-else-if="formItem.value.type === 'int'"
      v-model="item[formItem.id]"
      :disabled="formItem.readonly">
    </el-input-number>
    <quill-editor
      v-else-if="formItem.value.type === 'richtext'"
      v-model="item[formItem.id]"
      :options="editor.options">
    </quill-editor>
    <template v-else-if="['file', 'files'].includes(formItem.value.type)">
      <template v-if="isEditing">
        <h4 class="sub-title" style="margin: 0;"><i class="el-icon-information"></i> 已有的附件：</h4>
        <div class="gallery" style="margin-bottom: 12px;">
          <div class="gallery__picture" v-for="pic in item[formItem.id]">
            <div class="gallery__thumb">
              <img :src="'/api/download_file/' + pic.file_name" :alt="pic.desc">
              <div class="gallery__desc">
                <span>{{pic.desc}}</span>
                <div>
                  <a :href="'/api/download_file/' + pic.file_name"><i class="el-icon-fa-download"></i></a>
                  <a @click="onRemoveUploadedFile(pic)"><i class="el-icon-fa-trash"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <dropzone
        :id="formItem.id"
        url="/api/upload_file/"
        v-on:vdropzone-success="onUploadSuccess"
        v-on:vdropzone-removed-file="onRemoveUploadingFile"
        :accepted-file-types="formItem.value.regex.join(',')"
        :use-font-awesome="true"
        :max-number-of-files="formItem.value.type === 'file' ? 1 : 20"
        :language="{ dictDefaultMessage: '将本地文件拖到此处，或点击上传' }">
        <input type="hidden" name="token" value="xxx">
      </dropzone>
    </template>
    <template v-else-if="formItem.value.type === 'enum'">
      <el-select
        filterable
        :clearable="!formItem.required"
        :disabled="formItem.readonly"
        v-if="!formItem.isAlias"
        v-model="item[formItem.id]">
        <el-option v-for="option in formItem.value.regex"
          :label="option"
          :value="option"></el-option>
      </el-select>
      <el-radio-group
        v-else
        v-model="item[formItem.id]"
        :disabled="formItem.readonly">
        <el-radio v-for="option in formItem.value.regex" :label="option"></el-radio>
      </el-radio-group>
    </template>
    <template v-else-if="formItem.value.type === 'enums'">
      <el-select
        filterable
        multiple
        :disabled="formItem.readonly"
        v-if="!formItem.isAlias"
        v-model="item[formItem.id]">
        <el-option v-for="option in formItem.value.regex"
          :label="option"
          :value="option"></el-option>
      </el-select>
      <el-checkbox-group
        v-else
        v-model="item[formItem.id]"
        :disabled="formItem.readonly">
        <el-checkbox v-for="option in formItem.value.regex" :label="option" :name="option">{{option}}</el-checkbox>
      </el-checkbox-group>
    </template>
    <el-select
      v-else-if="formItem.value.type === 'arr'"
      v-model="item[formItem.id]"
      multiple
      filterable
      allow-create
      :placeholder="formItem.placeholder">
    </el-select>
    <el-date-picker
      v-else-if="formItem.value.type === 'datetime'"
      v-model="item[formItem.id]"
      type="datetime"
      format="yyyy-MM-dd HH:mm:ss"
      @change="datetimeFormat"
      :placeholder="formItem.placeholder">
    </el-date-picker>
    <el-date-picker
      v-else-if="formItem.value.type === 'date'"
      v-model="item[formItem.id]"
      type="date"
      format="yyyy-MM-dd"
      @change="dateFormat"
      :placeholder="formItem.placeholder">
    </el-date-picker>
    <need-cmdb-data
      v-else-if="formItem.value.type === 'dicts' || formItem.value.type === 'dict'"
      :vmodel="item"
      :strucData="formItem"
      :whole="whole"
      :message="message"
      :index="index"
      :body-table="bodyTable"
      :header-table="headerTable">
    </need-cmdb-data>
    <p class="help-block" v-if="formItem.description">{{formItem.description}}</p>
  </el-form-item>
</template>
<script>
  import needCmdbData from './_needCMDBData'
  import formStructure from './_formStructure'
  import { quillEditor } from 'vue-quill-editor'
  import Dropzone from 'vue2-dropzone'
  // import formStructure from './_formStructure'
  export default {
    props: {
      item: { type: Object },
      whole: { type: Object },
      wholeName: { type: String },
      formItem: { type: Object },
      index: { type: Number },
      message: { type: Object },
      header: { type: Boolean },
      headerTable: { type: Boolean },
      bodyTable: { type: Boolean },
      valueId: { type: String },
      tableIndex: { type: Number },
      isEditing: { type: Boolean }
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
            placeholder: this.formItem.placeholder,
            theme: 'snow'
          }
        }
      }
    },
    computed: {
      multiFiles () {
        if (!this.isEditing) {
          let arr = []
          return arr
        } else {
          if (this.formItem.value.type === 'files') {
            return this.item[this.formItem.id]
          }
        }
      },
      singleFile () {
        if (!this.isEditing) {
          let obj = null
          return obj
        } else {
          if (this.formItem.value.type === 'file') {
            return this.item[this.formItem.id]
          }
        }
      }
    },
    mounted () {
      // if (this.formItem && this.formItem.default && this.formItem.default.type) {
      //   if (this.formItem.default.type === 'message_header') {
      //     this.whole.header[this.formItem.id] = this.getPathResult(this.message.header, this.formItem.default.key_path)
      //   } else if (this.formItem.default.type === 'static') {
      //     this.whole.header[this.formItem.id] = this.formItem.default.this.formItem
      //   } else if (this.formItem.default.type === 'form_header') {
      //     this.$watch(this.wholeName + '.header.' + this.formItem.default.key_path, (newVal, oldVal) => {
      //       this.whole.header[this.formItem.id] = newVal
      //     })
      //   } else if (this.formItem.default.type === 'form_body') {
      //     if (this.headerTable || this.bodyTable) {
      //       this.$watch('whole.' + this.formItem.default.key_path, (newVal, oldVal) => {
      //         this.whole[this.formItem.id] = newVal
      //       })
      //     } else {
      //       if (this.header) {
      //         this.$watch(this.wholeName + '.header.' + this.formItem.default.key_path, (newVal, oldVal) => {
      //           this.whole.header[this.formItem.id] = newVal
      //         })
      //       } else {
      //         this.$watch(this.wholeName + '.body.' + this.index + '.' + this.formItem.default.key_path, (newVal, oldVal) => {
      //           this.whole.body[this.index][this.valueId] = newVal
      //         })
      //       }
      //     }
      //   }
      // }
    },
    methods: {
      prop (formItem) {
        if (formItem.required) {
          if (!this.headerTable && !this.bodyTable) {
            if (this.header) {
              return 'header.' + formItem.id
            } else {
              return 'body.' + this.index + '.' + formItem.id
            }
          } else {
            if (this.headerTable) {
              return 'header.' + this.valueId + '.' + this.tableIndex + '.' + formItem.id
            } else if (this.bodyTable) {
              return 'body.' + this.index + '.' + this.valueId + '.' + this.tableIndex + '.' + formItem.id
            }
          }
        } else {
          return ''
        }
      },
      arrLimitValid (formItem) {
        let keyData
        if (formItem.limit.type === 'message_body') {
          keyData = this.getPathResult(this.message.body[this.index], formItem.limit.key_path)
        } else if (formItem.limit.type === 'message_header') {
          console.log(this.message)
          keyData = this.getPathResult(this.message.header, formItem.limit.key_path)
        } else if (formItem.limit.type === 'static') {
          keyData = formItem.limit.min
          this.limitMaxNum = formItem.limit.max
        } else if (formItem.limit.type === 'form_body') {
          keyData = this.getPathResult(this.whole.body[this.index], formItem.limit.key_path) // this.whole.body[this.index] 就是 this.item
        } else if (formItem.limit.type === 'form_header') {
          keyData = this.getPathResult(this.whole.header, formItem.limit.key_path)
        }
        if (Array.isArray(keyData)) {
          this.limitNum = keyData.length
        } else if (typeof keyData === 'number') {
          this.limitNum = keyData
        } else if (typeof keyData === 'string') {
          if (typeof +keyData === 'number') {
            this.limitNum = +keyData
          } else {
            this.$message('limit数据配置有误')
          }
        }
        var validateLimit = (rule, value, cb) => {
          function isMatch (ele, i, arr) {
            const reg = new RegExp(ele)
            return value.some(val => { return !val.match(reg) }) // 要value数组里每一个值都通过正则，否则报错
          }
          if (value && formItem.value.regex.length && formItem.value.regex.some(isMatch)) {
            return cb(new Error(`请输入正确的${formItem.name}`))
          }
          if (this.limitMaxNum) { // static时，有一个范围值
            if (value.length < this.limitNum) {
              return cb(new Error(`至少需要输入${this.limitNum}个${formItem.name},还差${this.limitNum - value.length}个`))
            } else if (value.length > this.limitMaxNum) {
              return cb(new Error(`至多输入${this.limitMaxNum}个${formItem.name},请删除${value.length - this.limitMaxNum}个`))
            } else {
              cb()
            }
          } else { // 除static外，其他都是一个固定的数值，不准多不准少
            if (value.length < this.limitNum) {
              return cb(new Error(`需要输入${this.limitNum}个${formItem.name},还差${this.limitNum - value.length}个`))
            } else if (value.length > this.limitNum) {
              return cb(new Error(`只需要输入${this.limitNum}个${formItem.name},请删除${value.length - this.limitNum}个`))
            } else {
              cb()
            }
            // else if (!value.length) {
            //   return cb(new Error(`${formItem.name}不能为空`))
            // }
          }
        }
        return {
          validator: validateLimit,
          required: formItem.required,
          trigger: 'change'
        }
      },
      rules (formItem) {
        // console.log(formItem)
        if (formItem.value.allow_create) {
          var validateAllowCreate = (rule, value, cb) => {
            if (!value) {
              return cb(new Error('不能为空'))
            } else {
              cb()
            }
            // const format = typeof value === 'object' || 'string'
            // if (value && !format) {
            //   cb(new Error('不能为空'))
            // } else {
            //   cb()
            // }
          }
          return {
            validator: validateAllowCreate,
            required: formItem.required,
            trigger: 'change'
          }
        } else if ((formItem.value.type === 'arr' || formItem.value.type === 'dicts' || formItem.value.type === 'enums') && formItem.limit && formItem.limit.type) {
          return this.arrLimitValid(formItem)
          // return {}
        } else if (formItem.value.type === 'str' && formItem.value.regex && formItem.value.regex.length) {
          // console.log('str' + formItem.name)
          var validateRegex = (rule, value, cb) => {
            function isMatch (ele, i, arr) {
              console.log(value)
              const reg = new RegExp(ele)
              return !value.match(reg)
            }
            if (value && formItem.value.regex.some(isMatch)) {
              return cb(new Error(`请输入正确的${formItem.name}`))
            } else {
              cb()
            }
          }
          return {
            validator: validateRegex,
            required: formItem.required,
            trigger: 'blur'
          }
        } else if (formItem.readonly && !formItem.required) {
          return {}
        } else if (!formItem.required) {
          return {}
        } else {
          let type
          if (formItem.value.type === 'arr' || formItem.value.type === 'dicts' || formItem.value.type === 'enums' || formItem.value.type === 'files') {
            type = 'array'
          } else if (formItem.value.type === 'int') {
            type = 'number'
          } else if (formItem.value.type === 'datetime' || formItem.value.type === 'date') {
            type = 'date'
          } else if (formItem.value.type === 'dict' || formItem.value.type === 'file') {
            type = 'object'
          } else {
            // console.log(formItem.value.type)
            type = 'string'
          }
          return {
            type: type,
            required: formItem.required,
            message: formItem.name + '不能为空',
            trigger: 'blur, change'
          }
        }
      },
      datetimeFormat (val) {
        this.item[this.formItem.id] = val
      },
      dateFormat (val) {
        this.item[this.formItem.id] = val
      },
      onUploadSuccess (file, res) {
        this.multiFiles.push(JSON.parse(res).data[0])
        console.log(this.multiFiles)
        this.setUploaderValue()
      },
      onRemoveUploadingFile (file, error, xhr) {
        // console.log(file)
        if (this.formItem.value.type === 'files') {
          for (let i = 0; i < this.multiFiles.length; i++) {
            console.log(this.multiFiles[i].desc)
            if (this.multiFiles[i].desc === file.name) {
              this.multiFiles.splice(i, 1)
            }
          }
          // this.multiFiles = this.multiFiles.filter(f => f.desc !== file.name)
          console.log(this.multiFiles)
        } else {
          this.singleFile = null
        }
        this.setUploaderValue()
      },
      onRemoveUploadedFile (file) {
        if (this.formItem.value.type === 'files') {
          for (let i = 0; i < this.multiFiles.length; i++) {
            console.log(this.multiFiles[i].desc)
            if (this.multiFiles[i].desc === file.desc) {
              this.multiFiles.splice(i, 1)
            }
          }
          // this.multiFiles = this.multiFiles.filter(f => f.desc !== file.name)
          console.log(this.multiFiles)
        } else {
          this.singleFile = null
        }
        this.setUploaderValue()
      },
      // 上传器无法绑定 v-model，需要手动设置其值
      setUploaderValue () {
        if (this.formItem.value.type === 'files') {
          this.item[this.formItem.id] = this.multiFiles
        }
        if (this.formItem.value.type === 'file') {
          this.item[this.formItem.id] = this.singleFile
        }
      }
    },
    components: {
      needCmdbData,
      formStructure,
      quillEditor,
      Dropzone
    }
  }
</script>
<style lang="less">
  .blockElement {
    width: 100%;
    display: flex !important;
    .el-form-item__content {
      width: 50%;
      width:-moz-calc(100% - 85px);
      width:-webkit-calc(100% - 85px);
      width: calc(100% - 85px);
    }
  }
  .help-block {
    font-size: 12px;
    color: #666;
    margin: 0.5em 0 0;
    line-height: 1.2;
  }
  .dz-remove {
    display: inline-block;
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    &::before {
      content: "\f014";
      color: #fff;
      font-size: 24px;
    }
  }
</style>
