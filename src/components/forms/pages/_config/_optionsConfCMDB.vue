<style lang="less" scoped>
  .conf-cmdb-contain {
    max-width: 400px;
    max-height: 80vh;
    overflow: scroll;

    .el-row, .el-col {
      margin-bottom: 4px;
    }
    .el-form-item {
      margin: 0;
      width: 49%;
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

  .detail-popover {
    font-size: 12px;

    .el-form-item {
      margin-bottom: 4px;
    }
  }
</style>

<template>
  <!-- <el-dialog class="cmdb-config-dialog" title="字典选项配置" v-model="dialogProps.value.confVisible"> -->
    <!-- <el-radio-group v-model="optionType">
      <el-radio label="dynamic">动态</el-radio>
      <el-radio label="static">静态</el-radio>
    </el-radio-group>
    <hr> -->

    <!-- <div class="conf-cmdb-contain" v-if="optionType === 'static'">
      <el-collapse>
        <el-collapse-item v-for="(obj, index) of dialogProps.value.regex" :title="'字典' + index">
          <el-row>
            <el-form label-width="80px">
              <el-form-item v-for="(value, key) in obj" :label="key">
                <span>{{value}}</span>
                <el-input size="small" v-model="obj[key]"></el-input>
              </el-form-item>
            </el-form>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <el-row style="margin-top: 12px">
        <el-button type="success" :plain="true" size="small" icon="plus" @click="onAddDict">添加字典对象</el-button>
        <el-button type="info" :plain="true" size="small" icon="plus" @click="onAddField">添加键值对</el-button>
      </el-row>
    </div> -->

    <div class="conf-cmdb-contain" v-if="dialogProps.value.source">
      <el-form :model="dialogProps.value.source" label-width="120px" :inline="true">
        <el-form-item label="URL (请求地址)">
          <el-input size="small" class="code-input" v-model="dialogProps.value.source.url"></el-input>
        </el-form-item>
        <el-form-item label="Action (动作)">
          <el-input size="small" class="code-input" v-model="dialogProps.value.source.data.action"></el-input>
        </el-form-item>
        <el-form-item label="Method (方法)">
          <el-input size="small" class="code-input" v-model="dialogProps.value.source.data.method"></el-input>
        </el-form-item>
        <el-form-item label="Params (参数)">
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
          <el-radio v-model="dialogProps.value.allow_create" :label="true">是</el-radio>
          <el-radio v-model="dialogProps.value.allow_create" :label="false">否</el-radio>
        </el-form-item>
      </el-form>

      <h5 v-if="dialogProps.value.source.data.params.length">接口请求参数：</h5>
      <el-collapse v-if="dialogProps.value.source.data.params.length">
        <el-collapse-item v-for="param in dialogProps.value.source.data.params">
          <template slot="title">
            <span>{{ param.value.type }}>{{ param.id }}</span>
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

      <h5>选择 API 预设集：</h5>
      <el-card v-if="optionPresets.length">
        <el-radio-group v-model="selectedOption" @change="onSelectOption">
          <el-popover
            placement="top"
            trigger="hover"
            v-for="api in optionPresets"
            :title="api.name">
            <el-form label-position="right" label-width="60px" class="detail-popover">
              <el-form-item label="Action"><code>{{api.action}}</code></el-form-item>
              <el-form-item label="Data path"><code>{{api.data_path}}</code></el-form-item>
              <el-form-item label="Method"><code>{{api.method}}</code></el-form-item>
              <el-form-item label="URL"><code>{{api.url}}</code></el-form-item>
              <!-- <el-form-item label="Params"><code>{{api.params}}</code></el-form-item> -->
            </el-form>
            <el-radio slot="reference" :label="api" :key="api">{{api.name}}</el-radio>
          </el-popover>
        </el-radio-group>
      </el-card>

      <h5>选项数据路径配置：</h5>
      <el-card>
        <el-form label-position="top" :inline="true">
          <el-form-item label="data_path (属性路径)">
            <el-input size="small" class="code-input" v-model="dialogProps.value.source.res.data_path"></el-input>
          </el-form-item>
          <el-form-item label="show_key (显示键名)">
            <el-input size="small" class="code-input" v-model="dialogProps.value.source.res.show_key"></el-input>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- <template v-if="dialogProps.value.type === 'dicts'">
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
      </template> -->

    </div>
    <!-- <div slot="footer" class="dialog-footer">
      <el-button @click="onSubmit" type="primary" icon="check">OK</el-button>
    </div>
  </el-dialog> -->
</template>

<script>
  export default {
    props: {
      dialogProps: Object,
      optionPresets: Array
    },
    data () {
      return {
        optionType: 'dynamic',
        selectedOption: {},
        allowCreate: this.dialogProps.value && this.dialogProps.value.allowCreate ? this.dialogProps.value.allowCreate : true,
        countConfig: [ 'static', 'form_header', 'form_body', 'message_header', 'message_body' ]
      }
    },
    computed: {
      isSearchBar () {
        return this.dialogProps.value.type === 'search_bar'
      }
    },
    methods: {
      onSelectOption (val) {
        Object.assign(this.dialogProps.value.source.data, { action: val.action, method: val.method })
        Object.assign(this.dialogProps.value.source.res, { data_path: val.data_path })
        this.dialogProps.value.source.url = val.url
      },
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
      onAddDict () {
        console.log(this.dialogProps.value)
        if (!this.dialogProps.value.regex.length) {
          this.dialogProps.value.regex.push({
            name: 'new'
          })
        } else {
          this.dialogProps.value.regex.push(this.dialogProps.value.regex[this.dialogProps.value.regex.length - 1])
        }
      },
      onAddField () {
        // 弹窗填写 k-v，非空时执行以下
        let key = ''
        let value = ''
        for (let dict of this.dialogProps.value.regex) {
          this.$set(dict, key, value)
        }
        console.log(this.dialogProps.value.regex)
      },
      onSubmit () {
        console.log(this.dialogProps.value.confVisible)
        this.$set(this.dialogProps.value, 'confVisible', false)
        console.log(this.dialogProps.value.confVisible)
      },

      onClose () {
        if (this.dialogProps.value.type !== 'search_bar') {
          this.dialogProps.value.allow_create = this.allowCreate
        }
        this.dialogProps.value.confVisible = false
        console.log(this.dialogProps.value.confVisible)
      }
    }
  }
</script>
