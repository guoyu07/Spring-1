<style lang="less" scoped>
  @import url("./../../../assets/css/variables.less");
  .editor-content {
    .el-input, .conf-btn {
      max-width: 180px;
      display: inline-block;
    }
    .options-btn {
      margin-bottom: 10px;
      float: right;
    }
    label {
      line-height: 36px;
    }
  }
  .show-flag {
    position: absolute;
    top: 2px;
    left: 10px;
    background-color: #fff;
    height: 32px;
    line-height: 32px;
  }
  .form-block {
    border-bottom: 2px dotted @borderColor;
    margin: 10px 0 20px;
    // background-color: @bgLighter;
    padding: 6px 12px 12px;
    h4 {
      color: @primary;
      position: relative;
      padding-left: 8px;
      &::before {
        content: '';
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: @primary;
        position: absolute;
        left: 0px;
        top: 10px;
      }
    }
    h5 {
      margin: 14px 0 10px;
      color: @textColor;
    }
  }
  .information-popover {
    color: @textColor;
  }
</style>
<template>
  <div class="editor-content" v-if="formConfig && formConfig.form">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3><i class="el-icon-fa-wpforms icon-lg"></i> 表单自定义</h3>
          <el-row class="form-block">
            <h4>基础配置</h4>
            <el-form label-width="80px" label-position="left" :inline="true">
              <el-form-item label="表单名称">
                <el-input v-model="formConfig.tname"></el-input>
              </el-form-item>
              <el-form-item label="表单 Key">
                <el-input v-model="formConfig.tkey" class="code-input"></el-input>
              </el-form-item>
              <br>
              <el-form-item label="操作按钮" v-if="formConfig.tkey !== 'start'">
                <el-checkbox-group v-model="checkedActions" @change="actionChange">
                  <el-checkbox v-for="ac of actions" :label="ac.type"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <template v-if="formConfig.form.action.find(_ => _.type === 'target') || checkedActions.includes('target')">
                <br>
                <el-form-item label="下载 URL">
                  <el-popover
                    placement="right"
                    width="200"
                    trigger="focus">
                    <code class="information-popover"><i class="el-icon-information"></i> /download/XX?tid=XX</code>
                    <el-input slot="reference" size="small" v-model="selectedTarget.url"></el-input>
                  </el-popover>
                </el-form-item>
              </template>
              <template v-if="formConfig.form.action.find(_ => _.type === 'auto') || checkedActions.includes('auto')">
                <!-- <br> -->
                <el-form-item label="自动触发">
                  <el-select v-model="selectedAuto.name" @change="onChangeAuto">
                    <el-option v-for="ac of actionDefList" :label="ac.name" :value="ac.name"></el-option>
                  </el-select>
                </el-form-item>
              </template>
              <template v-if="formConfig.form.action.find(_ => _.type === 'manual') || checkedActions.includes('manual')">
                <!-- <br> -->
                <el-form-item label="手动触发">
                  <el-select v-model="selectedManual.name" @change="onChangeManual">
                    <el-option v-for="ac of actionDefList" :label="ac.name" :value="ac.name"></el-option>
                  </el-select>
                </el-form-item>
                <br>
              </template>

              <el-form-item width="100%">
                <el-checkbox v-model="formConfig.form.show_progress">是否显示进度条</el-checkbox>
                <el-checkbox v-model="formConfig.form.show_history">是否显示步骤</el-checkbox>
              </el-form-item>
              
              <!-- <template v-if="formConfig.form.action.find(_ => _.type !== 'target')">
                <br>
                <el-form-item label="触发方式">
                  <el-select v-model="selectedTrigger" @change="showFlag = false">
                    <el-option v-for="ac of actionDefList" :label="ac.name" :value="ac"></el-option>
                  </el-select>
                  <span v-if="showFlag" class="show-flag">{{selectedTrigger.name}}</span>
                </el-form-item>
                <el-form-item>
                  <el-radio label="auto" v-model="formConfig.form.action.find(_ => _.type !== 'target').type">自动</el-radio>
                  <el-radio label="manual" v-model="formConfig.form.action.find(_ => _.type !== 'target').type">手动</el-radio>
                </el-form-item>
              </template> -->
            </el-form>
          </el-row>
          <el-row class="form-block">
            <h4>Header 配置</h4>
            <form-conf :config-data="formConfig.form.form.header" :presets="presets"></form-conf>
          </el-row>
          <el-row class="form-block">
            <h4>Body 配置 ({{formConfig.form.form.body.body_list.length}})</h4>
            <el-row>
              <h5>Body 个数配置</h5>
              <el-select v-model="formConfig.form.form.body.count.type" @change="countConfig">
                <el-option label="静态" value="static"></el-option>
                <el-option label="来自以往节点 header" value="form_header"></el-option>
                <el-option label="来自当前节点 header" value="message_header"></el-option>
              </el-select>
              <el-popover v-if="formConfig.form.form.body.count.type === 'static'"
                placement="right" trigger="click">
                <h5>Min: </h5>
                <el-input-number size="small" v-model="formConfig.form.form.body.count.min"></el-input-number>
                <h5>Max: </h5>
                <el-input-number size="small" v-model="formConfig.form.form.body.count.max"></el-input-number>
                <el-button slot="reference">配置</el-button>
              </el-popover>
              <el-popover v-if="formConfig.form.form.body.count.type === 'form_header'"
                placement="right" trigger="click">
                <h5>所取表单 header 中的字段：</h5>
                <el-input size="small" v-model="formConfig.form.form.body.count.key_path"></el-input>
                <el-button slot="reference">配置</el-button>
              </el-popover>
              <el-popover v-if="formConfig.form.form.body.count.type === 'message_header'"
                placement="right" trigger="click">
                <h5>所取流程节点 ID：</h5>
                <el-input size="small" v-model="formConfig.form.form.body.count.id"></el-input>
                <h5>所取该节点下表单的字段：</h5>
                <el-input size="small" v-model="formConfig.form.form.body.count.key_path"></el-input>
                <el-button slot="reference">配置</el-button>
              </el-popover>
            </el-row>
            <el-row v-for="(body, index) in formConfig.form.form.body.body_list">
              <h5>Body #{{index + 1}}</h5>
              <el-card>
                <form-conf :config-data="body.attr_list" :presets="presets"></form-conf>
                <div class="options-btn">
                  <el-button size="small" type="info" :plain="true" icon="setting" @click="showCondition(body)">显示条件</el-button>
                  <el-button size="small" type="danger" :plain="true" icon="close"
                    @click="onDeleteBody(formConfig.form.form.body.body_list, body)">删除 Body</el-button>
                </div>
              </el-card>
            </el-row>
            <br>
            <el-button type="primary" size="small" icon="plus" @click="addBodyConfig">添加 Body</el-button>
          </el-row>
          <el-dialog title="Body 显示条件配置" v-model="showConditionVisible" v-if="showConditionVisible">
            <el-form label-width="100px">
              <el-form-item label="Body 名称">
                <el-input v-model="editBody.name"></el-input>
              </el-form-item>
              <el-form-item label="比较变量">
                <el-select v-model="editBody.show.type">
                  <el-option label="form_header" value="form_header"></el-option>
                  <el-option label="message_header" value="message_header"></el-option>
                  <el-option label="message_body" value="message_body"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="流程节点 ID" v-if="editBody.show.type !== 'form_header'">
                <el-input v-model="editBody.show.id"></el-input>
              </el-form-item>
              <el-form-item label="属性路径">
                <el-input class="code-input" v-model="editBody.show.key_path"></el-input>
              </el-form-item>
              <el-form-item label="判断条件">
                <el-select v-model="editBody.show.op">
                  <el-option label="等于" value="eq"></el-option>
                  <el-option label="不等于" value="neq"></el-option>
                </el-select>
                <el-input class="code-input" v-model="editBody.show.value"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" icon="check" @click="showConditionVisible = false">OK</el-button>
            </div>
          </el-dialog>
          <el-row type="flex" justify="end">
            <el-button type="warning" :plain="true" icon="fa-undo" @click="$router.go(-1)">取消</el-button>
            <el-button type="success" icon="fa-check" @click="onSubmit" :loading="submitting">确认提交</el-button>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import formConf from './config/formConf' // 配置字段的表单
