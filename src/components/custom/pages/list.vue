<style scoped>
  .btn-area {
    margin-bottom: 12px;
  }
</style>

<template>
  <div class="processes">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3><i class="el-icon-fa-sitemap icon-lg"></i> 流程基本管理</h3>
          <div class="btn-area clear">
            <el-button type="success" @click="onNewBpmn" icon="plus" class="fr">新建流程 BPMN</el-button>
          </div>
          <el-table
            :data="processList"
            border>
            <el-table-column
              prop="pname"
              label="流程名称"></el-table-column>
            <el-table-column
              prop="category"
              label="类别"></el-table-column>
            <el-table-column
              label="操作">
              <template scope="scope">
                <el-button type="info" size="small" :plain="true" @click="onLoadBpmn(scope.row.pkey)">查看／更新 BPMN</el-button>
              </template>  
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        processList: []
      }
    },

    created () {
      this.getProcessList()
    },

    methods: {
      onNewBpmn () {
        window.localStorage.removeItem('bpmn')
        this.$router.replace('/custom/new')
      },

      getProcessList () {
        let postData = {
          action: 'permission/process',
          method: 'GET',
          data: {}
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.processList = res.data.data
          }
        })
      },

      onLoadBpmn (pkey) {
        let postData = {
          action: 'process/bpmn/data',
          method: 'GET',
          data: { pkey }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            window.localStorage.setItem('bpmn', res.data.data)
            this.$router.replace(`/custom/bpmn/${pkey}`)
          }
        })
      }
    }
  }
</script>