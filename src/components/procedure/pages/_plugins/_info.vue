<template>
  <div class="wrapper" ref="wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <div class="flex-box">
            <div>
            <h3 class="form-title"><i class="el-icon-fa-server"></i> {{allData.pnum}}-{{ routerInfo.name ? routerInfo.name : '信息展示' }}</h3>
            <div v-for="(cur, index) in allData.current_tasks" v-if="allData.current_tasks">
              <small  v-if="cur.assign || cur.assign_group" style="margin-left:20px;color:#ccc" >{{cur.tname}}-{{cur.assign ? '当前处理人：' : '当前处理组：'}}{{cur.assign ? cur.assign.nick : cur.assign_group.name}}</small>
              <small v-else-if="!query" style="margin-left:20px;color:#ccc">{{cur.tname}}-当前处理：无</small>
            </div>
            </div>
            <div>
             <!--  <i class="el-icon-fa-server color-primary"></i> {{taskData.pinstance && taskData.pinstance.pnum}}-{{ taskData.pinstance && taskData.pinstance.pd.pname }}-{{ taskData.ptask && taskData.ptask.tname }} -->
            <el-button type="info" :plain="true" icon="fa-history" class="fr"  @click="onViewTask(allData)">工作流</el-button>
            <el-button class="not-print fr" type="info" :plain="true" icon="fa-print" @click="createPdf">打印</el-button>
            <a  class="el-button  fr el-button--info is-plain excelDown" :href="'/api/data?action=export_process_to_excel&&pids='+routerInfo.pid"><i class="el-icon-fa-file-excel-o"></i><span style="font-weight:normal">下载excel表格</span></a>
            <el-button v-if="taskData.can_claim && $route.query.filter === '待认领'" type="info" @click="onClaim">认领</el-button>
            </div>
          </div>
          <div style="border:1px solid #ccc;margin-bottom:15px" v-if="taskData.can_manage && $route.query.filter === '指派'"></div>
            <el-form v-if="taskData.can_manage && $route.query.filter === '指派'" :inline="true" style="display:flex;justify-content:flex-end;margin-bottom:-5px">
              <el-form-item label="处理人" :inline="true">
                <el-select
                  v-model="newAssignee"
                  filterable
                  clearable
                  :filter-method="filterUsers"
                  placeholder="请选择处理人">
                  <el-option
                    v-for="user in filteredUserList"
                    :key="user.userId"
                    :label="user.nick"
                    :value="user.userId">
                    <p>
                      <span>{{ user.nick }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ user.userId }}</span>
                    </p>
                    <p style="color: #8492a6; font-size: 13px">{{ user.email }}</p>
                 </el-option>
                </el-select>
                <div class="assign-btn">
                  <el-button size="small" @click="assignToMe" type="text">分配给我</el-button>
                </div>
              </el-form-item>
              <el-form-item label="处理组">
                <el-select v-model="newassignGroup" filterable clearable placeholder="请选择处理组">
                  <el-option
                    v-for="role in permittedRoleList"
                    :key="role.key"
                    :label="role.name"
                    :value="role.key">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-button :loading="assignViewLoading" type="info" @click="onAssign($route.query.tid, newAssignee, newassignGroup)" style="height:36px">指派</el-button>
            </el-form>
              <el-steps
              finish-status="finish"
              style="margin: 16px 0 12px"
              :active="finishTaskindex">
              <el-step
                v-for="(task, key) in allData.task_list"
                :title="task.tname"></el-step>
            </el-steps>
          <el-form ref="assignForm" :model="assignForm" label-width="100px" class="advance-search-form" :inline="true">
            <!-- 表头信息显示 只要出现了 body 这些信息放body里 -->
            <div class="history-block" v-if="!isEmptyObj(applyData.header) && applyData.body && !applyData.body.length">
              <div v-for="taskheader in form">
                <div v-if="taskheader.form.form.header.length >= 1">
                  <p class="h5">{{taskheader.tname}}</p>
                  <div v-for="taskformheader in taskheader.form.form.header">
                    <span v-for="valueheader in taskformheader.value">
                      <span v-if="showFormItem(valueheader, assignForm, applyData, taskheader.tkey, false)">
                        <header-form-display
                          :item="applyData.header"
                          :index="-1"
                          :form-item="valueheader">
                        </header-form-display>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <template v-if="bodyStyle === '1'">
              <el-tabs class="margin-bottom" type="border-card" @tab-click="handleClick" v-if="applyData.body && applyData.body.length">
                <el-tab-pane v-for="(data, index) in applyData.body" :key="index" :label="bodyLableName[index]">
                  <!-- body 信息显示 -->
                  <div class="history-block">
                    <div v-for="task in form">
                      <div v-if="task.form.form.body.body_list.length">
                        <div v-for="taskbody in task.form.form.body.body_list">
                          <div v-if="showBodyList(taskbody, assignForm, applyData, index, true, false)">
                            <p v-if="task.form.form.header.length || taskbody.attr_list.length" class="h5">{{task.tname}}</p>
                            <!-- header 信息显示 -->
                            <div v-if="task.form.form.header.length >= 1">
                              <div v-for="taskformheader in task.form.form.header">
                                <span v-for="valueheader in taskformheader.value">
                                  <span v-if="showFormItem(valueheader, assignForm, applyData, true, false)">
                                    <header-form-display
                                      :index="index"
                                      :item="applyData.header"
                                      :form-item="valueheader">
                                    </header-form-display>
                                  </span>
                                </span>
                              </div>
                            </div>
                            <form-structure-display
                              :item="data"
                              :form-data="taskbody.attr_list"
                              :index="index"
                              :post-form="assignForm"
                              :message-data="applyData"
                              :current-task="'false'"
                              :history-task="task.tkey">
                            </form-structure-display>
                          </div>
                          <div v-else>
                            <!-- header 信息显示 -->
                            <div v-if="task.form.form.header.length >= 1">
                              <p class="h5">{{task.tname}}</p>
                              <div v-for="taskformheader in task.form.form.header">
                                <span v-for="valueheader in taskformheader.value">
                                  <span v-if="showFormItem(valueheader, assignForm, applyData, true, false)">
                                    <header-form-display
                                      :index="index"
                                      :item="applyData.header"
                                      :form-item="valueheader">
                                    </header-form-display>
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else>
                        <!-- header 信息显示 -->
                        <div v-if="task.form.form.header.length >= 1">
                          <p class="h5">{{task.tname}}</p>
                          <div v-for="taskformheader in task.form.form.header">
                            <span v-for="valueheader in taskformheader.value">
                              <span v-if="showFormItem(valueheader, assignForm, applyData, true, false)">
                                <header-form-display
                                  :index="index"
                                  :item="applyData.header"
                                  :form-item="valueheader">
                                </header-form-display>
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- body 表单填写 -->
                  <div v-if="taskForm.body && taskForm.body.body_list.length !== 0">
                    <div v-for="taskFormData in taskForm.body.body_list">
                        <div v-if="showBodyList(taskFormData, assignForm, applyData, index)">
                          <div class="form-block" v-for="formBlock in taskFormData.attr_list">
                            <h5 v-if="formBlock.name">{{formBlock.name}}</h5>
                            <span v-for="formItem in formBlock.value">
                              <!-- {{isEdting}} -->
                              <form-body
                                v-if="showFormItem(formItem, assignForm, applyData, true, true, index)"
                                :item="assignForm.body[index]"
                                :form-item="formItem"
                                :whole="assignForm"
                                :index="index"
                                :isEditing="isEditing"
                                :message="applyData"
                                keep-alive>
                              </form-body>
                              <search-bar
                                v-if="showFormItem(formItem, assignForm, applyData, true, true, index) && formItem.value.type==='search_bar'"
                                :index="index"
                                :post-form="assignForm"
                                :hosts="assignForm.body[index]"
                                :attr-list="formItem"
                                :limit="getLimitQuantity(formItem, assignForm, applyData, index)"
                                @on-hosts-change="onHostsChange">
                              </search-bar>
                              <body-table
                                v-if="showFormItem(formItem, assignForm, applyData, true, true, index) && formItem.value.type==='table'"
                                :form-data="formItem"
                                :item="assignForm.body[index]"
                                :post-form="assignForm"
                                :message-data="applyData"
                                :index="index"
                                :bodyTable="true">
                              </body-table>
                            </span>
                          </div>
                        </div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </template>
            <template v-if="bodyStyle === '2'">
              <div v-if="applyData.body && applyData.body.length">
                <el-tabs :id="'anchor-'+index" class="margin-bottom" type="border-card" @tab-click="handleClick" v-for="(data, index) in applyData.body" :key="index">
                  <el-tab-pane :label="bodyLableName[index]">
                    <!-- body 信息显示 -->
                    <div class="history-block">
                      <div v-for="task in form">
                        <div v-if="task.form.form.body.body_list.length">
                          <div v-for="taskbody in task.form.form.body.body_list">
                            <div v-if="showBodyList(taskbody, assignForm, applyData, index, true, false)">
                              <p class="h5">{{task.tname}}</p>
                              <!-- header 信息显示 -->
                              <div v-if="task.form.form.header.length >= 1">
                                <div v-for="taskformheader in task.form.form.header">
                                  <span v-for="valueheader in taskformheader.value">
                                    <span v-if="showFormItem(valueheader, assignForm, applyData, true, false)">
                                      <header-form-display
                                        :index="index"
                                        :item="applyData.header"
                                        :form-item="valueheader">
                                      </header-form-display>
                                    </span>
                                  </span>
                                </div>
                              </div>
                              <form-structure-display
                                :item="data"
                                :form-data="taskbody.attr_list"
                                :index="index"
                                :post-form="assignForm"
                                :message-data="applyData"
                                :current-task="'false'"
                                :history-task="task.tkey">
                              </form-structure-display>
                            </div>
                          </div>
                        </div>
                        <div v-else>
                          <!-- header 信息显示 -->
                          <p class="h5">{{task.tname}}</p>
                          <div v-if="task.form.form.header.length >= 1">
                            <div v-for="taskformheader in task.form.form.header">
                              <span v-for="valueheader in taskformheader.value">
                                <span v-if="showFormItem(valueheader, assignForm, applyData, true, false)">
                                  <header-form-display
                                    :index="index"
                                    :item="applyData.header"
                                    :form-item="valueheader">
                                  </header-form-display>
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
              <div class="anchorNav">
                <a href="javascript:void(0)" v-for="(data, index) in applyData.body" :key="index" @click="goAnchor('#anchor-'+index)"> {{ index + 1 }} </a>
              </div>
            </template>
            <!-- <router-link :to="toJumper(jumper)"> -->
            <el-button v-if="allData.isend" v-for="(jumper, index) in allData.jumpers" :key="index" type="primary" @click="toJumper(jumper)">{{jumper.name}}</el-button>
            <!-- </router-link> -->
          </el-form>
        </el-card>
      </el-col>
    </el-row>
     <process-dialog v-if="taskViewData.visible" :task-view-data="taskViewData"></process-dialog>
  </div>
