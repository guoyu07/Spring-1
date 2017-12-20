<template>
  <div class="wrapper">
    <el-row>
      <el-col :md="24" :lg="20">
        <el-card class="box-card" v-loading.body="loading">
          <time-query  @change-timequery="onTimeQueryChange"></time-query>
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
            <el-button icon="fa-upload" type="primary" size="small" @click="exportExcel">导出流程统计</el-button>
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
  import timeQueryMixin from './../../../mixins/timeQuery'
  import fileSaverMixin from './../../../mixins/fileSaver'
  import timeQuery from './../../_plugins/_timeQuery'
  import translateTime from './../../../mixins/translateTime'
  // import _ from './../../../utils/_'

  export default {
    mixins: [timeQueryMixin, translateTime, fileSaverMixin],

    data () {
      return {
        timeQuery: {},
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
      exportExcel () {
        this.downloadTempFile('process/task/report/to/excel', { timeQuery: this.timeQuery })
      },

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

      onTimeQueryChange ({ timeQuery }) {
        this.timeQuery = timeQuery
        this.getListByTimeQuery(this.getProcessStatistics)
      }
    },

    components: {
      timeQuery
    }
  }
</script>
