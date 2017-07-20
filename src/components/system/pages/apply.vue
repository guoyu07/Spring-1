<template>
  <div id="item1-side" class="wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3>服务资源申请单</h3>
          <el-form ref="applyForm" :model="applyForm" label-width="100px" :inline="true">
            <!-- <header-form-structure :form-data="form.header" :item="applyForm.header"></header-form-structure> -->
            <div v-if="form.header">
              <div v-for="task in form.header">
                <span v-for="taskform in task.value">
                  <form-body
                    v-if="showFormItem(taskform, applyForm)"
                    :item="applyForm.header"
                    :form-item="taskform"
                    :whole="applyForm"
                    :header="true">
                  </form-body>
                  <!-- <search-bar
                    v-if="showFormItem(taskform, applyForm) && taskform.value.type==='search_bar'"
                    :hosts="applyForm.header"
                    :attr-list="taskform"
                    :limit="getLimitQuantity(taskform, applyForm)"
                    @on-hosts-change="onHostsChange">
                  </search-bar>
                  <header-table
                    v-if="showFormItem(taskform, applyForm) && taskform.value.type==='table'"
                    :form-data="task"
                    :item="applyForm.header"
                    :headerTable="true">
                  </header-table> -->
                </span>
              </div>
            </div>
          </el-form>
          <br>
          <el-button size="small" icon="plus" class="margin-bottom" @click="addTab(tabsValue)">
            增加服务器
          </el-button>
          <el-checkbox style="margin-left:15px;" v-model="toCopy">复制当前表单</el-checkbox>
          <el-form ref="applyForm" :model="applyForm" label-position="top" :inline="true">
            <el-tabs v-model="tabsValue" type="border-card" @tab-remove="removeTab">
              <el-tab-pane v-for="(item, index) in applyForm.body" :label="'服务资源' + (index + 1)" :name="index + ''" :closable="applyForm.body.length !== 1">
                <!-- <form-structure :form-data="form.body && form.body.body_list[0].attr_list" :item="item" :index="index"></form-structure> -->
                <div v-if="form.body && form.body.body_list.length !== 0">
                  <div v-for="bodyList in form.body.body_list">
                      <div v-if="showBodyList(bodyList, applyForm, applyData, index)">
                        <div class="form-block" v-for="formBlock in bodyList.attr_list">
                          <h5>{{formBlock.name}}</h5>
                          <span v-for="formItem in formBlock.value">
                            <form-body
                              v-if="showFormItem(formItem, applyForm)"
                              :item="applyForm.body[index]"
                              :form-item="formItem"
                              :whole="applyForm"
                              :index="index"
                              keep-alive>
                            </form-body>
                            <!-- <search-bar
                              v-if="showFormItem(formItem, applyForm) && formItem.value.type==='search_bar'"
                              :index="index"
                              :hosts="applyForm.body[index]"
                              :attr-list="formItem"
                              :limit="getLimitQuantity(formItem, applyForm, applyData, index)"
                              @on-hosts-change="onHostsChange">
                            </search-bar>
                            <body-table
                              v-if="showFormItem(formItem, applyForm) && formItem.value.type==='table'"
                              :form-data="formItem"
                              :item="applyForm.body[index]"
                              :post-form="applyForm"
                              :index="index"
                              :bodyTable="true">
                            </body-table> -->
                          </span>
                        </div>
                      </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-form>
          <div class="btn-area">
            <el-button type="primary" @click="onSubmit('applyForm')">立即创建</el-button>
            <el-button v-if="!editInfo.id" @click="resetForm('applyForm')">重置</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import formBody from '../../_plugins/_formBody'
  // import headerFormStructure from '../../_plugins/_headerFormStructure'
  export default {
    data () {
      return {
        toCopy: false,
        form: {},
        tabsValue: '0',
        tabIndex: 1,
        editInfo: {
          id: ''
        },
        // editData: {
        //   header: {},
        //   body: []
        // },
        // applyFormHead: {
        //   applyType: '',
        //   applicationName: ''
        // },
        applyForm: {
          header: {},
          body: [{}]
        },
        appList: [],
        businessList: []
      }
    },
    created () {
      this.renderTaskForm()
      this.editInfo.userName = window.localStorage.userName
      if (this.$route.params.id) {
        this.editInfo.id = this.$route.params.id
        this.renderInstanceDetail()
      }
    },
    watch: {
      '$route' (to, from) { // 复用组件时，想对路由参数的变化作出响应的话,你可以简单地 watch（监测变化） $route 对象
        this.editInfo = {
          id: ''
        }
      },
      'applyForm.body': {
        handler: (val, oldVal) => {
          for (const data of val) {
            data.score = (data.cpu * 1 + data.localStorage * 1 + data.hardDisk / 20) + ''
          }
        },
        deep: true
      }
    },
    methods: {
      renderTaskForm () { // 渲染表单数据
        const renderFromData = {
          action: 'activiti/task/form/group',
          method: 'GET',
          data: {
            pkey: 'host_apply',
            tkey: 'start'
          }
        }
        // this.loading = true
        this.http.post('', this.parseData(renderFromData)).then((res) => {
          this.form = res.data.data.form
          this.form.header.map(group => {
            group.value.map(item => {
              this.setDataType(item, this.applyForm.header, this)
              if (item.show.type) {
                if (item.show.type === 'form_header') {
                  this.$watch('applyForm.header.' + item.show.key_path, (newVal, oldVal) => {
                    if (item.show.op === 'eq' && newVal === item.show.value) {
                      this.setDataType(item, this.applyForm.header, this)
                    } else if (item.show.op === 'neq' && newVal !== item.show.value) {
                      this.setDataType(item, this.applyForm.header, this)
                    } else if (item.show.op === 'reg' && newVal.includes(item.show.value)) {
                      this.setDataType(item, this.applyForm.header, this)
                    } else {
                      delete this.applyForm.header[item.id]
                    }
                  })
                }
              }
            })
          })
          this.form.body.body_list[0].attr_list.map(group => {
            group.value.map(item => {
              this.setDataType(item, this.applyForm.body[0], this)
            })
          })
        })
      },
      renderInstanceDetail () {
        let postData = {
          action: 'runtime/task',
          method: 'GET',
          data: {
            taskId: this.editInfo.id
          }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          const message = res.data.data.variables.message
          this.applyForm = this.findTaskMsgR(message, ['start']).form
          // this.editData.applicationName = this.applyForm.applicationName
          // this.editData.business = this.applyForm.business
          // this.editData.opsManagers = this.applyForm.opsManagers
          // console.log(this.editData)
        })
      },
      handleRemove (tab) {
        this.applyForm.body.splice(tab.index, 1)
        // console.log(tab.index, this.instockForm.data)
      },
      handleClick (tab, event) {
        // console.log(tab.index, tab, event)
      },
      checkNumber (rule, value, callback) {
        if (!value) {
          return callback(new Error('不能为空'))
        }
        setTimeout(() => {
          if (value < 0) {
            callback(new Error('必须大于0'))
          } else {
            callback()
          }
        }, 1000)
      },
      onRecheckBusiness () {
        if (!this.businessList.some(business => business.name === this.applyForm.header.business.name)) { // 若项目组为新增，则先进行新增请求
          let postData = {
            action: `/object/instance/BUSINESS`,
            method: 'POST',
            data: { name: this.applyForm.header.business }
          }
          this.http.post('easyops/', this.parseData(postData)).then((res) => {
            // 新增毕，方出库
            this.onSubmit('applyForm')
          })
        } else {
          this.onSubmit('applyForm')
        }
      },
      onSubmit (applyForm) {
        console.log(this.applyForm)
        if (this.applyForm.header.applyType === '新建应用' && typeof this.applyForm.header.applicationName === 'object') {
          this.$message('请填写新建的应用名')
          return false
        }
        if (this.applyForm.header.applyType === '新建集群节点' && typeof this.applyForm.header.applicationName === 'string') {
          this.$message('请选择已有的应用名')
          return false
        }
        this.$refs[applyForm].validate((valid) => {
          if (valid) {
            this.$refs['applyForm'].validate(valid => {
              if (valid) {
                let postData = {}
                if (this.editInfo.id) {
                  postData = {
                    action: 'runtime/task/complete',
                    method: 'POST',
                    data: {
                      tid: this.editInfo.id,
                      form: this.applyForm // 通过审批 需要判断一下登录的账号的角色身份
                        // pass: "流程走向控制变量,整型(可选,默认为0)"
                    }
                  }
                } else {
                  postData = {
                    action: 'runtime/process/instances',
                    method: 'POST',
                    data: {
                      pkey: 'host_apply',
                      form: {
                        'body': this.applyForm.body,
                        'header': this.applyForm.header
                      }
                    }
                  }
                }
                this.http.post('', this.parseData(postData))
                .then((res) => {
                  // console.log(res, res.data.data)
                  if ((res && res.status === 200) || (res && res.status === 201)) {
                    this.$notify.success({
                      title: '成功',
                      message: '已成功创建申请单'
                    })
                    this.$router.replace('/orders')
                  }
                })
              } else {
                this.$message.error(`请填写完整表单`)
                return false
              }
            })
          } else {
            this.$message.error('请填写完整表单')
            return false
          }
        })
      },
      resetForm (applyForm) {
        this.$refs[applyForm].resetFields()
      },
      removeTab (targetName) {
        let tabs = this.applyForm.body
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
        this.applyForm.body.splice(targetName, 1)
      },
      addTab (targetName) {
        var that = this
        let newData = {}
        if (that.toCopy) {
          // 需要复制时，这里去除唯一值
          this.form.body.body_list.map(bodyList => {
            if (this.showBodyList(bodyList, this.applyForm)) {
              bodyList.attr_list.map(group => {
                group.value.map(item => {
                  this.setNewDataType(item, newData)
                  if (!item.unique) {
                    // dict、dicts 无法赋值，因为 needCMDBData 每一次请求把值清空了（防止被watch时留有原值）
                    newData[item.id] = this.applyForm.body[this.tabsValue][item.id]
                  }
                })
              })
            }
          })
        } else {
          // 直接新增不复制，按原 taskFormData 重新赋对应结构的空值
          this.form.body.body_list.map(bodyList => {
            if (this.showBodyList(bodyList, this.applyForm, this.applyData)) {
              bodyList.attr_list.map(group => {
                group.value.map(item => {
                  this.setNewDataType(item, newData)
                })
              })
            }
          })
        }
        this.$refs['applyForm'].validate((valid) => {
          if (valid) {
            if (that.applyForm.body.length < this.form.body.count.max) {
              that.applyForm.body.push(newData)
              this.tabsValue = that.applyForm.body.length - 1 + ''
            } else {
              that.$message.warning(`最多只能增加${this.form.body.count.max}个设备！`)
            }
          } else {
            that.$message.warning('请填写完整当前表单')
          }
        })
      }
    },

    components: {
      formBody
    }
  }
</script>
<style lang="less" scoped>
  .el-select {
    width: 100%;
  }
  .wrapper {
    .form-title {
      font-size: 22px;
      font-weight: 400;
      margin-top: 10px;
      margin-bottom: 40px;
      margin-left: 10px;
      color: #4e5b6d;
    }
  }
  .m-top {
    margin-bottom: 30px;
  }
  .el-form--inline .el-form-item {
    min-width: 194px;
    margin-bottom: 18px;
  }
  .margin-bottom {
    margin-bottom: 20px;
  }
</style>
