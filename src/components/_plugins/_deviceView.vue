<template>
  <div class="device-view">
    <el-dialog
      title="变更设备"
      v-model="deviceViewData.visible"
      :modal="true">
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form ref="deviceViewData.device"
            :model="deviceViewData.device"
            label-width="80px">
            <el-form-item label="设备名称">
              <el-input v-model="deviceViewData.device.name">
            </el-form-item>
            <el-form-item label="编号">
              <el-input v-model="deviceViewData.device.number">
            </el-form-item>
            <el-form-item label="其他">
              <el-input v-model="deviceViewData.device.other">
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">完成变更</el-button>
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
      deviceViewData: { type: Object }
    },

    methods: {
      onSubmit () {
        console.log(this.deviceViewData)
      }
    }
  }
</script>