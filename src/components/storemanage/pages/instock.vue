<template>
  <div class="outstock">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card
          class="box-card"
          v-loading.fullscreen="loading"
          element-loading-text="拼命加载中">
          <h3><i :class="editInfo.instanceId ? 'el-icon-edit' : 'el-icon-fa-sign-in' "></i> {{ editInfo.instanceId || editInfo.taskid ? '更改信息' : '入库流程'}}</h3>
          <el-form label-position="left" label-width="100px">
            <el-form-item label="设备类型">
              <el-radio-group v-model="deviceType" @change="renderFormData">
                <el-radio :disabled="(!!$route.params.id) || (!!$route.params.taskid)" v-for="device in deviceList" :label="device.object_id">{{device.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="申请人">
              <el-select
                v-model="application"
                filterable>
                <el-option v-for="option in applicationList"
                  :label="option.name"
                  :value="option.name"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="step step-2">
            <el-form label-position="top" :inline="true" ref="instockForm" :model="instockForm">

              <el-button v-if="(!editInfo.instanceId) && (!editInfo.taskid)" size="small" @click="addTab(tabsValue)" icon="plus" class="margin-bottom">
                新增
              </el-button>
              <el-tabs v-model="tabsValue" type="border-card" @tab-remove="removeTab">
                <el-tab-pane v-for="(item, index) in instockForm.data" :label="'设备' + (index + 1)" :name="index" :closable="index !== 0">
                  <form-structure :form-data="formData" :item="item" :index="index"></form-structure>
                </el-tab-pane>
              </el-tabs>
            </el-form>
            <el-button type="primary" class="margin-top" @click="onConfirm('instockForm')" :loading="isSubmitting">确认</el-button>
            <el-button v-if="!$route.params.id" class="margin-top" @click="resetForm('instockForm')">清空</el-button>
            <el-button v-if="$route.params.id" class="margin-top" @click="cancel">取消</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import formStructure from '../../_plugins/_formStructure'
  // import { Loading } from 'element-ui'

  export default {
    data () {
      return {
        tabsValue: 0,
        tabIndex: 1,
        closable: true,
        loading: false,
        editInfo: {
          object_id: ''
        },
        application: '',
        deviceType: '',
        instockForm: {
          application: '',
          data: [{}]
        },
        applicationList: [],
        deviceList: [],
        deviceListStructure: {},
        formData: [],
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
      this.userInfo = window.localStorage
      this.application = this.userInfo.userName // 默认申请人为填写人
      if (this.$route.params.id) {
        this.editInfo.instanceId = this.$route.params.id
        this.editInfo.object_id = this.$route.query.object_id
        // 根据 instanceId 去查询单个实例的所有值，并返回给 this.instockForm.data[0]
        this.renderEditInfo()
      }
      if (this.$route.params.taskid) {
        this.editInfo.taskid = this.$route.params.taskid
        this.editInfo.object_id = this.$route.query.object_id
        // 根据 instanceId 去查询单个实例的所有值，并返回给 this.instockForm.data[0]
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
      }
    },
    methods: {
      removeTab (targetName) {
        let tabs = this.instockForm.data
        let activeName = this.tabsValue
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }

        this.tabsValue = activeName
        this.instockForm.data = tabs.filter(tab => tab.name !== targetName)
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
      renderFormData () { // 渲染表单数据
        const renderFromData = {
          action: 'cmdb/object/attr',
          method: 'GET',
          data: {
            object_id: this.deviceType
          }
        }
        this.loading = true
        this.http.post('', this.parseData(renderFromData)).then((res) => {
          this.formData = res.data.data.attr_group
          this.formData.map(group => {
            group.value.map(item => {
              if (item.value.type === 'arr' || item.value.type === 'FKs') {
                this.$set(this.instockForm.data[0], item.id, [])
              } else if (item.value.type === 'date' || item.value.type === 'datetime' || item.value.type === 'int') {
                this.$set(this.instockForm.data[0], item.id, undefined)
              } else {
                this.$set(this.instockForm.data[0], item.id, '')
              }
            })
          })
          // this.$set(this.instockForm.data[0], 'tabname', '1')
          console.log(this.formData)
          // 如果是修改页面
          if (this.editInfo.instanceId) {
            this.closable = false
            this.formData.map(formBlock => {
              formBlock.value.map(item => {
                if (item.value.type === 'FK') { // 重新整理 外键 的数据结构，需要对象
                  if (this.editData[item.id]) {
                    this.editData[item.id] = this.editData[item.id]
                  } else {
                    this.editData[item.id] = ''
                  }
                } else if (item.value.type === 'FKs') { // 重新整理 外键s 的数据结构，数组里的数据太多，只需要数组里的 instanceId
                  if (this.editData[item.id]) {
                    const arrdata = this.editData[item.id]
                    this.editData[item.id] = []
                    // console.log('arr', arrdata)
                    arrdata.map(value => {
                      this.editData[item.id].push(value)
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
            for (const item in this.instockForm.data[0]) {
              this.instockForm.data[0][item] = this.editData[item]
            }
            this.instockForm.data[0].instanceId = this.editData.instanceId
            // this.instockForm.data[0] = this.editData
          }
          if (this.editInfo.taskid) {
            this.closable = false
            this.editData.forEach((v, k) => {
              this.formData.map(formBlock => {
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
                this.instockForm.data.push(newData)
              }
              for (const item in this.instockForm.data[k]) {
                this.instockForm.data[k][item] = this.editData[k][item]
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
        this.formData.map(group => {
          group.value.map(item => {
            if (item.unique === 'true') {
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
              const i = this.instockForm.data.length - 1
              newData[item.id] = this.instockForm.data[i][item.id]
            }
          })
        })
        this.$refs['instockForm'].validate((valid) => {
          if (valid) {
            if (this.instockForm.data.length < 10) {
              this.instockForm.data.push(newData)
              this.tabsValue = this.instockForm.data.length - 1
            } else {
              this.$message.warning('最多只能增加 10 个设备！')
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
        this.instockForm.data.forEach((instock, k) => {
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
          this.formData.map(group => {
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
            console.log('submit!')
            const postData = {
              action: 'runtime/process/instances',
              method: 'POST',
              data: {
                pkey: this.deviceListStructure[this.deviceType],
                form: {
                  'object_list': objectList.data,
                  'object_id': this.deviceType,
                  'application': this.application
                }
              }
            }
            const updateData = {}
            // console.log(this.instockForm.data[0])
            for (const i in this.instockForm.data[0]) {
              if (this.instockForm.data[0][i]) {
                updateData[i] = this.instockForm.data[0][i]
              }
            }
            this.formData.map(group => {
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
      formStructure
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
