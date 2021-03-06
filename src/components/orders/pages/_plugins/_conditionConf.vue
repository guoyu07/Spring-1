<template>
  <div>
    <el-tabs type="border-card" class="condition-tab" closable @tab-remove="onRemoveFilter" :value="activeTab">
      <el-tab-pane
        v-for="(filter, index) in selectedFilters"
        :label="filter.label"
        :key="filter.label"
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
          <el-select v-model="filter.filter.type" size="small">
            <el-option label="在过去的 ${time} 之内" value="before"></el-option>
            <el-option label="超过 ${time} 之前" value="after"></el-option>
            <el-option label="在 ${start} 和 ${end} 之间" value="range"></el-option>
          </el-select>
          <template v-if="['before', 'after'].includes(filter.filter.type)">
            <span>{{ filter.filter.type === 'before' ? '在过去的' : '超过' }}</span>
            <el-input-number v-model="filter.filter.time" :min="1" size="small"></el-input-number>
            <el-select v-model="filter.filter.unit" size="small">
              <el-option label="分" value="min">分</el-option>
              <el-option label="小时" value="h"></el-option>
              <el-option label="天" value="d"></el-option>
              <el-option label="周" value="w"></el-option>
              <el-option label="月" value="m"></el-option>
            </el-select>
            <span>{{ filter.filter.type === 'before' ? '之内' : '之前' }}</span>
          </template>
          <template v-else="filter.filter.type === 'range'">
            <el-date-picker
              v-model="filter.filter.s_date"
              type="date"
              placeholder="起始日期"
              size="small"></el-date-picker>
            至
            <el-date-picker
              v-model="filter.filter.e_date"
              type="date"
              placeholder="终止日期"
              size="small"></el-date-picker>
          </template>
        </template>

        <template v-if="filter.type === 'pname'">
          <el-select
            v-model="filter.filter"
            multiple
            placeholder="请选择流程"
            value-key="key">
            <el-option
              v-for="process in processDicts"
              :label="process.label"
              :key="process.key"
              :value="process"></el-option>
          </el-select>
        </template>

        <template v-if="filter.type === 'tname'">
          <el-select
            v-model="filter.filter"
            multiple
            placeholder="请选择环节"
            value-key="key">
            <el-option-group
              v-for="process in taskDicts"
              :key="process.key"
              :label="process.label">
              <el-option
                v-for="task in process.list"
                :label="task.label"
                :key="task.key"
                :value="task"></el-option>
            </el-option-group>
          </el-select>
        </template>

        <template v-if="filter.type === 'user'">
          <el-select
            v-model="filter.filter"
            multiple
            placeholder="请选择用户"
            value-key="nick">
            <el-option
              v-for="user in userDicts"
              :label="user.nick"
              :key="user.userId"
              :value="user"></el-option>
          </el-select>
        </template>

        <template v-if="filter.type === 'group'">
          <el-select
            v-model="filter.filter"
            multiple
            placeholder="请选择用户组"
            value-key="name">
            <el-option
              v-for="group in groupDicts"
              :key="group.name"
              :label="group.name"
              :value="group"></el-option>
          </el-select>
        </template>

        <template v-if="filter.type === 'bool'">
          <el-switch
            v-model="filter.filter"
            on-text="是"
            off-text="否"></el-switch>
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
    <el-button v-popover:popover size="small" type="text" icon="fa-caret-down" class="more-conditions">更多</el-button>
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
        activeTab: '',
        userDicts: [],
        groupDicts: [],
        processDicts: [],
        taskDicts: []
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
          if (val.some(_ => _.type === 'user') && !this.userDicts.length) {
            this.getUserDicts()
          }
          if (val.some(_ => _.type === 'group') && !this.groupDicts.length) {
            this.getGroupDicts()
          }
          if (val.some(_ => _.type === 'pname') && !this.processDicts.length) {
            this.getProcessDicts()
          }
          if (val.some(_ => _.type === 'tname') && !this.taskDicts.length) {
            this.getTaskDicts()
          }
          if (val.some(_ => _.type === 'time' && !_.filter.s_date && !_.filter.e_date && !_.filter.time)) {
            return
          }
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
            this.$nextTick(() => {
              this.selectedFilters = this.filters
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
              filterBuffer.push(_)
            }
          })
        }
        // 高能预警
        this.selectedFilters = [
          ...this.selectedFilters.filter(m => filterBuffer.some(n => n.key === m.key)),
          ...filterBuffer.filter(i => !this.selectedFilters.some(j => j.key === i.key))]
      },

      getUserDicts () {
        const userApi = this.filterList.find(_ => _.type === 'user').source
        const url = (userApi.url).replace('/api', '')
        this.http.post(url, userApi.data).then((res) => {
          if (res.status === 200) {
            this.userDicts = res.data.data.list
            // TODO: 优化，是先删了，再放回去
            this.selectedFilters.map(selected => {
              if (selected.type === 'user') {
                this.userDicts.map(dict => {
                  selected.filter.map((user, index) => {
                    if (user.userId === dict.userId) {
                      selected.filter.splice(index, 1)
                      selected.filter.push(dict)
                    }
                  })
                })
              }
            })
          }
        })
      },

      getGroupDicts () {
        const groupApi = this.filterList.find(_ => _.type === 'group').source
        const url = (groupApi.url).replace('/api', '')
        this.http.post(url, groupApi.data).then((res) => {
          if (res.status === 200) {
            this.groupDicts = res.data.data.list
          }
        })
      },

      getProcessDicts () {
        const processApi = this.filterList.find(_ => _.type === 'pname').source
        const url = (processApi.url).replace('/api', '')
        this.http.post(url, processApi.data).then((res) => {
          if (res.status === 200) {
            this.processDicts = res.data.data.list
          }
        })
      },

      getTaskDicts () {
        const taskApi = this.filterList.find(_ => _.type === 'tname').source
        const url = (taskApi.url).replace('/api', '')
        this.http.post(url, taskApi.data).then((res) => {
          if (res.status === 200) {
            this.taskDicts = res.data.data.list
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .condition-tab {
    .el-tabs__header {
      padding-right: 60px;
    }
  }

  .more-conditions {
    position: absolute;
    top: 10px;
    right: 10px;
  }
</style>
