export default {
  data () {
    return {
      newAssignee: '',
      newassignGroup: '',
      isAssignable: false
    }
  },

  methods: {
    onAssign (tid, assignee, assignGroup) {
      console.log(assignee, assignGroup)
      if (assignee && assignGroup) {
        this.$message.info('处理人和处理组只能选其一')
        return false
      } else {
        let postData = {
          action: 'task_assign', // runtime/task/assignee
          method: 'put',
          data: { tid, userId: assignee, group_key: assignGroup }
        }
        this.assignViewLoading = true
        this.http.post('/flow/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            _finish()
          }
        })
      }

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
