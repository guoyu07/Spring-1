// 获取权限流程列表
export default {
  data () {
    return {
      permittedProcessList: [],
      permittedProcessLoading: false
    }
  },

  methods: {
    getPermittedProcessList () {
      this.permittedProcessLoading = true
      let postData = {
        action: 'permission/process',
        method: 'GET',
        data: {}
      }
      this.http.post('', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          this.permittedProcessList = res.data.data
          this.permittedProcessLoading = false
          console.log('mixin working')
        }
      })
    }
  }
}
