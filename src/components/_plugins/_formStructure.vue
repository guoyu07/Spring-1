<template>
  <div>
    <div class="form-block" v-for="formBlock in formData">
      <h5>{{formBlock.name}}</h5>
      <!-- v-if="formItem.value.type !== 'search_bar'" -->
      <el-form-item
        v-for="formItem in formBlock.value"
        :prop="formItem.required ? 'body.' + index + '.' + formItem.id : ''"
        :label="formItem.name"
        :rules="rules(formItem)"
        :class="formItem.isAlias ? 'blockElement' : ''">

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

        <template v-else-if="formItem.value.type === 'FK'">
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
        </template>

        <template v-else-if="formItem.value.type === 'FKs'">
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
        </template>

        <el-select
          v-else-if="formItem.value.type === 'arr'"
          v-model="item[formItem.id]"
          multiple
          filterable
          allow-create
          placeholder="请创建">
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

        <el-tabs
          v-else-if="formItem.value.type === 'table'">
          <el-tab-pane v-for="(data, index) in whole.body" :label="'body' + (index+1)">
            <!-- <pre>{{data}}</pre> -->
            <!-- <form-structure
              :form-data="taskFormData.attr_list"
              :item="item[index]"
              :index="index">
            </form-structure> -->
          </el-tab-pane>
        </el-tabs>
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
      formData: { type: Array },
      readInfo: { type: Object },
      whole: { type: Object },
      message: { type: Object }
    },

    data () {
      return {
      }
    },
    created () {
    },

    methods: {
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
        } else if (formItem.readonly && !formItem.required) {
          return {}
        } else if (!formItem.required) {
          return {}
        } else {
          let type
          if (formItem.value.type === 'arr' || formItem.value.type === 'FKs' || formItem.value.type === 'dicts') {
            type = 'array'
          } else if (formItem.value.type === 'int') {
            type = 'number'
          } else if (formItem.value.type === 'datetime' || formItem.value.type === 'date') {
            type = 'date'
          } else if (formItem.value.type === 'FK' || formItem.value.type === 'dict') {
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
</style>
