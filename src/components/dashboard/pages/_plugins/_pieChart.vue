<template>
  <!-- <div :id="`chart-${orderType}`" style="width: 100%; height: 400px;"></div> -->
  <chart
    style="width: 100%; height: 360px"
    :options="chartData"
    auto-resize></chart>
</template>

<script>
  // import echarts from 'echarts/lib/echarts'
  // import 'echarts/lib/chart/pie'
  import Echarts from 'vue-echarts/components/Echarts.vue'
  import 'echarts/lib/chart/pie'
  import 'echarts/lib/component/title'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/component/tooltip'

  export default {
    props: {
      orderType: String
    },

    data () {
      return {
        chartData: {
          title: {
            text: '',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: []
          },
          series: [{
            name: `${this.orderType === 'handle' ? '待处理' : '待认领'}工单`,
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '16',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: []
          }]
        }
      }
    },

    mounted () {
      this.getChartData(this.orderType)
        // .then(() => echarts.init(document.getElementById(`chart-${this.orderType}`)))
    },

    methods: {
      getChartData (type) {
        let postData = {
          action: `dashboard/${type}/report`,
          method: 'GET',
          data: {}
        }
        this.http.post('/report/', this.parseData(postData)).then((res) => {
          let result = res.data.data.list
          this.chartData.legend.data = result.map(_ => _.pname)
          this.chartData.series[0].data = result.map(_ => ({ value: _.count, name: _.pname }))
        })
      }
    },

    components: {
      chart: Echarts
    }
  }
</script>