export default {
  data () {
    return {
      presets: [],
      id: '',
      // 操作按钮
      actions: [
        { name: '', url: '', type: 'target' },
        { name: '', id: '', desc: '', type: 'auto' },
        { name: '', id: '', desc: '', type: 'manual' }
      ],
      checkedActions: [],
      actionDefList: [],
      formConfig: null,
      editBody: null,
      showConditionVisible: false,
      submitting: false
    }
  },
  computed: {
    selectedTarget () {
      return this.formConfig.form.action.find(_ => _.type === 'target') ? this.formConfig.form.action.find(_ => _.type === 'target') : {}
    },
    selectedAuto () {
      return this.formConfig.form.action.find(_ => _.type === 'auto') ? this.formConfig.form.action.find(_ => _.type === 'auto') : {}
    },
    selectedManual () {
      return this.formConfig.form.action.find(_ => _.type === 'manual') ? this.formConfig.form.action.find(_ => _.type === 'manual') : {}
    }
  },
  activated () {
    this.getPresets()
    /**
     * 正常的 Restfull API 是拿一个 id 再去获取详情。
     * 这里是直接路由传对象过来，所以刷新时让他回退。
     */
    this.formConfig = this.$route.query.row || null
    if (this.formConfig && this.formConfig.form) {
      // body 类型：从 obj 修改为 arr
      const bodyIsArr = Array.isArray(this.formConfig.form.form.body.body_list)
      if (!bodyIsArr) {
        this.$set(this.formConfig.form.form.body.count, 'type', 'static')
        this.formConfig.form.form.body.body_list = [this.formConfig.form.form.body.body_list]
      }
      // 拿到 actions 的 name
      this.checkedActions = this.formConfig.form.action.map(item => item.type)
    } else {
      this.$router.go(-1)
    }
    this.getActionDef()
    this.initActions()
  },
  methods: {
    // 获取预设集
    getPresets () {
      let postData = {
        action: 'cmdb/object/list',
        method: 'GET',
        data: {}
      }
      this.http.post('', this.parseData(postData)).then((res) => {
        this.presets = res.data.data.list
      })
    },
    getActionDef () {
      let postData = {
        action: 'activiti/action/define/list',
        method: 'GET',
        data: {}
      }
      this.http.post('', this.parseData(postData)).then(res => {
        this.actionDefList = res.data.data.list
      })
    },
    initActions () {
      // fuck this shit
      if (this.formConfig.form.action.find(_ => _.type === 'manual')) {
        this.actions.find(_ => _.type === 'manual').name = this.formConfig.form.action.find(_ => _.type === 'manual').name
      }
      if (this.formConfig.form.action.find(_ => _.type === 'auto')) {
        this.actions.find(_ => _.type === 'auto').name = this.formConfig.form.action.find(_ => _.type === 'auto').name
      }
    },
    // 选择功能按钮 action
    actionChange (arr) {
      this.formConfig.form.action = this.actions.filter(item => arr.indexOf(item.type) !== -1)
      console.log(this.formConfig.form.action)
    },
    onChangeAuto (val) {
      if (val === 'CMDB更新实例') {
        Object.assign(this.selectedAuto, { id: 'cmdb_update_instance', desc: '表单header里须包含object_id,body里为实例数据' })
      } else {
        Object.assign(this.selectedAuto, { id: 'cmdb_create_instance', desc: '表单header里须包含object_id,body里为实例数据' })
      }
      this.initActions()
    },
    onChangeManual (val) {
      if (val === 'CMDB更新实例') {
        Object.assign(this.selectedManual, { id: 'cmdb_update_instance', desc: '表单header里须包含object_id,body里为实例数据' })
      } else {
        Object.assign(this.selectedManual, { id: 'cmdb_create_instance', desc: '表单header里须包含object_id,body里为实例数据' })
      }
      this.initActions()
    },
    // 选择配置 body 个数
    countConfig (count) {
      // 类型切换时 之前加的属性没去除，解析时先判断 type 再取属性
      console.log(count)
    },
    // 确认完成
    onSubmit () {
      const postData = {
        action: 'activiti/task/form',
        method: 'POST',
        data: this.formConfig
      }
      // this.formConfig.form.action.find(_ => _.type !== 'target').desc = this.selectedTrigger.desc
      // this.formConfig.form.action.find(_ => _.type !== 'target').id = this.selectedTrigger.id
      // this.formConfig.form.action.find(_ => _.type !== 'target').name = this.selectedTrigger.name
      // console.log(this.formConfig.form.action.find(_ => _.type !== 'target'))
      // this.$set(this.formConfig.form.action, 'target', this.selectedTarget)
      if (!this.selectedTarget) {
        Object.assign(this.formConfig.form.action.find(_ => _.type === 'target'), this.selectedTarget)
      }

      console.log(this.formConfig)
      this.submitting = true
      this.http.post('', this.parseData(postData)).then(res => {
        if (res.data.statusCode === 200) {
          this.submitting = false
          this.$message.success('修改成功！')
          this.$router.go(-1) // 回退
        }
      })
    },
    // 增加 body
    addBodyConfig () {
      this.formConfig.form.form.body.body_list.push({
        attr_list: []
      })
    },
    // 删除 body
    onDeleteBody (arr, item) {
      this.$confirm('确定要删除这个 body 吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        arr.splice(arr.indexOf(item), 1)
      })
    },
    // 配置显示条件弹窗
    showCondition (body) {
      if (body.name && body.show) {
        // 添加过属性
      } else {
        this.$set(body, 'name', '')
        this.$set(body, 'show', {
          type: 'form_header',
          id: '',
          key_path: '',
          op: 'eq',
          value: ''
        })
      }
      this.editBody = body // body 传给当前正编辑的临时变量
      this.showConditionVisible = true
    }
  },
  components: {
    formConf
  }
}
</script>
