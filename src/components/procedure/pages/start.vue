<template>
  <div class="wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3 class="form-title">{{ $route.params.pname }}</h3>
          <el-row type="flex" justify="space-between" v-if="uploadExcel">
            <el-col>
              <el-upload
                action="/api/upload_file/"
                accept=".xls,.xlsx"
                :on-success="onUploadExcel"
                :on-change="excelFileChange"
                :file-list="excelList"
                class="margin-bottom">
                <el-button icon="fa-file-excel-o" type="primary">{{uploadExcel.upload.name}}</el-button>
                <div class="el-upload__tip" slot="tip">只能上传 Excel 文档</div>
              </el-upload>
            </el-col>
            <el-col style="text-align: right;">
              <upLoadExcelButton :download="uploadExcel.download"></upLoadExcelButton>
            </el-col>
          </el-row>

          <el-form label-position="right" ref="postForm" :model="postForm" :inline="true" label-width="105px">
            <!-- header 表单填写 -->
            <div v-if="taskFormData.header" ref="header">
              <div v-for="(task, index) in taskFormData.header" :key="index">
                <h5>{{task.name}}</h5>
                <span v-for="taskform in task.value" :key="taskform.id">
                  <form-body
                    :data-class="taskform.id"
                    v-if="showFormItem(taskform, postForm)"
                    :item="postForm.header"
                    :form-item="taskform"
                    :whole="postForm"
                    :is-editing="isEditing"
                    :header="true">
                  </form-body>
                  <search-bar
                    :data-class="taskform.id"
                    v-if="showFormItem(taskform, postForm) && taskform.value.type==='search_bar'"
                    :hosts="postForm.header"
                    :attr-list="taskform"
                    :limit="getLimitQuantity(taskform, postForm)"
                    :post-form="postForm"
                    :header="true"
                    @on-hosts-change="onHostsChange">
                  </search-bar>
                  <header-table
                    :data-class="taskform.id"
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
                  <el-tab-pane v-for="(data, index) in postForm.body" :key="index" :label="bodyLableName[index]" :name="index + ''" :closable="isClosable" :ref="'body'+index">
                    <div v-if="taskFormData.body && taskFormData.body.body_list.length !== 0" >
                      <div v-for="bodyList in taskFormData.body.body_list" :key="bodyList.name">
                          <div v-if="showBodyList(bodyList, postForm, applyData, index)">
                            <div class="form-block" v-for="formBlock in bodyList.attr_list" :key="formBlock.name">
                              <h5>{{formBlock.name}}</h5>
                              <span v-for="formItem in formBlock.value" :key="formItem.id">
                                <form-body
                                  :data-class="formItem.id"
                                  v-if="showFormItem(formItem, postForm, false, false, false, index)"
                                  :item="postForm.body[index]"
                                  :form-item="formItem"
                                  :whole="postForm"
                                  :is-editing="isEditing"
                                  :index="+index">
                                </form-body>
                                <search-bar
                                  :data-class="formItem.id"
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
                                  :data-class="formItem.id"
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
                  <el-button size="small" @click="addTab(tabsValue, index)" icon="fa-copy" class="add-tab">复制当前表单</el-button>
                  <el-tabs type="border-card" class="margin-bottom" @tab-remove="removeTab(index)" @tab-click="handleClick" :closable="isClosable">
                    <el-tab-pane :label="bodyLableName[index]" :ref="'body' + index">
                      <div v-if="taskFormData.body && taskFormData.body.body_list.length !== 0">
                        <div v-for="bodyList in taskFormData.body.body_list" :key="bodyList.name">
                            <div v-if="showBodyList(bodyList, postForm, applyData, index)">
                              <div class="form-block" v-for="formBlock in bodyList.attr_list" :key="formBlock.name">
                                <h5>{{formBlock.name}}</h5>
                                <span v-for="formItem in formBlock.value" :key="formItem.id">
                                  <form-body
                                    :data-class="formItem.id"
                                    v-if="showFormItem(formItem, postForm)"
                                    :item="postForm.body[index]"
                                    :form-item="formItem"
                                    :whole="postForm"
                                    :is-editing="isEditing"
                                    :index="+index"
                                    :tempSave="tempSave">
                                  </form-body>
                                  <search-bar
                                    :data-class="formItem.id"
                                    v-if="showFormItem(formItem, postForm) && formItem.value.type==='search_bar'"
                                    :index="index"
                                    :hosts="postForm.body[index]"
                                    :attr-list="formItem"
                                    :is-editing="isEditing"
                                    :limit="getLimitQuantity(formItem, postForm, applyData, index)"
                                    @on-hosts-change="onHostsChange">
                                  </search-bar>
                                  <body-table
                                    :data-class="formItem.id"
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
  import upLoadExcelButton from '../../_plugins/_upLoadExcelButton'

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
        submitLoading: false,
        startTime: '',
        endTime: '',
        uploadExcel: {}
      }
    },
    computed: {
      tempSave () {
        return this.taskFormData.body && this.taskFormData.body.count.type === 'static'
      },
      isEditing () {
        return !!this.$route.params.tid || this.$route.params.pkey === 'Storage'
      }
    },
    created () {
      this.startTime = new Date()
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
      onHostsChange (val, index, id, header) {
        // console.log(val)
        // this.hostList = []
        // this.hostList = val
        // ④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
        if (header) {
          this.taskFormData.header.map(header => {
            header.value.map(item => {
              if (item.show.type) {
                // show.type 有四种类型
                if (item.show.type === 'form_header') {
                  if ((item.show.op === 'eq' && this.getPathResult(this.postForm.header, item.show.key_path) === item.show.value) ||
                      (item.show.op === 'neq' && this.getPathResult(this.postForm.header, item.show.key_path) !== item.show.value) ||
                      (item.show.op === 'reg' && item.show.value.includes(this.getPathResult(this.postForm.header, item.show.key_path)))) {
                    if (item.id === id) { // onHostsChange 可以传一个 id header 出来，直接分header赋值给对应id
                      this.postForm.header[item.id] = val
                    }
                  }
                }
              } else {
                if (item.id === id) {
                  // this.postForm.header[item.id] = []
                  this.postForm.header[item.id] = val
                }
              }
            })
          })
        } else {
          this.taskFormData.body.body_list.map(bodyList => {
            if (this.showBodyList(bodyList, this.postForm, this.applyData, index)) {
              bodyList.attr_list.map(list => {
                list.value.map(item => {
                  if (this.showFormItem(item, this.postForm, this.applyData, true, true, index)) {
                    if (item.id === id) { // onHostsChange 可以传一个 id header 出来，直接分header赋值给对应id
                      this.postForm.body[index][item.id] = val
                    }
                  }
                })
              })
            }
          })
        }
        // 验证searchbar一个符不符合规则
        if (header) {
          let key = `header.${id}`
          console.log(key)
          this.$refs['postForm'].validateField(key)
        } else {
          let key = `body.${index}.id`
          console.log(key)
          this.$refs['postForm'].validateField(key)
        }
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
          this.uploadExcel = res.data.data.upload_excel
          this.taskFormData.header.map(group => {
            group.value.map(item => {
              if (this.showFormItem(item, this.postForm)) {
                this.setDataType(item, this.postForm.header)
              }
              if (item.show.type === 'form_header') {
                this.$watch('postForm.header.' + item.show.key_path, (newVal, oldVal) => {
                  this.setDataType(item, this.postForm.header)
                })
              }
            })
          })
          // body 个数动态配置
          if (this.taskFormData.body.count.type === 'form_header') {
            let prefix = this.taskFormData.body.count
            this.$watch('postForm.header.' + prefix.key_path, (newVal, oldVal) => {
              console.log(newVal.length, oldVal.length)
              if (newVal.length > oldVal.length) {
                // 有默认值的关系所以第一次选中不用加body
                if (newVal.length !== 1) {
                  // 加减能正常执行还未解决
                  this.addTab()
                }
              } else { if (newVal.length) this.removeTab() }
            })
          }
          this.taskFormData.body.body_list.forEach((body, k) => {
            // body显示条件配置
            if (body.show.type) {
              if (body.show.type === 'form_header') {
                this.$watch('postForm.header.' + body.show.key_path, (newVal, oldVal) => {
                  console.log(newVal, oldVal)
                  this.taskFormData.body.body_list.map(bodyList => {
                    if (this.showBodyList(bodyList, this.postForm)) {
                      this.$set(this.postForm, 'body', [{}]) // 初始化表单数据
                      bodyList.attr_list.map(group => {
                        group.value.map(value => {
                          if (this.showFormItem(value, this.postForm)) {
                            this.setDataType(value, this.postForm.body[0])
                          }
                          if (value.show.type) {
                            if (value.show.type === 'form_header') {
                              this.$watch('postForm.header.' + value.show.key_path, (newVal, oldVal) => {
                                if (this.showFormItem(value, this.postForm)) {
                                  console.log('set', value.name)
                                  this.setDataType(value, this.postForm.body[0])
                                }
                              })
                            } else if (value.show.type === 'form_body') {
                              this.$watch('postForm.body.' + k + '.' + value.show.key_path, (newVal, oldVal) => {
                                if (newVal || (!newVal && oldVal)) {
                                  console.log(value.id)
                                  if (this.showFormItem(value, this.postForm, false, false, false, k)) {
                                    this.setDataType(value, this.postForm.body[k])
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
                    if (this.showFormItem(value, this.postForm)) {
                      this.setDataType(value, this.postForm.body[k])
                    }
                    if (value.show.type === 'form_header') {
                      this.$watch('postForm.header.' + value.show.key_path, (newVal, oldVal) => {
                        if (this.showFormItem(value, this.postForm)) {
                          this.setDataType(value, this.postForm.body[k])
                        }
                      })
                    } else if (value.show.type === 'form_body') {
                      this.$watch('postForm.body.' + k + '.' + value.show.key_path, (newVal, oldVal) => {
                        console.log(newVal, oldVal)
                        if (this.showFormItem(value, this.postForm, false, false, false, k)) {
                          this.setDataType(value, this.postForm.body[k])
                        }
                      })
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
        tabs.forEach((tab, index) => {
          let nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab) {
            activeName = tabs.indexOf(nextTab)
          }
        })
        this.tabsValue = activeName + ''
        console.log(targetName)
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
        if (!targetName) {
          this.postForm.body.push(newData)
        } else {
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
        }
      },
      onSubmit () {
        // 避免ID相同导致关系不清在提交表单前才对数据进行删减
        if (this.$refs['header']) {
          let headerKeys = Array.from(this.$refs['header'].querySelectorAll('[data-class]')).map(_ => _.dataset.class)
          Object.keys(this.postForm.header).map(val => {
            if (!headerKeys.includes(val)) {
              this.$delete(this.postForm.header, val)
            }
          })
        }
        for (let i = 0; i < this.postForm.body.length; i++) {
          let bodykeys = this.$refs['body' + i][0].$children.filter(_ => _.$vnode.elm.dataset.class).map(val => val.$vnode.elm.dataset.class)
          console.log(bodykeys)
          Object.keys(this.postForm.body[i]).map(val => {
            if (!bodykeys.includes(val)) {
              this.$delete(this.postForm.body[i], val)
            }
          })
        }
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
        this.endTime = new Date()
        let durationTime = this.endTime - this.startTime
        console.log(durationTime)
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
              form: postFormData,
              duration: durationTime
            }
          }
        }
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
        console.log(anchor.offsetParent.offsetTop)
        console.log(document.body.scrollTop)
        document.documentElement.scrollTop = anchor.offsetParent.offsetTop
      },
      onUploadExcel (res, file, fileList) {
        console.log(res.data[0])
        let postData = {
          action: 'form/data/with/excel',
          method: 'POST',
          data: {
            file_name: res.data[0].file_name,
            action: this.uploadExcel.upload.action
          }
        }
        this.http.post('/api/data/', postData).then((res) => {
          if (res.status === 200) {
            // console.log(res.data.data)
            this.postForm.body = res.data.data.body
            this.postForm.header = res.data.data.header
            // setTimeout(() => {
            //   this.postForm.body = this.postForm.body.map((body, bodyindex) => {
            //     return Object.assign({}, body, res.data.data.body[bodyindex])
            //   })
            // }, 500)
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
      searchBar,
      upLoadExcelButton
    }
  }
</script>
