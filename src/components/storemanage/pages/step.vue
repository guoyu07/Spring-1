<template>
  <div id="item1-side" class="wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="24">
        <el-card class="box-card">
          <h3 class="form-title"><i class="el-icon-fa-server"></i> {{ routerInfo.name }}</h3>
          <el-form ref="assignForm" :model="assignForm" label-width="85px" class="advance-search-form" :inline="true">
            <!-- 表头信息显示 -->
            <div v-for="taskheader in form">
              <div v-if="taskheader.form.form.header.length >= 1">
                <p class="h5">{{taskheader.tname}}</p>
                <header-form-structure-display
                  :item="applyData.header"
                  :form-data="taskheader.form.form.header">
                </header-form-structure-display>
              </div>
            </div>

            <el-tabs type="border-card" @tab-click="handleClick">
              <el-tab-pane v-for="(data, index) in applyData.body" :label="'设备' + (index+1)">
                <!-- 信息显示 -->
                <div v-for="task in form">
                  <div v-if="task.form.form.body.body_list.length > 1">
                    <p class="h5">{{task.tname}}</p>
                    <div v-for="taskform in task.form.form.body.body_list">
                      <template v-if="taskform.show ? (getPathResult(taskform.show.type === 'form_header' ? applyData.header : applyData.body[index], taskform.show.key_path) === taskform.show.value) : true">
                        <form-structure-display
                          v-if="taskform.attr_list[0].value[0].value.type !== 'searchBar'"
                          :item="data"
                          :form-data="taskform.attr_list"
                          :index="index">
                        </form-structure-display>

                        <el-table
                          v-if="taskform.attr_list[0].value[0].value.type === 'search_bar'"
                          :data="data[taskform.attr_list[0].value[0].id]">
                          <el-table-column
                            v-for="item in taskform.attr_list[0].value[0].value.source.data.params.filter(item => {return item.value.type === 'input'})"
                            :prop="item.id"
                            :label="item.name">
                          </el-table-column>
                        </el-table>

                      </template>
                    </div>
                  </div>
                  <div v-else>
                    <!-- 这里是判断 body_list 是不是空数组 -->
                    <div v-if="task.form.form.body.body_list[0]">
                      <p class="h5">{{task.tname}}</p>
                      <form-structure-display :item="data" :form-data="task.form.form.body.body_list[0].attr_list" :index="index"></form-structure-display>
                    </div>
                  </div>
                </div>

                <!-- body 的表单填写 -->
                <div v-if="taskForm.body">
                  <div v-for="taskFormData in taskForm.body.body_list">
                    <div v-if="taskFormData.show && taskFormData.show.type === 'message_body'"> <!-- type来源 为 message_body 意味着就是(data, index) in applyData.body 的 data -->
                      <div v-if="taskFormData.show ? (getPathResult(data, taskFormData.show.key_path) === taskFormData.show.value) : true">
                        <!-- 表单填写 -->
                        <form-structure
                          v-if="taskFormData.attr_list[0].value[0].value.type!=='search_bar'"
                          :form-data="taskFormData.attr_list"
                          :item="assignForm.body[index]"
                          :index="index">
                        </form-structure>
                        <!-- 设备选择 -->
                        <search-bar
                          v-if="taskFormData.attr_list[0].value[0].value.type==='search_bar'"
                          :index="index"
                          :hosts="assignForm.body[index]"
                          :attr-list="taskFormData.attr_list[0].value[0]"
                          :limit="getLimitQuantity(taskFormData.attr_list[0].value[0], data)"
                          @on-hosts-change="onHostsChange">
                        </search-bar>
                      </div>
                    </div>
                    <div v-else-if="!taskFormData.show">
                      <!-- 表单填写 -->
                      <form-structure
                        v-if="taskFormData.attr_list[0].value[0].value.type!=='search_bar'"
                        :form-data="taskFormData.attr_list"
                        :item="assignForm.body[index]"
                        :index="index">
                      </form-structure>
                      <!-- 设备选择 -->
                      <search-bar
                        v-if="taskFormData.attr_list[0].value[0].value.type==='search_bar'"
                        :index="index"
                        :hosts="assignForm.body[index]"
                        :attr-list="taskFormData.attr_list[0].value[0]"
                        :limit="getLimitQuantity(taskFormData.attr_list[0].value[0], data)"
                        @on-hosts-change="onHostsChange">
                      </search-bar>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
            <!-- header 表单填写 -->
            <div v-if="taskForm.header">
              <header-form-structure :form-data="taskForm.header" :item="assignForm.header"></header-form-structure>
            </div>
            <!-- 按钮区域 -->
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
  import headerFormStructure from '../../_plugins/_headerFormStructure'
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
          header: {},
          body: []
        },
        index: 0,
        selectedDevices: [],
        searchKeyList: [],
        searchKeys: {},
        searchData: {},
        path_list: []
      }
    },
    created () {
      this.routerInfo = this.$route.params // 取得本实例的id及当前步骤
      this.renderInstanceDetail()
      // this.renderForm()
      // this.renderTaskForm()
    },
    methods: {
      renderTaskForm () { // 渲染表单数据
        // console.log(this.routerInfo.step)
        const renderFromData = {
          action: 'activiti/task/form/group',
          method: 'GET',
          data: {
            pkey: 'import_device',
            tkey: this.routerInfo.step
          }
        }
        this.http.post('', this.parseData(renderFromData)).then((res) => {
          this.taskForm = res.data.data.form
          this.taskForm.header.forEach((header, k) => {
            header.value.map(item => {
              this.setDataType(item, this.assignForm.header, this)
            })
          })
          this.renderForm()
          this.applyData.body.forEach((item, k) => {
            let newData = {}
            this.taskForm.body.body_list.forEach(body => {
              if (body.show) {
                const keyPath = body.show.key_path.split('.')
                if (body.show.type === 'message_body') {
                  if (body.show.value === item[keyPath[0]]) {
                    console.log(item[keyPath[0]])
                    body.attr_list.map(group => {
                      group.value.map(item => {
                        this.setNewDataType(item, newData)
                      })
                    })
                    // console.log(newData)
                  }
                }
              }
            })
            this.assignForm.body.push(newData)
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
          res.data.data.path_list.map(list => {
            list.map(path => {
              if (!this.path_list.includes(path.tkey)) {
                this.path_list.push(path.tkey)
              }
            })
          })
          const taskKeyArr = this.path_list.filter(item => item !== 'start')
          // console.log(taskKeyArr)
          this.applyData = this.getTaskInfo(message, taskKeyArr)
          // console.log(this.applyData)
          this.applyData.action = res.data.data.action
          this.renderTaskForm()
        })
      },
      renderForm () { // 渲染表单数据
        const renderFromData = {
          action: 'activiti/task/form/group',
          method: 'GET',
          data: {
            pkey: 'import_device',
            tkey: this.path_list
          }
        }
        // this.loading = true
        this.http.post('', this.parseData(renderFromData)).then((res) => {
          this.form = res.data.data.list
        })
      },
      handleClick (tab, event) {
        this.index = tab.index
        console.log(this.index)
      },
      onHostsChange (val, index) {
        for (const id in this.assignForm.body[index]) {
          this.assignForm.body[index][id] = val
        }
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
          console.log(ref)
          if (ref) { // 有表单的情况下，表单的自验证
            this.$refs[assignForm].validate((valid) => {
              if (valid) {
                console.log(this.assignForm.body)
                if (this.assignForm.body) {
                  for (const data of this.assignForm.body) { // 用 for...of 可以轻松退出循环
                    for (const item in data) {
                      if (Array.isArray(data[item]) && data[item].length === 0) {
                        this.$message.warning('未完成！')
                        return false
                      }
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
          } else { // 无表单时，需要验证有无选设备，因为选设备不在表单验证范围
            if (!this.assignForm.body.some(data => {
              for (const item in data) {
                return Array.isArray(data[item]) && data[item].length === 0
              }
            })) {
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
        if (data.body.length === 0) {
          this.applyData.body.forEach(item => {
            data.body.push({})
          })
        }
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
              this.$router.replace('/orders') // 分配成功跳转工单管理
            }
          })
      },
      onReject (task, action) {
        console.log(task, action.pass)
        this.$prompt('请输入对「' + task.header.applicationName.name + '」的' + action.name + '意见：', '确定' + action.name + '？', {
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
      headerFormStructure,
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

.h5 {
  margin: 10px 0;
  font-size: 12px;
  color: #ccc;
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
