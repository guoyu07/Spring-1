<style lang="less" scoped>
  .editor-content {
    .el-input, .conf-btn {
      max-width: 180px;
      display: inline-block;
    }
    .el-row {
      margin: 10px 0;
    }
    label {
      line-height: 36px;
    }
  }
</style>

<template>
  <div class="editor-content" v-if="formConfig">
    <el-row>
      <label>表单名称：</label>
      <el-input v-model="formConfig.tname" placeholder="请输入表单名称"></el-input>
      <label>表单key：</label>
      <el-input v-model="formConfig.tkey" placeholder="请输入表单属性名"></el-input>
    </el-row>
    <el-row>
      <label>功能/操作按钮：</label>
      <el-card>
        <el-checkbox-group v-model="checkedActions" @change="actionChange">
          <el-checkbox v-for="ac of actions" :label="ac.name"></el-checkbox>
        </el-checkbox-group>
      </el-card>
    </el-row>
    <el-row>
      <label>表单 header 字段：</label>
      <el-card>
        <form-conf :config-data="formConfig.form.form.header"></form-conf>
      </el-card>
    </el-row>
    <el-row>
      <label>表单 body 字段：</label>
      <el-card>
        <form-conf :config-data="formConfig.form.form.body.attr_list"></form-conf>
      </el-card>
    </el-row>
    <el-row>
      <label>表单 body 个数：</label>
      <el-select v-model="bodyCountType" @change="countConfig">
        <el-option label="static" value="static"></el-option>
        <el-option label="header" value="header"></el-option>
        <el-option label="message" value="message"></el-option>
      </el-select>
      <el-popover v-if="bodyCountType === 'static'"
        placement="right" trigger="click">
        <h5>最大数：</h5>
        <el-input-number size="small" :min="1" v-model="formConfig.form.form.body.count.max" />
        <el-button slot="reference">配置</el-button>
      </el-popover>
      <el-popover v-if="bodyCountType === 'header'"
        placement="right" trigger="click">
        <h5>配置一个 header 中的字段：</h5>
        <el-input v-model="formConfig.form.form.body.count.path"></el-input>
        <el-button slot="reference">配置</el-button>
      </el-popover>
      <el-popover v-if="bodyCountType === 'message'"
        placement="right" trigger="click">
        <h5>配置一个 message（历史步骤）中的字段：</h5>
        <el-input v-model="formConfig.form.form.body.count.path"></el-input>
        <el-button slot="reference">配置</el-button>
      </el-popover>
    </el-row>
    <el-row>
      <el-button icon="fa-check" @click="submitBtn">确认完成</el-button>
      <el-button icon="fa-undo" @click="$router.go(-1)">取消</el-button>
    </el-row>
  </div>
</template>

<script>
import formConf from './formConf'

export default {
  data () {
    return {
      id: '',
      actions: [
        { 'name': '确认', 'pass': 0, 'type': 'submit' },
        { 'name': '撤单', 'pass': -100, 'type': 'revoke' },
        { 'name': '驳回', 'pass': 1, 'type': 'back' },
        { 'name': '下载', 'url': '', 'type': 'target' }
      ],
      checkedActions: [],
      bodyCountType: '',
      formConfig: null
    }
  },
  activated () {
    this.formConfig = this.$route.query.row || null
    if (this.formConfig) {
      // actions
      this.checkedActions = this.formConfig.form.action.map(item => item.name)
    }
  },
  methods: {
    // 选择功能 action
    actionChange (arr) {
      this.formConfig.form.action = this.actions.filter(item => arr.indexOf(item.name) !== -1)
    },
    countConfig (type) {
      let count = null
      switch (type) {
        case 'static':
          count = { type: 'static', min: 1, max: 1 }
          break
        case 'header':
          count = { type: 'header', keyPath: '' }
          break
        case 'message':
          count = { type: 'message', keyPath: '' }
          break
        default:
          count = {}
      }
      this.formConfig.form.form.body.count = count
    },
    // 确认完成
    submitBtn () {
      const postData = {
        action: 'activiti/task/form',
        method: 'POST',
        data: this.formConfig
      }
      this.http.post('', this.parseData(postData)).then(res => {
        if (res.data.statusCode === 200) {
          this.$router.go(-1)
          this.$message.success('修改成功！')
        }
      })
    }
  },
  components: {
    formConf
  }
}
</script>
