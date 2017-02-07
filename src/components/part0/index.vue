<template>
  <div id="item1-side" class="wrapper">
    <h3 class="form-title">服务资源申请单</h3>
    <el-form ref="applyForm" :model="applyForm" :rules="applyRules" label-width="85px">
      <el-row :gutter="10" class="m-top">
        <el-col :span="8">

          <el-form-item prop="applicant" label="申请人">
            <el-input v-model="applyForm.applicant"></el-input>
          </el-form-item>

          <el-form-item prop="project" label="项目组">
            <el-input v-model="applyForm.project"></el-input>
          </el-form-item>

          <el-form-item prop="date" label="申请时间">
            <el-date-picker type="date" placeholder="选择日期" v-model="applyForm.date" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="m-row">

        <el-col :span="8" v-for = "(item, index) in applyForm.data">
          <el-button type="text" class="icon-close" v-if="index !== 0" @click.prevent="removeItem(item)">删除</el-button>

          <el-form-item 
            :label="index === 0 ? '使用环境' : ''"
            :prop="'data.' + index + '.environment'">
            <el-select v-model="item.environment" placeholder="请选择使用环境">
              <el-option label="环境一" value="shanghai"></el-option>
              <el-option label="环境二" value="beijing"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item 
            :label="index === 0 ? '用途' : ''"
            :prop="'data.' + index + '.purpose'"
            :rules="{
              required: true, message: '用途不能为空', trigger: 'blur'
            }">
            <el-input v-model="item.purpose"></el-input>
          </el-form-item>

          <el-form-item 
            :label="index === 0 ? 'OS' : ''"
            :prop="'data.' + index + '.operateSystem'">
            <el-select v-model="item.operateSystem" placeholder="请选择OS">
              <el-option label="OS1" value="OS1"></el-option>
              <el-option label="OS2" value="OS2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item 
            :label="index === 0 ? '实机IP' : ''"
            :prop="'data.' + index + '.machineIp'">
            <el-input v-model="item.machineIp"></el-input>
          </el-form-item>

          <el-form-item 
            :label="index === 0 ? '服务器类型' : ''"
            :prop="'data.' + index + '.serverType'">
            <el-select v-model="item.serverType" placeholder="请选择服务器类型">
              <el-option label="实体" value="type1"></el-option>
              <el-option label="虚拟" value="type2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item 
            :label="index === 0 ? 'CPU核数' : ''"
            :prop="'data.' + index + '.cpu'"
            :rules="{ validator: checkNumber, trigger: 'change' }">
            <el-input type="number" v-model="item.cpu" placeholder="请输入您需要的cpu核数"></el-input>
          </el-form-item>

          <el-form-item 
            :label="index === 0 ? '内存(G)' : ''"
            :prop="'data.' + index + '.internalStorage'">
            <el-input type="number" v-model="item.internalStorage" placeholder="请输入您需要的内存"></el-input>
          </el-form-item>

          <el-form-item 
            :label="index === 0 ? '硬盘(G)' : ''"
            :prop="'data.' + index + '.hardDisk'">
            <el-input type="number" v-model="item.hardDisk" placeholder="请输入您需要的硬盘"></el-input>
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
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        applyForm: {
          applicant: '',
          project: '',
          date: '',
          remark: '',
          data: [{
            environment: '',
            purpose: '',
            operateSystem: '',
            machineIp: '',
            serverType: '',
            cpu: '',
            internalStorage: '',
            hardDisk: '',
            score: 0
          }]
        },
        applyRules: {
          applicant: [
            { required: true, message: '请输入申请人', trigger: 'blur' }
            // { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ],
          project: [
            { required: true, message: '请输入项目组', trigger: 'blur' }
          ],
          date: [
            { type: 'date', required: true, message: '请输入日期', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      checkNumber (rule, value, callback) {
        if (!value) {
          return callback(new Error('不能为空并且必须大于0'))
        }
        setTimeout(() => {
          if (value < 0) {
            callback(new Error('必须大于0'))
          } else {
            callback()
          }
        }, 1000)
      },
      onSubmit () {
        // this.applyForm.data.map(v => {
        //   v.score = v.cpu * 1 + v.internalStorage * 1 + v.hardDisk / 20
        //   return v
        // })
      },
      onAdd () {
        this.applyForm.data.push({
          no: '',
          environment: '',
          purpose: '',
          operateSystem: '',
          machineIp: '',
          serverType: '',
          cpu: '',
          internalStorage: '',
          hardDisk: '',
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