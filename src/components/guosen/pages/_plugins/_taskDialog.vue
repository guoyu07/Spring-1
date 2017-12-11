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
      <div class="stepsContainer">
        <el-steps
          class="steps"
          finish-status="finish"
          :active="taskViewData.order.pinstance.history_list.length + 1">
          <el-step
            v-for="(task, key) in taskViewData.order.pinstance.history_list"
            :title="task.name"
            :description="`${task.operator.nick} ${task.time}`"></el-step>
        </el-steps>
      </div>
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
<style lang="less" scoped>
.stepsContainer {
  overflow-x:auto;
  margin: 16px 0 12px;
  .steps {
    min-width:1000px;
  }
}
</style>


