<template>
  <div class="wrapper">
    <el-row :gutter="12">
      <el-col :md="16">
        <el-row :gutter="12">
          <el-col :span="12">
            <el-card></el-card>
          </el-col>
          <el-col :span="12">
            <el-card></el-card>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="24">
            <el-card></el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :md="8">
        <el-row :gutter="12">
          <el-col :span="24">
            <el-card>
              <TableList :table="tableLists['待处理']"></TableList>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="24">
            <el-card>
              <TableList :table="tableLists['待认领']"></TableList>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import TableList from './_plugins/_tableList'

  export default {
    data () {
      return {
        tableLists: {
          '待处理': {
            filterData: {
              filters: 'filter_type_handle',
              order: '-assign_time',
              page: 1,
              page_size: 10
            },
            list: [],
            loading: false
          },
          '待认领': {
            filterData: {
              filters: 'filter_type_claim',
              order: '-mtime',
              page: 1,
              page_size: 10
            },
            list: [],
            loading: false
          }
        }
      }
    },

    created () {
      this.getTableList('待处理').then(() => this.getTableList('待认领'))
    },

    methods: {
      async getTableList (listName) {
        this.tableLists[listName].loading = true
        let postData = {
          action: 'filter/tasks',
          method: 'GET',
          data: this.tableLists[listName].filterData
        }
        this.http.post('/flow/', this.parseData(postData)).then(async (res) => {
          if (res.status === 200) {
            await Object.assign(this.tableLists[listName], { list: res.data.data.list, loading: false })
          }
        })
      }
    },

    components: {
      TableList
    }
  }
</script>

<style lang="less" scoped>
  .el-card {
    margin-bottom: 12px;
  }
</style>