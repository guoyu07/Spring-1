<style lang="less">
  .tag-container {
    margin-bottom: 12px;

    h3 {
      float: left;
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
            <el-radio-group v-model="filter" @change="getFilteredList" size="small" class="fr">
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
              prop="assignee"
              label="指派者"></el-table-column>
            <el-table-column
              label="创建时间"
              inline-template
              :context="_self">
              <template>{{ row.createTime | convertTime }}</template>
            </el-table-column>
            <el-table-column
              label="优先级"
              width="80"
              inline-template
              :context="_self">
              <template>
                <el-tag :type="row.priority > 50 ? 'danger' : 'primary'">{{row.priority}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              inline-template
              :context="_self"
              label="操作"
              width="150">
              <template>
                <el-button size="small" v-if="filter === '待认领'" @click="onClaim(row)">认领</el-button>
                <el-button size="small" type="success" v-if="filter === '待审核'">通过</el-button>
                <el-button size="small" type="danger" v-if="filter === '待审核'" @click="onReject(row)">驳回</el-button>
                <el-button size="small" v-if="filter === '已审核'">查看</el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column
              label="标签"
              width="100"
              :filters="[{ text: '待认领', value: '待认领' }, { text: '待审核', value: '待审核' }, { text: '已审核', value: '已审核' }]"
              :filter-method="getFilteredList">
              <template scope="scope">
                <el-tag
                  :type="filter === '待认领' ? 'danger' : 'success'"
                  close-transition>{{filter}}</el-tag>
              </template>
            </el-table-column> -->
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
          '已审核': 'history/tasks/self'
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
      getFilteredList () {
        let postData = {
          action: this.filters[this.filter],
          method: 'GET',
          data: {}
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          console.log(res)
          this.filteredList = res.data.data.data
          this.totalFiltered = res.data.data.total
        })
      },

      onPageChange () {
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
          cancelButtonText: '取消'
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