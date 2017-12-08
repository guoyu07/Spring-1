<template>
  <div :class="{ 'order-list': true, collapsed: !isExpanded }">
    <el-card class="box-card">
      <time-query :time-query="timeQuery" @change-timequery="onTimeQueryChange"></time-query>
      <h3>
        <i class="el-icon-fa-calendar-o icon-lg"></i> 导出{{topic}}工单
      </h3>
        <a class="el-button fl exceldown" :href="'/api/data?action=export_process_to_excel&&pids='+pids"><i class="el-icon-upload2"></i><span style="font-weight:normal">导出工单</span></a>
      <el-table :data="filterOrderList" border @selection-change='handleSelectionChange'>
        <el-table-column type="selection"></el-table-column>
        <el-table-column v-for="(col, colIndex) in filterShowFields"  :label="col.label"  inline-template>
         <template>
           <span>{{showForm(row, col)}}</span>
         </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import getFilterShowFields from './../../../mixins/getFilterShowFields'
  import timeQuery from './../../_plugins/_timeQuery'
  import timeQueryMixin from './../../../mixins/timeQuery'

  export default {
    mixins: [getFilterShowFields, timeQueryMixin],
    components: { timeQuery },
    props: {
      isExpanded: Boolean
    },
    data () {
      return {
        topic: '',
        timeQuery: {
          type: 'after',
          time: 1,
          unit: 'w',
          s_date: '',
          e_date: ''
        },
        filterOrderList: [],
        chosenList: [],
        category: [],
        pids: []
      }
    },
    watch: {
      '$route.params.pkey' () {
        this.topic = this.category.filter(_ => _.key === this.$route.params.pkey)[0].label
        this.getFilterProcessesList(this.$route.params.pkey)
      }
    },
    created () {
      this.getNavCategory()
    },
    mounted () {
      this.getFilterShowFields()
      this.getFilterProcessesList(this.$route.params.pkey)
    },
    methods: {
      getNavCategory () {
        let postData = {
          action: 'process/names',
          method: 'GET',
          data: {
            group: false
          }
        }
        this.http.post('/api/base/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.category = res.data.data.list
            this.topic = this.category.filter(_ => _.key === this.$route.params.pkey)[0].label
          }
        })
      },
      // 加载列表的数据
      showForm (row, col) {
        let colArr = col.key_path.split('.')
        if (Array.isArray(row[colArr[0]])) {
          let followers = ''
          let nicks = row[colArr[0]].map(_ => _[colArr[1]])
          followers = nicks.join('、')
          return followers
        } else {
          let target = colArr.reduce((a, b) => { return a[b] }, row)
          return target
        }
      },
      // post
      // getFile (response) {
      //   var result = document.createElement('a')
      //   var contentDisposition = response.headers['content-disposition']
      //   var filename = contentDisposition.split('filename=')[1]
      //   filename = filename.replace(/"/g, '')
      //   // let res = new global.Blob([response])
      //   // console.log(res)
      //   // return response.blob()
      //   //   .then(function (data) {
      //     // var dataURL = reader.result
      //   result.href = window.URL.createObjectURL(new global.Blob([response.data], {type: 'application/octet-stream;charset:ISO-8859-1'}))
      //   // result.href = dataURL
      //   result.target = '_self'
      //   result.download = filename
      //   return result
      //     // })
      // },
      // postList () {
      //   let pids = this.chosenList.map(val => val.pid)
      //   let postData = {
      //     action: 'export_process_to_excel',
      //     method: 'get',
      //     data: {
      //       pids: pids
      //     }
      //   }
      //   this.http.post('/api/data/', this.parseData(postData)).then((res) => {
      //     // if (res.status === 200) {
      //     //   let reader = new global.FileReader()
      //     //   reader.readAsBinaryString(new global.Blob([res.data]))
      //     //   reader.onload = () => {
      //     //     var dataURL = reader.result
      //     //     console.log(dataURL)
      //     //     var result = document.createElement('a')
      //     //     result.href = dataURL
      //     //     result.target = '_blank'
      //     //     result.click()
      //     //   }
      //       // console.log(res)
      //     this.getFile(res).click()
      //       // window.open('data:application/vnd.ms-excel;' + res.data)
      //   }
      //   )
      // },
      handleSelectionChange (list) {
        this.chosenList = list
        this.pids = this.chosenList.map(val => val.pid)
      },

      onTimeQueryChange (args) {
        this.timeQuery = args.val
        this.getListByTimeQuery(this.getFilterProcessesList(this.$route.params.pkey))
      },

      // 加载列表
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
              }, {
                label: '任务创建时间',
                type: 'time',
                key: 'ctime',
                filter: this.timeQuery
              }],
            order: '',
            page: 1
          }
        }
        this.http.post('/api/flow/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.filterOrderList = res.data.data.list
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .exceldown {
    color: #fff;
    background-color: #50bfff;
    border-color: #50bfff;
    padding: 7px 9px;
    font-size: 12px;
    border-radius: 4px;
    margin-bottom:12px;
    text-decoration: none;
  }
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
