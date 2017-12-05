<template>
  <div class="wrapper">
    <el-row>
      <el-col :md="24" :lg="20">
        <el-card class="box-card" v-loading.body="loading">
          <time-query :time-query="timeQuery" @change-timequery="onTimeQueryChange"></time-query>
          <h3><i class="el-icon-fa-sitemap icon-lg"></i> 流程统计</h3>
          <!-- <el-select v-model="selectedProcess" placeholder="请先选择流程…" class="margin-bottom" value-key="pname">
            <el-option
              v-for="process in processList"
              :key="process.name"
              :label="process.pname"
              :value="process">
            </el-option>
          </el-select> -->
          <!-- <small class="process-desc"><i class="el-icon-information"></i> 此处仅为你可管理的流程</small> -->
          <el-row type="flex" justify="end" style="margin: 20px 0 12px;">
            <el-button icon="fa-upload" type="primary" size="small">导出流程统计</el-button>
          </el-row>
          <el-table :data="statistics" border>
            <el-table-column
              label="流程分类"
              prop="category"></el-table-column>
            <el-table-column
              label="流程名称"
              prop="pname"></el-table-column>
            <el-table-column
              label="平均耗时"
              inline-template
              :context="_self">
              <span>{{ _convertTime(row.avg_duration) }}</span>
            </el-table-column>
            <el-table-column
              label="标准工时"
              inline-template
              :context="_self">
              <span>{{ _convertTime(row.s_avg_duration) }}</span>
            </el-table-column>
            <el-table-column
              label="总耗时"
              inline-template
              :context="_self">
              <span>{{ _convertTime(row.total_duration) }}</span>
            </el-table-column>
            <el-table-column
              label="合计标准工时"
              inline-template
              :context="_self">
              <span>{{ _convertTime(row.s_total_duration) }}</span>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  // import getProcessList from './../../../mixins/getProcessList'
  import timeQueryMixin from './../../../mixins/timeQuery'
  import timeQuery from './_plugins/_timeQuery'
  // import _ from './../../../utils/_'

  export default {
    mixins: [timeQueryMixin],

    data () {
      return {
        timeQuery: {
          type: '',
          time: 0,
          unit: 'h',
          s_date: '',
          e_date: ''
        },
        statistics: []
      }
    },

    // watch: {
    //   selectedProcess () {
    //     this.getProcessStatistics()
    //   }
    // },

    mounted () {
      this.getProcessStatistics()
    },

    methods: {
      getProcessStatistics () {
        let postData = {
          action: 'process/task/report',
          method: 'GET',
          data: {
            time_query: this.timeQuery
          }
        }
        this.http.post('/report/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            // this.statistics = [{ ...res.data.data, ...{ pname: this.selectedProcess.pname, category: this.selectedProcess.category } }]
            this.statistics = res.data.data.list
          }
        })
      },

      onTimeQueryChange (args) {
        this.timeQuery = args.val
        this.getListByTimeQuery(this.getProcessStatistics)
      },

      _convertTime (ms) {
        if (!ms) return
        // const ONE_MIN = 60
        // const ONE_HR = ONE_MIN * 60
        // const ONE_DAY = ONE_HR * 24
        // const timeMap = {
        //   TWO_DAYS: ONE_DAY * 2,  // 48 hours
        //   FORTNIGHT: ONE_DAY * 14, // 2 weeks
        //   TWO_MONTHS: ONE_DAY * 60,  // 8 weeks
        //   S_TO_MIN (s) {
        //     return s / 60
        //   },
        //   S_TO_HOUR (s) {
        //     return this.S_TO_MIN(s) / 60
        //   },
        //   S_TO_DAY (s) {
        //     return this.S_TO_HOUR(s) / 24
        //   },
        //   S_TO_WEEK (s) {
        //     return this.S_TO_D(s) / 7
        //   },
        //   S_TO_MON (s) {
        //     return this.S_TO_D(s) / 30
        //   }
        // }
        // const seconds = ms / 1000
        // let result = null
        // if (seconds < ONE_MIN) {
        //   result = Math.floor(seconds) + ' 秒'
        // } else if (seconds < ONE_HR) {
        //   result = Math.floor(timeMap.S_TO_MIN(seconds) + '分')
        // } else if (seconds < ONE_DAY) {
        //   result = Math.floor(timeMap.S_TO_HOUR(seconds) + '分')
        // // } else if (seconds < timeMap.TWO_DAYS) {
        //   // result = Math.floor(seconds) + ' 秒'
        // } else if (seconds < timeMap.FORTNIGHT) {
        //   result = Math.floor(timeMap.S_TO_DAY(seconds)) + ' 天'
        // } else if (seconds < timeMap.TWO_MONTHS) {
        //   result = Math.floor(timeMap.S_TO_WEEK(seconds)) + ' 周'
        // } else if (seconds >= timeMap.TWO_MONTHS) {
        //   result = Math.floor(timeMap.S_TO_MON(seconds)) + ' 月'
        // }
        // console.log(result)
        // return result
        return Math.floor(ms / 1000)
      }
    },

    components: {
      timeQuery
    }
  }
</script>
