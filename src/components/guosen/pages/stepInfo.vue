<template>
  <div id="item1-side" class="wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="24">
        <el-card class="box-card">
          <h3 class="form-title"><i class="el-icon-fa-server"></i> {{ routerInfo.name ? routerInfo.name : '信息展示' }}</h3>
          <el-form ref="assignForm" :model="assignForm" label-width="100px" class="advance-search-form" :inline="true">
            <!-- 表头信息显示 -->
            <div v-for="taskheader in form">
              <div v-if="taskheader.form.form.header.length >= 1">
                <p class="h5">{{taskheader.tname}}</p>
                <div v-for="taskformheader in taskheader.form.form.header">
                  <!-- {{taskformheader.name}} 这是分组名称 因为现实了步骤任务名称，不在重复显示一个分组名称-->
                  <span v-for="valueheader in taskformheader.value">
                    <span v-if="showFormItem(valueheader, assignForm, applyData, taskheader.tkey, routerInfo.tkey)">
                      <header-form-display
                        :item="applyData.header"
                        :form-item="valueheader">
                      </header-form-display>
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <!-- taskForm.body.body_list.length !== 0 && -->
            <el-tabs class="margin-bottom" type="border-card" @tab-click="handleClick" v-if="applyData.body && applyData.body.length !== 0">
              <el-tab-pane v-for="(data, index) in applyData.body" :label="'body' + (index+1)">
                <!-- body 信息显示 -->
                <div v-for="task in form">
                  <div v-for="taskbody in task.form.form.body.body_list">
                    <div v-if="showBodyList(taskbody, assignForm, applyData, index)">
                      <p class="h5">{{task.tname}}</p>
                      <form-structure-display
                        :item="data"
                        :form-data="taskbody.attr_list"
                        :index="index"
                        :post-form="assignForm"
                        :message-data="applyData"
                        :current-task="routerInfo.tkey"
                        :history-task="task.tkey">
                      </form-structure-display>
                    </div>
                  </div>
                </div>
                <!-- <div class="clear">
                  <el-button v-if="routerInfo.tkey === 'cabinet'" type="primary" icon="search" size="small" @click="getPreview(data.sc_ip_info[0].ipscope.instanceId)" class="margin-bottom">机柜预览图</el-button>
                </div> -->
              </el-tab-pane>
            </el-tabs>
            <!-- 按钮区域 -->
            <!-- <div class="btn-area">
              <span v-for="action in applyData.action">
                <el-button v-if="action.type==='submit'" type="success" @click="onSubmit('assignForm')">{{action.name}}</el-button>
                <el-tooltip v-else-if="action.type==='manual'" :content="action.desc" placement="bottom">
                  <el-button type="primary" @click="onManual(action)">{{action.name}}</el-button>
                </el-tooltip>
                <el-button v-else-if="action.type==='back'" type="danger" @click="onReject(applyData, action)">{{action.name}}</el-button>
              </span>
              <el-button :plain="true" type="primary" @click="cancel">取消</el-button>
            </div> -->
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <!-- 机柜图预览 -->
    <!-- <div v-if="routerInfo.tkey === 'cabinet'" class="cabinet-preview" :class="{'shown': previewShown}">
      <h5 class="cabinet-title">
        <span>机柜预览</span>
      </h5>
      <span class="close-btn" >
        <el-button type="text" size="small" icon="close" @click="closePreview"></el-button>
      </span>
      <div class="paginate-btn clearfix">
        <el-button type="primary" size="mini" icon="arrow-left" :disabled="previewPage === 1" class="fl" @click="prevPreview">上一页</el-button>
        <span class="preview-indicator"><span class="current-page">{{previewPage}}</span>/<span class="total-page">{{pageNum}}</span></span>
        <el-button type="primary" size="mini" :disabled="previewPage === pageNum || pageNum === 0" class="fr" @click="nextPreview">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </div>
      <el-row :gutter="10">
        <el-col :sm="6" v-for="idcrack in idcrackData">
          <table class="el-table__body table-condensed table-cabinet text-navy">
            <caption>{{ idcrack.code }}</caption>
            <tbody>
              <tr v-for="(nindex, n) in idcrack.u_info.jgUHeight">
                <td :class="{ 'occupied': idcrack.isTaked.includes((idcrack.u_info.jgUHeight - n)) }">
                  U{{idcrack.u_info.jgUHeight - n}}
                </td>
              </tr>
            </tbody>
          </table>
        </el-col>
      </el-row>
    </div> -->
  </div>
