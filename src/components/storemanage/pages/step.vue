<template>
  <div id="item1-side" class="wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3 class="form-title">{{ routerInfo.name }}</h3>
          <el-form ref="assignForm" :model="assignForm" :inline="true" class="advance-search-form" label-width="90px">
            <!-- <el-form-item label="申请人" v-if="routerInfo.pkey==='export_device' && routerInfo.step==='start'">
              <el-select
                v-model="applyData.application">
                <el-option v-for="option in applicationList"
                  :label="option.name"
                  :value="option.name"></el-option>
              </el-select>
            </el-form-item> -->
            <el-row :gutter="20">
              <!-- <el-col
                v-if="routerInfo.pkey==='export_device' && routerInfo.step==='approve'"
                :span="12">
                <el-table
                  :data="applyData.body"
                  style="width: 100%">
                  <el-table-column
                    prop="name"
                    label="设备名称">
                  </el-table-column>
                  <el-table-column
                    prop="application"
                    label="申请人">
                  </el-table-column>
                  <el-table-column
                    prop="location"
                    label="地点">
                  </el-table-column>
                </el-table>
              </el-col> -->
              <!-- v-else -->
              <el-col :span="24">
                <div v-for="task in form">
                  <div v-for="taskform in task.form.form.body.body_list">
                  <!-- 暂时判断 type 不是 form_header 就是 form_body
                      taskform.show.type === 'form_header' ? applyData.header : applyData.body -->
                    <template v-if="getPathResult(taskform.show.type === 'form_header' ? applyData.header : applyData.body, taskform.show.key_path) === taskform.show.value">
                      <el-tabs type="border-card" @tab-click="handleClick">
                        <el-tab-pane v-for="(item, index) in applyData.body" :key="item.id" :label="taskform.name + (index + 1)">
                          <!-- 信息显示 -->
                          <form-structure-display
                            :item="item"
                            :form-data="taskform.attr_list"
                            :index="index">
                          </form-structure-display>
                          <!-- body表单填写 -->
                          <!-- <form-structure :form-data="taskForm.body && taskForm.body.body_list[0].attr_list" :item="assignForm.data[index]" :index="index"></form-structure> -->
                        </el-tab-pane>
                      </el-tabs>
                    </template>
                  </div>
                  <!-- header 表单填写 -->
                  <div v-if="task.tkey === routerInfo.step">
                    <header-form-structure :form-data="task.form.form.header" :item="assignForm"></header-form-structure>
                  </div>
                </div>
              </el-col>
            </el-row>
            <!-- <el-form-item> -->
              <div class="btn-area">
                <span v-for="action in applyData.action">
                  <el-button v-if="action.type==='submit'" type="primary" @click="onSubmit('assignForm')">{{action.name}}</el-button>
                  <el-button v-else-if="action.type==='back'" :plain="true" type="danger" @click="onReject(applyData, action)" class="fr">{{action.name}}</el-button>
                </span>
                <el-button :plain="true" type="primary" @click="cancel">取消</el-button>
              </div>
            <!-- </el-form-item> -->
            <!-- <el-form-item
              v-if="routerInfo.step==='approve'"
              label=""
              prop="approve"
              style="width:1%;display:none;">
              <el-input
                v-model="assignForm.approve">
              </el-input>
            </el-form-item> -->
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import formStructure from '../../_plugins/_formStructure'
import headerFormStructure from '../../_plugins/_headerFormStructure'
import formStructureDisplay from '../../_plugins/_formStructureDisplay'
export default {
  data () {
    return {
      loading: false,
      routerInfo: {},
      applyData: {},
      assignForm: {
        data: []
      },
      form: {},
      index: 0
    }
  },
  created () {
    this.routerInfo = this.$route.params // 取得本实例的id及当前步骤
    this.renderInstanceDetail() // 通过 id 渲染本实例
    if (this.$route.query.instanceId) {
      this.routerInfo.instanceId = this.$route.query.instanceId
      this.renderInstanceIdDetail() // 通过 instanceid 渲染本实例
    }
    this.renderFormData() // 渲染表单数据
  },
  methods: {
    handleClick (tab, event) {
      this.index = tab.index
      console.log(this.index)
    },
    renderFormData () { // 渲染表单数据
      const renderFromData = {
        action: 'activiti/task/form/group',
        method: 'GET',
        data: {
          pkey: this.routerInfo.pkey
          // tkey: 'start' // start
        }
      }
      this.http.post('', this.parseData(renderFromData)).then((res) => {
        this.form = res.data.data.list
        this.form.forEach((form, k) => {
          // 取当前任务要提交的数据
          if (form.tkey === this.routerInfo.step) {
            let headerData = {} // header 数据处理
            let bodyData = {} // body 数据处理
            // header 数据处理
            form.form.form.header.forEach(header => {
              header.value.map(item => {
                this.setNewDataType(item, headerData)
              })
            })
            for (const id in headerData) {
              this.$set(this.assignForm, id, headerData[id])
            }
            // body 数据处理
            if (form.form.form.body.attr_list) {
              form.form.form.body.attr_list.forEach(group => {
                group.value.map(item => {
                  this.setNewDataType(item, bodyData)
                })
              })
              this.assignForm.data.push(headerData) // body 数据处理
            }
          }
        })
      })
    },
    renderInstanceDetail () {
      let postData = {
        action: 'runtime/task',
        method: 'GET',
        data: {
          taskId: this.routerInfo.id
        }
      }
      this.http.post('', this.parseData(postData)).then((res) => {
        const message = res.data.data.variables.message
        // this.applyData = this.findTaskMsgR(message, ['start']).form
        const taskKeyArr = []
        res.data.data.path_list.forEach(pathlist => {
          pathlist.forEach(path => {
            if (path.tkey !== 'start') {
              taskKeyArr.push(path.tkey)
            }
          })
        })
        this.applyData = this.getTaskInfo(message, taskKeyArr)
        this.applyData.action = res.data.data.action
        this.applyData.body.forEach((item, k) => {
          // if (this.routerInfo.step === 'start') {
          //   this.assignForm.data.push({
          //     ip: item.ip,
          //     location: item.location
          //   })
          // }
        })
      })
    },
    renderInstanceIdDetail () {
      let postData = {
        action: `/object/instance/${this.routerInfo.objectid}/${this.routerInfo.instanceId}`,
        method: 'GET',
        data: {
          // objectId: this.routerInfo.objectid,
          // instanceId: this.routerInfo.instanceId
        }
      }
      this.http.post('easyops/', this.parseData(postData)).then((res) => {
        console.log(res.data.data.data)
        if (this.applyData.body) {
          Object.assign(this.applyData.body[0], res.data.data.data)
        }
      })
    },
    onSubmit (assignForm) {
      console.log(this.assignForm)
      this.$confirm('确定提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$refs[assignForm].validate((valid) => {
          if (valid) {
            if (this.assignForm.data) {
              for (const item of this.assignForm.data) { // 用 for...of 可以轻松退出循环
                if (this.routerInfo.step === 'restart' && item.machines && item.machines.length === 0) {
                  this.$message.warning('未分配完！')
                  return false
                }
              }
            }
            // let assignForm
            // if (this.routerInfo.step === 'start') {
            //   assignForm = this.applyData
            // } else {
            //   assignForm = this.assignForm
            // }
            const postData = {
              action: 'runtime/task/complete',
              method: 'POST',
              data: {
                tid: this.routerInfo.id,
                form: this.assignForm // 通过审批 需要判断一下登录的账号的角色身份
                  // pass: "流程走向控制变量,整型(可选,默认为0)"
              }
            }
            this.http.post('', this.parseData(postData))
              .then((res) => {
                if (res && res.status === 200) {
                  this.$message({
                    type: 'success',
                    message: '提交成功!'
                  })
                  this.$router.replace('/orders') // 分配成功跳转历史的上一页
                }
              })
          } else {
            console.log('error submit!!')
            this.$message.warning('未分配完！')
            return false
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    },
    cancel () {
      this.$router.go(-1) // 跳转历史的上一页
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
    }
  },
  components: {
    formStructure,
    headerFormStructure,
    formStructureDisplay
  }
}
</script>
<style lang="less" scoped>
.btn-area {
  margin: 15px 0;
  .el-button {
    margin-right: 8px;
  }
}
</style>
