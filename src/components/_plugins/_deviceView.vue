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
            <el-form-item label="设备">
              <el-input v-model="deviceViewData.device.hostname">
            </el-form-item>
            <el-form-item label="状态">
              <el-input v-model="deviceViewData.device.status">
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">完成变更</el-button>
              <router-link :to="{ path: '/storemanage/instock', query: { instanceId: deviceViewData.device.instanceId, object_id: deviceViewData.object_id }}" class="el-button el-button--text">查看更多</router-link>
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
        var updataInstanceData = {
          action: 'cmdb/update/instance',
          method: 'PUT',
          data: {
            object_id: this.deviceViewData.object_id,
            instanceId: this.deviceViewData.device.instanceId,
            object_data: {
              name: this.deviceViewData.device.name,
              hostname: this.deviceViewData.device.hostname,
              status: this.deviceViewData.device.status
            } // "要更新字段及值,字典"
          }
        }
        this.http.post('', this.parseData(updataInstanceData)).then((res) => {
          console.log(res)
          if (res.status === 200) {
            this.$notify({
              title: '成功',
              message: `变更成功！`,
              type: 'success'
            })
          } else {
            this.$notify.error({
              title: '失败',
              message: `变更失败！`
            })
          }
        })
      }
    }
  }
</script>
