<template>
  <div class="select-form">
    <el-form :model="formData" ref="formRef" label-width="100px">
      <el-form-item v-for="formItem of formConfig"
        v-if="['str','int','arr','enum','date','datetime','strArea'].indexOf(formItem.type) !== -1"
        :label="formItem.name" :required="formItem.required">
        <template v-if="formItem.type === 'str'">
          <el-input v-model="formData[formItem.key]"></el-input>
        </template>
        <template v-if="formItem.type === 'strArea'">
          <el-input type="textarea" v-model="formData[formItem.key]"></el-input>
        </template>
        <template v-if="formItem.type === 'int'">
          <el-input-number v-model="formData[formItem.key]"></el-input-number>
        </template>
        <template v-if="formItem.type === 'arr'">
          <el-input-tag :tags="formData[formItem.key]"></el-input-tag>
        </template>
        <template v-if="formItem.type === 'enum'">
          <el-select v-model="formData[formItem.key]" placeholder="枚举类型">
            <el-option v-for="op of formItem.options"
              :label="op.label" :value="op.value">
            </el-option>
          </el-select>
        </template>
        <template v-if="formItem.type === 'date'">
          <el-date-picker type="date" placeholder="选择日期" v-model="formData[formItem.key]"></el-date-picker>
        </template>
        <template v-if="formItem.type === 'datetime'">
          <el-time-picker type="fixed-time" placeholder="选择时间" v-model="formData[formItem.key]"></el-time-picker>
        </template>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">立即创建</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import elInputTag from '../../_plugins/inputTag'
  const pinyinUtil = window.pinyinUtil

  export default {
    data () {
      return {
        formConfig: {},
        formData: {}
      }
    },
    created () {
      // 提交字段名 是 name 转的拼音
      // 单选、多选
      // 单选 + 动态获取（其中动态获取 参数的来源 分为几种），还有 多选 + 动态获取
      // body一般在流程中间步骤（资源的数量>1，比如多台主机，每台主机的属性互斥，下拉待选项不应存在交集）
      this.http.get('../../../../static/formConfig.json')
        .then(res => {
          // 构造 待提交(formData)、先只考虑 header、只考虑静态选项
          res.data.header.forEach(item => {
            const key = pinyinUtil.getPinyin(item.name).replace(/\s/ig, '_')
            this.$set(this.formData, key, item.type === 'arr' ? [] : '')
            item.key = key
          })
          this.formConfig = res.data.header
        })
    },
    methods: {
      submitForm () {
        this.$refs.testForm.validate(valid => {
          if (valid) {
            console.log('submit!!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm () {
        this.$refs.testForm.resetFields()
      }
    },
    components: {
      elInputTag
    }
  }
</script>
