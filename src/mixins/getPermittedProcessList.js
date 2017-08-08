// 获取权限流程列表
export default {
  data () {
    return {
      permittedProcessList: [],
      permittedProcessListBuffer: '',
      permittedProcessLoading: false
    }
  },

  methods: {
    getPermittedProcessList () {
      this.permittedProcessLoading = true
      let postData = {
        action: 'process/define',
        method: 'GET',
        data: {}
      }
      this.http.post('/activiti/', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          this.permittedProcessList = res.data.data.list
          if (this.permittedProcessList.length) {
            for (let i = 0; i < this.permittedProcessList.length; i++) {
              this.$set(this.permittedProcessList[i], 'editing', false)
            }
          }
          this.permittedProcessListBuffer = JSON.stringify(this.permittedProcessList)
          this.permittedProcessLoading = false
          console.log('mixin working')
        }
      })
    }
  }
}