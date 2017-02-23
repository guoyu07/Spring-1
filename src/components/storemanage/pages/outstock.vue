<template>
  <div class="outstock">
    <el-row>
      <el-col :sm="24" :md="20" :lg="24">
        <el-card class="box-card step-card">
          <h3><i class="el-icon-fa-sign-out"></i> 出库流程</h3>
          <el-form ref="onForm" label-width="100px">
            <el-form-item label="设备类型">
              <el-radio-group v-model="deviceType" @change="onDeviceTypeChange">
                <el-radio v-for="device in deviceList" :label="device.object_id">{{device.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>

          <el-form ref="searchKeys" label-width="100px" class="advance-search-form" :inline="true">
            <div class="form-block">
              <el-form-item v-for="key in searchKeyList" :label="key.name">
                <el-input v-model="searchKeys[key.id]" size="small"></el-input>
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
            style="width: 100%; min-width: 460px">
            <el-table-column
              prop="hostname"
              label="设备"></el-table-column>
            <el-table-column
              prop="instanceId"
              label="编号"></el-table-column>
            <el-table-column
              prop="status"
              label="状态"></el-table-column>
            <el-table-column
              inline-template
              :context="_self"
              label="操作">
              <span>
                <el-button size="small" @click="onRetrieve(row)">出库</el-button>
                <el-button size="small" type="warning" @click="onEdit(row)">变更</el-button>
              </span>
            </el-table-column>
          </el-table>
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
        deviceType: 'HOST',
        deviceLoading: false,
        deviceList: [],
        searchKeys: {},
        searchKeyList: [],
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

    created () {
      this.renderDeviceList()
      this.onDeviceTypeChange()
    },

    watch: {
      activeStep () {
        this.deviceTable = []
        // this.searchKeys = []
      }
    },

    methods: {
      renderDeviceList () { // 渲染设备类型
        var renderDeviceListData = {
          action: 'import/device/items',
          method: 'GET',
          data: {}
        }
        this.http.post('custom/', this.parseData(renderDeviceListData)).then((res) => {
          console.log(res)
          this.deviceList = res.data.data.list
        })
      },

      onDeviceTypeChange () {
        var searchAttrData = {
          action: 'cmdb/object/search/attr',
          method: 'GET',
          data: {
            object_id: this.deviceType
          }
        }
        this.http.post('', this.parseData(searchAttrData)).then((res) => {
          this.searchKeyList = res.data.data.attr_list
        })
      },

      onSearchDevices (page = 1) {
        const searchData = this.filterObj(this.searchKeys)
        if (this.isEmptyObj(searchData)) {
          this.$message.info('搜索条件不能为空')
          return false
        }
        this.deviceLoading = true
        var searchDeviceData = {
          action: `/object/${this.deviceType}/instance/_search`,
          method: 'POST',
          data: {
            query: searchData, // "字典,格式参考:http://www.jb51.net/article/48216.htm"
            page: 1,
            pageSize: '', // 默认为30
            fields: {}, // "字典, 过滤字段, 留空代表返回所有字段"
            sort: {} // "字典, 按字段排序, 留空代表不排序"
          }
        }
        this.http.post('easyops/', this.parseData(searchDeviceData)).then((res) => {
          this.deviceTable = res.data.data.data.list
          this.deviceLoading = false
        })
      },

      onEmptySearch () {
        for (let key of this.searchKeys) {
          key.value = ''
        }
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
