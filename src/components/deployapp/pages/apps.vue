<template>
  <div class="outstock">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card
          class="box-card">
          <h3><i class="el-icon-fa-bomb"></i> 应用发布更新</h3>
          <el-form label-position="top" ref="postForm" :model="postForm" :inline="true">
            <header-form-structure :form-data="form.header" :item="postForm.header"></header-form-structure>
            <!-- <header-table :form-data="form.header" :item="postForm.header" :headerTable="true"></header-table> -->
          <!-- </el-form>
          <el-form label-position="top" :inline="true" ref="postForm" :model="postForm"> -->
            <div v-if="form.body && form.body.body_list.length">
              <el-button size="small" @click="addTab(tabsValue)" icon="plus" class="margin-bottom">
                新增
              </el-button>
              <el-tabs v-model="tabsValue" type="border-card" @tab-remove="removeTab">
                <el-tab-pane v-for="(item, index) in postForm.body" :label="'应用' + (index + 1)" :name="index + ''" :closable="index !== 0">
                  <form-structure :form-data="form.body.body_list[bodylistIndex].attr_list" :item="item" :index="index"></form-structure>
                  <body-table
                    :form-data="form.body && form.body.body_list[bodylistIndex].attr_list"
                    :item="item"
                    :index="index"
                    :bodyTable="true">
                  </body-table>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-form>
          <el-button type="primary" class="margin-top" @click="onConfirm('postForm')" :loading="isSubmitting">确认</el-button>
          <el-button class="margin-top" @click="resetForm('postForm')">清空</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import formStructure from '../../_plugins/_formStructure'
  import headerTable from '../../_plugins/_headerTable'
  import bodyTable from '../../_plugins/_bodyTable'
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
        application: '',
        deviceType: '',
        postForm: {
          header: {},
          body: []
        },
        deviceTypes: {},
        deviceListStructure: {},
        deviceSearch: '',
        deviceTable: [],
        deviceViewData: {
          visible: false,
          device: {}
        },
        isSubmitting: false,
        userInfo: {}
      }
    },
    created () {
      this.renderTaskForm()
      this.userInfo = window.localStorage
      this.application = this.userInfo.userName // 默认申请人为填写人
    },
    watch: {
      'bodylistIndex' (newVal) {
        this.$set(this.postForm, 'body', [{}]) // 切换设备类型时，初始化表单数据
        this.form.body.body_list[newVal].attr_list.map(group => {
          group.value.map(item => {
            this.setDataType(item, this.postForm.body[0], this)
          })
        })
      }
    },
    methods: {
      removeTab (targetName) {
        console.log(targetName)
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
        this.postForm.body.splice(targetName, 1)
        // this.postForm.body = tabs.filter(tab => tab.name !== targetName)
      },
      renderTaskForm () { // 渲染表单数据
        const renderFromData = {
          action: 'activiti/task/form/group',
          method: 'GET',
          data: {
            pkey: 'deploy_app',
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
                  this.$watch('postForm.header.' + keyPath[0], newVal => {
                    const _value = newVal && newVal[keyPath[1]] || '' // newVal == this.postForm.header.deviceType
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
              this.setDataType(item, this.postForm.header, this)
              if (item.value.type === 'table') {
                this.$set(this.postForm.header[item.id], 0, {})
                let data = this.postForm.header[item.id][0]
                item.value.attr_list.map(item => {
                  this.setDataType(item, data, this)
                })
              }
            })
          })
          // this.postForm.body[0] = {}
          this.form.body.body_list.length && this.form.body.body_list[this.bodylistIndex].attr_list.map(group => {
            group.value.map((item, itemIndex) => {
              // this.$set(this.postForm.body, original.id, [])
              this.setDataType(item, this.postForm.body[0], this)
              if (item.value.type === 'table') {
                this.$set(this.postForm.body[0][item.id], 0, {})
                let data = this.postForm.body[0][item.id][0]
                item.value.attr_list.map(item => {
                  this.setDataType(item, data, this)
                })
              }
            })
          })
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
              const i = this.postForm.body.length - 1
              newData[item.id] = this.postForm.body[i][item.id]
            }
          })
        })
        this.$refs['postForm'].validate((valid) => {
          if (valid) {
            if (this.postForm.body.length < this.form.body.count.max) {
              this.postForm.body.push(newData)
              this.tabsValue = this.postForm.body.length - 1 + ''
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
        this.postForm.body.forEach((instock, k) => {
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
          this.form.body.body_list.length && this.form.body.body_list[this.bodylistIndex].attr_list.map(group => {
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
            this.$refs['postForm'].validate((validHead) => {
              if (validHead) {
                console.log('submit!')
                const postData = {
                  action: 'runtime/process/instances',
                  method: 'POST',
                  data: {
                    pkey: 'deploy_app',
                    form: {
                      'body': objectList.data,
                      'header': this.postForm.header
                    }
                  }
                }
                const updateData = {}
                // console.log(this.postForm.body[0])
                for (const i in this.postForm.body[0]) {
                  if (this.postForm.body[0][i]) {
                    updateData[i] = this.postForm.body[0][i]
                  }
                }
                this.form.body.body_list.length && this.form.body.body_list[this.bodylistIndex].attr_list.map(group => {
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
                this.isSubmitting = true
                this.http.post('', this.parseData(postData)).then((res) => {
                  console.log(res)
                  if (res && res.status === 406) {
                    this.$message.error(res.errorMessage)
                  } else if (res && res.status === 200) {
                    this.$message.success('提交成功！')
                    // this.$message.warning('提交成功！')
                    this.$router.replace('/orders')
                  }
                  this.isSubmitting = false
                })
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
      headerTable,
      bodyTable,
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
