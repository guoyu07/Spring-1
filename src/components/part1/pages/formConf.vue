<style lang="less" scoped>
  .form-config {
    .el-input, .conf-btn {
      max-width: 180px;
      display: inline-block;
    }
    .el-collapse {
      margin-bottom: 10px;
      .el-row {
        margin-bottom: 4px;
      }
    }
  }
</style>

<template>
  <div class="form-config">
    <el-collapse v-if="configData.length">
      <el-collapse-item v-for="itemConf of configData" :title="itemConf.name">
        <el-row>
          <el-checkbox v-model="itemConf.required">必填</el-checkbox>
          <el-checkbox v-model="itemConf.unique">唯一</el-checkbox>
          <el-checkbox v-model="itemConf.need_submit">需要提交</el-checkbox>
        </el-row>
        <el-row>
          <label>名称：</label>
          <el-input v-model="itemConf.name"></el-input>
          <label>属性名：</label>
          <el-input v-model="itemConf.id"></el-input>
          <label>分组组名：</label>
          <el-input v-model="itemConf.category"></el-input>
        </el-row>
        <el-row>
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
            <el-option label="下拉单选（cmdb）" value="dist"></el-option>
            <el-option label="下拉多选（cmdb）" value="dist/multi"></el-option>
          </el-select>
          <!--静态选项-->
          <el-popover v-if="['enum', 'enum/multi'].indexOf(itemConf.value.type) !== -1"
            placement="right" trigger="click" @show="showMultiConf(itemConf)">
            <options-conf :conf-arr="itemConf.value.regex"></options-conf>
            <el-button slot="reference">配置选项</el-button>
          </el-popover>
          <!--动态选项（cmdb）-->
          <el-popover v-if="['dist', 'dist/multi'].indexOf(itemConf.value.type) !== -1"
            placement="right" trigger="click">
            配置 cmdb 获取 url 以及参数来源（keyPath）
            <el-button slot="reference">配置选项</el-button>
          </el-popover>
        </el-row>
        <el-row type="flex" justify="end">
          <el-button size="small" type="danger" icon="delete" @click="delBtn(itemConf)">删除字段</el-button>
        </el-row>
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
        category: '', // 分组
        unique: true, // 唯一
        required: true, // 必填
        need_submit: true, // 需要提交
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
