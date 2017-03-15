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
        <el-button icon="plus" type="primary" size="small">添加</el-button>
      </el-card>
    </el-row>
    <el-row>
      <el-button icon="fa-check" @click="submitBtn">确认完成</el-button>
      <el-button icon="fa-undo" @click="$router.go(-1)">取消</el-button>
    </el-row>
  </div>
</template>

<script>
import formConf from './formConf'
import { ADD_CONF, DEL_CONF } from '../../../store/mutation-types'

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
      formName: '',
      formConf: []
    }
  },
  activated () {
    this.formConfig = this.$route.query.row || null
    if (this.formConfig) {
      // actions
      this.checkedActions = this.formConfig.form.action.map(item => item.name)
    }
    // if (this.id) {
    //   // 待修改的
    //   const formConfigList = this.$store.state.formConfigList
    //   const formConfig = formConfigList.find(item => item.id === this.id)
    //   this.formName = formConfig.formName
    //   this.formConf = formConfig.formConf
    // }
  },
  methods: {
    actionChange (arr) {
      this.formConfig.form.action = this.actions.filter(item => arr.indexOf(item.name) !== -1)
    },
    // 确认完成
    submitBtn () {
      this.$router.go(-1)
      // 如果是修改操作，先把旧数据删除
      if (this.id) {
        this.$store.commit(DEL_CONF, this.id)
      }
      // 提交数据
      this.$store.commit(ADD_CONF, {
        id: +new Date(),
        formName: this.formName,
        formConf: this.formConf
      })
      // 复位
      this.formName = ''
      this.formConf = []
    }
  },
  components: {
    formConf
  }
}
</script>
