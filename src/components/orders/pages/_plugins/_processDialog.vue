<template>
  <el-dialog
    :title="processViewData.order.pd.pname"
    v-model="processViewData.visible"
    size="large">
    <el-row>
      <el-col :span="20" :offset="2">
        <el-form label-position="left" inline class="expanded-form" label-width="100px">
          <el-form-item label="流程名称">
            <span>{{processViewData.order.pd.pname}}</span>
          </el-form-item>
          <el-form-item label="流程分类">
            <span>{{processViewData.order.pd.category}}</span>
          </el-form-item>
          <el-form-item label="流程 ID">
            <span>{{processViewData.order.pid}}</span>
          </el-form-item>
          <el-form-item label="流程 Key">
            <span>{{processViewData.order.pkey}}</span>
          </el-form-item>
          <el-form-item label="创建时间">
            <span>{{processViewData.order.ctime}}</span>
          </el-form-item>
          <el-form-item label="结束名称">
            <span>{{processViewData.order.etime}}</span>
          </el-form-item>
          <el-form-item v-if="processViewData.order.follows.length" label="关注者">
            <el-tag v-for="user in processViewData.order.follows" type="gray" :key="user.userId">{{user.nick}}</el-tag>
          </el-form-item>
          <el-form-item v-if="processViewData.order.involved_users.length" label="参与者">
            <el-tag v-for="user in processViewData.order.involved_users" type="gray" :key="user.userId">{{user.nick}}</el-tag>
          </el-form-item>
          <el-form-item label="结束名称">
            <span>{{processViewData.order.etime}}</span>
          </el-form-item>
          <el-form-item label="是否成功">
            <span>{{processViewData.order.success_end ? '是' : '否'}}</span>
          </el-form-item>
        </el-form>
        <!-- <progress-wrap :progress="{
         pkey: processViewData.order.pkey,
         taskList: processViewData.order.task_list
         }"></progress-wrap> -->
         <h5 class="sub-title" v-if="processViewData.order.history_list.length"><i class="el-icon-information"></i> 完整历史步骤（{{ processViewData.order.history_list.length }}）</h5>
        <el-collapse v-if="processViewData.order.history_list.length" class="history-list">
          <el-collapse-item v-for="(task, key) in processViewData.order.history_list" :key="task.tkey" :title="(key + 1).toString() + '. ' + task.name">
            <el-form label-position="left" label-width="90px" inline class="expanded-form">
              <el-form-item v-if="task.task_key" label="任务 Key：">
                <code>{{task.task_key}}</code>
              </el-form-item>
              <el-form-item v-if="task.operator" label="操作者：">
                <span>{{task.operator.nick}}</span>
              </el-form-item>
              <el-form-item v-if="task.time" label="时间：">
                <span>{{task.time}}</span>
              </el-form-item>
              <el-form-item v-if="task.workFlowNo" label="工单号：">
                <span>{{task.workFlowNo}}</span>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      processViewData: Object
    }
  }
</script>