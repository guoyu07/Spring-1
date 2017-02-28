<template>
  <div class="onshelf">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card
          class="box-card step-card"
          v-loading.fullscreen.lock="loading"
          element-loading-text="拼命加载中">
          <h3><i class="el-icon-fa-upload"></i> 上架流程</h3>
          <el-form ref="onForm" label-width="100px">
            <el-form-item label="设备类型">
              <el-radio-group v-model="deviceType" @change="onDeviceTypeChange">
                <el-radio v-for="device in deviceList" :label="device.object_id">{{device.name}}</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="模糊搜索">
              <el-switch
                v-model="isAdvanceSearch"
                on-text="开启"
                on-color="#42d885"
                off-text="关闭"></el-switch>
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
              <el-form-item v-for="key in searchKeyList" :label="key.name">
                <el-input
                  v-if="key.value.type === 'str'"
                  :prop="key.id"
                  v-model="searchKeys[key.id]"
                  size="small">
                </el-input>

                <el-input
                  v-else-if="key.value.type === 'int'"
                  :prop="key.id"
                  v-model="searchKeys[key.id]"
                  type="number"
                  size="small">
                </el-input>

                <el-select
                  v-else-if="key.value.type === 'enum'"
                  :prop="key.id"
                  v-model="searchKeys[key.id]"
                  size="small">
                  <el-option v-for="option in key.value.regex"
                    :label="option"
                    :value="option"></el-option>
                </el-select>

                <div class="form-unit"
                  v-else-if="key.value.type === 'FK' || key.value.type === 'FKs'"
                  :prop="key.id">
                  <el-select
                    v-model="searchKeys[key.id][0]"
                    size="small">
                    <el-option v-for="option in key.value.external"
                      :label="option.name"
                      :value="option.org_attr"></el-option>
                  </el-select>
                  <el-input
                    :disabled="!searchKeys[key.id][0]"
                    v-model="searchKeys[key.id][1]"
                    size="small">
                  </el-input>
                </div>

                <el-date-picker
                  v-else="key.value.type === 'datetime' || key.value.type === 'date'"
                  :prop="key.id"
                  v-model="searchKeys[key.id]"
                  :type="key.value.type === 'datetime' ? 'datetime' : 'date'"
                  placeholder="选择时间"
                  size="small">
                </el-date-picker>
              </el-form-item>
            </div>
            <br>
            <el-form-item>
              <el-button size="small" :type="!isAdvanceSearch ? 'primary' : 'success'" @click="onSearchDevices(isAdvanceSearch)">{{ !isAdvanceSearch ? '搜索' : '高级搜索' }}</el-button>
              <el-button size="small" @click="onEmptySearch('searchKeys')">清空</el-button>
            </el-form-item>
          </el-form>

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
              prop="creator"
              label="创建者"></el-table-column>
            <el-table-column
              prop="ctime"
              label="创建时间"></el-table-column>
          </el-table>
          <div class="pagination-block clear">
            <el-pagination
              class="fr"
              layout="prev, pager, next"
              :current-page="devicePage"
              :page-size="10"
              @current-change="onDevicePageChange"
              :total="deviceTotal">
            </el-pagination>
          </div>
          <div class="btn-area">
            <el-button
              type="primary"
              size="small"
              class="md"
              :disabled="!selectedDevices.length"
              @click="onPushInQueue">加入上架队列</el-button>
          </div>
              <!-- </div> -->
              <!-- <div class="step step-3" v-show="deployStep === 3"> -->
          <h5>上架列表</h5>
          <el-table
            :data="deviceQueue"
            border>
            <el-table-column
              prop="name"
              label="设备"
              width="120"
              fixed></el-table-column>
            <el-table-column
              prop="creator"
              label="创建者"></el-table-column>
            <el-table-column
              prop="ctime"
              label="创建时间"></el-table-column>
            <el-table-column
              prop="service"
              label="业务系统"></el-table-column>
            <el-table-column
              prop="sn"
              label="SN"></el-table-column>
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
            <el-button type="primary" class="md" @click="bulkEditSheve">批量编辑并上架</el-button>
          </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      title="填写上架信息"
      v-model="deployViewData.visible"
      top="10%"
      :modal="true">
      <el-form label-position="top" :inline="true" ref="onShelveForm" :model="onShelveForm">
        <el-tabs type="border-card">
          <el-tab-pane  v-for="(item, index) in onShelveForm.data" :key="item.id" :label="item.name">
            <div class="form-block" v-for="formItem in formStructure">
              <el-form-item
                :prop="'data.' + index + '.' + formItem.id"
                :label="formItem.name"
                :rules="{
                  type: (formItem.value.type === 'arr' || formItem.value.type === 'FKs') ? 'array' : (formItem.value.type === 'int' ? 'number' : ((formItem.value.type === 'datetime' || formItem.value.type === 'date') ? 'date' : 'string')), required: formItem.required === 'true', message: formItem.name + '不能为空', trigger: 'blur, change'
                }">
                <el-input
                  v-if="formItem.value.type === 'str'"
                  v-model="item[formItem.id]">
                </el-input>

                <el-input-number
                  v-else-if="formItem.value.type === 'int'"
                  v-model="item[formItem.id]" :min="0">
                </el-input-number>

                <el-select
                  v-else-if="formItem.value.type === 'enum'"
                  v-model="item[formItem.id]"
                  readonly="false">
                  <el-option v-for="option in formItem.value.regex"
                    :label="option"
                    :value="option"></el-option>
                </el-select>

                <el-select
                  v-else-if="formItem.value.type === 'FK' || formItem.value.type === 'FKs'"
                  v-model="item[formItem.id]"
                  :multiple="formItem.value.type === 'FKs'">
                  <el-option v-for="option in formItem.value.object_list"
                    :label="option.name"
                    :value="option.instanceId"></el-option>
                </el-select>

                <el-select
                  v-else-if="formItem.value.type === 'arr'"
                  v-model="item[formItem.id]"
                  multiple
                  filterable=""
                  allow-create>
                  <el-option value="">请创建</el-option>
                </el-select>

                <el-date-picker
                  v-else="formItem.value.type === 'datetime' || formItem.value.type === 'date'"
                  v-model="item[formItem.id]"
                  :type="formItem.value.type === 'datetime' ? 'datetime' : 'date'"
                  placeholder="选择时间">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deployViewData.visible = false">取 消</el-button>
        <el-button type="primary" @click="onConfirm('onShelveForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loading: false,
        isAdvanceSearch: false,
        formStructure: [],
        deviceType: '',
        deviceList: [],
        deviceLoading: false,
        deviceListStructure: {},
        searchKey: '',
        searchKeys: {},
        searchKeyList: [],
        deviceTable: [],
        devicePage: 1,
        deviceTotal: 0,
        deployViewData: {
          visible: false
        },
        selectedDevices: [],
        deviceQueue: [],
        onShelveForm: {
          data: []
        }
      }
    },

    created () {
      this.renderDeviceList()
    },

    methods: {
      renderDeviceList () {
        let postData = {
          action: 'export/device/items',
          method: 'GET',
          data: {}
        }
        this.http.post('custom/', this.parseData(postData)).then((res) => {
          console.log(res)
          this.deviceList = res.data.data.list
          this.deviceType = this.deviceList[0].object_id
          this.deviceList.map(item => {
            this.deviceListStructure[item.object_id] = item.pkey
          })
        })
      },

      renderFormStructure () {
        let postData = {
          action: `cmdb/object/on/attr`,
          method: 'GET',
          data: { object_id: this.deviceType }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          console.log(res)
          this.formStructure = res.data.data.attr_list
        })
      },

      onDeviceTypeChange () {
        this.deviceTable = []
        this.renderFormStructure()
        var postData = {
          action: 'cmdb/object/search/attr',
          method: 'GET',
          data: {
            object_id: this.deviceType
          }
        }
        this.loading = true
        this.http.post('', this.parseData(postData)).then((res) => {
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

      onSearchDevices (isAdvance) {
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
              page: this.devicePage,
              pageSize: 10,
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
        }

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

      onEmptySearch (formName) {
        console.log(this.$refs[formName])
        this.$refs[formName].resetFields()
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
              this.deviceQueue.forEach((v, k) => {
                this.onShelveForm.data[k] = {}
                this.$set(this.onShelveForm.data[k], 'name', v.name)
                this.$set(this.onShelveForm.data[k], 'instanceId', v.instanceId)
                this.formStructure.map(item => {
                  if (item.value.type === 'arr' || item.value.type === 'FKs') {
                    this.$set(this.onShelveForm.data[k], item.id, [])
                  } else if (item.value.type === 'int') {
                    this.$set(this.onShelveForm.data[k], item.id, 0)
                  } else if (item.value.type === 'date' || item.value.type === 'datetime') {
                    this.$set(this.onShelveForm.data[k], item.id, undefined)
                  } else {
                    this.$set(this.onShelveForm.data[k], item.id, '')
                  }
                })
              })
            }
          }
        }
      },

      bulkEditSheve () {
        this.deployViewData.visible = true
      },

      onConfirm (formName) {
        this.deployViewData.visible = false
        console.log(formName)
      },

      onRemove (device) {
        const index = this.deviceQueue.indexOf(device)
        this.deviceQueue.splice(index, 1)
      }
    }
  }
</script>
