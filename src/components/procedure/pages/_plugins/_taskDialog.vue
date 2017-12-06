<template>
  <el-dialog
    v-model="taskViewData.visible"
    size="large">
    <h3 slot="title">{{taskViewData.order.pinstance.pnum}}-{{taskViewData.order.pinstance.pd.pname}}-{{taskViewData.order.ptask.tname}}</h3>
    <el-row>
      <el-col :span="20" :offset="2">
        <el-form label-position="left" inline class="expanded-form" label-width="100px">
          <el-form-item v-if="taskViewData.order.assign" label="当前处理人">
            <span>{{taskViewData.order.assign.nick}}</span>
          </el-form-item>
          <el-form-item v-if="taskViewData.order.assign.assign_time" label="任务认领时间">
            <span>{{taskViewData.order.assign.assign_time}}</span>
          </el-form-item>
          <el-form-item v-if="taskViewData.order.pinstance.author" label="流程发起人">
            <span>{{taskViewData.order.pinstance.author.nick}}</span>
          </el-form-item>
          <el-form-item v-if="taskViewData.order.pinstance.ctime" label="流程创建时间">
            <span>{{taskViewData.order.pinstance.ctime}}</span>
          </el-form-item>
          <el-form-item v-if="taskViewData.order.candidate_groups.length" label="任务候选组">
            <el-tag v-for="group in taskViewData.order.candidate_groups" :key="group.name" type="gray">{{group.name}}</el-tag>
          </el-form-item>
          <el-form-item v-if="taskViewData.order.ctime" label="任务创建时间">
            <span>{{taskViewData.order.ctime}}</span>
          </el-form-item>
          <el-form-item v-if="taskViewData.order.candidate_users.length" label="任务候选人">
            <el-tag v-for="user in taskViewData.order.candidate_users" :key="user.userId" type="gray">{{user.nick}}</el-tag>
          </el-form-item>
        </el-form>
        <h5 class="sub-title" v-if="taskViewData.order.pinstance.history_list.length"><i class="el-icon-information"></i> 历史步骤（{{ taskViewData.order.pinstance.history_list.length }}）</h5>
        <!-- <el-collapse v-if="taskViewData.order.pinstance.history_list.length" class="history-list">
          <el-collapse-item v-for="(task, key) in taskViewData.order.pinstance.history_list" :title="(key + 1).toString() + '. ' + task.name" :key="key">
            <el-form label-position="left" label-width="90px" inline class="expanded-form">
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
        </el-collapse> -->
        <el-steps
          finish-status="finish"
          style="margin: 16px 0 12px"
          :active="taskViewData.order.pinstance.history_list.length + 1">
          <el-step
            v-for="(task, key) in taskViewData.order.pinstance.history_list"
            :title="task.name"
            :description="`${task.operator.nick} ${task.time}`"></el-step>
        </el-steps>
      </el-col>
    </el-row>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      taskViewData: Object
    }
  }
</script>
