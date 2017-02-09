<style lang="less" scoped>
  .deploy-view {
    .el-form-item {
      margin-bottom: 12px;
    }
  }
</style>

<template>
  <div class="deploy-view">
    <el-dialog
      title="确认上架信息"
      v-model="deployViewData.visible"
      top="10%"
      :modal="true">
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form ref="deployViewData.device"
            :model="deployViewData.device"
            label-width="120px">
            <el-form-item label="选择 OS">
              <el-input v-model="deployViewData.device.os">
            </el-form-item>
            <el-form-item label="选择数据库">
              <el-input v-model="deployViewData.device.db">
            </el-form-item>
            <el-form-item label="是否安装 Agent">
              <el-switch
                v-model="deployViewData.device.agent"
                on-text="是"
                off-text="否"></el-switch>
            </el-form-item>
            <el-form-item label="IP">
              <el-input v-model="deployViewData.device.ip">
            </el-form-item>
            <el-form-item label="端口信息">
              <el-input v-model="deployViewData.device.port">
            </el-form-item>
            <el-form-item label="所在 U 位">
              <el-input v-model="deployViewData.device.ubit">
            </el-form-item>
            <el-form-item label="所在机柜">
              <el-input v-model="deployViewData.device.cabinet">
            </el-form-item>
            <el-form-item label="机房">
              <el-input v-model="deployViewData.device.room">
            </el-form-item>
            <el-form-item label="所属应用服务">
              <el-input v-model="deployViewData.device.app">
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">{{ operationType.value === '1' ? '确认上架' : '确认上架并出库' }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      deployViewData: { type: Object },
      operationType: { type: Object }
    },

    methods: {
      onSubmit () {
        console.log(this.deployViewData)
      }
    }
  }
</script>