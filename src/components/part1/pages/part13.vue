<style lang="less" scoped>
  .el-alert {
    margin-top: 12px;
    
    pre {
      font-weight: 600;
    }
  }
</style>

<template>
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
              <option value=""></option>
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
      <el-alert title="表单数据" type="success">
        <pre>{{inputParams}}</pre>
      </el-alert>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    data () {
      return {
        // 获取表单配置数据
        inputParams: [{
          name: 'some-text',
          description: '输入框',
          required: false,
          type: 'text',
          value: 'lorem ipsum'
        }, {
          name: 'some-num',
          description: '数值',
          required: true,
          type: 'number',
          value: 10
        }, {
          name: 'some-textarea',
          description: '文本框',
          required: false,
          type: 'textarea',
          value: 'Lorem ipsum dolor sit amet, consectetur.'
        }, {
          name: 'some-dict',
          description: '选择框',
          required: true,
          type: 'dict',
          value: {
            dictTypecode: 'ftpConnType',
            dictTypename: '数据连接模式',
            description: '表示以被动模式连接 FTP',
            name: '被动模式',
            value: 'Pasv'
          }
        }]
      }
    },

    computed () {
      return {
        // 根据 inputParams 中每个 dictType 逐个请求，获得选择框选项
      }
    },

    methods: {
      onSubmit () {
        console.log('submit!')
      }
    }
  }
</script>