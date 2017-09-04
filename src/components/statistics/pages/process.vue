<template>
  <div class="wrapper">
    <el-row>
      <el-col :md="24" :lg="20">
        <el-card class="box-card" v-loading.body="loading">
          <time-query :time-query="timeQuery" @change-timequery="onTimeQueryChange"></time-query>
          <h3><i class="el-icon-fa-sitemap icon-lg"></i> 流程统计</h3>
          <el-select v-model="selectedProcess" placeholder="请先选择流程…" class="margin-bottom" value-key="pname">
            <el-option
              v-for="process in processList"
              :key="process.name"
              :label="process.pname"
              :value="process">
            </el-option>
          </el-select>
          <small class="process-desc"><i class="el-icon-information"></i> 此处仅为你可管理的流程</small>
          <el-table :data="statistics" :default-expand-all="true">
            <el-table-column type="expand">
              <template scope="props">
                <el-table :data="props.row.task_list" stripe border>
                  <el-table-column
                    label="环节名称"
                    prop="tname"></el-table-column>
                  <el-table-column
                    label="执行次数"
                    prop="num"></el-table-column>
                  <el-table-column
                    label="平均耗时"
                    inline-template
                    :context="_self">
                    <span>{{ _convertTime(row.avg_duration) }}</span>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column
              label="流程分类"
              prop="category"></el-table-column>
            <el-table-column
              label="流程名称"
              prop="pname"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import getProcessList from './../../../mixins/getProcessList'
  import timeQuery from './_plugins/_timeQuery'

  export default {
    mixins: [getProcessList],

    data () {
      return {
        timeQuery: {
          type: 'before',
          time: 1,
          unit: 'h',
          s_date: '',
          e_date: ''
        },
        statistics: []
      }
    },

    watch: {
      selectedProcess () {
        this.getProcessStatistics()
      }
    },

    mounted () {
      this.getProcessList()
    },

    methods: {
      getProcessStatistics () {
        let postData = {
          action: 'process/report',
          method: 'GET',
          data: {
            pkey: this.selectedProcess.pkey,
            time_query: this.timeQuery
          }
        }
        this.http.post('/report/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.statistics = [{ ...res.data.data, ...{ pname: this.selectedProcess.pname, category: this.selectedProcess.category } }]
          }
        })
      },

      onTimeQueryChange (args) {
        this.timeQuery = args.val
        this.getProcessStatistics()
      },

      _convertTime (ms) {
        if (!ms) return
        const ONE_DAY = 24 * 60 * 60 * 1000
        const timeMap = {
          TWO_DAYS: ONE_DAY * 2,  // 48 hours
          FORTNIGHT: ONE_DAY * 14, // 2 weeks
          TWO_MONTHS: ONE_DAY * 60,  // 8 weeks
          S_TO_D (s) {
            return s / 60 / 60
          },
          S_TO_W (s) {
            return this.S_TO_D(s) / 7
          },
          S_TO_M (s) {
            return this.S_TO_D(s) / 30
          }
        }
        const seconds = ms / 1000
        if (seconds < timeMap.TWO_DAYS) {
          return Math.floor(seconds) + ' 秒'
        } else if (seconds < timeMap.FORTNIGHT) {
          return Math.floor(timeMap.S_TO_D(seconds)) + ' 天'
        } else if (seconds < timeMap.TWO_MONTHS) {
          return Math.floor(timeMap.S_TO_W(seconds)) + ' 周'
        } else if (seconds >= timeMap.TWO_MONTHS) {
          return Math.floor(timeMap.S_TO_M(seconds)) + ' 月'
        }
      }
    },

    components: {
      timeQuery
    }
  }
</script>
