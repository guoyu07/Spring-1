<template>
  <div>
    <el-form-item
      v-for="formItem in formBlock"
      :prop="formItem.id"
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
    <el-form-item label="状态" v-if="status">
      <el-select
        v-model="item.status">
        <el-option v-for="option in statusList"
          :label="option.name"
          :value="option.name"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="申请人" v-if="application">
      <el-select
        v-model="item.application">
        <el-option v-for="option in applicationList"
          :label="option.name"
          :value="option.name"></el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
  export default {
    props: {
      item: { type: Object },
      formBlock: { type: Array },
      application: { type: Boolean },
      status: { type: Boolean }
    },

    data () {
      return {
        userInfo: {},
        applicationList: [],
        statusList: [
          {name: '空闲'},
          {name: '使用中'},
          {name: '故障中'},
          {name: '隔离中'},
          {name: '待报废'},
          {name: '已出库'}
        ]
      }
    },

    created () {
      if (this.application) {
        this.userInfo = window.localStorage
        this.renderApplicationList() // 渲染申请人列表
        this.item.application = this.userInfo.userName // 默认申请人为填写人
      }
    },

    methods: {
      renderApplicationList () { // 渲染申请人列表
        const postData = {
          action: 'object/instance/list',
          method: 'GET',
          data: {
            object_id: 'USER'
            // page: "不传则获取该对象所有实例",
            // pageSize: "默认30"
          }
        }
        this.http.post('/easyops/', postData)
        .then((res) => {
          this.applicationList = res.data.data.list
        })
      }
    }
  }
</script>
