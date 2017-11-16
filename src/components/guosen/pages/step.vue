<template>
  <div class="wrapper" ref="wrapper">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <h3 class="form-title">
            <div>
              <i class="el-icon-fa-server color-primary"></i> {{taskData.pinstance && taskData.pinstance.pnum}}-{{ taskData.pinstance && taskData.pinstance.pd.pname }}-{{ taskData.ptask && taskData.ptask.tname }}
            <el-button type="info" :plain="true" icon="fa-history" class="fr" v-if="taskFormAll.show_history" @click="onViewTask(taskData)">工作流</el-button>
            <el-button class="not-print fr" type="info" :plain="true" icon="fa-print" @click="createPdf">打印</el-button>
            <a  class="el-button  fr el-button--info is-plain excelDown" :href="'/api/data?action=export_process_to_excel&&pids='+routerInfo.pid"><i class="el-icon-fa-file-excel-o"></i><span>下载excel表格</span></a>
            </div>
            <small class="fl" style="margin-left:20px;color:#ccc">{{taskData.assign ? '当前处理人：' : '当前处理组：'}}{{taskData.assign ? taskData.assign.nick : taskDAt.assign_group}}</small>
          </h3>
          <div class="step-progress" v-if="taskFormAll.show_progress">
            <progress-wrap :progress="{
             task: taskData.ptask.tkey,
             pkey: taskData.pinstance.pkey,
             taskList: taskData.pinstance.task_list
             }"></progress-wrap>
          </div>
          <el-form ref="assignForm" :model="assignForm" label-width="100px" :inline="true">
            <!-- 驳回信息 -->
            <el-alert
              v-if="isEditing"
              title="驳回信息"
              type="error"
              class="margin-bottom"
              :closable="false"
              :description="edtingInfo"
              show-icon></el-alert>
            <!-- <p v-if="isEditing" class="edtingInfo">驳回信息：{{edtingInfo}}</p> -->
            <!-- 表头信息显示 只要出现了 body 这些信息放body里 -->
            <!-- {{taskformheader.name}} 这是分组名称 因为现实了步骤任务名称，不在重复显示一个分组名称-->
            <div class="history-block" v-if="!isEmptyObj(applyData.header) && applyData.body && !applyData.body.length">
              <div v-for="(taskheader, index) in form">
                <div v-if="taskheader.form.form.header.length >= 1">
                  <p class="h5">{{taskheader.tname}}{{taskData.message[index].operator.nick === $store.state.userinfo.nick ? '-已参与' : ''}}</p>
                  <div v-for="taskformheader in taskheader.form.form.header">
                    <span v-for="valueheader in taskformheader.value">
                      <span v-if="showFormItem(valueheader, assignForm, applyData, taskheader.tkey, taskData.ptask.tkey)">
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
            <!-- header 表单填写 -->
          <div v-if="taskForm.header">
              <div v-for="task in taskForm.header">
                <span v-for="taskform in task.value">
                  <form-body
                    v-if="showFormItem(taskform, assignForm, applyData)"
                    :item="assignForm.header"
                    :form-item="taskform"
                    :whole="assignForm"
                    :isEdting="isEdting"
                    :wholeName="'assignForm'"
                    :isEditing="isEditing"
                    :message="applyData"
                    :header="true">
                  </form-body>
