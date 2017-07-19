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
          <!-- <el-button icon="plus" @click="eventConfVisible = true" style="margin-bottom: 12px">创建事件</el-button> -->
          <el-row type="flex" justify="space-between">
            <el-col :span="6">
              <router-link :to="{ path: '/procedure/start/incident/事件处理' }" class="el-button el-button--plain" style="margin-bottom: 12px"><i class="el-icon-plus"></i> 创建事件</router-link>
            </el-col>
            <el-col :md="8" :lg="4" flex="end">
              <el-input placeholder="模糊搜索事件" v-model="searchKey" @keyup.enter.native="getIncidentList">
                <el-button slot="append" icon="search" @click="getIncidentList"></el-button>
              </el-input>
            </el-col>
          </el-row>
          <el-table
            :data="incidentList"
            v-loading.body="loading"
            stripe
            border>
            <el-table-column
              label="单号"
              inline-template
              :context="_self">
              <template>
                <small>{{row.workFlowNo}}</small>
              </template>
            </el-table-column>
            <el-table-column
              label="事件摘要"
              inline-template
              :context="_self">
              <template>
                <span v-if="row.variables.message.length">{{row.variables.message[0].form.header.summary}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="优先级"
              width="100px"
              inline-template
              :context="_self">
              <template>
                <span v-if="row.variables.message.length">
                  <i v-if="row.variables.message[0].form.header.priority === '高'" class="el-icon-fa-long-arrow-up text-error"></i>
                  <i v-if="row.variables.message[0].form.header.priority === '正常'" class="el-icon-fa-minus text-success"></i>
                  <i v-if="row.variables.message[0].form.header.priority === '低'" class="el-icon-fa-long-arrow-down text-warning"></i>
                  {{row.variables.message[0].form.header.priority}}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="当前处理人"
              inline-template
              :context="_self">
              <template>
                <span>{{row.variables.message[0].form.header.assignee ? row.variables.message[0].form.header.assignee.userId : '无'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              inline-template
              :context="_self">
              <template>
                <small>{{row.createTime | convertTime}}</small>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              inline-template
              :context="_self">
              <template>
                <router-link :to="{ path: `/event-hub/event/${row.id}` }" class="el-button el-button--small el-button--plain"><i class="el-icon-more"></i> 详情</router-link>
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
  import eventConf from './_plugins/_eventConf.vue'

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
        searchKey: '',
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
          action: 'incident/search',
          method: 'GET',
          data: {
            page: this.pagination.current,
            includeProcessVariables: 'true',
            search_str: this.searchKey
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
