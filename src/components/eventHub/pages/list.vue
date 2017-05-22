<style lang="less" scoped>
  .el-table {
    .el-tag {
      margin-right: 6px;
    }
  }
</style>

<template>
  <div class="list">
    <el-row>
      <el-col :md="24" :lg="20">
        <el-card class="box-card">
          <h3><i class="el-icon-fa-rss icon-lg"></i> 事件</h3>
          <el-button icon="plus" @click="eventConfVisible = true" style="margin-bottom: 12px">创建事件</el-button>
          <el-table
            :data="incidentList"
            v-loading.body="loading"
            stripe
            border>
            <el-table-column label="事件摘要">
              <template scope="scope">
                <span>{{scope.row.variables.message[0].form.header.summary}}</span>
              </template>
            </el-table-column>
            <el-table-column label="优先级" width="80px">
              <template scope="scope">
                <span>
                  <i v-if="scope.row.variables.message[0].form.header.priority === '高'" class="el-icon-fa-long-arrow-up text-error"></i>
                  <i v-if="scope.row.variables.message[0].form.header.priority === '正常'" class="el-icon-fa-minus text-success"></i>
                  <i v-if="scope.row.variables.message[0].form.header.priority === '低'" class="el-icon-fa-long-arrow-down text-warning"></i>
                  {{scope.row.variables.message[0].form.header.priority}}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="标签">
              <template scope="scope">
                <el-tag type="primary" v-for="label in scope.row.variables.message[0].form.header.labels">{{label}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="被指派者">
              <template scope="scope">
                <span>{{scope.row.variables.message[0].form.header.assignee ? scope.row.variables.message[0].form.header.assignee.code : '无'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间">
              <template scope="scope">
                <small>{{scope.row.createTime | convertTime}}</small>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <router-link :to="{ path: `/event-hub/event/${scope.row.id}` }" class="el-button el-button--small el-button--plain"><i class="el-icon-more"></i> 详情</router-link>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-block clear">
            <el-pagination
              class="fr"
              layout="prev, pager, next"
              :current-page="pagination.current"
              :page-size="pagination.pageSize"
              @current-change="onPageChange"
              :total="pagination.total">
            </el-pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <event-conf :event-data="eventData" :is-editing="false" :visible="eventConfVisible"></event-conf>
  </div>
</template>

<script>
  import eventConf from './_config/_eventConf.vue'

  export default {

    data () {
      return {
        loading: false,
        incidentList: [],
        eventData: {
          summary: '',
          reporter: {},
          components: [],
          attachments: [],
          description: '',
          issue: '',
          assignee: {},
          approver: {},
          priority: '',
          labels: []
        },
        eventConfVisible: false,
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0
        }
      }
    },

    created () {
      this.getIncidentList()
    },

    methods: {
      onPageChange (val) {
        this.pagination.current = val
        this.getIncidentList()
      },

      getIncidentList () {
        let postData = {
          action: 'runtime/incident/list',
          method: 'GET',
          data: {
            page: this.pagination.current
          }
        }
        this.loading = true
        this.http.post('', this.parseData(postData)).then((res) => {
          this.incidentList = res.data.data.data
          this.pagination.total = res.data.data.total
          this.loading = false
        })
      }
    },

    components: {
      // assign,
      // claim,
      // progressWrap
      eventConf
    }
  }
</script>
