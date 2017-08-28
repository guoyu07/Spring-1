<template>
  <el-col :span="24">
    <div :id="id" style="width:100%; height:400px;"></div>
  </el-col>
</template>
<script>
// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts')
// 引入饼图
require('echarts/lib/chart/pie')
// 引入组件
require('echarts/lib/component/tooltip') // 提示框
require('echarts/lib/component/title') // 标题
require('echarts/lib/component/legendScroll') // 分类
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    title: [String, Number],
    subtext: [String, Number],
    userId: [String, Number],
    groups: Object
  },

  data () {
    return {
      dataList: [],
      textList: [],
      chartDom: null
    }
  },

  mounted () {
    let role = {}
    if (this.userId) {
      role.userId = this.userId
    } else {
      role.group_key = this.groups.key + ''
    }
    const postData = {
      action: 'task/status/report',
      method: 'GET',
      data: {
        ...role,
        time_query: { // 周
          type: 'week',
          time: 0 // 0本周, 1上周 ...
        }
      }
    }
    this.http.post('/report/', this.parseData(postData)).then((res) => {
      // console.log(res.data.data)
      this.dataList = []
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
        this.textList.push(name)
        this.dataList.push({
          value: res.data.data[id],
          name: name
        })
      }
      this.init()
          .update()
    })
  },

  created () {
  },

  methods: {
    init () {
      // 基于准备好的dom，初始化echarts实例
      if (this.id) {
        this.chartDom = echarts.init(document.getElementById(this.id))
      }
      return this
    },
    update () {
      if (this.chartDom === null) {
        this.init()
      }
      this.chartDom.setOption({
        title: {
          text: this.title,
          subtext: this.subtext,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.textList
        },
        series: [{
          name: this.userId ? this.userId : (this.groups ? this.groups.name : 'groups'),
          type: 'pie',
          radius: '55%',
          // center: ['50%', '60%'],
          data: this.dataList,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      })
    }
  }
}
</script>
<style scoped lang="less">
</style>
