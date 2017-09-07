<template>
  <div class="conf-contain" v-if="dialogProps.range">
    <el-form label-width="100px">
      <el-form-item label="最小值">
        <el-input-number size="small" v-model="dialogProps.range.min" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="最大值">
        <el-input-number size="small" v-model="dialogProps.range.max" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="onReset">不设限</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: {
      dialogProps: Object
    },

    methods: {
      onReset () {
        this.dialogProps.range = { min: 0, max: 0 }
      }
    }
  }
</script>