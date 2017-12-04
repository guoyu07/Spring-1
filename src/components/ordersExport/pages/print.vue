<template>
  <div :class="{ 'order-list': true, collapsed: !isExpanded }">
    <el-card class="box-card">
      <h3>
        <i class="el-icon-fa-calendar-o icon-lg"></i>导出{{$route.params.pkey}}工单
        <el-button class="fr" type="text" icon="edit" style="margin-bottom: 12px" @click="postList">导出工单
        </el-button>
      </h3>
      <el-table :data="filterOrderList" border @selection-change='handleSelectionChange'>
        <el-table-column type="selection"></el-table-column>
        <el-table-column v-for="(col, colIndex) in filterShowFields" :prop="col.key_path" :label="col.label">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import getFilterShowFields from './../../../mixins/getFilterShowFields'

  export default {
    mixins: [getFilterShowFields],
    props: {
      isExpanded: Boolean
    },
    data () {
      return {
        filterOrderList: [],
        chosenList: []
      }
    },
    watch: {
      '$route.params.pkey' () {
        console.log()
        this.getFilterProcessesList(this.$route.params.pkey)
      }
    },
    mounted () {
      this.getFilterShowFields()
      this.getFilterProcessesList(this.$route.params.pkey)
    },
    methods: {
      getFile (response) {
        var result = document.createElement('a')
        var contentDisposition = response.headers['content-disposition']
        var filename = contentDisposition.split('filename=')[1]
        filename = filename.replace(/"/g, '')

        // let res = new global.Blob([response])
        // console.log(res)
        // return response.blob()
        //   .then(function (data) {
        console.log(typeof response.data)
        result.href = window.URL.createObjectURL(response.data)
        result.target = '_self'
        result.download = filename
        return result
          // })
      },
      postList () {
        let pids = this.chosenList.map(val => val.pid)
        let postData = {
          action: 'export_process_to_excel',
          method: 'post',
          data: {
            pids: pids
          }
        }
        this.http.post('/api/data/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            // let reader = new global.FileReader()
            console.log(res)
            this.getFile(res).click()
            // window.open('data:application/vnd.ms-excel;' + res.data)
          }
        })
      },
      handleSelectionChange (list) {
        this.chosenList = list
      },
      getFilterProcessesList (pkey) {
        let postData = {
          action: 'filter/processes',
          method: 'GET',
          data: {
            filters: [
              {
                label: '流程名称',
                type: 'pname',
                key: 'pd__pkey',
                filter: [{key: pkey}]
              }],
            order: '',
            page: 1
          }
        }
        this.http.post('/api/flow/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.filterOrderList = res.data.data.list
            console.log(res.data.data.list)
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .order-search {
    // display: none;
    margin: 12px 0;

    .el-form-item {
      margin-bottom: 6px;
    }

    .collapsed {
      height: 0;
      overflow: hidden;
    }
  }

  .el-button a {
    color: inherit;

    &:hover {
      text-decoration: none;
    }
  }

  .order-list {
    transition: padding-left .3s ease;

    &.collapsed {
      padding-left: 20px;
    }
  }

  .link-block {
    color: #1d90e6;
    cursor: pointer;
  }
</style>
