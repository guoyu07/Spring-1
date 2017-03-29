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
  <div class="editor-content" v-if="formConfig && formConfig.form">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3><i class="el-icon-fa-wpforms icon-lg"></i> 表单自定义</h3>
          <el-row>
            <el-card>
              <h4>基础配置</h4>
              <el-form label-width="80px">
                <el-form-item label="表单名称">
                  <el-input v-model="formConfig.tname" placeholder="请输入表单名称"></el-input>
                </el-form-item>
                <el-form-item label="表单 key">
                  <el-input v-model="formConfig.tkey" placeholder="请输入表单属性名"></el-input>
                </el-form-item>
                <el-form-item label="操作按钮">
                  <el-checkbox-group v-model="checkedActions" @change="actionChange">
                    <el-checkbox v-for="ac of actions" :label="ac.name"></el-checkbox>
                  </el-checkbox-group>
                  <template v-if="formConfig.form.action.find(_ => _.name === '下载')">
                    <label>请填写下载 URL：</label>
                    <el-input size="small" v-model="formConfig.form.action.find(_ => _.name === '下载').url"></el-input>
                  </template>
                </el-form-item>
              </el-form>
            </el-card>
          </el-row>
          <el-row>
            <el-card>
              <h4>Header 配置</h4>
              <form-conf :config-data="formConfig.form.form.header"></form-conf>
            </el-card>
          </el-row>
          <el-row>
            <el-card>
              <h4>Body 配置</h4>
              <form-conf :config-data="formConfig.form.form.body.attr_list"></form-conf>
              <el-select v-model="bodyCountType" @change="countConfig">
                <el-option label="static" value="static"></el-option>
                <el-option label="form_header" value="form_header"></el-option>
                <el-option label="message_header" value="message_header"></el-option>
              </el-select>
              <el-popover v-if="bodyCountType === 'static'"
                placement="right" trigger="click">
                <h5>最大数：</h5>
                <el-input-number size="small" :min="1" v-model="formConfig.form.form.body.count.max" />
                <el-button slot="reference">配置</el-button>
              </el-popover>
              <el-popover v-if="bodyCountType === 'form_header'"
                placement="right" trigger="click">
                <h5>输入表单中 form_header 的一个字段：</h5>
                <el-input size="small" v-model="formConfig.form.form.body.count.key_path"></el-input>
                <el-button slot="reference">配置</el-button>
              </el-popover>
              <el-popover v-if="bodyCountType === 'message_header'"
                placement="right" trigger="click">
                <h5>输入流程中的一个历史环节的 messageId：</h5>
                <el-input size="small" v-model="formConfig.form.form.body.count.id"></el-input>
                <h5>输入该环节中的表单的一个字段：</h5>
                <el-input size="small" v-model="formConfig.form.form.body.count.key_path"></el-input>
                <el-button slot="reference">配置</el-button>
              </el-popover>
            </el-card>
          </el-row>
          <el-row type="flex" justify="end">
            <el-button type="primary" icon="fa-check" @click="submitBtn">确认完成</el-button>
            <el-button type="primary" icon="fa-undo" @click="$router.go(-1)">取消</el-button>
          </el-row>
        </el-card>
      </el-col>
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
    if (this.formConfig && this.formConfig.form) {
      // 拿到 actions
      this.checkedActions = this.formConfig.form.action.map(item => item.name)
    } else {
      /**
       * 正常的 Restfull API 是拿一个 id 再去获取详情。
       * 这里是直接路由传对象过来，所以刷新时让他退回去。
       */
      this.$router.go(-1)
    }
  },
  methods: {
    // 选择功能按钮 action
    actionChange (arr) {
      this.formConfig.form.action = this.actions.filter(item => arr.indexOf(item.name) !== -1)
    },
    // 选择配置 body 个数
    countConfig (type) {
      let count = null
      switch (type) {
        case 'static':
          count = { type: 'static', min: 1, max: 1 }
          break
        case 'form_header':
          count = { type: 'form_header', key_path: '' }
          break
        case 'message_header':
          count = { type: 'message_header', id: '', key_path: '' }
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
