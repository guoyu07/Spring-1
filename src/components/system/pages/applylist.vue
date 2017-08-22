<template>
  <div>
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3><i class="el-icon-fa-envelope-open-o icon-lg"></i> 资源申请列表</h3>
          <router-link to="/system/apply" class="el-button el-button--primary margin-bottom">新建</router-link>
          <el-table
            :data="applyList"
            border
            style="width: 100%; min-width: 460px">
            <el-table-column
              v-for="(formHeader, index) in form.header"
              :key="index"
              :label="formHeader.name">
              <template scope="scope">
                <span v-if="formHeader.value.type === 'FK' || formHeader.value.type === 'dict'">
                  <span v-if="typeof Object.assign({}, scope.row.header)[formHeader.id] === 'object'">
                    {{ Object.assign({}, Object.assign({}, scope.row.header)[formHeader.id])['name'] }}
                  </span>
                  <span v-else>{{ Object.assign({}, scope.row.header)[formHeader.id] }}</span>
                </span>
                <span v-else-if="formHeader.value.type === 'FKs' || formHeader.value.type === 'dicts'">
                  <span v-for="span in Object.assign({}, scope.row.header)[formHeader.id]">{{span.name}}</span>
                </span>
                <span v-else>{{ Object.assign({}, scope.row.header)[formHeader.id] }}</span>
              </template>
            </el-table-column>
            <el-table-column
              inline-template
              :context="_self"
              label="操作">
              <div class="btn-block">
                <!-- <router-link v-if="row.name==='填写申请单'" :to="{ path: `/system/apply/${row.id}`}" class="el-button el-button--primary el-button--small">填写</router-link>
                <span v-else v-for="action in row.action">
                  <router-link v-if="action.type==='submit'" :to="{ path: `/system/${row.taskDefinitionKey}/${row.id}/${row.name}`}" class="el-button el-button--primary el-button--small">审批</router-link>
                  <el-button v-else-if="action.type==='back'" :plain="true" type="danger" size="small" @click="onReject(row, action)">{{action.pass===2?'驳回':'撤单'}}</el-button>
                </span> -->
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
        dialogReject: false,
        form: {}
      }
    },
    created () {
      this.getApplyList()
      this.renderTaskForm()
    },
    methods: {
      renderTaskForm () { // 渲染表单数据
        const renderFromData = {
          action: 'process/form',
          method: 'GET',
          data: {
            pkey: 'host_apply',
            tkey: 'start'
          }
        }
        // this.loading = true
        this.http.post('/form/', this.parseData(renderFromData)).then((res) => {
          this.form = res.data.data.form
          this.form.header.map(group => {
            group.value.map(item => {
              this.setDataType(item, this.applyFormHead, this)
            })
          })
          this.form.body.body_list[0].attr_list.map(group => {
            group.value.map(item => {
              this.setDataType(item, this.applyForm.data[0], this)
              // this.$watch('applyForm.data.0', newVal => {
              //   newVal.score = (newVal.cpu * 1 + newVal.storage * 1 + newVal.hardDisk / 20) + ''
              // }, {deep: true})
            })
          })
          // this.loading = false
        })
      },
      getApplyList () {
        let postData = {
          action: 'runtime/tasks/self',
          method: 'GET',
          data: {
            processDefinitionKey: 'host_apply',
            page: this.currentPage
          }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          this.applyList = []
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
      onPageChange (val) {
        this.currentPage = val
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
            action: 'task',
            method: 'POST',
            data: {
              tid: task.id,
              form: { value },
              pass: action.pass
            }
          }
          this.http.post('/flow/', this.parseData(postData)).then((res) => {
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
