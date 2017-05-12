<style lang="less" scoped>
  .form-config {
    .el-input, .conf-btn {
      max-width: 180px;
      display: inline-block;
    }
    .el-collapse {
      margin-bottom: 10px;
      .el-row {
        margin-bottom: 8px;
      }
    }

    .default-preview {
      font-size: 10px;
      margin-left: 4px;
      color: #333;
    }
  }
</style>

<template>
  <div class="form-config">
    <el-collapse v-if="configData.length">
      <el-collapse-item v-for="itemConf of configData" :title="itemConf.name + ' - ' + itemConf.value.type">
        <el-row>
          <el-col :span="22" :offset="1">
            <el-form label-position="left" :inline="true">
              <el-row>
                <el-form-item style="width: 100%">
                  <el-checkbox v-model="itemConf.required">必填</el-checkbox>
                  <el-checkbox v-model="itemConf.unique">唯一</el-checkbox>
                  <el-checkbox v-model="itemConf.need_submit">需要提交</el-checkbox>
                  <el-checkbox v-model="itemConf.readonly">只读</el-checkbox>
                  <el-checkbox v-if="itemConf.value.type === 'dict' || itemConf.value.type === 'dicts' || itemConf.value.type === 'search_bar'" v-model="itemConf.cmdb_need_check">是否检查／占用资源</el-checkbox>
                  <el-checkbox v-if="itemConf.value.type === 'str' || itemConf.value.type === 'enum' || itemConf.value.type ==='dict' || itemConf.value.type === 'dicts' || itemConf.value.type ==='enums'" v-model="itemConf.isAlias">
                    <span v-if="itemConf.value.type === 'str'">长文本（textarea）</span>
                    <span v-if="itemConf.value.type === 'enum' || itemConf.value.type ==='dict'">单选框（radio）</span>
                    <span v-if="itemConf.value.type === 'dicts' || itemConf.value.type ==='enums'">多选框（checkbox）</span>
                  </el-checkbox>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="默认值" v-if="itemConf.value.type !== 'table'">
                  <el-popover placement="right" trigger="click">
                    <default-conf :dialog-props="itemConf"></default-conf>
                    <el-button size="small" slot="reference">配置默认值</el-button>
                  </el-popover>
                  <el-tooltip placement="top" v-if="itemConf.default.type">
                    <div slot="content">
                      <p><b>默认值来源：</b>{{itemConf.default.type}}</p>
                      <p v-if="itemConf.default.type === 'static'"><b>静态值：</b>{{itemConf.default.value}}</p>
                      <p v-if="itemConf.default.type.includes('message_')"><b>流程节点 ID：</b>{{itemConf.default.id}}</p>
                      <p v-if="itemConf.default.type !== 'static'"><b>属性路径：</b>{{itemConf.default.key_path}}</p>
                    </div>
                    <el-button type="text"><i class="el-icon-fa-eye"></i></el-button>
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="监听字段">
                  <el-input v-model="itemConf.watch" placeholder="字段 ID" class="code-input" size="small"></el-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="属性名称">
                  <el-input size="small" v-model="itemConf.name" placeholder="属性 Label"></el-input>
                </el-form-item>
                <el-form-item label="属性 ID">
                  <el-input size="small" class="code-input" v-model="itemConf.id"></el-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="占位描述">
                  <el-input size="small" v-model="itemConf.placeholder" placeholder="控件的 placeholder"></el-input>
                </el-form-item>
                <el-form-item label="额外描述">
                  <el-input size="small" v-model="itemConf.description" placeholder="控件的外部描述"></el-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="分组组名">
                  <el-input size="small" v-model="itemConf.category"></el-input>
                </el-form-item>
                <el-form-item label="字段类型">
                  <el-select size="small" v-model="itemConf.value.type">
                    <el-option label="字符串" value="str"></el-option>
                    <el-option label="数字" value="int"></el-option>
                    <el-option label="数组" value="arr"></el-option>
                    <el-option label="日期" value="date"></el-option>
                    <el-option label="时间" value="datetime"></el-option>
                    <el-option label="下拉单选" value="enum"></el-option>
                    <el-option label="下拉多选" value="enums"></el-option>
                    <el-option label="下拉单选（API）" value="dict"></el-option>
                    <el-option label="下拉多选（API）" value="dicts"></el-option>
                    <el-option label="搜索条件" value="search_bar"></el-option>
                    <el-option label="表格" value="table"></el-option>
                  </el-select>
                  <!--静态选项-->
                  <el-popover v-if="['enum', 'enums'].includes(itemConf.value.type)"
                    placement="right" trigger="click" @show="showMultiConf(itemConf)">
                    <options-conf :conf-arr="itemConf.value.regex"></options-conf>
                    <el-button size="small" slot="reference">配置选项</el-button>
                  </el-popover>
                  <!--动态选项（cmdb）-->
                  <template v-if="['dict', 'dicts'].includes(itemConf.value.type)">
                    <el-button size="small" @click="showCMDBConf(itemConf)">配置选项</el-button>
                    <options-conf-cmdb :dialog-props="itemConf"></options-conf-cmdb>
                  </template>
                  <!--表格-->
                  <template v-if="itemConf.value.type === 'table'">
                    <el-button size="small" @click="showTableConf(itemConf)">配置表格</el-button>
                    <table-conf :dialog-props="itemConf"></table-conf>
                  </template>
                  <!-- 搜索元件 -->
                  <template v-if="itemConf.value.type === 'search_bar'">
                    <el-button size="small" @click="showCMDBConf(itemConf)">配置选项</el-button>
                    <options-conf-cmdb :dialog-props="itemConf"></options-conf-cmdb>
                  </template>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="个数限制" v-if="['enums', 'dicts', 'search_bar', 'table', 'arr'].includes(itemConf.value.type)">
                  <el-popover placement="right" trigger="click">
                    <limit-conf :dialog-props="itemConf"></limit-conf>
                    <el-button size="small" slot="reference">配置个数</el-button>
                  </el-popover>
                  <el-tooltip placement="top" v-if="itemConf.limit.type">
                    <div slot="content">
                      <p><b>默认值来源：</b>{{itemConf.limit.type}}</p>
                      <p v-if="itemConf.limit.type === 'static'"><b>最大值：</b>{{itemConf.limit.max}}</p>
                      <p v-if="itemConf.limit.type === 'static'"><b>最小值：</b>{{itemConf.limit.min}}</p>
                      <p v-if="itemConf.limit.type.includes('message_')"><b>流程节点 ID：</b>{{itemConf.limit.id}}</p>
                      <p v-if="itemConf.limit.type !== 'static'"><b>属性路径：</b>{{itemConf.limit.key_path}}</p>
                    </div>
                    <el-button type="text"><i class="el-icon-fa-eye"></i></el-button>
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="数据规则" v-if="['arr', 'str'].includes(itemConf.value.type)">
                  <el-input v-model="itemConf.value.regex" placeholder="正则表达式" class="code-input" size="small"></el-input>
                </el-form-item>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
        <el-row type="flex" justify="end">
          <el-button size="small" type="danger" icon="delete" @click="onDeleteField(configData, itemConf)">删除字段</el-button>
        </el-row>
      </el-collapse-item>
    </el-collapse>
    <el-button icon="plus" type="info" :plain="true" size="small" @click="onAddField">添加字段</el-button>
    <el-row style="margin-top: 12px">
      <el-select size="small" v-model="selectedPreset" placeholder="选择预设集">
        <el-option v-for="obj in presets" :key="obj" :value="obj" :label="obj.name"></el-option>
      </el-select>
      <el-button icon="more" type="info" :plain="true" size="small" @click="showPresetConf" v-if="selectedPreset !== {}">配置预设集</el-button>
    </el-row>
    <preset-conf :selected-preset="selectedPreset" :current-fields="configData"></preset-conf>
  </div>
