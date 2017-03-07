<template>
  <div class="select-form">
    <el-form :model="testForm" ref="testForm" label-width="100px">  
      <el-form-item v-for="formItem of formConfig.header"
        v-if="['str','int','arr','enum','date','datetime','strArea'].indexOf(formItem.value.type) !== -1"
        :label="formItem.name" :required="formItem.required">
        <template v-if="formItem.value.type === 'str'">
          <el-input v-model="formItem.value.regex"></el-input>
        </template>
        <template v-if="formItem.value.type === 'int'">
          <el-input-number v-model="testForm.testInt"></el-input-number>
        </template>
        <template v-if="formItem.value.type === 'arr'">
          <el-input-tag :tags="testForm.testArr"></el-input-tag>
        </template>
        <template v-if="formItem.value.type === 'enum'">
          <el-select v-model="testForm.testEnum" placeholder="枚举类型">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </template>
        <template v-if="formItem.value.type === 'date'">
          <el-date-picker type="date" placeholder="选择日期" v-model="testForm.testDate"></el-date-picker>
        </template>
        <template v-if="formItem.value.type === 'datetime'">
          <el-time-picker type="fixed-time" placeholder="选择时间" v-model="testForm.testTime"></el-time-picker>
        </template>
        <template v-if="formItem.value.type === 'strArea'">
          <el-input type="textarea" v-model="testForm.testText"></el-input>
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

  export default {
    data () {
      return {
        formConfig: {},
        testForm: {
          testStr: '',
          testInt: 0,
          testArr: [],
          testEnum: [],
          testDate: '',
          testTime: '',
          testText: ''
        }
      }
    },
    created () {
      this.http.get('../../../../static/formConfig.json')
        .then(res => {
          this.formConfig = res.data
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
