<template>
  <div id="item1-side" class="wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="24">
        <el-card class="box-card">
          <h3 class="form-title"><i class="el-icon-fa-server"></i> {{ routerInfo.name }}</h3>
          <el-form ref="assignForm" :model="assignForm" label-width="85px" class="advance-search-form" :inline="true">
            <header-form-structure-display :item="applyData.header" :form-data="form.header"></header-form-structure-display>
            <el-tabs type="border-card" @tab-click="handleClick">
              <el-tab-pane v-for="(data, index) in applyData.body" :label="data.environment">
                <!-- 信息显示 -->
                <form-structure-display :item="data" :form-data="form && form.body.body_list[0].attr_list" :index="index"></form-structure-display>
                <!-- 表单填写 -->
                <div v-if="data.hostType === '虚拟机'">
                  <!-- 表单数据不为空时才显示表单，否则出错 -->
                  <div v-if="taskForm.body && taskForm.body.body_list && taskForm.body.body_list[0] && taskForm.body.body_list[0].attr_list">
                    <form-structure :form-data="taskForm.body && taskForm.body.body_list[0].attr_list" :item="assignForm.data[index]" :index="index"></form-structure>
                  </div>
                  <pre>
                    {{ data }}
                  </pre>
                </div>
                <!-- 设备选择 -->
                <div v-if="data.hostType === '物理机'">
                  <search-bar v-if="taskForm.body && routerInfo.step === 'restart'" :index="index" :hosts="assignForm.data[index] && assignForm.data[index].machines" :attr-list="taskForm.body && taskForm.body.body_list[1].attr_list" @on-hosts-change="onHostsChange"></search-bar>
                  <pre>
                    {{ data }}
                  </pre>
                  <div v-if="routerInfo.step !== 'restart'">
                    <!-- 显示的表头在 restart 里的搜索字段，层级好深 -->
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
            <div class="btn-area">
              <span v-for="action in applyData.action">
                <el-button v-if="action.type==='submit'" type="primary" @click="onSubmit('assignForm')">{{action.name}}</el-button>
                <el-button v-else-if="action.type==='back'" :plain="true" type="danger" @click="onReject(applyData, action)" class="fr">{{action.name}}</el-button>
              </span>
              <el-button :plain="true" type="primary" @click="cancel">取消</el-button>
            </div>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  // import searchFormStructure from '../../_plugins/_searchFormStructure'
  import headerFormStructureDisplay from '../../_plugins/_headerFormStructureDisplay'
  import formStructureDisplay from '../../_plugins/_formStructureDisplay'
  import formStructure from '../../_plugins/_formStructure'
  import searchBar from '../../_plugins/_searchBar'

  export default {
    data () {
      return {
        routerInfo: {},
        applyData: {},
        form: {},
        taskForm: {},
        bodylistIndex: [], // 可删
        showTaskForm: [],
        assignForm: {
          data: []
        },
        index: 0,
        selectedDevices: [],
        searchKeyList: [],
        searchKeys: {},
        searchData: {}
      }
    },
    created () {
      this.routerInfo = this.$route.params // 取得本实例的id及当前步骤
      this.renderInstanceDetail()
      this.renderForm()
      // this.renderTaskForm()
    },
    methods: {
      renderTaskForm () { // 渲染表单数据
        console.log(this.routerInfo.step)
        const renderFromData = {
          action: 'activiti/task/form/group',
          method: 'GET',
          data: {
            pkey: 'host_apply',
            tkey: this.routerInfo.step
          }
        }
        this.http.post('', this.parseData(renderFromData)).then((res) => {
          this.taskForm = res.data.data.form
          this.taskForm.body.body_list.forEach((body, k) => {
            if (body.show) {
              const keyPath = body.show.key_path.split('.')
              if (body.show.type === 'message_body') {
                this.applyData.body.forEach(item => {
                  if (item[keyPath[0]] === body.show.value) {
                    // 以下区分物理机和虚拟机的显示，隐藏，及对应的数据
                    if (body.show.value === '物理机') {
                      // this.showTaskForm.push(false)
                      this.assignForm.data.push({
                        machines: []
                      })
                    } else {
                      // this.showTaskForm.push(true)
                      let newData = {}
                      body.attr_list.map(group => {
                        group.value.map(item => {
                          this.setNewDataType(item, newData)
                        })
                      })
                      this.assignForm.data.push(newData)
                    }
                  }
                })
              }
            }
          })
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
          console.log(this.applyData)
          this.applyData.action = res.data.data.action
          this.renderTaskForm()
        })
      },
      renderForm () { // 渲染表单数据
        const renderFromData = {
          action: 'activiti/task/form/group',
          method: 'GET',
          data: {
            pkey: 'host_apply',
            tkey: 'start' // start
          }
        }
        // this.loading = true
        this.http.post('', this.parseData(renderFromData)).then((res) => {
          this.form = res.data.data.form
        })
      },
      handleClick (tab, event) {
        this.index = tab.index
        console.log(this.index)
      },
      onHostsChange (val, index) {
        this.assignForm.data[index].machines = val
        // ④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
      },
      onSubmit (assignForm) {
        console.log(this.assignForm)
        this.$confirm('确定提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          const ref = this.$refs[assignForm].fields.length !== 0
          if (ref) {
            this.$refs[assignForm].validate((valid) => {
              if (valid) {
                if (this.assignForm.data) {
                  for (const item of this.assignForm.data) { // 用 for...of 可以轻松退出循环
                    if (this.routerInfo.step === 'restart' && item.machines && item.machines.length === 0) {
                      this.$message.warning('未完成！')
                      return false
                    }
                  }
                }
                this.postMethod(this.routerInfo.id, this.assignForm)
                // console.dir(this.assignForm)
              } else {
                console.log('error submit!!')
                this.$message.warning('未完成！')
                return false
              }
            })
          } else {
            if (!this.assignForm.data.some(data => data.machines.length === 0)) {
              this.postMethod(this.routerInfo.id, this.assignForm)
              // console.dir(this.assignForm)
            } else {
              this.$message.warning('未分配完！')
              return false
            }
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消审批'
          })
        })
      },
      postMethod (id, data) {
        const postData = {
          action: 'runtime/task/complete',
          method: 'POST',
          data: {
            tid: id,
            form: data // 通过审批 需要判断一下登录的账号的角色身份
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
      cancel () {
        this.$router.go(-1) // 跳转历史的上一页
      }
    },
    components: {
      // searchFormStructure,
      headerFormStructureDisplay,
      formStructureDisplay,
      formStructure,
      searchBar
    }
  }
</script>
<style lang="less" scoped>
.el-tag {
  font-size: 14px;
  & +.el-tag {
    margin-left: 10px;
  }
}
.advance-search-form .el-form-item {
  margin-bottom: 18px;
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
