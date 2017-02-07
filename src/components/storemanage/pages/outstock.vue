<style lang="less">
  .step-card {

    .el-select {
      width: 100%;
    }

    .step {
      margin-top: 24px;
    }

    .el-steps {
      width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .btn-area {
      margin-bottom: 24px;
      margin-left: auto;
      margin-right: auto;
      width: 200px;
    }
  }
</style>

<template>
  <div class="outstock">
    <el-row>
      <el-col :sm="24" :md="20">
        <el-card class="box-card step-card">
          <h3>出库流程</h3>
          <el-steps :space="380" :active="activeStep">
            <el-step title="选择设备类型"></el-step>
            <el-step title="设备搜索及操作"></el-step>
          </el-steps>
          <el-col>
            <el-col :span="16" :offset="4">
              <div class="step step-1" v-show="activeStep === 1">
                <el-form label-position="left" label-width="100px">
                  <el-form-item label="设备类型">
                    <el-select v-model="deviceValue">
                      <el-option v-for="device in deviceList"
                        :label="device.label"
                        :value="device.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <div class="btn-area">
                  <el-button type="primary" @click="activeStep++" class="md">下一步</el-button>
                </div>
              </div>
              <div class="step step-2" v-show="activeStep === 2">
                <el-form label-positio="left" label-width="100px">
                  <el-form-item label="搜索设备">
                    <el-input
                      placeholder="请在这里搜索设备..."
                      icon="search"
                      v-model="deviceSearch">
                      <el-button slot="append" icon="search" @click="onSearchDevices"></el-button>
                    </el-input>
                  </el-form-item>
                </el-form>
                <el-table
                  :data="deviceTable"
                  border
                  style="width: 100%">
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
                    label="设备">
                    <span>
                      <el-button type="text" @click="onRetrieve(row)">出库</el-button>
                      <el-button type="text" @click="onEdit(row)">变更</el-button>
                    </span>
                  </el-table-column>
                </el-table>
                <br>
                <div class="btn-area">
                  <el-button class="md" @click="activeStep--">上一步</el-button>
                </div>
              </div>
            </el-col>
          </el-col>
        </el-card>
      </el-col>
    </el-row>
    <device-view :device-view-data="deviceViewData"></device-view>
  </div>
</template>

<script>
  import deviceView from '../../_plugins/_deviceView'

  export default {
    data () {
      return {
        activeStep: 1,
        deviceValue: '',
        deviceList: [{
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
        deviceSearch: '',
        deviceTable: [],
        deviceViewData: {
          visible: false,
          device: {}
        }
      }
    },

    methods: {
      onSearchDevices () {
        console.log(this.deviceSearch)
        this.$http.get('/deviceData').then((res) => {
          console.log(res.body)
          this.deviceTable = res.body
        })
      },

      onRetrieve (device) {
        this.$confirm(`确定对设备「${device.name}」进行出库操作吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(device.id)
          this.$message({
            type: 'success',
            message: '已出库！'
          })
        }).catch(() => {
          console.log(device.id)
        })
      },

      onEdit (device) {
        this.deviceViewData.visible = true
        this.deviceViewData.device = device
      }
    },

    components: {
      deviceView
    }
  }
</script>