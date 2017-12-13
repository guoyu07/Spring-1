<template>
  <div class="time-query">
    <el-popover
      ref="timeQuery"
      placement="bottom"
      width="600"
      trigger="click">
      <el-form label-width="80px" label-position="top">
        <el-form-item label="快速选择">
          <el-radio-group v-model="quickQuery">
            <el-radio-button
              v-for="query in quickQueryOptions"
              :label="query.value"
              >{{query.label}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="指定日期">
          <el-date-picker
            v-model="rangeQuery.s_date"
            type="date"
            placeholder="起始日期"
            ref="startDate"
            size="small"></el-date-picker>
          至
          <el-date-picker
            v-model="rangeQuery.e_date"
            type="date"
            placeholder="终止日期"
            ref="endDate"
            size="small"></el-date-picker>
        </el-form-item>
      </el-form>
    </el-popover>
    <el-button
      v-popover:timeQuery
      icon="fa-clock-o"
      class="margin-bottom">
      {{timeExpression}}
    </el-button>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        timeExpression: '近7天',
        isQuickSearch: true,
        quickQuery: {},
        rangeQuery: {
          type: 'range',
          s_date: '',
          e_date: ''
        },
        quickQueryOptions: [{
          label: '近7天',
          value: {}
        }, {
          label: '过去24h',
          value: {
            type: 'after',
            unit: 'h',
            time: 24
          }
        }, {
          label: '过去48h',
          value: {
            type: 'after',
            unit: 'h',
            time: 48
          }
        }, {
          label: '过去72h',
          value: {
            type: 'after',
            unit: 'h',
            time: 72
          }
        }, {
          label: '今天',
          value: {
            type: 'after',
            unit: 'd',
            time: 1
          }
        }, {
          label: '本周',
          value: {
            type: 'week',
            time: 0
          }
        }, {
          label: '本月',
          value: {
            type: 'month',
            time: 0
          }
        }]
      }
    },

    watch: {
      rangeQuery: {
        deep: true,
        handler (val) {
          if (val.s_date && val.e_date) {
            // this.quickQuery = {}
            this.isQuickSearch = false
            this.makeRequest()
            this.timeExpression = `${new Date(this.rangeQuery.s_date).toLocaleDateString()}—${new Date(this.rangeQuery.e_date).toLocaleDateString()}`
          }
        }
      },

      quickQuery: {
        deep: true,
        handler (val) {
          this.isQuickSearch = true
          this.makeRequest()
          this.timeExpression = this.quickQueryOptions.find(q => q.value === this.quickQuery).label
        }
      }
    },

    methods: {
      makeRequest () {
        let timeQuery = {}
        if (this.isQuickSearch) {
          timeQuery = this.quickQuery
        } else {
          timeQuery = this.rangeQuery
        }
        console.log(timeQuery)
        this.$emit('change-timequery', { timeQuery })
      }
    }
  }
</script>

<style>
  .time-query {
    position: absolute;
    top: 16px;
    right: 20px;
    z-index: 99;
  }
</style>