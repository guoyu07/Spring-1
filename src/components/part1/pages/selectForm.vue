<template>
  <div class="select-form">
    <el-form :model="testForm" ref="testForm" label-width="100px">
      <el-form-item label="字符串" prop="testStr" required>
        <el-input v-model="testForm.testStr"></el-input>
      </el-form-item>
      <el-form-item label="数字" prop="testInt" required>
        <el-input-number v-model="testForm.testInt"></el-input-number>
      </el-form-item>
      <el-form-item label="数组" prop="testArr" required>
        <el-input-tag :tags="testForm.testArr"></el-input-tag>
      </el-form-item>
      <el-form-item label="枚举" prop="testEnum" required>
        <el-select v-model="testForm.testEnum" placeholder="枚举类型">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期" prop="testDate" required>
        <el-date-picker type="date" placeholder="选择日期" v-model="testForm.testDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="时间" prop="testTime" required>
        <el-time-picker type="fixed-time" placeholder="选择时间" v-model="testForm.testTime"></el-time-picker>
      </el-form-item>
      <el-form-item label="文本域" prop="testText" required>
        <el-input type="textarea" v-model="testForm.testText"></el-input>
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
