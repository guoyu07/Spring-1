<template>
  <div>
    <el-tabs type="border-card" closable @tab-remove="onRemoveFilter" :value="activeTab">
      <el-tab-pane
        v-for="(filter, index) in selectedFilters"
        :label="filter.label"
        :name="filter.label">
        <template v-if="filter.type === 'str'">
          <el-select
            v-model="filter.filter"
            multiple
            allow-create
            filterable
            :placeholder="`输入创建 ${filter.label}`"></el-select>
        </template>
        <template v-if="filter.type === 'time'">
          <el-select v-model="filter.filter.type">
            <el-option label="在过去的 ${time} 之内" value="before"></el-option>
            <el-option label="超过 ${time} 之前" value="after"></el-option>
            <el-option label="在 ${start} 和 ${end} 之间" value="range"></el-option>
          </el-select>
          <template v-if="['before', 'after'].includes(filter.filter.type)">
            <span>{{ filter.filter.type === 'before' ? '在过去的' : '超过' }}</span>
            <el-input-number v-model="filter.filter.time" :min="1"></el-input-number>
            <el-select v-model="filter.filter.unit">
              <el-option value="min">分</el-option>
              <el-option value="h">小时</el-option>
              <el-option value="d">天</el-option>
              <el-option value="w">周</el-option>
            </el-select>
            <span>{{ filter.filter.type === 'before' ? '之内' : '之前' }}</span>
          </template>
          <template v-else="filter.filter.type === 'range'">
            <el-date-picker
              v-model="filter.filter.s_date"
              type="date"
              placeholder="起始日期"></el-date-picker>
            至
            <el-date-picker
              v-model="filter.filter.e_date"
              type="date"
              placeholder="终止日期"></el-date-picker>
          </template>
        </template>
      </el-tab-pane>
    </el-tabs>

    <el-popover
      ref="popover"
      placement="bottom"
      width="150"
      trigger="click">
      <el-checkbox-group class="flex-checkboxes" v-model="selectedFilterLabels" @change="onFilterChange">
        <el-input
          placeholder="搜索"
          icon="search"
          size="small"
          v-model="searchLabel"></el-input>
        <el-checkbox
          v-for="filter in filteredList"
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
        searchLabel: '',
        activeTab: ''
      }
    },

    computed: {
      filteredList () {
        // this.filterList.forEach((_) => {
        //   console.log(_.label.indexOf(this.searchLabel))
        // })
        // if (!this.searchLabel.trim()) return
        return this.filterList.filter(_ => _.label.indexOf(this.searchLabel.trim()) >= 0)
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

    created () {
      this.$nextTick(() => {
        this.getFilterList()
      })
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
            this.$nextTick(() => {
              this.selectedFilterLabels = this.selectedFilters.map(_ => _.label)
              this.activeTab = this.selectedFilters[0].label
            })
          }
        })
      },

      onRemoveFilter (filterName) {
        this.selectedFilters = this.selectedFilters.filter(_ => _.label !== filterName)
        this.selectedFilterLabels = this.selectedFilterLabels.filter(_ => _ !== filterName)
      },

      onFilterChange (list) {
        let filterBuffer = []
        // console.log(this.filterList)
        for (let item of list) {
          this.filteredList.forEach((_) => {
            if (_.label === item) {
              console.log(_)
              filterBuffer.push(_)
            }
          })
        }
        console.log(filterBuffer)
        this.selectedFilters = [
          ...this.selectedFilters.filter(m => filterBuffer.some(n => n.key === m.key)),
          ...filterBuffer.filter(i => !this.selectedFilters.some(j => j.key === i.key))]
      }
    }
  }
</script>