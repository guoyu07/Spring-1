<style lang="less" scoped>
  .form-config {
    .el-input, .conf-btn {
      max-width: 180px;
      display: inline-block;
    }
    .el-collapse {
      margin-bottom: 10px;
      .el-form-item {
        margin-bottom: 8px;
      }
    }

    .default-preview {
      font-size: 10px;
      margin-left: 4px;
      color: #333;
    }

    .el-popover {
      max-height: 90vh;
      overflow: scroll;
    }
  }

  .sub-title {
    margin: 0 0 6px;
    text-align: right;
    font-size: 12px;
    font-weight: normal;

    i::before {
      font-size: 12px;
    }
  }

  .detail-popover {
    font-size: 12px;

    .el-form-item {
      margin-bottom: 4px;
    }
  }

  .sortable-chosen {
    background-color: rgba(32,160,255,.1);
    border-color: rgba(32,160,255,.2);

    label {
      color: #20a0ff;
    }
  }
</style>

<template>
  <div class="form-config">
    <!-- <h5 class="sub-title" v-show="configData2.length"><i class="el-icon-fa-arrows"></i> 可拖拽排序</h5> -->
    <h5 class="sub-title" v-show="!configData2.length"><i class="el-icon-warning"></i> 暂无字段</h5>
    <draggable
      v-model="configData2"
      @start="drag=true"
      class="draggable"
      v-show="configData2.length"
      :options="{ handle: '.draggable-item__label' }"
      ref="group">
      <div v-for="(itemConf, index) in configData2" class="draggable-item">
        <input
          type="radio"
          v-model="expandedForm"
          data-tag='0'
          :name="`form-${bodyIndex}`"
          :value="`${bodyIndex}-${itemConf._timeStamp}`"
          :id="`${category}-${bodyIndex}-${index}`"
          :ref="`${bodyIndex}-${itemConf._timeStamp}`"
          @click="close"
        >
        <label class="draggable-item__label draggable__token draggable__token--right" :for="`${category}-${bodyIndex}-${index}`"><b>{{itemConf.name}}</b><span v-if="itemConf.category">{{` - ${itemConf.category}`}}</span> - {{fieldTypeMap[itemConf.value.type]}}</label>
        <section v-if="expandedForm === `${bodyIndex}-${itemConf._timeStamp}`">
          <div class="draggable-item__inner">
            <el-row>
              <el-col :span="22" :offset="1">
                <el-form label-position="left" :inline="true">
                  <el-form-item style="width: 100%">
                    <el-checkbox v-model="itemConf.required">必填</el-checkbox>
                    <el-checkbox v-model="itemConf.unique">唯一</el-checkbox>
                    <el-checkbox v-model="itemConf.need_submit">需要提交</el-checkbox>
                    <el-checkbox v-model="itemConf.readonly">只读</el-checkbox>
                    <el-checkbox v-if="itemConf.value.type === 'dict' || itemConf.value.type === 'dicts' || itemConf.value.type === 'search_bar'" v-model="itemConf.cmdb_need_check">是否检查／占用资源</el-checkbox>
                    <el-checkbox v-if="itemConf.value.type === 'search_bar'" v-model="itemConf.respectively_show">分表单单独显示</el-checkbox>
                    <el-checkbox v-if="['str', 'enum', 'enums', 'dict', 'dicts', 'users', 'orders', 'cascade'].includes(itemConf.value.type)" v-model="itemConf.isAlias">
                      <span v-show="itemConf.value.type === 'str'">长文本（textarea）</span>
                      <span v-show="itemConf.value.type === 'enum' || itemConf.value.type ==='dict'">单选框（radio）</span>
                      <span v-show="itemConf.value.type === 'dicts' || itemConf.value.type ==='enums'">多选框（checkbox）</span>
                      <span v-show="itemConf.value.type === 'users'">可选分组</span>
                      <span v-show="itemConf.value.type === 'cascade'">带属性</span>
                      <!-- <span v-show="itemConf.value.type === 'orders'">可选分类</span> -->
                    </el-checkbox>
                  </el-form-item>
                  <el-form-item label="默认值">
                    <el-popover placement="right" trigger="click">
                      <!-- <lazy-render> -->
                        <!-- 要删掉 lazy-render 记得更改
                        presetConf 的 $parent -->
                        <default-conf :dialog-props="itemConf" :is-body="isBody"></default-conf>
                      <!-- </lazy-render> -->
                      <el-button size="small" slot="reference">配置默认值</el-button>
                    </el-popover>
                    <el-tooltip placement="top" v-if="itemConf.default">
                      <div slot="content">
                        <p><b>默认值来源：</b>{{itemConf.default.type}}</p>
                        <p v-if="['static', 'api'].includes(itemConf.default.type)"><b>静态值/索引：</b>{{itemConf.default.value}}</p>
                        <p v-if="itemConf.default.type.includes('message_')"><b>流程节点 ID：</b>{{itemConf.default.id}}</p>
                        <p v-if="!['static', 'api'].includes(itemConf.default.type)"><b>属性路径：</b>{{itemConf.default.key_path}}</p>
                      </div>
                      <el-button type="text"><i class="el-icon-fa-eye"></i></el-button>
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item label="监听字段">
                    <el-input v-model="itemConf.watch" placeholder="字段 ID" class="code-input" size="small"></el-input>
                  </el-form-item>
                  <el-form-item label="属性名称">
                    <el-input size="small" v-model="itemConf.name" placeholder="属性 Label"></el-input>
                  </el-form-item>
                  <el-form-item label="属性 ID">
                    <el-input size="small" class="code-input" v-model="itemConf.id"></el-input>
                  </el-form-item>
                  <el-form-item label="占位描述">
                    <el-input size="small" v-model="itemConf.placeholder" placeholder="控件的 placeholder"></el-input>
                  </el-form-item>
                  <el-form-item label="额外描述">
                    <el-input size="small" v-model="itemConf.description" placeholder="控件的外部描述"></el-input>
                  </el-form-item>
                  <el-form-item label="分组组名">
                    <el-input size="small" v-model="itemConf.category"></el-input>
                  </el-form-item>
                  <el-form-item label="字段类型">
                    <el-select size="small" v-model="itemConf.value.type" :disabled="itemConf.can_change_type === false">
                      <el-option label="字符串" value="str"></el-option>
                      <el-option label="数字" value="int"></el-option>
                      <el-option label="数组" value="arr"></el-option>
                      <el-option label="日期" value="date"></el-option>
                      <el-option label="时间" value="datetime"></el-option>
                      <el-option label="富文本" value="richtext"></el-option>
                      <el-option label="单文件上传" value="file"></el-option>
                      <el-option label="多文件上传" value="files"></el-option>
                      <el-option label="下拉单选" value="enum"></el-option>
                      <el-option label="下拉多选" value="enums"></el-option>
                      <el-option label="下拉单选（API）" value="dict"></el-option>
                      <el-option label="下拉多选（API）" value="dicts"></el-option>
                      <el-option label="级联菜单" value="cascade"></el-option>
                      <el-option label="搜索条件" value="search_bar"></el-option>
                      <el-option label="人员选择器" value="users"></el-option>
                      <!-- <el-option label="工单选择器" value="orders"></el-option> -->
                      <el-option label="表格" value="table"></el-option>
                    </el-select>
                    <!--静态选项-->
                    <el-popover v-if="['enum', 'enums'].includes(itemConf.value.type)"
                      placement="left" trigger="click" @show="showMultiConf(itemConf)">
                      <!-- <lazy-render> -->
                        <options-conf :conf-arr="itemConf.value.regex"></options-conf>
                      <!-- </lazy-render> -->
                      <el-button size="small" slot="reference" icon="fa-cogs"></el-button>
                    </el-popover>
                    <!--动态选项（cmdb）-->
                    <!-- <template v-if="['dict', 'dicts'].includes(itemConf.value.type)"> -->
                    <el-popover v-if="['dict', 'dicts', 'search_bar'].includes(itemConf.value.type)" placement="left" trigger="click" @show="showCMDBConf(itemConf)">
                      <options-conf-cmdb :item-conf="itemConf" :option-presets="optionPresets" :is-body="isBody"></options-conf-cmdb>
                      <el-button size="small" slot="reference" icon="fa-cogs"></el-button>
                    </el-popover>
                    <!-- </template> -->
                    <!-- 级联菜单 -->
                    <el-popover v-if="itemConf.value.type === 'cascade'" placement="left" trigger="click" @show="showCascadeConf(itemConf)">
                      <!-- <lazy-render> -->
                        <cascade-conf :conf-arr="itemConf.value.regex"></cascade-conf>
                      <!-- </lazy-render> -->
                      <el-button size="small" slot="reference">配置数据</el-button>
                    </el-popover>
                    <!--表格-->
                    <el-popover v-if="itemConf.value.type === 'table'" placement="top" trigger="click" @show="showTableConf(itemConf)">
                      <!-- <lazy-render> -->
                        <table-conf :dialog-props="itemConf" :option-presets="optionPresets"></table-conf>
                      <!-- </lazy-render> -->
                      <el-button size="small" slot="reference">配置表格</el-button>
                    </el-popover>
                    <!-- <template v-if="itemConf.value.type === 'table'">
                      <el-button size="small" @click="showTableConf(itemConf)">配置表格</el-button>
                      <table-conf :dialog-props="itemConf"></table-conf>
                    </template> -->
                    <!-- 搜索元件 -->
                    <!-- <el-popover v-if="itemConf.value.type === 'search_bar'" placement="top" trigger="click" @show="showCMDBConf(itemConf)" class="limited-popover">
                      <options-conf-cmdb :dialog-props="itemConf"></options-conf-cmdb>
                      <el-button size="small" slot="reference" icon="fa-cogs"></el-button>
                    </el-popover> -->
                  </el-form-item>
                  <el-form-item label="范围限制" v-if="itemConf.value.type === 'int'">
                    <el-popover placement="right" trigger="click" @show="showRangeConf(itemConf)">
                      <!-- <lazy-render> -->
                        <range-conf :dialog-props="itemConf"></range-conf>
                      <!-- </lazy-render> -->
                      <el-button size="small" slot="reference">配置范围</el-button>
                    </el-popover>
                  </el-form-item>
                  <el-form-item label="个数限制" v-if="['enums', 'dicts', 'search_bar', 'table', 'arr'].includes(itemConf.value.type)">
                    <el-popover placement="right" trigger="click" @show="showLimitConf(itemConf)">
                      <!-- <lazy-render> -->
                        <limit-conf :dialog-props="itemConf"></limit-conf>
                      <!-- </lazy-render> -->
                      <el-button size="small" slot="reference">配置个数</el-button>
                    </el-popover>
                    <el-tooltip placement="top" v-if="itemConf.limit">
                      <div slot="content">
                        <p><b>个数来源：</b>{{itemConf.limit.type}}</p>
                        <p v-if="itemConf.limit.type === 'static'"><b>最大值：</b>{{itemConf.limit.max}}</p>
                        <p v-if="itemConf.limit.type === 'static'"><b>最小值：</b>{{itemConf.limit.min}}</p>
                        <p v-if="itemConf.limit.type.includes('message_')"><b>流程节点 ID：</b>{{itemConf.limit.id}}</p>
                        <p v-if="itemConf.limit.type !== 'static'"><b>属性路径：</b>{{itemConf.limit.key_path}}</p>
                      </div>
                      <el-button type="text"><i class="el-icon-fa-eye"></i></el-button>
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item :label="['file', 'files'].includes(itemConf.value.type) ? '文件类型' : '数据规则'" v-if="['arr', 'str', 'file', 'files'].includes(itemConf.value.type)">
                    <el-select
                      v-model="itemConf.value.regex"
                      multiple
                      filterable
                      allow-create
                      :placeholder="['file', 'files'].includes(itemConf.value.type) ? '1＋个文件扩展名' : '1＋个正则表达式'"
                      class="code-input"
                      size="small">
                      <template v-if="['file', 'files'].includes(itemConf.value.type)">
                        <!-- <el-option value="image/*" label="任何图像"></el-option> -->
                        <el-option value=".jpg,.jpeg" label="JPG/JPEG"></el-option>
                        <el-option value=".png" label="PNG"></el-option>
                        <el-option value=".pdf" label="PDF"></el-option>
                        <el-option value=".doc,.docx" label="MS Word"></el-option>
                        <el-option value=".xls,.xlsx" label="MS Excel"></el-option>
                        <el-option value=".ppt,.pptx" label="MS PPT"></el-option>
                      </template>
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row type="flex" justify="end" style="margin-top: 8px;">
              <el-button size="small" type="info" :plain="true" icon="fa-eye-slash" @click="showCondition(itemConf)">显示条件</el-button>
              <el-button size="small" type="danger" icon="delete" @click="onDeleteField(configData2, itemConf)">删除字段</el-button>
            </el-row>
          </div>
        </section>
      </div>
    </draggable>

    <el-button icon="plus" type="info" :plain="true" size="small" @click="onAddField">添加字段</el-button>
    <el-button v-if="!category" type="info" :plain="true" size="small" @click="isBody ? showCloneBodyFieldVisible = true : showCloneHeaderFieldVisible = true"><i class="el-icon-fa-clone"></i> 克隆字段</el-button>
    <el-row style="margin-top: 12px">
      <el-select size="small" v-model="selectedPreset" placeholder="选择预设集" value-key="name">
        <el-option v-for="obj in presets" :value="obj" :label="obj.name" :key="obj.name"></el-option>
      </el-select>
      <el-button icon="more" type="info" :plain="true" size="small" @click="showPresetConf" v-if="selectedPreset">导入预设字段</el-button>
    </el-row>
    <!-- <lazy-render> -->
      <preset-conf @import-preset="this.importPreset" :selected-preset="selectedPreset" :current-fields="configData2" :category="category" v-if="selectedPreset"></preset-conf>
    <!-- </lazy-render> -->

    <!-- 避免修改 props，不写成组件 -->
    <el-dialog title="克隆 header 已有字段" v-model="showCloneHeaderFieldVisible" v-if="!isBody">
      <h4>请在下面选择其他 body 的字段<small>（鼠标悬浮于属性名，可察看属性详情）</small></h4>
      <el-checkbox-group v-model="selectedFields">
        <el-popover
          placement="top"
          trigger="hover"
          v-for="(attr, index) in configData2"
          :key="attr.name"
          :title="attr.name">
          <el-form label-position="right" label-width="60px" class="detail-popover">
            <el-form-item label="ID"><span>{{attr.id}}</span></el-form-item>
            <el-form-item label="只读"><code>{{attr.readonly}}</code></el-form-item>
            <el-form-item label="必填"><code>{{attr.required}}</code></el-form-item>
            <el-form-item label="唯一"><code>{{attr.unique}}</code></el-form-item>
            <el-form-item label="类型"><span>{{attr.value.type}}</span></el-form-item>
          </el-form>
          <el-checkbox slot="reference" :label="attr" :key="attr.id" :value="attr">{{attr.name}}</el-checkbox>
        </el-popover>
      </el-checkbox-group>
      <div class="dialog-footer" slot="footer">
        <el-button @click="onConfirmClonedFields" type="primary" icon="check">OK</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="`克隆字段至 Body #${bodyIndex + 1}`" v-model="showCloneBodyFieldVisible" v-if="fieldsets">
      <h4>请在下面选择其他 body 的字段<small>（鼠标悬浮于属性名，可察看属性详情）</small></h4>
      <el-form label-position="left" label-width="80px">
        <el-form-item v-for="(attrList, index) in fieldsets" :label="`Body #${index + 1}`" :key="index">
          <el-checkbox-group v-model="selectedFields">
            <el-popover
              placement="top"
              trigger="hover"
              v-for="attr in attrList"
              :key="attr.name"
              :title="attr.name">
              <el-form label-position="right" label-width="60px" class="detail-popover">
                <el-form-item label="ID"><span>{{attr.id}}</span></el-form-item>
                <el-form-item label="只读"><code>{{attr.readonly}}</code></el-form-item>
                <el-form-item label="必填"><code>{{attr.required}}</code></el-form-item>
                <el-form-item label="唯一"><code>{{attr.unique}}</code></el-form-item>
                <el-form-item label="类型"><span>{{attr.value.type}}</span></el-form-item>
              </el-form>
              <el-checkbox slot="reference" :label="attr" :key="attr.id" :value="attr">{{attr.name}}</el-checkbox>
            </el-popover>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="onConfirmClonedFields" type="primary" icon="check">OK</el-button>
      </div>
    </el-dialog>

    <el-dialog title="字段显示条件配置" v-model="showConditionVisible" v-if="showConditionVisible">
      <el-form label-width="100px">
        <el-form-item label="比较变量">
          <el-select v-model="editItem.show.type">
            <el-option v-for="item in countConfig" :key="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流程节点 ID" v-if="['message_header', 'message_body'].includes(editItem.show.type)">
          <el-input v-model="editItem.show.id"></el-input>
        </el-form-item>
        <el-form-item label="属性路径">
          <el-input class="code-input" v-model="editItem.show.key_path"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="判断条件" style="width: auto">
          <el-select v-model="editItem.show.op">
            <el-option label="等于" value="eq"></el-option>
            <el-option label="不等于" value="neq"></el-option>
            <el-option label="包含" value="reg"></el-option>
          </el-select>
          <el-input class="code-input" v-model="editItem.show.value"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onResetShowCondition">重置</el-button>
        <el-button type="primary" icon="check" @click="showConditionVisible = false">OK</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
