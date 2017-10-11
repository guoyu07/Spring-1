<template>
  <div class="wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="24">
        <el-card class="box-card">
          <h3 class="form-title">{{ $route.params.pname }}</h3>

          <el-row type="flex" justify="space-between" v-if="$route.params.pkey === 'Storage'">
            <el-col>
              <el-upload
                action="/api/upload_file/"
                accept=".xls,.xlsx"
                :on-success="onUploadExcel"
                :on-change="excelFileChange"
                :file-list="excelList"
                class="margin-bottom">
                <el-button icon="document" type="primary">上传入库单</el-button>
                <div class="el-upload__tip" slot="tip">只能上传 Excel 文档</div>
              </el-upload>
            </el-col>
            <el-col style="text-align: right;">
              <a class="el-button el-button--info is-plain" href="/api/data/?action=download/import/server/excel" target="_blank">下载示例文件</a>
            </el-col>
          </el-row>

          <el-form label-position="right" ref="postForm" :model="postForm" :inline="true" label-width="105px">
            <!-- header 表单填写 -->
            <div v-if="taskFormData.header">
              <div v-for="(task, index) in taskFormData.header" :key="index">
                <span v-for="taskform in task.value" :key="taskform.id">
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
                    :post-form="postForm"
                    :header="true"
                    @on-hosts-change="onHostsChange">
                  </search-bar>
                  <header-table
                    v-if="showFormItem(taskform, postForm) && taskform.value.type==='table'"
                    :form-data="taskform"
                    :item="postForm.header"
                    :postForm="postForm"
                    :headerTable="true">
                  </header-table>
                </span>
              </div>
            </div>
            <!-- body 表单填写 -->
            <template v-if="postForm.body && postForm.body.length !== 0">
              <template v-if="taskFormData.body && taskFormData.body.style === 1">
                <div v-if="taskFormData.body && taskFormData.body.count.type ==='static' && taskFormData.body.count.max > 1">
                  <el-button type="primary" size="small" icon="plus" class="margin-bottom" @click="addTab(tabsValue)">
                    增加
                  </el-button>
                  <el-checkbox style="margin-left:15px;" v-model="toCopy">复制当前表单</el-checkbox>
                </div>
                <el-tabs v-model="tabsValue" type="border-card" class="margin-bottom" @tab-remove="removeTab" @tab-click="handleClick">
                  <el-tab-pane v-for="(data, index) in postForm.body" :key="index" :label="bodyLableName[index]" :name="index + ''" :closable="isClosable">
                    <div v-if="taskFormData.body && taskFormData.body.body_list.length !== 0">
                      <div v-for="bodyList in taskFormData.body.body_list" :key="bodyList.name">
                          <div v-if="showBodyList(bodyList, postForm, applyData, index)">
                            <div class="form-block" v-for="formBlock in bodyList.attr_list" :key="formBlock.name">
                              <h5>{{formBlock.name}}</h5>
                              <span v-for="formItem in formBlock.value" :key="formItem.id">
                                <form-body
                                  v-if="showFormItem(formItem, postForm)"
                                  :item="postForm.body[index]"
                                  :form-item="formItem"
                                  :whole="postForm"
                                  :is-editing="isEditing"
                                  :index="+index">
                                </form-body>
                                <search-bar
                                  v-if="showFormItem(formItem, postForm) && formItem.value.type==='search_bar'"
                                  :index="index"
                                  :hosts="postForm.body[index]"
                                  :attr-list="formItem"
                                  :is-editing="isEditing"
                                  :limit="getLimitQuantity(formItem, postForm, applyData, index)"
                                  :post-form="postForm"
                                  @on-hosts-change="onHostsChange">
                                </search-bar>
                                <body-table
                                  v-if="showFormItem(formItem, postForm) && formItem.value.type==='table'"
                                  :form-data="formItem"
                                  :item="postForm.body[index]"
                                  :post-form="postForm"
                                  :index="index"
                                  :is-editing="isEditing"
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
              <template v-if="taskFormData.body && taskFormData.body.style === 2">
                <div class="tab-wrap" v-for="(data, index) in postForm.body" :key="index" :id="'anchor-'+index">
                  <el-button size="small" @click="addTab(tabsValue, index)" icon="plus" class="add-tab">复制当前表单</el-button>
                  <el-tabs type="border-card" class="margin-bottom" @tab-remove="removeTab(index)" @tab-click="handleClick" :closable="isClosable">
                    <el-tab-pane :label="bodyLableName[index]">
                      <div v-if="taskFormData.body && taskFormData.body.body_list.length !== 0">
                        <div v-for="bodyList in taskFormData.body.body_list" :key="bodyList.name">
                            <div v-if="showBodyList(bodyList, postForm, applyData, index)">
                              <div class="form-block" v-for="formBlock in bodyList.attr_list" :key="formBlock.name">
                                <h5>{{formBlock.name}}</h5>
                                <span v-for="formItem in formBlock.value" :key="formItem.id">
                                  <form-body
                                    v-if="showFormItem(formItem, postForm)"
                                    :item="postForm.body[index]"
                                    :form-item="formItem"
                                    :whole="postForm"
                                    :is-editing="isEditing"
                                    :index="+index">
                                  </form-body>
                                  <search-bar
                                    v-if="showFormItem(formItem, postForm) && formItem.value.type==='search_bar'"
                                    :index="index"
                                    :hosts="postForm.body[index]"
                                    :attr-list="formItem"
                                    :is-editing="isEditing"
                                    :limit="getLimitQuantity(formItem, postForm, applyData, index)"
                                    @on-hosts-change="onHostsChange">
                                  </search-bar>
                                  <body-table
                                    v-if="showFormItem(formItem, postForm) && formItem.value.type==='table'"
                                    :form-data="formItem"
                                    :item="postForm.body[index]"
                                    :post-form="postForm"
                                    :is-editing="isEditing"
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
                </div>
                <el-row v-if="taskFormData.body && taskFormData.body.count.type ==='static' && taskFormData.body.count.max > 1">
                  <el-button class="margin-bottom" type="primary" icon="plus" size="small" :plain="true" @click="addTab(tabsValue)">新表单</el-button>
                </el-row>
              </template>

             <!--  <el-upload
                action="/api/upload_file/"
                accept=".xls,.xlsx"
                :on-success="onUploadExcel"
                v-if="$route.params.pkey === 'Storage'">
                <el-button size="small" icon="document" type="primary">上传入库单</el-button>
                <div class="el-upload__tip" slot="tip">只能上传 Excel 文档</div>
              </el-upload> -->
            </template>
          </el-form>
        </el-card>
        <!-- 新样式才有锚点 -->
        <div class="anchorNav" v-if="taskFormData.body && taskFormData.body.style === 2">
          <a href="javascript:void(0)" v-for="(data, index) in postForm.body" @click="goAnchor('#anchor-'+index)" :key="index"> {{ index + 1 }} </a>
        </div>
        <div class="btn-area">
          <el-button type="primary" @click="onSubmit" icon="check" :loading="submitLoading">确认</el-button>
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
        tabsValue: '0',
        tabsIndex: 0,
        isClosable: true,
        bodyLableName: [],
        Editdata: {},
        submitLoading: false
      }
    },
    computed: {
      isEditing () {
        return !!this.$route.params.tid || this.$route.params.pkey === 'Storage'
      }
    },
    created () {
      this.renderForm()
    },
    watch: {
      'postForm': {
        handler: 'renderBodyLabel',
        deep: true
      },
      'postForm.body' (newVal, oldVal) {
        if (this.taskFormData.body.count.type === 'form_header') {
          this.isClosable = false
        } else {
          this.isClosable = newVal.length !== 1
        }
      }
    },
    methods: {
      excelFileChange (file, fileList) {
        this.excelList = fileList.slice(-1)
      },
      renderBodyLabel (val) {
        this.bodyLabel(this.taskFormData, val, val, this.bodyLableName)
      },
      onHostsChange (val) {
        // console.log(val)
        // this.hostList = []
        // this.hostList = val
        // ④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
        this.taskFormData.header.map(header => {
          header.value.map(item => {
            if (item.show.type) {
              // show.type 有四种类型
              if (item.show.type === 'form_header') {
                if ((item.show.op === 'eq' && this.getPathResult(this.postForm.header, item.show.key_path) === item.show.value) ||
                    (item.show.op === 'neq' && this.getPathResult(this.postForm.header, item.show.key_path) !== item.show.value) ||
                    (item.show.op === 'reg' && item.show.value.includes(this.getPathResult(this.postForm.header, item.show.key_path)))) {
                  if (item.value.type === 'search_bar') { // onHostsChange 可以传一个 id header 出来，直接分header赋值给对应id
                    this.postForm.header[item.id] = val
                  }
                }
              }
            } else {
              if (item.value.type === 'search_bar') {
                // this.postForm.header[item.id] = []
                this.postForm.header[item.id] = val
              }
            }
          })
        })
        this.$refs['postForm'].validate((valid) => {}) // 调用验证
      },
      renderForm () {
        const renderFromData = {
          // action: 'runtime/task',
          action: 'process/form/group',
          method: 'GET',
          data: {
            pkey: this.$route.params.pkey,
            tkey: 'start'
            // taskId: this.$route.params.tid
          }
        }
        this.http.post('/form/', this.parseData(renderFromData)).then((res) => {
          // console.log(res)
          this.taskFormData = res.data.data.form
          this.taskFormData.header.map(group => {
            group.value.map(item => {
              if (this.showFormItem(item, this.postForm)) {
                this.setDataType(item, this.postForm.header)
              }
              if (item.show.type === 'form_header') {
                this.$watch('postForm.header.' + item.show.key_path, (newVal, oldVal) => {
                  this.setDataType(item, this.postForm.header)
                  if (!this.showFormItem(item, this.postForm)) {
                    delete this.postForm.header[item.id]
                  }
                })
              }
            })
          })
          this.taskFormData.body.body_list.forEach(body => {
            if (body.show.type) {
              if (body.show.type === 'form_header') {
                this.$watch('postForm.header.' + body.show.key_path, (newVal, oldVal) => {
                  this.taskFormData.body.body_list.map(bodyList => {
                    if (this.showBodyList(bodyList, this.postForm)) {
                      this.$set(this.postForm, 'body', [{}]) // 初始化表单数据
                      bodyList.attr_list.map(group => {
                        group.value.map(value => {
                          // if (this.showFormItem(value, this.postForm)) {
                          //   this.setDataType(value, this.postForm.body[0])
                          // }
                          if (value.show.type) {
                            if (value.show.type === 'form_header') {
                              this.$watch('postForm.header.' + value.show.key_path, (newVal, oldVal) => {
                                if (this.showFormItem(value, this.postForm)) {
                                  console.log('set', value.name)
                                  this.setDataType(value, this.postForm.body[0])
                                } else {
                                  if (this.postForm.body[0]) {
                                    console.log('delete', value.name)
                                    delete this.postForm.body[0][value.id]
                                  }
                                }
                              })
                            }
                          } else {
                            this.setDataType(value, this.postForm.body[0])
                          }
                          // 渲染 body 个数
                          if (this.taskFormData.body.count.type === 'form_header') {
                            this.$watch('postForm.header.' + this.taskFormData.body.count.key_path, (newVal, oldVal) => {
                              if (Array.isArray(newVal) && newVal.length) {
                                this.$set(this.postForm.body, 0, {})
                                this.setDataType(value, this.postForm.body[0])
                                // i = 1 开始而不是从0开始，因为初始化默认会有一个body
                                for (let i = 1; i < newVal.length; i++) {
                                  if (this.postForm.body.length <= newVal.length) {
                                    this.$set(this.postForm.body, i, {})
                                    bodyList.attr_list.map(groupv => {
                                      groupv.value.map(valuev => {
                                        this.setDataType(valuev, this.postForm.body[i])
                                      })
                                    })
                                  } else {
                                    this.postForm.body.splice(i, 1)
                                  }
                                }
                                // 当 postForm body 长度为 2，newVal 长度为 1 时，规避以上for循环 i 和 newVal.length 同时为1时不执行
                                if (newVal.length === 1 && this.postForm.body.length > newVal.length) {
                                  this.postForm.body.splice(1, 1)
                                }
                              } else {
                                // 恢复初始化默认的body
                                this.setDataType(value, this.postForm.body[0])
                              }
                            }, { deep: true })
                          }
                        })
                      })
                    }
                  })
                  if (this.taskFormData.body.body_list.every(bodyList => { return !this.showBodyList(bodyList, this.postForm) })) {
                    console.log('delete body[0]')
                    // 若没有body 表单，删除整个body
                    this.postForm.body = []
                  }
                })
              }
            } else {
              this.$set(this.postForm, 'body', [{}])
              body.attr_list.map(group => {
                group.value.map(value => {
                  if (value.need_submit) {
                    this.setDataType(value, this.postForm.body[0])
                  }
                })
              })
            }
          })
          // console.log(this.postForm.body)
          if (this.isEditing && !this.$route.params.pkey === 'Storage') this.injectValues() // 是编辑
        })
      },
      injectValues () {
        const postData = {
          action: 'task',
          method: 'GET',
          data: { tid: this.$route.params.tid }
        }
        this.http.post('/flow/', this.parseData(postData)).then((res) => {
          this.Editdata = res.data.data.variables.message[0].form
          this.postForm.header = Object.assign({}, this.postForm.header, this.Editdata.header)
          setTimeout(() => {
            this.postForm.body = this.postForm.body.map((body, bodyindex) => {
              return Object.assign({}, body, this.Editdata.body[bodyindex])
            })
          }, 100)
        })
      },
      handleClick (val) {
        console.log(val)
      },
      resetForm (formName) {
        console.log(this.$refs)
        this.$refs[formName].resetFields()
      },
      removeTab (targetName) {
        let tabs = this.postForm.body
        let activeName = this.tabsValue
        tabs.forEach((tab, index) => {
          let nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab) {
            activeName = tabs.indexOf(nextTab)
          }
        })
        this.tabsValue = activeName + ''
        this.postForm.body.splice(targetName, 1)
      },
      addTab (targetName, index) {
        var that = this
        let newData = {}
        if (that.toCopy || index !== undefined) {
          // 需要复制时，这里去除唯一值
          this.taskFormData.body.body_list.map(bodyList => {
            if (this.showBodyList(bodyList, this.postForm, this.applyData)) {
              bodyList.attr_list.map(group => {
                group.value.map(item => {
                  this.setNewDataType(item, newData)
                  if (!item.unique) {
                    let bodyIndex = index !== undefined ? index : this.tabsValue
                    // console.log(this.postForm.body[bodyIndex][item.id])
                    if (item.value.type === 'table') {
                      // this.postForm.body[bodyIndex][item.id].map()
                    }
                    newData[item.id] = this.postForm.body[bodyIndex][item.id]
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
              console.log(newData)
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
        this.$confirm('确定提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.$refs['postForm'].validate((valid) => {
            console.log(valid)
            if (valid) {
              this.postMethod(this.postForm)
              // console.dir(this.postForm)
            } else {
              console.log('error submit!!')
              this.$message.warning('表单未填写完成！')
              return false
            }
          })
        }).catch(() => {
          this.submitLoading = false
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
        this.submitLoading = true
        let postFormData = {
          header: {},
          body: []
        }
        this.taskFormData.header.map(header => {
          header.value.map(item => {
            if (item.need_submit) {
              for (const headerid in data.header) {
                if (item.id === headerid) {
                  if (Array.isArray(data.header[headerid])) {
                    if (item.required || data.header[headerid].length !== 0) {
                      postFormData.header[headerid] = data.header[headerid]
                    }
                  } else if (data.header[headerid] || (typeof data.header[headerid] === 'number' && data.header[headerid] === 0)) {
                    // 整型为 0 时可以提交
                    postFormData.header[headerid] = data.header[headerid]
                  }
                }
              }
            }
          })
        })
        data.body.map((body, bodyIndex) => {
          postFormData.body[bodyIndex] = {}
          this.taskFormData.body.body_list.map(bodyList => {
            if (this.showBodyList(bodyList, this.postForm, this.applyData, bodyIndex)) {
              bodyList.attr_list.map(list => {
                list.value.map(item => {
                  if (item.need_submit) {
                    for (const bodyid in body) {
                      if (item.id === bodyid) {
                        if (Array.isArray(body[bodyid])) {
                          if (item.required || body[bodyid].length !== 0) {
                            postFormData.body[bodyIndex][bodyid] = body[bodyid]
                          }
                        } else if (body[bodyid] || (typeof body[bodyid] === 'number' && body[bodyid] === 0)) {
                          // 整型为 0 时可以提交
                          postFormData.body[bodyIndex][bodyid] = body[bodyid]
                        }
                      }
                    }
                  }
                })
              })
            }
          })
        })
        // console.log(postFormData)
        let postData
        let { pid, pkey, tkey, tid } = this.$route.params
        if (this.isEditing && this.$route.params.pkey !== 'Storage') {
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
            action: 'process',
            method: 'POST',
            data: {
              pkey: this.$route.params.pkey,
              form: postFormData
            }
          }
        }
        console.log(postFormData)
        this.http.post('/flow/', this.parseData(postData))
          .then((res) => {
            this.submitLoading = false
            if (res && res.status === 200) {
              this.$message({
                message: '成功!',
                type: 'success'
              })
              if (this.isEditing && this.$route.params.pkey !== 'Storage') {
                this.$router.push(`/event-hub/event/${tid}`)
              } else if (this.$route.params.pkey === 'easyops_monitor') {
                this.$router.push('/alarm') // 告警处理成功后跳转告警事件
              } else if (this.$route.params.pkey === 'incident') {
                this.$router.push('/event-hub') // 跳转事件管理
              } else {
                this.$router.push('/menu') // 跳转运维目录
              }
            } else if (res && res.status === 406) {
              this.$message.error(res.errorMessage)
            }
          })
      },
      cancel () {
        this.$router.go(-1) // 跳转历史的上一页
      },
      goAnchor (selector) {
        const anchor = this.$el.querySelector(selector)
        document.body.scrollTop = anchor.offsetTop
      },
      onUploadExcel (res, file, fileList) {
        console.log(res.data[0])
        let postData = {
          action: 'import_server',
          method: 'POST',
          data: { file_name: res.data[0].file_name }
        }
        this.http.post('/api/data/', postData).then((res) => {
          if (res.status === 200) {
            // console.log(res.data.data)
            this.postForm.body = res.data.data.body
            // setTimeout(() => {
            //   // this.postForm.body = this.postForm.body.map((body, bodyindex) => {
            //   //   return Object.assign({}, body, res.data.data.body[bodyindex])
            //   // })
            // }, 100)
            this.$refs['postForm'].validate((valid) => {
              if (valid) {
                // this.$message.success('成功')
              } else {
                this.$message.info('请补充完整当前表单')
              }
            })
            this.tabsValue = '0'
          }
        })
      }
      // downloadExcel () {
      //   // let postData = {
      //   //   action: 'download/import/server/excel',
      //   //   method: 'get'
      //   // }
      //   this.http.get('/data/?action=download/import/server/excel').then((res) => {
      //     if (res.status === 200) {
      //       this.$message.success('成功下载！')
      //     }
      //   })
      // }
    },
    components: {
      bodyTable,
      headerTable,
      formBody,
      searchBar
    }
  }
</script>
