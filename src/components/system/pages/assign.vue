<template>
  <div id="item1-side" class="wrapper">
    <h3 class="form-title">服务资源分配</h3>
    <el-form ref="assignForm" :model="assignForm" label-width="85px" :inline="true">
      <el-row :gutter="10">
        <el-form-item label="申请类型">
          {{ applyData.applyType }}
        </el-form-item>
        <el-form-item label="项目组">
          {{ applyData.business }}
        </el-form-item>
        <el-form-item label="应用名">
          {{ applyData.applicationName }}
        </el-form-item>
        <el-form-item label="备注">
          {{ applyData.mark }}
        </el-form-item>
      </el-row>
      <el-tabs type="card" @tab-click="handleClick">
        <el-tab-pane v-for="(data, index) in applyData.data" :label="data.environment">
          <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
            <table>
              <tr>
                <th>使用环境</th>
                <td>{{ data.environment }}</td>
                <th>OS</th>
                <td>{{ data.operateSystem }}</td>
                <th>主机</th>
                <td>{{ data.hostType }}</td>
              </tr>
              <tr>
                <th>数量</th>
                <td>{{ data.quantity }}</td>
                <th>CPU核数</th>
                <td>{{ data.cpu }}</td>
                <th>内存(G)</th>
                <td>{{ data.internalStorage }}</td>
              </tr>
              <tr>
                <th>硬盘(G)</th>
                <td>{{ data.hardDisk }}</td>
                <th>资源分数</th>
                <td>{{ data.score }}</td>
                <th>资产编号</th>
                <td>{{ data.assetNumber }}</td>
              </tr>
            </table>
            </div>
              <div class="form-block" v-if="data.hostType === '虚拟机'">
                <h5>选择虚拟机的IDC信息</h5>
                <el-form-item label="IDC" :prop="'data.' + index + '.idc'" :rules="{
                required: true, message: 'IDC不能为空', trigger: 'change'
              }">
                  <el-select v-model="assignForm.data[index].idc" placeholder="请选择IDC">
                    <el-option v-for="idc in idcList" :label="idc.name" :value="idc.name"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="IDC集群" :prop="'data.' + index + '.idcgroup'" :rules="{
                required: true, message: 'IDC集群不能为空', trigger: 'change'
              }">
                  <el-select v-model="assignForm.data[index].idcgroup" placeholder="请选择IDC集群">
                    <el-option v-for="idcgroup in idcGroupList" :label="idcgroup.name" :value="idcgroup.name"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="form-block" v-if="data.hostType === '物理机'">
                <h5>请选择要分配的物理机</h5>
                <el-form ref="searchKeys" class="advance-search-form" :model="searchKeys" label-width="100px" :inline="true">
                  <search-form-structure
                    :search-key-list="searchKeyList"
                    :search-keys="searchKeys"
                    :is-advance-search="isAdvanceSearch">
                  </search-form-structure>
                  <el-form-item label="出库状态">
                    <el-select v-model="searchKeys.status" size="small">
                      <el-option label="已出库" value="已出库"></el-option>
                      <el-option label="未出库" value="未出库"></el-option>
                    </el-select>
                  </el-form-item>
                  <br>
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
                <div class="btn-area">
                  <el-button class="md" type="info" size="small" @click="onAddtoOff">添加至服务器列表</el-button>
                </div>
                <h5>服务器列表</h5>
                <el-table
                  :data="assignForm.data[index].machines"
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
              </div>
        </el-tab-pane>
      </el-tabs>
      <el-form-item class="margin-top">
        <el-button type="primary" @click="onSubmit('assignForm')">立即分配</el-button>
        <el-button @click="resetForm('assignForm')">重置</el-button>
      </el-form-item>
    </el-form>
    </div>
