<template>
  <div class="counts-conf">
    <label>配置此 body 个数：</label>
    <el-select v-model="count.type" @change="countConfig">
      <el-option label="static" value="static"></el-option>
      <el-option label="form_header" value="form_header"></el-option>
      <el-option label="message_header" value="message_header"></el-option>
    </el-select>
    <el-popover v-if="count.type === 'static'"
      placement="right" trigger="click">
      <h5>最大数：</h5>
      <el-input-number size="small" :min="1" v-model="count.max" />
      <el-button slot="reference">配置</el-button>
    </el-popover>
    <el-popover v-if="count.type === 'form_header'"
      placement="right" trigger="click">
      <h5>输入表单中 form_header 的一个字段：</h5>
      <el-input size="small" v-model="count.key_path"></el-input>
      <el-button slot="reference">配置</el-button>
    </el-popover>
    <el-popover v-if="count.type === 'message_header'"
      placement="right" trigger="click">
      <h5>输入流程中的一个历史环节的 messageId：</h5>
      <el-input size="small" v-model="count.id"></el-input>
      <h5>输入该环节中的表单的一个字段：</h5>
      <el-input size="small" v-model="count.key_path"></el-input>
      <el-button slot="reference">配置</el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  props: {
    count: Object
  },
  methods: {
    countConfig (type) {
      switch (type) {
        case 'static':
          this.$set(this.count, 'min', 1)
          this.$set(this.count, 'max', 1)
          break
        case 'form_header':
          this.$set(this.count, 'key_path', '')
          break
        case 'message_header':
          this.$set(this.count, 'id', '')
          this.$set(this.count, 'key_path', '')
          break
        default:
          console.log('其他')
      }
    }
  }
}
</script>