</template>

<script>
import optionsConf from './optionsConf' // 配置下拉选项（静态）的表单
import optionsConfCmdb from './optionsConfCMDB' // 配置下拉选项（动态）的表单
import tableConf from './tableConf' // 配置表格
import defaultConf from './defaultConf'
import limitConf from './limitConf'
import presetConf from './presetConf'

export default {
  props: {
    configData: Array,
    presets: Array
  },
  data () {
    return {
      selectedPreset: {},
      needDefault: false,
      countConfig: [ 'static', 'form_header', 'form_body', 'message_header', 'message_body' ]
    }
  },
  methods: {
    // 导入预设集
    importPreset (preset, currentFields) {
      for (let attr of preset) {
        if (currentFields.every(i => i.id !== attr.id)) {
          Object.assign(attr, { need_submit: false, isAlias: false, default: { type: '' } })
          currentFields.push(attr)
        }
      }
      console.log(currentFields)
    },
    // 显示预设集弹窗
    showPresetConf () {
      this.selectedPreset.confVisible = true
    },
    // 显示静态下拉的选项
    showMultiConf (itemConf) {
      if (!itemConf.value.regex) itemConf.value.regex = []
    },
    // CMDB 获取参数配置
    showCMDBConf (itemConf) {
      if (itemConf.value.source || itemConf.value.count) {
        // 已经加过的属性的
      } else {
        // 初始化属性
        this.$set(itemConf.value, 'count', { type: '' })
        this.$set(itemConf.value, 'source', {
          url: '',
          data: {
            action: '',
            method: '',
            params: []
          },
          // 选项数据路径配置
          res: {
            data_path: '',
            show_key: ''
          }
        })
        this.$set(itemConf.value, 'show', {
          type: '',
          key_path: '',
          op: '',
          value: ''
        })
      }
      itemConf.value.confVisible = true
    },
    // 表格配置
    showTableConf (itemConf) {
      if (!itemConf.value.count) this.$set(itemConf.value, 'count', { type: '' })
      if (!itemConf.value.attr_list) this.$set(itemConf.value, 'attr_list', [])
      itemConf.value.confVisible = true
    },
    // 默认值配置
    // showDefaultConf (itemConf) {
    //   if (itemConf.default) {
    //     // 已有
    //   } else {
    //     this.$set(itemConf, 'default', { type: '' })
    //   }
    //   itemConf.default.confVisible = true
    // },
    // 添加一个字段
    onAddField () {
      console.log(this)
      this.configData.push({
        id: '',
        name: '',
        category: '', // 分组
        unique: false, // 唯一
        required: true, // 必填
        need_submit: true, // 需要提交
        readonly: false,
        isAlias: false,
        default: {
          type: '',
          value: '',
          id: '',
          key_path: ''
        },
        limit: {
          type: '',
          max: 0,
          min: 0,
          id: '',
          key_path: ''
        },
        value: {
          confVisible: false,
          regex: [],
          type: ''
        }
      })
      // this.activatedItem.push('新字段')
    },
    // 删除一个字段 （删除操作 可以封装为全局方法）
    onDeleteField (arr, item) {
      this.$confirm('确定要删除这个字段吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        arr.splice(arr.indexOf(item), 1)
      })
    }
  },
  components: {
    optionsConf,
    optionsConfCmdb,
    tableConf,
    defaultConf,
    limitConf,
    presetConf
  }
}
</script>