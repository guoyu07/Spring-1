<style lang="less">
  .tag-container {
    margin-bottom: 12px;

    h3 {
      float: left;
    }
  }

  .el-dropdown-menu__item {
    line-height: 28px;
    font-size: 14px;

    i {
      width: 14px;
      font-size: 12px;
    }
  }
</style>

<template>
  <div class="orders">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <div class="tag-container clear">
            <h3><i class="el-icon-document"></i> {{filter}}工单</h3>
            <el-radio-group v-model="filter" @change="onFilterChange" size="small" class="fr">
              <el-radio-button v-for="(filter, key) in filters" :label="key"></el-radio-button>
            </el-radio-group>
          </div>
          <el-table
            :data="filteredList"
            stripe
            border>
            <el-table-column
              prop="name"
              label="任务"></el-table-column>
            <el-table-column
              prop="variables.author"
              label="创建者"></el-table-column>
            <el-table-column
              prop="assignee"
              label="指派者"
              v-if="filter === '已审核' || filter === '待审核'"></el-table-column>
            <el-table-column
              :label="filter === '已审核' ? '认领时间' : '创建时间'"
              inline-template
              v-if="filter !== '已参与'"
              :context="_self">
              <template>
                <small>{{ (filter === '已审核' ? row.claimTime : row.createTime) | convertTime }}</small>
              </template>
            </el-table-column>
            <el-table-column
              label="起始时间"
              inline-template
              :context="_self"
              v-if="filter === '已参与'">
              <template>
                <small>{{ row.startTime | convertTime }}</small>
              </template>
            </el-table-column>
            <el-table-column
              label="终止时间"
              inline-template
              :context="_self"
              v-if="filter === '已参与'">
              <template>
                <small>{{ row.endTime | convertTime }}</small>
              </template>
            </el-table-column>
            <el-table-column
              inline-template
              :context="_self"
              label="操作">
              <template>
                <el-dropdown trigger="click" menu-align="start">
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-caret-bottom el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="filter === '待认领'" @click.native="onClaim(row)"><i class="el-icon-check"></i> 认领</el-dropdown-item>
                    <el-dropdown-item v-if="filter === '待审核'" @click.native="onApprove(row)"><i class="el-icon-check"></i> 通过</el-dropdown-item>
                    <el-dropdown-item v-if="filter === '待审核'" @click.native="onReject(row)"><i class="el-icon-close"></i> 驳回</el-dropdown-item>
                    <el-dropdown-item :divided="filter !== '已审核' && filter !== '已参与'" @click.native="onView(row)"><i class="el-icon-view"></i> 查看</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
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
        filter: '待认领',
        filters: {
          '待认领': 'runtime/tasks/assignee',
          '待审核': 'runtime/tasks/self',
          '已审核': 'history/tasks/self',
          '已参与': 'history/process/instances/self'
        },
        filteredList: [],
        currentPage: 1,
        pageSize: 10,
        totalFiltered: 0
      }
    },

    created () {
      this.getFilteredList()
    },

    methods: {
      onFilterChange () {
        this.currentPage = 1
        this.getFilteredList()
      },

      getFilteredList () {
        let postData = {
          action: this.filters[this.filter],
          method: 'GET',
          data: { page: this.currentPage }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          console.log(res)
          this.filteredList = res.data.data.data
          this.totalFiltered = res.data.data.total
        })
      },

      onPageChange (val) {
        this.currentPage = val
        this.getFilteredList()
      },

      onClaim (task) {
        this.$confirm(`确定认领任务「${task.name}」吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          let postData = {
            action: 'runtime/task/claim',
            method: 'POST',
            data: { tid: task.id }
          }
          this.http.post('', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              this.$message.success('已认领！')
            }
            this.getFilteredList()
          })
        })
      },

      onReject (task) {
        this.$prompt(`请输入对「${task.name}」的驳回意见：`, '确定驳回？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(({ remark }) => {
          let postData = {
            action: 'runtime/task/complete',
            method: 'POST',
            data: {
              tid: task.id,
              form: { remark },
              pass: -1
            }
          }
          this.http.post('', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              this.$message.success('已驳回！')
            }
            this.getFilteredList()
          })
        })
      }
    }
  }
</script>