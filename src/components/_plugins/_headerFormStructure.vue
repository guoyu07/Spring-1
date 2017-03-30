<template>
  <div>
    <div class="form-block" v-for="formBlock in formData">
      <h4>{{formBlock.name}}</h4>
      <div class="headerform">
        <el-form-item
          v-for="formItem in formBlock.value"
          :prop="formItem.id"
          :label="formItem.name"
          :rules="{
            type: (formItem.value.type === 'arr' || formItem.value.type === 'FKs' || formItem.value.type === 'dicts') ? 'array' : (formItem.value.type === 'int' ? 'number' : ((formItem.value.type === 'datetime' || formItem.value.type === 'date') ? 'date' : ((formItem.value.type === 'FK' || formItem.value.type === 'dict') ? 'object' : 'string'))), required: formItem.required, message: formItem.name + '不能为空', trigger: 'blur, change'
          }">

          <el-input
            v-if="formItem.value.type === 'str'"
            v-model="item[formItem.id]">
          </el-input>

          <el-input-number
            v-else-if="formItem.value.type === 'int'"
            v-model="item[formItem.id]" :min="1">
          </el-input-number>

          <el-select
            filterable
            v-else-if="formItem.value.type === 'enum'"
            v-model="item[formItem.id]">
            <el-option v-for="option in formItem.value.regex"
              :label="option"
              :value="option"></el-option>
          </el-select>

          <el-select
            filterable
            v-else-if="formItem.value.type === 'FK' || formItem.value.type === 'FKs'"
            v-model="item[formItem.id]"
            :multiple="formItem.value.type === 'FKs'">
            <el-option v-for="option in formItem.value.object_list"
              :label="option.name"
              :value="option"></el-option>
          </el-select>

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
            placeholder="选择时间">
          </el-date-picker>

          <need-cmdb-data
            v-else-if="formItem.value.type === 'dicts' || formItem.value.type === 'dict'"
            :vmodel="item" :strucData="formItem"></need-cmdb-data>
        </el-form-item>
      </div>
    </div>
  </div>
</template>

<script>
  import needCmdbData from './_needCMDBData'
  export default {
    props: {
      item: { type: Object },
      formData: { type: Array }
    },

    data () {
      return {
      }
    },
    created () {
    },

    methods: {
    },

    components: {
      needCmdbData
    }
  }
</script>
