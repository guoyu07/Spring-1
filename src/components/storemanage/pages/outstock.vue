<style lang="less">
  @import url("../../../assets/css/variables.less");

  .device-data-table {
    border-top: 1px solid @borderColor;
    border-left: 1px solid @borderColor;
    margin: 0 auto 18px;
    width: 66%;

    tr > td:first-child {
      background-color: lighten(@bgLighter, 3%);
    }

    td {
      border-bottom: 1px solid @borderColor;
      border-right: 1px solid @borderColor;
      padding: 6px;
      font-size: 13px;
    }
  }
</style>

<template>
  <div class="outstock">
    <el-row>
      <el-col :sm="24" :md="20" :lg="18">
        <el-card class="box-card step-card">
          <h3>出库流程</h3>
          <el-steps :space="380" :active="activeStep">
            <el-step title="选择设备类型" :description="deviceValue.label"></el-step>
            <el-step title="设备搜索及操作"></el-step>
          </el-steps>
          <el-row>
            <el-col :span="16" :offset="4">
              <div class="step step-1" v-show="activeStep === 1">
                <el-form label-position="left" label-width="100px">
                  <el-form-item label="设备类型">
                    <el-select v-model="deviceValue">
                      <el-option v-for="device in deviceList"
                        :label="device.label"
                        :value="device"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <div class="btn-area">
                  <el-button type="primary" :disabled="!deviceValue.value" @click="activeStep++" class="md">下一步</el-button>
                </div>
              </div>
              <div class="step step-2" v-show="activeStep === 2">
                <el-form label-position="left" label-width="100px">
                  <el-form-item label="搜索设备">
                    <el-input
                      :placeholder="'请在这里搜索' + deviceValue.label + '...'"
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
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      title="出库操作"
      v-model="retrieveViewData.visible"
      size="tiny"
      :modal="true">
      <table class="device-data-table">
        <tbody>
          <tr v-for="(value, key) in retrieveViewData.device">
            <td><b>{{key}}</b></td>
            <td>{{value}}</td>
          </tr>
        </tbody>
      </table>
      <el-row>
        <el-col :span="14" :offset="5">
          <h4 class="sub-title"><i class="el-icon-information"></i> 请指定出库后的所在地点：</h4>
          <el-input
            placeholder="请输入出库指定地点..."
            v-model="retrieveViewData.location"></el-input>
        </el-col>
      </el-row>
      <span class="dialog-footer" slot="footer">
        <el-button @click="retrieveViewData.visible = false">取消</el-button>
        <el-button type="primary" @click="onConfirmRetrieve(retrieveViewData.device, retrieveViewData.location)">确认出库</el-button>
      </span>
    </el-dialog>
    <device-view :device-view-data="deviceViewData"></device-view>
  </div>
</template>

<script>
  import deviceView from '../../_plugins/_deviceView'

  export default {
    data () {
      return {
        activeStep: 1,
        deviceValue: {},
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
        deviceSearch: '',
        deviceTable: [],
        retrieveViewData: {
          visible: false,
          device: {}
        },
        deviceViewData: {
          visible: false,
          location: '',
          device: {}
        }
      }
    },

    watch: {
      activeStep () {
        this.deviceTable = []
        this.deviceSearch = ''
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
      },

      onRetrieve (device) {
        this.retrieveViewData.visible = true
        this.retrieveViewData.device = device
      },

      onConfirmRetrieve (device, location) {
        if (!location) {
          this.$message.error('请填写出库地点！')
          return
        }
        this.$message({
          type: 'success',
          message: `已成功将设备「${device.name}」出库至${location}！`
        })
        this.retrieveViewData.visible = false
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