<template>
  <div id="item1-side" class="wrapper">
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

          <el-form label-position="right" ref="postForm" :model="postForm" :inline="true" label-width="100px">
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
                    :form-data="task"
                    :item="postForm.header"
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
                  <el-tab-pane v-for="(data, index) in postForm.body" :key="index" :label="bodyLableName[index]" :name="index + ''" :closable="postForm.body.length !== 1">
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
                <div class="tab-wrap" v-for="(data, index) in postForm.body" :key="index">
                  <el-button size="small" @click="addTab(tabsValue, index)" icon="plus" class="add-tab">复制当前表单</el-button>
                  <el-tabs :id="'anchor-'+index" type="border-card" class="margin-bottom" @tab-remove="removeTab(index)" @tab-click="handleClick" :closable="postForm.body.length !== 1">
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
        this.taskFormData.header.map(header => {
          header.value.map(item => {
            if (item.show.type) {
              // show.type 有四种类型
              if (item.show.type === 'form_header') {
                if (this.getPathResult(this.postForm.header, item.show.key_path) === item.show.value) {
                  if (item.value.type === 'search_bar') {
                    this.postForm.header[item.id] = []
                    this.postForm.header[item.id] = val
                  }
                }
              }
            } else {
              if (item.value.type === 'search_bar') {
                this.postForm.header[item.id] = []
                this.postForm.header[item.id] = val
              }
            }
          })
        })
        // ④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
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
                      // delete this.postForm.header[item.id]
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
                          if (value.value.type === 'table') {
                            // TODO 这里就要判断 table 的个数，然后生成对应的 table 的 key 空值 等待填入
                            this.$set(this.postForm.body[0], value.id, [])
                            this.$set(this.postForm.body[0][value.id], 0, {})
                            value.value.attr_list.map(item => {
                              this.setDataType(item, this.postForm.body[0][value.id], this)
                              // console.log(this.postForm.body[0][value.id])
                            })
                          }
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
        // if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          // if (index === +targetName) {
          let nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab) {
            activeName = tabs.indexOf(nextTab)
          }
          // }
        })
        // }
        this.tabsValue = activeName + ''
        // console.log(targetName)
        this.postForm.body.splice(targetName, 1)
        console.log(this.postForm.body.splice(targetName, 1))
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
                    // dict、dicts 无法赋值，因为 needCMDBData 每一次请求把值清空了（防止被watch时留有原值）
                    if (index !== undefined) {
                      newData[item.id] = this.postForm.body[index][item.id]
                    } else {
                      newData[item.id] = this.postForm.body[this.tabsValue][item.id]
                    }
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
