<template>
  <span>
    <div v-if="mainInfo.value.type === 'search_bar'" class="form-block">
      <h5>{{mainInfo.name}}</h5>
      <el-form ref="searchKeys" class="advance-search-form" :model="searchKeys" label-width="100px" :inline="true">
        <el-form-item v-for="search in searchKeyList" :label="search.name" :prop="search.id">
          <div class="form-unit">
            <el-select
              v-model="searchKeys[search.id].op"
              size="small">
              <el-option v-for="option in oplist"
                :label="option.name"
                :value="option.id">
              </el-option>
            </el-select>
            <el-input size="small" v-model="searchKeys[search.id].value"></el-input>
          </div>
        </el-form-item>
        <br>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSearchDevices()">搜索</el-button>
          <!-- <el-button size="small" @click="resetForm('searchKeys')">清空</el-button> -->
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
          width="65">
        </el-table-column>
        <el-table-column
          v-for="item in searchKeyList"
          :prop="item.id"
          :label="item.name"></el-table-column>
      </el-table>
      <div class="pagination-block clear">
        <el-pagination
          class="fr"
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="onPageChange"
          :total="deviceTotal">
        </el-pagination>
      </div>
      <div class="btn-area">
        <el-button class="md" type="info" size="small" @click="onAddtoOff">添加至设备列表</el-button>
      </div>
      <h5>设备列表</h5>
      <el-table
        :data="hostList"
        border
        style="width: 100%; min-width: 460px">
        <el-table-column
          inline-template
          :context="_self"
          label="操作"
          width="65">
          <span>
            <el-button size="mini" type="warning" @click="onRemove(row)">移除</el-button>
          </span>
        </el-table-column>

        <el-table-column
          v-for="item in searchKeyList"
          :prop="item.id"
          :label="item.name">
        </el-table-column>

      </el-table>
    </div>
  </span>
</template>

<script>
  export default {
    props: {
      index: { type: Number }, // body 的 index
      hosts: { type: Object }, // 选取设备的id
      attrList: { type: Object }, // search_bar 源数据
      limit: { type: Number } // 设备数量选择限制
    },

    data () {
      return {
        hostList: this.hosts[this.attrList.id], // ①创建 props 属性 hosts 的副本--hostList
        mainInfo: {},
        searchKeys: {},
        searchKeyList: [],
        selectedDevices: [],
        deviceTable: [],
        deviceLoading: false,
        deviceTotal: 0,
        searchData: {},
        oplist: [
          {id: 'eq', name: '等于'},
          {id: 'neq', name: '不等于'},
          {id: 'reg', name: '包含'}
        ],
        currentPage: 1,
        pageSize: 10
      }
    },
    created () {
      console.log(this.hosts)
      // for (const block of this.attrList) {
      //   for (const item of block.value) {
      this.mainInfo = this.attrList
      if (this.attrList.value.type === 'search_bar') {
        // 过滤掉 非搜索 字段
        this.searchKeyList = this.attrList.value.source.data.params.filter(item => {
          return item.value.type === 'input'
        })
        // 取搜索字段的必读字段(非输入的搜索字段)
        for (const param of this.attrList.value.source.data.params) {
          if (param.value.type === 'static') {
            this.searchData[param.id] = param.value.value
          }
        }
        // 绑定搜索字段，响应式取值
        for (const key of this.searchKeyList) {
          this.$set(this.searchKeys, key.id, {})
          this.$set(this.searchKeys[key.id], 'value', '')
          this.$set(this.searchKeys[key.id], 'op', 'reg')
        }
      }
      //   }
      // }
    },

    watch: {
      'hosts' (val) {
        this.hostList = val // ②监听外部对props属性 hosts 的变更，并同步到组件内的data属性 hostList 中
      },
      'hostList' (val) {
        this.$emit('on-hosts-change', val, this.index) // ③组件内对 hostList 变更后向外部发送事件通知
      }
    },

    methods: {
      onSearchDevices () {
        let searchData = {}
        searchData.query = Object.assign(this.searchData, this.filterObj(this.searchKeys))
        searchData.page = this.currentPage
        searchData.page_size = this.pageSize
        console.log(searchData)
        if (this.isEmptyObj(searchData.query)) {
          this.$message.info('搜索条件不能为空！')
          return false
        }
        let postData = {
          action: this.mainInfo.value.source.data.action,
          method: this.mainInfo.value.source.data.method,
          data: searchData
        }
        this.deviceLoading = false
        this.http.post(this.mainInfo.value.source.url.substring(4), this.parseData(postData)).then((res) => {
          if (!res.data.data.total) {
            this.$message.warning('找不到结果！')
          }
          // console.log(res, this.mainInfo.value.source.res.data_path)
          this.deviceTotal = res.data.data.total
          this.deviceTable = this.getPathResult(res, this.mainInfo.value.source.res.data_path)
          this.deviceLoading = false
        })
      },
      onPageChange (val) {
        this.currentPage = val
        this.onSearchDevices()
      },
      onAddtoOff () {
        if (this.selectedDevices.length) {
          for (const selection of this.selectedDevices) {
            if (!this.hostList.includes(selection)) {
              if (this.hostList.length >= this.limit) {
                this.$message.warning(`设备选择最多${this.limit}个！`)
              } else {
                this.hostList = [...this.hostList, selection]
              }
            }
          }
        } else {
          this.$message.warning('请选择数据')
        }
      },
      handleSelectionChange (val) {
        this.selectedDevices = val
        console.log(this.selectedDevices, val)
      },
      onRemove (row) {
        const index = this.hostList.indexOf(row)
        this.hostList.splice(index, 1)
      },
      resetForm (formName) {
        console.log(this.$refs)
        this.$refs[formName].resetFields()
      }
    },
    components: {
    }
  }
</script>
