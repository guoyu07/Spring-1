<template>
  <div id="item1-side" class="wrapper">
    <h3 class="form-title">{{ routerInfo.name }}</h3>
    <el-form ref="assignForm" :model="assignForm" label-width="85px" :inline="true">
      <el-form-item
        v-if="routerInfo.step==='approve'"
        label=""
        prop="approve"
        style="width:1%;display:none;">
        <el-input
          v-model="assignForm.approve">
        </el-input>
      </el-form-item>
      <el-tabs type="card" @tab-click="handleClick">
        <el-tab-pane class="m-pane" v-for="(data, index) in applyData.data" :label="data.name">
          <el-form :inline="true" label-position="left" label-width="100px">
            <el-form-item v-for="formstru in formStructure" :label="formstru.name">
              {{data[formstru.id]}}
            </el-form-item>
            <el-form-item label="IP">
              {{data.ip?data.ip:'未分配'}}
            </el-form-item>
            <el-form-item label="端口">
              <span v-if="data.ports" v-for="port in data.ports" style="margin-right:5px;">{{port}}</span>
              <span v-else>未分配</span>
            </el-form-item>
            <el-form-item label="机房">
              {{data.engineRoom?data.engineRoom:'未分配'}}
            </el-form-item>
            <el-form-item label="机柜">
              {{data.cabinet?data.cabinet:'未分配'}}
            </el-form-item>
            <el-form-item label="运维主管审批">
              {{data.approve?data.approve:'未审批'}}
            </el-form-item>
            <el-form-item v-if="data.netline" label="网线连接">
              {{data.netline?'已安装':'未安装'}}
            </el-form-item>
            <el-form-item label="挂牌与搬迁">
              {{data.move?'已完成':'未完成'}}
            </el-form-item>
            <el-form-item v-if="data.osip" label="安装OS及配置IP">
              {{data.osip?'已完成':'未完成'}}
            </el-form-item>
            <el-form-item v-if="data.agent" label="安装Agent">
              {{data.agent?'已完成':'未完成'}}
            </el-form-item>
            <el-form-item v-if="data.database_info && data.dba" label="DBA安装数据库">
              {{data.dba?'已完成':'未完成'}}
            </el-form-item>
          </el-form>
          <h5>填写信息</h5>
          <div v-if="routerInfo.step==='ipinfo'">
            <el-form-item label="IP"
              :prop="'data.' + index + '.ip'"
              :rules="{
                required: true, validator: validateIP, trigger: 'blur'
              }">
              <el-input v-model="assignForm.data[index].ip" placeholder="请填写IP"></el-input>
            </el-form-item>
            <el-form-item label="端口"
              :prop="'data.' + index + '.ports'"
              :rules="{
                required: true, message: '端口号不能为空', trigger: 'blur, change', type: 'array'
              }">
              <el-select
                v-model="assignForm.data[index].ports"
                multiple
                filterable
                allow-create
                placeholder="请填写端口号">
              </el-select>
            </el-form-item>
            <el-form-item label="机房"
              :prop="'data.' + index + '.engineRoom'"
              :rules="{
                required: true, message: '机房不能为空', trigger: 'blur'
              }">
              <el-input v-model="assignForm.data[index].engineRoom" placeholder="请填写机房"></el-input>
            </el-form-item>
            <el-form-item label="机柜"
              :prop="'data.' + index + '.cabinet'"
              :rules="{
                required: true, message: '机柜不能为空', trigger: 'blur'
              }">
              <el-input v-model="assignForm.data[index].cabinet" placeholder="请填写机柜"></el-input>
            </el-form-item>
          </div>
          <div v-if="routerInfo.step==='netLine'">
            <br>
            <el-form-item label="IP"
              :prop="'data.' + index + '.ip'"
              :rules="{
                required: true, validator: validateIP, trigger: 'blur'
              }">
              <el-input v-model="assignForm.data[index].ip"></el-input>
            </el-form-item>
            <el-form-item label="机房"
              :prop="'data.' + index + '.engineRoom'"
              :rules="{
                required: true, message: '机房不能为空', trigger: 'blur'
              }">
              <el-input v-model="assignForm.data[index].engineRoom"></el-input>
            </el-form-item>
            <el-form-item label="机柜"
              :prop="'data.' + index + '.cabinet'"
              :rules="{
                required: true, message: '机柜不能为空', trigger: 'blur'
              }">
              <el-input v-model="assignForm.data[index].cabinet"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="是否完成">
              <el-checkbox v-model="assignForm.data[index].netline">准备网线连接</el-checkbox>
            </el-form-item>
          </div>
          <div v-if="routerInfo.step==='deviceMove'">
            <el-form-item label="是否完成" :prop="'data.' + index + '.devicemove'">
              <el-checkbox v-model="assignForm.data[index].move">挂牌与搬迁</el-checkbox>
              <el-checkbox v-model="assignForm.data[index].osip">安装OS及配置IP</el-checkbox>
              <el-checkbox v-model="assignForm.data[index].agent">安装Agent</el-checkbox>
              <el-checkbox v-if="data.database_info" v-model="assignForm.data[index].dba">DBA安装数据库</el-checkbox>
            </el-form-item>
          </div>
          <div v-if="routerInfo.step==='installDB'">
            <el-form-item label="是否完成" :prop="'data.' + index + '.installdb'">
              <el-checkbox v-model="assignForm.data[index].installdb">安装数据库</el-checkbox>
            </el-form-item>
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
      hostTabel: [], // 服务器列表
      searchKeys: {
        status: '已出库'
      },
      searchKeyList: [],
      deviceType: '',
      idcList: [],
      idcGroupList: [],
      formStructure: [],
      validateIP: (rule, value, cb) => {
        const reg = /^(\d|[1-9]\d|1\d{2}|2[0-5][0-5])\.(\d|[1-9]\d|1\d{2}|2[0-5][0-5])\.(\d|[1-9]\d|1\d{2}|2[0-5][0-5])\.(\d|[1-9]\d|1\d{2}|2[0-5][0-5])$/
        if (value && !value.match(reg)) {
          cb(new Error('请输入正确的IP地址'))
        } else {
          cb()
        }
      }
    }
  },
  created () {
    this.routerInfo = this.$route.params // 取得本实例的id及当前步骤
    this.deviceType = this.routerInfo.objectid
    this.renderInstanceDetail() // 通过 id 渲染本实例
    this.renderFormStructure()
  },
  methods: {
    renderFormStructure () {
      let postData = {
        action: `cmdb/object/on/attr`,
        method: 'GET',
        data: { object_id: this.deviceType }
      }
      this.http.post('', this.parseData(postData)).then((res) => {
        this.formStructure = res.data.data.attr_list
      })
    },
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
        const taskKeyArr = ['ipinfo', 'approve', 'netLine', 'deviceMove']
        this.applyData = this.getTask(message, taskKeyArr)
        this.applyData.action = res.data.data.action
        this.applyData.data.forEach((item, k) => {
          console.dir(item, k)
          switch (this.routerInfo.step) {
            case 'ipinfo':
              this.assignForm.data.push({
                ip: '',
                ports: [],
                cabinet: '',
                engineRoom: '',
                instanceId: item.instanceId
              })
              break

            case 'approve':
              this.assignForm.data.push({
                approve: '通过',
                instanceId: item.instanceId
              })
              break

            case 'netLine':
              this.assignForm.data.push({
                ip: item.ip,
                cabinet: item.cabinet,
                engineRoom: item.engineRoom,
                netline: false,
                instanceId: item.instanceId
              })
              break

            case 'deviceMove':
              this.assignForm.data.push({
                move: false,
                osip: false,
                agent: false,
                dba: false,
                instanceId: item.instanceId
              })
              break

            case 'installDB':
              this.assignForm.data.push({
                installdb: false,
                instanceId: item.instanceId
              })
              break

            default:
              if (this.assignForm.data) {
                this.assignForm.data.push({})
              }
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
        // console.log(this.$refs[assignForm])
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
                  this.$router.replace('/orders')
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
    resetForm (formName) {
      if (formName === 'searchKeys') {
        this.$refs[formName][0].resetFields()
      } else {
        this.$refs[formName].resetFields()
      }
    },
    onReject (task, action) {
      console.log(task, action.pass)
      this.$prompt('请输入' + action.name + '意见：', '确定' + action.name + '？', {
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
          this.$router.replace('orders') // 跳转历史的上一页
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
.el-form-item {
  margin-bottom: 8px;
}
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
