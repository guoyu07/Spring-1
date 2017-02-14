<template>
  <el-row>
    <el-col :sm="24" :md="24" :lg="20">
      <el-card class="box-card">
        <h3>下架流程</h3>
        <el-form ref="offForm" label-width="100px">
          <el-form-item label="设备类型">
            <!-- <el-select v-model="deviceType">
              <el-option v-for="device in deviceList"
                :label="device.label"
                :value="device"></el-option>
            </el-select> -->
            <el-radio-group v-model="deviceType">
              <el-radio v-for="device in deviceList" :label="device.value">{{device.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-form ref="searchKeys" label-width="100px" class="advance-search-form" :inline="true">
          <div class="form-block">
            <el-form-item v-for="key in searchKeys" :label="key.label">
              <el-input v-model="key.value" size="small"></el-input>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" size="small" @click="onSearchDevices">搜索</el-button>
            <el-button @click="onEmptySearch" size="small">清空</el-button>
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
          <!-- <el-table-column
            inline-template
            :context="_self"
            label="操作">
            <span>
              <el-button type="text" @click="onDeploy(row)">下架</el-button>
            </span>
          </el-table-column> -->
        </el-table>
        <div class="btn-area">
          <el-button type="primary" size="small" @click="onAddtoOff">添加至下架</el-button>
        </div>
        <h5>下架列表</h5>
        <el-table
          :data="offTabel"
          border
          style="width: 100%; min-width: 460px">
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
              <el-button type="text" @click="onRemove(row)">移除</el-button>
            </span>
          </el-table-column>
        </el-table>
        <div class="btn-area">
          <el-button type="primary" @click="onConfirmOff">确认下架</el-button>
          <el-button @click="onReject">驳回</el-button>
        </div>
      </el-card>

    </el-col>
  </el-row>
</template>

<script>
  export default {
    data () {
      return {
        deviceType: 'server',
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
        multipleSelection: [],
        offTabel: []
      }
    },
    created () {
      this.onDeviceTypeChange()
    },
    methods: {
      onDeviceTypeChange () {
        this.$http.get(`/searchKeys/${this.deviceType}`).then((res) => {
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
        this.multipleSelection = val
      },
      onEmptySearch () {
        for (let key of this.searchKeys) {
          key.value = ''
        }
      },
      onAddtoOff () {
        for (const selection of this.multipleSelection) {
          if (!this.offTabel.includes(selection)) {
            if (this.multipleSelection.length > 5) {
              this.$message.warning('下架设备最多5个')
            } else {
              this.offTabel = [...this.offTabel, selection]
            }
          }
          // else {
          //   this.$message.warning(`下架列表中已存在${selection.name}`)
          // }
        }
      },
      onRemove (row) {
        const index = this.offTabel.indexOf(row)
        this.offTabel.splice(index, 1)
      },
      onConfirmOff () {
        this.offTabel = []
        this.deviceTable = []
        this.$message.success('成功上架')
        console.log(this.offTabel)
      },
      onReject () {
        this.offTabel = []
        this.$message.success('成功驳回')
        console.log(this.offTabel)
      },
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      }
    },
    watch: {
      deviceType: function () {
        this.onDeviceTypeChange()
      }
    }
  }
</script>
<style scoped>
  .box-card {
    min-height: 880px;
  }
  .btn-area {
    text-align: center;
    margin: 15px 0;
  }
</style>
