<template>
  <div>
    <div class="form-block" v-for="formBlock in formData">
      <h5>{{formBlock.name}}</h5>
      <!-- v-if="formItem.value.type !== 'search_bar'" -->
      <el-form-item
        v-for="formItem in formBlock.value"
        v-if="formItem.value.type !== 'table'"
        :prop="prop(formItem)"
        :label="formItem.name"
        :rules="rules(formItem)"
        :class="formItem.isAlias ? 'blockElement' : ''">

        <span v-if="formItem.value.type === 'str'">
          <!-- 普通表单填写 不管需不需要提交 都是这样 -->
          <el-input
            v-if="!formItem.readonly"
            :type="formItem.isAlias ? 'textarea' : 'text'"
            :placeholder="formItem.placeholder"
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
            {{getPathResult(readInfo, formItem.default.key_path, index)}}
          </span>

        </span>

        <el-input-number
          v-else-if="formItem.value.type === 'int'"
          v-model="item[formItem.id]" :min="1"
          :disabled="formItem.readonly">
        </el-input-number>

        <template v-else-if="formItem.value.type === 'enum'">
          <el-select
            filterable
            :clearable="!formItem.required"
            :disabled="formItem.readonly"
            :placeholder="formItem.placeholder"
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
            :placeholder="formItem.placeholder"
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
            <el-checkbox v-for="option in formItem.value.regex" :label="option" :name="formItem.id">{{option}}</el-checkbox>
          </el-checkbox-group>
        </template>

        <!-- <template v-else-if="formItem.value.type === 'FK'">
          <el-select
            filterable
            v-if="!formItem.isAlias"
            :clearable="!formItem.required"
            :disabled="formItem.readonly"
            v-model="item[formItem.id]">
            <el-option v-for="option in formItem.value.object_list"
              :label="option.name"
              :value="option"></el-option>
          </el-select>
          <el-radio-group
            v-else
            v-model="item[formItem.id]"
            :disabled="formItem.readonly">
            <el-radio v-for="option in formItem.value.object_list" :label="option">{{option.name}}</el-radio>
          </el-radio-group>
        </template> -->

        <!-- <template v-else-if="formItem.value.type === 'FKs'">
          <el-select
            filterable
            :disabled="formItem.readonly"
            v-if="!formItem.isAlias"
            v-model="item[formItem.id]"
            multiple>
            <el-option v-for="option in formItem.value.object_list"
              :label="option.name"
              :value="option"></el-option>
          </el-select>
          <el-checkbox-group
            v-else
            v-model="item[formItem.id]"
            :disabled="formItem.readonly">
            <el-checkbox v-for="option in formItem.value.object_list" :label="option" :name="formItem.id">{{option.name}}</el-checkbox>
          </el-checkbox-group>
        </template> -->

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
          :disabled="formItem.readonly"
          placeholder="选择时间">
        </el-date-picker>

        <need-cmdb-data
          v-else-if="formItem.value.type === 'dicts' || formItem.value.type === 'dict'"
          :vmodel="item"
          :strucData="formItem"
          :whole="whole"
          :message="message"
          :index="index">
        </need-cmdb-data>
        <p class="help-block" v-if="formItem.description">{{formItem.description}}</p>
      </el-form-item>
    </div>
  </div>
</template>

<script>
  import needCmdbData from './_needCMDBData'
  import searchBar from './_searchBar'
  export default {
    props: {
      item: { type: Object },
      index: { type: Number },
      tableIndex: { type: Number },
      formData: { type: Array },
      readInfo: { type: Object },
      whole: { type: Object },
      message: { type: Object },
      headerTable: { type: Boolean },
      bodyTable: { type: Boolean },
      valueId: { type: String }
    },

    data () {
      return {
        limitNum: 0,
        limitMaxNum: 0
      }
    },
    created () {
    },

    methods: {
      arrLimitValid (formItem) {
        let keyData
        if (formItem.limit.type === 'message_body') {
          keyData = this.getPathResult(this.message.body[this.index], formItem.limit.key_path)
        } else if (formItem.limit.type === 'message_header') {
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
      prop (formItem) {
        if (formItem.required) {
          if (!this.headerTable && !this.bodyTable) {
            return 'body.' + this.index + '.' + formItem.id
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
      rules (formItem) {
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
            } else if (!value) {
              return cb(new Error(`${formItem.name}不能为空`))
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
          // console.log('else' + formItem.name)
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
      searchBar
    }
  }
</script>
<style>
  .blockElement {
    width: 100%;
    display: flex;
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
