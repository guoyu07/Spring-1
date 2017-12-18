<template>
  <div class="wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3><i class="el-icon-fa-folder-open icon-lg"></i> {{ $route.query.pkey === 'appAddCluster' ? '应用新增节点' : '应用上线'}}</h3>
          <!-- <router-link to="/system/apply" class="el-button el-button--primary margin-bottom">新建</router-link> -->
          <el-button icon="plus" class="margin-bottom">
            <router-link to="/system/apply">新应用</router-link>
          </el-button>
          <el-table
            :data="onlinelist"
            border
            style="width: 100%; min-width: 460px">
            <el-table-column
              prop="pnum"
              label="工单号">
            </el-table-column>
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
              prop="tname"
              label="当前任务">
            </el-table-column>
            <el-table-column
              label="操作">
              <template scope='scope'>
                <router-link
                  :to="{ path: `/procedure/${scope.row.pid}/${scope.row.tid}/${scope.row.tname}`}">
                  <el-button type="info" size="small" icon="more">查看</el-button>
                </router-link>
              </template>
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
        onlinelist: [],
        currentPage: 1,
        pageSize: 10,
        totalFiltered: 0,
        form: {}
      }
    },
    created () {
      this.getOnlinelist()
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
        this.http.post('/form/', this.parseData(renderFromData)).then((res) => {
          this.form = res.data.data.form // 用于显示表格表头
        })
      },
      getOnlinelist () {
        let postData = {
          action: 'filter/tasks',
          method: 'GET',
          data: {
            filters: [{
              type: 'str',
              filter: this.$route.query.pkey,
              label: '流程key',
              key: 'pinstance__pd__pkey'
            }, {
              type: 'bool',
              filter: false,
              label: '任务是否结束',
              key: 'isend'
            }],
            detail: true,
            order: '-ctime',
            page: this.currentPage
          }
        }
        this.http.post('/flow/', this.parseData(postData)).then((res) => {
          // console.log(res)
          this.onlinelist = []
          res.data.data.list.forEach((list, k) => {
            list.message.map(item => {
              if (item.task_key === 'start') {
                this.onlinelist[k] = item.form
                this.onlinelist[k].pnum = list.pinstance.pnum
                this.onlinelist[k].tid = list.tid
                this.onlinelist[k].tname = list.ptask.tname
              }
            })
          })
          this.totalFiltered = res.data.data.total
        })
      },
      onPageChange (val) {
        this.currentPage = val
        this.getOnlinelist()
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
