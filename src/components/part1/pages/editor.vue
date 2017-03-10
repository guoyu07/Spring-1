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
  <div class="editor-content">
    <el-row>
      <label>表单名称：</label>
      <el-input v-model="formName" placeholder="请输入表单名称"></el-input>
      <el-button icon="plus" type="primary" @click="addBtn">添加表单字段</el-button>
    </el-row>
    <el-collapse v-if="formConf.length">
      <el-collapse-item v-for="itemConf of formConf" :title="itemConf.name">
        <el-checkbox v-model="itemConf.required">必选项</el-checkbox>
        <label>字段名称：</label>
        <el-input v-model="itemConf.name"></el-input>
        <label>表单形式：</label>
        <el-select v-model="itemConf.type">
          <el-option label="字符串" value="str"></el-option>
          <el-option label="长文本" value="strArea"></el-option>
          <el-option label="数字" value="int"></el-option>
          <el-option label="数组" value="arr"></el-option>
          <el-option label="日期" value="date"></el-option>
          <el-option label="时间" value="datetime"></el-option>
          <el-option label="下拉单选" value="enum"></el-option>
          <el-option label="下拉多选" value="enum/multi"></el-option>
        </el-select>
        <!--暂不细分 动态获取选项-->
        <el-popover v-if="['enum', 'enum/multi'].indexOf(itemConf.type) !== -1"
          placement="bottom" title="" trigger="click" @show="showMultiConf(itemConf)">
          <el-button slot="reference">配置选项</el-button>
          <multi-conf :conf-arr="itemConf.options"></multi-conf>
        </el-popover>
        <el-button type="danger" icon="delete" @click="delBtn(itemConf)"></el-button>
      </el-collapse-item>
    </el-collapse>
    <el-row>
      <el-button icon="fa-check" @click="submitBtn">确认完成</el-button>
      <el-button icon="fa-undo" @click="$router.go(-1)">取消</el-button>
    </el-row>
  </div>
</template>

<script>
import multiConf from './multiConf'
import { ADD_CONF, DEL_CONF } from '../../../store/mutation-types'

export default {
  data () {
    return {
      id: '',
      formName: '',
      formConf: []
    }
  },
  created () {
    this.id = this.$route.query.id
    if (this.id) {
      // 待修改的
      const formConfigList = this.$store.state.formConfigList
      const formConfig = formConfigList.find(item => item.id === this.id)
      this.formName = formConfig.formName
      this.formConf = formConfig.formConf
    }
  },
  methods: {
    // 添加一个字段
    addBtn () {
      this.formConf.push({
        type: '',
        name: '',
        options: null,
        required: true,
        regex: '',
        unique: true,
        category: '',
        need_submit: true
      })
    },
    showMultiConf (itemConf) {
      if (!itemConf.options) itemConf.options = []
    },
    // 删除一个字段
    delBtn (itemConf) {
      this.formConf.splice(this.formConf.indexOf(itemConf), 1)
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
    multiConf
  }
}
</script>
