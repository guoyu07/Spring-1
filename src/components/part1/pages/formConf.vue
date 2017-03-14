<style lang="less" scoped>

</style>

<template>
  <div class="form-config">
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
  </div>
</template>

<script>
import multiConf from './formConf'

export default {
  components: {
    multiConf
  }
}
</script>
