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
  .el-collapse-item__content {
    padding: 0;
  }
</style>

<template>
  <!-- <el-dialog class="cmdb-config-dialog" title="字典选项配置" v-model="itemConf.value.confVisible"> -->
    <!-- <el-radio-group v-model="optionType">
      <el-radio label="dynamic">动态</el-radio>
      <el-radio label="static">静态</el-radio>
    </el-radio-group>
    <hr> -->

    <!-- <div class="conf-cmdb-contain" v-if="optionType === 'static'">
      <el-collapse>
        <el-collapse-item v-for="(obj, index) of itemConf.value.regex" :title="'字典' + index">
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

    <div class="conf-cmdb-contain" v-if="itemConf.value.source">
      <el-form :model="itemConf.value.source" label-width="120px" label-position="left" :inline="true">
        <el-form-item label="URL">
          <el-input size="small" class="code-input" v-model="itemConf.value.source.url" placeholder="请求地址"></el-input>
        </el-form-item>
        <el-form-item label="Action">
          <el-input size="small" class="code-input" v-model="itemConf.value.source.data.action" placeholder="动作"></el-input>
        </el-form-item>
        <el-form-item label="Method">
          <el-input size="small" class="code-input" v-model="itemConf.value.source.data.method" placeholder="方法"></el-input>
        </el-form-item>
        <el-form-item label="Params">
          <el-dropdown trigger="click" @command="selectedParams">
            <el-button size="small" type="primary" :plain="true" icon="plus">添加参数</el-button>
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
        <el-form-item label="允许新增选项" v-if="!isSearchBar">
          <el-radio v-model="itemConf.value.allow_create" :label="true">是</el-radio>
          <el-radio v-model="itemConf.value.allow_create" :label="false">否</el-radio>
        </el-form-item>
      </el-form>

      <h5 v-if="itemConf.value.source.data.params.length">接口请求参数：</h5>
      <el-collapse v-if="itemConf.value.source.data.params.length">
        <el-collapse-item v-for="param in itemConf.value.source.data.params">
          <template slot="title">
            <span>{{ param.value.type }}>{{ param.id }}</span>
            <el-button size="mini" icon="delete" type="danger" class="del-btn"
              @click.stop="paramsDelBtn(itemConf.value.source.data.params, param)">
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
              <el-form-item label="默认值类型" v-if="isSearchBar && param.value.type === 'input'">
                <el-select v-model="param.default.type" size="small">
                  <el-option v-for="item in defaultOptions" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="默认值" v-if="param.default.type === 'static'">
                <el-input v-model="param.default.value" size="small"></el-input>
              </el-form-item>
              <el-form-item label="默认值属性路径" v-if="['form_header', 'form_body', 'message_header', 'message_body'].includes(param.default.type)">
                <el-input v-model="param.default.key_path" size="small"></el-input>
              </el-form-item>
              <el-form-item label="默认值 ID" v-if="['message_header', 'get'].includes(param.default.type)">
                <el-input v-model="param.default.id" size="small"></el-input>
              </el-form-item>
            </el-form>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <!--多选 配置数量-->
      <!-- <el-card v-if="itemConf.type === 'dicts'">
        <el-row>
          <label>count：</label>
          <el-select v-model="itemConf.count.type" @change="countTypeChange" placeholder="请选择">
            <el-option v-for="item in countConfig" :value="item"></el-option>
          </el-select>
        </el-row>
        <el-row>
          <template v-if="itemConf.count.type === 'static'">
            <label>min：</label>
            <el-input-number size="small"
              v-model="itemConf.count.min"
              :min="1" :max="itemConf.count.max"/>
            <label>max：</label>
            <el-input-number v-model="itemConf.count.max"
              size="small" :min="1"/>
          </template>
          <template v-if="['message_header', 'message_body'].includes(itemConf.count.type)">
            <label>流程环节 id：</label>
            <el-input v-model="itemConf.count.id" size="small"></el-input>
          </template>
          <template v-if="itemConf.count.type && itemConf.count.type !== 'static'">
            <label>属性 key_path：</label>
            <el-input v-model="itemConf.count.key_path" size="small"></el-input>
          </template>
        </el-row> -->

      <h5>选项数据路径配置：</h5>
      <el-card>
        <el-form label-position="top" :inline="true">
          <el-form-item label="data_path">
            <el-input size="small" class="code-input" v-model="itemConf.value.source.res.data_path" placeholder="属性路径"></el-input>
          </el-form-item>
          <el-form-item label="show_key">
            <!-- <el-input size="small" class="code-input" v-model="itemConf.value.source.res.show_key"></el-input> -->
            <el-select
              v-model="itemConf.value.source.res.show_key"
              size="small"
              multiple
              filterable
              allow-create
              placeholder="显示键名">
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>

      <h5>选择 API 预设集：</h5>
      <template v-if="optionPresets && optionPresets.length">
        <el-card>
          <el-select placeholder="API 预设集" v-model="selectedPreset" value-key="name" @change="onSelectPreset">
            <el-option-group
              v-for="group in optionPresets"
              :key="group.name"
              :label="group.name">
              <el-option v-for="preset in group.list" :label="preset.name" :value="preset"></el-option>
            </el-option-group>
          </el-select>
        </el-card>
        <!-- <el-radio-group v-model="selectedOption" @change="onSelectPreset">
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
            </el-form>
            <el-radio slot="reference" :label="api" :key="api">{{api.name}}</el-radio>
          </el-popover>
        </el-radio-group> -->
        <!-- <el-table
          ref="presetTable"
          :data="optionPresets"
          highlight-current-row
          @current-change="handleCurrentChange"
          style="width: 100%">
          <el-table-column
            property="name"
            label="名称">
          </el-table-column>
          <el-table-column
            property="url"
            label="请求地址">
          </el-table-column>
          <el-table-column
            property="action"
            label="动作">
          </el-table-column>
          <el-table-column
            property="data_path"
            label="属性路径">
          </el-table-column>
        </el-table> -->
      </template>

      <!-- <template v-if="itemConf.value.type === 'dicts'">
        <h5>多选选择个数配置：</h5>
        <el-card>
          <el-form label-width="90px" :inline="true">
            <el-form-item label="个数类型">
              <el-select size="small" v-model="itemConf.value.count.type" @change="countTypeChange" placeholder="请选择">
                <el-option v-for="item in countConfig" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <br>
            <template v-if="itemConf.value.count.type === 'static'">
              <el-form-item label="Min">
                <el-input-number size="small"
                  v-model="itemConf.value.count.min"
                  :min="1" :max="itemConf.value.count.max"></el-input-number>
              </el-form-item>
              <el-form-item label="Max">
                <el-input-number v-model="itemConf.value.count.max"
                  size="small" :min="1"></el-input-number>
              </el-form-item>
            </template>
            <template v-if="['message_header', 'message_body'].includes(itemConf.value.count.type)">
              <el-form-item label="流程节点 ID">
                <el-input v-model="itemConf.value.count.id" size="small"></el-input>
              </el-form-item>
            </template>
            <template v-if="itemConf.value.count.type && itemConf.value.count.type !== 'static'">
              <el-form-item label="属性路径">
                <el-input class="code-input" v-model="itemConf.value.count.key_path" size="small"></el-input>
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
  import eventHub from './../../../../utils/event-hub.js'
  export default {
    props: {
      itemConf: Object,
      optionPresets: Array,
      isBody: Boolean
    },
    mounted () {
      if (this.itemConf.value.external) {
        // 若是外键，默认选中 API 预设集第一个
        this.selectedPreset = this.optionPresets[0]
        eventHub.$on('cmdb-got-shown', this.handleCMDBShown)
        // eventHub.$on('cmdb-got-shown', this.handleCMDBShown)
      }
    },
    data () {
      return {
        // optionType: 'dynamic',
        // currentRowKey: null,
        selectedPreset: {},
        allowCreate: this.itemConf.value && this.itemConf.value.allowCreate ? this.itemConf.value.allowCreate : true,
        countConfig: [ 'static', 'form_header', 'form_body', 'message_header', 'message_body' ]
      }
    },
    computed: {
      isSearchBar () {
        return this.itemConf.value.type === 'search_bar'
      },

      defaultOptions () {
        return this.isBody ? [ 'static', 'form_header', 'form_body', 'message_header', 'message_body', 'get' ] : [ 'static', 'form_header', 'form_body', 'message_header' ]
      }
    },
    methods: {
      handleCMDBShown () {
        Object.assign(this.itemConf.value.source.data, { action: this.selectedPreset.action, method: this.selectedPreset.method })
        Object.assign(this.itemConf.value.source.res, { data_path: this.selectedPreset.data_path, show_key: [this.itemConf.value.external[0].name] })
        this.itemConf.value.source.url = this.selectedPreset.url
        // this.onSelectPreset(this.selectedPreset)
        // this.itemConf.value.source.res.show_key.push(this.itemConf.value.external[0].name)
      },
      onSelectPreset (val) {
        console.log(val)
        Object.assign(this.itemConf.value.source.data, { action: val.action, method: val.method })
        Object.assign(this.itemConf.value.source.res, { data_path: val.data_path })
        this.itemConf.value.source.url = val.url
      },
      // handleCurrentChange (val) {
      //   Object.assign(this.itemConf.value.source.data, { action: val.action, method: val.method })
      //   Object.assign(this.itemConf.value.source.res, { data_path: val.data_path })
      //   this.itemConf.value.source.url = val.url
      // },
      selectedParams (cmd) {
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
              },
              default: {
                type: 'static',
                value: '',
                key_path: '',
                id: ''
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
        this.itemConf.value.source.data.params.push(param)
      },
      // 切换类型 加不同的属性
      countTypeChange (type) {
        this.itemConf.value.count = {} // 清除
        this.$set(this.itemConf.value.count, 'type', type)
        if (type === 'static') {
          // 静态
          this.$set(this.itemConf.value.count, 'min', 1)
          this.$set(this.itemConf.value.count, 'max', 1)
        } else if (type) {
          // 本表单
          this.$set(this.itemConf.value.count, 'key_path', '')
        }
        // 历史表单
        if (['message_header', 'message_body'].includes(type)) {
          this.$set(this.itemConf.value.count, 'id', '')
        }
      },
      // 删除操作
      paramsDelBtn (arr, item) {
        arr.splice(arr.indexOf(item), 1)
      },
      onAddDict () {
        console.log(this.itemConf.value)
        if (!this.itemConf.value.regex.length) {
          this.itemConf.value.regex.push({
            name: 'new'
          })
        } else {
          this.itemConf.value.regex.push(this.itemConf.value.regex[this.itemConf.value.regex.length - 1])
        }
      },
      onAddField () {
        // 弹窗填写 k-v，非空时执行以下
        let key = ''
        let value = ''
        for (let dict of this.itemConf.value.regex) {
          this.$set(dict, key, value)
        }
        console.log(this.itemConf.value.regex)
      },
      onSubmit () {
        console.log(this.itemConf.value.confVisible)
        this.$set(this.itemConf.value, 'confVisible', false)
        console.log(this.itemConf.value.confVisible)
      },

      onClose () {
        if (!this.isSearchBar) {
          this.itemConf.value.allow_create = this.allowCreate
        }
        this.itemConf.value.confVisible = false
        console.log(this.itemConf.value.confVisible)
      }
    }
  }
</script>
