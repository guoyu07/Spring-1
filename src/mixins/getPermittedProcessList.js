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
            for (var i = 0; i < this.permittedProcessList.length; i++) {
              this.$set(this.permittedProcessList[i], 'editing', false)
              this.$set(this.permittedProcessList[i], 'editingUser', false)
              this.$set(this.permittedProcessList[i], 'editingGroup', false)
              for (let j = 0; j < this.permittedProcessList[i].task_list.length; j++) {
                this.$set(this.permittedProcessList[i].task_list[j], 'editingUser', false)
                this.$set(this.permittedProcessList[i].task_list[j], 'editingGroup', false)
                this.$set(this.permittedProcessList[i].task_list[j], 'editingAssign', false)
                this.$set(this.permittedProcessList[i].task_list[j], 'editingTime', false)
                this.$set(this.permittedProcessList[i].task_list[j], 'hour', 0)
                this.$set(this.permittedProcessList[i].task_list[j], 'minute', 0)
                this.$set(this.permittedProcessList[i].task_list[j], 'second', 0)
              }
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
