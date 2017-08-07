export default {
  data () {
    return {
      newAssignee: '',
      newAssigneeGroup: [],
      isAssignable: false
    }
  },

  methods: {
    onAssign (tid, assignee, assigneeGroup) {
      let postData = {
        action: 'task_assign', // runtime/task/assignee
        method: 'POST',
        data: { tid, assignee }
      }
      this.assignViewData.loading = true
      this.http.post('/flow/', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          if (assigneeGroup.length) {
            let postData = {
              action: 'runtime/task/assignee/group',
              method: 'POST',
              data: { tid, groupId: assigneeGroup }
            }
            this.http.post('', this.parseData(postData)).then((res) => {
              if (res.status === 200) {
                _finish()
              }
            })
          } else {
            _finish()
          }
        }
      })

      const _finish = () => {
        this.assignViewData.loading = false
        this.assignViewData.visible = false
        this.isAssignable = false
        this.$message.success('指派成功！')
        // this.getTaskList()
        this.$router.go(0) // 刷新页面
      }
    }
  }
}
