<template>
  <div>
    <section class="chart">
      <el-row>
        <el-col :span="12">
          <div id="chartColumn" style="width:100%; height:400px;"></div>
        </el-col>
        <el-col :span="12">
          <div id="chartPie" style="width:100%; height:400px;"></div>
        </el-col>
        <el-col :span="12">
          <div id="chartLine" style="width:100%; height:400px;"></div>
        </el-col>
        <el-col :span="12">
          <div id="chartBar" style="width:100%; height:400px;"></div>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script>
  // import echarts from 'echarts'
  // 引入 ECharts 主模块
  var echarts = require('echarts/lib/echarts')
  // 引入柱状图
  require('echarts/lib/chart/bar')
  // 引入折线图
  require('echarts/lib/chart/line')
  // 引入饼图
  require('echarts/lib/chart/pie')

  // 引入提示框和标题组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  require('echarts/lib/component/grid')

  export default {
    data () {
      return {
        chartColumn: null,
        chartBar: null,
        chartLine: null,
        chartPie: null
      }
    },
    mounted () {
      // 基于准备好的dom，初始化echarts实例
      this.chartColumn = echarts.init(document.getElementById('chartColumn'))
      this.chartBar = echarts.init(document.getElementById('chartBar'))
      this.chartLine = echarts.init(document.getElementById('chartLine'))
      this.chartPie = echarts.init(document.getElementById('chartPie'))

      this.chartColumn.setOption({
        title: {
          text: '工单中心统计'
        },
        tooltip: {},
        xAxis: {
          data: ['已处理', '待处理', '待指派', '已完成']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10]
        }]
      })

      this.chartBar.setOption({
        title: {
          text: '每月统计',
          subtext: '纯属虚构'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['2017年6月', '2017年7月']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['已参与', '待处理', '已完成', '指派', '待认领', '总数']
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        series: [{
          name: '2017年6月',
          type: 'bar',
          data: [18203, 23489, 29034, 104970, 131744, 630230]
        }, {
          name: '2017年7月',
          type: 'bar',
          data: [19325, 23438, 31000, 121594, 134141, 681807]
        }]
      })

      this.chartLine.setOption({
        title: {
          text: '每日统计'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['待处理', '已处理', '已完成']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '待处理',
          type: 'line',
          stack: '总量',
          data: [120, 132, 101, 134, 90, 230, 210]
        }, {
          name: '已处理',
          type: 'line',
          stack: '总量',
          data: [220, 182, 191, 234, 290, 330, 310]
        }, {
          name: '已完成',
          type: 'line',
          stack: '总量',
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }]
      })

      this.chartPie.setOption({
        title: {
          text: '饼图统计',
          subtext: '纯属虚构',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['待处理', '已参与', '已完成', '待认领', '指派']
        },
        series: [{
          name: '工单中心',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: [{
            value: 335,
            name: '待处理'
          }, {
            value: 310,
            name: '已参与'
          }, {
            value: 234,
            name: '已完成'
          }, {
            value: 135,
            name: '待认领'
          }, {
            value: 1548,
            name: '指派'
          }],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      })
    },
    methods: {
    }
  }
</script>
