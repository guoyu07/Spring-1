<template>
  <div id="item1-side" class="wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3>服务资源申请单</h3>
          <el-form ref="applyFormHead" :model="applyFormHead" :rules="applyRules" label-width="100px" :inline="true">
            <el-form-item filterable prop="applyType" label="申请类型">
              <el-select v-model="applyFormHead.applyType" @change="onChangeType">
                <el-option v-for="apyType in applyTypes"
                  :label="apyType.label"
                  :value="apyType.label"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item v-if="applyFormHead.applyType === '新建集群节点'" prop="applicationName" label="应用名">
              <el-select filterable v-model="applyFormHead.applicationName">
                <el-option v-for="app in appList"
                  :label="app.name"
                  :value="app.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="applyFormHead.applyType !== '新建集群节点'" prop="applicationName" label="应用名">
              <el-input v-model="applyFormHead.applicationName"></el-input>
            </el-form-item>

            <header-form-structure :form-data="form.header" :item="applyFormHead"></header-form-structure>
          </el-form>
          <br>
          <el-button size="small" icon="plus" class="margin-bottom" @click="addTab(tabsValue)">
            增加服务器
          </el-button>
          <el-form ref="applyForm" :model="applyForm" :rules="applyRules" label-position="top" :inline="true">
            <el-tabs v-model="tabsValue" type="border-card" @tab-remove="removeTab">
              <el-tab-pane v-for="(item, index) in applyForm.data" :label="'服务资源' + (index + 1)" :name="index + ''" :closable="index !== 0">
                <form-structure :form-data="form.body && form.body.body_list[0].attr_list" :item="item" :index="index"></form-structure>
                <!-- <el-form-item
                  label="使用环境"
                  :prop="'data.' + index + '.environment'"
                  :rules="{
                    required: true, message: '使用环境不能为空', trigger: 'change'
                  }">
                  <el-select filterable v-model="item.environment" placeholder="请选择使用环境">
                    <el-option v-for="envir in environmentList"
                      :label="envir.label"
                      :value="envir.label"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  label="OS"
                  :prop="'data.' + index + '.operateSystem'"
                  :rules="{
                    required: true, message: 'OS不能为空', trigger: 'change'
                  }">
                  <el-select filterable v-model="item.operateSystem" placeholder="请选择OS">
                    <el-option v-for="system in systemsList"
                      :label="system.label"
                      :value="system.label"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  label="主机"
                  :prop="'data.' + index + '.hostType'"
                  :rules="{
                    required: true, message: '主机类型不能为空', trigger: 'change'
                  }">
                  <el-select filterable v-model="item.hostType" placeholder="请选择主机类型">
                    <el-option v-for="host in hostTypeList"
                      :label="host.label"
                      :value="host.label"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  label="数量"
                  :prop="'data.' + index + '.quantity'"
                  :rules="{ required: true, validator: checkNumber, trigger: 'blur' }">
                  <el-input v-model="item.quantity"></el-input>
                </el-form-item> -->
                <el-form-item
                  label="CPU核数"
                  :prop="'data.' + index + '.cpu'"
                  :rules="{ required: true, validator: checkNumber, trigger: 'blur' }">
                  <el-input type="number" v-model="item.cpu" placeholder="请输入您需要的cpu核数"></el-input>
                </el-form-item>

                <el-form-item
                  label="内存(G)"
                  :prop="'data.' + index + '.internalStorage'"
                  :rules="{ required: true, validator: checkNumber, trigger: 'blur' }">
                  <el-input type="number" v-model="item.internalStorage" placeholder="请输入您需要的内存"></el-input>
                </el-form-item>

                <el-form-item
                  label="硬盘(G)"
                  :prop="'data.' + index + '.hardDisk'"
                  :rules="{ required: true, validator: checkNumber, trigger: 'blur' }">
                  <el-input type="number" v-model="item.hardDisk" placeholder="请输入您需要的硬盘"></el-input>
                </el-form-item>

                <!-- <el-form-item
                  label="资产编号"
                  :prop="'data.' + index + '.assetNumber'">
                  <el-input type="number" v-model="item.assetNumber"></el-input>
                </el-form-item> -->

                <el-form-item label="资源分数">
                  {{ item.score = item.cpu * 1 + item.internalStorage * 1 + item.hardDisk / 20 }}
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-form>
          <div class="btn-area">
            <el-button type="primary" @click="onRecheckBusiness">立即创建</el-button>
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
        editData: {
          applicationName: '',
          business: '',
          opsManagers: []
        },
        applyFormHead: {
          applyType: '',
          applicationName: ''
        },
        applyForm: {
          data: [{
            cpu: '',
            internalStorage: '',
            hardDisk: '',
            score: 0
          }]
        },
        appList: [],
        applyTypes: [{
          label: '新建应用',
          value: 'newApplication'
        }, {
          label: '新建集群节点',
          value: 'newGroup'
        }],
        applyRules: {
          applyType: [
            { required: true, message: '请选择申请类型', trigger: 'change' }
            // { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ],
          applicationName: [
            { required: true, message: '请输入应用名', trigger: 'change, blur' }
          ]
        }
      }
    },
    created () {
      this.renderTaskForm()
      this.renderAppList()
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
              this.setDataType(item, this.applyFormHead, this)
            })
          })
          this.form.body.body_list[0].attr_list.map(group => {
            group.value.map(item => {
              this.setDataType(item, this.applyForm.data[0], this)
            })
          })
          // this.loading = false
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
          this.editData.applicationName = this.applyForm.applicationName
          this.editData.business = this.applyForm.business
          this.editData.opsManagers = this.applyForm.opsManagers
          console.log(this.editData)
        })
      },
      renderAppList () {
        const postData = {
          action: 'object/instance/list',
          method: 'GET',
          data: {
            object_id: 'APP'
            // page: "不传则获取该对象所有实例",
            // pageSize: "默认30"
          }
        }
        this.http.post('', this.parseData(postData))
        .then((res) => {
          console.log(res, res.data.data.list)
          this.appList = res.data.data.list
          this.applyForm.applicationName = this.editData.applicationName
        })
      },
      onChangeType () {
        this.applyForm.applicationName = ''
        this.applyForm.business = ''
      },
      handleRemove (tab) {
        this.applyForm.data.splice(tab.index, 1)
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
        if (!this.businessList.some(business => business.name === this.applyForm.business)) { // 若项目组为新增，则先进行新增请求
          let postData = {
            action: `/object/instance/BUSINESS`,
            method: 'POST',
            data: { name: this.applyForm.business }
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
        this.$refs[applyForm].validate((valid) => {
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
                  form: this.applyForm,
                  pass: 0
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
                this.$router.replace('/system/applylist')
              }
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: '请填写完整表单'
            })
            return false
          }
        })
      },
      resetForm (applyForm) {
        this.$refs[applyForm].resetFields()
      },
      removeTab (targetName) {
        let tabs = this.applyForm.data
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
        this.applyForm.data = tabs.filter(tab => tab.name !== targetName)
      },
      addTab (targetName) {
        // let newTabName = ++this.tabIndex + ''
        var that = this
        this.$refs['applyForm'].validate((valid) => {
          if (valid) {
            if (that.applyForm.data.length < 5) {
              that.applyForm.data.push({
                // tabname: newTabName,
                environment: null,
                quantity: '',
                operateSystem: null,
                hostType: null,
                cpu: '',
                internalStorage: '',
                hardDisk: '',
                // assetNumber: '',
                score: 0
              })
              this.tabsValue = that.applyForm.data.length - 1 + ''
            } else {
              that.$message.warning('最多只能增加 5 个设备！')
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