</template>
<script>
  // import searchFormStructure from '../../_plugins/_searchFormStructure'
  import headerFormStructureDisplay from '../../_plugins/_headerFormStructureDisplay'
  import headerFormDisplay from '../../_plugins/_headerFormDisplay'
  import formStructureDisplay from '../../_plugins/_formStructureDisplay'
  import formStructure from '../../_plugins/_formStructure'
  import headerFormStructure from '../../_plugins/_headerFormStructure'
  import formBody from '../../_plugins/_formBody'
  import searchBar from '../../_plugins/_searchBar'
  import bodyTable from '../../_plugins/_bodyTable'

  export default {
    data () {
      return {
        routerInfo: {},
        applyData: {},
        form: {},
        taskForm: {},
        bodylistIndex: [], // 可删
        showTaskForm: [],
        assignForm: {
          header: {},
          body: []
        },
        index: 0,
        selectedDevices: [],
        searchKeyList: [],
        searchKeys: {},
        searchData: {},
        path_list: [],
        hostList: [],
        previewShown: false,
        idcrackData: [],
        previewPage: 1,
        pageNum: 1,
        idcrackList: [],
        idcrackTaked: []
      }
    },
    created () {
      this.routerInfo = this.$route.params // 取得本实例的id及当前步骤
      this.renderInstanceDetail()
      console.log('onlinestep')
      // this.renderForm()
      // this.renderTaskForm()
    },
    mounted () {
      // 为机柜 U 位默认值而生
      if (this.routerInfo.tkey === 'cabinet') {
        this.http.interceptors.response.use(rs => {
          if (rs.config.data.includes('action=idcrack%2Flist')) {
            this.applyData && this.applyData.body.map((item, k) => {
              if (this.assignForm.body[k] && this.assignForm.body[k].idcrack) {
                const uHeight = this.assignForm.body[k].idcrack.u_info.jgUHeight
                // 整理出一个未被占用的 U位 列表
                let untakedData = []
                for (let i = 1; i <= uHeight; i++) {
                  if (this.assignForm.body[k].idcrack.u_info.assetList.length !== 0) {
                    if (this.assignForm.body[k].idcrack.u_info.assetList.every(list => { return i < list.beginU || i > list.endU })) {
                      untakedData.push(i)
                    }
                  }
                }
                // console.log(untakedData)
                for (let i = 1; i <= uHeight; i++) {
                  if (this.assignForm.body[k].idcrack.u_info.assetList.length === 0) {
                    this.assignForm.body[k].idcracku = i
                  } else {
                    const iend = +this.applyData.header.host_list[k].u_num + i - 1
                    // 判断 i iend(U位末端) 都在未被占用的范围内
                    if (untakedData.includes(i) && untakedData.includes(iend)) {
                      // 判断是否已被当前其他表单占用
                      let formTakedData = [] // 用于判断是否已被当前其他表单占用
                      this.assignForm.body.map((body, bodyk) => {
                        if (body.idcracku && body.idcrack && (body.idcrack.instanceId === this.assignForm.body[k].idcrack.instanceId)) {
                          const eU = body.idcracku + +this.applyData.header.host_list[bodyk].u_num - 1
                          console.log(bodyk, body.idcracku, eU)
                          for (let tU = body.idcracku; tU <= eU; tU++) {
                            if (!formTakedData.includes(tU)) {
                              formTakedData.push(tU)
                            }
                          }
                        } else {
                          formTakedData = []
                        }
                      })
                      // console.log(this.assignForm.body[k].idcrack.code, formTakedData)
                      if (!formTakedData.includes(i)) {
                        // if (!this.assignForm.body[k].idcracku) {
                        this.assignForm.body[k].idcracku = i
                        // }
                        return false
                      }
                    }
                  }
                }
                // console.log(this.assignForm.body[k].idcrack.u_info, this.applyData.header.host_list[k].u_num)
                // let takedData = {}
                // takedData.id = this.assignForm.body[k].idcrack.instanceId
                // takedData.taked = []
                // const uHeight = this.assignForm.body[k].idcrack.u_info.jgUHeight
                // this.assignForm.body[k].idcrack.u_info.assetList.map(item => {
                //   for (let i = 0; i < uHeight; i++) {
                //     if (i >= item.beginU && i <= item.endU) {
                //       takedData.taked.push(i)
                //     }
                //   }
                // })
                // if (this.idcrackTaked.length === 0) {
                //   this.idcrackTaked.push(takedData)
                // } else if (!this.idcrackTaked.some(item => { return takedData.id === item.id })) {
                //   this.idcrackTaked.push(takedData)
                // }
                // console.log(k)
                // for (let i = 0; i < uHeight; i++) {
                //   for (const item of this.idcrackTaked) {
                //     if (item.id === takedData.id) {
                //       let uNum = i + +this.applyData.header.host_list[k].u_num
                //       if (!item.taked.includes(uNum) && !item.taked.includes((i + 1))) {
                //         this.assignForm.body[k].idcracku = i + 1
                //         console.log(i)
                //         // item.taked.push(this.assignForm.body[k].idcrackui+1)
                //         for (let utaked = (i + 1); utaked <= uNum; utaked++) {
                //           item.taked.push(utaked)
                //         }
                //         return false
                //       }
                //     }
                //   }
                // }
              }
            })
          }
          return rs
        }, err => {
          console.log(err.response.data.errorMessage)
        })
      }
    },
    watch: {
      'idcrackData': 'idcrackIsTaked'
    },
    methods: {
      idcrackIsTaked () {
        for (const item of this.idcrackData) {
          item.isTaked = []
          for (const ed of item.u_info.assetList) {
            for (let i = 0; i < item.u_info.jgUHeight; i++) {
              if (i >= ed.beginU && i <= ed.endU) {
                item.isTaked.push(i)
              }
            }
          }
        }
      },
      getPreview (ipscope) {
        const postHeadvData = {
          action: 'idcrack/list',
          method: 'GET',
          data: {
            ipscopeId: ipscope
          }
        }
        this.http.post('', this.parseData(postHeadvData))
        .then((response) => {
          console.log(response)
          this.idcrackList = response.data.data.list
          this.previewShown = !this.previewShown
          this.pageNum = Math.ceil(this.idcrackList.length / 4)
          this.idcrackData = this.idcrackList.slice(0, 4)
        })
        // this.$store.dispatch('idcrack_data', {
        //   idcrackData: this.optionList
        // })
        // this.previewShown = !this.previewShown
        // this.pageNum = Math.ceil(this.$store.state.idcrackData.length / 4)
        // this.idcrackData = this.$store.state.idcrackData.slice(0, 4)
      },
      closePreview () {
        this.previewShown = !this.previewShown
      },
      nextPreview () {
        const page = this.previewPage + 1
        if (this.previewPage !== this.pageNum) {
          this.idcrackData = this.idcrackList.slice((page - 1) * 4, page * 4)
          this.previewPage = page
        }
      },

      prevPreview () {
        const page = this.previewPage > 1 ? this.previewPage - 1 : 1
        if (this.previewPage !== 1) {
          this.idcrackData = this.idcrackList.slice((page - 1) * 4, page * 4)
          this.previewPage = page
        }
      },
      renderInstanceDetail () {
        let postData = {
          action: 'history/process',
          method: 'GET',
          data: {
            pid: this.routerInfo.id
          }
        }
        this.http.post('', this.parseData(postData)).then((res) => {
          console.log(res)
          const message = res.data.data.variables.message
          res.data.data.path_list.map(list => {
            list.map(path => {
              if (!this.path_list.includes(path.tkey)) {
                this.path_list.push(path.tkey)
              }
            })
          })
          const taskKeyArr = this.path_list.filter(item => item !== 'start')
          // console.log(taskKeyArr)
          this.applyData = this.getTaskInfo(message, taskKeyArr)
          // console.log(this.applyData)
          this.applyData.action = res.data.data.action
          this.applyData.version = res.data.data.version
          this.renderForm()
          // this.renderTaskForm()
        })
      },
      renderForm () { // 渲染表单数据
        const renderFromData = {
          action: 'process/form/group',
          method: 'GET',
          data: {
            pkey: this.routerInfo.pkey,
            tkey: this.path_list,
            version: this.applyData.version
          }
        }
        // this.loading = true
        this.http.post('/form/', this.parseData(renderFromData)).then((res) => {
          this.form = res.data.data.list
        })
      },
      handleClick (tab, event) {
        this.index = tab.index
        // console.log(this.index)
      },
      onHostsChange (val, index) {
        // console.log(val, index)
        if (index !== undefined) {
          for (const id in this.assignForm.body[index]) {
            this.assignForm.body[index][id] = val
          }
        } else {
          this.hostList = []
          this.hostList = val
        }
        // ④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中
      },
      onSubmit (assignForm) {
        this.taskForm.header.map(header => {
          header.value.map(item => {
            if (item.show.type) {
              // show.type 有四种类型
              if (item.show.type === 'form_header') {
                if (this.getPathResult(this.assignForm.header, item.show.key_path) === item.show.value) {
                  if (item.value.type === 'search_bar') {
                    this.assignForm.header[item.id] = this.hostList
                  }
                }
              }
            }
          })
        })
        for (const headerid in this.assignForm.header) {
          if (!this.assignForm.header[headerid]) {
            delete this.assignForm.header[headerid] // 删除头部空值
          }
        }
        this.assignForm.body.map(body => {
          for (const headerid in body) {
            if (!body[headerid]) {
              delete body[headerid] // 删除 body 的空值
            }
          }
        })
        console.log(this.assignForm)
        this.$confirm('确定提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          const ref = this.$refs['assignForm'].fields.length !== 0
          console.log(ref)
          if (ref) { // 有表单的情况下，表单的自验证
            this.$refs['assignForm'].validate((valid) => {
              if (valid) {
                // console.log(this.assignForm.body)
                if (this.assignForm.body) {
                  for (const data of this.assignForm.body) { // 用 for...of 可以轻松退出循环
                    for (const item in data) {
                      if (Array.isArray(data[item]) && data[item].length === 0) {
                        this.$message.warning('未完成！')
                        return false
                      }
                    }
                  }
                }
                this.postMethod(this.routerInfo.id, this.assignForm)
                // console.dir(this.assignForm)
              } else {
                console.log('error submit!!')
                this.$message.warning('未完成！')
                return false
              }
            })
          } else { // 无表单时，需要验证有无选设备，因为选设备不在表单验证范围
            this.taskForm.body.body_list.map(bodyList => {
              if (!bodyList.show.type) {
                bodyList.attr_list.map(attrList => {
                  if (attrList.value.some(value => { return value.value.type === 'search_bar' })) {
                    attrList.value.map(value => {
                      if (value.value.type === 'search_bar') {
                        this.assignForm.body.map((postbody, postbodyIndex) => {
                          if (postbody[value.id].length === 0) {
                            this.$message.warning('未分配完！')
                            return false
                          }
                        })
                      }
                    })
                  } else {
                    this.postMethod(this.routerInfo.id, this.assignForm)
                  }
                })
              }
            })
            this.taskForm.header.map(header => {
              if (header.value.some(value => { return value.value.type === 'search_bar' })) {
                header.value.map(value => {
                  if (value.value.type === 'search_bar') {
                    if (this.assignForm.header[value.id].length === 0) {
                      this.$message.warning('未分配完！')
                      return false
                    }
                  }
                })
              } else {
                this.postMethod(this.routerInfo.id, this.assignForm)
              }
            })
            // if (!this.assignForm.body.some(data => {
            //   for (const item in data) {
            //     return Array.isArray(data[item]) && data[item].length === 0
            //   }
            // })) {
            //   this.postMethod(this.routerInfo.id, this.assignForm)
            //   // console.dir(this.assignForm)
            // } else {
            //   this.$message.warning('未分配完！')
            //   return false
            // }
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消审批'
          })
        })
      },
      postMethod (id, data) {
        // if (data.body.length === 0) {
        //   this.applyData.body.forEach(item => {
        //     data.body.push({})
        //   })
        // }
        // console.log(data)
        for (const headerid in data.header) {
          // console.log(headerid, data.header[headerid], !data.header[headerid])
          if (Array.isArray(data.header[headerid]) && data.header[headerid].length === 0) {
            delete data.header[headerid]
          }
          if (!data.header[headerid]) {
            // console.log(headerid)
            delete data.header[headerid] // 删除头部空值
          }
        }
        data.body.map(body => {
          for (const bodyid in body) {
            // console.log(bodyid, data.header[bodyid], !data.header[bodyid])
            if (Array.isArray(body[bodyid]) && body[bodyid].length === 0) {
              delete body[bodyid]
            }
            if (!body[bodyid]) {
              // console.log(bodyid)
              delete body[bodyid] // 删除body空值
            }
          }
        })
        const postData = {
          action: 'task',
          method: 'POST',
          data: {
            tid: id,
            form: data // 通过审批 需要判断一下登录的账号的角色身份
              // pass: "流程走向控制变量,整型(可选,默认为0)"
          }
        }
        this.http.post('/flow/', this.parseData(postData))
          .then((res) => {
            if (res && res.status === 200) {
              this.$message({
                type: 'success',
                message: '成功!'
              })
              if (this.routerInfo.pkey === 'easyops_monitor') {
                this.$router.replace('/alarm') // 告警处理成功后跳转告警事件
              } else {
                this.$router.replace('/orders') // 跳转工单管理
              }
            }
          })
      },
      onManual (action) {
        const ref = this.$refs['assignForm'].fields.length !== 0
        if (ref) { // 有表单的情况下，表单的自验证
          this.$refs['assignForm'].validate((valid) => {
            if (valid) {
              console.log(this.assignForm.body)
              if (this.assignForm.body) {
                for (const data of this.assignForm.body) { // 用 for...of 可以轻松退出循环
                  for (const item in data) {
                    if (Array.isArray(data[item]) && data[item].length === 0) {
                      this.$message.warning('未完成！')
                      return false
                    }
                  }
                }
              }
              this.manualMethod(action)
              // console.dir(this.assignForm)
            } else {
              console.log('error submit!!')
              this.$message.warning('未完成！')
              return false
            }
          })
        } else { // 无表单时，需要验证有无选设备，因为选设备不在表单验证范围
          console.log(this.taskform)
          // if (!this.assignForm.body.some(data => {
          //   for (const item in data) {
          //     return Array.isArray(data[item]) && data[item].length === 0
          //   }
          // })) {
          //   this.manualMethod(action)
          //   // console.dir(this.assignForm)
          // } else {
          //   this.$message.warning('未分配完！')
          //   return false
          // }
        }
      },
      manualMethod (action) {
        const postData = {
          action: 'do/activiti/form/action',
          method: 'POST',
          data: {
            form: this.assignForm,
            tid: this.routerInfo.id,
            action_id: action.id
          }
        }
        this.http.post('', this.parseData(postData))
        .then((res) => {
          if (res && res.status === 200) {
            this.$message({
              type: 'success',
              message: '提交成功!'
            })
            this.$router.replace('/orders') // 分配成功跳转工单管理
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
            action: 'task',
            method: 'POST',
            data: {
              tid: this.routerInfo.id,
              form: { value },
              pass: action.pass
            }
          }
          this.http.post('/flow/', this.parseData(postData)).then((res) => {
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
      headerFormDisplay,
      formStructureDisplay,
      formStructure,
      headerFormStructure,
      formBody,
      searchBar,
      bodyTable
    }
  }
</script>
<style lang="less" scoped>
.el-tag {
  font-size: 14px;
  & +.el-tag {
    margin-left: 10px;
  }
}
.advance-search-form .el-form-item {
  margin-bottom: 18px;
}
.btn-area {
  margin: 15px 0;
  .el-button {
    margin-right: 8px;
  }
}

.margin-bottom {
  margin-bottom: 15px;
}

.form-block {
  h5 {
    margin: 15px 0;
  }
}

.el-select {
  width: 100%;
}

.el-form--inline .el-form-item {
  min-width: 280px;
}

.h5 {
  margin: 10px 0;
  font-size: 12px;
  color: #2ba4ff;
  border-radius: 5px;
  padding: 8px;
}

.el-table {
  table {
    width: 100%;
    th {
      width: 10%;
    }
    td {
      width: 20%;
    }
    th,
    td {
      padding: 5px 10px;
      word-wrap: break-word;
    }
  }
}
.cabinet-preview {
  position: fixed;
  right: 0;
  top: 0;
  height: 99.9vh;
  background: rgba(255, 255, 255, .9);
  padding: 2px 8px;
  z-index: 99999;
  width: 26%;
  transition: all 320ms cubic-bezier(0.175, 0.185, 0.320, 1.255) 0s;
  transform: translateX(100%);
  overflow-y: scroll;
  text-align: center;
}

.cabinet-preview table caption {
  text-align: center;
  padding-top: 4px;
  padding-bottom: 4px;
}

.cabinet-preview.shown {
  transform: translateX(0);
  box-shadow: -6px 0px 12px -6px #777;
}

.cabinet-preview .close-btn {
  position: absolute;
  right: 10px;
  top: 0;
  font-size: 12px;
  color: rgba(0,0,0,.28);
  cursor: pointer;
}

.cabinet-preview .close-btn:hover {
  color: rgba(0,0,0,.56);
}

.cabinet-title {
  margin: 8px 0;
  font-size: 14px;
  color: rgba(0, 0, 0, .42);
  text-align: center;
  overflow: hidden;
  width: 100%;
  position: relative;
  letter-spacing: .42em;
  font-weight: bold;
}

.cabinet-title span {
  padding: 0 16px;
  display: inline-block;
  text-align: center;
  position: relative;
  z-index: 11;
}

.cabinet-preview.shown .table-cabinet {
  opacity: 1;
  transform: translateY(0);
}

.table-cabinet {
  border: 1px solid rgba(82, 100, 115, 0.84);
  border-left-width: 2px;
  border-right-width: 2px;
  opacity: 0;
  transform: translateY(0);
  transition-property: opacity, transform;
  transition-duration: .25s;
  transition-delay: .15s;
  width: 100%;
}

.table-cabinet td {
  border: 1px solid rgba(173, 194, 212, 0.84);
  padding: 0 4px;
  background: rgba(0,0,0,.04);
  font-size: 10px;
}

.table-cabinet td.occupied {
  background-color: #b5bbc8;
  color: #fff;
  text-shadow: 1px 1px 4px rgba(0,0,0,.3);
  font-weight: bold;
  background-image: repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,.3) 4px, rgba(255,255,255,.3) 8px);
  // cursor: not-allowed;
}

.table-cabinet caption {
  font-size: 12px;
  height: 70px;
  overflow: hidden;
}

.preview-container.loading {
  opacity: .5
}

.preview-indicator {
  color: #333;
}

.paginate-btn {
  margin-bottom: 10px;
}

.total-page {
  font-size: 12px;
  color: #616161;
}
</style>
