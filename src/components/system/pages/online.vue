<template>
  <div id="item1-side" class="wrapper">
    <h3 class="form-title">服务资源申请单</h3>
    <el-form ref="applyForm" :model="applyForm" :rules="applyRules" label-width="85px">
      <el-row :gutter="10" class="m-top">
        <el-col :span="8">
          <el-form-item prop="applyType" label="申请类型">
            <el-select v-model="applyForm.applyType">
              <el-option v-for="apyType in applyTypes"
                :label="apyType.label"
                :value="apyType.value"></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item prop="applicant" label="申请人">
            <el-input v-model="applyForm.applicant"></el-input>
          </el-form-item> -->
          <el-form-item v-if="applyForm.applyType !== 'newBusiness'" prop="project" label="项目组">
            <el-select v-model="applyForm.project">
              <el-option v-for="project in applyTypes"
                :label="project.label"
                :value="project.value"></el-option> <!-- 因为这个project可以选填可以输入，所以只取字符串 -->
            </el-select>
          </el-form-item>
          <el-form-item v-if="applyForm.applyType === 'newBusiness'" prop="project" label="所属业务">
            <el-input v-model="applyForm.project"></el-input>
          </el-form-item>

          <el-form-item v-if="applyForm.applyType === 'newGroup'" prop="applicationName" label="应用名">
            <el-select v-model="applyForm.applicationName">
              <el-option v-for="application in applyTypes"
                :label="application.label"
                :value="application.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="applyForm.applyType !== 'newGroup'" prop="applicationName" label="应用名">
            <el-input v-model="applyForm.applicationName"></el-input>
          </el-form-item>

          <!-- <el-form-item prop="date" label="申请时间">
            <el-date-picker type="date" placeholder="选择日期" v-model="applyForm.date" style="width: 100%;"></el-date-picker>
          </el-form-item> -->
        </el-col>
      </el-row>

      <el-row class="m-row">

        <el-col :span="8" v-for = "(item, index) in applyForm.data">
          <el-button type="text" class="icon-close" v-if="index !== 0" @click.prevent="removeItem(item)">删除</el-button>

          <el-form-item
            :label="index === 0 ? '使用环境' : ''"
            :prop="'data.' + index + '.environment'"
            :rules="{
              required: true, message: '使用环境不能为空', trigger: 'change', type: 'object'
            }">
            <el-select v-model="item.environment" placeholder="请选择使用环境">
              <el-option v-for="envir in environmentList"
                :label="envir.label"
                :value="envir"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            :label="index === 0 ? '数量' : ''"
            :prop="'data.' + index + '.quantity'"
            :rules="{ required: true, validator: checkNumber, trigger: 'blur' }">
            <el-input v-model="item.quantity"></el-input>
            <!-- <el-input-number v-model="item.quantity" :min="1"></el-input-number> -->
          </el-form-item>

          <el-form-item
            :label="index === 0 ? 'OS' : ''"
            :prop="'data.' + index + '.operateSystem'"
            :rules="{
              type: 'object', required: true, message: 'OS不能为空', trigger: 'change'
            }">
            <el-select v-model="item.operateSystem" placeholder="请选择OS">
              <el-option v-for="system in systemsList"
                :label="system.label"
                :value="system"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            :label="index === 0 ? '主机' : ''"
            :prop="'data.' + index + '.hostType'"
            :rules="{
              type: 'object', required: true, message: '主机类型不能为空', trigger: 'change'
            }">
            <el-select v-model="item.hostType" placeholder="请选择主机类型">
              <el-option v-for="host in hostTypeList"
                :label="host.label"
                :value="host"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            :label="index === 0 ? 'CPU核数' : ''"
            :prop="'data.' + index + '.cpu'"
            :rules="{ required: true, validator: checkNumber, trigger: 'blur' }">
            <el-input type="number" v-model="item.cpu" placeholder="请输入您需要的cpu核数"></el-input>
          </el-form-item>

          <el-form-item
            :label="index === 0 ? '内存(G)' : ''"
            :prop="'data.' + index + '.internalStorage'"
            :rules="{ required: true, validator: checkNumber, trigger: 'blur' }">
            <el-input v-model="item.internalStorage" placeholder="请输入您需要的内存"></el-input>
          </el-form-item>

          <el-form-item
            :label="index === 0 ? '硬盘(G)' : ''"
            :prop="'data.' + index + '.hardDisk'"
            :rules="{ required: true, validator: checkNumber, trigger: 'blur' }">
            <el-input v-model="item.hardDisk" placeholder="请输入您需要的硬盘"></el-input>
          </el-form-item>

          <el-form-item
            :label="index === 0 ? '资产编号' : ''"
            :prop="'data.' + index + '.assetNumber'">
            <el-input type="number" v-model="item.assetNumber"></el-input>
          </el-form-item>

          <el-form-item :label="index === 0 ? '资源分数' : ''">
            {{ item.score = item.cpu * 1 + item.internalStorage * 1 + item.hardDisk / 20 }}
          </el-form-item>
        </el-col>

        <el-col :span="2" class="icon-plus" v-if="applyForm.data.length < 5">
          <el-button type="text" @click="onAdd"><i class="el-icon-plus"></i></el-button>
        </el-col>

      </el-row>

      <el-form-item label="备注">
        <el-col :span="12">
          <el-input type="textarea" v-model="applyForm.remark"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('applyForm')">立即创建</el-button>
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
      checkNumber (rule, value, callback) {
        if (!value) {
          return callback(new Error('不为空且必须大于0'))
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
      },
      onAdd () {
        this.applyForm.data.push({
          environment: null,
          quantity: '',
          operateSystem: null,
          hostType: null,
          cpu: '',
          internalStorage: '',
          hardDisk: '',
          assetNumber: '',
          score: 0
        })
      },
      removeItem (item) {
        var index = this.applyForm.data.indexOf(item)
        if (index !== -1) {
          this.applyForm.data.splice(index, 1)
        }
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
    border-bottom: 1px dashed #C0CCDA;
  }
  .m-row {
    width: auto;
    display: flex;

    .icon-plus {
      margin-bottom: 20px;
      background-color: #f8f8f8;
      margin-left: 10px;
      text-align: center;
      .el-button {
        display: block;
        width: 100%;
        height: 100%;
        font-size: 28px;
        color: #C0CCDA;
        border: 1px solid #C0CCDA;

        &:hover {
          border-color: #C0CCDA;
          background-color: #C0CCDA;
          color: #fff;
        }
      }
    }

    .el-col:not(:last-child) {
      position: relative;
      &:after {
        content: '';
        position: absolute;
        top: 0;
        right: -40px;
        display: block;
        width: 1px;
        height: 95%;
        background-color: #C0CCDA;
      }
    }

    .el-col:not(:first-child) {
      position: relative;
      .icon-close {
        display: block;
        cursor: pointer;
        z-index: 2;
        position: absolute;
        bottom: 20px;
        right: 2%;
      }
    }
  }
</style>
