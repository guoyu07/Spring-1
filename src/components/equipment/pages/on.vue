<template>
  <div class="onshelf">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card step-card">
          <h3><i class="el-icon-fa-upload"></i> 上架流程</h3>
          <el-form ref="onForm" label-width="100px">
            <el-form-item label="设备类型">
              <el-radio-group v-model="deviceType" @change="onDeviceTypeChange">
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
          <div class="btn-area">
            <el-button
              type="primary"
              size="small"
              class="md"
              :disabled="!selectedDevices.length"
              @click="onPushInQueue">{{ operationType === 'op-1' ? '加入上架队列' : '加入上架并出库队列' }}</el-button>
          </div>
              <!-- </div> -->
              <!-- <div class="step step-3" v-show="deployStep === 3"> -->
          <h5>下架列表</h5>
          <el-table
            :data="deviceQueue"
            border>
            <el-table-column
              prop="name"
              label="设备"
              fixed></el-table-column>
            <el-table-column
              prop="number"
              label="编号"></el-table-column>
            <el-table-column
              prop="other"
              label="其他"></el-table-column>
            <el-table-column
              prop="agent"
              label="是否安装代理">
              <template scope="scope">
                {{ scope.row.agent ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="app"
              label="应用服务"></el-table-column>
            <el-table-column
              prop="db"
              label="数据库"></el-table-column>
            <el-table-column
              prop="room"
              label="机房"></el-table-column>
            <el-table-column
              prop="cabinet"
              label="机柜"></el-table-column>
            <el-table-column
              prop="ubit"
              label="U 位"></el-table-column>
            <el-table-column
              prop="os"
              label="OS"></el-table-column>
            <el-table-column
              prop="ip"
              label="IP"></el-table-column>
            <el-table-column
              prop="port"
              label="端口"></el-table-column>
            <el-table-column
              inline-template
              :context="_self"
              label="操作"
              fixed="right">
              <template>
                <el-button size="small" type="warning" @click="onRemove(row)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <br>
          <div class="btn-area">
            <el-button type="primary" class="md" @click="deployViewData.visible = true">批量编辑并{{ operationType === 'op-1' ? '上架' : '上架并出库' }}</el-button>
          </div>
              <!-- </div> -->
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <deploy-view
      :deploy-view-data="deployViewData"
      :selected-devices="deviceQueue"
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
        deviceType: 'server',
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
        selectedDevices: [],
        deviceQueue: []
      }
    },

    created () {
      this.onDeviceTypeChange()
    },

    methods: {
      onDeviceTypeChange () {
        this.$http.get(`/searchKeys/${this.deviceType}`).then((res) => {
          console.log(res.body)
          this.searchKeys = res.body
        })
      },

      onSearchDevices () {
        if (!this.searchKeys.some((key) => key.value)) {
          this.$message.error('搜索条件不能全空！')
          return
        }
        this.$http.get('/equipmentData').then((res) => {
          this.deviceTable = res.body
        })
      },

      onEmptySearch () {
        for (let key of this.searchKeys) {
          key.value = ''
        }
      },

      onSelectRow (val) {
        this.selectedDevices = val
      },

      onPushInQueue () {
        for (const device of this.selectedDevices) {
          if (!this.deviceQueue.includes(device)) {
            if (this.selectedDevices.length > 5) {
              this.$message.warning('上架设备最多 5 个！')
            } else {
              this.deviceQueue = [...this.deviceQueue, device]
            }
          }
        }
      },

      onRemove (device) {
        const index = this.deviceQueue.indexOf(device)
        this.deviceQueue.splice(index, 1)
      }
    },

    components: {
      deployView
    }
  }
</script>
