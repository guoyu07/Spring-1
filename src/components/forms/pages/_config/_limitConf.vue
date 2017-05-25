<style lang="less" scoped>
  .conf-contain {

    .el-form-item {
      margin-bottom: 0;
    }
  }
</style>

<template>
  <div class="conf-contain" v-if="dialogProps.limit">
    <el-form label-width="100px">
      <el-form-item label="个数限制来源">
        <el-select size="small" v-model="dialogProps.limit.type">
          <el-option v-for="item in countConfig" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <template v-if="dialogProps.limit.type === 'static'">
        <el-form-item label="最大值">
          <el-input-number v-model="dialogProps.limit.max" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="最小值">
          <el-input-number v-model="dialogProps.limit.min" :min="1"></el-input-number>
        </el-form-item>
      </template>
      <template v-if="dialogProps.limit.type !== 'static'">
        <el-form-item label="属性路径">
          <el-input size="small" class="code-input" v-model="dialogProps.limit.key_path"></el-input>
        </el-form-item>
      </template>
      <template v-if="dialogProps.limit.type.includes('message_')">
        <el-form-item label="流程节点 ID">
          <el-input size="small" class="code-input" v-model="dialogProps.limit.id"></el-input>
        </el-form-item>
      </template>
      <template v-if="dialogProps.limit.type">
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
      dialogProps: Object
    },

    data () {
      return {
        countConfig: [ 'static', 'form_header', 'form_body', 'message_header', 'message_body' ]
      }
    },

    methods: {
      onReset () {
        this.dialogProps.limit = { type: '' }
      }
    }
  }
</script>