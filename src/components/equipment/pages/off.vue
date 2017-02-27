<template>
  <div class="offshelf">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3>下架流程</h3>
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
        deviceType: 'server',
        searchKeys: [],
        deviceLoading: false,
        deviceTable: [],
        deviceList: [],
        multipleSelection: [],
        offTabel: []
      }
    },
    created () {
      this.onDeviceTypeChange()
      this.renderDeviceList()
      // this.renderFormStructure()
    },
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
      onDeviceTypeChange () {
        this.$http.get(`/searchKeys/${this.deviceType}`).then((res) => {
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
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      onEmptySearch () {
        for (let key of this.searchKeys) {
          key.value = ''
        }
      },
      onAddtoOff () {
        for (const selection of this.multipleSelection) {
          if (!this.offTabel.includes(selection)) {
            if (this.multipleSelection.length > 5) {
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
        this.offTabel = []
        this.deviceTable = []
        this.$message.success('成功上架')
        console.log(this.offTabel)
      },
      onReject () {
        this.offTabel = []
        this.$message.success('成功驳回')
        console.log(this.offTabel)
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
