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
            <!-- <el-form-item label="精确搜索">
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
              <el-button size="small" :type="isAdvanceSearch ? 'success' : 'primary'" @click="onSearchDevices(isAdvanceSearch)">{{ isAdvanceSearch ? '高级搜索' : '搜索' }}</el-button>
              <el-button size="small" @click="resetForm('searchKeys')">清空</el-button>
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
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import searchFormStructure from '../../_plugins/_searchFormStructure'
  export default {
    data () {
      return {
        loading: false,
        isAdvanceSearch: true,
        deviceType: '',
        searchKeyList: [],
        deviceLoading: false,
        deviceListStructure: {},
        deviceTable: [],
        deviceList: [],
        devicePage: 1,
        deviceTotal: 0,
        selectedDevices: [],
        offTabel: [],
        searchKeys: {
          searchKey: ''
        }
      }
    },
    created () {
      this.renderDeviceList()
    },
    methods: {
      renderDeviceList () {
        let postData = {
          action: 'off/device/items',
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
        this.deviceTable = [] // 清空设备列表
        this.offTabel = [] // 清空下架列表
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
        // if (!isAdvance) {
        //   if (!this.searchKeys.searchKey) {
        //     this.$message.warning('请填写关键词！')
        //     return false
        //   }
        //   let postData = {
        //     action: 'cmdb/fulltext/search',
        //     method: 'POST',
        //     data: {
        //       object_id: this.deviceType,
        //       page: this.devicePage,
        //       pageSize: 10,
        //       keyword: this.searchKeys.searchKey
        //     }
        //   }
        //   this.deviceLoading = true
        //   this.http.post('', this.parseData(postData)).then((res) => {
        //     if (!res.data.data.data.total) {
        //       this.$message.warning('找不到结果！')
        //     }
        //     this.deviceTotal = res.data.data.data.total
        //     this.deviceTable = res.data.data.data.list
        //     this.deviceLoading = false
        //   })
        // } else {
        this.searchKeys.searchKey = ''
        let searchData = this.filterObj(this.searchKeys, isAdvance)
        if (this.isEmptyObj(searchData)) {
          this.$message.info('搜索条件不能为空！')
          return false
        }
        searchData.status = '使用中'
        searchData.isapply = 'no'
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
        // }
      },
      handleSelectionChange (val) {
        this.selectedDevices = val
      },
      onDevicePageChange (val) {
        this.devicePage = val
        this.onSearchDevices(this.isAdvanceSearch)
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      onAddtoOff () {
        for (const selection of this.selectedDevices) {
          if (!this.offTabel.includes(selection)) {
            if (this.selectedDevices.length > 5) {
              this.$message.warning('下架设备最多 5 个！')
            } else {
              this.offTabel = [...this.offTabel, selection]
            }
          } else {
            this.$message.warning(`下架列表中已存在${selection.name}`)
          }
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
        this.http.post('', this.parseData(postData)).then(res => {
          if ((res && res.status === 200) || (res && res.status === 201)) {
            this.$notify({
              title: '成功',
              message: `已成功下架`,
              type: 'success'
            })
            this.deviceTable = [] // 清空设备列表
            this.offTabel = [] // 清空下架列表
          }
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
    },
    components: {
      searchFormStructure
    }
  }
</script>
