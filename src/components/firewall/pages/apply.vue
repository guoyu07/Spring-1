<template>
  <div class="apply">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3><i class="el-icon-fa-fire icon-lg"></i> 防火墙开通申请</h3>
          <el-col :span="12">
            <el-form label-width="100px">
              <el-form-item label="申请人">
                <el-select v-model="applicant">
                  <el-option label="cmdb_test" value="cmdb_test"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="源 IP">
                <el-select v-model="sourceIp">
                  <el-option v-for="ip in sourceIpList" :label="ip" :value="ip"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="目标 IP">
                <el-select v-model="targetIp">
                  <el-option v-for="ip in targetIpList" :label="ip" :value="ip"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="端口">
                <el-input v-model="port"></el-input>
              </el-form-item>
              <el-form-item label="申请理由">
                <el-input type="textarea" v-model="reason"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">提交</el-button>
                <el-button>取消</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        applicant: 'cmdb_test',
        sourceIp: '',
        targetIp: '',
        port: '',
        reason: '',
        sourceIpList: ['172.31.9.95', '172.31.8.2', '172.31.8.3', '172.31.8.4'],
        targetIpList: ['172.31.9.95', '172.31.8.2', '172.31.8.3', '172.31.8.4']
      }
    },

    methods: {
      onSubmit () {
        window.localStorage.applicant = this.applicant
        window.localStorage.sourceIp = this.sourceIp
        window.localStorage.targetIp = this.targetIp
        window.localStorage.port = this.port
        window.localStorage.reason = this.reason
        this.$message.success('提交成功！')
      }
    }
  }
</script>