<template>
  <el-form-item
    :prop="header ? 'header.' + attrList.id : 'body.' + index + '.' + attrList.id"
    :rules="rules(attrList)"
    label=""
    class="searchBar">
    <div v-if="mainInfo.value.type === 'search_bar'" class="form-block">
      <h5>{{mainInfo.name}}</h5>
      <!-- <el-form ref="searchKeys" class="advance-search-form" :model="searchKeys" label-width="100px" :inline="true"> -->
        <!-- <el-form-item v-for="search in searchKeyList" :key="search.id" :label="search.name" :prop="search.id"> -->
        <div class="advance-search-form">
          <div class="form-unit" v-for="search in searchKeyList" :key="search.id">
            <span class="form-unit__label">{{search.name}}</span>
            <el-select
              v-model="searchKeys[search.id].op"
              size="small">
              <el-option v-for="option in oplist"
                :key="option.id"
                :label="option.name"
                :value="option.id">
              </el-option>
            </el-select>
            <el-input size="small" v-model="searchKeys[search.id].value" @keyup.enter.native="onSearchDevices()"></el-input>
          </div>
          <br>
        <!-- </el-form-item> -->
        <!-- <el-form-item> -->
          <el-button size="small" type="primary" @click="onSearchDevices()" icon="search">搜索</el-button>
          <!-- <el-button size="small" @click="resetForm('searchKeys')">清空</el-button> -->
        <!-- </el-form-item> -->
      <!-- </el-form> -->
      </div>
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
          :key="item.id"
          :prop="item.id"
          :label="item.name"></el-table-column>
      </el-table>
      <div class="pagination-block clear">
        <el-pagination
          class="fr"
          layout="total, prev, pager, next"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="onPageChange"
          :total="deviceTotal">
        </el-pagination>
      </div>
      <div class="btn-area">
        <el-button class="md" type="primary" size="small" @click="onAddtoOff" :disabled="!selectedDevices.length" icon="fa-download">添加至{{mainInfo.name}}列表</el-button>
      </div>
      <h5>{{mainInfo.name}}列表 ({{hostList.length}})</h5>
      <el-table
        :data="hostList"
        border
        class="search-bar"
        style="width: 100%; min-width: 460px">
        <el-table-column
          inline-template
          :context="_self"
          label="操作"
          width="65">
          <span>
            <el-button size="mini" type="text" icon="fa-times" @click="onRemove(row)">移除</el-button>
          </span>
        </el-table-column>

        <el-table-column
          v-for="item in searchKeyList"
          :key="item.id"
          :prop="item.id"
          :label="item.name">
        </el-table-column>

      </el-table>
    </div>
  </el-form-item>
</template>

