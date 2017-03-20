<style lang="less" scoped>
  .conf-contain {
    el-row {
      margin-bottom: 4px;
    }
  }  
</style>

<template>
  <el-dialog title="获取选项的 API 配置：" v-model="dialogProps.confVisible">
    <div class="conf-contain" v-if="dialogProps.source">
      <el-form :model="dialogProps.source">
        <el-form-item label="URL：" label-width="80px">
          <el-input v-model="dialogProps.source.url"></el-input>
        </el-form-item>
        <el-form-item label="action：" label-width="80px">
          <el-input v-model="dialogProps.source.data.action"></el-input>
        </el-form-item>
        <el-form-item label="method：" label-width="80px">
          <el-input v-model="dialogProps.source.data.method"></el-input>
        </el-form-item>
        <!--<el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>-->
      </el-form>
      <el-card>
        参数来源 5 种 params + 返回数据
      </el-card>
      <el-card>
        多选/count 5 种 radio
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      dialogProps: Object
    },
    methods: {}
  }
</script>
