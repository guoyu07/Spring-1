// 流程实例过滤器排序字段获取
export default {
  data () {
    return {
      filterOrderFields: []
    }
  },

  methods: {
    getFilterOrderFields () {
      let postData = {
        action: 'process/filter/order/fields',
        method: 'GET',
        data: {}
      }
      this.http.post('/api/flow/', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          this.filterOrderFields = res.data.data.list
          console.log('mixin working')
        }
      })
    }
  }
}
