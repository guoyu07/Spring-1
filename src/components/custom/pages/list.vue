<style scoped>
  .btn-area {
    margin-bottom: 12px;
  }

  .mgb12 {
    margin-bottom: 12px;
  }
</style>

<template>
  <div class="processes">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3><i class="el-icon-fa-sitemap icon-lg"></i> 流程自定义</h3>
          <el-alert
            title="在此修改或新建流程的 BPMN（业务流程建模标记），以自定义流程的环节和走向 :)"
            type="info"
            show-icon
            class="mgb12">
          </el-alert>
          <div class="btn-area clear">
            <el-button type="info" :plain="true" @click="onNewBpmn" icon="plus">新建流程 BPMN</el-button>
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
                <el-button type="info" size="small" :plain="true" @click="$router.replace(`/custom/bpmn/${scope.row.pkey}`)" icon="fa-cogs">自定义</el-button>
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
      }
    }
  }
</script>
