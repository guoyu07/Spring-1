export default {
  data () {
    return {
      newAssignee: '',
      newcandidateGroup: [],
      isAssignable: false
    }
  },

  methods: {
    onAssign (tid, assignee, candidateGroup) {
      let postData = {
        action: 'task_assign', // runtime/task/assignee
        method: 'put',
        data: { tid, userId: assignee }
      }
      this.assignViewLoading = true
      this.http.post('/flow/', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          if (candidateGroup.length) {
            let postData = {
              action: 'task/candidate',
              method: 'post',
              data: { tid, group_keys: candidateGroup }
            }
            this.http.post('/flow/', this.parseData(postData)).then((res) => {
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
        this.assignViewLoading = false
        // this.assignViewData.visible = false
        // this.isAssignable = false
        this.$message.success('指派成功！')
        // this.getTaskList()
        this.$router.go(-1) // 返回列表吧
      }
    }
  }
}
