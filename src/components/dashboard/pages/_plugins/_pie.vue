<template>
  <el-col :span="24">
    <div :id="id" style="width:100%; height:400px;"></div>
  </el-col>
</template>
<script>
// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts')
// // 引入饼图
// require('echarts/lib/chart/pie')
// // 引入组件
// require('echarts/lib/component/tooltip') // 提示框
// require('echarts/lib/component/title') // 标题
// require('echarts/lib/component/legendScroll') // 分类
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    title: [String, Number],
    subtext: [String, Number],
    hoverTitle: [String, Number],
    dataList: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      chartDom: null,
      data: {
        id: this.id,
        title: this.title,
        subtext: this.subtext,
        hover_title: this.hoverTitle,
        data_list: this.dataList,
        text_list: []
      }
    }
  },

  created () {
  },

  methods: {
    init () {
      // 基于准备好的dom，初始化echarts实例
      if (this.id) {
        this.chartDom = echarts.init(document.getElementById(this.data.id))
      }
      return this
    },
    update () {
      if (this.chartDom === null) {
        this.init()
      }
      this.chartDom.setOption({
        title: {
          text: this.data.title,
          subtext: this.data.subtext,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        // color: ['red', 'green', 'blueviolet'], // 设置饼图颜色
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.data.text_list
        },
        series: [{
          name: this.data.hover_title,
          type: 'pie',
          selectedMode: 'multiple',
          radius: '55%',
          // center: ['50%', '60%'],
          data: this.data.data_list,
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
    updateTextList () {
      var data = this.data.data_list
      this.data.text_list = []
      for (var i = 0; i < data.length; i++) {
        this.data.text_list.push(data[i].name)
      }
      return this
    }
  },
  mounted () {
    this.updateTextList()
        .init()
        .update()
  },
  watch: {
    dataList (v) {
      this.data.data_list = v
      this.updateTextList().update()
    },
    title (v) {
      this.data.title = v
      this.update()
    },
    subtext (v) {
      this.data.subtext = v
      this.update()
    },
    hoverTitle (v) {
      this.data.hover_title = v
      this.update()
    }
  }
}
</script>
<style scoped lang="less">
</style>
