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
      <el-col :sm="20" :md="12" :lg="10">
        <el-alert title="表单数据" type="success">
          <pre>{{inputParams}}</pre>
        </el-alert>
      </el-col>
      <el-col :sm="20" :md="12" :lg="10">
        <el-alert title="字典数据" type="info">
          <pre>{{dictOptions}}</pre>
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
        // 根据 inputParams 中每个 dictType 逐个请求，获得选择框选项
        dictOptions: {}
      }
    },

    // computed: {
    //   // 根据 inputParams 中每个 dictType 逐个请求，获得选择框选项
    //   dictOptions () {
    //     return {
    //       dictOne: [{
    //         name: '选项 1-1',
    //         value: 'dict-1-1'
    //       }, {
    //         name: '选项 1-2',
    //         value: 'dict-1-2'
    //       }],
    //       dictTwo: [{
    //         name: '选项 2-1',
    //         value: 'dict-2-1'
    //       }, {
    //         name: '选项 2-2',
    //         value: 'dict-2-2'
    //       }]
    //     }
    //   }
    // },

    methods: {
      onSubmit () {
        console.log('submit!')
      },

      getInputParams () {
        this.$http.get('inputParams/').then((res) => {
          console.log(res.body)
          this.inputParams = res.body
        })
      },

      getDictOptions (type) {
        this.$http.get(`dictData/${type}`).then((res) => {
          console.log(res.body)
          this.dictOptions[type] = res.body
        })
      }
    },

    mounted () {
      this.getInputParams()
    }
  }
</script>