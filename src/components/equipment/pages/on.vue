<style lang="less" scoped>
  .step {
    .el-radio-group {
      margin-bottom: 22px;
    }
  }
</style>

<template>
  <div class="onshelf">
    <el-row>
      <el-col :sm="24" :md="20" :lg="18">
        <el-card class="box-card step-card">
          <h3>上架流程</h3>
          <el-steps :space="180" :active="activeStep">
            <el-step title="选择操作类型"></el-step>
            <el-step title="选择设备类型"></el-step>
            <el-step title="设备搜索及操作"></el-step>
          </el-steps>
          <el-row>
            <el-col :span="16" :offset="4">
              <div class="step step-1" v-show="activeStep === 1">
                <el-form label-position="left" label-width="100px">
                  <el-form-item label="操作类型">
                    <el-select v-model="operationType">
                      <el-option value="1" label="上架"></el-option>
                      <el-option value="2" label="出库并上架"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <div class="btn-area">
                  <el-button type="primary" :disabled="!operationType" @click="activeStep++" class="md">下一步</el-button>
                </div>
              </div>
              <div class="step step-2" v-show="activeStep === 2">
                <el-form label-position="left" label-width="100px">
                  <el-form-item label="设备类型">
                    <el-select v-model="deviceType">
                      <el-option v-for="device in deviceList"
                        :label="device.label"
                        :value="device.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <div class="btn-area clear">
                  <el-button class="fl" @click="activeStep--">上一步</el-button>
                  <el-button type="primary" :disabled="!deviceType" @click="activeStep++" class="fr">下一步</el-button>
                </div>
              </div>
              <div class="step step-3" v-show="activeStep === 3">
                <el-form label-position="left" label-width="100px">
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
                  v-loading.body="deviceLoading"
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
                      <el-button v-if="operationType === '1'" type="text" @click="onDeploy(row)">上架</el-button>
                      <el-button v-if="operationType === '2'" type="text" @click="onRetrieve(row)">上架并出库</el-button>
                    </span>
                  </el-table-column>
                </el-table>
                <br>
                <div class="btn-area">
                  <el-button class="md" @click="activeStep--">上一步</el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        activeStep: 1,
        deviceType: '',
        deviceLoading: false,
        operationType: '',
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
        deviceTable: []
      }
    },

    methods: {
      onSearchDevices () {
        if (!this.deviceSearch) {
          this.$message.error('搜索关键字不能为空！')
          return
        }
        this.deviceLoading = true
        this.$http.get('/deviceData').then((res) => {
          this.deviceTable = res.body
          this.deviceLoading = false
        })
      }
    }
  }
</script>