<style lang="less">
  .tag-container {
    margin-bottom: 12px;

    h3 {
      float: left;
    }
  }

  .el-dropdown-menu__item {
    line-height: 28px;
    font-size: 14px;

    i {
      width: 14px;
      font-size: 12px;
    }
  }

  .expanded-form {
    font-size: 0;

    label {
      width: 90px;
      color: #99a9bf;
      padding-top: 7px;
      padding-bottom: 7px;
      vertical-align: initial;
    }

    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;

      &__content {
        line-height: 28px;
      }
    }
  }

  .el-collapse {

    .el-form {
      font-size: 0;
    }

    label {
      min-width: 72px;
      padding-top: 5px;
      padding-bottom: 5px;
    }

    .el-form-item {
      font-size: 13px;
      width: 50%;
      margin-right: 0;
      margin-bottom: 0;

      &__content {
        line-height: 24px;
      }
    }
  }
</style>

<template>
  <div class="orders">
    <el-row>
      <el-col :sm="24" :md="24" :lg="20">
        <el-card class="box-card">
          <div class="tag-container clear">
            <h3><i class="el-icon-date"></i> {{filter}}工单</h3>
            <el-radio-group v-model="filter" @change="onFilterChange" size="small" class="fr">
              <el-radio-button v-for="(filter, key) in filters" :label="key"></el-radio-button>
            </el-radio-group>
          </div>
          <assign-section v-if="isProcessAdmin && (filter==='待指派')"></assign-section>
          <el-table
            v-if="filter!=='待指派'"
            :data="filteredList"
            v-loading.body="loadingFiltered"
            stripe
            border>
            <!-- <el-table-column
              v-if="filter !== '已参与'"
              label="流程—任务"
              width="200"
              inline-template
              :context="_self">
              <template>{{row.pname}}—{{row.name}}</template>
            </el-table-column> -->
            <el-table-column
              label="工单号"
              prop="pid"></el-table-column>
            <el-table-column
              v-if="filter !== '已参与'"
              label="流程"
              prop="pname"></el-table-column>
            <el-table-column
              v-if="filter !== '已参与'"
              label="任务"
              prop="name"></el-table-column>
            <el-table-column
              v-if="filter === '已参与'"
              label="流程"
              prop="pname"></el-table-column>
            <el-table-column
              prop="variables.author"
              label="创建者"></el-table-column>
            <el-table-column
              prop="assignee"
              label="指派者"
              v-if="filter === '已审核' || filter === '待审核'"></el-table-column>
            <el-table-column
              :label="filter === '已审核' ? '认领时间' : '创建时间'"
              inline-template
              v-if="filter !== '已参与'"
              :context="_self">
              <template>
                <small>{{ (filter === '已审核' ? row.claimTime : row.createTime) | convertTime }}</small>
              </template>
            </el-table-column>
            <el-table-column
              label="起始时间"
              inline-template
              :context="_self"
              v-if="filter === '已参与'">
              <template>
                <small>{{ row.startTime | convertTime }}</small>
              </template>
            </el-table-column>
            <el-table-column
              label="终止时间"
              inline-template
              :context="_self"
              v-if="filter === '已参与'">
              <template>
                <small>{{ row.endTime | convertTime }}</small>
              </template>
            </el-table-column>
            <el-table-column
              inline-template
              width="120"
              :context="_self"
              label="操作">
              <template>
                <el-button size="small" @click="onView(row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="filter!=='待指派'" class="pagination-block clear">
            <el-pagination
              class="fr"
              layout="prev, pager, next"
              :current-page="currentPage"
              :page-size="pageSize"
              @current-change="onPageChange"
              :total="totalFiltered">
            </el-pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="device-view">
      <el-dialog
        :title="deviceViewData.device.name ? deviceViewData.device.pname + '—' + deviceViewData.device.name : deviceViewData.device.pname"
        v-model="deviceViewData.visible"
        size="large"
        :modal="true">
        <el-row>
          <el-col :span="20" :offset="2">
            <el-form label-position="left" inline class="expanded-form">
              <el-form-item v-if="deviceViewData.device.name" label="任务名称：">
                <span>{{deviceViewData.device.name}}</span>
              </el-form-item>
              <el-form-item v-if="deviceViewData.device.id" label="任务 ID：">
                <span>{{deviceViewData.device.id}}</span>
              </el-form-item>
              <el-form-item v-if="deviceViewData.device.variables" label="发起者：">
                <span>{{deviceViewData.device.variables.author}}</span>
              </el-form-item>
              <el-form-item v-if="deviceViewData.device.assignee" label="指派者：">
                <span>{{deviceViewData.device.assignee}}</span>
              </el-form-item>
              <el-form-item v-if="deviceViewData.device.claimTime" label="认领时间：">
                <small>{{deviceViewData.device.claimTime | convertTime}}</small>
              </el-form-item>
              <el-form-item v-if="deviceViewData.device.createTime" label="创建时间：">
                <small>{{deviceViewData.device.createTime | convertTime}}</small>
              </el-form-item>
              <el-form-item v-if="deviceViewData.device.startTime" label="起始时间：">
                <small>{{deviceViewData.device.startTime | convertTime}}</small>
              </el-form-item>
              <el-form-item v-if="deviceViewData.device.endTime" label="终止时间：">
                <small>{{deviceViewData.device.endTime | convertTime}}</small>
              </el-form-item>
              <el-form-item v-if="deviceViewData.device.priority" label="优先度：">
                <span>{{deviceViewData.device.priority}}</span>
              </el-form-item>
            </el-form>
            <progress-wrap :progress="{
             task: deviceViewData.device.taskDefinitionKey,
             pkey: deviceViewData.device.pkey,
             taskList: deviceViewData.device.task_list
             }"></progress-wrap>
            <h5 class="sub-title" v-if="deviceViewData.device.variables && deviceViewData.device.variables.message"><i class="el-icon-information"></i> 完整历史步骤（{{ deviceViewData.device.variables.message.length }}）</h5>
            <el-collapse v-if="deviceViewData.device.history_list">
              <el-collapse-item v-for="(task, key) in deviceViewData.device.history_list" :title="(key + 1).toString() + '. ' + task.task_name">
                <el-form label-position="left" label-width="90px" inline class="expanded-form">
                  <el-form-item v-if="task.task_key" label="任务 Key：">
                    <code>{{task.task_key}}</code>
                  </el-form-item>
                  <el-form-item v-if="task.operator" label="操作者：">
                    <span>{{task.operator.name}}</span>
                  </el-form-item>
                  <el-form-item v-if="task.time" label="时间：">
                    <span>{{task.time}}</span>
                  </el-form-item>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
        <span class="dialog-footer" slot="footer">
          <el-button v-if="filter === '待认领'" type="info" @click="onClaim(deviceViewData.device)"><i class="el-icon-check"></i> 认领</el-button>

          <!-- <span v-if="deviceViewData.device.pkey==='alter_device' && filter === '待审核'">
            <router-link v-if="deviceViewData.device.taskDefinitionKey === 'start'" :to="{ path: `/instock/${deviceViewData.device.variables.message[0].form.object_id}/${deviceViewData.device.pkey}/${deviceViewData.device.taskDefinitionKey}/${deviceViewData.device.id}/${deviceViewData.device.name}`}" class="el-button el-button--success">{{ action.name }}</router-link>
            <router-link v-else :to="{ path: `/storemanage/${deviceViewData.device.variables.message[0].form.object_id}/${deviceViewData.device.pkey}/${deviceViewData.device.taskDefinitionKey}/${deviceViewData.device.id}/${deviceViewData.device.name}`}" class="el-button el-button--plain">{{ action.name }}</router-link>
          </span> -->

          <span v-if="(deviceViewData.device.pkey==='import_device' || deviceViewData.device.pkey==='alter_device') && filter === '待审核'">
            <!-- <span v-for="action in deviceViewData.device.action"> -->
            <router-link v-if="deviceViewData.device.taskDefinitionKey === 'start'" :to="{ path: `/storemanage/instock/edit/${deviceViewData.device.id}`, query: { object_id: deviceViewData.device.variables.message[0].form.object_id }}" class="el-button el-button--success">查看</router-link>
            <router-link v-else :to="{ path: `/storemanage/${deviceViewData.device.variables.message[0].form.object_id}/${deviceViewData.device.pkey}/${deviceViewData.device.taskDefinitionKey}/${deviceViewData.device.id}/${deviceViewData.device.name}`}" class="el-button el-button--plain">查看</router-link>
          </span>

          <span v-if="deviceViewData.device.pkey==='export_device' && filter === '待审核'">
            <router-link :to="{ path: `/storemanage/${deviceViewData.device.variables.message[0].form.object_id}/${deviceViewData.device.pkey}/${deviceViewData.device.taskDefinitionKey}/${deviceViewData.device.id}/${deviceViewData.device.name}`}" class="el-button el-button--plain">查看</router-link>
          </span>

          <!-- <span v-if="deviceViewData.device.pkey==='alter_device' && filter === '待审核'">
            <router-link v-if="deviceViewData.device.taskDefinitionKey === 'start'" :to="{ path: `/storemanage/instock/edit/${deviceViewData.device.id}`, query: { object_id: deviceViewData.device.variables.message[0].form.object_id }}" class="el-button el-button--success">查看</router-link>
            <router-link v-else :to="{ path: `/storemanage/${deviceViewData.device.variables.message[0].form.object_id}/${deviceViewData.device.pkey}/${deviceViewData.device.taskDefinitionKey}/${deviceViewData.device.id}/${deviceViewData.device.name}`}" class="el-button el-button--plain">查看</router-link>
          </span> -->

          <span v-if="deviceViewData.device.pkey==='equipment_on' && filter === '待审核'">
            <span v-for="action in deviceViewData.device.action">
              <router-link v-if="action.type==='submit'" :to="{ path: `/equipment/${deviceViewData.device.variables.message[0].form.object_id}/${deviceViewData.device.taskDefinitionKey}/${deviceViewData.device.id}/${deviceViewData.device.name}`}" class="el-button el-button--success">{{ action.name }}</router-link>
              <router-link v-else-if="action.type==='back'" :to="{ path: `/equipment/${deviceViewData.device.variables.message[0].form.object_id}/${deviceViewData.device.taskDefinitionKey}/${deviceViewData.device.id}/${deviceViewData.device.name}`}" class="el-button el-button--plain">{{ action.name }}</router-link>
            </span>
          </span>

          <span v-if="deviceViewData.device.pkey==='host_apply' && filter === '待审核'">
            <!-- <span v-for="action in deviceViewData.device.action"> -->
            <router-link v-if="deviceViewData.device.taskDefinitionKey === 'start'" :to="{ path: `/system/apply/${deviceViewData.device.id}`, query: { object_id: deviceViewData.device.variables.message[0].form.object_id }}" class="el-button el-button--success">查看</router-link>
            <router-link v-else :to="{ path: `/system/${deviceViewData.device.taskDefinitionKey}/${deviceViewData.device.id}/${deviceViewData.device.name}`}" class="el-button el-button--plain">查看</router-link>
          </span>
          <!-- <el-button v-if="filter === '待审核'" type="success" @click="onApprove(deviceViewData.device)"><i class="el-icon-more"></i> 审批</el-button> -->
          <!-- <el-button v-if="filter === '待审核'" type="danger" @click="onReject(deviceViewData.device)"><i class="el-icon-close"></i> 驳回</el-button> -->
        </span>
      </el-dialog>
    </div>
  </div>

