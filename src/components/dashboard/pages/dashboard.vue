<template>
  <div>
    <section class="chart">
      <el-row>
        <el-col :span="12">
          <pie :id="'123'" :title="'待处理vs待认领vs已参与'" :subtext="'个人'" :user-id="$store.state.userinfo.userId"></pie>
        </el-col>
        <el-col :span="12">
          <pie :id="'456'" :title="'待处理vs待认领vs已参与'" :subtext="'角色'" :groups="$store.state.userinfo.groups[0]"></pie>
        </el-col>
        <el-col :span="12">
          <div id="chartPie" style="width:100%; height:400px;"></div>
        </el-col>
        <el-col :span="12">
          <div id="chartColumn" style="width:100%; height:400px;"></div>
        </el-col>
        <el-col :span="12">
          <div id="chartLine" style="width:100%; height:400px;"></div>
        </el-col>
        <el-col :span="12">
          <div id="chartBar" style="width:100%; height:400px;"></div>
        </el-col>
        <el-col :span="24">
          <div id="categoryBar" style="width:100%; height:400px;"></div>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script>
  // import echarts from 'echarts'
  // 引入 ECharts 主模块
  const echarts = require('echarts/lib/echarts')
  // 引入柱状图
  require('echarts/lib/chart/bar')
  // 引入折线图
  require('echarts/lib/chart/line')
  // 引入饼图
  require('echarts/lib/chart/pie')
  // K线图
  require('echarts/lib/chart/custom')

  // 引入组件
  require('echarts/lib/component/tooltip') // 提示框
  require('echarts/lib/component/title') // 标题
  require('echarts/lib/component/legendScroll') // 分类
  require('echarts/lib/component/grid') // 绘图区域
  require('echarts/lib/component/dataZoom') // 可拖动数据区域
  // require('echarts/lib/component/toolbox')
  // require('echarts/lib/component/brush')
  import Pie from './_charts/_pie.vue'

  export default {
    data () {
      return {
        chartColumn: null,
        chartBar: null,
        chartLine: null,
        chartPie: null
      }
    },
    created () {
    },
    mounted () {
      // 基于准备好的dom，初始化echarts实例
      this.chartColumn = echarts.init(document.getElementById('chartColumn'))
      this.chartBar = echarts.init(document.getElementById('chartBar'))
      this.chartLine = echarts.init(document.getElementById('chartLine'))
      this.chartPie = echarts.init(document.getElementById('chartPie'))
      this.categoryBar = echarts.init(document.getElementById('categoryBar'))

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

      let categoryData = []
      let errorData = []
      let barData = []
      let dataCount = 100
      for (let i = 0; i < dataCount; i++) {
        let val = Math.random() * 1000
        categoryData.push('category' + i)
        errorData.push([
          i,
          echarts.number.round(Math.max(0, val - Math.random() * 100)),
          echarts.number.round(val + Math.random() * 80)
        ])
        barData.push(echarts.number.round(val, 2))
      }

      const renderItem = (params, api) => {
        let xValue = api.value(0)
        let highPoint = api.coord([xValue, api.value(1)])
        let lowPoint = api.coord([xValue, api.value(2)])
        let halfWidth = api.size([1, 0])[0] * 0.1
        let style = api.style({
          stroke: api.visual('color'),
          fill: null
        })

        return {
          type: 'group',
          children: [{
            type: 'line',
            shape: {
              x1: highPoint[0] - halfWidth,
              y1: highPoint[1],
              x2: highPoint[0] + halfWidth,
              y2: highPoint[1]
            },
            style: style
          }, {
            type: 'line',
            shape: {
              x1: highPoint[0],
              y1: highPoint[1],
              x2: lowPoint[0],
              y2: lowPoint[1]
            },
            style: style
          }, {
            type: 'line',
            shape: {
              x1: lowPoint[0] - halfWidth,
              y1: lowPoint[1],
              x2: lowPoint[0] + halfWidth,
              y2: lowPoint[1]
            },
            style: style
          }]
        }
      }

      this.categoryBar.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        title: {
          text: '可拖动数据'
        },
        legend: {
          data: ['bar', 'error']
        },
        dataZoom: [{
          type: 'slider',
          start: 50,
          end: 70
        }, {
          type: 'inside',
          start: 50,
          end: 70
        }],
        xAxis: {
          data: categoryData
        },
        yAxis: {},
        series: [{
          type: 'bar',
          name: 'bar',
          data: barData,
          itemStyle: {
            normal: {
              color: '#77bef7'
            }
          }
        }, {
          type: 'custom',
          name: 'error',
          itemStyle: {
            normal: {
              borderWidth: 1.5
            }
          },
          renderItem: renderItem,
          encode: {
            x: 0,
            y: [1, 2]
          },
          data: errorData,
          z: 100
        }]
      })
    },
    methods: {
    },

    components: {
      Pie
    }
  }
</script>
