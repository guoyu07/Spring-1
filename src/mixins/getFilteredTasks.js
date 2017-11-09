const keypath = require('keypather')()

export default {
  data () {
    return {
      loading: false,
      filterData: {},
      filteredTasks: {},
      filteredColumnList: [],
      currentPage: 1,
      currentSize: 10,
      pagesCache: {}
    }
  },

  watch: {
    '$route.params.id' (id) {
      this.getFilterData(id)
      this.currentPage = 1
      this.pagesCache = {}
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

    getFilteredTasks (needCache = true) {
      let { filters, order } = this.filterData
      let postData = {
        action: 'filter/tasks',
        method: 'GET',
        data: {
          filters,
          order,
          page: this.currentPage,
          page_size: this.currentSize,
          ext_query: this.orderQueries
        }
      }
      if (needCache && this.pagesCache[`${this.currentPage}-${this.currentSize}`]) {
        this.filteredTasks = this.pagesCache[`${this.currentPage}-${this.currentSize}`]
        return
      }
      this.loading = true
      this.http.post('/flow/', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          this.filteredTasks = res.data.data
          // this.getColumnList()
          this.loading = false
          this.filteredTasks.list = this.filteredTasks.list.map(task => { return { ...task, ...{ columns: [] } } }) // 给每个任务条目加个 columns 数组成员
          this.filterData.show.forEach((col) => {
            this.filteredTasks.list.forEach((task) => {
              let value
              if (Array.isArray(task[col.key_path.split('.')[0]])) {
                value = task[col.key_path.split('.')[0]].map(item => keypath.get(item, col.key_path.split('.').slice(1)))
              } else {
                value = keypath.get(task, col.key_path)
              }
              task.columns.push(Object.assign({}, col, { value }))// 将 columns 赋值为带值的 col 对象
            })
          })
          this.pagesCache[`${this.currentPage}-${this.currentSize}`] = this.filteredTasks
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