</template>

<script>
  import assignSection from './_assignSection'
  import progressWrap from '../_plugins/_progress'

  export default {
    data () {
      return {
        filter: '待认领',
        filters: {
          '待认领': 'runtime/tasks/assignee',
          '待审核': 'runtime/tasks/self',
          '已审核': 'history/tasks/self',
          '已参与': 'history/process/instances/self'
        },
        loadingFiltered: false,
        filteredList: [],
        currentPage: 1,
        pageSize: 10,
        totalFiltered: 0,
        deviceViewData: {
          visible: false,
          device: {}
        }
      }
    },

    computed: {
      isProcessAdmin () {
        return (window.localStorage.isProcessAdmin === 'true')
      }
    },

    created () {
      this.getFilteredList()
      if (this.isProcessAdmin) {
        this.filters['待指派'] = ''
      }
    },

    methods: {
      onFilterChange () {
        this.currentPage = 1
        if (this.filter !== '待指派') {
          this.getFilteredList()
        }
      },

      getFilteredList () {
        let postData = {
          action: this.filters[this.filter],
          method: 'GET',
          data: { page: this.currentPage }
        }
        this.loadingFiltered = true
        this.http.post('', this.parseData(postData)).then((res) => {
          this.filteredList = res.data.data.data
          this.totalFiltered = res.data.data.total
          this.loadingFiltered = false
        })
      },

      onPageChange (val) {
        this.currentPage = val
        this.getFilteredList()
      },

      onClaim (task) {
        this.$confirm(`确定认领任务「${task.name}」吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          let postData = {
            action: 'runtime/task/claim',
            method: 'POST',
            data: { tid: task.id }
          }
          this.http.post('', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              this.deviceViewData.visible = false
              this.$message.success('已认领！')
            }
            // this.$router.replace(``)
            switch (task.pkey) {
              case 'host_apply':
                // replace 浏览器后退键没效（没有历史），push 会有
                this.$router.replace(`/system/${task.taskDefinitionKey}/${task.id}/${task.name}`)
                break
              case 'equipment_on':
                this.$router.replace(`/equipment/${task.variables.message[0].form.object_id}/${task.taskDefinitionKey}/${task.id}/${task.name}`)
                break
              default:
                console.log('default')
                break
            }
            this.getFilteredList()
          })
        })
      },

      onReject (task) {
        this.$prompt(`请输入对 ${task.pname}—${task.name} 的驳回意见：`, '确定驳回？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ remark }) => {
          if (!remark) {
            this.$message.error('失败：驳回意见不可留空！')
            return
          }
          let postData = {
            action: 'runtime/task/complete',
            method: 'POST',
            data: {
              tid: task.id,
              form: { remark },
              pass: -1
            }
          }
          this.http.post('', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              this.deviceViewData.visible = false
              this.$message.success('已驳回！')
            }
            this.getFilteredList()
          })
        })
      },

      onView (task) {
        this.deviceViewData.visible = true
        this.deviceViewData.device = task
      }
    },

    components: {
      assignSection,
      progressWrap
    }
  }
</script>
