<template>
  <div>
    <el-row>
      <el-col :sm="24" :md="24" :lg="24">
        <el-card class="box-card">
          <h3>资源申请列表</h3>
          <router-link to="/system/apply" class="el-button el-button--primary margin-bottom">新建</router-link>
          <el-table
            :data="applyList"
            border
            style="width: 100%; min-width: 460px">
            <!-- <el-table-column type="expand">
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
            </el-table-column> -->
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
                <router-link v-if="row.name==='填写申请单'" :to="{ path: `/system/apply/${row.id}`}" class="el-button el-button--primary el-button--small">填写</router-link>
                <span v-else v-for="action in row.action">
                  <router-link v-if="action.type==='submit'" :to="{ path: `/system/${row.taskDefinitionKey}/${row.id}/${row.name}`}" class="el-button el-button--primary el-button--small">审批</router-link>
                  <el-button v-else-if="action.type==='back'" :plain="true" type="danger" size="small" @click="onReject(row, action)">{{action.name}}</el-button>
                  <!-- action.pass===1?'驳回':'撤销' -->
                </span>
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
            processDefinitionKey: 'host_apply'
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
                this.applyList[k].action = list.action
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
      onReject (task, action) {
        this.$prompt('请输入对「' + task.applicationName + '」的' + action.name + '意见：', '确定' + action.name + '？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({value}) => {
          if (!value) {
            this.$message.error('失败：驳回意见不可留空！')
            return
          }
          let postData = {
            action: 'runtime/task/complete',
            method: 'POST',
            data: {
              tid: task.id,
              form: { value },
              pass: action.pass
            }
          }
          this.http.post('', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              this.$message.success('已' + action.name)
            }
            // this.applyList = [] // 清空表格数据
            this.getApplyList() // 重新请求数据
          })
        })
      },
      onCancel () {
        this.dialogReject = false
      }
    }
  }
</script>
<style lang="less" scoped>
.btn-block {
  padding: 8px 0;
  display: flex;
  flex-wrap: wrap;
  align-content: space-around;
  .el-button {
    margin-right: 5px;
    margin-bottom: 2px;
    margin-top: 2px;
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
.margin-left {
  margin-left: 10px;
}
.el-button:hover{
  text-decoration: none;
}
</style>
