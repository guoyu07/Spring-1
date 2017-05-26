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
                <div v-for="taskformheader in taskheader.form.form.header">
                  <!-- {{taskformheader.name}} -->
                  <span v-for="valueheader in taskformheader.value">
                    <!-- 有 show 条件的时候 -->
                    <div v-if="valueheader.show">
                      <!-- 判断 show.type 这里只判断了一种情况-->
                      <div v-if="valueheader.show.type==='form_header'">
                        <!-- 表单信息显示 -->
                        <header-form-display
                          v-if="valueheader.value.type !== 'search_bar'"
                          :item="applyData.header"
                          :form-item="valueheader">
                        </header-form-display>
                        <!-- 设备选择 -->
                        <div v-if="valueheader.value.type === 'search_bar'">
                          <el-table
                            class="margin-bottom"
                            v-if="valueheader.show.value === getPathResult(applyData.header, valueheader.show.key_path)"
                            :data="applyData.header[valueheader.id]">
                            <el-table-column
                              v-for="item in valueheader.value.source.data.params.filter(item => {return item.value.type === 'input'})"
                              :prop="item.id"
                              :label="item.name">
                            </el-table-column>
                          </el-table>
                        </div>
                      </div>
                    </div>
                    <!-- 无 show 条件的时候 -->
                    <span v-else>
                      <!-- 表单信息显示 -->
                      <header-form-display
                        v-if="valueheader.value.type !== 'search_bar'"
                        :item="applyData.header"
                        :form-item="valueheader">
                      </header-form-display>
                      <!-- 选择设备信息显示 -->
                      <el-table
                        class="margin-bottom"
                        v-if="valueheader.value.type === 'search_bar'"
                        :data="applyData.header[valueheader.id]">
                        <el-table-column
                          v-for="item in valueheader.value.source.data.params.filter(item => {return item.value.type === 'input'})"
                          :prop="item.id"
                          :label="item.name">
                        </el-table-column>
                      </el-table>
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <!-- taskForm.body.body_list.length !== 0 && -->
            <el-tabs class="margin-bottom" type="border-card" @tab-click="handleClick" v-if="applyData.body.length !== 0">
              <el-tab-pane v-for="(data, index) in applyData.body" :label="'body' + (index+1)">
                <!-- body 信息显示 -->
                <div v-for="task in form">
                  <div v-if="task.form.form.body.body_list.length > 1">
                    <div v-for="taskform in task.form.form.body.body_list">
                      <template v-if="taskform.show ? (getPathResult(taskform.show.type === 'form_header' ? applyData.header : applyData.body[index], taskform.show.key_path) === taskform.show.value) : true">
                        <p class="h5">{{task.tname}}</p>
                        <form-structure-display
                          v-if="taskform.attr_list[0].value[0].value.type !== 'search_bar'"
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
                      <!-- <div v-if="task.form.form.body.body_list[0].show ? (getPathResult(data, task.form.form.body.body_list[0].show.key_path) === task.form.form.body.body_list[0].show.value) : true"> -->
                      <p class="h5">{{task.tname}}</p>
                      <form-structure-display :item="data" :form-data="task.form.form.body.body_list[0].attr_list" :index="index"></form-structure-display>
                      <!-- </div> -->
                    </div>
                  </div>
                </div>

                <!-- body 表单填写 -->
                <div v-if="taskForm.body && taskForm.body.body_list.length !== 0">
                  <div v-for="taskFormData in taskForm.body.body_list">
                      <div v-if="showBodyList(taskFormData, assignForm, applyData, index)">
                        <div class="form-block" v-for="formBlock in taskFormData.attr_list">
                          <h5>{{formBlock.name}}</h5>
                          <span v-for="formItem in formBlock.value">
                            <form-body
                              :item="assignForm.body[index]"
                              :form-item="formItem"
                              :whole="whole"
                              :index="index"
                              :message="applyData">
                            </form-body>
                            <search-bar
                              v-if="formItem.value.type==='search_bar'"
                              :index="index"
                              :hosts="assignForm.body[index]"
                              :attr-list="formItem"
                              :limit="getLimitQuantity(formItem, assignForm, applyData, index)"
                              @on-hosts-change="onHostsChange">
                            </search-bar>
                            <div v-if="formItem.value.type==='table'">
                                table
                            </div>
                          </span>
                        </div>
                      </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
            <!-- header 表单填写 -->
            <div v-if="taskForm.header">

              <div v-for="task in taskForm.header">
                <span v-for="taskform in task.value">
                  <form-body
                    v-if="!taskform.show"
                    :item="assignForm.header"
                    :form-item="taskform">
                  </form-body>
                  <div v-if="taskform.show">
                    <div v-if="taskform.show.type==='form_header'">
                      <div v-if="getPathResult(assignForm.header, taskform.show.key_path.split('.')[0])">
                        <search-bar
                          v-if="getPathResult(assignForm.header, taskform.show.key_path) === taskform.show.value"
                          :hosts="assignForm.header"
                          :attr-list="taskform"
                          :limit="getLimitQuantity(taskform, assignForm, applyData)"
                          @on-hosts-change="onHostsChange">
                        </search-bar>
                      </div>
                    </div>
                  </div>
                </span>
              </div>
              <!-- <header-form-structure :form-data="taskForm.header" :item="assignForm.header"></header-form-structure> -->
            </div>
            <!-- 按钮区域 -->
            <div class="btn-area">
              <span v-for="action in applyData.action">
                <el-button v-if="action.type==='submit'" type="primary" @click="onSubmit('assignForm')">{{action.name}}</el-button>
                <el-tooltip v-else-if="action.type==='manual'" :content="action.desc" placement="bottom">
                  <el-button type="primary" @click="onManual(action)">{{action.name}}</el-button>
                </el-tooltip>
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
  import headerFormDisplay from '../../_plugins/_headerFormDisplay'
  import formStructureDisplay from '../../_plugins/_formStructureDisplay'
  import formStructure from '../../_plugins/_formStructure'
  import headerFormStructure from '../../_plugins/_headerFormStructure'
  import formBody from '../../_plugins/_formBody'
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
        path_list: [],
        hostList: []
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
        const renderFromData = {
          action: 'activiti/task/form/group',
          method: 'GET',
          data: {
            pkey: this.routerInfo.pkey,
            tkey: this.routerInfo.tkey
          }
        }
        this.http.post('', this.parseData(renderFromData)).then((res) => {
          console.log(res)
          this.taskForm = res.data.data.form
          console.log(this.applyData)
          if (this.applyData.body.length === 0) {
            if (this.taskForm.body.count.type === 'message_header') {
              const keyData = this.getPathResult(this.applyData.header, this.taskForm.body.count.key_path)
              if (Array.isArray(keyData)) {
                // this.applyData.body.length = keyData.length
                const num = keyData.length
                for (let i = 0; i < num; i++) {
                  this.applyData.body.push({})
                }
              } else if (typeof keyData === 'number') {
                // this.applyData.body.length = keyData
                const num = keyData
                for (let i = 0; i < num; i++) {
                  this.applyData.body.push({})
                }
              } else if (typeof keyData === 'string') {
                if (typeof +keyData === 'number') {
                  // this.applyData.body.length = +keyData
                  const num = +keyData
                  for (let i = 0; i < num; i++) {
                    this.applyData.body.push({})
                  }
                } else {
                  this.$message('数据有错')
                }
              }
            }
          }
          // 这里是按 this.taskForm.body.count.type 复制进 this.applyData.body 里
          // if (this.applyData.body.length !== 0) {
          //   if (this.taskForm.body.count) {
          //     if (this.taskForm.body.count.type === 'message_header') {
          //       const keyData = this.getPathResult(this.applyData.header, this.taskForm.body.count.key_path)
          //       this.applyData.body.forEach((body, k) => {
          //         Object.assign(body, keyData[k])
          //       })
          //     }
          //   }
          // }
          this.taskForm.header.forEach((header, k) => {
            if (header) {
              header.value.map(value => {
                if (value.need_submit) {
                  this.setDataType(value, this.assignForm.header, this)
                  // 有默认值时 TODO：默认值暂时只写了 message_header 一种
                  if (value.default.type) {
                    if (value.default.type === 'message_header') {
                      this.$set(this.assignForm.header, value.id, this.getPathResult(this.applyData.header, value.default.key_path))
                    }
                  }
                }
              })
            }
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
                    console.log(newData)
                  }
                } else if (body.show.type === 'message_header') {
                  body.attr_list.map(group => {
                    group.value.map(value => {
                      if (value.need_submit) {
                        this.setNewDataType(value, newData)
                        // 有默认值时 TODO：默认值暂时只写了 message_header 一种
                        if (value.default.type) {
                          if (value.default.type === 'message_header') {
                            newData[value.id] = this.getPathResult(this.applyData.header, value.default.key_path, k)
                          }
                        }
                      }
                      if (!value.need_submit && value.readonly) {
                        if (value.default.type === 'message_header') {
                          // item === this.applyData.body
                          item[value.id] = this.getPathResult(this.applyData.header, value.default.key_path, k)
                        }
                      }
                    })
                  })
                }
              } else {
                console.log(item, body)
                body.attr_list.map(group => {
                  group.value.map(value => {
                    if (value.need_submit) {
                      this.setNewDataType(value, newData)
                      // 有默认值时 TODO：默认值暂时只写了 message_header 一种
                      if (value.default.type) {
                        if (value.default.type === 'message_header') {
                          newData[value.id] = this.getPathResult(this.applyData.header, value.default.key_path, k)
                        }
                      }
                    }
                  })
                })
              }
            })
            this.assignForm.body.push(newData)
            for (const id in item) {
              console.log(item[id], this.assignForm.body[k][id])
              if (this.assignForm.body[k][id] !== undefined) {
                this.assignForm.body[k][id] = item[id]
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
            pkey: this.routerInfo.pkey,
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
        console.log(val, index)
        if (index !== undefined) {
          for (const id in this.assignForm.body[index]) {
            this.assignForm.body[index][id] = val
          }
        } else {
          this.hostList = []
          this.hostList = val
        }
        // ④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
      },
      onSubmit (assignForm) {
        this.taskForm.header.map(header => {
          header.value.map(item => {
            if (item.show) {
              // show.type 有四种类型
              if (item.show.type === 'form_header') {
                if (this.getPathResult(this.assignForm.header, item.show.key_path) === item.show.value) {
                  if (item.value.type === 'search_bar') {
                    this.assignForm.header[item.id] = this.hostList
                  }
                }
              }
            }
          })
        })
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
        // if (data.body.length === 0) {
        //   this.applyData.body.forEach(item => {
        //     data.body.push({})
        //   })
        // }
        // console.log(data)
        for (const id in data.header) {
          if (!data.header[id]) {
            delete data.header[id] // 删除头部空值 TODO：删除 body 的空值
          }
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
                message: '成功!'
              })
              if (this.routerInfo.pkey === 'easyops_monitor') {
                this.$router.replace('/alarm') // 告警处理成功后跳转告警事件
              } else {
                this.$router.replace('/orders') // 跳转工单管理
              }
            }
          })
      },
      onManual (action) {
        const ref = this.$refs['assignForm'].fields.length !== 0
        if (ref) { // 有表单的情况下，表单的自验证
          this.$refs['assignForm'].validate((valid) => {
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
              this.manualMethod(action)
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
            this.manualMethod(action)
            // console.dir(this.assignForm)
          } else {
            this.$message.warning('未分配完！')
            return false
          }
        }
      },
      manualMethod (action) {
        const postData = {
          action: 'do/activiti/form/action',
          method: 'POST',
          data: {
            form: this.assignForm,
            tid: this.routerInfo.id,
            action_id: action.id
          }
        }
        this.http.post('', this.parseData(postData))
        .then((res) => {
          if (res && res.status === 200) {
            this.$message({
              type: 'success',
              message: '提交成功!'
            })
            this.$router.replace('/orders') // 分配成功跳转工单管理
          }
        })
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
      },
      cancel () {
        this.$router.go(-1) // 跳转历史的上一页
      }
    },
    components: {
      // searchFormStructure,
      headerFormStructureDisplay,
      headerFormDisplay,
      formStructureDisplay,
      formStructure,
      headerFormStructure,
      formBody,
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

.margin-bottom {
  margin-bottom: 15px;
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
