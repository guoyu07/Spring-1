<style lang="less" scoped>
  .deploy-view {
    .el-form-item {
      margin-bottom: 12px;
    }

    .btn-area {
      margin-top: 18px;
    }
  }
</style>

<template>
  <div class="deploy-view">
    <el-dialog
      title="填写上架信息"
      v-model="deployViewData.visible"
      top="10%"
      :modal="true">
      <el-tabs type="border-card">
        <el-tab-pane v-for="(device, index) in selectedDevices" :label="device.name">
          <el-row>
            <el-col :span="20" :offset="2">
              <el-form ref="device"
                :model="device"
                label-width="120px">
                <el-form-item label="选择 OS">
                  <el-input v-model="device.os">
                </el-form-item>
                <el-form-item label="选择数据库">
                  <el-input v-model="device.db">
                </el-form-item>
                <el-form-item label="是否安装 Agent">
                  <el-switch
                    v-model="device.agent"
                    on-text="是"
                    off-text="否"></el-switch>
                </el-form-item>
                <el-form-item label="IP">
                  <el-input v-model="device.ip">
                </el-form-item>
                <el-form-item label="端口信息">
                  <el-input v-model="device.port">
                </el-form-item>
                <el-form-item label="所在 U 位">
                  <el-select
                    v-model="device.ubit"
                    filterable
                    allow-create>
                    <el-option label="1" value="u-1"></el-option>
                    <el-option label="2" value="u-2"></el-option>
                    <el-option label="3" value="u-3"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所在机柜">
                  <el-input v-model="device.cabinet">
                </el-form-item>
                <el-form-item label="机房">
                  <el-input v-model="device.room">
                </el-form-item>
                <el-form-item label="所属应用服务">
                  <el-input v-model="device.app">
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <div class="btn-area">
        <el-button type="primary" class="md" @click="onSubmit">{{ operationType === 'op-1' ? '确认上架' : '确认上架并出库' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      deployViewData: { type: Object },
      operationType: { type: String },
      selectedDevices: { type: Array }
    },

    methods: {
      onSubmit () {
        console.log(this.selectedDevices)
      }
    }
  }
</script>