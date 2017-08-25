<template>
  <div>
    <el-row>
      <el-col :md="24" :lg="20">
        <el-card class="box-card" v-loading.body="loading">
          <time-query :time-query="timeQuery" @change-timequery="onTimeQueryChange"></time-query>
          <h3><i class="el-icon-fa-pie-chart icon-lg"></i> 流程统计</h3>
          <el-select v-model="selectedProcess" placeholder="请先选择流程…" class="margin-bottom" value-key="pname">
            <el-option
              v-for="process in processList"
              :key="process.name"
              :label="process.pname"
              :value="process">
            </el-option>
          </el-select>
          <small class="process-desc"><i class="el-icon-information"></i> 此处仅为你可管理的流程</small>
          <el-table :data="statistics">
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
                    prop="avg_duration"></el-table-column>
                  <!-- <el-table-column
                    label="标准工时"></el-table-column> -->
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
          unit: 'min',
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
      }
    },

    components: {
      timeQuery
    }
  }
</script>