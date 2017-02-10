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
          <h3><i class="el-icon-fa-upload"></i> 上架流程</h3>
          <el-steps :space="380" :active="deployStep">
            <el-step title="选择设备类型" :description="deviceType.label"></el-step>
            <el-step title="设备搜索及操作"></el-step>
          </el-steps>
          <el-row>
            <el-col :span="16" :offset="4">
              <div class="step step-1" v-show="deployStep === 1">
                <el-form label-position="left" label-width="100px">
                  <el-form-item label="设备类型">
                    <el-select v-model="deviceType" @change="onDeviceTypeChange">
                      <el-option v-for="device in deviceList"
                        :label="device.label"
                        :value="device"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <div class="btn-area clear">
                  <el-button class="fl" @click="deployStep--">上一步</el-button>
                  <el-button type="primary" :disabled="!deviceType.value" @click="deployStep++" class="fr">下一步</el-button>
                </div>
              </div>
              <div class="step step-2" v-show="deployStep === 2">
                <el-row>
                  <el-col :span="16">
                    <el-form label-position="left" label-width="80px" class="advance-search-form">
                      <el-form-item v-for="key in searchKeys" :label="key.label">
                        <el-input
                          v-model="key.value"
                          size="small"></el-input>
                      </el-form-item>
                      <el-form-item label="状态">
                        <el-select v-model="operationType">
                          <el-option value="all" label="全部"></el-option>
                          <el-option value="op-1" label="已出库"></el-option>
                          <el-option value="op-2" label="未出库"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" size="small" @click="onSearchDevices">搜索</el-button>
                        <el-button @click="onEmptySearch" size="small">清空</el-button>
                      </el-form-item>
                    </el-form>
                  </el-col>
                </el-row>
                <el-table
                  :data="deviceTable"
                  border
                  v-loading.body="deviceLoading"
                  @selection-change="onSelectRow"
                  style="width: 100%; min-width: 460px">
                  <el-table-column
                    width="55"
                    type="selection"></el-table-column>
                  <el-table-column
                    prop="name"
                    label="设备"></el-table-column>
                  <el-table-column
                    prop="number"
                    label="编号"></el-table-column>
                  <el-table-column
                    prop="other"
                    label="其他"></el-table-column>
                </el-table>
                <br>
                <div class="btn-area clear">
                  <el-button class="fl" @click="deployStep--">上一步</el-button>
                  <el-button
                    type="primary"
                    class="fr"
                    @click="deployViewData.visible = true">{{ operationType === 'op-1' ? '批量上架' : '批量上架并出库' }}</el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <br>
    <el-row>
      <el-col :sm="24" :md="20" :lg="18">
        <el-card class="box-card step-card">
          <h3><i class="el-icon-fa-gavel"></i> 审核流程</h3>
          <el-steps :space="380" :active="reviewStep">
            <el-step title="上架操作审核"></el-step>
            <el-step title="上架任务确认"></el-step>
          </el-steps>
          <el-row>
            <el-col :span="16" :offset="4">
              <div class="step step-1" v-show="reviewStep === 1">

              </div>
              <div class="step step-2" v-show="reviewStep === 2">

              </div>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <deploy-view
      :deploy-view-data="deployViewData"
      :selected-devices="selectedDevices"
      :operation-type="operationType"></deploy-view>
  </div>
</template>

<script>
  import deployView from '../../_plugins/_deployView'

  export default {
    data () {
      return {
        deployStep: 1,
        operationType: 'op-1',
        deviceType: {},
        deviceLoading: false,
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
        operationList: [{
          label: '上架',
          value: '1'
        }, {
          label: '上架并出库',
          value: '2'
        }],
        searchKeys: [],
        deviceTable: [],
        deployViewData: {
          visible: false
        },
        reviewStep: 1,
        selectedDevices: []
      }
    },

    methods: {
      onDeviceTypeChange () {
        this.$http.get(`/searchKeys/${this.deviceType.value}`).then((res) => {
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

      onEmptySearch () {
        for (let key of this.searchKeys) {
          key.value = ''
        }
      },

      onSelectRow (val) {
        this.selectedDevices = val
      }
    },

    components: {
      deployView
    }
  }
</script>
