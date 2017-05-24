// 获取流程列表
export default {
  data () {
    return {
      processList: [],
      loading: false
    }
  },

  methods: {
    getProcessList () {
      this.loading = true
      const postData = {
        action: 'activiti/process/definition',
        method: 'GET',
        data: {}
      }
      this.http.post('', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          this.processList = res.data.data.list
          this.loading = false
          // this.selectedProcess = this.processList[0].pkey
          // this.selectedProcess = 'import_device'
          console.log('mixin working')
        }
      })
    }
  }
}
