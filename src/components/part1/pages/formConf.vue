<style lang="less" scoped>
  .form-config {
    .el-input, .conf-btn {
      max-width: 180px;
      display: inline-block;
    }
    .el-select {
      width: 120px;
    }
  }
</style>

<template>
  <div class="form-config">
    <el-collapse v-if="configData.length">
      <el-collapse-item v-for="itemConf of configData" :title="itemConf.name">
        <el-checkbox v-model="itemConf.required">必选</el-checkbox>
        <label>名称：</label>
        <el-input v-model="itemConf.name"></el-input>
        <label>属性名：</label>
        <el-input v-model="itemConf.id"></el-input>
        <label>表单形式：</label>
        <el-select v-model="itemConf.value.type">
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
        <el-popover v-if="['enum', 'enum/multi'].indexOf(itemConf.value.type) !== -1"
          placement="bottom" title="" trigger="click" @show="showMultiConf(itemConf)">
          <el-button slot="reference">配置选项</el-button>
          <options-conf :conf-arr="itemConf.value.regex"></options-conf>
        </el-popover>
        <el-button type="danger" icon="delete" @click="delBtn(itemConf)"></el-button>
      </el-collapse-item>
    </el-collapse>
    <el-button icon="plus" type="primary" size="small" @click="addBtn">添加</el-button>
  </div>
</template>

<script>
import optionsConf from './optionsConf'

export default {
  props: {
    configData: Array
  },
  methods: {
    showMultiConf (itemConf) {
      if (!itemConf.value.regex) itemConf.value.regex = []
    },
    // 添加一个字段
    addBtn () {
      this.configData.push({
        id: '',
        name: '',
        custom: true,
        required: true,
        readonly: false,
        value: {
          regex: [],
          type: ''
        }
      })
    },
    // 删除一个字段
    delBtn (itemConf) {
      this.configData.splice(this.configData.indexOf(itemConf), 1)
    }
  },
  components: {
    optionsConf
  }
}
</script>