<script>
  export default {
    props: {
      index: { type: Number }, // body 的 index
      header: { type: Boolean },
      hosts: { type: Object }, // 选取设备的id
      attrList: { type: Object }, // search_bar 源数据
      postForm: { type: Object }, // 提交的数据
      limit: { type: Object }, // 设备数量选择限制
      message: { type: Object } // 历史信息
    },

    data () {
      return {
        hostList: [], // ①创建 props 属性 hosts 的副本--hostList   this.hosts[this.attrList.id]
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
      if (this.hosts[this.attrList.id] && this.hosts[this.attrList.id].length) {
        this.hostList = this.hosts[this.attrList.id]
      }
      if (this.attrList.show && this.attrList.show.type) {
        if (this.attrList.show.type === 'form_header') {
          this.hostList = []
        }
      }
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
            this.searchData[param.id] = {}
            this.searchData[param.id].value = param.value.value
            this.searchData[param.id].op = param.op
          }
        }
        // 绑定搜索字段，响应式取值
        for (const key of this.searchKeyList) {
          this.$set(this.searchKeys, key.id, {})
          this.$set(this.searchKeys[key.id], 'value', '')
          this.$set(this.searchKeys[key.id], 'op', 'reg') // 默认为包含
          if (key.default.type === 'get') {
            this.searchKeys[key.id].value = this.$route.query[key.default.id] || ''
          } else if (key.default.type === 'static') {
            this.searchKeys[key.id].value = key.default.value
          } else if (key.default.type === 'form_header') {
            this.searchKeys[key.id].value = this.getPathResult(this.postForm.header, key.default.key_path) ? this.getPathResult(this.postForm.header, key.default.key_path) : ''
            this.$watch('postForm.header', (newVal, oldVal) => {
              this.searchKeys[key.id].value = this.getPathResult(newVal, key.default.key_path) ? this.getPathResult(newVal, key.default.key_path) : ''
              this.onSearchDevices()
            }, { deep: true })
          } else if (key.default.type === 'message_header') {
            this.searchKeys[key.id].value = this.getPathResult(this.message.header, key.default.key_path)
          }
        }
        // 一开始先渲染所有的数据回来
        this.onSearchDevices()
      }
      //   }
      // }
    },

    watch: {
      'hosts': 'renderHostList', // ②监听外部对props属性 hosts 的变更，并同步到组件内的data属性 hostList 中  val
      'hostList' (val) {
        this.$emit('on-hosts-change', val, this.index, this.mainInfo.id, this.header) // ③组件内对 hostList 变更后向外部发送事件通知
      }
    },

    methods: {
      rules (formItem) {
        var validateSearchBar = (rule, value, cb) => {
          if (value.length === 0 && this.limit.min && this.limit.min !== 0) {
            return cb(new Error(`${this.mainInfo.name}不能为空`))
          } else if (this.limit && this.limit.min && (value.length < this.limit.min)) {
            return cb(new Error(`需要${this.limit.min}个${this.mainInfo.name},还差${this.limit.min - value.length}个`))
          } else if (this.limit && this.limit.max && (value.length > this.limit.max)) {
            return cb(new Error(`至多可以增加${this.limit.max}个${this.mainInfo.name},请删除${value.length - this.limit.max}个`))
          } else if (this.limit && !this.limit.max && (value.length > this.limit.min)) {
            return cb(new Error(`至多可以增加${this.limit.min}个${this.mainInfo.name},请删除${value.length - this.limit.min}个`))
          } else {
            cb()
          }
        }
        return {
          validator: validateSearchBar,
          required: formItem.required,
          trigger: 'change'
        }
      },
      renderHostList (newVal, oldVal) {
        console.log(newVal)
        // this.hostList = []
      },
      onSearchDevices () {
        let searchData = {}
        searchData.query = Object.assign({}, this.searchData, this.filterObj(this.searchKeys))
        searchData.page = this.currentPage
        searchData.page_size = this.pageSize
        if (this.isEmptyObj(searchData.query)) {
          this.$message.info('搜索条件不能为空！')
          return false
        }
        this.renderData(searchData)
      },
      renderData (searchData) {
        let postData = {
          action: this.mainInfo.value.source.data.action,
          method: this.mainInfo.value.source.data.method,
          data: searchData || {}
        }
        this.deviceLoading = true
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
        // const value = this.selectedDevices
        if (this.selectedDevices.length) {
          for (const selection of this.selectedDevices) {
            // if (!this.hostList.includes(selection)) {
            const inclu = this.hostList.find(list => { return list.instanceId === selection.instanceId })
            if (!inclu) {
              // if (this.limit.max) { // static时，有一个范围值
              //   if (value.length < this.limit.min) {
              //     this.$message.error(`至少需要${this.limit.min}个${this.mainInfo.name},还差${this.limit.min - value.length}个`)
              //     return false
              //   } else if (value.length > this.limit.max) {
              //     this.$message.error(`至多可以增加${this.limit.max}个${this.mainInfo.name},请删除${value.length - this.limit.max}个`)
              //     return false
              //   }
              // } else { // 除static外，其他都是一个固定的数值，不准多不准少
              //   const Dvalue = this.limit.min - this.hostList.length
              //   if (value.length < Dvalue) {
              //     this.$message.error(`需要${Dvalue}个${this.mainInfo.name},还差${Dvalue - value.length}个`)
              //     return false
              //   } else if (value.length > Dvalue) {
              //     this.$message.error(`只需要${Dvalue}个${this.mainInfo.name},请删除${value.length - Dvalue}个`)
              //     return false
              //   }
              // }
              this.hostList = [...this.hostList, selection]
            } else {
              this.$message.info(`列表中已存在该数据`)
            }
          }
        } else {
          this.$message.warning('请选择数据')
        }
      },
      handleSelectionChange (val) {
        this.selectedDevices = val
        // console.log(this.selectedDevices, val)
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
