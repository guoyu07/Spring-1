<style scoped>
  .conf-table-contain {
    max-width: 400px;
  }
  .el-form-item {
    margin-bottom: 8px;
  }

  .v-modal {
    z-index: 0 !important;
  }
</style>

<template>
  <!-- <el-dialog title="表格配置" v-model="dialogProps.value.confVisible" v-if="dialogProps.value.attr_list"> -->
  <div class="conf-table-contain" v-if="dialogProps.value.attr_list">
    <el-collapse v-if="dialogProps.value.attr_list.length">
      <el-collapse-item v-for="(attr, index) of dialogProps.value.attr_list" :title="attr.name">
        <el-form label-position="left" :inline="true">
          <el-form-item style="width: 100%">
            <el-checkbox v-model="attr.required">必填</el-checkbox>
            <el-checkbox v-model="attr.unique">唯一</el-checkbox>
            <el-checkbox v-model="attr.need_submit">需要提交</el-checkbox>
            <el-checkbox v-model="attr.readonly">只读</el-checkbox>
            <el-checkbox v-if="attr.value.type === 'dict' || attr.value.type === 'dicts'" v-model="attr.cmdb_need_check">是否检查／占用资源</el-checkbox>
            <el-checkbox v-if="attr.value.type === 'str' || attr.value.type === 'enum' || attr.value.type ==='dict' || attr.value.type === 'dicts' || attr.value.type ==='enums'" v-model="attr.isAlias">
              <span v-if="attr.value.type === 'str'">长文本（textarea）</span>
              <span v-if="attr.value.type === 'enum' || attr.value.type ==='dict'">单选框（radio）</span>
              <span v-if="attr.value.type === 'dicts' || attr.value.type ==='enums'">多选框（checkbox）</span>
            </el-checkbox>
          </el-form-item>
          <el-form-item label="默认值" v-if="attr.value.type !== 'table'">
            <el-popover placement="right" trigger="click">
              <default-conf :dialog-props="attr"></default-conf>
              <el-button size="small" slot="reference">配置默认值</el-button>
            </el-popover>
            <el-tooltip placement="top" v-if="attr.default.type">
              <div slot="content">
                <p><b>默认值来源：</b>{{attr.default.type}}</p>
                <p v-if="attr.default.type === 'static'"><b>静态值：</b>{{attr.default.value}}</p>
                <p v-if="attr.default.type.includes('message_')"><b>流程节点 ID：</b>{{attr.default.id}}</p>
                <p v-if="attr.default.type !== 'static'"><b>属性路径：</b>{{attr.default.key_path}}</p>
              </div>
              <el-button type="text"><i class="el-icon-fa-eye"></i></el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="监听字段">
            <el-input v-model="attr.watch" placeholder="字段 ID" class="code-input" size="small"></el-input>
          </el-form-item>
          <el-form-item label="属性名称">
            <el-input size="small" v-model="attr.name" placeholder="属性 Label"></el-input>
          </el-form-item>
          <el-form-item label="属性 ID">
            <el-input size="small" class="code-input" v-model="attr.id"></el-input>
          </el-form-item>
          <el-form-item label="占位描述">
            <el-input size="small" v-model="attr.placeholder" placeholder="控件的 placeholder"></el-input>
          </el-form-item>
          <el-form-item label="额外描述">
            <el-input size="small" v-model="attr.description" placeholder="控件的外部描述"></el-input>
          </el-form-item>
          <el-form-item label="分组组名">
            <el-input size="small" v-model="attr.category"></el-input>
          </el-form-item>
          <el-form-item label="字段类型">
            <el-select size="small" v-model="attr.value.type">
              <el-option label="字符串" value="str"></el-option>
              <el-option label="数字" value="int"></el-option>
              <el-option label="数组" value="arr"></el-option>
              <el-option label="日期" value="date"></el-option>
              <el-option label="时间" value="datetime"></el-option>
              <el-option label="下拉单选" value="enum"></el-option>
              <el-option label="下拉多选" value="enums"></el-option>
              <el-option label="下拉单选（API）" value="dict"></el-option>
              <el-option label="下拉多选（API）" value="dicts"></el-option>
            </el-select>
            <!--静态选项-->
            <el-popover v-if="['enum', 'enums'].includes(attr.value.type)"
              placement="right" trigger="click" @show="showMultiConf(attr)">
              <options-conf :conf-arr="attr.value.regex"></options-conf>
              <el-button size="small" slot="reference">配置选项</el-button>
            </el-popover>
            <!--动态选项（cmdb）-->
            <el-popover v-if="['dict', 'dicts', 'search_bar'].includes(attr.value.type)" placement="top" trigger="click" @show="showCMDBConf(attr)">
              <options-conf-cmdb :item-conf="attr" :option-presets="optionPresets"></options-conf-cmdb>
              <el-button size="small" slot="reference">配置选项</el-button>
            </el-popover>
          </el-form-item>
          <el-form-item label="个数限制" v-if="['enums', 'dicts', 'search_bar', 'table', 'arr'].includes(attr.value.type)">
            <el-popover placement="right" trigger="click">
              <limit-conf :dialog-props="attr"></limit-conf>
              <el-button size="small" slot="reference">配置个数</el-button>
            </el-popover>
            <el-tooltip placement="top" v-if="attr.limit.type">
              <div slot="content">
                <p><b>默认值来源：</b>{{attr.limit.type}}</p>
                <p v-if="attr.limit.type === 'static'"><b>最大值：</b>{{attr.limit.max}}</p>
                <p v-if="attr.limit.type === 'static'"><b>最小值：</b>{{attr.limit.min}}</p>
                <p v-if="attr.limit.type.includes('message_')"><b>流程节点 ID：</b>{{attr.limit.id}}</p>
                <p v-if="attr.limit.type !== 'static'"><b>属性路径：</b>{{attr.limit.key_path}}</p>
              </div>
              <el-button type="text"><i class="el-icon-fa-eye"></i></el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="数据规则" v-if="['arr', 'str'].includes(attr.value.type)">
            <el-select
              v-model="attr.value.regex"
              multiple
              filterable
              allow-create
              placeholder="一个或多个正则表达式"
              class="code-input"
              size="small"></el-select>
            <!-- <el-input v-model="attr.value.regex" placeholder="正则表达式" class="code-input" size="small"></el-input> -->
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="danger" icon="delete" @click="onDeleteField(dialogProps.value.attr_list, attr)">删除字段</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-button icon="plus" type="info" :plain="true" size="small" @click="onAddField" style="margin-top: 8px;">添加字段</el-button>
    <!-- <template>
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
    <!-- <div slot="footer" class="dialog-footer">
      <el-button @click="onSubmit" type="primary" icon="check">OK</el-button>
    </div> -->
  <!-- </el-dialog> -->
  </div>
