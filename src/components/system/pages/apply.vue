<template>
  <div id="item1-side" class="wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3>服务资源申请单</h3>
          <el-form ref="applyForm" :model="applyForm" :rules="applyRules" class="advance-search-form" label-width="85px" :inline="true">
            <el-form-item filterable prop="applyType" label="申请类型">
              <el-select v-model="applyForm.applyType" @change="onChangeType">
                <el-option v-for="apyType in applyTypes"
                  :label="apyType.label"
                  :value="apyType.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="business" label="项目组">
              <el-select filterable allow-create v-model="applyForm.business">
                <el-option v-for="business in businessList"
                  :label="business.name"
                  :value="business.name"></el-option> <!-- 因为这个business可以选填可以输入，所以只取字符串 -->
              </el-select>
            </el-form-item>
            <!-- <el-form-item v-if="applyForm.applyType === 'newBusiness'" prop="business" label="所属业务">
              <el-input v-model="applyForm.business"></el-input>
            </el-form-item> -->

            <el-form-item v-if="applyForm.applyType === '新建集群节点'" prop="applicationName" label="应用名">
              <el-select filterable v-model="applyForm.applicationName">
                <el-option v-for="app in appList"
                  :label="app.name"
                  :value="app.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="applyForm.applyType !== '新建集群节点'" prop="applicationName" label="应用名">
              <el-input v-model="applyForm.applicationName"></el-input>
            </el-form-item>

            <el-form-item prop="opsManagers" label="运维负责人">
              <el-select filterable multiple v-model="applyForm.opsManagers">
                <el-option v-for="ops in opsManagersList"
                  :label="ops.name"
                  :value="ops.name"></el-option>
              </el-select>
            </el-form-item>
            <br>
            <el-button size="small" icon="plus" class="margin-bottom" @click="addTab(tabsValue)">
              增加服务器
            </el-button>
            <el-tabs v-model="tabsValue" type="border-card" @tab-remove="removeTab">
              <el-tab-pane v-for="(item, index) in applyForm.data" :label="'服务资源' + (index + 1)" :name="index + ''" :closable="index !== 0">
                <el-form-item
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
                  <!-- <el-input-number v-model="item.quantity" :min="1"></el-input-number> -->
                </el-form-item>

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
            <br>
            <el-form-item label="备注">
              <el-input type="textarea" style="width: 320px;" v-model="applyForm.remark"></el-input>
            </el-form-item>
            <br>
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
  export default {
    data () {
      return {
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
        applyForm: {
          applyType: '',
          business: '',
          applicationName: '',
          opsManagers: [],
          remark: '',
          data: [{
            // tabname: 0,
            environment: null,
            quantity: '',
            operateSystem: null,
            hostType: null,
            cpu: '',
            internalStorage: '',
            hardDisk: '',
            // assetNumber: '',
            score: 0
          }]
        },
        applyTypes: [{
          label: '新建应用',
          value: 'newApplication'
        }, {
          label: '新建集群节点',
          value: 'newGroup'
        }],
        businessList: [],
        appList: [],
        opsManagersList: [],
        environmentList: [{
          label: '质量测试环境',
          value: 'qutityTesting'
        }, {
          label: '开发测试环境',
          value: 'devTesting'
        }, {
          label: '开发联调环境',
          value: 'jointDevTesting'
        }, {
          label: '预上线环境',
          value: 'preOnline'
        }, {
          label: '生产环境',
          value: 'production'
        }, {
          label: '展示环境',
          value: 'display'
        }, {
          label: ' DMZ区环境',
          value: 'demilitarizedZone'
        }],
        systemsList: [{
          label: 'Red Hat5.5(应用)',
          value: 'RedHat5.5'
        }, {
          label: 'Red Hat6.5(数据库)',
          value: 'RedHat6.5'
        }, {
          label: 'Win2008R2 SP1',
          value: 'Win2008R2SP1'
        }, {
          label: 'Win7',
          value: 'Win7'
        }, {
          label: 'WinXP',
          value: 'WinXP'
        }, {
          label: '其他',
          value: 'other'
        }],
        hostTypeList: [{
          label: '物理机',
          value: 'physical'
        }, {
          label: '虚拟机',
          value: 'virtual'
        }],
        applyRules: {
          applyType: [
            { required: true, message: '请选择申请类型', trigger: 'change' }
            // { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ],
          business: [
            { required: true, message: '请输入所属业务', trigger: 'change, blur' }
          ],
          applicationName: [
            { required: true, message: '请输入应用名', trigger: 'change, blur' }
          ],
          opsManagers: [
            { type: 'array', required: true, message: '请输入运维负责人', trigger: 'change, blur' }
          ]
        }
      }
    },
    created () {
      this.editInfo.userName = window.localStorage.userName
      if (this.$route.params.id) {
        this.editInfo.id = this.$route.params.id
        this.renderInstanceDetail()
      }
      this.renderAppList()
      this.renderOpsManagerList()
      this.renderBusinessList()
    },
    watch: {
      '$route' (to, from) { // 复用组件时，想对路由参数的变化作出响应的话,你可以简单地 watch（监测变化） $route 对象
        this.editInfo = {
          id: ''
        }
      }
    },
    methods: {
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
      renderOpsManagerList () {
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
          console.log(res, res.data.data.list)
          this.opsManagersList = res.data.data.list
          if (this.editData.opsManagers.length !== 0) {
            this.applyForm.opsManagers = this.editData.opsManagers
          } else {
            this.applyForm.opsManagers = [this.editInfo.userName]
          }
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
      renderBusinessList () {
        const postData = {
          action: 'object/instance/list',
          method: 'GET',
          data: {
            object_id: 'BUSINESS'
            // page: "不传则获取该对象所有实例",
            // pageSize: "默认30"
          }
        }
        this.http.post('', this.parseData(postData))
        .then((res) => {
          this.businessList = res.data.data.list
          this.applyForm.business = this.editData.business
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
        // if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          console.log(index, +targetName, index === +targetName)
          // if (index === +targetName) {
          let nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab) {
            activeName = tabs.indexOf(nextTab)
            console.log(activeName)
          }
          // }
        })
        // }
        this.tabsValue = activeName + ''
        this.applyForm.data.splice(targetName, 1)
        // this.applyForm.data = tabs.filter(tab => tab.name !== targetName)
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
    min-width: 280px;
    margin-bottom: 18px;
  }
  .margin-bottom {
    margin-bottom: 20px;
  }
</style>
