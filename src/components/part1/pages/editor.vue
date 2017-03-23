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
        <template v-if="formConfig.form.action.find(_ => _.name === '下载')">
          <label>下载 url：</label>
          <el-input size="small" v-model="formConfig.form.action.find(_ => _.name === '下载').url"></el-input>
        </template>
      </el-card>
    </el-row>
    <el-row>
      <label>表单 header 字段：</label>
      <el-card>
        <!-- 配置属性字段 -->
        <form-conf :config-data="formConfig.form.form.header"></form-conf>
      </el-card>
    </el-row>
    <el-row v-for="body in formConfig.form.form.body">
      <label>表单 body 字段：</label>
      <el-card>
        <!-- 配置属性字段 -->
        <form-conf :config-data="body.attr_list"></form-conf>
        <!-- body 的 count -->
        <counts-conf :count="body.count"></counts-conf>
        <el-button size="mini" type="text" icon="delete" class="fr"
          @click="delBodyBtn(formConfig.form.form.body, body)">删除 body
        </el-button>
      </el-card>
    </el-row>
    <el-row>
      <el-button type="primary" size="small" icon="plus" @click="addBodyConfig">添加 body</el-button>
    </el-row>
    <el-row type="flex" justify="end">
      <el-button type="success" icon="fa-check" @click="submitBtn">确认完成</el-button>
      <el-button type="info" icon="fa-undo" @click="$router.go(-1)">取消</el-button>
    </el-row>
  </div>
</template>

<script>
import formConf from './config/formConf' // 配置字段的表单
import countsConf from './config/countsConf' // 配置数量

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
      // body 类型从 obj 修改为 arr
      const bodyIsArr = Array.isArray(this.formConfig.form.form.body)
      if (!bodyIsArr) {
        this.$set(this.formConfig.form.form.body.count, 'type', 'static')
        this.formConfig.form.form.body = [this.formConfig.form.form.body]
      }
      // 拿到 actions 的 name
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
    countConfig (count) {
      const type = count.type
      count = {} // 准备给它加属性
      this.$set(count, 'type', type)
      switch (type) {
        case 'static':
          this.$set(count, 'min', 1)
          this.$set(count, 'max', 1)
          break
        case 'form_header':
          this.$set(count, 'key_path', '')
          break
        case 'message_header':
          this.$set(count, 'id', '')
          this.$set(count, 'key_path', '')
          break
        default:
          count = { type: 'static' }
      }
      console.log(count)
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
    },
    addBodyConfig () {
      this.formConfig.form.form.body.push({
        attr_list: [],
        count: { type: 'static' }
      })
    },
    delBodyBtn (arr, item) {
      arr.splice(arr.indexOf(item), 1)
    }
  },
  components: {
    formConf,
    countsConf
  }
}
</script>
