<template>
  <div id="item1-side" class="wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="24">
        <el-card class="box-card">
          <h3 class="form-title"><i class="el-icon-sign-upload"></i> 设备上架</h3>
          <el-form label-position="left" ref="assignForm" :model="assignForm" :inline="true">
            <div v-for="task in taskFormData.header">
              <div v-for="taskform in task.value">
                <header-form
                  v-if="!taskform.value.show.type"
                  :item="assignForm.header"
                  :form-item="taskform">
                </header-form>
                <div v-if="taskform.value.show.type">
                  <search-bar
                    v-if="taskform.value.show.value === deviceType"
                    :hosts="assignForm.header"
                    :attr-list="taskform"
                    :limit="getLimitQuantity(taskform, data)"
                    @on-hosts-change="onHostsChange">
                  </search-bar>
                </div>
              </div>
            </div>
          </el-form>
        </el-card>
        <div class="btn-area">
          <el-button :disabled="hostList.length === 0" type="primary" @click="onSubmit">确认</el-button>
          <el-button :plain="true" type="primary" @click="cancel">取消</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  // import searchFormStructure from '../../_plugins/_searchFormStructure'
  import headerFormStructureDisplay from '../../_plugins/_headerFormStructureDisplay'
  import formStructureDisplay from '../../_plugins/_formStructureDisplay'
  import formStructure from '../../_plugins/_formStructure'
  import headerFormStructure from '../../_plugins/_headerFormStructure'
  import headerForm from '../../_plugins/_headerForm'
  import searchBar from '../../_plugins/_searchBar'

  export default {
    data () {
      return {
        assignForm: {
          header: {},
          body: []
        },
        routerInfo: {},
        deviceType: '',
        hostList: [],
        mainInfo: {},
        taskFormData: {},
        applyData: {
          header: {},
          body: []
        }
      }
    },
    created () {
      this.routerInfo = this.$route.params // 取得本实例的id及当前步骤
      this.renderForm()
      // this.renderTaskForm()
    },
    // watch: {
    //   '$route' (to, from) { // 复用组件时，想对路由参数的变化作出响应的话,你可以简单地 watch（监测变化） $route 对象
    //     this.routerInfo = this.$route.params
    //     this.renderForm()
    //   }
    // },
    methods: {
      onHostsChange (val) {
        // console.log(val)
        this.hostList = []
        // this.assignForm.header[this.deviceType] = val
        this.hostList = val
        // ④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
      },
      renderForm () {
        const renderFromData = {
          action: 'activiti/task/form/group',
          method: 'GET',
          data: {
            pkey: 'equipment_on',
            tkey: 'start'
          }
        }
        this.http.post('', this.parseData(renderFromData)).then((res) => {
          // console.log(res)
          this.taskFormData = res.data.data.form
          this.taskFormData.header.map(group => {
            group.value.map(item => {
              // if (!item.value.show) {
              //   this.setDataType(item, this.assignForm.header, this)
              // }
              this.setDataType(item, this.assignForm.header, this)
              if (item.value.show.type) {
                const key = []
                if (item.value.show.type === 'form_header') {
                  const keyPath = item.value.show.key_path.split('.')
                  if (!key.includes(keyPath[0])) {
                    key.push(keyPath[0])

                    this.$watch('assignForm.header.' + keyPath[0], (newVal, oldVal) => {
                      const _value = newVal && newVal[keyPath[1]] || ''
                      this.deviceType = _value
                      console.log(item)
                      // this.setDataType(item, this.assignForm.header, this)
                      // if (item.value.show.op === 'eq') {
                      //   console.log(_value === item.value.show.value)
                      //   return _value === item.value.show.value
                      // } else {
                      //   return _value !== item.value.show.value
                      // }
                    })
                  }
                }
              }
            })
          })
        })
      },
      onSearchDevices () {
        let searchData = Object.assign(this.searchData, this.filterObj(this.searchKeys))
        console.log(searchData)
        if (this.isEmptyObj(searchData)) {
          this.$message.info('搜索条件不能为空！')
          return false
        }
        // searchData.isapply = 'no' // 未被占用
        let postData = {
          action: this.mainInfo.value.source.data.action,
          method: this.mainInfo.value.source.data.method,
          data: searchData
        }
        this.deviceLoading = false
        this.http.post(this.mainInfo.value.source.url.substring(4), this.parseData(postData)).then((res) => {
          console.log(res)
          if (!res.data.data.total) {
            this.$message.warning('找不到结果！')
          }
          console.log(res)
          this.deviceTotal = res.data.data.total
          this.deviceTable = this.getPathResult(res, this.mainInfo.value.source.res.data_path)
          this.deviceLoading = false
        })
      },
      onAddtoOff () {
        for (const selection of this.selectedDevices) {
          console.log(this.hostList)
          if (!this.hostList.includes(selection)) {
            if (this.selectedDevices.length > this.limit) {
              this.$message.warning(`设备选择最多${this.limit}个！`)
            } else {
              this.hostList = [...this.hostList, selection]
            }
          } else {
            this.$message.warning(`下架列表中已存在${selection.name}`)
          }
        }
      },
      handleSelectionChange (val) {
        this.selectedDevices = val
      },
      onRemove (row) {
        const index = this.hostList.indexOf(row)
        this.hostList.splice(index, 1)
      },
      resetForm (formName) {
        console.log(this.$refs)
        this.$refs[formName].resetFields()
      },
      onSubmit () {
        // console.log(this.deviceType)
        // for (const id in this.assignForm.header) {
        // }
        // this.assignForm.header[this.deviceType] = this.hostList
        this.taskFormData.header.map(header => {
          header.value.map(item => {
            if (item.value.show) {
              // show.type 有四种类型
              if (item.value.show.type === 'form_header') {
                if (this.getPathResult(this.assignForm.header, item.value.show.key_path) === item.value.show.value) {
                  if (item.value.type === 'search_bar') {
                    this.assignForm.header[item.id] = this.hostList
                  }
                }
              }
            }
          })
        })
        // console.log(this.assignForm)
        const postData = {
          action: 'runtime/process/instances',
          method: 'POST',
          data: {
            pkey: 'equipment_on',
            form: {
              'body': [],
              'header': this.assignForm.header
            }
          }
        }
        this.http.post('', this.parseData(postData))
          .then((res) => {
            if (res && res.status === 200) {
              this.$message({
                type: 'success',
                message: '提交成功!'
              })
              this.$router.replace('/orders') // 设备成功上架后跳到工单管理
            }
          })
      },
      onReject (task, action) {
        console.log(task, action.pass)
        this.$prompt('请输入' + action.name + '意见：', '确定' + action.name + '？', {
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
              tid: this.routerInfo.id,
              form: { value },
              pass: action.pass
            }
          }
          this.http.post('', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              this.$message.success('已驳回！')
            }
            this.$router.go(-1) // 跳转历史的上一页
          })
        })
      },
      cancel () {
        this.$router.go(-1) // 跳转历史的上一页
      }
    },
    components: {
      // searchFormStructure,
      headerFormStructureDisplay,
      formStructureDisplay,
      formStructure,
      headerFormStructure,
      headerForm,
      searchBar
    }
  }
</script>
