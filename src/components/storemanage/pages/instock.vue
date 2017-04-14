<template>
  <div class="outstock">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card
          class="box-card">
          <h3><i :class="editInfo.instanceId ? 'el-icon-edit' : 'el-icon-fa-sign-in' "></i> {{ editInfo.instanceId || editInfo.taskid ? '更改信息' : '入库流程'}}</h3>
          <el-form label-position="left" ref="instockForm" :model="instockForm" :inline="true">
            <header-form-structure :form-data="form.header" :item="instockForm.header"></header-form-structure>
          </el-form>
          <el-form label-position="top" :inline="true" ref="instockForm" :model="instockForm">
            <el-button v-if="(!editInfo.instanceId) && (!editInfo.taskid)" size="small" @click="addTab(tabsValue)" icon="plus" class="margin-bottom">
              新增
            </el-button>
            <el-tabs v-model="tabsValue" type="border-card" @tab-remove="removeTab">
              <el-tab-pane v-for="(item, index) in instockForm.body" :label="form.body && form.body.body_list[bodylistIndex].name + (index + 1)" :name="index + ''" :closable="index !== 0">
                <form-structure :form-data="form.body && form.body.body_list[bodylistIndex].attr_list" :item="item" :index="index"></form-structure>
              </el-tab-pane>
            </el-tabs>
          </el-form>
          <el-button type="primary" class="margin-top" @click="onConfirm('instockForm')" :loading="isSubmitting">确认</el-button>
          <el-button v-if="!$route.params.id" class="margin-top" @click="resetForm('instockForm')">清空</el-button>
          <el-button v-if="$route.params.id" class="margin-top" @click="cancel">取消</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import formStructure from '../../_plugins/_formStructure'
  import headerFormStructure from '../../_plugins/_headerFormStructure'
  import needCmdbData from '../../_plugins/_needCMDBData'
  // import { Loading } from 'element-ui'
  export default {
    data () {
      return {
        routerInfo: {},
        form: {},
        tabsValue: '0',
        bodylistIndex: 0,
        // currentAttrList: [],
        tabIndex: 1,
        closable: true,
        loading: false,
        editInfo: {
          object_id: ''
        },
        application: '',
        deviceType: '',
        instockForm: {
          header: {},
          body: [{}]
        },
        applicationList: [],
        deviceList: [],
        deviceTypes: {},
        deviceListStructure: {},
        editData: [],
        deviceSearch: '',
        deviceTable: [],
        deviceViewData: {
          visible: false,
          device: {}
        },
        validateIP: (rule, value, cb) => {
          const reg = /^(\d|[1-9]\d|1\d{2}|2[0-5][0-5])\.(\d|[1-9]\d|1\d{2}|2[0-5][0-5])\.(\d|[1-9]\d|1\d{2}|2[0-5][0-5])\.(\d|[1-9]\d|1\d{2}|2[0-5][0-5])$/
          if (value && !value.match(reg)) {
            cb(new Error('请输入正确的IP地址'))
          }
        },
        isSubmitting: false,
        userInfo: {}
      }
    },
    created () {
      this.renderTaskForm()
      // console.log(this.form)
      this.routerInfo = this.$route.params
      this.userInfo = window.localStorage
      this.application = this.userInfo.userName // 默认申请人为填写人
      if (this.$route.params.id) {
        this.editInfo.instanceId = this.$route.params.id
        this.editInfo.object_id = this.$route.query.object_id
        // 根据 instanceId 去查询单个实例的所有值，并返回给 this.instockForm.body[0]
        this.renderEditInfo()
      }
      if (this.$route.params.taskid) {
        this.editInfo.taskid = this.$route.params.taskid
        this.editInfo.object_id = this.$route.query.object_id
        // 根据 instanceId 去查询单个实例的所有值，并返回给 this.instockForm.body[0]
        this.renderTaskInfo()
      }
      this.renderDeviceList()
      this.renderApplicationList() // 渲染申请人列表
    },
    watch: {
      '$route' (to, from) { // 复用组件时，想对路由参数的变化作出响应的话,你可以简单地 watch（监测变化） $route 对象
        this.editInfo = {
          instanceId: '',
          object_id: ''
        }
      },
      // 'instockForm.header.deviceType' (to, form) {
      //   const _value = to && to.object_id // to == this.instockForm.header.deviceType
      //   this.form && this.form.body.body_list.forEach((v, k) => {
      //     if (v.show.value === _value) {
      //       this.bodylistIndex = k // 取当前设备类型的索引值
      //     }
      //   })
      // },
      'bodylistIndex' (newVal) {
        this.$set(this.instockForm, 'body', [{}]) // 切换设备类型时，初始化表单数据
        this.form.body.body_list[newVal].attr_list.map(group => {
          group.value.map(item => {
            if (item.value.type === 'arr' || item.value.type === 'FKs') {
              this.$set(this.instockForm.body[0], item.id, [])
            } else if (item.value.type === 'date' || item.value.type === 'datetime' || item.value.type === 'int') {
              this.$set(this.instockForm.body[0], item.id, undefined)
            } else if (item.value.type === 'dict' || item.value.type === 'dicts') {
              this.$set(this.instockForm.body[0], item.id, null)
            } else {
              this.$set(this.instockForm.body[0], item.id, '')
            }
          })
        })
      }
    },
    methods: {
      removeTab (targetName) {
        let tabs = this.instockForm.body
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
        this.instockForm.body.splice(targetName, 1)
        // this.instockForm.body = tabs.filter(tab => tab.name !== targetName)
      },
      renderApplicationList () { // 渲染申请人列表
        const postData = {
          action: 'object/instance/list',
          method: 'GET',
          data: {
            object_id: 'USER'
            // page: "不传则获取该对象所有实例",
            // pageSize: "默认30"
          }
        }
        this.http.post('', this.parseData(postData))
        .then((res) => {
          this.applicationList = res.data.data.list
        })
      },
      renderDeviceList () { // 渲染设备类型
        var renderDeviceListData = {
          action: 'import/device/items',
          method: 'GET',
          data: {}
        }
        this.http.post('custom/', this.parseData(renderDeviceListData)).then((res) => {
          console.log(res)
          this.deviceList = res.data.data.list
          if (!this.editInfo.object_id) {
            this.deviceType = this.deviceList[0].object_id
          } else {
            this.deviceType = this.editInfo.object_id
          }
          this.deviceList.map(item => {
            this.deviceListStructure[item.object_id] = item.pkey
          })
        })
      },
      renderEditInfo () { // 渲染单个实例信息
        var renderEditData = {
          action: `/object/instance/${this.editInfo.object_id}/${this.editInfo.instanceId}`,
          method: 'GET',
          data: {}
        }
        this.http.post('easyops/', this.parseData(renderEditData)).then((res) => {
          console.log('editData', res.data.data.data)
          this.editData = res.data.data.data
        })
      },
      renderTaskInfo () { // 渲染单个实例信息
        var renderEditData = {
          action: 'runtime/task',
          method: 'GET',
          data: {
            taskId: this.editInfo.taskid
          }
        }
        this.http.post('', this.parseData(renderEditData)).then((res) => {
          console.log('editData', res.data.data.variables)
          this.editData = this.findTaskMsgR(res.data.data.variables.message, ['start']).form.object_list
        })
      },
      renderTaskForm () { // 渲染表单数据
        const renderFromData = {
          action: 'activiti/task/form/group',
          method: 'GET',
          data: {
            pkey: 'import_device',
            tkey: 'start'
          }
        }
        this.loading = true
        this.http.post('', this.parseData(renderFromData)).then((res) => {
          this.form = res.data.data.form
          const key = []
          for (const body of this.form.body.body_list) { // 动态 watch
            if (body.show) {
              const keyPath = body.show.key_path.split('.')
              if (body.show.type === 'form_header') { // TODO 暂时只是写了一种type,还有message_header message_body 两种未知数据如何
                if (!key.includes(keyPath[0])) {
                  key.push(keyPath[0])
                  this.$watch('instockForm.header.' + keyPath[0], newVal => {
                    const _value = newVal && newVal[keyPath[1]] || '' // newVal == this.instockForm.header.deviceType
                    this.form && this.form.body.body_list.forEach((v, k) => {
                      if (v.show.value === _value) {
                        this.bodylistIndex = k // 取当前设备类型的索引值
                      }
                    })
                  })
                }
              }
            }
          }
          this.form.header.map(group => {
            group.value.map(item => {
              this.setDataType(item, this.instockForm.header, this)
            })
          })
          // this.instockForm.body[0] = {}
          this.form.body.body_list[this.bodylistIndex].attr_list.map(group => {
            group.value.map(item => {
              // this.$set(this.instockForm.body, original.id, [])
              this.setDataType(item, this.instockForm.body[0], this)
            })
          })
          // 如果是修改页面
          if (this.editInfo.instanceId) {
            this.closable = false
            this.form.body.body_list[0].attr_list.map(formBlock => {
              formBlock.value.map(item => {
                if (item.value.type === 'FK') { // 重新整理 外键 的数据结构，需要对象
                  if (this.editData[item.id]) {
                    this.editData[item.id] = this.editData[item.id]
                  } else {
                    this.editData[item.id] = ''
                  }
                } else if (item.value.type === 'FKs') {
                  if (this.editData[item.id]) {
                    const arrdata = this.editData[item.id]
                    this.editData[item.id] = []
                    // console.log('arr', arrdata)
                    arrdata.map(value => {
                      item.value.object_list.map(object => {
                        if (object.instanceId === value.instanceId) {
                          this.editData[item.id].push(object)
                        }
                      })
                    })
                  } else {
                    this.editData[item.id] = ''
                  }
                } else if (item.value.type === 'int') {
                  if (!this.editData[item.id]) this.editData[item.id] = 0
                } else if (item.value.type === 'date' || item.value.type === 'datetime') {
                  if (!this.editData[item.id]) {
                    this.editData[item.id] = undefined
                  } else {
                    this.editData[item.id] = new Date(this.editData[item.id])
                  }
                } else {
                  if (!this.editData[item.id]) this.editData[item.id] = ''
                }
              })
            })
            for (const item in this.instockForm.body[0]) {
              this.instockForm.body[0][item] = this.editData[item]
            }
            this.instockForm.body[0].instanceId = this.editData.instanceId
            // this.instockForm.body[0] = this.editData
          }
          if (this.editInfo.taskid) {
            this.closable = false
            this.editData.forEach((v, k) => {
              this.form.body.body_list[0].attr_list.map(formBlock => {
                formBlock.value.map(item => {
                  if (item.value.type === 'FK') { // 重新整理 外键 的数据结构，需要对象
                    if (this.editData[k][item.id]) {
                      this.editData[k][item.id] = this.editData[k][item.id]
                    } else {
                      this.editData[k][item.id] = ''
                    }
                  } else if (item.value.type === 'FKs') { // 重新整理 外键s 的数据结构，数组里的数据太多，只需要数组里的 instanceId
                    if (this.editData[k][item.id]) {
                      const arrdata = this.editData[k][item.id]
                      this.editData[k][item.id] = []
                      // console.log('arr', arrdata)
                      arrdata.map(value => {
                        this.editData[k][item.id].push(value)
                      })
                    } else {
                      this.editData[k][item.id] = ''
                    }
                  } else if (item.value.type === 'int') {
                    if (!this.editData[k][item.id]) this.editData[k][item.id] = 0
                  } else if (item.value.type === 'date' || item.value.type === 'datetime') {
                    if (!this.editData[k][item.id]) {
                      this.editData[k][item.id] = undefined
                    } else {
                      this.editData[k][item.id] = new Date(this.editData[k][item.id])
                    }
                  } else {
                    if (!this.editData[k][item.id]) this.editData[k][item.id] = ''
                  }
                })
              })
            })
            this.editData.forEach((v, k) => {
              if (k > 0) {
                let newData = {}
                this.formData.map(group => {
                  group.value.map(item => {
                    if (item.value.type === 'arr' || item.value.type === 'FKs') {
                      newData[item.id] = []
                    } else if (item.value.type === 'int') {
                      newData[item.id] = 0
                    } else if (item.value.type === 'date' || item.value.type === 'datetime') {
                      newData[item.id] = undefined
                    } else {
                      newData[item.id] = ''
                    }
                  })
                })
                this.instockForm.body.push(newData)
              }
              for (const item in this.instockForm.body[k]) {
                this.instockForm.body[k][item] = this.editData[k][item]
              }
            })
          }
          this.loading = false
        })
      },
      addTab (targetName) {
        // let newTabName = ++this.tabIndex + ''
        let newData = {}
        // newData.tabname = newTabName
        this.form.body.body_list[this.bodylistIndex].attr_list.map(group => {
          group.value.map(item => {
            if (item.unique) {
              if (item.value.type === 'arr' || item.value.type === 'FKs') {
                newData[item.id] = []
              } else if (item.value.type === 'int') {
                newData[item.id] = 0
              } else if (item.value.type === 'date' || item.value.type === 'datetime') {
                newData[item.id] = undefined
              } else {
                newData[item.id] = ''
              }
            } else {
              const i = this.instockForm.body.length - 1
              newData[item.id] = this.instockForm.body[i][item.id]
            }
          })
        })
        this.$refs['instockForm'].validate((valid) => {
          if (valid) {
            if (this.instockForm.body.length < this.form.body.count.max) {
              this.instockForm.body.push(newData)
              this.tabsValue = this.instockForm.body.length - 1 + ''
            } else {
              this.$message.warning(`最多只能增加${this.form.body.count.max}个设备！`)
            }
          } else {
            this.$message.warning('请填写完整后再增加！')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      onConfirm (formName) {
        let objectList = {
          data: []
        }
        this.instockForm.body.forEach((instock, k) => {
          objectList.data[k] = {}
          for (const i in instock) {
            if (instock[i]) {
              if (Array.isArray(instock[i]) && instock[i].length !== 0) {
                objectList.data[k][i] = instock[i]
              } else if (!Array.isArray(instock[i])) {
                objectList.data[k][i] = instock[i]
                console.log(objectList.data[k][i])
              }
            }
          }
          this.form.body.body_list[this.bodylistIndex].attr_list.map(group => {
            group.value.map(item => {
              if (item.value.type === 'date') {
                if (objectList.data[k][item.id]) {
                  objectList.data[k][item.id] = this.filterDate(objectList.data[k][item.id])
                }
              } else if (item.value.type === 'datetime') {
                if (objectList.data[k][item.id]) {
                  objectList.data[k][item.id] = this.filterDateTime(objectList.data[k][item.id])
                }
              }
            })
          })
        })
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$refs['instockForm'].validate((validHead) => {
              if (validHead) {
                console.log('submit!')
                const postData = {
                  action: 'runtime/process/instances',
                  method: 'POST',
                  data: {
                    pkey: this.deviceListStructure[this.deviceType],
                    form: {
                      'body': objectList.data,
                      'header': this.instockForm.header
                    }
                  }
                }
                const updateData = {}
                // console.log(this.instockForm.body[0])
                for (const i in this.instockForm.body[0]) {
                  if (this.instockForm.body[0][i]) {
                    updateData[i] = this.instockForm.body[0][i]
                  }
                }
                this.form.body.body_list[this.bodylistIndex].attr_list.map(group => {
                  group.value.map(item => {
                    if (item.value.type === 'date') {
                      // newData[item.id] = undefined
                      if (updateData[item.id]) {
                        updateData[item.id] = this.filterDate(updateData[item.id])
                      }
                    } else if (item.value.type === 'datetime') {
                      if (updateData[item.id]) {
                        updateData[item.id] = this.filterDateTime(updateData[item.id])
                      }
                    }
                  })
                })
                // console.log(updateData)
                const updataInstanceData = {
                  action: 'runtime/process/instances',
                  method: 'POST',
                  data: {
                    pkey: 'alter_device',
                    form: {
                      'object_list': [updateData],
                      'object_id': this.deviceType,
                      'application': this.application
                    }
                  }
                }
                if (this.editInfo.instanceId) {
                  this.http.post('', this.parseData(updataInstanceData)).then((res) => {
                    console.log(res)
                    if (res.status === 200) {
                      this.$notify({
                        title: '成功',
                        message: `提交成功！`,
                        type: 'success'
                      })
                      this.$router.replace('/storemanage/outstock/edit')
                    } else {
                      this.$notify.error({
                        title: '失败',
                        message: `变更失败！`
                      })
                    }
                    this.isSubmitting = false
                  })
                } else {
                  this.isSubmitting = true
                  this.http.post('', this.parseData(postData)).then((res) => {
                    console.log(res)
                    if (res && res.status === 406) {
                      this.$message.error(res.errorMessage)
                    } else {
                      this.$message.success('提交成功！')
                      // this.$message.warning('提交成功！')
                      this.$router.replace('/orders')
                    }
                    this.isSubmitting = false
                  })
                }
              } else {
                this.$message.warning('表单未填写完整！')
              }
            })
          } else {
            console.log('error submit!!')
            this.$message.warning('表单未填写完整！')
            return false
          }
        })
      },
      cancel () {
        this.$router.go(-1)
      }
    },
    components: {
      formStructure,
      headerFormStructure,
      needCmdbData
    }
  }
</script>
<style lang="less" scoped>
  .el-select, .el-input-number, .el-input, .el-date-editor.el-input {
    width: 187px;
  }
  .form-title {
    margin-bottom: 15px;
  }
  .margin-bottom {
    margin-bottom: 15px;
  }
  .instock-card {
    margin-bottom: 15px;
    position: relative;
  }
  .instock-card-remove {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    font-size: 28px;
    color: #ff4949;
  }
</style>
