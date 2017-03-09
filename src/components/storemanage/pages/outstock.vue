<template>
  <div class="outstock">
    <el-row>
      <el-col :sm="24" :md="24" :lg="24">
        <el-card
          class="box-card"
          v-loading.fullscreen.lock="loading"
          element-loading-text="拼命加载中">
          <h3>{{ edit ? '信息变更' : '出库流程'}}</h3>
          <el-form ref="onForm" label-width="100px">
            <el-form-item label="设备类型">
              <el-radio-group v-model="deviceType" @change="onDeviceTypeChange">
                <el-radio v-for="device in deviceList" :label="device.object_id">{{device.name}}</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- <el-form-item label="模糊搜索">
              <el-switch
                v-model="isAdvanceSearch"
                on-text="开启"
                on-color="#42d885"
                off-text="关闭"></el-switch>
            </el-form-item> -->
          </el-form>

          <el-form ref="searchKeys" class="advance-search-form" :model="searchKeys" label-width="100px" :inline="true">
            <search-form-structure
              :search-key-list="searchKeyList"
              :search-keys="searchKeys"
              :is-advance-search="isAdvanceSearch"
              :device-type="deviceType">
            </search-form-structure>

            <el-form-item>
              <el-button size="small" :type="!isAdvanceSearch ? 'primary' : 'success'" @click="onSearchDevices(1, isAdvanceSearch)">{{ !isAdvanceSearch ? '搜索' : '高级搜索' }}</el-button>
              <el-button size="small" @click="resetForm('searchKeys')">清空</el-button>
            </el-form-item>
          </el-form>

          <el-table
            :data="deviceTable"
            border
            v-loading.body="deviceLoading"
            style="width: 100%; min-width: 460px">
            <el-table-column
              prop="instanceId"
              label="编号"></el-table-column>
            <el-table-column
              prop="name"
              label="设备名称"></el-table-column>
            <el-table-column
              prop="hostname"
              label="设备"></el-table-column>
            <el-table-column
              prop="status"
              label="状态"></el-table-column>
            <el-table-column
              inline-template
              :context="_self"
              label="操作">
              <span>
                <el-button size="small" @click="onRetrieve(row)" v-if="(row.status !== '已出库') && (!edit)">出库</el-button>
                <el-button size="small" type="warning" @click="onEdit(row)" v-if="edit">变更</el-button>
              </span>
            </el-table-column>
          </el-table>
          <div class="pagination-block clear" v-if="deviceTotal">
            <el-pagination
              class="fr"
              layout="prev, pager, next"
              :current-page="devicePage"
              :page-size="10"
              @current-change="onDevicePageChange"
              :total="deviceTotal">
            </el-pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      title="出库操作"
      v-model="retrieveViewData.visible"
      size="small"
      :modal="true">
      <el-row>
        <el-col :span="20" :offset="2">
          <el-form label-position="left" inline class="expanded-form">
            <el-form-item v-for="(value, key) in retrieveViewData.device" v-if="formStructure[key]" :label="formStructure[key].name + '：'">
              <div v-if="formStructure[key].type === 'FK' || formStructure[key].type === 'FKs' || formStructure[key].type === 'arr'">
                <span v-for="option in value">{{option.name}}</span>
              </div>
              <span v-else>{{value}}</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <h4 class="sub-title"><i class="el-icon-information"></i> 请填写出库信息：</h4>
          <el-form ref="outstockForm" :model="outstockForm" :inline="true" label-width="80px">
            <form-structure-without-title :form-block="exportAttr" :item="outstockForm" :application="true"></form-structure-without-title>
          </el-form>
        </el-col>
      </el-row>
      <span class="dialog-footer" slot="footer">
        <el-button @click="retrieveViewData.visible = false">取消</el-button>
        <el-button type="primary" @click="onConfirmRetrieve(retrieveViewData.device, outstockForm.location)">确认出库</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="信息变更"
      v-model="deviceViewData.visible"
      size="small"
      :modal="true">
      <el-row>
        <el-col :span="24">
          <el-form ref="outstockForm" :model="outstockForm" :inline="true" label-width="80px">
            <form-structure-without-title :form-block="exportAttr" :item="outstockForm" :application="true" :status="true"></form-structure-without-title>
            <el-form-item>
              <router-link :to="{ path: `/storemanage/instock/${deviceViewData.device.instanceId}`, query: { object_id: deviceViewData.object_id }}" class="el-button el-button--text">变更更多...</router-link>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span class="dialog-footer" slot="footer">
        <el-button @click="deviceViewData.visible = false">取消</el-button>
        <el-button type="primary" @click="onConfirmRetrieve(deviceViewData.device, outstockForm.location)">确认</el-button>
      </span>
    </el-dialog>
    <!-- <device-view :device-view-data="deviceViewData"></device-view> -->
  </div>
