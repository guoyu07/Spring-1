<template>
  <el-dialog
    :title="taskViewData.order.pinstance.pd.pname"
    v-model="taskViewData.visible"
    size="large">
    <el-row>
      <el-col :span="20" :offset="2">
        <el-form label-position="left" inline class="expanded-form" label-width="100px">
          <el-form-item v-if="taskViewData.order.pinstance.pd.pname" label="任务名称">
            <span>{{taskViewData.order.pinstance.pd.pname}}</span>
          </el-form-item>
          <el-form-item v-if="taskViewData.order.pinstance.pd.pname" label="所属流程">
            <span>{{taskViewData.order.pinstance.pd.pname}}</span>
          </el-form-item>
          <el-form-item v-if="taskViewData.order.pinstance.pnum" label="流程单号">
            <span>{{taskViewData.order.pinstance.pnum}}</span>
          </el-form-item>
          <el-form-item v-if="taskViewData.order.pinstance.author" label="发起者">
            <span>{{taskViewData.order.pinstance.author.nick}}</span>
          </el-form-item>
          <el-form-item v-if="taskViewData.order.assign" label="处理人">
            <span>{{taskViewData.order.assign.nick}}</span>
          </el-form-item>
          <el-form-item v-if="taskViewData.order.assign_group" label="处理组">
            <span>{{taskViewData.order.assign_group.name}}</span>
          </el-form-item>
          <el-form-item v-if="taskViewData.order.candidate_users.length" label="候选人">
            <el-tag v-for="user in taskViewData.order.candidate_users" :key="user.userId" type="gray">{{user.nick}}</el-tag>
          </el-form-item>
          <el-form-item v-if="taskViewData.order.candidate_groups.length" label="候选人">
            <el-tag v-for="group in taskViewData.order.candidate_groups" :key="group.name" type="gray">{{group.name}}</el-tag>
          </el-form-item>
          <el-form-item v-if="taskViewData.order.ctime" label="创建时间">
            <span>{{taskViewData.order.ctime}}</span>
          </el-form-item>
          <el-form-item v-if="taskViewData.order.assign_time" label="认领时间">
            <span>{{taskViewData.order.assign_time}}</span>
          </el-form-item>
          <el-form-item v-if="taskViewData.order.etime" label="结束时间">
            <span>{{taskViewData.order.etime}}</span>
          </el-form-item>
        </el-form>
        <progress-wrap :progress="{
         task: taskViewData.order.ptask.tkey,
         pkey: taskViewData.order.pinstance.pkey,
         taskList: taskViewData.order.pinstance.task_list
         }"></progress-wrap>
        <h5 class="sub-title" v-if="taskViewData.order.pinstance.history_list.length"><i class="el-icon-information"></i> 完整历史步骤（{{ taskViewData.order.pinstance.history_list.length }}）</h5>
        <el-collapse v-if="taskViewData.order.pinstance.history_list.length" class="history-list">
          <el-collapse-item v-for="(task, key) in taskViewData.order.pinstance.history_list" :title="(key + 1).toString() + '. ' + task.name" :key="key">
            <el-form label-position="left" label-width="90px" inline class="expanded-form">
              <el-form-item v-if="task.task_key" label="任务 Key">
                <code>{{task.task_key}}</code>
              </el-form-item>
              <el-form-item v-if="task.operator" label="操作者">
                <span>{{task.operator.nick}}</span>
              </el-form-item>
              <el-form-item v-if="task.time" label="时间">
                <span>{{task.time}}</span>
              </el-form-item>
              <el-form-item v-if="task.workFlowNo" label="工单号">
                <span>{{task.workFlowNo}}</span>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
    <span class="dialog-footer" slot="footer">
      <router-link
        v-if="filterName === '待认领' || filterName === '指派'"
        :to="{ path: `/procedure-info/${taskViewData.order.pinstance.pid}/${taskViewData.order.ptask.tname}`, query: { tid: taskViewData.order.tid, filter: filterName }}">
        <el-button type="info" icon="more">查看</el-button>
      </router-link>
      <router-link
        v-else
        :to="{ path: `/${isGuosen ? 'guosen' : 'procedure'}${!isAssignee || isEnded ? '-info' : ''}/${taskViewData.order.pinstance.pid}${!isAssignee || isEnded ? '' : ('/' + taskViewData.order.tid)}/${taskViewData.order.ptask.tname}` }">
        <el-button :plain="true" icon="more">查看</el-button>
      </router-link>
      <!-- <router-link
        v-else-if="['host'].includes(taskViewData.order.pinstance.pkey) && filterName === '待处理'"
        :to="{ path: `/guosen/${taskViewData.order.pinstance.pkey}/${taskViewData.order.ptask.tkey}/${taskViewData.order.tid}/${taskViewData.order.ptask.tname}`}" >
        <el-button :plain="true" icon="more">查看</el-button>
      </router-link>
      <router-link
        v-else-if="['host'].includes(taskViewData.order.pinstance.pkey) && filterName === '已参与'"
        :to="{ path: `/guosen-info/${taskViewData.order.pinstance.pkey}/${taskViewData.order.ptask.tkey}/${taskViewData.order.pinstance.pid}/${taskViewData.order.ptask.tname}`} ">
        <el-button :plain="true" icon="more">查看</el-button>
      </router-link>
      <router-link
        v-else-if="['host'].includes(taskViewData.order.pinstance.pkey) && filterName === '历史参与'"
        :to="{ path: `/guosen-info/${taskViewData.order.pinstance.pkey}/${taskViewData.order.pinstance.pid}`} ">
        <el-button :plain="true" icon="more">查看</el-button>
      </router-link>
      <template v-else>
        <router-link
          v-if="filter === '待处理'"
          :to="{ path: `/procedure/${taskViewData.order.pinstance.pkey}/${taskViewData.order.ptask.tkey}/${taskViewData.order.tid}/${taskViewData.order.ptask.tname}` }">
          <el-button :plain="true" icon="more">查看</el-button>
        </router-link>
        <router-link
          v-if="filter === '已参与'"
          :to="{ path: `/procedure-info/${taskViewData.order.pinstance.pkey}/${taskViewData.order.ptask.tkey}/${taskViewData.order.pinstance.pid}/${taskViewData.order.ptask.tname}` }">
          <el-button :plain="true" icon="more">查看</el-button>
        </router-link>
        <router-link
          v-if="filter === '历史参与'"
          :to="{ path: `/procedure-info/${taskViewData.order.pinstance.pkey}/${taskViewData.order.pinstance.pid}` }">
          <el-button :plain="true" icon="more">查看</el-button>
        </router-link>
      </template> -->
    </span>
  </el-dialog>
