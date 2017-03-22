<style lang="less" scoped>
  .el-dialog {
    width: 60%;
  }
  .dialog-footer {
    margin-top: 10px;
    text-align: center;
  }
  .conf-cmdb-contain {
    .el-row, .el-col {
      margin-bottom: 4px;
    }
    .el-form-item {
      margin-bottom: 10px;
    }
    .el-input {
      width: initial;
    }
  }
</style>

<template>
  <el-dialog title="获取选项的 API 配置：" v-model="dialogProps.confVisible">
    <div class="conf-cmdb-contain" v-if="dialogProps.source">
      <el-form :model="dialogProps.source" label-width="100px" :inline="true">
        <el-form-item label="URL：">
          <el-input v-model="dialogProps.source.url"></el-input>
        </el-form-item>
        <el-form-item label="action：">
          <el-input v-model="dialogProps.source.data.action"></el-input>
        </el-form-item>
        <el-form-item label="method：">
          <el-input v-model="dialogProps.source.data.method"></el-input>
        </el-form-item>
        <el-form-item label="params：">
          <el-dropdown trigger="click" @command="selectParams">
            <el-button size="small" type="primary" icon="plus">添加参数</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="static">静态输入</el-dropdown-item>
              <el-dropdown-item command="formHeader">取 form header 字段</el-dropdown-item>
              <el-dropdown-item command="formBody">取 form body 字段</el-dropdown-item>
              <el-dropdown-item command="msgHeader">取 message header 字段</el-dropdown-item>
              <el-dropdown-item command="msgBody">取 message body 字段</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
      <el-collapse v-if="dialogProps.source.data.params.length">
        <el-collapse-item v-for="param in dialogProps.source.data.params" :title="param.value.type">
          <el-row>
            <el-col :span="12">
              <label>属性名：</label>
              <el-input v-model="param.id"></el-input>
            </el-col>
            <el-col :span="12" v-if="param.value.type === 'static'">
              <label>属性值：</label>
              <el-input v-model="param.value.value"></el-input>
            </el-col>
            <el-col :span="12" v-if="['message_header', 'message_body'].includes(param.value.type)">
              <label>取值于流程环节：</label>
              <el-input v-model="param.value.id"></el-input>
            </el-col>
            <el-col :span="12" v-if="param.value.type !== 'static'">
              <label>取值于 key_path：</label>
              <el-input v-model="param.value.key_path"></el-input>
            </el-col>
          </el-row>
          <el-row type="flex" justify="end">
            <el-button icon="delete" @click="paramsDelBtn(dialogProps.source.data.params, param)"></el-button>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <!--多选-->
      <el-card v-if="dialogProps.type === 'dist/multi'">
        <label>count：</label>
        <el-select v-model="dialogProps.count.type" @change="countTypeChange" placeholder="请选择">
          <el-option v-for="item in countConfig" :value="item.type"></el-option>
        </el-select>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary">完成</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      dialogProps: Object
    },
    data () {
      return {
        countConfig: [
          {
            type: 'static',
            min: 1,
            max: 1
          },
          {
            type: 'form_header',
            key_path: ''
          },
          {
            type: 'form_body',
            key_path: ''
          },
          {
            type: 'message_header',
            id: '',
            key_path: ''
          },
          {
            type: 'message_body',
            id: '',
            key_path: ''
          }
        ]
      }
    },
    methods: {
      selectParams (cmd) {
        let param = null
        switch (cmd) {
          case 'static':
            param = {
              id: '',
              value: {
                type: 'static',
                value: ''
              }
            }
            break
          case 'formHeader':
            param = {
              id: '',
              value: {
                type: 'form_header',
                key_path: ''
              }
            }
            break
          case 'formBody':
            param = {
              id: '',
              value: {
                type: 'form_body',
                key_path: ''
              }
            }
            break
          case 'msgHeader':
            param = {
              id: '',
              value: {
                type: 'message_header',
                key_path: ''
              }
            }
            break
          case 'msgBody':
            param = {
              id: '',
              value: {
                type: 'message_body',
                value: ''
              }
            }
            break
          default:
            break
        }
        this.dialogProps.source.data.params.push(param)
      },
      countTypeChange (type) {
        // this.dialogProps.count = countConfig[key]
      },
      paramsDelBtn (arr, item) {
        arr.splice(arr.indexOf(item), 1)
      }
    }
  }
</script>
