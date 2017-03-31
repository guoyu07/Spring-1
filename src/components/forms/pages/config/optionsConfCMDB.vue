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

    h5 {
      margin: 6px 0;
    }
  }
</style>

<template>
  <el-dialog class="cmdb-config-dialog" title="动态选项 API 配置" v-model="dialogProps.value.confVisible" @close="onClose">
    <div class="conf-cmdb-contain" v-if="dialogProps.value.source">
      <el-form :model="dialogProps.value.source" label-width="100px" :inline="true">
        <el-form-item label="URL">
          <el-input size="small" class="code-input" v-model="dialogProps.value.source.url"></el-input>
        </el-form-item>
        <el-form-item label="Action">
          <el-input size="small" class="code-input" v-model="dialogProps.value.source.data.action"></el-input>
        </el-form-item>
        <el-form-item label="Method">
          <el-input size="small" class="code-input" v-model="dialogProps.value.source.data.method"></el-input>
        </el-form-item>
        <el-form-item label="Params">
          <el-dropdown trigger="click" @command="selectParams">
            <el-button size="small" type="primary" :plain="true" icon="plus">添加 Param</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="static">静态输入</el-dropdown-item>
              <el-dropdown-item command="input" v-if="isSearchBar">输入框</el-dropdown-item>
              <el-dropdown-item command="formHeader" v-if="!isSearchBar">来自当前节点 header</el-dropdown-item>
              <el-dropdown-item command="formBody" v-if="!isSearchBar">来自当前节点 body</el-dropdown-item>
              <el-dropdown-item command="msgHeader" v-if="!isSearchBar">来自以往节点 header</el-dropdown-item>
              <el-dropdown-item command="msgBody" v-if="!isSearchBar">来自以往节点 body</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item label="允许新增选项" v-if="dialogProps.value.type !== 'search_bar'">
          <el-radio v-model="allowCreate" :label="true">是</el-radio>
          <el-radio v-model="allowCreate" :label="false">否</el-radio>
        </el-form-item>
      </el-form>

      <h5 v-if="dialogProps.value.source.data.params.length">接口请求参数：</h5>
      <el-collapse v-if="dialogProps.value.source.data.params.length">
        <el-collapse-item v-for="param in dialogProps.value.source.data.params">
          <template slot="title">
            <span><{{ param.value.type }}>{{ param.id }}</span>
            <el-button size="mini" icon="delete" type="danger" class="del-btn"
              @click.stop="paramsDelBtn(dialogProps.value.source.data.params, param)">
            </el-button>
          </template>
          <el-row>
            <el-form label-width="120px" :inline="true">
              <el-form-item label="属性 ID">
                <el-input size="small" v-model="param.id"></el-input>
              </el-form-item>
              <el-form-item label="属性名称" v-if="isSearchBar">
                <el-input size="small" v-model="param.name"></el-input>
              </el-form-item>
              <el-form-item label="属性值" v-if="param.value.type === 'static'">
                <el-input size="small" v-model="param.value.value"></el-input>
              </el-form-item>
              <el-form-item label="匹配条件" v-if="isSearchBar && param.value.type === 'static'">
                <el-select v-model="param.op">
                  <el-option label="等于" value="eq"></el-option>
                  <el-option label="不等于" value="neq"></el-option>
                  <el-option label="包含" value="reg"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="流程环节 ID" v-if="['message_header', 'message_body'].includes(param.value.type)">
                <el-input size="small" v-model="param.value.id"></el-input>
              </el-form-item>
              <el-form-item label="属性路径" v-if="param.value.type !== 'static' && !isSearchBar">
                <el-input size="small" v-model="param.value.key_path" class="code-input"></el-input>
              </el-form-item>
            </el-form>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <!--多选 配置数量-->
      <!-- <el-card v-if="dialogProps.type === 'dicts'">
        <el-row>
          <label>count：</label>
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
        </el-row> -->

      <h5>选项数据路径配置：</h5>
      <el-card>
        <el-form label-width="120px" :inline="true">
          <el-form-item label="data_path">
            <el-input size="small" class="code-input" v-model="dialogProps.value.source.res.data_path"></el-input>
          </el-form-item>
          <el-form-item label="show_key">
            <el-input size="small" class="code-input" v-model="dialogProps.value.source.res.show_key"></el-input>
          </el-form-item>
        </el-form>
      </el-card>

      <template>
        <h5>多选选择个数配置：</h5>
        <el-card>
          <el-form label-width="90px" :inline="true">
            <el-form-item label="个数类型">
              <el-select size="small" v-model="dialogProps.value.count.type" @change="countTypeChange" placeholder="请选择">
                <el-option v-for="item in countConfig" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <br>
            <template v-if="dialogProps.value.count.type === 'static'">
              <el-form-item label="Min">
                <el-input-number size="small"
                  v-model="dialogProps.value.count.min"
                  :min="1" :max="dialogProps.value.count.max"></el-input-number>
              </el-form-item>
              <el-form-item label="Max">
                <el-input-number v-model="dialogProps.value.count.max"
                  size="small" :min="1"></el-input-number>
              </el-form-item>
            </template>
            <template v-if="['message_header', 'message_body'].includes(dialogProps.value.count.type)">
              <el-form-item label="流程节点 ID">
                <el-input v-model="dialogProps.value.count.id" size="small"></el-input>
              </el-form-item>
            </template>
            <template v-if="dialogProps.value.count.type && dialogProps.value.count.type !== 'static'">
              <el-form-item label="属性路径">
                <el-input class="code-input" v-model="dialogProps.value.count.key_path" size="small"></el-input>
              </el-form-item>
            </template>
          </el-form>
        </el-card>
      </template>

      <template v-if="isSearchBar">
        <h5>显示条件配置：</h5>
        <el-card>
          <el-form label-width="90px" :inline="true">
            <el-form-item label="比较变量">
              <el-select v-model="dialogProps.value.show.type">
                <el-option label="form_header" value="form_header"></el-option>
                <el-option label="message_header" value="message_header"></el-option>
                <el-option label="message_body" value="message_body"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="流程节点 ID" v-if="dialogProps.value.show.type !== 'form_header'">
              <el-input v-model="dialogProps.value.show.id"></el-input>
            </el-form-item>
            <el-form-item label="属性路径">
              <el-input class="code-input" v-model="dialogProps.value.show.key_path"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="判断条件" style="width: auto">
              <el-select v-model="dialogProps.value.show.op">
                <el-option label="等于" value="eq"></el-option>
                <el-option label="不等于" value="neq"></el-option>
              </el-select>
              <el-input class="code-input" v-model="dialogProps.value.show.value"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </template>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onSubmit" type="primary" icon="check">OK</el-button>
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
        allowCreate: this.dialogProps.value && this.dialogProps.value.allowCreate ? this.dialogProps.value.allowCreate : true,
        countConfig: [ 'static', 'form_header', 'form_body', 'message_header', 'message_body' ]
      }
    },
    computed: {
      isSearchBar () {
        return this.dialogProps.value.type === 'search_bar'
      }
    },
    created () {
      console.log(this.dialogProps)
      // console.log(this.dialogProps.value.type)
      // console.log(this.dialogProps.value.count)
      // console.log(this.dialogProps.value.show)
    },
    methods: {
      selectParams (cmd) {
        let param = null
        switch (cmd) {
          case 'static':
            param = {
              id: '',
              op: '',
              value: {
                type: 'static',
                value: ''
              }
            }
            break
          case 'input':
            param = {
              id: '',
              op: '',
              value: {
                type: 'input',
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
        this.dialogProps.value.source.data.params.push(param)
      },
      // 切换类型 加不同的属性
      countTypeChange (type) {
        this.dialogProps.value.count = {} // 清除
        this.$set(this.dialogProps.value.count, 'type', type)
        if (type === 'static') {
          // 静态
          this.$set(this.dialogProps.value.count, 'min', 1)
          this.$set(this.dialogProps.value.count, 'max', 1)
        } else if (type) {
          // 本表单
          this.$set(this.dialogProps.value.count, 'key_path', '')
        }
        // 历史表单
        if (['message_header', 'message_body'].includes(type)) {
          this.$set(this.dialogProps.value.count, 'id', '')
        }
      },
      // 删除操作
      paramsDelBtn (arr, item) {
        arr.splice(arr.indexOf(item), 1)
      },
      onSubmit () {
        this.dialogProps.value.confVisible = false
      },

      onClose () {
        if (this.dialogProps.value.type !== 'search_bar') {
          this.dialogProps.value.allow_create = this.allowCreate
        }
      }
    }
  }
</script>
