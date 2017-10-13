<template>
  <!-- 用 whole 来区分是否需要显示label formItem.name 因为快速编辑里面不传 whole ，只需要编辑当前一个表单 -->
  <el-form-item
    v-if="formItem.value && formItem.value.type !== 'table' && formItem.value.type !== 'search_bar'"
    :prop="prop(formItem)"
    :label="whole ? formItem.name : ''"
    :rules="rules(formItem)"
    class="formbody"
    :class="((formItem.isAlias && formItem.value.type !== 'users') || ['file', 'files'].includes(formItem.value.type)) ? 'blockElement' : ''">
    <span v-if="formItem.value.type === 'str'">
      <!-- 普通表单填写 不管需不需要提交 都是这样 -->
      <el-input
        v-if="!formItem.readonly"
        :type="formItem.isAlias ? 'textarea' : 'text'"
        :autosize="{ minRows: 5 }"
        v-model="item[formItem.id]">
      </el-input>
      <!-- 读取默认值并提交 -->
      <el-input
        v-else-if="formItem.readonly && formItem.need_submit"
        v-model="item[formItem.id]"
        disabled>
      </el-input>
      <!-- 读取默认值不提交 -->
      <span v-else-if="formItem.readonly && !formItem.need_submit">
        <span v-if="formItem.default.type === 'static'">
          {{formItem.default.value}}
        </span>
        <span v-else-if="formItem.default.type === 'form_header'">
          {{ getPathResult(whole.header, formItem.default.key_path) ? getPathResult(whole.header, formItem.default.key_path, index) : '' }}
        </span>
        <span v-else-if="formItem.default.type === 'message_header'">
          {{ getPathResult(message.header, formItem.default.key_path, index) ? getPathResult(message.header, formItem.default.key_path, index) : '' }}
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
      :min="formItem.range.min ? formItem.range.min : -99999999999"
      :max="formItem.range.max ? formItem.range.max : 99999999999"
      :disabled="formItem.readonly">
    </el-input-number>
    <!-- <el-input
      v-else-if="formItem.value.type === 'int'"
      v-model.number="item[formItem.id]"
      :disabled="formItem.readonly">
    </el-input> -->
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
        clearable
        :disabled="formItem.readonly"
        v-if="!formItem.isAlias"
        v-model="item[formItem.id]">
        <el-option v-for="option in formItem.value.regex"
          :key="option"
          :label="option"
          :value="option"></el-option>
      </el-select>
      <el-radio-group
        v-else
        v-model="item[formItem.id]"
        :disabled="formItem.readonly">
        <el-radio v-for="option in formItem.value.regex" :key="option" :label="option"></el-radio>
      </el-radio-group>
    </template>
    <template v-else-if="formItem.value.type === 'enums'">
      <el-select
        filterable
        multiple
        allow-create
        :disabled="formItem.readonly"
        v-if="!formItem.isAlias"
        v-model="item[formItem.id]">
        <el-option v-for="option in formItem.value.regex"
          :key="option"
          :label="option"
          :value="option"></el-option>
      </el-select>
      <el-checkbox-group
        v-else
        v-model="item[formItem.id]"
        :disabled="formItem.readonly">
        <el-checkbox v-for="option in formItem.value.regex" :key="option" :label="option" :name="option">{{option}}</el-checkbox>
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
    <!-- <el-input
      v-else-if="formItem.value.type === 'datetime'"
      v-model="item[formItem.id]"></el-input> -->
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
      :isEditing="isEditing"
      :message="message"
      :index="index"
      :table-index="tableIndex"
      :body-table="bodyTable"
      :header-table="headerTable">
    </need-cmdb-data>
    <member-select
      v-else-if="formItem.value.type === 'users'"
      :vmodel="item"
      :strucData="formItem"
      :whole="whole"
      :message="message"
      :index="index"
      :table-index="tableIndex"
      :body-table="bodyTable"
      :header-table="headerTable">
    </member-select>
    <template v-else-if="formItem.value.type === 'cascade'">
      <el-cascader
        v-if="!formItem.isAlias"
        :options="formItem.value.regex"
        :disabled="formItem.readonly"
        v-model="item[formItem.id]">
      </el-cascader>
      <cascaders
        v-else
        :vmodel="item"
        :strucData="formItem"
        :whole="whole"
        :message="message"
        :index="index"
        :table-index="tableIndex"
        :body-table="bodyTable"
        :header-table="headerTable">
      </cascaders>
    </template>
    <p class="help-block" v-if="formItem.description">{{formItem.description}}</p>
  </el-form-item>
