<template>
  <div>
    <el-card class="box-card">
      <h3><i class="el-icon-fa-calendar-o icon-lg"></i> {{filterData.name}}工单</h3>
      <el-button icon="edit" style="margin-bottom: 12px">
        <router-link :to="{ path: `/orders/queues/${orderId}/edit` }">编辑列表</router-link>
      </el-button>
      <el-table
        :data="filteredTasks.list"
        border>
        <el-table-column
          v-for="col in filteredColumnList"
          :prop="col.key_path"
          :label="col.label"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  const keypath = require('keypather')()

  export default {
    data () {
      return {
        filterData: {},
        filteredTasks: {},
        filteredColumnList: []
      }
    },

    computed: {
      orderId () {
        return this.$route.params.id
      }
    },

    watch: {
      '$route.params.id' (id) {
        this.getFilterData(id)
      }
    },

    mounted () {
      this.getFilterData(this.orderId)
    },

    methods: {
      getFilterData (id) {
        let postData = {
          action: 'filter',
          method: 'GET',
          data: { id }
        }
        this.http.post('/flow/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.filterData = res.data.data
            this.getFilteredTasks()
          }
        })
      },

      getFilteredTasks () {
        let { filters, order } = this.filterData
        let postData = {
          action: 'filter/tasks',
          method: 'GET',
          data: {
            filters,
            order
          }
        }
        this.http.post('/flow/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.filteredTasks = res.data.data
            this.getColumnList()
          }
        })
      },

      getColumnList () {
        let postData = {
          action: 'filter/show/fields',
          method: 'GET',
          data: {}
        }
        this.http.post('/flow/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            console.log(res)
            const columnList = res.data.data.list
            this.filteredColumnList = columnList.filter(col => this.filteredTasks.list.some(task => keypath.get(task, col.key_path) !== undefined))
            // columnList.forEach((col) => {
            //   // console.log(this.filteredTasks.list.some(task => _._byString(task, col.key_path)))
            //   this.filteredTasks.list.forEach((task) => {
            //     console.log(keypath.get(task, col.key_path))
            //   })
            // })
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-button a {
    color: inherit;

    &:hover {
      text-decoration: none;
    }
  }
</style>
