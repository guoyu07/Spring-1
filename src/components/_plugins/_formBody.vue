<template>
  <el-form-item
    v-if="formItem.value.type !== 'table' && formItem.value.type !== 'search_bar'"
    :prop="prop(formItem)"
    :label="formItem.name"
    :rules="rules(formItem)"
    :class="formItem.isAlias ? 'blockElement' : ''">
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
        <span v-else>
          {{getPathResult(readInfo, formItem.default.key_path)}}
        </span>
      </span>

    </span>

    <el-input-number
      v-else-if="formItem.value.type === 'int'"
      v-model="item[formItem.id]"
      :disabled="formItem.readonly">
    </el-input-number>

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
        <el-radio  v-for="option in formItem.value.regex" :label="option"></el-radio>
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
      v-else-if="formItem.value.type === 'datetime' || formItem.value.type === 'date'"
      v-model="item[formItem.id]"
      :type="formItem.value.type === 'datetime' ? 'datetime' : 'date'"
      :placeholder="formItem.placeholder">
    </el-date-picker>

    <template v-else-if="formItem.value.type === 'dicts' || formItem.value.type === 'dict'">
      <need-cmdb-data
        :vmodel="item"
        :strucData="formItem"
        :whole="whole"
        :message="message"
        :index="index"
        :body-table="bodyTable">
      </need-cmdb-data>
    </template>
    <p class="help-block" v-if="formItem.description">{{formItem.description}}</p>
  </el-form-item>
</template>

<script>
  import needCmdbData from './_needCMDBData'
  import formStructure from './_formStructure'
  export default {
    props: {
      item: { type: Object },
      whole: { type: Object },
      formItem: { type: Object },
      index: { type: Number },
      message: { type: Object },
      header: { type: Boolean },
      headerTable: { type: Boolean },
      bodyTable: { type: Boolean },
      valueId: { type: String },
      tableIndex: { type: Number }
    },

    data () {
      return {
      }
    },
    created () {
      console.log(this.index, this.formItem.name, 'formBody')
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
              return 'header.' + this.valueId + '.' + this.index + '.' + formItem.id
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
          if (formItem.value.type === 'arr' || formItem.value.type === 'dicts' || formItem.value.type === 'enums') {
            type = 'array'
          } else if (formItem.value.type === 'int') {
            type = 'number'
          } else if (formItem.value.type === 'datetime' || formItem.value.type === 'date') {
            type = 'date'
          } else if (formItem.value.type === 'dict') {
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
      }
    },

    components: {
      needCmdbData,
      formStructure
    }
  }
</script>
<style>
  .blockElement {
    width: 100%;
    display: flex!important;
  }
  .blockElement .el-form-item__content {
    width: 50%;
    width:-moz-calc(100% - 85px);
    width:-webkit-calc(100% - 85px);
    width: calc(100% - 85px);
  }
  .help-block {
    font-size: 12px;
    color: #666;
    margin: 0.5em 0 0;
    line-height: 1.2;
  }
</style>
