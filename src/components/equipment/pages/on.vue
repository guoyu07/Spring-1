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
          </el-form>
          
          <el-form ref="searchKeys" :model="searchKeys" label-width="100px" class="advance-search-form" :inline="true">
            <div class="form-block">
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
            <el-form-item>
              <el-button size="small" type="primary" @click="onSearchDevices(1)">精确搜索</el-button>
              <el-button size="small" type="primary" @click="onSearchDevices(1,'like')">模糊搜索</el-button>
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
              @click="onPushInQueue">加入上架队列</el-button>
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
            <el-button type="primary" class="md" @click="deployViewData.visible = true">批量编辑并上架</el-button>
          </div>
              <!-- </div> -->
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <deploy-view
      :deploy-view-data="deployViewData"
      :selected-devices="deviceQueue"></deploy-view>
  </div>
</template>

<script>
  import deployView from '../../_plugins/_deployView'

  export default {
    data () {
      return {
        loading: false,
        formStructure: {},
        deviceType: '',
        deviceList: [],
        deviceListStructure: {},
        searchKeys: {},
        searchKeyList: [],
        deviceTable: [],
        deployViewData: {
          visible: false
        },
        selectedDevices: [],
        deviceQueue: []
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
          action: `/object/attr/${this.deviceType}`,
          method: 'GET',
          data: {}
        }
        this.http.post('easyops/', this.parseData(postData)).then((res) => {
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

      onSearchDevices (page, like) {
        let searchData = this.filterObj(this.searchKeys, like)
        if (this.isEmptyObj(searchData)) {
          this.$message.info('搜索条件不能为空！')
          return false
        }
        this.deviceLoading = true
        var postData = {
          action: `/object/${this.deviceType}/instance/_search`,
          method: 'POST',
          data: {
            query: searchData,
            page: page,
            pageSize: '',
            fields: {},
            sort: {}
          }
        }
        this.http.post('easyops/', this.parseData(postData)).then((res) => {
          if (!res.data.data.data.total) {
            this.$message.warning('找不到结果！')
          }
          this.deviceTable = res.data.data.data.list
          this.deviceLoading = false
        })
      },

      onEmptySearch (formName) {
        console.log(this.$refs[formName])
        this.$refs[formName].resetFields()
      },
      // ＊＊＊＊＊上次接到这里＊＊＊＊＊

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
