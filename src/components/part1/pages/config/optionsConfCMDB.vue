<style lang="less" scoped>
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
    .el-card {
      .el-row {
        margin-bottom: 10px;
      }
      .el-input-number {
        position: relative;
        top: 10px;
      }
    }
    .dialog-footer {
      margin-top: 10px;
      text-align: center;
    }
    .del-btn {
      float: right;
      margin: 10px;
    }
  }
</style>

<template>
  <el-dialog class="cmdb-config-dialog" title="获取选项的 API 接口配置：" v-model="dialogProps.confVisible">
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

      <label> 接口请求参数： </label>
      <el-collapse v-if="dialogProps.source.data.params.length">
        <el-collapse-item v-for="param in dialogProps.source.data.params">
          <template slot="title">
            <span><{{ param.value.type }}>{{ param.id }}</span>
            <el-button size="mini" icon="delete" type="danger" class="del-btn"
              @click.stop="paramsDelBtn(dialogProps.source.data.params, param)">
            </el-button>
          </template>
          <el-row>
            <el-form label-width="120px" :inline="true">
              <el-form-item label="属性名：">
                <el-input v-model="param.id"></el-input>
              </el-form-item>
              <el-form-item label="属性值：" v-if="param.value.type === 'static'">
                <el-input v-model="param.value.value"></el-input>
              </el-form-item>
              <el-form-item label="流程环节 id：" v-if="['message_header', 'message_body'].includes(param.value.type)">
                <el-input v-model="param.value.id"></el-input>
              </el-form-item>
              <el-form-item label="属性 key_path：" v-if="param.value.type !== 'static'">
                <el-input v-model="param.value.key_path"></el-input>
              </el-form-item>
            </el-form>
          </el-row>
        </el-collapse-item>
      </el-collapse>

      <label> 选项数据路径配置： </label>
      <el-card>
        <label> 数据 data_path： </label>
        <el-input v-model="dialogProps.source.res.data_path"></el-input>
        <label> 属性 show_key： </label>
        <el-input v-model="dialogProps.source.res.show_key"></el-input>
      </el-card>

      <template v-if="dialogProps.type === 'dict/multi'">
        <label> 多选选择个数配置： </label>
        <el-card>
          <el-row>
            <label>count 配置类型：</label>
            <el-select v-model="dialogProps.count.type" @change="countTypeChange" placeholder="请选择">
              <el-option v-for="item in countConfig" :value="item"></el-option>
            </el-select>
          </el-row>
          <el-row>
            <template v-if="dialogProps.count.type === 'static'">
              <label>min：</label>
              <el-input-number size="small"
                v-model="dialogProps.count.min"
                :min="1" :max="dialogProps.count.max"/>
              <label>max：</label>
              <el-input-number v-model="dialogProps.count.max"
                size="small" :min="1"/>
            </template>
            <template v-if="['message_header', 'message_body'].includes(dialogProps.count.type)">
              <label>流程环节 id：</label>
              <el-input v-model="dialogProps.count.id" size="small"></el-input>
            </template>
            <template v-if="dialogProps.count.type && dialogProps.count.type !== 'static'">
              <label>属性 key_path：</label>
              <el-input v-model="dialogProps.count.key_path" size="small"></el-input>
            </template>
          </el-row>
        </el-card>
      </template>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onSubmit" type="primary">完成</el-button>
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
        countConfig: [ 'static', 'form_header', 'form_body', 'message_header', 'message_body' ]
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
      // 切换类型 加不同的属性
      countTypeChange (type) {
        this.dialogProps.count = {} // 清除
        this.$set(this.dialogProps.count, 'type', type)
        if (type === 'static') {
          // 静态
          this.$set(this.dialogProps.count, 'min', 1)
          this.$set(this.dialogProps.count, 'max', 1)
        } else if (type) {
          // 本表单
          this.$set(this.dialogProps.count, 'key_path', '')
        }
        // 历史表单
        if (['message_header', 'message_body'].includes(type)) {
          this.$set(this.dialogProps.count, 'id', '')
        }
      },
      // 删除操作
      paramsDelBtn (arr, item) {
        arr.splice(arr.indexOf(item), 1)
      },
      onSubmit () {
        this.dialogProps.confVisible = false
      }
    }
  }
</script>
