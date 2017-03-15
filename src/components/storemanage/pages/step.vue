<template>
  <div id="item1-side" class="wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3 class="form-title">{{ title }}{{ routerInfo.name }}</h3>
          <el-form ref="assignForm" :model="assignForm" :inline="true" class="advance-search-form" label-width="90px">
            <el-row :gutter="20">
              <el-col
                v-if="routerInfo.pkey==='export_device'"
                :span="12">
                <el-table
                  :data="applyData.object_list"
                  style="width: 100%">
                  <el-table-column
                    prop="name"
                    label="设备名称">
                  </el-table-column>
                  <el-table-column
                    prop="application"
                    label="申请人">
                  </el-table-column>
                  <el-table-column
                    prop="location"
                    label="地点">
                  </el-table-column>
                  <!-- <el-table-column
                    prop="status"
                    label="状态">
                  </el-table-column> -->
                </el-table>
              </el-col>
              <el-col :span="24" v-else>
                <el-tabs type="border-card" closable @tab-click="handleClick">
                  <el-tab-pane v-for="(item, index) in applyData.object_list" :key="item.id" :label="'设备' + (index + 1)">
                    <div v-for="formblock in formData">
                      <h5>{{formblock.name}}</h5>
                      <el-form-item v-for="form in formblock.value" :label="form.name">
                        <span v-if="form.value.type==='arr'">
                          <span v-for="span in item[form.id]">{{span}} </span>
                        </span>
                        <span v-else-if="form.value.type==='FK'">
                          {{ item[form.id].name }}
                        </span>
                        <span v-else-if="form.value.type==='FKs'">
                          <span v-for="span in item[form.id]">{{span.name}} </span>
                        </span>
                        <span v-else>{{item[form.id]}}</span>
                      </el-form-item>
                    </div>
                    <h5>其他信息</h5>
                    <el-form-item v-if="applyData.object_list[index].status" label="出库状态">
                      {{ applyData.object_list[index].status }}
                    </el-form-item>
                    <el-form-item v-if="applyData.object_list[index].location" label="出库地点">
                      {{ applyData.object_list[index].location }}
                    </el-form-item>
                    <el-form-item v-if="applyData.object_list[index].ip" label="IP">
                      {{ applyData.object_list[index].ip }}
                    </el-form-item>
                    <el-form-item v-if="applyData.object_list[index].application" label="申请人">
                      {{ applyData.object_list[index].application }}
                    </el-form-item>
                  </el-tab-pane>
                </el-tabs>
              </el-col>
            </el-row>
            <!-- <el-form-item> -->
              <div class="btn-area">
                <span v-for="action in applyData.action">
                  <el-button v-if="action.type==='submit'" type="primary" @click="onSubmit('assignForm')">{{action.name}}</el-button>
                  <el-button v-else-if="action.type==='back'" :plain="true" type="danger" @click="onReject(applyData, action)" class="fr">{{action.name}}</el-button>
                </span>
                <el-button :plain="true" type="primary" @click="cancel">取消</el-button>
              </div>
            <!-- </el-form-item> -->
            <el-form-item
              v-if="routerInfo.step==='approve'"
              label=""
              prop="approve"
              style="width:1%;display:none;">
              <el-input
                v-model="assignForm.approve">
              </el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      title: '',
      loading: false,
      routerInfo: {},
      applyData: [],
      assignForm: {'approve': '通过'},
      deviceType: '',
      formData: []
    }
  },
  created () {
    this.routerInfo = this.$route.params // 取得本实例的id及当前步骤
    this.deviceType = this.routerInfo.objectid
    this.renderInstanceDetail() // 通过 id 渲染本实例
    if (this.$route.query.instanceId) {
      this.routerInfo.instanceId = this.$route.query.instanceId
      this.renderInstanceIdDetail() // 通过 instanceid 渲染本实例
    }
    this.renderFormData() // 渲染表单数据
    if (this.routerInfo.pkey === 'export_device') {
      this.title = '出库'
    } else if (this.routerInfo.pkey === 'alter_device') {
      this.title = '信息变更'
      this.assignForm = {
        approve: '通过'
      }
    } else {
      this.title = '入库'
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(this.index)
    },
    renderFormData () { // 渲染表单数据
      const renderFromData = {
        action: 'cmdb/object/attr',
        method: 'GET',
        data: {
          object_id: this.deviceType
        }
      }
      this.loading = true
      this.http.post('', this.parseData(renderFromData)).then((res) => {
        this.formData = res.data.data.attr_group
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
        this.applyData = this.findTaskMsgR(message, ['start']).form
        this.applyData.action = res.data.data.action
      })
    },
    renderInstanceIdDetail () {
      let postData = {
        action: `/object/instance/${this.routerInfo.objectid}/${this.routerInfo.instanceId}`,
        method: 'GET',
        data: {
          // objectId: this.routerInfo.objectid,
          // instanceId: this.routerInfo.instanceId
        }
      }
      this.http.post('easyops/', this.parseData(postData)).then((res) => {
        console.log(res.data.data.data)
        if (this.applyData.object_list) {
          Object.assign(this.applyData.object_list[0], res.data.data.data)
        }
      })
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
                  this.$router.replace('/orders') // 分配成功跳转历史的上一页
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
          this.$router.go(-1) // 跳转历史的上一页
        })
      })
    }
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
</style>