<!--                   {{showFormItem(taskform, assignForm, applyData) && taskform.value.type==='search_bar'}} -->
                  <search-bar
                    v-if="showFormItem(taskform, assignForm, applyData) && taskform.value.type==='search_bar'"
                    :hosts="assignForm.header"
                    :attr-list="taskform"
                    :limit="getLimitQuantity(taskform, assignForm, applyData)"
                    :message="applyData"
                    :header="true"
                    :postForm="assignForm"
                    @on-hosts-change="onHostsChange">
                  </search-bar>
                  <header-table
                    v-if="showFormItem(taskform, assignForm, applyData) && taskform.value.type==='table'"
                    :form-data="taskform"
                    :item="assignForm.header"
                    :messageData="applyData"
                    :postForm="assignForm"
                    :postFormName="'assignForm'">
                  </header-table>
                </span>
              </div>
            </div>  
            <div>
            <el-button size="small" @click="increaseBody()" v-if="!showAppend" class="appendBody">增加body</el-button>
            <div v-if="applyData.body && applyData.body.length" class="flex-box">
              <el-button-group v-if="taskForm.body && taskForm.body.style === 1" style="margin-bottom:8px;width:90px">
                <el-button size="small" @click="copyValue(tabIndex)">复制</el-button>
                <el-button size="small" @click="stickValue(tabIndex)">粘贴</el-button>
              </el-button-group>
              <el-button
                size="small"
                type="text"
                @click="retractInfo(true)"
                :icon="infoHideAll ? 'fa-angle-double-down' : 'fa-angle-double-up'">全部{{ infoHideAll ? '展开' : '收起' }}</el-button>
            </div>
            <a  :href="ipAdress" @click="checkIp(index)" target="_blank" class="checkIpButtom1 el-button el-button--default el-button--small el-button--info is-plain" v-if="taskData.pinstance.pkey === 'ipaddr_apply'&&taskData.ptask.tkey === 'approve'&&taskForm.body && taskForm.body.style === 1">查看IP</a>
            </div>
            <!-- taskForm.body.body_list.length !== 0 && -->
            <template v-if="taskForm.body && taskForm.body.style === 1">
              <el-tabs class="margin-bottom" type="border-card" @tab-click="handleClick" v-if="applyData.body && applyData.body.length">
                <el-tab-pane v-for="(data, index) in applyData.body" :key="index" :label="bodyLableName[index]">
                  <!-- body 信息显示 -->
                  <div class="history-block" :class="infoShow[index] ? 'show' : 'hidden'">
                    <el-button class="history-btn" size="small" type="text" :icon="infoShow[index] ? 'fa-angle-up' : 'fa-angle-down'" @click="retractInfo(index)">{{ infoShow[index] ? '收起' : '展开' }}</el-button>
                    <div v-for="(task, index) in form">
                      <div v-if="task.form.form.body.body_list.length">
                        <div v-for="taskbody in task.form.form.body.body_list">
                          <div v-if="showBodyList(taskbody, assignForm, applyData, index, task.tkey, taskData.pinstance.pkey)">
                            <p v-if="task.form.form.header.length || taskbody.attr_list.length" class="h5">{{task.tname}}{{taskData.message[index].operator.nick === $store.state.userinfo.nick ? '-已参与' : ''}}</p>
                            <!-- header 信息显示 -->
                            <div v-if="task.form.form.header.length >= 1">
                              <div v-for="taskformheader in task.form.form.header">
                                <span v-for="valueheader in taskformheader.value">
                                  <span v-if="showFormItem(valueheader, assignForm, applyData, task.tkey, taskData.ptask.tkey)">
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
                              :current-task="taskData.ptask.tkey"
                              :history-task="task.tkey">
                            </form-structure-display>
                          </div>
                        </div>
                      </div>
                      <div v-else>
                        <!-- header 信息显示 -->
                        <div v-if="task.form.form.header.length >= 1">
                          <p class="h5">{{task.tname}}{{taskData.message[index].operator.nick === $store.state.userinfo.nick ? '-已参与' : ''}}</p>
                          <div v-for="taskformheader in task.form.form.header">
                            <span v-for="valueheader in taskformheader.value">
                              <span v-if="showFormItem(valueheader, assignForm, applyData, task.tkey, taskData.ptask.tkey)">
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
                                :message="applyData"
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
                  <div class="clear">
                    <el-button v-if="taskData.ptask && taskData.ptask.tkey === 'cabinet'" type="primary" icon="search" size="small" @click="getPreview(data)" class="margin-bottom">机柜预览图</el-button>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </template>
            <template v-if="taskForm.body && taskForm.body.style === 2">
              <div v-if="applyData.body && applyData.body.length">
                <div v-for="(data, index) in applyData.body" style="position:relative">
                  <a  :href="ipAdress" @click="checkIp(index)" target="_blank" class="checkIpButtom2 el-button el-button--default el-button--small el-button--info is-plain" v-if="taskData.pinstance.pkey === 'ipaddr_apply'&&taskData.ptask.tkey === 'approve'">查看IP</a>
                <el-button-group style="position:absolute;right:15px;top:8px;z-index:1">
                  <el-button size="small" @click="copyValue(index)">复制</el-button>
                  <el-button size="small" @click="stickValue(index)">粘贴</el-button>
                </el-button-group>
                <el-tabs :id="'anchor-'+index" class="margin-bottom" type="border-card" @tab-click="handleClick"  :key="index">
                  <el-tab-pane :label="bodyLableName[index]">
                    <!-- body 信息显示 -->
                    <div class="history-block" :class="infoShow[index] ? 'show' : 'hidden'">
                      <el-button class="history-btn" size="small" type="text" :icon="infoShow[index] ? 'fa-angle-up' : 'fa-angle-down'" @click="retractInfo(index)">{{ infoShow[index] ? '收起' : '展开' }}</el-button>
                      <div v-for="(task, index) in form">
                        <div v-if="task.form.form.body.body_list.length">
                          <div v-for="taskbody in task.form.form.body.body_list">
                            <div v-if="showBodyList(taskbody, assignForm, applyData, index, task.tkey, taskData.pinstance.pkey)">
                              <p class="h5">{{task.tname}}{{taskData.message[index].operator.nick === $store.state.userinfo.nick ? '-已参与' : ''}}</p>
                              <!-- header 信息显示 -->
                              <div v-if="task.form.form.header.length >= 1">
                                <div v-for="taskformheader in task.form.form.header">
                                  <span v-for="valueheader in taskformheader.value">
                                    <span v-if="showFormItem(valueheader, assignForm, applyData, task.tkey, taskData.ptask.tkey)">
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
                                :current-task="taskData.ptask.tkey"
                                :history-task="task.tkey">
                              </form-structure-display>
                            </div>
                          </div>
                        </div>
                        <div v-else>
                          <!-- header 信息显示 -->
                          <p class="h5">{{task.tname}}{{taskData.message[index].operator.nick === $store.state.userinfo.nick ? '-已参与' : ''}}</p>
                          <div v-if="task.form.form.header.length >= 1">
                            <div v-for="taskformheader in task.form.form.header">
                              <span v-for="valueheader in taskformheader.value">
                                <span v-if="showFormItem(valueheader, assignForm, applyData, task.tkey, taskData.ptask.tkey)">
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
                                  :message="applyData"
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
                    <div class="clear">
                      <el-button v-if="taskData.ptask && taskData.ptask.tkey === 'cabinet'" type="primary" icon="search" size="small" @click="getPreview(data)" class="margin-bottom">机柜预览图</el-button>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
              </div>
              <div class="anchorNav">
                <a href="javascript:void(0)" v-for="(data, index) in applyData.body" @click="goAnchor('#anchor-'+index)"> {{ index + 1 }} </a>
              </div>
            </template>
            <!-- 按钮区域 -->
            <div class="btn-area">
              <span v-for="action in applyData.action">
                <el-button v-if="action.type==='submit'" type="success" @click="onSubmit('assignForm')" :disabled="submitLoading">{{action.name}}</el-button>
                <el-tooltip v-else-if="action.type==='manual'" :content="action.desc" placement="bottom">
                  <el-button type="primary" @click="onManual(action)" :disabled="submitLoading">{{action.name}}</el-button>
                </el-tooltip>
                <el-button v-else-if="action.type==='back'" type="danger" @click="onReject(applyData, action)" :disabled="submitLoading">{{action.name}}</el-button>
                <el-button v-else-if="action.type==='target'" type="info" :disabled="submitLoading">
                  <!-- target="_blank" -->
                  <a class="link-block" :href="action.url">{{action.name ? action.name : '跳转'}}</a>
                </el-button>
              </span>
              <el-button :plain="true" type="primary" @click="cancel">取消</el-button>
            </div>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <task-dialog v-if="taskViewData.visible" :task-view-data="taskViewData"></task-dialog>
 <!--    <el-dialog
      title="工作流"
      v-model="showHistory">
      <el-collapse v-if="taskData && taskData.pinstance">
        <el-collapse-item v-for="(task, key) in taskData.pinstance.history_list" :key="key" :title="(key + 1).toString() + '. ' + task.name">
          <el-form label-position="left" label-width="90px" inline class="expanded-form">
            <el-form-item v-if="task.task_key" label="任务 Key：">
              <code>{{task.task_key}}</code>
            </el-form-item>
            <el-form-item v-if="task.operator" label="操作者：">
              <span>{{task.operator.nick}}</span>
            </el-form-item>
            <el-form-item v-if="task.time" label="处理时间：">
              <span>{{task.time}}</span>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </el-dialog> -->
    <!-- 机柜图预览 -->
    <div v-if="taskData.ptask && taskData.ptask.tkey === 'cabinet'" class="cabinet-preview" :class="{'shown': previewShown}">
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
        <el-col :sm="6" class="idcrack-view" v-for="idcrack in idcrackData" :key="idcrack.code">
          <!-- {{ idcrack.code }} -->
          {{idcrack.code}}
          <p v-for="(n, nindex) in idcrack.u_info.jgUHeight" class="idcrack-view__span" :class="{ 'occupied': idcrack.isTaked.includes((idcrack.u_info.jgUHeight - nindex)) }">
            {{idcrack.u_info.jgUHeight - nindex}}
          </p>
          <!-- <table class="el-table__body table-condensed table-cabinet text-navy">
            <caption>{{ idcrack.code }}</caption>
            <tbody>
              <tr v-for="(nindex, n) in idcrack.u_info.jgUHeight">
                <td :class="{ 'occupied': idcrack.isTaked.includes((idcrack.u_info.jgUHeight - n)) }">
                  U{{idcrack.u_info.jgUHeight - n}}
                </td>
              </tr>
            </tbody>
          </table> -->
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  // import searchFormStructure from '../../_plugins/_searchFormStructure'
  import taskDialog from './_plugins/_taskDialog'
  import headerFormDisplay from '../../_plugins/_headerFormDisplay'
  import formStructureDisplay from '../../_plugins/_formStructureDisplay'
  import formBody from '../../_plugins/_formBody'
  import searchBar from '../../_plugins/_searchBar'
  import bodyTable from '../../_plugins/_bodyTable'
  import headerTable from '../../_plugins/_headerTable'
  import progressWrap from '../../_plugins/_progress'
  export default {
    data () {
      return {
        taskViewData: {
          visible: false,
          order: {}
        },
        routerInfo: {},
        applyData: {},
        taskData: {},
        isEditing: false,
        showHistory: false,
        edtingInfo: '',
        form: {},
        taskForm: {},
        taskFormAll: {},
        bodyLableName: [],
        assignForm: {
          header: {},
          body: []
        },
        tabIndex: 0,
        path_list: [],
        submitLoading: false,
        infoShow: {},
        infoHideAll: true,
        hostList: [],
        copyObj: {},
        previewShown: false,
        idcrackData: [],
        previewPage: 1,
        pageNum: 1,
        idcrackList: [],
        idcrackTaked: [],
        hostMachineIdcrackList: []
      }
    },
    created () {
      this.routerInfo = this.$route.params // 取得本实例的id及当前步骤
      this.renderInstanceDetail()
    },
    watch: {
      'taskFormAll.form': 'showAppend',
      'idcrackData': 'idcrackIsTaked',
      'taskForm': {
        handler: 'renderBodyLabel',
        deep: true
      },
      'applyData.body' (oldVal, newVal) {
        this.applyData.body.map((body, index) => {
          // this.infoShow[index] = true
          this.$set(this.infoShow, index, true)
        })
      },
      'infoShow': {
        handler: 'infoShowFunction',
        deep: true
      },
      'taskFormAll': {
        handler: 'getAutoFillData',
        deep: true
      }
    },
    methods: {
      showAppend () {
      // 判断前一个是否有body决定显示与否
        let tkey = this.taskData.ptask.tkey
        let tIndex = ''
        this.taskData.message.map((info, index) => {
          if (info.task_key === tkey) {
            tIndex = index - 1
          }
        })
        if (tIndex === '') { tIndex = this.taskData.message.length - 1 }
        // 判断继承方式以及可增加个数 权重更高
        let tType = this.taskFormAll.form.body.count.type
        if (tType === 'message_header') {
          console.log('1')
          return true
        } else if (tType === 'form_header') {
          console.log('2')
          return true
        } else if (tType === 'static') {
          console.log('3')
          let {min} = this.taskFormAll.form.body.count
          let {max} = this.taskFormAll.form.body.count
          console.log(min, max)
          console.log(this.taskData.message[tIndex].form.body)
          return this.taskData.message[tIndex].form.body && this.taskData.message[tIndex].form.body.length
        } else {
          return this.taskData.message[tIndex].form.body && this.taskData.message[tIndex].form.body.length
        }
      },
      increaseBody () {
        this.applyData.body.push({})
        this.renderBodyLabel()
        let lastkey = this.assignForm.body.length - 1
        this.assignForm.body = [ ...this.assignForm.body, JSON.parse(JSON.stringify(this.assignForm.body[lastkey])) ]
      },
      // 查找对应的cmdbip地址
      checkIp (index) {
        let name = this.applyData.body[index].ipscope.name
        let cmdb = this.$store.state.userinfo._easyops_url
        this.ipAdress = `${cmdb}/cmdb/resource/ipaddr/fallback?aq=%5B%5B"ipscope","contain","${name}"%5D%5D&page=1`
        console.log(this.ipAdress)
        return this.ipAdress
      },
      getAutoFillData () {
        if (this.taskFormAll.fill_form) {
          const renderFromData = {
            action: 'auto/fill/form',
            method: 'post',
            data: {
              tid: this.routerInfo.tid
            }
          }
          this.http.post('/data/', this.parseData(renderFromData)).then((res) => {
            console.log(res.data.data)
            console.log(this.assignForm)
            for (let i = 0; i < res.data.data.body.length; i++) {
              let list = res.data.data.body[i]
              Object.assign(this.assignForm.body[i], list)
            }
            for (let i = 0; i < res.data.data.header.length; i++) {
              let list = res.data.data.header[i]
              Object.assign(this.assignForm.header[i], list)
            }
          })
        }
      },
      onViewTask (order) {
        console.log(order)
        Object.assign(this.taskViewData, { visible: true, order })
      },
      copyValue (index) {
        console.log(index)
        let bodyList = this.taskForm.body.body_list
        let selection = []
        for (let taskFormData in bodyList) {
          for (let i in bodyList[taskFormData].attr_list) {
            bodyList[taskFormData].attr_list[i].value.map((val) => {
              return selection.push(val)
            })
          }
        }
        var copyValues = selection.filter((val) => {
          if (val.default.type === '' && !val.readOnly && !val.unique) {
            return val
          }
        })
        // 获取可以复制的选项id
        copyValues = copyValues.map((val) => {
          return val.id
        })
        console.log(copyValues)
        console.log(this.assignForm.body[index])
        // 把复制内容整合成一个对象
        let list = {}
        Object.assign(list, this.assignForm.body[index])
        for (let i in list) {
          if (!copyValues.some((val) => { return i === val })) {
            delete list[i]
          }
        }
        this.copyObj = list
        this.$message({
          message: '已复制',
          type: 'success',
          duration: '1000'
        })
      },
      stickValue (index) {
        Object.assign(this.assignForm.body[index], this.copyObj)
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
      getPreview (data) {
        let idcrackData = {}
        if (this.taskData.pinstance.pkey === 'host_machine') {
          idcrackData.ipscopeId = this.applyData.body[0].esxi_ipscope.instanceId
          idcrackData.type = 'esxi'
        } else {
          idcrackData.ipscopeId = data.sc_ip_info[0].ipscope.instanceId
        }
        const postHeadvData = {
          action: 'idcrack/list',
          method: 'GET',
          data: idcrackData
        }
        this.http.post('/data/', this.parseData(postHeadvData))
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
      onHostsChange (val, index, id, header) {
        // console.log(val)
        // this.hostList = []
        // this.hostList = val
        console.log(this.assignForm)
        console.log(val, index, id, header)
        if (header) {
          this.taskForm.header.map(header => {
            header.value.map(item => {
              if (item.show.type) {
                // show.type 有四种类型
                if (item.show.type === 'form_header') {
                  if ((item.show.op === 'eq' && this.getPathResult(this.assignForm.header, item.show.key_path) === item.show.value) ||
                      (item.show.op === 'neq' && this.getPathResult(this.assignForm.header, item.show.key_path) !== item.show.value) ||
                      (item.show.op === 'reg' && item.show.value.includes(this.getPathResult(this.assignForm.header, item.show.key_path)))) {
                    if (item.id === id) { // onHostsChange 可以传一个 id header 出来，直接分header赋值给对应id
                      this.assignForm.header[item.id] = val
                    }
                  }
                }
              } else {
                if (item.id === id) {
                  // this.assignForm.header[item.id] = []
                  this.assignForm.header[item.id] = val
                }
              }
            })
          })
        } else {
          this.taskForm.body.body_list.map(bodyList => {
            if (this.showBodyList(bodyList, this.assignForm, this.applyData, index)) {
              bodyList.attr_list.map(list => {
                list.value.map(item => {
                  if (this.showFormItem(item, this.assignForm, this.applyData, true, true, index)) {
                    if (item.id === id) {
                       // onHostsChange 可以传一个 id header 出来，直接分header赋值给对应id
                      this.assignForm.body[index][item.id] = val
                    }
                  }
                })
              })
            }
          })
        }
        // ④外层调用组件方注册变更方法，将组件内的数据变更，同步到组件外的数据状态中// 验证searchbar一个符不符合规则
        if (header) {
          let key = `header.${id}`
          console.log(key)
          this.$refs['postForm'].validateField(key)
        } else {
          let key = `body.${index}.id`
          console.log(key)
          this.$refs['postForm'].validateField(key)
        }
        // this.$refs['assignForm'].validate((valid) => {}) // 调用验证
      },
      infoShowFunction (newVal) {
        const infoShow = []
        for (const i in newVal) {
          infoShow.push(newVal[i])
        }
        this.infoHideAll = infoShow.some(info => { return info === false })
      },
      renderBodyLabel (val) {
        this.bodyLabel(this.taskForm, this.assignForm, this.applyData, this.bodyLableName)
      },
      renderTaskForm () { // 渲染表单数据（当前处理表单就是要填什么）
        const renderFromData = {
          action: 'task/form/group',
          method: 'GET',
          data: {
            tid: this.routerInfo.tid
          }
        }
        this.http.post('/flow/', this.parseData(renderFromData)).then((res) => {
          this.taskForm = res.data.data.form
          this.taskFormAll = res.data.data
          // 渲染 body 个数
          // 当前表单的body是上一步header拆出来的（特殊）
          if (this.applyData.body.length === 0) {
            if (this.taskForm.body.count.type === 'message_header') { // 从历史信息的 header 读取 body 的个数
              this.renderBodyLength(this.applyData.header)
            } else if (this.taskForm.body.count.type === 'form_header') {
              this.$watch('assignForm.header', (newVal, oldVal) => {
                this.renderBodyLength(newVal)
              }, { deep: true })
            } else if (this.taskForm.body.count.type === 'static') {
              for (let i = 0; i < this.taskForm.body.count.min; i++) {
                this.applyData.body.push({})
              }
            }
          }
          this.taskForm.header.forEach((header, k) => {
            if (header) {
              header.value.map(value => {
                if (value.need_submit) {
                  if (this.showFormItem(value, this.assignForm)) {
                    this.setDataType(value, this.assignForm.header)
                    if (value.show.type === 'form_header') {
                      this.$watch('assignForm.header.' + value.show.key_path, (newVal, oldVal) => {
                        if (this.showFormItem(value, this.assignForm)) {
                          this.setDataType(value, this.assignForm.header)
                        } else {
                          delete this.assignForm.header[value.id]
                        }
                      })
                    }
                  } else {
                    // console.log(value.name)
                    this.setDataType(value, this.assignForm.header)
                  }
                }
              })
            }
          })
          // console.log(this.assignForm.header.host_type)
          this.renderForm()
          this.applyData.body.forEach((item, k) => {
            // console.log(this.taskForm.body.body_list)
            if (this.taskForm.body.body_list.length === 0) {
              // body的数量不正确,应继承上一环节body的数量
              this.assignForm.body.push({})
            }
            this.taskForm.body.body_list.forEach((body, bodyIndex) => {
              // console.log(body)
              if (body.show.type === 'form_header') {
                this.$watch('assignForm.header.' + body.show.key_path, (newVal, oldVal) => {
                  this.$set(this.assignForm, 'body', [{}]) // 初始化表单数据
                  this.taskForm.body.body_list.map(bodyList => {
                    if (this.showBodyList(bodyList, this.assignForm, this.applyData)) {
                      bodyList.attr_list.map(group => {
                        group.value.map(value => {
                          // this.setDataType(value, this.assignForm.body[0])
                          if (value.need_submit) {
                            if (this.showFormItem(value, this.assignForm, this.applyData, true, false, k)) {
                              this.setDataType(value, this.assignForm.body[k])
                            }
                            if (value.show.type === 'form_header') {
                              this.$watch('assignForm.header.' + value.show.key_path, (newVal, oldVal) => {
                                if (this.showFormItem(value, this.assignForm)) {
                                  this.setDataType(value, this.assignForm.body[k])
                                } else {
                                  delete this.assignForm.body[k][value.id]
                                }
                              })
                            } else if (value.show.type === 'form_body') {
                              this.$watch('assignForm.body.' + k + '.' + value.show.key_path, (newVal, oldVal) => {
                                if (this.showFormItem(value, this.assignForm, this.applyData, true, false, k)) {
                                  this.setDataType(value, this.assignForm.body[k])
                                } else {
                                  delete this.assignForm.body[k][value.id]
                                }
                              })
                            }
                          }
                        })
                      })
                    }
                  })
                })
              } else if (this.showBodyList(body, this.assignForm, this.applyData, k, true, false)) {
                let newData = {}
                body.attr_list.map(group => {
                  group.value.map(value => {
                    if (value.need_submit) {
                      if (this.showFormItem(value, this.assignForm, this.applyData, true, false, k)) {
                        this.setNewDataType(value, newData)
                      }
                      if (value.show.type === 'form_header') {
                        this.$watch('assignForm.header.' + value.show.key_path, (newVal, oldVal) => {
                          if (this.showFormItem(value, this.assignForm)) {
                            this.setDataType(value, this.assignForm.body[k])
                          } else {
                            delete this.assignForm.body[k][value.id]
                          }
                        })
                      } else if (value.show.type === 'form_body') {
                        this.$watch('assignForm.body.' + k + '.' + value.show.key_path, (newVal, oldVal) => {
                          if (this.showFormItem(value, this.assignForm, this.applyData, true, false, k)) {
                            this.setDataType(value, this.assignForm.body[k])
                          } else {
                            delete this.assignForm.body[k][value.id]
                          }
                        })
                      }
                    }
                  })
                })
                this.assignForm.body.push(newData)
              }
            })
            // U 位默认值
            if (this.taskData.ptask.tkey === 'cabinet' && this.taskData.pinstance.pkey === 'host') {
              // console.log(this.assignForm.body[k])
              this.$watch('assignForm.body.' + k + '.idcrack', (newVal, oldVal) => {
                // console.log(newVal)
                // console.log(newVal, oldVal, this.applyData.body)
                const uHeight = newVal.u_info.jgUHeight
                // 整理出一个未被占用的 U位 列表
                let untakedData = []
                for (let i = 1; i <= uHeight; i++) {
                  if (newVal.u_info.assetList.length !== 0) {
                    if (newVal.u_info.assetList.every(list => { return i < list.beginU || i > list.endU })) {
                      untakedData.push(i)
                    }
                  }
                }
                // console.log(untakedData)
                // 整理出被当前其他表单占用的 U位
                let formTakedData = []
                this.assignForm.body.map((body, bodyk) => {
                  if (body.idcracku && body.idcrack && (body.idcrack.instanceId === newVal.instanceId)) {
                    let eU
                    if (this.taskData.pinstance.pkey === 'host') {
                      eU = body.idcracku + +this.applyData.header.host_list[bodyk].u_num - 1
                      // console.log(eU, body.idcracku, this.applyData.header.host_list[bodyk].u_num)
                    } else if (this.taskData.pinstance.pkey === 'host_my') {
                      eU = body.idcracku + +this.applyData.body[bodyk].host.u_num - 1
                    }
                    // console.log(eU)
                    for (let tU = body.idcracku; tU <= eU; tU++) {
                      if (!formTakedData.includes(tU)) {
                        formTakedData.push(tU)
                      }
                    }
                  }
                })
                // console.log(formTakedData)
                if (formTakedData.length !== 0) {
                  const untakedDataLenght = untakedData.length
                  for (let i = 0; i <= untakedDataLenght; i++) {
                    let Uend
                    if (this.taskData.pinstance.pkey === 'host') {
                      Uend = untakedData[i] + +this.applyData.header.host_list[k].u_num - 1
                    } else if (this.taskData.pinstance.pkey === 'host_my') {
                      Uend = untakedData[i] + +this.applyData.body[k].host.u_num - 1
                    }
                    if (!formTakedData.includes(untakedData[i]) && !formTakedData.includes(Uend)) {
                      this.assignForm.body[k].idcracku = untakedData[i]
                      console.log(k, untakedData[i])
                      return false
                    }
                  }
                } else {
                  this.assignForm.body[k].idcracku = untakedData[0]
                  // console.log(k, untakedData[0])
                }
              })
            }
          })
          // 宿主机 U 位默认值
          // if (this.taskData.ptask.tkey === 'cabinet' && this.taskData.pinstance.pkey === 'host_machine') {
          //   const UData = {
          //     action: 'get/racku',
          //     method: 'GET',
          //     data: {
          //       ipscopeId: this.applyData.body[0].esxi_ipscope.instanceId,
          //       host_u: this.applyData.header.hosts[0].u_num,
          //       host_num: this.applyData.header.hosts.length,
          //       vmware_type: this.applyData.header.vmware_type
          //     }
          //   }
          //   this.http.post('/data/', this.parseData(UData)).then((res) => {
          //     const resData = res.data.data.list
          //     resData.map(list => {
          //       if (!this.isEmptyObj(list._default)) {
          //         for (const i in list._default) {
          //           // const index = i - 1
          //           this.assignForm.body[i].idcracku = list._default[i]
          //           this.assignForm.body[i].idcrack = list
          //         }
          //       }
          //     })
          //   })
          // }
          // 主机名
          // if (this.taskData.ptask.tkey === 'confirm1') {
          //   const postHeadvData = {
          //     action: 'recommend_hostname_list',
          //     method: 'get',
          //     data: {
          //       tid: this.$route.params.tid
          //     }
          //   }
          //   this.http.post('/data/', this.parseData(postHeadvData))
          //   .then((response) => {
          //     response.data.data.list.map((list, index) => {
          //       this.assignForm.body[index].hostname = list
          //     })
          //   })
          // }
          // 判断是否为驳回信息
          let newDataBody
          for (var message of this.taskData.message) {
            if (message.task_key === this.taskData.ptask.tkey) {
              this.isEditing = true
              this.edtingInfo = this.taskData.message[this.taskData.message.length - 1].form.value
              this.assignForm.header = Object.assign({}, this.assignForm.header, message.form.header)
              if (!message.form.body) return false
              newDataBody = message.form.body.map((body, bodyindex) => {
                let data = {}
                for (const key in this.assignForm.body[bodyindex]) {
                  // 这里是过滤掉当前需要提交的表单的字段之外的字段 可能驳回信息在某个步骤改变值，连同下面的字段也改变
                  if (body[key]) {
                    data[key] = body[key]
                  } else {
                    data[key] = this.assignForm.body[bodyindex][key]
                  }
                }
                return data
                // return Object.assign({}, this.assignForm.body[bodyindex], body)
              })
              this.assignForm.body = this.assignForm.body.map((body, bodyindex) => {
                return Object.assign({}, body, newDataBody[bodyindex])
              })
              return false
            }
          }
        })
      },
      renderBodyLength (data) {
        this.applyData.body = []
        const keyData = this.getPathResult(data, this.taskForm.body.count.key_path)
        if (Array.isArray(keyData)) {
          // this.applyData.body.length = keyData.length
          const num = keyData.length
          for (let i = 0; i < num; i++) {
            this.applyData.body.push({})
          }
        } else if (typeof keyData === 'number') {
          // this.applyData.body.length = keyData
          const num = keyData
          for (let i = 0; i < num; i++) {
            this.applyData.body.push({})
          }
        } else if (typeof keyData === 'string') {
          if (typeof +keyData === 'number') {
            // this.applyData.body.length = +keyData
            const num = +keyData
            for (let i = 0; i < num; i++) {
              this.applyData.body.push({})
            }
          } else {
            this.$message('数据有错')
          }
        }
      },
      renderInstanceDetail () {
        let postData = {
          action: 'task',
          method: 'GET',
          data: {
            tid: this.routerInfo.tid
          }
        }
        this.http.post('/flow/', this.parseData(postData)).then((res) => {
          console.log(res)
          this.taskData = res.data.data
          const message = res.data.data.message
          res.data.data.paths.map(list => {
            list.map(path => {
              if (!this.path_list.includes(path.tkey)) {
                this.path_list.push(path.tkey)
              }
            })
          })
          const taskKeyArr = this.path_list.filter(item => item !== 'start')
          if (this.path_list.includes(this.taskData.ptask.tkey)) {
           // 如果是驳回信息，最后一步没有历史信息,最后一步为驳回信息
            taskKeyArr.splice(taskKeyArr.length - 1, 1)
          }
          // console.log(taskKeyArr)
          this.applyData = this.getTaskInfo(message, taskKeyArr)
          // console.log(this.applyData)
          this.applyData.action = res.data.data.action
          this.renderTaskForm()
          if (this.taskData.pinstance.pkey === 'host_apply' && this.taskData.ptask.tkey === 'start') {
            this.$watch('assignForm.body', (val, oldVal) => {
              for (const data of val) {
                data.score = (data.cpu * 1 + data.localStorage * 1 + data.hardDisk / 20) + ''
              }
            }, { deep: true })
          }
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
        })
      },
      handleClick (tab, event) {
        this.tabIndex = tab.index
        // console.log(this.tabIndex)
      },
      onSubmit (assignForm) {
        console.log(this.assignForm)
        this.$confirm('确定提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.$refs['assignForm'].validate((valid) => {
            if (valid) {
              this.postMethod(this.routerInfo.tid, this.assignForm)
              // console.dir(this.assignForm)
            } else {
              console.log('error submit!!')
              this.$message.warning('未完成！')
              return false
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消审批'
          })
        })
      },
      postMethod (id, data) {
        this.submitLoading = true
        let postFormData = {
          header: {},
          body: []
        }
        this.taskForm.header.map(header => {
          header.value.map(item => {
            if (item.need_submit) {
              for (const headerid in data.header) {
                if (item.id === headerid) {
                  if (Array.isArray(data.header[headerid])) {
                    if (item.required || data.header[headerid].length !== 0) {
                      postFormData.header[headerid] = data.header[headerid]
                    }
                  } else if (data.header[headerid] || (typeof data.header[headerid] === 'number' && data.header[headerid] === 0)) {
                    // 整型为 0 时可以提交
                    postFormData.header[headerid] = data.header[headerid]
                  }
                }
              }
            }
          })
        })
        data.body.map((body, bodyIndex) => {
          postFormData.body[bodyIndex] = {}
          this.taskForm.body.body_list.map(bodyList => {
            if (this.showBodyList(bodyList, this.assignForm, this.applyData, bodyIndex)) {
              bodyList.attr_list.map(list => {
                list.value.map(item => {
                  if (item.need_submit) {
                    for (const bodyid in body) {
                      if (item.id === bodyid) {
                        if (Array.isArray(body[bodyid])) {
                          if (item.required || body[bodyid].length !== 0) {
                            postFormData.body[bodyIndex][bodyid] = body[bodyid]
                          }
                        } else if (body[bodyid] || (typeof body[bodyid] === 'number' && body[bodyid] === 0)) {
                          // 整型为 0 时可以提交
                          postFormData.body[bodyIndex][bodyid] = body[bodyid]
                        }
                      }
                    }
                  }
                })
              })
            }
          })
        })
        console.log(postFormData)
        const postData = {
          action: 'task',
          method: 'POST',
          data: {
            tid: id,
            form: postFormData // 通过审批 需要判断一下登录的账号的角色身份
              // pass: "流程走向控制变量,整型(可选,默认为0)"
          }
        }
        this.http.post('/flow/', this.parseData(postData))
          .then((res) => {
            this.submitLoading = false
            if (res && res.status === 200) {
              this.$message({
                type: 'success',
                message: '成功!'
              })
              if (this.taskData.pinstance.pkey === 'easyops_monitor') {
                this.$router.replace('/alarm') // 告警处理成功后跳转告警事件
              } else {
                this.$router.replace('/menu') // 跳转运维目录
              }
            }
          })
      },
      onManual (action) {
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
      },
      manualMethod (action) {
        this.submitLoading = true
        const postData = {
          action: 'do/form/action',
          method: 'POST',
          data: {
            form: this.assignForm,
            tid: this.routerInfo.tid,
            action_id: action.id
          }
        }
        this.http.post('/flow/', this.parseData(postData))
        .then((res) => {
          this.submitLoading = false
          if (res && res.status === 200) {
            this.$message({
              type: 'success',
              message: '提交成功!'
            })
            this.$router.replace('/menu') // 分配成功跳转工单管理
          }
        })
      },
      onReject (task, action) {
        // console.log(task, action.pass)
        this.$prompt('请输入' + action.name + '意见：', '确定' + action.name + '？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({value}) => {
          if (!value) {
            this.$message.error('失败：驳回意见不可留空！')
            return
          }
          this.submitLoading = true
          let postData = {
            action: 'task',
            method: 'POST',
            data: {
              tid: this.routerInfo.tid,
              form: { value },
              pass: action.pass
            }
          }
          this.http.post('/flow/', this.parseData(postData)).then((res) => {
            this.submitLoading = false
            if (res.status === 200) {
              this.$message.success('已驳回！')
            }
            this.$router.go(-1) // 跳转历史的上一页
          })
        })
      },
      cancel () {
        this.$router.go(-1) // 跳转历史的上一页
      },
      goAnchor (selector) {
        const anchor = this.$el.querySelector(selector)
        console.log(anchor.offsetParent.offsetTop)
        console.log(document.body.scrollTop)
        document.documentElement.scrollTop = anchor.offsetParent.offsetTop
      },
      retractInfo (index) {
        const selector = this.$el.querySelectorAll('.history-block')
        const leng = selector.length
        if (index === true) {
          for (let i = 0; i < leng; i++) {
            this.infoShow[i] = this.infoHideAll
          }
        } else {
          console.log(this.infoShow[index])
          this.infoShow[index] = !this.infoShow[index]
        }
      }
    },
    components: {
      // searchFormStructure,
      headerFormDisplay,
      formStructureDisplay,
      formBody,
      searchBar,
      bodyTable,
      headerTable,
      progressWrap,
      taskDialog
    }
  }
</script>
<style lang="less" scoped>
.appendBody {
  margin-bottom: 8px;
  vertical-align: middle;
}
.checkIpButtom1 {
  &:link {
    text-decoration: none;
    }
  margin-left: 5px;
  margin-bottom: 8px;
  vertical-align: middle;
}
.checkIpButtom2 {
  &:link {
    text-decoration: none;
    }
  position:absolute;
  right:110px;
  top:8px;
  z-index:1;
}
.excelDown {
  &:link {
    text-decoration: none;
  }
  margin-right: -4px;
}
.el-tag {
  font-size: 14px;
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
  // background-color: #f3faff;
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
.link-block {
  color: #fff;
  &:hover {
    text-decoration: none;
  }
}
.idcrack-view {
  .idcrack-view__span {
    border: 1px solid #ccc;
    margin-bottom: 0;
    padding: 2px 0;
    line-height: 15px;
    & + .idcrack-view__span {
      border-top: none;
    }
    &.occupied {
      background-color: #b5bbc8;
      color: #fff;
      text-shadow: 1px 1px 4px rgba(0,0,0,.3);
      font-weight: bold;
      background-image: repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,.3) 4px, rgba(255,255,255,.3) 8px);
    }
  }
}
</style>
