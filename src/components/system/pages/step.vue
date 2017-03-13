<template>
  <div id="item1-side" class="wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3 class="form-title">{{ routerInfo.name }}</h3>
          <el-form ref="assignForm" :model="assignForm" label-width="85px" class="advance-search-form" :inline="true">
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
              <el-form-item
                v-if="routerInfo.step==='approve'"
                label=""
                prop="approve"
                style="width:1%;display:none;">
                <el-input
                  v-model="assignForm.approve">
                </el-input>
              </el-form-item>
            </el-row>
            <el-tabs type="card" @tab-click="handleClick">
              <el-tab-pane class="m-pane" v-for="(data, index) in applyData.data" :label="data.environment">
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
                    <template v-if="data.hostType === '虚拟机'">
                      <tr>
                        <template v-if="data.idc">
                          <th>IDC</th>
                          <td>{{ data.idc }}</td>
                          <th>IDC集群</th>
                          <td>{{ data.idcgroup }}</td>
                        </template>
                        <template v-if="data.ip">
                          <th>IP</th>
                          <td>{{ data.ip }}</td>
                        </template>
                      </tr>
                      <template v-if="data.setAgent">
                        <tr>
                          <th>创建虚拟机</th>
                          <td>{{ data.setVirtual ? '是' : '否' }}</td>
                          <th>配置IP</th>
                          <td>{{ data.setIP ? '是' : '否' }}</td>
                          <th>安装Agent</th>
                          <td>{{ data.setAgent ? '是' : '否' }}</td>
                        </tr>
                        <tr>
                          <th>描述文件URL</th>
                          <td colspan="5"><a :href="data.url" target="new_blank">{{ data.url }}</a></td>
                        </tr>
                      </template>
                    </template>
                  </table>
                </div>
                <div class="form-block" v-if="data.hostType === '虚拟机'">
                  <div v-if="routerInfo.step==='restart'">
                    <h5>选择虚拟机的IDC信息</h5>
                    <el-form-item label="IDC"
                      :prop="'data.' + index + '.idc'"
                      :rules="{
                        required: true, message: 'IDC不能为空', trigger: 'change'
                      }">
                      <el-select v-model="assignForm.data[index].idc" placeholder="请选择IDC">
                        <el-option v-for="idc in idcList" :label="idc.name" :value="idc.name"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="IDC集群"
                      :prop="'data.' + index + '.idcgroup'"
                      :rules="{
                        required: true, message: 'IDC集群不能为空', trigger: 'change'
                      }">
                      <el-select v-model="assignForm.data[index].idcgroup" placeholder="请选择IDC集群">
                        <el-option v-for="idcgroup in idcGroupList" :label="idcgroup.name" :value="idcgroup.name"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                  <div v-if="routerInfo.step==='assignIP'">
                    <h5>请选择IP</h5>
                    <el-form-item
                      label="IP"
                      :prop="'data.' + index + '.ip'"
                      :rules="{
                        required: true, message: 'IP不能为空', trigger: 'change'
                      }">
                      <el-select v-model="assignForm.data[index].ip" placeholder="请选择IP">
                        <el-option v-for="ip in ipList" :label="ip.name" :value="ip.name"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                  <div v-if="routerInfo.step==='createVM'">
                    <h5>安装信息</h5>
                    <el-form-item
                      label="创建虚拟机"
                      :prop="'data.' + index + '.setVirtual'">
                      <el-switch on-text="" off-text="" v-model="assignForm.data[index].setVirtual">
                      </el-switch>
                    </el-form-item>
                    <el-form-item
                      label="配置IP"
                      :prop="'data.' + index + '.setIP'">
                      <el-switch on-text="" off-text="" v-model="assignForm.data[index].setIP">
                      </el-switch>
                    </el-form-item>
                    <el-form-item
                      label="安装Agent"
                      :prop="'data.' + index + '.setAgent'">
                      <el-switch on-text="" off-text="" v-model="assignForm.data[index].setAgent">
                      </el-switch>
                    </el-form-item>
                    <el-form-item label="描述文件URL" style="width:80%;" label-width="100px">
                      <el-input v-model="assignForm.data[index].url" placeholder="http://"></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="form-block" v-if="data.hostType === '物理机'">
                  <div v-if="routerInfo.step ==='restart'">
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
                  <div v-if="routerInfo.step !=='start' && routerInfo.step !=='restart'">
                    <h5>分配的服务器列表</h5>
                    <el-table :data="data.machines" border style="width: 100%; min-width: 460px">
                      <el-table-column prop="name" label="设备"></el-table-column>
                      <el-table-column prop="it_num" label="资产编号"></el-table-column>
                      <el-table-column prop="status" label="状态"></el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
            <el-form-item>
              <div class="btn-area">
                <span v-for="action in applyData.action">
                  <el-button v-if="action.type==='submit'" type="primary" @click="onSubmit('assignForm')">{{action.name}}</el-button>
                  <el-button v-else-if="action.type==='back'" :plain="true" type="danger" @click="onReject(applyData, action)">{{action.name}}</el-button>
                </span>
              </div>
              <!-- <el-button type="primary" @click="onSubmit('assignForm')">审批</el-button>
              <el-button @click="onReject(applyData)">驳回</el-button> -->
            </el-form-item>
          </el-form>
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
      routerInfo: {},
      index: 0,
      applyData: [],
      assignForm: {
        data: []
      },
      ipList: [],
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
      deviceType: 'chHOST',
      isAdvanceSearch: true,
      idcList: [],
      idcGroupList: []
    }
  },
  created () {
    this.routerInfo = this.$route.params // 取得本实例的id及当前步骤
    this.renderInstanceDetail() // 通过 id 渲染本实例
    switch (this.routerInfo.step) {
      case 'restart':
        this.renderIDCList()
        this.renderIDCGroupList()
        this.renderSearchKeyList()
        break
      case 'assignIP':
        this.renderIPList()
        break
      case 'approve':
        this.assignForm = {'approve': '通过'}
        break
      // case 'judge':
      //   this.assignForm = {'judge': '通过'}
      //   break
      default:
        return false
    }
  },
  methods: {
    renderIPList () {
      const postData = {
        action: 'object/instance/list',
        method: 'GET',
        data: {
          object_id: 'APP' // 这里应该是取 IP 列表的 object_id
          // page: "不传则获取该对象所有实例",
          // pageSize: "默认30"
        }
      }
      this.http.post('', this.parseData(postData))
      .then((res) => {
        this.ipList = res.data.data.list
      })
    },
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
    renderInstanceDetail () {
      let postData = {
        action: 'runtime/task',
        method: 'GET',
        data: {
          taskId: this.routerInfo.id
        }
      }
      this.http.post('', this.parseData(postData)).then((res) => {
        const message = res.data.data.variables.message
        const taskKeyArr = ['restart', 'approve', 'assignIP', 'createVM']
        this.applyData = this.getTaskInfo(message, taskKeyArr)
        this.applyData.action = res.data.data.action
        this.applyData.data.forEach((item, k) => {
          if (item.hostType === '虚拟机') {
            switch (this.routerInfo.step) {
              case 'createVM':
                this.assignForm.data.push({
                  setVirtual: false,
                  setIP: false,
                  setAgent: false,
                  url: ''
                })
                break

              case 'restart':
                this.assignForm.data.push({
                  idc: '',
                  idcgroup: ''
                })
                break

              case 'assignIP':
                this.assignForm.data.push({
                  ip: ''
                })
                break

              default:
                if (this.assignForm.data) {
                  this.assignForm.data.push({})
                }
            }
          } else {
            switch (this.routerInfo.step) {
              case 'restart':
                this.assignForm.data.push({
                  machines: []
                })
                break

              default:
                if (this.assignForm.data) {
                  this.assignForm.data.push({})
                }
            }
            // this.assignForm.data.push(machineData) // 这样对应上是第几个环境才设置了IP
          }
        })
      })
    },
    handleClick (tab, event) {
      this.index = tab.index
      console.log(this.index)
    },
    onSubmit (assignForm) {
      console.log(this.assignForm)
      this.$confirm('确定通过审批?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$refs[assignForm].validate((valid) => {
          if (valid) {
            if (this.assignForm.data) {
              for (const item of this.assignForm.data) { // 用 for...of 可以轻松退出循环
                if (this.routerInfo.step === 'restart' && item.machines && item.machines.length === 0) {
                  this.$message.warning('未分配完！')
                  return false
                }
              }
            }
            const postData = {
              action: 'runtime/task/complete',
              method: 'POST',
              data: {
                tid: this.routerInfo.id,
                form: this.assignForm // 通过审批 需要判断一下登录的账号的角色身份
                  // pass: "流程走向控制变量,整型(可选,默认为0)"
              }
            }
            this.http.post('', this.parseData(postData))
              .then((res) => {
                if (res && res.status === 200) {
                  this.$message({
                    type: 'success',
                    message: '审批成功!'
                  })
                  this.$router.go(-1) // 分配成功跳转历史的上一页
                }
              })
          } else {
            console.log('error submit!!')
            this.$message.warning('未分配完！')
            return false
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消审批'
        })
      })
    },
    cancel () {
      this.$router.go(-1) // 跳转历史的上一页
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
    resetForm (formName) {
      if (formName === 'searchKeys') {
        this.$refs[formName][0].resetFields()
      } else {
        this.$refs[formName].resetFields()
      }
    },
    handleSelectionChange (val) {
      this.selectedDevices = val
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
    onReject (task, action) {
      console.log(task, action.pass)
      this.$prompt('请输入对「' + task.applicationName + '」的' + action.name + '意见：', '确定' + action.name + '？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        if (!value) {
          this.$message.error('失败：驳回意见不可留空！')
          return
        }
        let postData = {
          action: 'runtime/task/complete',
          method: 'POST',
          data: {
            tid: this.routerInfo.id,
            form: { value },
            pass: action.pass
          }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.$message.success('已驳回！')
          }
          this.$router.go(-1) // 跳转历史的上一页
        })
      })
    },
    onRemove (row) {
      const index = this.assignForm.data[this.index].machines.indexOf(row)
      this.assignForm.data[this.index].machines.splice(index, 1)
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
  .el-button {
    margin-right: 8px;
  }
}

.form-block {
  h5 {
    margin: 15px 0;
  }
}

.el-select {
  width: 100%;
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
