<template>
  <div id="item1-side" class="wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="24">
        <el-card class="box-card">
          <div class="clear">
            <h3 class="form-title fl"><i class="el-icon-fa-server"></i> {{ routerInfo.name ? routerInfo.name : '信息展示' }}</h3>
            <!-- <el-radio-group class="fr" v-model="bodyStyle">
              <el-radio-button label="1">标签页</el-radio-button>
              <el-radio-button label="2">卡片式</el-radio-button>
            </el-radio-group> -->
          </div>
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
                            <p class="h5">{{task.tname}}</p>
                            <!-- header 信息显示 -->
                            <div v-if="task.form.form.header.length >= 1">
                              <div v-for="taskformheader in task.form.form.header">
                                <span v-for="valueheader in taskformheader.value">
                                  <span v-if="showFormItem(valueheader, assignForm, applyData, true, false)">
                                    <header-form-display
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
              </div>
              <div class="anchorNav">
                <a href="javascript:void(0)" v-for="(data, index) in applyData.body" @click="goAnchor('#anchor-'+index)"> {{ index + 1 }} </a>
              </div>
            </template>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  // import searchFormStructure from '../../_plugins/_searchFormStructure'
  import headerFormStructureDisplay from '../../_plugins/_headerFormStructureDisplay'
  import headerFormDisplay from '../../_plugins/_headerFormDisplay'
  import formStructureDisplay from '../../_plugins/_formStructureDisplay'

  export default {
    data () {
      return {
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
        selectedDevices: [],
        searchKeyList: [],
        searchKeys: {},
        searchData: {},
        path_list: [],
        hostList: [],
        bodyStyle: '',
        bodyLableName: []
      }
    },
    created () {
      this.routerInfo = this.$route.params // 取得本实例的id及当前步骤
      this.renderInstanceDetail()
    },
    watch: {
      'form': {
        handler: 'renderBodyLabel',
        deep: true
      }
    },
    methods: {
      renderBodyLabel (val) {
        console.log(val[val.length - 1].form.form)
        this.bodyLabel(val[val.length - 1].form.form, this.assignForm, this.applyData, this.bodyLableName)
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
          this.applyData.version = res.data.data.version
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
      }
    },
    components: {
      headerFormStructureDisplay,
      headerFormDisplay,
      formStructureDisplay
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
