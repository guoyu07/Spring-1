<template>
  <div class="outstock">
    <el-row>
      <el-col :sm="24" :md="24" :lg="24">
        <el-card
          class="box-card"
          v-loading.fullscreen.lock="loading"
          element-loading-text="拼命加载中">
          <h3><i class="el-icon-fa-sign-out"></i> 出库流程</h3>
          <el-form ref="onForm" label-width="100px">
            <el-form-item label="设备类型">
              <el-radio-group v-model="deviceType" @change="onDeviceTypeChange">
                <el-radio v-for="device in deviceList" :label="device.object_id">{{device.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>

          <el-form ref="searchKeys" :model="searchKeys" label-width="100px" class="advance-search-form" :inline="true">
            <div class="form-block" :class="{ expand: !isAdvanceSearch }">
              <el-form-item label="关键词">
                <el-input
                  v-model="searchKey"
                  size="small"></el-input>
              </el-form-item>
            </div>
            <div class="form-block" :class="{ expand: isAdvanceSearch }">
              <el-form-item v-for="formItem in searchKeyList" :label="formItem.name">
                <!-- <el-input v-model="searchKeys[key.id]" size="small"></el-input> -->
                <el-input
                  v-if="formItem.value.type === 'str'"
                  :prop="formItem.id"
                  v-model="searchKeys[formItem.id]"
                  size="small">
                </el-input>

                <el-input
                  v-else-if="formItem.value.type === 'int'"
                  :prop="formItem.id"
                  v-model="searchKeys[formItem.id]"
                  type="number"
                  size="small">
                </el-input>

                <el-select
                  v-else-if="formItem.value.type === 'enum'"
                  :prop="formItem.id"
                  v-model="searchKeys[formItem.id]"
                  size="small">
                  <el-option v-for="option in formItem.value.regex"
                    :label="option"
                    :value="option"></el-option>
                </el-select>

                <div class="form-unit"
                  v-else-if="formItem.value.type === 'FK' || formItem.value.type === 'FKs'"
                  :prop="formItem.id">
                  <el-select
                    v-model="searchKeys[formItem.id][0]"
                    size="small">
                    <el-option v-for="option in formItem.value.external"
                      :label="option.name"
                      :value="option.org_attr"></el-option>
                  </el-select>
                  <el-input
                    :disabled="!searchKeys[formItem.id][0]"
                    v-model="searchKeys[formItem.id][1]"
                    size="small">
                  </el-input>
                </div>

                <el-date-picker
                  v-else="formItem.value.type === 'datetime' || formItem.value.type === 'date'"
                  :prop="formItem.id"
                  v-model="searchKeys[formItem.id]"
                  :type="formItem.value.type === 'datetime' ? 'datetime' : 'date'"
                  placeholder="选择时间"
                  size="small">
                </el-date-picker>
              </el-form-item>
            </div>

            <el-form-item label="模糊搜索">
              <el-switch
                v-model="isAdvanceSearch"
                on-text="开启"
                on-color="#42d885"
                off-text="关闭"></el-switch>
            </el-form-item>
            <br>
            <el-form-item>
              <el-button size="small" :type="!isAdvanceSearch ? 'primary' : 'success'" @click="onSearchDevices(1, isAdvanceSearch)">{{ !isAdvanceSearch ? '精确搜索' : '模糊搜索' }}</el-button>
              <el-button size="small" @click="onEmptySearch('searchKeys')">清空</el-button>
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
      size="small"
      :modal="true">
      <!-- <table class="device-data-table">
        <tbody>
          <tr v-for="(value, key) in retrieveViewData.device" v-if="formStructure[key]">
            <td><b>{{ formStructure[key] }}</b></td>
            <td>{{value}}</td>
          </tr>
        </tbody>
      </table> -->
      <ul class="device-data-list">
        <li v-for="(value, key) in retrieveViewData.device" v-if="formStructure[key]">
          <div v-if="formStructure[key].type === 'FK' || formStructure[key].type === 'FKs' || formStructure[key].type === 'arr'">
            <b>{{ formStructure[key].name }}</b><span v-for="option in value">{{option.name}}</span>
          </div>
          <div v-else>
            <b>{{ formStructure[key].name }}</b>{{value}}
          </div>
        </li>
      </ul>
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
        loading: false,
        isAdvanceSearch: false,
        formStructure: {},
        deviceType: '',
        deviceLoading: false,
        deviceList: [],
        deviceListStructure: {},
        searchKey: '',
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
      // this.renderFormStructure()
    },

    // watch: {
    //   deviceType () {
    //     this.renderFormStructure()
    //   }
    // },

    methods: {
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
          this.deviceList.map(item => {
            this.deviceListStructure[item.object_id] = item.pkey
          })
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
        this.renderFormStructure()
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
        if (!isAdvance) {
          if (!this.searchKey) {
            this.$message.warning('请填写关键词！')
            return false
          }
          let postData = {
            action: 'cmdb/fulltext/search',
            method: 'POST',
            data: {
              object_id: this.deviceType,
              page: page,
              keyword: this.searchKey
            }
          }
          this.deviceLoading = true
          this.http.post('', this.parseData(postData)).then((res) => {
            processRes(res)
          })
        } else {
          let searchData = this.filterObj(this.searchKeys, isAdvance)
          if (this.isEmptyObj(searchData)) {
            this.$message.info('搜索条件不能为空！')
            return false
          }
          let postData = {
            action: `/object/${this.deviceType}/instance/_search`,
            method: 'POST',
            data: {
              query: searchData,
              page: page,
              fields: {},
              sort: {}
            }
          }
          this.deviceLoading = true
          this.http.post('easyops/', this.parseData(postData)).then((res) => {
            processRes(res)
          })
        }

        const processRes = (res) => {
          console.log(res)
          if (!res.data.data.data.total) {
            this.$message.warning('找不到结果！')
          }
          this.deviceTable = res.data.data.data.list
          this.deviceLoading = false
        }
      },

      onEmptySearch (formName) {
        console.log(this.$refs[formName])
        this.$refs[formName].resetFields()
      },

      onRetrieve (device) {
        console.log(this.formStructure)
        // this.renderFormStructure()
        this.retrieveViewData.visible = true
        this.retrieveViewData.device = device
      },

      onConfirmRetrieve (device, location) {
        if (!location) {
          this.$message.error('请填写出库地点！')
          return
        }
        const postData = {
          action: 'runtime/process/instances',
          method: 'POST',
          data: {
            pkey: this.deviceListStructure[this.deviceType],
            form: {
              'object_id': this.deviceType,
              'object_list': [{
                instanceId: device.instanceId,
                location: location
              }]
            }
          }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          this.$notify({
            title: '成功',
            message: `已成功将设备「${device.name}」出库至${location}！`,
            type: 'success'
          })
          this.retrieveViewData.visible = false
          this.deviceViewData.location = ''
        })
      },

      onEdit (device) {
        this.deviceViewData.visible = true
        this.deviceViewData.device = device
        this.deviceViewData.object_id = this.deviceType
      }
    },

    components: {
      deviceView
    }
  }
</script>
