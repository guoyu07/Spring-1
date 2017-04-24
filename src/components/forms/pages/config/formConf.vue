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
      font-size: 12px;
      margin-left: 4px;
      color: #333;
    }
  }
</style>

<template>
  <div class="form-config">
    <el-collapse v-if="configData.length" :value="activatedItem">
      <el-collapse-item v-for="itemConf of configData" :title="itemConf.name" :name="itemConf.name">
        <el-row>
          <el-col :span="22" :offset="1">
            <el-form label-position="left" :inline="true">
              <el-row>
                <el-form-item style="width: 100%">
                  <el-checkbox v-model="itemConf.required">必填</el-checkbox>
                  <el-checkbox v-model="itemConf.unique">唯一</el-checkbox>
                  <el-checkbox v-model="itemConf.need_submit">需要提交</el-checkbox>
                  <el-checkbox v-model="itemConf.readonly">只读</el-checkbox>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="默认值" style="width: 100%">
                  <el-popover placement="right" trigger="click">
                    <default-conf :dialog-props="itemConf"></default-conf>
                    <el-button size="small" slot="reference">配置默认值</el-button>
                  </el-popover>
                  <span v-if="itemConf.default.type" class="default-preview"><code>{{JSON.stringify(itemConf.default)}}</code></span>
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
              </el-row>
              <el-row>
                <el-form-item label="分组组名">
                  <el-input size="small" v-model="itemConf.category"></el-input>
                </el-form-item>
                <el-form-item label="字段类型">
                  <el-select size="small" v-model="itemConf.value.type">
                    <el-option label="字符串" value="str"></el-option>
                    <el-option label="长文本" value="strArea"></el-option>
                    <el-option label="数字" value="int"></el-option>
                    <el-option label="数组" value="arr"></el-option>
                    <el-option label="日期" value="date"></el-option>
                    <el-option label="时间" value="datetime"></el-option>
                    <el-option label="下拉单选" value="enum"></el-option>
                    <el-option label="下拉多选" value="enum/multi"></el-option>
                    <el-option label="下拉单选（API）" value="dict"></el-option>
                    <el-option label="下拉多选（API）" value="dicts"></el-option>
                    <el-option label="搜索条件" value="search_bar"></el-option>
                  </el-select>
                  <!--静态选项-->
                  <el-popover v-if="['enum', 'enum/multi'].includes(itemConf.value.type)"
                    placement="right" trigger="click" @show="showMultiConf(itemConf)">
                    <options-conf :conf-arr="itemConf.value.regex"></options-conf>
                    <el-button size="small" slot="reference">配置选项</el-button>
                  </el-popover>
                  <!--动态选项（cmdb）-->
                  <template v-if="['dict', 'dicts'].includes(itemConf.value.type)">
                    <el-button size="small" @click="showCMDBConf(itemConf)">配置选项</el-button>
                    <options-conf-cmdb :dialog-props="itemConf"></options-conf-cmdb>
                  </template>
                  <!-- 搜索元件 -->
                  <template v-if="itemConf.value.type === 'search_bar'">
                    <el-button size="small" @click="showCMDBConf(itemConf)">配置选项</el-button>
                    <options-conf-cmdb :dialog-props="itemConf"></options-conf-cmdb>
                  </template>
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
  </div>
</template>

<script>
import optionsConf from './optionsConf' // 配置下拉选项（静态）的表单
import optionsConfCmdb from './optionsConfCMDB' // 配置下拉选项（动态）的表单
import defaultConf from './defaultConf'

export default {
  props: {
    configData: Array
  },
  data () {
    return {
      activatedItem: [],
      needDefault: false,
      countConfig: [ 'static', 'form_header', 'form_body', 'message_header', 'message_body' ]
    }
  },
  methods: {
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
      this.configData.push({
        id: '',
        name: '新字段',
        category: '', // 分组
        unique: false, // 唯一
        required: true, // 必填
        need_submit: true, // 需要提交
        readonly: false,
        default: {
          confVisible: false,
          type: ''
        },
        value: {
          confVisible: false,
          regex: [],
          type: ''
        }
      })
      this.activatedItem.push('新字段')
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
    defaultConf
  }
}
</script>
