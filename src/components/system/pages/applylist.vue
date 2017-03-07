<template>
  <div>
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3>资源申请列表</h3>
          <router-link to="/system/apply" class="el-button el-button--primary margin-bottom">新建</router-link>
          <el-table
            :data="applyList"
            border
            style="width: 100%; min-width: 460px">
            <el-table-column type="expand">
              <template scope="props">
                <div class="item-block" v-for="item in props.row.data">
                  <p>主机: {{ item.hostType }}</p>
                  <p>环境: {{ item.environment }}</p>
                  <p>数量: {{ item.quantity }}</p>
                  <p>OS: {{ item.operateSystem }}</p>
                  <p>CPU: {{ item.cpu }}</p>
                  <p>内存(G): {{ item.internalStorage }}</p>
                  <p>硬盘(G): {{ item.hardDisk }}</p>
                  <p>资源分数: {{ item.score }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="applicationName"
              label="应用名"></el-table-column>
            <el-table-column
              prop="applyType"
              label="申请类型"></el-table-column>
            <el-table-column
              prop="business"
              label="项目组"></el-table-column>
            <el-table-column
              prop="name"
              label="当前任务"></el-table-column>
            <el-table-column
              inline-template
              :context="_self"
              label="操作">
              <div class="btn-block">
                <router-link :to="{ path: `/system/${row.taskDefinitionKey}/${row.id}/${row.name}`}" class="el-button el-button--primary el-button--small">审批</router-link>
                <el-button type="text" @click="showDialogReject(row)">驳回</el-button>
              </div>
            </el-table-column>
          </el-table>
          <div class="pagination-block clear">
            <el-pagination
              class="fr"
              layout="prev, pager, next"
              :current-page="currentPage"
              :page-size="pageSize"
              @current-change="onPageChange"
              :total="totalFiltered">
            </el-pagination>
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
        applyList: [],
        currentPage: 1,
        pageSize: 10,
        totalFiltered: 0,
        dialogReject: false
      }
    },

    created () {
      this.getApplyList()
    },

    methods: {
      getApplyList () {
        let postData = {
          action: 'runtime/tasks/self',
          method: 'GET',
          data: {
            taskDefinitionKey: 'restart'
          }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          res.data.data.data.forEach((list, k) => {
            list.variables.message.map(item => {
              if (item.task_key === 'start') {
                this.applyList[k] = item.form
                this.applyList[k].id = list.id
                this.applyList[k].taskDefinitionKey = list.taskDefinitionKey
                this.applyList[k].name = list.name
              }
            })
          })
          this.totalFiltered = res.data.data.total
        })
      },

      onPageChange () {
        this.getApplyList()
      },
      showDialogReject (row) {
        this.dialogReject = true
      },
      onReject (row) {
        console.log(row)
        this.dialogReject = false
      },
      onCancel () {
        this.dialogReject = false
      }
    }
  }
</script>
<style lang="less" scoped>
.btn-block {
  .el-button {
    margin-right: 10px;
    margin-left: 0;

    &:last-child {
      margin-right: 0;
    }
  }
}
.item-block {
  display: inline-block;
  margin-right: 30px;
  padding-right: 20px;
  border-right: 1px dashed #e0e6ed;
  color: #5e6d82;

  &:last-child {
    border-right: none;
  }
}
.margin-bottom {
  margin-bottom: 15px;
}
.el-button:hover{
  text-decoration: none;
}
</style>
