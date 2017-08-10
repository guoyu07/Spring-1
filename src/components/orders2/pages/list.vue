<template>
  <div>
    <el-card class="box-card">
      <h3><i class="el-icon-fa-sitemap icon-lg"></i> 流程设计</h3>
      <el-button icon="edit" style="margin-bottom: 12px">
        <router-link :to="{ path: `/orders/queues/${orderId}/edit` }">编辑列表</router-link>
      </el-button>
      <el-table
        :data="filteredTasks.list"
        border>
        <!-- <el-table-column
           -->
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        filterData: {},
        filteredTasks: {}
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