// import Sortable from 'sortablejs'
const optionsConf = () => import('./_optionsConf.vue') // 配置下拉选项（静态）的表单
const optionsConfCmdb = () => import('./_optionsConfCMDB.vue') // 配置下拉选项（动态）的表单
const tableConf = () => import('./_tableConf.vue') // 配置表格
const defaultConf = () => import('./_defaultConf.vue')
const limitConf = () => import('./_limitConf.vue')
const rangeConf = () => import('./_rangeConf.vue')
const presetConf = () => import('./_presetConf.vue')
const cascadeConf = () => import('./_cascadeConf.vue')

import eventHub from './../../../../utils/event-hub'

export default {
  props: {
    configData: Array,
    presets: Array,
    fieldsets: Array,
    bodyIndex: Number,
    optionPresets: Array,
    category: {
      default: '',
      type: String
    }
  },
  data () {
    return {
      configData2: this.configData, // 为免直接修改 props，创建 configData 副本，结合 watch 实现 props 双向数据流
      selectedPreset: null,
      expandedForm: '',
      selectedFields: [],
      needDefault: false,
      countConfig: [ 'form_header', 'form_body', 'message_header', 'message_body' ],
      editBody: null,
      showConditionVisible: false,
      showCloneHeaderFieldVisible: false,
      showCloneBodyFieldVisible: false,
      fieldTypeMap: {
        str: '字符串',
        int: '数字',
        arr: '数组',
        date: '日期',
        datetime: '时间',
        richtext: '富文本',
        file: '单文件上传',
        files: '多文件上传',
        enum: '下拉单选',
        enums: '下拉多选',
        dict: '下拉单选（API）',
        dicts: '下拉多选（API）',
        cascade: '级联菜单',
        search_bar: '搜索条件',
        users: '人员选择器',
        // orders: '工单选择器',
        table: '表格'
      }
    }
  },

  computed: {
    isBody () {
      return this.bodyIndex !== undefined
    },

    presetForExternal () {
      return this.optionPresets[0].list[0]
    }
  },

  watch: {
    configData: {
      handler (val) {
        this.configData2 = val  // 父组件修改组件 props 不会同步到 data 副本上
      },
      deep: true
    },

    configData2: {
      handler (val) {
        console.log('emitted!')
        this.$emit('on-config-change', { val, index: this.bodyIndex, category: this.category }) // 组件内对副本的变更向外部发送事件
      },
      deep: true
    }
  },

  updated () {
    this.collapsed()
  },

  methods: {
    close () {
      console.log(this.$refs.group)
      if (+this.$refs[this.expandedForm][0].dataset.tag < 1) {
        this.$refs[this.expandedForm][0].dataset.tag = 1
        console.log('open')
        this.$refs[this.expandedForm][0].checked = true
      } else {
        this.$refs[this.expandedForm][0].checked = false
        this.$refs[this.expandedForm][0].dataset.tag = 0
        console.log('close')
      }
    },
    // 默认展开一个
    collapsed () {
      // console.log(this.configData2)
      let len = this.configData2.length - 1
      let param = this.configData2[len].name + len
      // console.log(param)
      // console.log(this.$refs[param][0])
      if (!this.configData2[len].id) {
        this.$refs[param][0].setAttribute('checked', 'true')
      }
    },
    // 初始化可拖曳手风琴
    // setSort () {
    //   const el = document.querySelector('.el-collapse')
    //   this.sortable = Sortable.create(el, {
    //     handle: '.drag-handler',
    //     onEnd: evt => {
    //       // const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
    //       // this.newList.splice(evt.newIndex, 0, tempIndex)
    //       let { oldIndex, newIndex } = evt
    //       console.log(this.configData2.slice(0, oldIndex))
    //       console.log(this.configData2.slice(oldIndex + 1, newIndex + 1))
    //       console.log(this.configData2[oldIndex])
    //       console.log(this.configData2.slice(newIndex + 1))
    //       // this.configData2 = this.configData2.slice(0, oldIndex).concat(this.configData2.slice(oldIndex + 1, newIndex + 1), this.configData2[oldIndex], this.configData2.slice(newIndex + 1))
    //       console.log(this.configData2)
    //     }
    //   })
    // },
    // 导入预设集
    importPreset ({ attrs, fields }) {
      console.log(attrs)
      console.log(fields)
      for (let i = 0; i < attrs.length; i++) {
        if (fields.every(j => j.id !== attrs[i].id)) {
          Object.assign(attrs[i], { _timeStamp: `${new Date().getTime()}-${i}`, need_submit: true, isAlias: false, default: { type: '' } })
          if (attrs[i].value.type === 'FK') {
            attrs[i].value.type = 'dict'
            this._modifyExternals(attrs[i])
            // Object.assign(attrs[i].value.source.res, )
            // attrs[i].value.source.url = this.presetForExternal.url
          }
          if (attrs[i].value.type === 'FKs') {
            attrs[i].value.type = 'dicts'
            this._modifyExternals(attrs[i])
          }
          fields.push(attrs[i])
        }
      }
    },
    // 为外键加入 source
    _modifyExternals (attr) {
      console.log(attr)
      attr.value.source = {
        data: {
          action: this.presetForExternal.action,
          method: this.presetForExternal.method,
          params: [{
            id: 'object_id',
            value: {
              type: 'static',
              value: attr.value.rule.obj
            }
          }]
        },
        res: { data_path: this.presetForExternal.data_path, show_key: ['name'] },
        url: this.presetForExternal.url
      }
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
      }
      itemConf.value.confVisible = true
      eventHub.$emit('cmdb-got-shown')
    },
    // 显示级联菜单的选项
    showCascadeConf (itemConf) {
      if (!itemConf.value.regex || !itemConf.value.regex.length) {
        this.$set(itemConf.value, 'regex', [{
          value: 'A',
          label: 'A',
          children: [{
            value: 'A-a',
            label: 'A-a'
          }, {
            value: 'A-b',
            label: 'A-b',
            children: [{
              value: 'A-b-1',
              label: 'A-b-1'
            }]
          }]
        }])
      }
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
      // console.log(this)
      this.configData2.push({
        _timeStamp: new Date().getTime(),
        id: '',
        name: '新字段',
        category: this.category, // 分组
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
    // 显示条件
    showCondition (item) {
      if (item.show) {
        //
      } else {
        this.$set(item, 'show', {
          type: '',
          id: '',
          key_path: '',
          op: '',
          value: ''
        })
      }
      this.editItem = item
      this.showConditionVisible = true
    },
    // 范围限制
    showRangeConf (item) {
      if (item.range) {
        //
      } else {
        this.$set(item, 'range', {
          min: 0,
          max: 0
        })
      }
    },
    // 个数限制
    showLimitConf (item) {
      if (item.limit) {
        //
      } else {
        this.$set(item, 'limit', {
          type: '',
          id: '',
          key_path: '',
          op: '',
          max: '',
          min: ''
        })
      }
    },
    // 重置显示条件
    onResetShowCondition () {
      delete this.editItem['show']
      this.showConditionVisible = false
    },
    onConfirmClonedFields () {
      this.selectedFields.map((_, i) => {
        return { ..._, ...{ _timeStamp: `${new Date().getTime()}-${i}` } }
      })
      var cloned = JSON.parse(JSON.stringify(this.selectedFields))
      this.configData2 = this.configData2.concat(cloned) // 纯拷贝
      this.showCloneBodyFieldVisible = false
      this.showCloneHeaderFieldVisible = false
    },
    // 删除一个字段 （删除操作 可以封装为全局方法）
    onDeleteField (arr, item) {
      if (this.category && arr.length === 1) {
        this.$confirm('此模块只剩一个字段，删除之将删除整个模块。若想保留模块，建议直接编辑该字段。继续删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          arr.splice(arr.indexOf(item), 1)
        })
      } else {
        this.$confirm('确定要删除这个字段吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          arr.splice(arr.indexOf(item), 1)
        })
      }
    }
  },
  components: {
    draggable,
    optionsConf,
    optionsConfCmdb,
    tableConf,
    defaultConf,
    limitConf,
    rangeConf,
    presetConf,
    cascadeConf
  }
}
</script>
