<template>
  <div id="item1-side" class="wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="24">
        <el-card class="box-card">
          <h3 class="form-title">{{ $route.params.pname }}</h3>
          <el-form label-position="left" ref="postForm" :model="postForm" :inline="true" label-width="100px" :label-position="right">
            <!-- header 表单填写 -->
            <div v-if="taskFormData.header">
              <div v-for="task in taskFormData.header">
                <span v-for="taskform in task.value">
                  <form-body
                    v-if="showFormItem(taskform, postForm)"
                    :item="postForm.header"
                    :form-item="taskform"
                    :whole="postForm"
                    :is-editing="isEditing"
                    :header="true">
                  </form-body>
                  <search-bar
                    v-if="showFormItem(taskform, postForm) && taskform.value.type==='search_bar'"
                    :hosts="postForm.header"
                    :attr-list="taskform"
                    :limit="getLimitQuantity(taskform, postForm)"
                    @on-hosts-change="onHostsChange">
                  </search-bar>
                  <header-table
                    v-if="showFormItem(taskform, postForm) && taskform.value.type==='table'"
                    :form-data="task"
                    :item="postForm.header"
                    :headerTable="true">
                  </header-table>
                </span>
              </div>
            </div>
            <!-- body 表单填写 -->
            <template v-if="postForm.body && postForm.body.length !== 0">
              <div v-if="taskFormData.body && taskFormData.body.count.type ==='static' && taskFormData.body.count.max > 1">
                <el-button type="primary" size="small" icon="plus" class="margin-bottom" @click="addTab(tabsValue)">
                  增加
                </el-button>
                <el-checkbox style="margin-left:15px;" v-model="toCopy">复制</el-checkbox>
              </div>
              <el-tabs v-model="tabsValue" type="border-card" class="margin-bottom" @tab-remove="removeTab" @tab-click="handleClick">
                <el-tab-pane v-for="(data, index) in postForm.body" :label="bodyLableName[index]" :closable="index !== 0">
                  <div v-if="taskFormData.body && taskFormData.body.body_list.length !== 0">
                    <div v-for="bodyList in taskFormData.body.body_list">
                        <div v-if="showBodyList(bodyList, postForm, applyData, index)">
                          <div class="form-block" v-for="formBlock in bodyList.attr_list">
                            <h5>{{formBlock.name}}</h5>
                            <span v-for="formItem in formBlock.value">
                              <form-body
                                v-if="showFormItem(formItem, postForm)"
                                :item="postForm.body[index]"
                                :form-item="formItem"
                                :whole="postForm"
                                :index="+index"
                                keep-alive>
                              </form-body>
                              <search-bar
                                v-if="showFormItem(formItem, postForm) && formItem.value.type==='search_bar'"
                                :index="index"
                                :hosts="postForm.body[index]"
                                :attr-list="formItem"
                                :limit="getLimitQuantity(formItem, postForm, applyData, index)"
                                @on-hosts-change="onHostsChange">
                              </search-bar>
                              <body-table
                                v-if="showFormItem(formItem, postForm) && formItem.value.type==='table'"
                                :form-data="formItem"
                                :item="postForm.body[index]"
                                :post-form="postForm"
                                :index="index"
                                :bodyTable="true">
                              </body-table>
                            </span>
                          </div>
                        </div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </template>
          </el-form>
        </el-card>
        <div class="btn-area">
          <!-- :disabled="validateForm" -->
          <el-button type="primary" @click="onSubmit" icon="check">确认</el-button>
          <!-- <el-button type="primary" @click="onModify" icon="check" v-if="isEditing">确认</el-button> -->
          <el-button :plain="true" type="primary" @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import formBody from '../../_plugins/_formBody'
  import searchBar from '../../_plugins/_searchBar'
  import headerTable from '../../_plugins/_headerTable'
  import bodyTable from '../../_plugins/_bodyTable'

  export default {
    data () {
      return {
        toCopy: false,
        postForm: {
          header: {},
          body: []
        },
        existingForm: {},
        hostList: [],
        taskFormData: {},
        validateForm: true,
        tabsValue: '0',
        bodyLableName: []
      }
    },
    computed: {
      isEditing () {
        return !!this.$route.params.tid
      }
    },
    created () {
      this.renderForm()
    },
    watch: {
      'postForm': {
        handler: 'renderBodyLabel',
        deep: true
      }
    },
    methods: {
      renderBodyLabel (val) {
        this.bodyLabel(this.taskFormData, val, val, this.bodyLableName)
      },
      onHostsChange (val) {
        console.log(val)
        this.hostList = []
        // this.postForm.header[this.deviceType] = val
        this.hostList = val
        // ④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
      },
      renderForm () {
        const renderFromData = {
          // action: 'runtime/task',
          action: 'activiti/task/form/group',
          method: 'GET',
          data: {
            pkey: this.$route.params.pkey,
            tkey: 'start'
            // taskId: this.$route.params.tid
          }
        }
        this.http.post('', this.parseData(renderFromData)).then((res) => {
          // console.log(res)
          this.taskFormData = res.data.data.form
          // this.taskFormData = res.data.data.variables.message[0].form
          // console.log(this.taskFormData)
          this.taskFormData.header.map(group => {
            group.value.map(item => {
              this.setDataType(item, this.postForm.header, this)
              if (item.value.type === 'table') {
                // TODO 这里就要判断 table 的个数，然后生成对应的 table 的 key 空值 等待填入
                item.value.attr_list.map(list => {
                  this.setDataType(list, this.postForm.header[item.id][0], this)
                })
              }
              if (item.show.type) {
                if (item.show.type === 'form_header') {
                  this.$watch('postForm.header.' + item.show.key_path, (newVal, oldVal) => {
                    if (item.show.op === 'eq' && newVal === item.show.value) {
                      this.setDataType(item, this.postForm.header, this)
                    } else if (item.show.op === 'neq' && newVal !== item.show.value) {
                      this.setDataType(item, this.postForm.header, this)
                    } else if (item.show.op === 'reg' && newVal.includes(item.show.value)) {
                      this.setDataType(item, this.postForm.header, this)
                    } else {
                      delete this.postForm.header[item.id]
                    }
                  })
                }
              }
              // 有默认值时 应该只有 form_header 1种，这个是发起流程没有历史信息，header的默认值不应该来自body
              if (item.default && item.default.type) {
                if (item.default.type === 'form_header') {
                  this.$watch('postForm.header.' + item.default.key_path, (newVal, oldVal) => {
                    this.postForm.header[item.id] = newVal
                  })
                }
              }
            })
          })
          // let newData = {}
          this.taskFormData.body.body_list.forEach(body => {
            if (body.show.type) {
              // const keyPath = body.show.key_path.split('.')
              if (body.show.type === 'form_header') {
                this.$watch('postForm.header.' + body.show.key_path, (newVal, oldVal) => {
                  this.$set(this.postForm, 'body', [{}]) // 切换设备类型时，初始化表单数据
                  this.taskFormData.body.body_list.map(bodyList => {
                    if (this.showBodyList(bodyList, this.postForm, this.applyData)) {
                      bodyList.attr_list.map(group => {
                        group.value.map(value => {
                          this.setDataType(value, this.postForm.body[0], this)
                          // 有默认值时 只有 form_body 和 form_header 2种
                          if (value.default && value.default.type) {
                            if (value.default.type === 'form_body') {
                              this.$watch('postForm.body.0.' + value.default.key_path, (newVal, oldVal) => {
                                this.postForm.body[0][value.id] = newVal
                              })
                            } else if (value.default.type === 'form_header') {
                              this.$watch('postForm.body.0.' + value.default.key_path, (newVal, oldVal) => {
                                this.postForm.body[0][value.id] = newVal
                              })
                            }
                          }
                        })
                      })
                    }
                  })
                })
              }
            } else {
              this.$set(this.postForm, 'body', [{}])
              body.attr_list.map(group => {
                group.value.map(value => {
                  if (value.need_submit) {
                    this.setDataType(value, this.postForm.body[0], this)
                    if (value.value.type === 'table') {
                      // TODO 这里就要判断 table 的个数，然后生成对应的 table 的 key 空值 等待填入
                      this.$set(this.postForm.body[0], value.id, [])
                      this.$set(this.postForm.body[0][value.id], 0, {})
                      value.value.attr_list.map(item => {
                        this.setDataType(item, this.postForm.body[0][value.id], this)
                        // console.log(this.postForm.body[0][value.id])
                      })
                    }
                    console.log(this.postForm.body[0][value.id])
                    // 有默认值时 只有 form_body 和 form_header 2种
                    if (value.default && value.default.type) {
                      if (value.default.type === 'form_body') {
                        this.$watch('postForm.body.0.' + value.default.key_path, (newVal, oldVal) => {
                          this.postForm.body[0][value.id] = newVal
                        })
                      } else if (value.default.type === 'form_header') {
                        this.$watch('postForm.body.0.' + value.default.key_path, (newVal, oldVal) => {
                          this.postForm.body[0][value.id] = newVal
                        })
                      }
                    }
                  }
                })
              })
            }
          })
          if (this.isEditing) this.injectValues() // 是编辑
        })
      },
      injectValues () {
        const postData = {
          action: 'runtime/task',
          method: 'GET',
          data: { taskId: this.$route.params.tid }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          const data = res.data.data.variables.message[0].form
          this.postForm.header = Object.assign({}, this.postForm.header, data.header)
          // this.postForm && this.postForm.body.map((body, bodyindex) => {
          //   console.log(body)
          //   // body = Object.assign({}, body, data.body[bodyindex])
          // })
          // this.postForm.body.forEach((body, index) => {
          //   console.log(body)
          // })
          for (const id in this.postForm) {
            console.log(this.postForm[id])
          }
        })
      },
      handleClick (val) {
        console.log(val)
      },
      // validateFormFunction () {
      //   this.$refs['postForm'].validate((valid) => {
      //     if (valid) {
      //       this.validateForm = false
      //     } else {
      //       this.validateForm = true
      //     }
      //   })
      // },
      resetForm (formName) {
        console.log(this.$refs)
        this.$refs[formName].resetFields()
      },
      removeTab (targetName) {
        console.log(targetName)
        // let tabs = this.postForm.body
        // let activeName = this.tabsValue
        // // if (activeName === targetName) {
        // tabs.forEach((tab, index) => {
        //   // if (index === +targetName) {
        //   let nextTab = tabs[index + 1] || tabs[index - 1]
        //   if (nextTab) {
        //     activeName = tabs.indexOf(nextTab)
        //   }
        //   // }
        // })
        // // }
        // this.tabsValue = activeName + ''
        // this.postForm.body.splice(targetName, 1)
      },
      addTab (targetName) {
        var that = this
        let newData = {}
        if (that.toCopy) {
          // 需要复制时，这里去除唯一值
          this.taskFormData.body.body_list.map(bodyList => {
            if (this.showBodyList(bodyList, this.postForm, this.applyData)) {
              bodyList.attr_list.map(group => {
                group.value.map(item => {
                  this.setNewDataType(item, newData)
                  if (!item.unique) {
                    // dict、dicts 无法赋值，因为 needCMDBData 每一次请求把值清空了（防止被watch时留有原值）
                    newData[item.id] = this.postForm.body[this.tabsValue][item.id]
                  }
                })
              })
            }
          })
        } else {
          // 直接新增不复制，按原 taskFormData 重新赋对应结构的空值
          this.taskFormData.body.body_list.map(bodyList => {
            if (this.showBodyList(bodyList, this.postForm, this.applyData)) {
              bodyList.attr_list.map(group => {
                group.value.map(item => {
                  this.setNewDataType(item, newData)
                })
              })
            }
          })
        }
        // console.log(newData)
        this.$refs['postForm'].validate((valid) => {
          if (valid) {
            if (that.postForm.body.length < this.taskFormData.body.count.max) {
              that.postForm.body.push(newData)
              this.tabsValue = that.postForm.body.length - 1 + ''
            } else {
              that.$message.warning(`最多只能增加${this.taskFormData.body.count.max}个设备！`)
            }
          } else {
            that.$message.warning('请填写完整当前表单')
          }
        })
      },
      onSubmit () {
        this.taskFormData.header.map(header => {
          header.value.map(item => {
            if (item.show.type) {
              // show.type 有四种类型
              if (item.show.type === 'form_header') {
                if (this.getPathResult(this.postForm.header, item.show.key_path) === item.show.value) {
                  if (item.value.type === 'search_bar') {
                    this.postForm.header[item.id] = this.hostList
                  }
                }
              }
            }
          })
        })
        this.$confirm('确定提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          const ref = this.$refs['postForm'].fields.length !== 0
          if (ref) { // 有表单的情况下，表单的自验证
            this.$refs['postForm'].validate((valid) => {
              if (valid) {
                console.log(this.postForm.body)
                if (this.postForm.body) {
                  for (const data of this.postForm.body) { // 用 for...of 可以轻松退出循环
                    for (const item in data) {
                      if (Array.isArray(data[item]) && data[item].length === 0) {
                        // 判断这个数组是不是必填
                        for (const body of this.taskFormData.body.body_list) {
                          for (const attr of body.attr_list) {
                            for (const value of attr.value) {
                              if (value.id === item && value.required) {
                                this.$message.warning(`${value.name}未填写！`)
                                return false
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
                if (this.postForm.header) {
                  for (const item in this.postForm.header) {
                    if (Array.isArray(this.postForm.header[item]) && this.postForm.header[item].length === 0) {
                      // 判断这个数组是不是必填
                      for (const header of this.taskFormData.header) {
                        for (const value of header.value) {
                          if (value.id === item && value.required) {
                            this.$message.warning(`${value.name}未填写！`)
                            return false
                          }
                        }
                      }
                    }
                  }
                }
                this.postMethod(this.postForm)
                // console.dir(this.postForm)
              } else {
                console.log('error submit!!')
                this.$message.warning('表单未填写完成！')
                return false
              }
            })
          } else { // 无表单时，需要验证有无选设备，因为选设备不在表单验证范围
            this.taskFormData.body.body_list.map(bodyList => {
              if (!bodyList.show.type) {
                bodyList.attr_list.map(attrList => {
                  if (attrList.value.some(value => { return value.value.type === 'search_bar' })) {
                    attrList.value.map(value => {
                      if (value.value.type === 'search_bar') {
                        this.postForm.body.map((postbody, postbodyIndex) => {
                          if (postbody[value.id].length === 0) {
                            this.$message.warning(`未选择${value.name}`)
                            return false
                          }
                        })
                      }
                    })
                  } else {
                    this.postMethod(this.postForm)
                  }
                })
              }
            })
            this.taskFormData.header.map(header => {
              if (header.value.some(value => { return value.value.type === 'search_bar' })) {
                header.value.map(value => {
                  if (value.value.type === 'search_bar') {
                    if (this.postForm.header[value.id].length === 0) {
                      this.$message.warning(`未选择${value.name}`)
                      return false
                    }
                  }
                })
              } else {
                this.postMethod(this.postForm)
              }
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      onModify () {
        let { pid, pkey, tkey, tid } = this.$route.params
        let postData = {
          action: 'modify/form/data',
          method: 'POST',
          data: {
            pid,
            pkey,
            tkey,
            form: this.postForm
          }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.$message.success('修改事件成功！')
            this.$router.push(`/event-hub/event/${tid}`)
          }
        })
      },
      postMethod (data) {
        let postFormData = {
          header: {},
          body: []
        }
        for (const headerid in data.header) {
          if (Array.isArray(data.header[headerid])) {
            if (data.header[headerid].length !== 0) {
              postFormData.header[headerid] = data.header[headerid]
            }
          } else if (data.header[headerid]) {
            postFormData.header[headerid] = data.header[headerid]
          }
        }
        data.body.map((body, bodyIndex) => {
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
        let postData
        let { pid, pkey, tkey, tid } = this.$route.params
        if (this.isEditing) {
          postData = {
            action: 'modify/form/data',
            method: 'POST',
            data: {
              pid,
              pkey,
              tkey,
              form: postFormData
            }
          }
        } else {
          postData = {
            action: 'runtime/process/instances',
            method: 'POST',
            data: {
              pkey: this.$route.params.pkey,
              form: postFormData
            }
          }
        }
        console.log(postFormData)
        this.http.post('', this.parseData(postData))
          .then((res) => {
            if (res && res.status === 200) {
              this.$message({
                message: '成功!',
                type: 'success'
              })
              if (this.isEditing) {
                this.$router.push(`/event-hub/event/${tid}`)
              } else if (this.$route.params.pkey === 'easyops_monitor') {
                this.$router.push('/alarm') // 告警处理成功后跳转告警事件
              } else if (this.$route.params.pkey === 'incident') {
                this.$router.push('/event-hub') // 跳转事件管理
              } else {
                this.$router.push('/orders') // 跳转工单管理
              }
            } else if (res && res.status === 406) {
              this.$message.error(res.errorMessage)
            }
          })
      },
      cancel () {
        this.$router.go(-1) // 跳转历史的上一页
      }
    },
    components: {
      bodyTable,
      headerTable,
      formBody,
      searchBar
    }
  }
</script>