</template>
<script>
import searchFormStructure from '../../_plugins/_searchFormStructure'
export default {
  data () {
    return {
      deviceType: 'chHOST',
      isAdvanceSearch: true,
      loading: false,
      id: '',
      index: 0,
      selectedDevices: [], // 选择到的服务器设备
      hostTabel: [], // 服务器列表
      deviceLoading: false,
      deviceTable: [], // 搜索出来的服务器设备列表
      devicePage: 1,
      deviceTotal: 0,
      searchKeys: {
        status: '已出库'
      },
      searchKeyList: [],
      tableLoading: false,
      idcList: [],
      idcGroupList: [],
      idc: [],
      idcgroup: [],
      applyData: {},
      assignForm: {
        data: []
      }
    }
  },
  created () {
    this.id = this.$route.query.id // 取得本实例的id
    this.renderIDCList() // 渲染 IDC 数据
    this.renderIDCGroupList() // 渲染 IDC集群 数据
    this.renderInstanceDetail() // 通过 id 渲染本实例
    this.renderSearchKeyList() // 渲染搜索表单
  },
  methods: {
    renderSearchKeyList () {
      this.loading = true
      var postData = {
        action: 'cmdb/object/search/attr',
        method: 'GET',
        data: {
          object_id: this.deviceType // 服务器的 object_id
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
      searchData.isapply = 'no' // 未被占用
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
    renderInstanceDetail () {
      let postData = {
        action: 'runtime/task',
        method: 'GET',
        data: {
          taskId: this.id
        }
      }
      this.http.post('', this.parseData(postData)).then((res) => {
        console.log(res.data.data.variables.message[0].form)
        this.applyData = res.data.data.variables.message[0].form
        const virtul = {
          idc: '',
          idcgroup: ''
        }
        const machine = {
          machines: []
        }
        this.applyData.data.forEach((item, k) => {
          if (item.hostType === '物理机') {
            this.assignForm.data.push(machine)
          } else {
            this.assignForm.data.push(virtul)
          }
        })
      })
    },
    renderIDCList () {
      const postData = {
        action: 'object/instance/list',
        method: 'GET',
        data: {
          object_id: 'APP' // 这里应该是取 IDC 列表的 object_id
          // page: "不传则获取该对象所有实例",
          // pageSize: "默认30"
        }
      }
      this.http.post('', this.parseData(postData))
      .then((res) => {
        this.idcList = res.data.data.list
      })
    },
    renderIDCGroupList () {
      const postData = {
        action: 'object/instance/list',
        method: 'GET',
        data: {
          object_id: 'APP' // 这里应该是取 IDC集群 列表的 object_id
          // page: "不传则获取该对象所有实例",
          // pageSize: "默认30"
        }
      }
      this.http.post('', this.parseData(postData))
      .then((res) => {
        this.idcGroupList = res.data.data.list
      })
    },
    onAddtoOff () {
      for (const selection of this.selectedDevices) {
        if (!this.assignForm.data[this.index].machines.includes(selection)) {
          if (this.selectedDevices.length > 5) {
            this.$message.warning('下架设备最多 5 个！')
          } else {
            this.assignForm.data[this.index].machines = [...this.assignForm.data[this.index].machines, selection]
          }
        } else {
          this.$message.warning(`下架列表中已存在${selection.name}`)
        }
      }
    },
    onRemove (row) {
      const index = this.assignForm.data[this.index].machines.indexOf(row)
      this.assignForm.data[this.index].machines.splice(index, 1)
    },
    handleClick (tab, event) {
      this.index = tab.index
      console.log(this.index)
      // console.log(tab.index, tab, event)
    },
    onSubmit (assignForm) {
      console.log(this.$refs)
      this.$refs[assignForm].validate((valid) => {
        if (valid) {
          for (const item of this.assignForm.data) { // 用 for...of 可以轻松退出循环
            if (item.machines && item.machines.length === 0) {
              this.$message.warning('未分配完啊喂！')
              return false
            }
          }
          const postData = {
            action: 'runtime/task/complete',
            method: 'POST',
            data: {
              tid: this.id,
              form: this.assignForm.data
              // pass: "流程走向控制变量,整型(可选,默认为0)"
            }
          }
          this.http.post('', this.parseData(postData))
          .then((res) => {
            this.$notify.success({
              title: '成功',
              message: '资源分配成功！'
            })
            this.$router.go(-1) // 分配成功跳转历史的上一页
          })
          console.log('submit!', this.assignForm)
        } else {
          console.log('error submit!!')
          this.$message.warning('未分配完啊喂！')
          return false
        }
      })
    },
    resetForm (formName) {
      if (formName === 'searchKeys') {
        this.$refs[formName][0].resetFields()
      } else {
        this.$refs[formName].resetFields()
      }
    },
    handleSelectionChange (val) {
      this.selectedDevices = val
    }
  },
  components: {
    searchFormStructure
  }
}
</script>
<style lang="less" scoped>
.btn-area {
  margin: 15px 0;
}
.margin-top {
  margin-top: 15px;
}

.form-block {
  h5 {
    margin: 15px 0;
  }
}

.el-select {
  width: 100%;
}

.wrapper {
  padding: 20px;
  .form-title {
    font-size: 22px;
    font-weight: 400;
    margin-top: 10px;
    margin-bottom: 40px;
    margin-left: 10px;
    color: #4e5b6d;
  }
}

.el-form--inline .el-form-item {
  min-width: 280px;
}

.el-table {
  table {
    width: 100%;
    th {
      width: 10%;
    }
    td {
      width: 20%;
    }
    th,
    td {
      padding: 5px 10px;
      word-wrap: break-word;
    }
  }
}
</style>
