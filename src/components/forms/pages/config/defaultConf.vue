<style lang="less" scoped>
  .conf-contain {

    .el-input {
      width: 100px;
      display: inline-block;
    }

    .el-row {
      margin-top: 4px;
    }
  }  
</style>

<template>
  <div class="conf-contain">
    <el-form label-width="100px" :inline="true">
      <el-form-item label="默认值类型">
        <el-select size="small" v-model="dialogProps.default.type">
          <el-option v-for="item in countConfig" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <br>
      <template v-if="dialogProps.default.type === 'static'">
        <el-form-item label="静态值">
          <el-input size="small" v-model="dialogProps.default.value"></el-input>
        </el-form-item>
      </template>
      <template v-if="dialogProps.default.type !== 'static'">
        <el-form-item label="属性路径">
          <el-input size="small" class="code-input" v-model="dialogProps.default.key_path"></el-input>
        </el-form-item>
      </template>
      <template v-if="dialogProps.default.type.includes('message_')">
        <el-form-item label="流程节点 ID">
          <el-input size="small" class="code-input" v-model="dialogProps.default.id"></el-input>
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
    }
  }
</script>