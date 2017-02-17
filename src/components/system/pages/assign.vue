<template>
  <div id="item1-side" class="wrapper">
    <h3 class="form-title">服务资源分配</h3>
    <el-form ref="applyForm" :model="applyForm" label-width="85px" :inline="true">
      <el-row :gutter="10" class="m-top">
        <el-form-item prop="applyType" label="申请类型">
          新建应用
        </el-form-item>

        <el-form-item prop="project" label="项目组">
          项目组
        </el-form-item>

        <el-form-item label="应用名">
          应用名
        </el-form-item>
      </el-row>

      <el-tabs type="card" @tab-click="handleClick">
        <el-tab-pane  v-for="(item, index) in applyForm.data" :key="item.id" :label="'服务资源' + (index + 1)">
          <el-form-item
            label="使用环境"
            :prop="'data.' + index + '.environment'">
            开发环境
          </el-form-item>

          <el-form-item
            label="OS"
            :prop="'data.' + index + '.operateSystem'">
            Win7
          </el-form-item>

          <el-form-item
            label="主机"
            :prop="'data.' + index + '.hostType'">
            虚拟机
          </el-form-item>

          <el-form-item
            label="数量"
            :prop="'data.' + index + '.quantity'">
            2
          </el-form-item>

          <el-form-item
            label="CPU核数"
            :prop="'data.' + index + '.cpu'">
            4
          </el-form-item>

          <el-form-item
            label="内存(G)"
            :prop="'data.' + index + '.internalStorage'">
            44
          </el-form-item>

          <el-form-item
            label="硬盘(G)"
            :prop="'data.' + index + '.hardDisk'">
            33
          </el-form-item>

          <el-form-item
            label="资产编号"
            :prop="'data.' + index + '.assetNumber'">
            12222
          </el-form-item>

          <el-form-item label="资源分数">
            33
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <br>
      <el-form-item label="备注">
        请修改cpu
      </el-form-item>
      <br>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('applyForm')">立即分配</el-button>
        <el-button @click="resetForm('applyForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        applyForm: {
          applyType: '',
          project: '',
          applicationName: '',
          remark: '',
          data: [{
            environment: null,
            quantity: '',
            operateSystem: null,
            hostType: null,
            cpu: '',
            internalStorage: '',
            hardDisk: '',
            assetNumber: '',
            score: 0
          }]
        },
        applyTypes: [{
          label: '新建应用',
          value: 'newApplication'
        }, {
          label: '新建集群节点',
          value: 'newGroup'
        }, {
          label: '新建业务',
          value: 'newBusiness'
        }],
        projectList: [],
        applicationNameList: [],
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
          project: [
            { required: true, message: '请输入所属业务', trigger: 'change, blur' }
          ],
          applicationName: [
            { required: true, message: '请输入应用名', trigger: 'change, blur' }
          ]
        }
      }
    },
    methods: {
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
      onSubmit (applyForm) {
        this.$refs[applyForm].validate((valid) => {
          if (valid) {
            console.log('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (applyForm) {
        this.$refs[applyForm].resetFields()
      }
    }
  }
</script>
<style lang="less" scoped>
  .el-select {
    width: 100%;
  }
  .wrapper {
    padding: 20px;

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
  }
</style>
