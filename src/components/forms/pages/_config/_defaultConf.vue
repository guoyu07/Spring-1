<style lang="less" scoped>
  .conf-contain {

    .el-form-item {
      margin-bottom: 0;
    }
  }
</style>

<template>
  <div class="conf-contain">
    <el-form label-width="100px">
      <el-form-item label="默认值类型">
        <el-select size="small" v-model="dialogProps.default.type">
          <el-option v-for="item in countConfig" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <template v-if="['static', 'api'].includes(dialogProps.default.type)">
        <el-form-item label="静态值／索引">
          <el-input size="small" v-model="dialogProps.default.value"></el-input>
        </el-form-item>
      </template>
      <template v-if="!['static', 'api'].includes(dialogProps.default.type)">
        <el-form-item label="属性路径">
          <el-input size="small" class="code-input" v-model="dialogProps.default.key_path"></el-input>
        </el-form-item>
      </template>
      <template v-if="dialogProps.default.type.includes('message_')">
        <el-form-item label="流程节点 ID">
          <el-input size="small" class="code-input" v-model="dialogProps.default.id"></el-input>
        </el-form-item>
      </template>
      <template v-if="dialogProps.default.type">
        <el-form-item>
          <el-button size="small" @click="onReset"><i class="el-icon-fa-refresh"></i> 重置</el-button>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: {
      dialogProps: Object,
      isBody: Boolean
    },

    computed: {
      countConfig () {
        if (this.dialogProps.value.type === 'table') {
          return [ 'form_header', 'form_body', 'message_header', 'message_body' ]
        } else if (this.dialogProps.value.type === 'search_bar' && !this.isBody) {
          return [ 'static', 'form_header', 'message_header', 'api' ]
        } else {
          return [ 'static', 'form_header', 'form_body', 'message_header', 'message_body', 'api' ]
        }
      }
    },

    methods: {
      onReset () {
        this.dialogProps.default = { type: '' }
      }
    }
  }
</script>