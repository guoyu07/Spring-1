<template>
  <div id="item1-side" class="wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3>上架流程申请单</h3>
          <el-form ref="applyForm" :model="applyForm" label-width="100px" :inline="true">
            <header-form-structure :form-data="form.header" :item="applyForm.header" :whole="applyForm"></header-form-structure>
          </el-form>
          <br>
          <template v-if="form.body && form.body.body_list.length">
            <el-button size="small" icon="plus" class="margin-bottom" @click="addTab(tabsValue)">
              增加
            </el-button>
            <el-form ref="applyForm" :model="applyForm" :rules="applyRules" label-position="top" :inline="true">
              <el-tabs v-model="tabsValue" type="border-card" @tab-remove="removeTab">
                <el-tab-pane v-for="(item, index) in applyForm.body" :label="'body' + (index + 1)" :name="index + ''" :closable="index !== 0">
                  <form-structure :form-data="form.body && form.body.body_list[0].attr_list" :item="item" :whole="applyForm" index="index"></form-structure>
                </el-tab-pane>
              </el-tabs>
            </el-form>
          </template>
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
  import formStructure from '../../_plugins/_formStructure'
  import headerFormStructure from '../../_plugins/_headerFormStructure'
  export default {
    data () {
      return {
        form: {},
        tabsValue: '0',
        tabIndex: 1,
        editInfo: {
          id: ''
        },
        applyForm: {
          header: {},
          body: []
        }
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
            pkey: 'host',
            tkey: 'start'
          }
        }
        // this.loading = true
        this.http.post('', this.parseData(renderFromData)).then((res) => {
          this.form = res.data.data.form
          this.form.header.map(group => {
            group.value.map(item => {
              this.setDataType(item, this.applyForm.header, this)
              // 取默认值
              if (item.default.type) {
                if (item.default.type === 'message_header') {
                  this.applyForm.header[item.id] = this.getPathResult(this.applyForm.header, item.default.key_path)
                } else if (item.default.type === 'static') {
                  this.applyForm.header[item.id] = item.default.value
                }
              }
            })
          })
          console.log(this.applyForm.header)
          this.form.body.body_list.length && this.form.body.body_list[0].attr_list.map(group => {
            group.value.map(item => {
              this.setDataType(item, this.applyForm.body[0], this)
              // 取默认值
              if (item.default.type) {
                if (item.default.type === 'message_header') {
                  this.applyForm.body[0][item.id] = this.getPathResult(this.applyForm.body[0], item.default.key_path, 0)
                } else if (item.default.type === 'static') {
                  this.applyForm.body[0][item.id] = item.default.value
                }
              }
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
      onSubmit (applyForm) {
        console.log(this.applyForm)
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
                  for (const headerid in this.applyForm.header) {
                    // console.log(headerid, this.applyForm[headerid], !this.applyForm[headerid])
                    if (!this.applyForm.header[headerid]) {
                      // console.log(headerid)
                      delete this.applyForm.header[headerid] // 删除头部空值 TODO：删除 body 的空值
                    }
                  }
                  postData = {
                    action: 'runtime/process/instances',
                    method: 'POST',
                    data: {
                      pkey: 'host',
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
        console.log('00000')
        // let newTabName = ++this.tabIndex + ''
        var that = this
        let newData = {}
        this.form.body.body_list[0].attr_list.map(group => {
          group.value.map(item => {
            this.setNewDataType(item, newData)
          })
        })
        this.$refs['applyForm'].validate((valid) => {
          if (valid) {
            if (that.applyForm.body.length < this.form.body.count.max) {
              that.applyForm.body.push(newData)
              this.tabsValue = that.applyForm.body.length - 1 + ''
              // this.$watch('applyForm.body.' + this.tabsValue, newVal => {
              //   newVal.score = (newVal.cpu * 1 + newVal.storage * 1 + newVal.hardDisk / 20) + ''
              // }, {deep: true})
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
      formStructure,
      headerFormStructure
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
