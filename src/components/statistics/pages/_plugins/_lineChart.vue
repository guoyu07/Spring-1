<template>
  <chart
    style="width: 100%; height: 300px"
    :options="chartData"
    auto-resize></chart>
</template>

<script>
  import Echarts from 'vue-echarts/components/Echarts.vue'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/component/title'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/component/dataZoom'
  import 'echarts/lib/component/tooltip'

  export default {
    props: {
      timeQuery: Object,
      selectedUser: Object
    },

    data () {
      return {
        chartData: {
          title: {
            text: '佔位'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: []
          },
          grid: {
            left: '8%',
            right: '8%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            splitLine: {
              show: true
            },
            data: []
          },
          yAxis: {
            splitLine: {
              show: true
            },
            type: 'value'
          },
          dataZoom: [{
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            start: 1,
            end: 100
          }],
          series: []
        }
      }
    },

    watch: {
      selectedUser (newVal) {
        this.getChartData()
      },

      timeQuery (newVal) {
        this.getChartData()
      }
    },

    mounted () {
      this.getChartData()
    },

    methods: {
      getChartData () {
        let postData = {
          action: 'dashboard/recently/report',
          method: 'GET',
          data: {
            userId: this.selectedUser && this.selectedUser.userId,
            time_query: this.timeQuery
          }
        }
        this.http.post('/report/', this.parseData(postData)).then((res) => {
          let { time, list } = res.data.data
          this.chartData.xAxis.data = time
          this.chartData.legend.data = list.map(_ => _.name)
          this.chartData.series = list.map(_ => ({
            name: _.name,
            type: 'line',
            data: _.value
          }))
        })
      }
    },

    components: {
      chart: Echarts
    }
  }
</script>