</template>
<script>
  // import searchFormStructure from '../../_plugins/_searchFormStructure'
  import processDialog from './_processDialog'
  import headerFormDisplay from '../../../_plugins/_headerFormDisplay'
  import formStructureDisplay from '../../../_plugins/_formStructureDisplay'
  import getPermittedUserList from './../../../../mixins/getPermittedUserList'
  import getPermittedRoleList from './../../../../mixins/getPermittedRoleList'
  import onAssign from './../../../../mixins/onAssign'
  import progressWrap from '../../../_plugins/_progress'

  export default {
    mixins: [getPermittedUserList, getPermittedRoleList, onAssign],
    props: {
      params: { type: Object }, // 必传参数 :pid 及 :name
      query: { type: Object } // 非必穿参数 :tid (用于指派或者认领任务)
    },
    data () {
      return {
        taskViewData: {
          visible: false,
          order: {}
        },
        routerInfo: {},
        applyData: {},
        form: {},
        taskForm: {},
        showTaskForm: [],
        assignForm: {
          header: {},
          body: []
        },
        index: 0,
        path_list: [],
        hostList: [],
        bodyStyle: '',
        bodyLableName: [],
        allData: {},
        taskData: {},
        newAssignee: '',
        newassignGroup: '',
        assignViewLoading: false,
        filteredUserList: []
      }
    },
    created () {
      this.routerInfo = this.params // 取得本实例的id及当前步骤
      this.renderInstanceDetail()
      if (this.query.tid) {
        let postData = {
          action: 'task/action/dict',
          method: 'get',
          data: { tid: this.query.tid }
        }
        this.http.post('/flow/', this.parseData(postData)).then((res) => {
          if (res.status === 200) {
            this.taskData = res.data.data
            this.newassignGroup = ''
            // this.taskData.candidate_groups.map(group => {
            //   this.newassignGroup.push(group.key)
            // })
            if (this.taskData.can_manage) {
              this.getPermittedUserList()
              this.getPermittedRoleList()
              this.newAssignee = this.taskData.assign && this.taskData.assign.userId || this.$store.state.userinfo.userId
              // this.newAssignee = this.taskData.assign && this.taskData.assign.userId || ''
              this.newassignGroup = this.taskData.assign_group && this.taskData.assign_group.key || ''
            }
          }
        })
      }
    },
    watch: {
      'form': {
        handler: 'renderBodyLabel',
        deep: true
      },
      'allData': {
        handler: 'curTask',
        deep: true
      }
    },
    methods: {
      curTask () {
        if (this.allData.current_tasks.length) {
          for (let i = 0; i < this.allData.task_list.length; i++) {
            console.log(this.allData.task_list[i].tkey.includes(this.allData.current_tasks[0].tkey))
            if (this.allData.task_list[i].tkey.includes(this.allData.current_tasks[0].tkey)) {
              this.finishTaskindex = i
              return i
            }
          }
        }
      },
      createPdf () {
        let newWindow = window.open('_blank')  // 打开新窗口
        newWindow.document.write(this.$refs.wrapper.innerHTML) // 向文档写入HTML表达式或者JavaScript代码
        newWindow.document.head.innerHTML = window.document.head.innerHTML // 向文档写入头部信息
        newWindow.document.close() // 关闭document的输出流, 显示选定的数据
        setTimeout(() => {
          newWindow.print()  // 打印当前窗口
        }, 100)
        return true
      },
      renderBodyLabel (val) {
        console.log(val[val.length - 1].form.form)
        this.bodyLabel(val[val.length - 1].form.form, this.assignForm, this.applyData, this.bodyLableName)
      },

      // custom filter method for 处理人
      filterUsers (query) {
        console.log(query)
        this.filteredUserList = this.permittedUserList.filter(user =>
          (user.nick + user.userId).indexOf(query) > -1)
      },

      toJumper (jumper) {
        let path = ''
        let query = {}
        if (jumper.value.type === 'start_process') {
          path = `/procedure/start/${jumper.value.pkey}/${jumper.value.pname}`
        } else if (jumper.value.type === 'static') {
          path = jumper.value.url
          // window.location.href = 'http://www.Baidu.com'
          // window.open()
        }
        jumper.params.map(param => {
          if (param.type === 'dynamic') {
            query[param.id] = this.getPathResult(this.allData, param.key_path) ? this.getPathResult(this.allData, param.key_path) : null
          } else if (param.type === 'static') {
            query[param.id] = param.value
          }
        })
        this.$router.push({ path: path, query: query })
      },
      renderInstanceDetail () {
        let postData = {
          action: 'process',
          method: 'GET',
          data: {
            pid: this.routerInfo.pid
          }
        }
        this.http.post('/flow/', this.parseData(postData)).then((res) => {
          console.log(res)
          const message = res.data.data.message
          res.data.data.paths.map(list => {
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
          this.allData = res.data.data
          this.renderForm()
          // this.renderTaskForm()
        })
      },
      renderForm () { // 渲染表单数据
        const renderFromData = {
          action: 'task/form/groups',
          method: 'GET',
          data: {
            pid: this.routerInfo.pid,
            tkey_list: this.path_list
          }
        }
        // this.loading = true
        this.http.post('/flow/', this.parseData(renderFromData)).then((res) => {
          this.form = res.data.data.list
          this.bodyStyle = this.form[this.form.length - 1].form.form.body.style + ''
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
      cancel () {
        this.$router.go(-1) // 跳转历史的上一页
      },
      onClaim () {
        this.$confirm(`确定认领该任务吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          let postData = {
            action: 'task_assign',
            method: 'POST',
            data: { tid: this.query.tid }
          }
          this.http.post('/flow/', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              this.$message.success('已认领！')
              this.$router.replace(`/procedure/${this.allData.pid}/${this.query.tid}/${this.params.name}`)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消认领'
          })
        })
      },
      assignToMe () {
        const user = this.$store.state.userinfo.userId
        this.permittedUserList.map(option => {
          if (option.userId === user) {
            this.newAssignee = user
          }
        })
      },
      onViewTask (order) {
        console.log(order)
        Object.assign(this.taskViewData, { visible: true, order })
      }
    },
    components: {
      headerFormDisplay,
      formStructureDisplay,
      progressWrap,
      processDialog
    }
  }
</script>
<style lang="less" scoped>
.excelDown {
  &:link {
    text-decoration: none;
  }
}
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