</template>

<script>
  import optionsConf from './_optionsConf'
  import optionsConfCmdb from './_optionsConfCMDB'
  import defaultConf from './_defaultConf'
  import limitConf from './_limitConf'

  export default {
    props: {
      dialogProps: Object,
      optionPresets: Array
    },

    data () {
      return {
        countConfig: [ 'static', 'form_header', 'form_body', 'message_header', 'message_body' ]
      }
    },

    methods: {
      showMultiConf (attr) {
        if (!attr.value.regex) attr.value.regex = []
      },

      showCMDBConf (attr) {
        if (attr.value.source || attr.value.count) {
          // 已经加过的属性的
        } else {
          // 初始化属性
          this.$set(attr.value, 'count', { type: '' })
          this.$set(attr.value, 'source', {
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
        }
        attr.value.confVisible = true
        // setTimeout(() => {
        //   document.getElementsByClassName('v-modal')[0].style.zIndex = '999'
        // }, 100)
      },

      onAddField () {
        this.dialogProps.value.attr_list.push({
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
      },

      onDeleteField (arr, item) {
        this.$confirm('确定要删除这个字段吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          arr.splice(arr.indexOf(item), 1)
        })
      },

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

      onSubmit () {
        this.dialogProps.value.confVisible = false
      }
    },
    components: {
      optionsConf,
      optionsConfCmdb,
      defaultConf,
      limitConf
    }
  }
</script>
