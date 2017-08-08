<template>
  <div>
    <el-tabs type="border-card" closable @tab-remove="onRemoveFilter" :value="activeTab">
      <el-tab-pane
        v-for="filter in selectedFilters"
        :label="filter.label"
        :name="filter.label">
        <!-- <el-select v-model="filter.filter" :key="filter.filter."></el-select> -->
      </el-tab-pane>
    </el-tabs>

    <el-popover
      ref="popover"
      placement="bottom"
      width="150"
      trigger="click">
      <el-checkbox-group class="flex-checkboxes" v-model="selectedFilterLabels" @change="onFilterChange">
        <el-checkbox
          :ref="filter.label"
          v-for="filter in filterList"
          :label="filter.label"
          :key="filter.label"></el-checkbox>
      </el-checkbox-group>
    </el-popover>
    <el-button v-popover:popover size="small" type="text" icon="fa-caret-down">更多</el-button>
  </div>
</template>

<script>
  export default {
    props: {
      filters: Array
    },

    data () {
      return {
        filterList: [],
        selectedFilters: [],
        selectedFilterLabels: [],
        activeTab: ''
      }
    },

    watch: {
      selectedFilters: {
        handler (val, oldVal) {
          console.log('emitted!')
          this.$emit('on-filter-change', { filters: val })
        },
        deep: true
      }
    },

    mounted () {
      this.getFilterList()
    },

    methods: {
      getFilterList () {
        let postData = {
          action: 'filter/fields',
          method: 'GET',
          data: {}
        }
        this.http.post('/flow/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.filterList = res.data.data.list
            this.selectedFilters = this.filters
            this.selectedFilterLabels = this.selectedFilters.map(_ => _.label)
            this.activeTab = this.selectedFilters[0].label
          }
        })
      },

      onRemoveFilter (filterName) {
        this.selectedFilters = this.selectedFilters.filter(_ => _.label !== filterName)
        this.selectedFilterLabels = this.selectedFilterLabels.filter(_ => _ !== filterName)
      },

      onFilterChange (list) {
        let filterBuffer = []
        for (let item of list) {
          filterBuffer.push(this.filterList.find(_ => _.label === item))
        }
        this.selectedFilters = filterBuffer
      }
    }
  }
</script>