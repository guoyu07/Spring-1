<template>
  <div id="item1-side" class="wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="24">
        <el-card class="box-card">
          <h3 class="form-title"><i class="el-icon-fa-server"></i> {{ routerInfo.name }}</h3>
          <el-form ref="assignForm" :model="assignForm" label-width="100px" :inline="true">
            <!-- 表头信息显示 -->
            <div v-for="taskheader in form">
              <div v-if="taskheader.form.form.header.length >= 1">
                <p class="h5">{{taskheader.tname}}</p>
                <div v-for="taskformheader in taskheader.form.form.header">
                  <!-- {{taskformheader.name}} 这是分组名称 因为现实了步骤任务名称，不在重复显示一个分组名称-->
                  <span v-for="valueheader in taskformheader.value">
                    <span v-if="showFormItem(valueheader, assignForm, applyData, taskheader.tkey, routerInfo.tkey)">
                      <header-form-display
                        :item="applyData.header"
                        :form-item="valueheader">
                      </header-form-display>
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <!-- taskForm.body.body_list.length !== 0 && -->
            <el-tabs class="margin-bottom" type="border-card" @tab-click="handleClick" v-if="applyData.body && applyData.body.length !== 0">
              <el-tab-pane v-for="(data, index) in applyData.body" :label="'body' + (index+1)">
                <!-- body 信息显示 -->
                <div>
                  <div v-for="task in form">
                    <div v-for="taskbody in task.form.form.body.body_list">
                      <div v-if="showBodyList(taskbody, assignForm, applyData, index, true, false)">
                        <p class="h5">{{task.tname}}</p>
                        <form-structure-display
                          :item="data"
                          :form-data="taskbody.attr_list"
                          :index="index"
                          :post-form="assignForm"
                          :message-data="applyData"
                          :current-task="routerInfo.tkey"
                          :history-task="task.tkey">
                        </form-structure-display>
                      </div>
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
                              v-if="showFormItem(formItem, assignForm, applyData)"
                              :item="assignForm.body[index]"
                              :form-item="formItem"
                              :whole="assignForm"
                              :index="index"
                              :message="applyData"
                              keep-alive>
                            </form-body>
                            <search-bar
                              v-if="showFormItem(formItem, assignForm, applyData) && formItem.value.type==='search_bar'"
                              :index="index"
                              :post-form="assignForm"
                              :hosts="assignForm.body[index]"
                              :attr-list="formItem"
                              :limit="getLimitQuantity(formItem, assignForm, applyData, index)"
                              @on-hosts-change="onHostsChange">
                            </search-bar>
                            <body-table
                              v-if="showFormItem(formItem, assignForm, applyData) && formItem.value.type==='table'"
                              :form-data="formItem"
                              :item="assignForm.body[index]"
                              :post-form="assignForm"
                              :message-data="applyData"
                              :index="index"
                              :bodyTable="true">
                            </body-table>
                          </span>
                        </div>
                      </div>
                  </div>
                </div>
                <div class="clear">
                  <el-button v-if="routerInfo.tkey === 'cabinet'" type="primary" icon="search" size="small" @click="getPreview(data.sc_ip_info[0].ipscope.instanceId)" class="margin-bottom">机柜预览图</el-button>
                </div>
              </el-tab-pane>
            </el-tabs>
            <!-- header 表单填写 -->
            <div v-if="taskForm.header">
              <div v-for="task in taskForm.header">
                <span v-for="taskform in task.value">
                  <form-body
                    v-if="showFormItem(taskform, assignForm, applyData)"
                    :item="assignForm.header"
                    :form-item="taskform"
                    :whole="assignForm"
                    :wholeName="'assignForm'"
                    :message="applyData"
                    :header="true">
                  </form-body>
                  <search-bar
                    v-if="showFormItem(taskform, assignForm, applyData) && taskform.value.type==='search_bar'"
                    :hosts="assignForm.header"
                    :attr-list="taskform"
                    :limit="getLimitQuantity(taskform, assignForm, applyData)"
                    @on-hosts-change="onHostsChange">
                  </search-bar>
                  <header-table
                    v-if="showFormItem(taskform, assignForm, applyData) && taskform.value.type==='table'"
                    :form-data="taskform"
                    :item="assignForm.header"
                    :messageData="applyData"
                    :postForm="assignForm"
                    :postFormName="'assignForm'">
                  </header-table>
                </span>
              </div>
            </div>
            <!-- 按钮区域 -->
            <div class="btn-area">
              <span v-for="action in applyData.action">
                <el-button v-if="action.type==='submit'" type="success" @click="onSubmit('assignForm')">{{action.name}}</el-button>
                <el-tooltip v-else-if="action.type==='manual'" :content="action.desc" placement="bottom">
                  <el-button type="primary" @click="onManual(action)">{{action.name}}</el-button>
                </el-tooltip>
                <el-button v-else-if="action.type==='back'" type="danger" @click="onReject(applyData, action)">{{action.name}}</el-button>
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
  import bodyTable from '../../_plugins/_bodyTable'
  import headerTable from '../../_plugins/_headerTable'
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
        hostList: [],
        previewShown: false,
        previewPage: 1,
        pageNum: 1
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
            tkey: this.routerInfo.tkey,
            version: this.applyData.version
          }
        }
        this.http.post('', this.parseData(renderFromData)).then((res) => {
          // console.log(res)
          this.taskForm = res.data.data.form
          // console.log(this.applyData)
          if (this.applyData.body.length === 0) {
            // TODO: 只写了两种 count.type
            if (this.taskForm.body.count.type === 'message_header') { // 从历史信息的 header 读取 body 的个数
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
            } else if (this.taskForm.body.count.type === 'static') {
              for (let i = 0; i < this.taskForm.body.count.min; i++) {
                this.applyData.body.push({})
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
                  if (value.value.type === 'table') {
                    this.$set(this.assignForm.header[value.id], 0, {})
                    let data = this.assignForm.header[value.id][0]
                    value.value.attr_list.map(item => {
                      this.setDataType(item, data, this)
                    })
                  }
                  // console.log(this.assignForm.header)
                  // 有默认值时 TODO：默认值暂时只写了2种
                  if (value.default && value.default.type) {
                    if (value.default.type === 'message_header') {
                      this.assignForm.header[value.id] = this.getPathResult(this.applyData.header, value.default.key_path)
                    } else if (value.default.type === 'static') {
                      this.assignForm.header[value.id] = value.default.value
                    } else if (value.default.type === 'form_header') {
                      this.$watch('assignForm.header.' + value.default.key_path, (newVal, oldVal) => {
                        this.assignForm.header[value.id] = newVal
                      })
                    }
                  }
                }
              })
            }
          })
          // console.log(this.assignForm.header.host_type)
          this.renderForm()
          this.applyData.body.forEach((item, k) => {
            let newData = {}
            this.taskForm.body.body_list.forEach(body => {
              if (body.show.type) {
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
                        if (value.default && value.default.type) {
                          if (value.default.type === 'message_header') {
                            newData[value.id] = this.getPathResult(this.applyData.header, value.default.key_path, k)
                          } else if (value.default.type === 'form_body') {
                            this.$watch('assignForm.body.' + k + '.' + value.default.key_path, (newVal, oldVal) => {
                              this.assignForm.body[k][value.id] = newVal
                            })
                          }
                        }
                      }
                      // 以下这段可以不用，这种只读不提交，直接在 formbody 显示就好，不需要赋值
                      // if (!value.need_submit && value.readonly) {
                      //   if (value.default.type === 'message_header') {
                      //     // item === this.applyData.body
                      //     item[value.id] = this.getPathResult(this.applyData.header, value.default.key_path, k)
                      //   }
                      // }
                    })
                  })
                }
              } else {
                // console.log(item, body)
                body.attr_list.map(group => {
                  group.value.map(value => {
                    if (value.need_submit) {
                      this.setNewDataType(value, newData)
                      // console.log(newData)
                      if (value.value.type === 'table') {
                        // TODO 这里就要判断 table 的个数，然后生成对应的 table 的 key 空值 等待填入
                        newData[value.id][0] = {}
                        let data = newData[value.id][0]
                        value.value.attr_list.map(item => {
                          this.setNewDataType(item, data)
                        })
                      }
                      // 有默认值时
                      if (value.default && value.default.type) {
                        if (value.default.type === 'message_header') {
                          newData[value.id] = this.getPathResult(this.applyData.header, value.default.key_path, k)
                        } else if (value.default.type === 'form_body') {
                          this.$watch('assignForm.body.' + k + '.' + value.default.key_path, (newVal, oldVal) => {
                            this.assignForm.body[k][value.id] = newVal
                          })
                        } else if (value.default.type === 'message_body') {
                          newData[value.id] = this.getPathResult(this.applyData.body[k], value.default.key_path)
                        } else if (value.default.type === 'form_header') {
                          this.$watch('assignForm.header.' + value.default.key_path, (newVal, oldVal) => {
                            this.assignForm.body[k][value.id] = newVal
                          })
                        } else if (value.default.type === 'static') {
                          this.assignForm.body[k][value.id] = value.default.value
                        }
                      }
                      // 机柜 U 位数的默认值 console.log(this.assignForm.body[k].idcrack, this.applyData.header.host_list[k].u_num)
                    }
                  })
                })
              }
            })
            this.assignForm.body.push(newData)
            for (const id in item) {
              // console.log(item[id], this.assignForm.body[k][id])
              if (this.assignForm.body[k][id] !== undefined) {
                this.assignForm.body[k][id] = item[id]
              }
            }
            // 主机名
            if (this.routerInfo.tkey === 'confirm1') {
              const postHeadvData = {
                action: `hostname/minnumber`,
                method: 'get',
                data: {
                  prefix: [
                    this.applyData.header.idc.abbreviation,
                    this.applyData.header.host_type.abbreviation,
                    this.applyData.header.app.abbreviation
                  ].join('') + '-' + this.applyData.header.component.abbreviation
                }
              }
              this.http.post('', this.parseData(postHeadvData))
              .then((response) => {
                if (response.status === 200) {
                  this.assignForm.body.map((body, bodyIndex) => {
                    body.hostname = postHeadvData.data.prefix + (response.data.data + bodyIndex)
                  })
                }
              })
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
          this.applyData.version = res.data.data.version
          this.renderTaskForm()
        })
      },
      renderForm () { // 渲染表单数据
        const renderFromData = {
          action: 'activiti/task/form/group',
          method: 'GET',
          data: {
            pkey: this.routerInfo.pkey,
            tkey: this.path_list,
            version: this.applyData.version
          }
        }
        // this.loading = true
        this.http.post('', this.parseData(renderFromData)).then((res) => {
          this.form = res.data.data.list
        })
      },
      handleClick (tab, event) {
        this.index = tab.index
        // console.log(this.index)
      },
      onHostsChange (val, index) {
        // console.log(val, index)
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
            if (item.show.type) {
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
        // for (const headerid in this.assignForm.header) {
        //   if (!this.assignForm.header[headerid]) {
        //     delete this.assignForm.header[headerid] // 删除头部空值
        //   }
        // }
        // this.assignForm.body.map(body => {
        //   for (const headerid in body) {
        //     if (!body[headerid]) {
        //       delete body[headerid] // 删除 body 的空值
        //     }
        //   }
        // })
        let postFormData = {
          header: {},
          body: []
        }
        for (const headerid in this.assignForm.header) {
          if (Array.isArray(this.assignForm.header[headerid])) {
            if (this.assignForm.header[headerid].length !== 0) {
              postFormData.header[headerid] = this.assignForm.header[headerid]
            }
          } else if (this.assignForm.header[headerid]) {
            postFormData.header[headerid] = this.assignForm.header[headerid]
          }
        }
        this.assignForm.body.map((body, bodyIndex) => {
          postFormData.body[bodyIndex] = {}
          for (const bodyid in body) {
            if (Array.isArray(body[bodyid])) {
              if (body[bodyid].length !== 0) {
                postFormData.body[bodyIndex][bodyid] = body[bodyid]
              }
            } else if (body[bodyid]) {
              postFormData.body[bodyIndex][bodyid] = body[bodyid]
            }
          }
        })
        console.log(postFormData)
        console.log(this.assignForm)
        this.$confirm('确定提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          const ref = this.$refs['assignForm'].fields.length !== 0
          console.log(ref)
          if (ref) { // 有表单的情况下，表单的自验证
            this.$refs['assignForm'].validate((valid) => {
              if (valid) {
                // console.log(this.assignForm.body)
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
                this.postMethod(this.routerInfo.id, postFormData)
                // console.dir(this.assignForm)
              } else {
                console.log('error submit!!')
                this.$message.warning('未完成！')
                return false
              }
            })
          } else { // 无表单时，需要验证有无选设备，因为选设备不在表单验证范围
            this.taskForm.body.body_list.map(bodyList => {
              if (!bodyList.show.type) {
                bodyList.attr_list.map(attrList => {
                  if (attrList.value.some(value => { return value.value.type === 'search_bar' })) {
                    attrList.value.map(value => {
                      if (value.value.type === 'search_bar') {
                        this.assignForm.body.map((postbody, postbodyIndex) => {
                          if (postbody[value.id].length === 0) {
                            this.$message.warning('未分配完！')
                            return false
                          }
                        })
                      }
                    })
                  } else {
                    this.postMethod(this.routerInfo.id, postFormData)
                  }
                })
              }
            })
            this.taskForm.header.map(header => {
              if (header.value.some(value => { return value.value.type === 'search_bar' })) {
                header.value.map(value => {
                  if (value.value.type === 'search_bar') {
                    if (this.assignForm.header[value.id].length === 0) {
                      this.$message.warning('未分配完！')
                      return false
                    }
                  }
                })
              } else {
                this.postMethod(this.routerInfo.id, postFormData)
              }
            })
            // if (!this.assignForm.body.some(data => {
            //   for (const item in data) {
            //     return Array.isArray(data[item]) && data[item].length === 0
            //   }
            // })) {
            //   this.postMethod(this.routerInfo.id, postFormData)
            //   // console.dir(this.assignForm)
            // } else {
            //   this.$message.warning('未分配完！')
            //   return false
            // }
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
        for (const headerid in data.header) {
          // console.log(headerid, data.header[headerid], !data.header[headerid])
          if (Array.isArray(data.header[headerid]) && data.header[headerid].length === 0) {
            delete data.header[headerid]
          }
          if (!data.header[headerid]) {
            // console.log(headerid)
            delete data.header[headerid] // 删除头部空值
          }
        }
        data.body.map(body => {
          for (const bodyid in body) {
            // console.log(bodyid, data.header[bodyid], !data.header[bodyid])
            if (Array.isArray(body[bodyid]) && body[bodyid].length === 0) {
              delete body[bodyid]
            }
            if (!body[bodyid]) {
              // console.log(bodyid)
              delete body[bodyid] // 删除body空值
            }
          }
        })
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
          console.log(this.taskform)
          // if (!this.assignForm.body.some(data => {
          //   for (const item in data) {
          //     return Array.isArray(data[item]) && data[item].length === 0
          //   }
          // })) {
          //   this.manualMethod(action)
          //   // console.dir(this.assignForm)
          // } else {
          //   this.$message.warning('未分配完！')
          //   return false
          // }
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
      searchBar,
      bodyTable,
      headerTable
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
.cabinet-preview {
  position: fixed;
  right: 0;
  top: 0;
  height: 99.9vh;
  background: rgba(255, 255, 255, .9);
  padding: 2px 8px;
  z-index: 99999;
  width: 26%;
  transition: all 320ms cubic-bezier(0.175, 0.185, 0.320, 1.255) 0s;
  transform: translateX(100%);
  overflow-y: scroll;
  text-align: center;
}
.cabinet-preview table caption {
  text-align: center;
  padding-top: 4px;
  padding-bottom: 4px;
}
.cabinet-preview.shown {
  transform: translateX(0);
  box-shadow: -6px 0px 12px -6px #777;
}
.cabinet-preview .close-btn {
  position: absolute;
  right: 10px;
  top: 0;
  font-size: 12px;
  color: rgba(0,0,0,.28);
  cursor: pointer;
}
.cabinet-preview .close-btn:hover {
  color: rgba(0,0,0,.56);
}
.cabinet-title {
  margin: 8px 0;
  font-size: 14px;
  color: rgba(0, 0, 0, .42);
  text-align: center;
  overflow: hidden;
  width: 100%;
  position: relative;
  letter-spacing: .42em;
  font-weight: bold;
}
.cabinet-title span {
  padding: 0 16px;
  display: inline-block;
  text-align: center;
  position: relative;
  z-index: 11;
}
.cabinet-preview.shown .table-cabinet {
  opacity: 1;
  transform: translateY(0);
}
.table-cabinet {
  border: 1px solid rgba(82, 100, 115, 0.84);
  border-left-width: 2px;
  border-right-width: 2px;
  opacity: 0;
  transform: translateY(0);
  transition-property: opacity, transform;
  transition-duration: .25s;
  transition-delay: .15s;
  width: 100%;
}
.table-cabinet td {
  border: 1px solid rgba(173, 194, 212, 0.84);
  padding: 0 4px;
  background: rgba(0,0,0,.04);
  font-size: 10px;
}
.table-cabinet td.occupied {
  background-color: #b5bbc8;
  color: #fff;
  text-shadow: 1px 1px 4px rgba(0,0,0,.3);
  font-weight: bold;
  background-image: repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,.3) 4px, rgba(255,255,255,.3) 8px);
  // cursor: not-allowed;
}
.table-cabinet caption {
  font-size: 12px;
  height: 70px;
  overflow: hidden;
}
.preview-container.loading {
  opacity: .5
}
.preview-indicator {
  color: #333;
}
.paginate-btn {
  margin-bottom: 10px;
}
.total-page {
  font-size: 12px;
  color: #616161;
}
</style>