</template>

<script>
  import progressWrap from '../../../_plugins/_progress'

  export default {
    props: {
      taskViewData: Object,
      filterName: String
    },

    computed: {
      isEnded () {
        return this.taskViewData.order.isend
      },

      isAssignee () {
        if (this.taskViewData.order.assign || this.taskViewData.order.assign_group) {
          return this.taskViewData.order.assign.userId === this.$store.state.userinfo.userId || this.$store.state.userinfo.groups.some(_ => this.taskViewData.order.assign_group.includes(_))
        } else {
          return false
        }
      },

      isGuosen () {
        return ['host', 'host_my'].includes(this.taskViewData.order.pinstance.pkey)
      }
    },

    methods: {
      onClaim (task) {
        this.$confirm(`确定认领任务「${task.ptask.tname}」吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          let postData = {
            action: 'task_assign',
            method: 'POST',
            data: { tid: task.tid }
          }
          this.http.post('/flow/', this.parseData(postData)).then((res) => {
            if (res.status === 200) {
              this.deviceViewData.visible = false
              this.$message.success('已认领！')
            }
            this.$router.replace(`/procedure/${task.pkey}/${task.taskDefinitionKey}/${task.id}/${task.name}`)
          })
        })
      }
    },

    components: {
      progressWrap
    }
  }
</script>
