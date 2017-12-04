// 流程实例过滤器显示字段获取
export default {
  data () {
    return {
      filterShowFields: []
    }
  },

  methods: {
    getFilterShowFields () {
      let postData = {
        action: 'process/filter/show/fields',
        method: 'GET',
        data: {}
      }
      this.http.post('/api/flow/', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          this.filterShowFields = res.data.data.list
          console.log('mixin working')
        }
      })
    }
  }
}
