<style lang="less" scoped>
  .editor-content {
    .el-input, .conf-btn {
      max-width: 180px;
      display: inline-block;
    }
    .el-row {
      margin: 10px 0;
    }
    .options-btn {
      margin-bottom: 10px;
      float: right;
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
    <!-- 配置 header 属性字段 -->
    <el-row>
      <label>表单 header 字段：</label>
      <el-card>
        <form-conf :config-data="formConfig.form.form.header"></form-conf>
      </el-card>
    </el-row>
    <!-- 配置 body 属性字段 -->
    <el-row v-for="body in formConfig.form.form.body">
      <label>表单 body 字段：</label>
      <el-card>
        <form-conf :config-data="body.attr_list"></form-conf>
        <!-- body 的 count 切换类型的时候不能把之前添加的属性移除 -->
        <div class="count-conf">
          <label>配置此 body 个数：</label>
          <el-select v-model="body.count.type" @change="countConfig">
            <el-option label="static" value="static"></el-option>
            <el-option label="form_header" value="form_header"></el-option>
            <el-option label="message_header" value="message_header"></el-option>
          </el-select>
          <el-popover v-if="body.count.type === 'static'"
            placement="right" trigger="click">
            <h5>最大数：</h5>
            <el-input-number size="small" v-model="body.count.max" />
            <el-button slot="reference">配置</el-button>
          </el-popover>
          <el-popover v-if="body.count.type === 'form_header'"
            placement="right" trigger="click">
            <h5>输入表单中 form_header 的一个字段：</h5>
            <el-input size="small" v-model="body.count.key_path"></el-input>
            <el-button slot="reference">配置</el-button>
          </el-popover>
          <el-popover v-if="body.count.type === 'message_header'"
            placement="right" trigger="click">
            <h5>输入流程中的一个历史环节的 messageId：</h5>
            <el-input size="small" v-model="body.count.id"></el-input>
            <h5>输入该环节中的表单的一个字段：</h5>
            <el-input size="small" v-model="body.count.key_path"></el-input>
            <el-button slot="reference">配置</el-button>
          </el-popover>
        </div>
        <div class="options-btn">
          <el-button size="mini" type="text" icon="setting" @click="showCondition(body)">
            body 显示条件
          </el-button>
          <el-button size="mini" type="text" icon="delete"
            @click="delBodyBtn(formConfig.form.form.body, body)">删除 body
          </el-button>
        </div>
      </el-card>
    </el-row>
    <el-row>
      <el-button type="primary" size="small" icon="plus" @click="addBodyConfig">添加 body</el-button>
    </el-row>
    <el-dialog title="body 显示条件配置" v-model="showConditionVisible" v-if="showConditionVisible">
      <el-form label-width="120px">
        <el-form-item label="body 名称">
          <el-input v-model="editBody.name"></el-input>
        </el-form-item>
        <el-form-item label="选择比较变量：">
          <el-select v-model="editBody.show.type">
            <el-option label="form_header" value="form_header"></el-option>
            <el-option label="message_header" value="message_header"></el-option>
            <el-option label="message_body" value="message_body"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流程关节 id：">
          <el-input v-model="editBody.show.id"></el-input>
        </el-form-item>
        <el-form-item label="属性 key_path：">
          <el-input v-model="editBody.show.key_path"></el-input>
        </el-form-item>
        <el-form-item label="判断条件：">
          <el-select v-model="editBody.show.op">
            <el-option label="等于" value="eq"></el-option>
            <el-option label="不等于" value="neq"></el-option>
          </el-select>
          <el-input v-model="editBody.show.value"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="showConditionVisible = false"> 确定 </el-button>
      </div>
    </el-dialog>
    <el-row type="flex" justify="end">
      <el-button type="success" icon="fa-check" @click="submitBtn">确认完成</el-button>
      <el-button type="info" icon="fa-undo" @click="$router.go(-1)">取消</el-button>
    </el-row>
  </div>
</template>

<script>
import formConf from './config/formConf' // 配置字段的表单

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
      formConfig: null,
      editBody: null,
      showConditionVisible: false
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
      // const type = count.type
      // count = {} // 准备给它加属性
      // this.$set(count, 'type', type)
      // switch (type) {
      //   case 'static':
      //     this.$set(count, 'min', 1)
      //     this.$set(count, 'max', 1)
      //     break
      //   case 'form_header':
      //     this.$set(count, 'key_path', '')
      //     break
      //   case 'message_header':
      //     this.$set(count, 'id', '')
      //     this.$set(count, 'key_path', '')
      //     break
      //   default:
      //     count = { type: 'static' }
      // }
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
    },
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
