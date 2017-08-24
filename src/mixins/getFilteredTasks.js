// const keypath = require('keypather')()

export default {
  data () {
    return {
      loading: false,
      columnList: [],
      filterData: {},
      filteredTasks: {},
      filteredColumnList: [],
      currentPage: 1,
      currentSize: 10
    }
  },

  computed: {
    orderId () {
      return this.$route.params.id
    }
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
          order,
          page: this.currentPage,
          page_size: this.currentSize
        }
      }
      this.loading = true
      this.http.post('/flow/', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          this.filteredTasks = res.data.data
          // this.getColumnList()
          this.loading = false
          // this.filteredTasks.list.forEach((task) => {
          //   this.filterData.show.forEach((col) => {
          //     console.log(keypath.get(task, col.key_path))
          //   })
          // })
        }
      })
    },

    onCurrentChange (val) {
      this.currentPage = val
      this.getFilteredTasks()
    },

    onSizeChange (val) {
      this.currentSize = val
      this.onCurrentChange(this.currentPage)
    }

    // getColumnList () {
    //   let postData = {
    //     action: 'filter/show/fields',
    //     method: 'GET',
    //     data: {}
    //   }
    //   this.http.post('/flow/', this.parseData(postData)).then((res) => {
    //     if (res.status === 200) {
    //       this.columnList = res.data.data.list
    //       this.filteredColumnList = this.columnList.filter(col => this.filteredTasks.list.some(task => keypath.get(task, col.key_path) !== undefined))
    //       this.loading = false
    //     }
    //   })
    // }
  }
}
