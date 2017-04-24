// 获取待审核列表
// 用于 applylist 页
export default {
  data () {
    return {
      applyList: [],
      currentPage: 1,
      pageSize: 10,
      totalFiltered: 0,
      dialogReject: false,
      form: {}
    }
  },

  methods: {
    renderTaskForm () { // 渲染表单数据
      const renderFromData = {
        action: 'activiti/task/form',
        method: 'GET',
        data: {
          pkey: 'systemOnline',
          tkey: 'start'
        }
      }
      // this.loading = true
      this.http.post('', this.parseData(renderFromData)).then((res) => {
        this.form = res.data.data.form
        this.form.header.map(group => {
          group.value.map(item => {
            this.setDataType(item, this.applyFormHead, this)
          })
        })
        this.form.body.body_list[0].attr_list.map(group => {
          group.value.map(item => {
            this.setDataType(item, this.applyForm.data[0], this)
            // this.$watch('applyForm.data.0', newVal => {
            //   newVal.score = (newVal.cpu * 1 + newVal.storage * 1 + newVal.hardDisk / 20) + ''
            // }, {deep: true})
          })
        })
        // this.loading = false
      })
    },
    getApplyList () {
      let postData = {
        action: 'runtime/tasks/self',
        method: 'GET',
        data: {
          processDefinitionKey: 'systemOnline',
          page: this.currentPage
        }
      }
      this.http.post('', this.parseData(postData)).then((res) => {
        if (res.status === 200) {
          console.log('mixin working')
          this.applyList = []
          res.data.data.data.forEach((list, k) => {
            list.variables.message.map(item => {
              if (item.task_key === 'start') {
                this.applyList[k] = item.form
                this.applyList[k].id = list.id
                this.applyList[k].taskDefinitionKey = list.taskDefinitionKey
                this.applyList[k].pkey = list.pkey
                this.applyList[k].name = list.name
                this.applyList[k].action = list.action
              }
            })
          })
          this.totalFiltered = res.data.data.total
        }
      })
    },

    onPageChange (val) {
      this.currentPage = val
      this.getApplyList()
    },

    showDialogReject (row) {
      this.dialogReject = true
    },

    onReject (task, action) {
      this.$prompt('请输入对「' + task.applicationName + '」的' + action.name + '意见：', '确定' + action.name + '？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        if (!value) {
          this.$message.error('失败：驳回意见不可留空！')
          return
        }
        let postData = {
          action: 'runtime/task/complete',
          method: 'POST',
          data: {
            tid: task.id,
            form: { value },
            pass: action.pass
          }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.$message.success('已' + action.name)
          }
          // this.applyList = [] // 清空表格数据
          this.getApplyList() // 重新请求数据
        })
      })
    },

    onCancel () {
      this.dialogReject = false
    }
  }
}
