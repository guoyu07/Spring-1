// 获取流程列表
export default {
  data () {
    return {
      processList: [],
      processGroupList: [],
      selectedProcess: null,
      loading: false
    }
  },

  methods: {
    getProcessList () {
      this.loading = true
      const postData = {
        action: 'process/define',
        method: 'GET',
        data: {}
      }
      this.http.post('/activiti/', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          this.processList = res.data.data.list
          this.loading = false
          let categoryList = []
          this.processGroupList = this.processList.reduce((prev, cur, index, arr) => {
            if (categoryList.includes(cur.category)) {
              prev.map(group => {
                if (group.label === cur.category) {
                  group.list.push(cur)
                }
              })
            } else {
              categoryList.push(cur.category)
              prev.push({label: cur.category, list: [cur]})
            }
            return prev
          }, [])
          this.selectedProcess = this.processList[0]
          // this.selectedProcess = 'import_device'
          console.log('mixin working')
        }
      })
    }
  }
}
