<template>
  <div class="wrapper" style="padding-left: 220px">
    <el-row>
      <el-col :md="24" :lg="20">
        <el-card class="box-card" v-loading.body="loading">
          <time-query @change-timequery="onTimeQueryChange"></time-query>
          <h3><i class="el-icon-fa-hourglass icon-lg"></i> 工作量统计</h3>

          <line-chart :time-query="timeQuery"></line-chart>

          <el-row type="flex" justify="end" style="margin: 12px 0;">
            <el-button icon="fa-upload" type="primary" size="small">导出工作量统计</el-button>
          </el-row>

          <el-table
            :data="statistics">
            <el-table-column type="expand">
              <template scope="props">
                <el-table :data="props.row.list" stripe border>
                  <el-table-column
                    label="用户名称"
                    prop="opt_user_nick"></el-table-column>
                  <el-table-column
                    label="执行次数"
                    prop="num"></el-table-column>
                  <el-table-column
                    label="平均耗时"
                    inline-template
                    :context="_self">
                    <span>{{ _translateTime(row.avg_duration) }}</span>
                  </el-table-column>
                  <el-table-column
                    label="总耗时"
                    inline-template
                    :context="_self">
                    <span>{{ _translateTime(row.total_duration) }}</span>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column
              label="任务名称"
              prop="tname"></el-table-column>
            <el-table-column
              label="执行次数"
              prop="num"></el-table-column>
            <el-table-column
              label="平均耗时"
              inline-template
              :context="_self">
              <span>{{ _translateTime(row.avg_duration) }}</span>
            </el-table-column>
            <el-table-column
              label="标准工时"
              inline-template
              :context="_self">
              <span>{{ _translateTime(row.s_avg_duration) }}</span>
            </el-table-column>
            <el-table-column
              label="总耗时"
              inline-template
              :context="_self">
              <span>{{ _translateTime(row.total_duration) }}</span>
            </el-table-column>
            <el-table-column
              label="合计标准工时"
              inline-template
              :context="_self">
              <span>{{ _translateTime(row.s_total_duration) }}</span>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  // import getProcessList from './../../../mixins/getProcessList'
  import timeQueryMixin from './../../../../mixins/timeQuery'
  import translateTime from './../../../../mixins/translateTime'
  import timeQuery from './../../../_plugins/_timeQuery'
  import lineChart from './../_plugins/_lineChart'
  // import _ from './../../../utils/_'

  export default {
    mixins: [timeQueryMixin, translateTime],

    data () {
      return {
        timeQuery: {},
        statistics: []
      }
    },

    computed: {
      pkey () {
        return this.$route.params.pkey
      }
    },

    watch: {
      '$route.params.pkey' () {
        // this.pkey = val
        this.getWorkload()
      }
    },

    mounted () {
      this.getWorkload()
    },

    methods: {
      onTimeQueryChange ({ timeQuery }) {
        console.log(timeQuery)
        this.timeQuery = timeQuery
        this.getListByTimeQuery(this.getWorkload)
      },

      getWorkload () {
        let postData = {
          action: 'process/task/report/annotate',
          method: 'get',
          data: {
            pkey: this.pkey,
            time_query: this.timeQuery
          }
        }
        this.http.post('/report/', this.parseData(postData)).then((res) => {
          this.statistics = res.data.data.list
        })
      }
    },

    components: { timeQuery, lineChart }
  }
</script>