</template>
<script>
  import needCmdbData from './_needCMDBData'
  import memberSelect from './_memberSelect'
  import cascaders from './_cascaders'
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
    created () {
      if (!this.headerTable && !this.bodyTable) { // type 不是 table 且无值的情况下渲染一次表单（在复制表单时会有值或者有默认值）
        if (this.header && !this.whole.header[this.formItem.id]) {
          this.setDataType(this.formItem, this.whole.header)
        } else if (!this.whole.body[this.index][this.formItem.id]) {
          this.setDataType(this.formItem, this.whole.body[this.index])
        }
      }
    },
    destroyed () {
      // console.log('%c%s', 'color:red', 'name: ' + this.formItem.name)
      // if (!this.headerTable && !this.bodyTable && this.whole.body[this.index][this.formItem.id]) {
      //   if (this.header) {
      //     delete this.whole.header[this.formItem.id]
      //   } else {
      //     delete this.whole.body[this.index][this.formItem.id]
      //   }
      // }
    },
    computed: {
      multiFiles () {
        if (!this.isEditing) {
          let arr = []
          return arr
        } else {
          if (this.formItem.value.type === 'files') {
            return this.item[this.formItem.id] || []
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
      // 无原值时配置默认值
      if (!this.item[this.formItem.id]) {
        // 默认值
        if (this.formItem && this.formItem.default && this.formItem.default.type) {
          if (this.formItem.default.type === 'message_header') {
            if (this.headerTable || this.bodyTable) {
              // console.log('formbody default')
              // this.whole[this.formItem.id] = this.getPathResult(this.message.header, this.formItem.default.key_path, this.index)
              // 如果原值不是数组，而默认值取到一个数组，则按 table 的索引来取默认值
              if (!Array.isArray(this.whole[this.formItem.id]) && Array.isArray(this.getPathResult(this.message.header, this.formItem.default.key_path, this.tableIndex))) {
                this.whole[this.formItem.id] = this.getPathResult(this.message.header, this.formItem.default.key_path)[this.tableIndex]
              } else {
                this.whole[this.formItem.id] = this.getPathResult(this.message.header, this.formItem.default.key_path, this.index, this.tableIndex)
                // console.log(this.getPathResult(this.message.header, this.formItem.default.key_path, this.index, this.tableIndex))
                // console.log(this.message.header, this.formItem.default.key_path, this.index, this.tableIndex)
              }
            } else {
              if (this.header) {
                // console.log(this.whole.header[this.formItem.id])
                this.whole.header[this.formItem.id] = this.getPathResult(this.message.header, this.formItem.default.key_path)
              } else {
                this.whole.body[this.index][this.formItem.id] = this.getPathResult(this.message.header, this.formItem.default.key_path, this.index)
              }
            }
          } else if (this.formItem.default.type === 'message_body') {
            if (this.headerTable || this.bodyTable) {
              this.whole[this.formItem.id] = this.getPathResult(this.message.body[this.index], this.formItem.default.key_path, this.tableIndex)
            } else {
              if (this.header) {
                this.whole.header[this.formItem.id] = this.getPathResult(this.message.body[this.index], this.formItem.default.key_path)
              } else {
                this.whole.body[this.index][this.formItem.id] = this.getPathResult(this.message.body[this.index], this.formItem.default.key_path, this.tableIndex)
              }
            }
          } else if (this.formItem.default.type === 'static' && !['dict', 'dicts'].includes(this.formItem.value.type) && this.formItem.default.value !== '$author') {
            // dict', 'dicts'的static类型默认值在 _needCMDBData.vue
            if (this.headerTable || this.bodyTable) {
              this.whole[this.formItem.id] = this.formItem.default.value
            } else {
              if (this.header) {
                this.whole.header[this.formItem.id] = this.formItem.default.value
              } else {
                this.whole.body[this.index][this.formItem.id] = this.formItem.default.value
              }
            }
          } else if (this.formItem.default.type === 'form_header') {
            this.$watch('whole.header.' + this.formItem.default.key_path, (newVal, oldVal) => {
              // console.log(this.formItem.default.key_path)
              const val = this.getPathResult(this.whole.header, this.formItem.default.key_path, this.index)
              if (!val || newVal === oldVal) return false
              if (this.headerTable || this.bodyTable) {
                this.whole[this.formItem.id] = val
              } else {
                if (this.header) {
                  // console.log(val, newVal, oldVal)
                  this.whole.header[this.formItem.id] = val
                } else {
                  this.whole.body.map((body, bodyindex) => {
                    const bodyVal = this.getPathResult(this.whole.header, this.formItem.default.key_path, bodyindex)
                    this.whole.body[bodyindex][this.formItem.id] = bodyVal
                  })
                }
              }
            }, {deep: true})
          } else if (this.formItem.default.type === 'form_body') {
            if (this.headerTable || this.bodyTable) {
              this.$watch('whole.' + this.formItem.default.key_path, (newVal, oldVal) => {
                this.whole[this.formItem.id] = newVal
              })
            } else {
              if (this.header) {
                this.$watch('whole.header.' + this.formItem.default.key_path, (newVal, oldVal) => {
                  this.whole.header[this.formItem.id] = newVal
                })
              } else {
                this.$watch('whole.body.' + this.index + '.' + this.formItem.default.key_path, (newVal, oldVal) => {
                  this.whole.body[this.index][this.formItem.id] = newVal
                })
              }
            }
          }
        }
      }
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
          // arr 才需要验证正则
          if (value && formItem.value.regex.length && formItem.value.regex.some(isMatch) && formItem.value.type === 'arr') {
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
            if (!value) {
              return cb(new Error(`${formItem.name}不能为空`))
            } else if (value && formItem.value.regex.some(isMatch)) {
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
        } else if (formItem.value.type === 'datetime' || formItem.value.type === 'date') {
          var validateDatetime = (rule, value, cb) => {
            if (!value) {
              return cb(new Error(`请输入${formItem.name}`))
            } else {
              cb()
            }
          }
          return {
            validator: validateDatetime,
            required: formItem.required,
            trigger: 'blur'
          }
        } else if (formItem.value.type === 'users' && formItem.isAlias) {
          var validateGroup = (rule, value, cb) => {
            if (!value.group || !value.user) {
              return cb(new Error(`${formItem.name}未填写`))
            } else {
              cb()
            }
          }
          return {
            validator: validateGroup,
            required: formItem.required,
            trigger: 'blur'
          }
        } else {
          let type
          let trigger
          if (formItem.value.type === 'arr' || formItem.value.type === 'dicts' || formItem.value.type === 'enums' || formItem.value.type === 'files' || formItem.value.type === 'cascade') {
            // console.log(formItem.name)
            type = 'array'
            trigger = 'change, blur'
          } else if (formItem.value.type === 'int') {
            type = 'number'
            trigger = 'blur'
          } else if (formItem.value.type === 'dict' || formItem.value.type === 'file' || (formItem.value.type === 'users' && !formItem.isAlias)) {
            type = 'object'
            trigger = 'change, blur'
          } else if (formItem.value.type === 'enum') {
            type = 'string'
            trigger = 'change, blur'
          } else {
            type = 'string'
            trigger = 'blur'
          }
          return {
            type: type,
            required: formItem.required,
            message: formItem.name + '不能为空',
            trigger: trigger
          }
        }
      },
      datetimeFormat (val) {
        // console.log(val)
        this.item[this.formItem.id] = val
      },
      dateFormat (val) {
        // console.log(val, this.item[this.formItem.id])
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
      memberSelect,
      cascaders,
      quillEditor,
      Dropzone
    }
  }
</script>
<style lang="less" scoped>
  .blockElement {
    word-break: break-all;
    width: 100%;
    display: flex !important;
    .el-form-item__content {
      width: 80%;
      // width:-moz-calc(100% - 100px);
      // width:-webkit-calc(100% - 100px);
      width: calc(100% - 210px);
      margin-right: 105px;
    }
  }

  .help-block {
    font-size: 12px;
    color: #666;
    margin: 0.5em 0 0;
    line-height: 1;
    // position: absolute;
    // top: 24px;
    // left: 0;
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
