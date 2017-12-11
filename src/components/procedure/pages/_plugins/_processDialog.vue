<template>
  <el-dialog
    v-model="taskViewData.visible"
    size="large">
    <h3 slot="title">{{taskViewData.order.pnum}}-{{taskViewData.order.pd.pname}}</h3>
    <el-row>
      <el-col :span="20" :offset="2">
        <el-form label-position="left" inline class="expanded-form" label-width="100px">
          <el-form-item v-if="taskViewData.order.pd.author" label="流程发起人">
            <span>{{taskViewData.order.pd.author.nick}}</span>
          </el-form-item>
          <el-form-item v-if="taskViewData.order.ctime" label="流程创建时间">
            <span>{{taskViewData.order.ctime}}</span>
          </el-form-item>
        </el-form>
        <h5 class="sub-title" v-if="taskViewData.order.history_list.length"><i class="el-icon-information"></i> 历史步骤（{{ taskViewData.order.history_list.length }}）</h5>
        <el-steps
          finish-status="finish"
          style="margin: 16px 0 12px"
          :active="taskViewData.order.history_list.length + 1">
          <el-step
            v-for="(task, key) in taskViewData.order.history_list"
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
