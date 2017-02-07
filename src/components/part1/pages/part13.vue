<style lang="less" scoped>
  .el-alert {
    margin-top: 12px;
    
    pre {
      font-weight: 600;
      height: 240px;
      overflow-y: scroll;
    }
  }
</style>

<template>
  <div>
    <el-row>
      <el-col :span="20">
        <el-card class="box-card">
          <h3>自订表单客户端测试</h3>
          <el-form
            label-position="right"
            label-width="80px">
            <el-form-item
              v-for="param in inputParams"
              :label="param.description"
              :required="param.required">
              <el-select
                v-if="param.type === 'dict'"
                :value="param.value.value">
                <el-option
                  v-for="option in dictOptions[param.value.dictTypeCode]"
                  :label="option.name"
                  :value="option.value"></el-option>
              </el-select>
              <el-checkbox-group
                v-else-if="param.type === 'checkbox'"
                v-model="param.value.value">
                <el-checkbox v-for="option in checkboxOptions[param.value.checkboxTypeCode]" :label="option.name"></el-checkbox>
              </el-checkbox-group>
              <el-input
                v-else
                :type="param.type"
                :name="param.name"
                :placeholder="param.description"
                :value="param.value"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">提交</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="20" :md="8" :lg="6">
        <el-alert title="表单数据" type="success">
          <pre>{{inputParams}}</pre>
        </el-alert>
      </el-col>
      <el-col :sm="20" :md="8" :lg="6">
        <el-alert title="字典数据" type="info">
          <pre>{{dictOptions}}</pre>
        </el-alert>
      </el-col>
      <el-col :sm="20" :md="8" :lg="6">
        <el-alert title="复选框数据" type="warning">
          <pre>{{checkboxOptions}}</pre>
        </el-alert>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        // 获取表单配置数据
        inputParams: [],
        // 获取选择框选项
        dictOptions: {},
        // 获取复选框选项
        checkboxOptions: {}
      }
    },

    methods: {
      onSubmit () {
        console.log('submit!')
      },

      getInputParams () {
        this.$http.get('/inputParams').then((res) => {
          this.inputParams = res.body
          this.getDictOptions()
          this.getCheckboxOptions()
        })
      },

      getDictOptions () {
        for (let param of this.inputParams) {
          if (param.type === 'dict') {
            let dictType = param.value.dictTypeCode
            this.$http.get(`/dictData/${dictType}`).then((res) => {
              this.$set(this.dictOptions, dictType, res.body)
            })
          }
        }
      },

      getCheckboxOptions () {
        for (let param of this.inputParams) {
          if (param.type === 'checkbox') {
            let checkboxType = param.value.checkboxTypeCode
            this.$http.get(`/checkboxData/${checkboxType}`).then((res) => {
              this.$set(this.checkboxOptions, checkboxType, res.body)
            })
          }
        }
      }
    },

    mounted () {
      this.getInputParams()
    }
  }
</script>