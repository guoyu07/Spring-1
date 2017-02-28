<template>
  <div class="offshelf">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card
        class="box-card"
        v-loading.fullscreen.lock="loading"
        element-loading-text="拼命加载中">
          <h3>下架流程</h3>
          <el-form ref="offForm" label-width="100px">
            <el-form-item label="设备类型">
              <el-radio-group v-model="deviceType">
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
            @selection-change="handleSelectionChange"
            style="width: 100%; min-width: 460px">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="name"
              label="设备"></el-table-column>
            <el-table-column
              prop="number"
              label="编号"></el-table-column>
            <el-table-column
              prop="other"
              label="其他"></el-table-column>
            <!-- <el-table-column
              inline-template
              :context="_self"
              label="操作">
              <span>
                <el-button type="text" @click="onDeploy(row)">下架</el-button>
              </span>
            </el-table-column> -->
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
          <div class="btn-area" style="margin: 15px 0">
            <el-button class="md" type="info" size="small" @click="onAddtoOff">添加至下架</el-button>
          </div>
          <h5>下架列表</h5>
          <el-table
            :data="offTabel"
            border
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
                <el-button size="small" type="warning" @click="onRemove(row)">移除</el-button>
              </span>
            </el-table-column>
          </el-table>
          <div class="btn-area" style="margin: 25px 0 12px">
            <el-button class="md" type="primary" @click="onConfirmOff">确认下架</el-button>
            <!-- <el-button @click="onReject">驳回</el-button> -->
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loading: false,
        isAdvanceSearch: false,
        deviceType: '',
        searchKey: '',
        searchKeys: {},
        searchKeyList: [],
        deviceLoading: false,
        deviceListStructure: {},
        deviceTable: [],
        deviceList: [],
        devicePage: 1,
        deviceTotal: 0,
        selectedDevices: [],
        offTabel: []
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
      onDeviceTypeChange () {
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
            if (!res.data.data.data.total) {
              this.$message.warning('找不到结果！')
            }
            this.deviceTotal = res.data.data.data.total
            this.deviceTable = res.data.data.data.list
            this.deviceLoading = false
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
            if (!res.data.data.data.total) {
              this.$message.warning('找不到结果！')
            }
            this.deviceTotal = res.data.data.data.total
            this.deviceTable = res.data.data.data.list
            this.deviceLoading = false
          })
        }
      },
      handleSelectionChange (val) {
        this.selectedDevices = val
      },
      onDevicePageChange (val) {
        this.devicePage = val
        this.onSearchDevices(this.isAdvanceSearch)
      },
      onEmptySearch () {
        for (let key of this.searchKeys) {
          key.value = ''
        }
      },
      onAddtoOff () {
        for (const selection of this.selectedDevices) {
          if (!this.offTabel.includes(selection)) {
            if (this.selectedDevices.length > 5) {
              this.$message.warning('下架设备最多 5 个！')
            } else {
              this.offTabel = [...this.offTabel, selection]
            }
          }
          // else {
          //   this.$message.warning(`下架列表中已存在${selection.name}`)
          // }
        }
      },
      onRemove (row) {
        const index = this.offTabel.indexOf(row)
        this.offTabel.splice(index, 1)
      },
      onConfirmOff () {
        const deviceIds = []
        this.offTabel.forEach((v, k) => {
          deviceIds[k] = {}
          deviceIds[k].instanceId = v.instanceId
        })
        const postData = {
          action: 'runtime/process/instances',
          method: 'POST',
          data: {
            pkey: this.deviceListStructure[this.deviceType],
            form: {
              'object_id': this.deviceType,
              'object_list': deviceIds
            }
          }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          this.$notify({
            title: '成功',
            message: `已成功下架`,
            type: 'success'
          })
          this.deviceTable = [] // 清空设备列表
          this.offTabel = [] // 清空下架列表
        })
      },
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      }
    },
    watch: {
      deviceType: function () {
        this.onDeviceTypeChange()
      }
    }
  }
</script>
