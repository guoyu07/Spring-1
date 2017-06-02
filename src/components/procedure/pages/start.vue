<template>
  <div id="item1-side" class="wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="24">
        <el-card class="box-card">
          <h3 class="form-title">{{ $route.params.pname }}</h3>
          <el-form label-position="left" ref="postForm" :model="postForm" :inline="true">
            <!-- header 表单填写 -->
            <div v-if="taskFormData.header">
              <div v-for="task in taskFormData.header">
                <span v-for="taskform in task.value">
                  <form-body
                    v-if="showFormItem(taskform, postForm)"
                    :item="postForm.header"
                    :form-item="taskform"
                    :whole="postForm"
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
            <el-tabs class="margin-bottom" type="border-card" @tab-click="handleClick" v-if="postForm.body && postForm.body.length !== 0">
              <el-tab-pane v-for="(data, index) in postForm.body" :label="'body' + (index+1)">
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
                              :index="index"
                              keep-alive>
                            </form-body>
                            <search-bar
                              v-if="showFormItem(formItem, postForm, applyData) && formItem.value.type==='search_bar'"
                              :index="index"
                              :hosts="postForm.body[index]"
                              :attr-list="formItem"
                              :limit="getLimitQuantity(formItem, postForm, applyData, index)"
                              @on-hosts-change="onHostsChange">
                            </search-bar>
                            <body-table
                              v-if="showFormItem(formItem, postForm, applyData) && formItem.value.type==='table'"
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
          </el-form>
        </el-card>
        <div class="btn-area">
          <!-- :disabled="validateForm" -->
          <el-button type="primary" @click="onSubmit">确认</el-button>
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
        postForm: {
          header: {},
          body: []
        },
        hostList: [],
        taskFormData: {},
        validateForm: true
      }
    },
    created () {
      this.renderForm()
    },
    // watch: {
    //   'postForm': {
    //     handler: 'validateFormFunction',
    //     deep: true
    //   }
    // },
    methods: {
      onHostsChange (val) {
        // console.log(val)
        this.hostList = []
        // this.postForm.header[this.deviceType] = val
        this.hostList = val
        // ④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
      },
      renderForm () {
        const renderFromData = {
          action: 'activiti/task/form/group',
          method: 'GET',
          data: {
            pkey: this.$route.params.pkey,
            tkey: 'start'
          }
        }
        this.http.post('', this.parseData(renderFromData)).then((res) => {
          // console.log(res)
          this.taskFormData = res.data.data.form
          this.taskFormData.header.map(group => {
            group.value.map(item => {
              this.setDataType(item, this.postForm.header, this)
              if (item.show.type) {
                const key = []
                if (item.show.type === 'form_header') {
                  const keyPath = item.show.key_path.split('.')
                  if (!key.includes(keyPath[0])) {
                    key.push(keyPath[0])
                    this.$watch('postForm.header.' + keyPath[0], (newVal, oldVal) => {
                      const _value = newVal && newVal[keyPath[1]] || ''
                      this.deviceType = _value
                    })
                  }
                }
              }
            })
          })
          let newData = {}
          this.taskFormData.body.body_list.forEach(body => {
            if (body.show.type) {
              const keyPath = body.show.key_path.split('.')
              if (body.show.type === 'form_header') {
                this.$watch('postForm.header.' + keyPath[0], (newVal, oldVal) => {
                  this.$set(this.postForm, 'body', [{}]) // 切换设备类型时，初始化表单数据
                  body.attr_list.map(group => {
                    group.value.map(item => {
                      this.setDataType(item, this.postForm.body[0], this)
                    })
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
                    // 有默认值时 TODO：默认值暂时只写了 message_header 和 form_body 2种
                    if (value.default.type) {
                      if (value.default.type === 'message_header') {
                        newData[value.id] = this.getPathResult(this.applyData.header, value.default.key_path, 0)
                      } else if (value.default.type === 'form_body') {
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
                      if (Array.isArray(data[item]) && data[item].length === 0) { // 需要判断这个数组是不是必填
                        this.$message.warning('表单未填写完成！')
                        return false
                      }
                    }
                  }
                }
                if (this.postForm.header) {
                  for (const item in this.postForm.header) {
                    if (Array.isArray(this.postForm.header[item]) && this.postForm.header[item].length === 0) { // 需要判断这个数组是不是必填
                      this.$message.warning('表单未填写完成！')
                      return false
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
      postMethod (data) {
        // for (const headerid in data.header) {
        //   if (Array.isArray(data.header[headerid]) && data.header[headerid].length === 0) {
        //     delete data.header[headerid]
        //   }
        //   if (!data.header[headerid]) {
        //     delete data.header[headerid] // 删除头部空值
        //   }
        // }
        // data.body.map(body => {
        //   for (const bodyid in body) {
        //     if (Array.isArray(body[bodyid]) && body[bodyid].length === 0) {
        //       delete body[bodyid]
        //     }
        //     if (!body[bodyid]) {
        //       delete body[bodyid] // 删除body空值
        //     }
        //   }
        // })
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
        const postData = {
          action: 'runtime/process/instances',
          method: 'POST',
          data: {
            pkey: this.$route.params.pkey,
            form: postFormData
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
