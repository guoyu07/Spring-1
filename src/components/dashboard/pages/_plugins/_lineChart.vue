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
  import 'echarts/lib/component/tooltip'

  export default {
    data () {
      return {
        chartData: {
          title: {
            text: '近 7 天处理情况'
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
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: []
        }
      }
    },

    created () {
      this.getChartData()
    },

    methods: {
      getChartData () {
        let postData = {
          action: 'dashboard/recently/report',
          method: 'GET',
          data: {}
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