</template>

<script>
  // import deviceView from '../../_plugins/_deviceView'
  import searchFormStructure from '../../_plugins/_searchFormStructure'
  import formStructureWithoutTitle from '../../_plugins/_formStructureWithoutTitle'

  export default {
    data () {
      return {
        userInfo: {},
        edit: '',
        loading: false,
        isAdvanceSearch: true,
        formStructure: {},
        outstockForm: {
          application: '',
          status: ''
        },
        deviceType: '',
        deviceLoading: false,
        exportAttr: [],
        deviceList: [],
        deviceListStructure: {},
        searchKeys: {
          searchKey: ''
        },
        searchKeyList: [],
        deviceTable: [],
        devicePage: 1,
        deviceTotal: 0,
        retrieveLocations: [],
        retrieveViewData: {
          visible: false,
          device: {},
          location: ''
        },
        deviceViewData: {
          visible: false,
          location: '',
          device: {}
        }
      }
    },

    created () {
      this.userInfo = window.localStorage
      this.renderDeviceList()
      this.getLocationList()
      if (this.$route.params.edit) {
        this.edit = this.$route.params.edit
      }
    },

    watch: {
      '$route' (to, from) { // 复用组件时，想对路由参数的变化作出响应的话,你可以简单地 watch（监测变化） $route 对象,此时生命周期钩子失效
        if (this.$route.params.edit) {
          this.edit = this.$route.params.edit
        } else {
          this.edit = ''
        }
        this.deviceTable = []
        this.onSearchDevices()
      }
    },

    methods: {
      renderExportAttr () { // 渲染出库属性
        const postData = {
          action: 'cmdb/object/export/attr',
          method: 'GET',
          data: {
            object_id: this.deviceType
          }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          this.exportAttr = res.data.data.attr_list
          this.exportAttr.map(item => {
            if (item.value.type === 'arr' || item.value.type === 'FKs') {
              this.$set(this.outstockForm, item.id, [])
            } else if (item.value.type === 'date' || item.value.type === 'datetime' || item.value.type === 'int') {
              this.$set(this.outstockForm, item.id, undefined)
            } else {
              this.$set(this.outstockForm, item.id, '')
            }
          })
        })
      },

      renderDeviceList () { // 渲染设备类型
        var renderDeviceListData = {
          action: 'export/device/items',
          method: 'GET',
          data: {}
        }
        this.http.post('custom/', this.parseData(renderDeviceListData)).then((res) => {
          console.log(res)
          this.deviceList = res.data.data.list
          this.deviceType = this.deviceList[0].object_id
          this.renderExportAttr()
          this.deviceList.map(item => {
            this.deviceListStructure[item.object_id] = item.pkey
          })
        })
      },

      getLocationList () {
        let postData = {
          action: '/object/location/instance/_search',
          method: 'POST',
          data: { 'query': {} }
        }
        this.http.post('easyops/', this.parseData(postData)).then((res) => {
          console.log(res)
          this.retrieveLocations = res.data.data.data.list
        })
      },

      renderFormStructure () {
        var renderFormStructureData = {
          action: `/object/attr/${this.deviceType}`,
          method: 'GET',
          data: {}
        }
        this.http.post('easyops/', this.parseData(renderFormStructureData)).then((res) => {
          console.log(res)
          res.data.data.data.map(item => {
            this.formStructure[item.id] = {}
            this.formStructure[item.id].name = item.name
            this.formStructure[item.id].type = item.value.type
          })
        })
      },

      onDeviceTypeChange () {
        this.deviceTable = []
        this.renderFormStructure()
        this.onSearchDevices()
        this.renderExportAttr()
        var searchAttrData = {
          action: 'cmdb/object/search/attr',
          method: 'GET',
          data: {
            object_id: this.deviceType
          }
        }
        this.loading = true
        this.http.post('', this.parseData(searchAttrData)).then((res) => {
          this.searchKeyList = res.data.data.attr_list
          this.searchKeyList.map(item => {
            if (item.value.type === 'FK' || item.value.type === 'FKs') {
              this.$set(this.searchKeys, item.id, [])
            } else {
              this.$set(this.searchKeys, item.id, '')
            }
          })
          this.loading = false
        })
      },

      onSearchDevices (page, isAdvance) {
        // if (!isAdvance) {
          // if (!this.searchKeys.searchKey) {
          //   this.$message.warning('请填写关键词！')
          //   return false
          // }
          // let postData = {
          //   action: 'cmdb/fulltext/search',
          //   method: 'POST',
          //   data: {
          //     object_id: this.deviceType,
          //     page: this.devicePage,
          //     pageSize: 10,
          //     keyword: this.searchKeys.searchKey
          //   }
          // }
          // this.deviceLoading = true
          // this.http.post('', this.parseData(postData)).then((res) => {
          //   processRes(res)
          // })
        // } else {}
        this.searchKeys.searchKey = ''
        let searchData = {}
        if (this.edit) {
          searchData = this.filterObj(this.searchKeys, isAdvance)
        } else {
          searchData = { status: '空闲', isapply: 'no', ...this.filterObj(this.searchKeys, isAdvance) }
        }
        let postData = {
          action: `/object/${this.deviceType}/instance/_search`,
          method: 'POST',
          data: {
            query: searchData,
            page: this.devicePage,
            pageSize: 10,
            fields: {},
            sort: {}
          }
        }
        this.deviceLoading = true
        this.http.post('easyops/', this.parseData(postData)).then((res) => {
          processRes(res)
        })

        const processRes = (res) => {
          console.log(res)
          if (!res.data.data.data.total) {
            this.$message.warning('找不到结果！')
          }
          this.deviceTotal = res.data.data.data.total
          this.deviceTable = res.data.data.data.list
          this.deviceLoading = false
        }
      },

      onDevicePageChange (val) {
        this.devicePage = val
        this.onSearchDevices(this.isAdvanceSearch)
      },

      resetForm (formName) {
        this.$refs[formName].resetFields()
      },

      onRetrieve (device) {
        for (const i in this.outstockForm) { // 清空值
          if (this.outstockForm[i]) {
            this.outstockForm[i] = ''
          }
        }
        this.retrieveViewData.visible = true
        this.retrieveViewData.device = device
      },

      onConfirmRetrieve (device, location) {
        if (!location && !this.edit) { // 以后自定义的表单自带验证，这一步不需要
          this.$message.error('请填写出库地点！')
          return
        }
        // if (!this.retrieveLocations.some(loc => loc.name === location)) { // 若地点为新增，则先进行新增请求
        //   let locPostData = {
        //     action: `/object/instance/location`,
        //     method: 'POST',
        //     data: { name: location }
        //   }
        //   this.http.post('easyops/', this.parseData(locPostData)).then((res) => {
        //     // 新增毕，方出库
        //     this._submitMethod(device, location)
        //   })
        // } else {  // 直接出库
        // }
        this._submitMethod(device, location)
      },

      _submitMethod (device, location) {
        let pkey = ''
        if (this.edit) {
          pkey = 'alter_device'
        } else {
          pkey = this.deviceListStructure[this.deviceType]
        }
        let postData = {
          action: 'runtime/process/instances',
          method: 'POST',
          data: {
            pkey: pkey,
            form: {
              'object_id': this.deviceType,
              'application': this.outstockForm.application,
              'object_list': [Object.assign({instanceId: device.instanceId}, this.outstockForm)]
            }
          }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          let notice = ''
          if (this.edit) {
            notice = `成功更改「${device.name}」`
            this.deviceViewData.visible = false
          } else {
            notice = `已成功将设备「${device.name}」出库至${location}！`
            this.retrieveViewData.visible = false
          }
          this.$notify({
            title: '成功',
            message: notice,
            type: 'success'
          })
          this.deviceViewData.location = ''
          this.onSearchDevices()
        })
      },

      onEdit (device) {
        this.deviceViewData.visible = true
        this.deviceViewData.device = device
        console.log(device)
        for (const key in this.outstockForm) {
          if (device[key]) {
            this.outstockForm[key] = device[key]
          } else {
            this.outstockForm[key] = ''
            this.outstockForm.application = this.userInfo.userName
          }
        }
        this.deviceViewData.object_id = this.deviceType
      }
    },

    components: {
      // deviceView,
      searchFormStructure,
      formStructureWithoutTitle
    }
  }
</script>
<style scoped>
  .sub-title {
    /*text-align: center;*/
    margin: 15px 0 20px;
  }
  /*.layout-center {
    display: flex;
    justify-content: center;
  }*/
</style>
