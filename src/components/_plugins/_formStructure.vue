<template>
  <div>
    <div class="form-block" v-for="formBlock in formData">
      <h4>{{formBlock.name}}</h4>
      <el-form-item
        v-for="formItem in formBlock.value"
        :prop="'data.' + index + '.' + formItem.id"
        :label="formItem.name"
        :rules="{
          type: (formItem.value.type === 'arr' || formItem.value.type === 'FKs') ? 'array' : (formItem.value.type === 'int' ? 'number' : ((formItem.value.type === 'datetime' || formItem.value.type === 'date') ? 'date' : 'string')), required: formItem.required === 'true', message: formItem.name + '不能为空', trigger: 'blur, change'
        }">
        <el-input
          v-if="formItem.value.type === 'str'"
          v-model="item[formItem.id]">
        </el-input>

        <el-input-number
          v-else-if="formItem.value.type === 'int'"
          v-model="item[formItem.id]" :min="0">
        </el-input-number>

        <el-select
          v-else-if="formItem.value.type === 'enum'"
          v-model="item[formItem.id]">
          <el-option v-for="option in formItem.value.regex"
            :label="option"
            :value="option"></el-option>
        </el-select>

        <el-select
          v-else-if="formItem.value.type === 'FK' || formItem.value.type === 'FKs'"
          v-model="item[formItem.id]"
          :multiple="formItem.value.type === 'FKs'">
          <el-option v-for="option in formItem.value.object_list"
            :label="option.name"
            :value="option.instanceId"></el-option>
        </el-select>

        <el-select
          v-else-if="formItem.value.type === 'arr'"
          v-model="item[formItem.id]"
          multiple
          filterable=""
          allow-create
          placeholder="请创建">
        </el-select>

        <el-date-picker
          v-else="formItem.value.type === 'datetime' || formItem.value.type === 'date'"
          v-model="item[formItem.id]"
          :type="formItem.value.type === 'datetime' ? 'datetime' : 'date'"
          placeholder="选择时间">
        </el-date-picker>
      </el-form-item>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      item: { type: Object },
      index: { type: Number },
      formData: { type: Array }
    },

    data () {
      return {
      }
    },
    methods: {
      handleRemove (tab) {
        this.postData.splice(tab.index, 1)
      },
      handleClick (tab, event) {
        // console.log(tab.index, tab, event)
      }
    }
  }
</script>
