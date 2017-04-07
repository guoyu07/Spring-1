<template>
  <div class="apply">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3><i class="el-icon-fa-list-alt icon-lg"></i> 防火墙审批结果</h3>
          <el-col :span="12">
            <el-form label-width="100px">
              <el-form-item label="申请人">
                <span>{{applicant}}</span>
              </el-form-item>
              <el-form-item label="源 IP">
                <span>{{sourceIp}}</span>
              </el-form-item>
              <el-form-item label="目标 IP">
                <span>{{targetIp}}</span>
              </el-form-item>
              <el-form-item label="端口">
                <span>{{port}}</span>
              </el-form-item>
              <el-form-item label="申请理由">
                <span>{{reason}}</span>
              </el-form-item>
              <el-form-item label="工具">
                <span>{{tool}}</span>
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
        tool: '',
        sourceIpList: ['172.31.9.95', '172.31.8.2', '172.31.8.3', '172.31.8.4'],
        targetIpList: ['172.31.9.95', '172.31.8.2', '172.31.8.3', '172.31.8.4']
      }
    },

    computed: {
      applicant () {
        return window.localStorage.applicant
      },

      sourceIp () {
        return window.localStorage.sourceIp
      },

      targetIp () {
        return window.localStorage.targetIp
      },

      port () {
        return window.localStorage.port
      },

      reason () {
        return window.localStorage.reason
      }
    }
  }
</script>