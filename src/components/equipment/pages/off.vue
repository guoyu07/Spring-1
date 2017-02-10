<!-- TODO: 默认服务器 默认搜索条件为服务器 -->
<template>
  <el-row>
    <el-col :sm="24" :md="24" :lg="24">
      <el-card class="box-card">
        <h3>下架流程</h3>
        <el-form ref="offForm" label-width="100px">
          <el-form-item label="设备类型">
            <el-select v-model="deviceType" @change="onDeviceTypeChange">
              <el-option v-for="device in deviceList"
                :label="device.label"
                :value="device"></el-option>
            </el-select>
            <!-- <el-radio-group v-model="deviceValue">
              <el-radio v-for="device in deviceList" :label="device.label"></el-radio>
            </el-radio-group> -->
          </el-form-item>
        </el-form>
        <el-form ref="searchKeys" label-width="100px" :inline="true">
          <div v-show="deviceType.value === 'server'" class="form-block">
            <el-form-item v-for="key in searchKeys" :label="key.label">
              <el-input v-model="key.value"></el-input>
            </el-form-item>
          </div>
          <div v-show="deviceType.value === 'network'" class="form-block">2</div>
          <div v-show="deviceType.value === 'storage'" class="form-block">3</div>
          <div v-show="deviceType.value === 'others'" class="form-block">4</div>
          <el-form-item>
            <el-button type="primary" @click="onSearchDevices">搜索</el-button>
            <el-button @click="onEmptySearch">清空</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="deviceTable"
          border
          v-loading.body="deviceLoading"
          @selection-change="handleSelectionChange"
          style="width: 100%; min-width: 460px">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="name"
            label="设备"></el-table-column>
          <el-table-column
            prop="number"
            label="编号"></el-table-column>
          <el-table-column
            prop="other"
            label="其他"></el-table-column>
          <el-table-column
            inline-template
            :context="_self"
            label="操作">
            <span>
              <el-button type="text" @click="onDeploy(row)">下架</el-button>
            </span>
          </el-table-column>
        </el-table>
      </el-card>

    </el-col>
  </el-row>
</template>

<script>
  export default {
    data () {
      return {
        deviceType: '',
        searchKeys: [],
        deviceLoading: false,
        deviceTable: [],
        deviceList: [{ // 设备类型
          label: '服务器',
          value: 'server'
        }, {
          label: '网络设备',
          value: 'network'
        }, {
          label: '存储设备',
          value: 'storage'
        }, {
          label: '其他外设',
          value: 'others'
        }],
        multipleSelection: []
      }
    },
    methods: {
      onDeviceTypeChange () {
        this.$http.get('/searchKeys').then((res) => {
          this.searchKeys = res.body
        })
      },
      onSearchDevices () {
        if (!this.searchKeys.some((key) => key.value)) {
          this.$message.error('搜索条件不能全空！')
          return
        }
        this.deviceLoading = true
        this.$http.get('/equipmentData').then((res) => {
          this.deviceTable = res.body
          this.deviceLoading = false
        })
      },
      handleSelectionChange (val) {
        if (val.length > 5) {
          this.$message.warning('下架设备最多5个')
        } else {
          this.multipleSelection = val
          console.log(val)
        }
      },
      onEmptySearch () {
        for (let key of this.searchKeys) {
          key.value = ''
        }
      },
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      }
    }
  }
</script>
<style scoped>
  .box-card {
    min-height: 880px;
  }
</style>
