<template>
  <div>
    <section class="chart">
      <el-row :gutter="10">
        <el-col :span="12">
          <div class="chart-zone">
            <pie
              :id='task_status_user.id'
              :title='task_status_user.title'
              :subtext='task_status_user.subtext'
              :hoverTitle='task_status_user.hover_title'
              :dataList='task_status_user.data_list'>
            </pie>
            <div class="select-zone">
              <el-select size="small" v-model="task_status_user.subtext" placeholder="请选择用户">
                <el-option
                  v-for="item in userList"
                  :key="item.userId"
                  :label="item.nick"
                  :value="item.userId">
                </el-option>
              </el-select>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-zone">
            <pie
              :id='task_status_group.id'
              :title='task_status_group.title'
              :subtext='task_status_group.subtext'
              :hoverTitle='task_status_group.hover_title'
              :dataList='task_status_group.data_list'>
            </pie>
            <div class="select-zone">
              <el-select size="small" v-model="task_status_group.subtext" placeholder="请选择角色">
                <el-option
                  v-for="item in groupList"
                  :key="item.key"
                  :label="item.name"
                  :value="item.key">
                </el-option>
              </el-select>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-zone">
            <div id="chartPie" style="width:100%; height:400px;"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-zone">
            <div id="chartColumn" style="width:100%; height:400px;"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-zone">
            <div id="chartLine" style="width:100%; height:400px;"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-zone">
            <div id="chartBar" style="width:100%; height:400px;"></div>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="chart-zone">
            <div id="categoryBar" style="width:100%; height:400px;"></div>
          </div>
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
  import Pie from './_charts/_pie'

  export default {
    data () {
      return {
        chartColumn: null,
        chartBar: null,
        chartLine: null,
        chartPie: null,
        userList: [],
        groupList: [],
        task_status_user: {
          id: 'task_status_user',
          title: '待处理vs待认领vs已参与',
          subtext: this.$store.state.userinfo.userId,
          hover_title: '工单数',
          data_list: []
        },
        task_status_group: {
          id: 'task_status_group',
          title: '待处理vs待认领vs已参与',
          subtext: this.$store.state.userinfo.groups.length && this.$store.state.userinfo.groups[0].key || '',
          hover_title: '工单数',
          data_list: []
        }
      }
    },
    created () {
      this.getUserList()
      this.getGroupList()
      this.getTaskStatusDataList(this.$store.state.userinfo.userId, undefined, undefined)
      this.getTaskStatusDataList(undefined, this.$store.state.userinfo.groups.length && this.$store.state.userinfo.groups[0].key, undefined)
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
          name: '工单量',
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
      getTaskStatusDataList (userId, groupKey, timeQuery) {
        const postData = {
          action: 'task/status/report',
          method: 'GET',
          data: {
            userId: userId,
            group_key: groupKey,
            time_query: { // 默认过去 7天 到现在
              type: 'after',
              time: 7,
              unit: 'd'
            }
          }
        }
        this.http.post('/report/', this.parseData(postData)).then((res) => {
          // console.log(res.data.data)
          let key = userId ? 'user' : 'group'
          this['task_status_' + key].data_list = []
          for (const id in res.data.data) {
            let name
            switch (id) {
              case 'claim_count':
                name = '待认领'
                break
              case 'handle_count':
                name = '待处理'
                break
              case 'partin_count':
                name = '已参与'
                break
              default:
            }
            this['task_status_' + key].data_list.push({
              value: res.data.data[id],
              name: name
            })
          }
        })
      },
      getUserList () {
        const postData = {
          action: 'users/all',
          method: 'GET'
        }
        this.http.post('/base/', this.parseData(postData)).then((res) => {
          this.userList = res.data.data.list
        })
      },
      getGroupList () {
        const postData = {
          action: 'groups/all/base',
          method: 'GET'
        }
        this.http.post('/base/', this.parseData(postData)).then((res) => {
          this.groupList = res.data.data.list.filter(list => { return typeof list.key === 'number' })
        })
      }
    },
    watch: {
      'task_status_user.subtext' (newVal, oldVal) {
        // console.log(newVal)
        this.getTaskStatusDataList(newVal, undefined, undefined)
      },
      'task_status_group.subtext' (newVal, oldVal) {
        // console.log(newVal)
        this.getTaskStatusDataList(undefined, newVal, undefined)
      }
    },

    components: {
      Pie
    }
  }
</script>

<style lang="less" scoped>
// #content {
//   background-color: #f8f8f8;
// }
.chart {
  .chart-zone {
    min-height: 400px;
    background-color: #f8f8f8;
    border-radius: 5px;
    position: relative;
    margin-bottom: 10px;
    .select-zone {
      position: absolute;
      top: 25px;
      right: 5px;
    }
  }
}

</style>
